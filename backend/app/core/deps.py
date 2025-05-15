from typing import AsyncGenerator, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
# from redis.asyncio import Redis as AsyncRedis # For redis-py

from app.core.db import SessionLocal, engine # Assuming SessionLocal and engine are defined in db.py
# from app.core.redis_client import get_redis_connection # Assuming this function exists
from app.core.config import settings
from app.core import security # Import the security module
from app.models.user import User
from app.crud import user as crud_user # Alias crud.user to avoid naming conflict
from app.schemas.token import TokenPayload

# Define oauth2_scheme here, pointing to the actual login URL
# The tokenUrl should match the path operation of your login endpoint
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login" 
)

# settings = get_settings()

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session

# async def get_redis_client() -> AsyncGenerator[AsyncRedis, None]:
#     async with get_redis_connection() as redis_client:
#         yield redis_client

# class TokenData(BaseModel):
#     username: str | None = None

async def get_current_user(
    db: AsyncSession = Depends(get_db_session),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    token_payload = await security.decode_token(token) # Use the new decode_token function
    if token_payload is None or token_payload.sub is None:
        raise credentials_exception
    
    # Assuming 'sub' in token payload is the username
    # If 'sub' is user_id, you would use crud_user.get_user_by_id
    user = await crud_user.get_user_by_username(db, username=token_payload.sub)
    
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    if not current_user.is_active:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Inactive user")
    return current_user

# Optional: Dependency for superuser
# async def get_current_active_superuser(
#     current_user: User = Depends(get_current_active_user),
# ) -> User:
#     if not current_user.is_superuser:
#         raise HTTPException(
#             status_code=status.HTTP_403_FORBIDDEN, detail="The user doesn\'t have enough privileges"
#         )
#     return current_user 