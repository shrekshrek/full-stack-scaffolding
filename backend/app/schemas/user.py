from pydantic import BaseModel, EmailStr, model_validator # model_validator for Pydantic v2
from typing import Optional, List

# Shared properties
class UserBase(BaseModel):
    email: EmailStr
    username: str
    is_active: Optional[bool] = True
    is_superuser: Optional[bool] = False
    nickname: Optional[str] = None
    avatar_url: Optional[str] = None
    roles: Optional[List[str]] = None
    permissions: Optional[List[str]] = None

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str

# Properties to receive via API on update (example, can be more specific with Patch models)
class UserUpdate(UserBase):
    password: Optional[str] = None # Allow password to be optional on update

# Properties to receive on login
class UserLogin(BaseModel):
    username: str # Can be username or email, handled in auth logic
    password: str

# Properties stored in DB (not directly used as API response model here if User is used)
class UserInDBBase(UserBase):
    id: int
    hashed_password: str
    # Pydantic v2 uses model_config for ORM mode
    model_config = {
        "from_attributes": True
    }

# Additional properties to return to client (this is the main User schema for API responses)
class User(UserBase):
    id: int
    model_config = {
        "from_attributes": True # For ORM mode / mapping from SQLAlchemy model
    }

# Schema for responses that include the user and their access token (as per frontend expectation)
class UserWithToken(BaseModel):
    user: User
    access_token: str
    token_type: str = "bearer" 