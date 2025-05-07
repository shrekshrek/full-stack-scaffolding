from typing import Optional
from pydantic import BaseModel, EmailStr

# 共享属性
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False

# 创建用户时的数据
class UserCreate(UserBase):
    email: EmailStr
    password: str
    username: str

# 更新用户时的数据
class UserUpdate(UserBase):
    password: Optional[str] = None

# 数据库中存储的用户数据
class UserInDBBase(UserBase):
    id: Optional[int] = None

    class Config:
        from_attributes = True

# API返回的用户数据
class User(UserInDBBase):
    pass

# 数据库存储的用户(包含密码)
class UserInDB(UserInDBBase):
    hashed_password: str 