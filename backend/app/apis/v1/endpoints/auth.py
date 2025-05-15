from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm # For standard login form
from sqlalchemy.ext.asyncio import AsyncSession

from app.core import security
from app.core.config import settings
from app.core.deps import get_db_session, get_current_active_user
from app.crud import user as crud_user
from app.models.user import User as DBUser # Rename to avoid conflict with schema.User
from app.schemas import user as user_schema # Use alias for schemas
from app.schemas import token as token_schema # Use alias for token schemas

router = APIRouter()

@router.post("/register", response_model=user_schema.UserWithToken)
async def register_new_user(
    user_in: user_schema.UserCreate,
    db: AsyncSession = Depends(get_db_session)
):
    """
    Create new user and return user info and access token.
    """
    db_user_by_email = await crud_user.get_user_by_email(db, email=user_in.email)
    if db_user_by_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    db_user_by_username = await crud_user.get_user_by_username(db, username=user_in.username)
    if db_user_by_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    created_user = await crud_user.create_user(db=db, user_in=user_in)
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=created_user.username, expires_delta=access_token_expires
    )
    
    # Manually construct the User schema from the DBUser model for the response
    response_user = user_schema.User.model_validate(created_user)

    return {
        "user": response_user,
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.post("/login", response_model=user_schema.UserWithToken)
async def login_for_access_token(
    # form_data: OAuth2PasswordRequestForm = Depends(), # Use OAuth2 form for username/password
    user_credentials: user_schema.UserLogin, # Receive JSON payload directly as request body
    db: AsyncSession = Depends(get_db_session)
):
    """
    Authenticate user and return user info and access token.
    Username from user_credentials can be actual username or email.
    """
    # Try to get user by username, then by email if not found by username
    user = await crud_user.get_user_by_username(db, username=user_credentials.username)
    if not user:
        # Assuming username field in UserLogin can also be an email address
        user = await crud_user.get_user_by_email(db, email=user_credentials.username)
        if not user:
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect username or password",
                headers={"WWW-Authenticate": "Bearer"},
            )

    if not user or not security.verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")

    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        subject=user.username, expires_delta=access_token_expires # Use username as subject
    )
    
    response_user = user_schema.User.model_validate(user)

    return {
        "user": response_user,
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me", response_model=user_schema.User) # As per frontend, response is { user: User }
async def read_users_me(
    current_user: DBUser = Depends(get_current_active_user) # Use DBUser type hint
):
    """
    Fetch the current logged in user.
    """
    # current_user is already a DBUser model instance from get_current_active_user
    # Pydantic will automatically convert it to user_schema.User based on response_model
    return current_user # FastAPI will convert this to user_schema.User using from_attributes 