from datetime import datetime, timedelta, timezone
from typing import Union, Any, Optional

from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from pydantic import ValidationError

from app.core.config import get_settings
from app.schemas.token import TokenPayload

settings = get_settings()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# OAuth2 scheme for token authentication
# tokenUrl should point to your token generation endpoint (e.g., /api/v1/auth/login)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")

ALGORITHM = settings.ALGORITHM

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# Placeholder for create_refresh_token if needed
# def create_refresh_token(
#     subject: Union[str, Any], expires_delta: timedelta = None
# ) -> str:
#     if expires_delta:
#         expire = datetime.utcnow() + expires_delta
#     else:
#         expire = datetime.utcnow() + timedelta(
#             minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES
#         )
#     to_encode = {"exp": expire, "sub": str(subject), "type": "refresh"}
#     encoded_jwt = jwt.encode(to_encode, settings.REFRESH_SECRET_KEY, algorithm=ALGORITHM) # Use a different secret for refresh tokens
#     return encoded_jwt 

async def decode_token(token: str) -> Optional[TokenPayload]:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[ALGORITHM])
        token_data = TokenPayload(sub=payload.get("sub"))
        if token_data.sub is None:
            return None
        return token_data
    except (JWTError, ValidationError):
        return None 