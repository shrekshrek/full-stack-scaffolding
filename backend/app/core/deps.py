from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
# from redis.asyncio import Redis as AsyncRedis # For redis-py

from app.core.db import SessionLocal, engine # Assuming SessionLocal and engine are defined in db.py
# from app.core.redis_client import get_redis_connection # Assuming this function exists
# from app.core.security import oauth2_scheme # Assuming this is defined
# from fastapi import Depends, HTTPException, status
# from jose import jwt, JWTError
# from pydantic import BaseModel
# from app.core.config import get_settings
# from app.models.user import User # Assuming User model exists
# from app.crud.user import user as crud_user # Assuming user CRUD exists

# settings = get_settings()

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with SessionLocal() as session:
        yield session

# async def get_redis_client() -> AsyncGenerator[AsyncRedis, None]:
#     async with get_redis_connection() as redis_client:
#         yield redis_client

# class TokenData(BaseModel):
#     username: str | None = None

# async def get_current_user(
#     db: AsyncSession = Depends(get_db_session),
#     token: str = Depends(oauth2_scheme)
# ) -> User:
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(
#             token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
#         )
#         username: str = payload.get("sub")
#         if username is None:
#             raise credentials_exception
#         token_data = TokenData(username=username)
#     except JWTError:
#         raise credentials_exception
#     user = await crud_user.get_by_email(db, email=token_data.username) # Adjust if username is not email
#     if user is None:
#         raise credentials_exception
#     return user

# async def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
#     if not current_user.is_active:
#         raise HTTPException(status_code=400, detail="Inactive user")
#     return current_user

# async def get_current_active_superuser(
#     current_user: User = Depends(get_current_active_user),
# ) -> User:
#     if not current_user.is_superuser:
#         raise HTTPException(
#             status_code=403,
#             detail="The user doesn't have enough privileges"
#         )
#     return current_user 