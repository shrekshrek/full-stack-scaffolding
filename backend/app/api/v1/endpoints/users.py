from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ....models.user import User
from ....schemas.user import User as UserSchema, UserCreate, UserUpdate
from ....services import user_service
from ...deps import get_current_active_superuser, get_current_user, get_db

router = APIRouter()

@router.get("/me", response_model=UserSchema)
def read_user_me(
    current_user: User = Depends(get_current_user),
) -> Any:
    """获取当前登录用户"""
    return current_user

@router.post("/", response_model=UserSchema)
def create_user(
    *,
    db: Session = Depends(get_db),
    user_in: UserCreate,
) -> Any:
    """创建新用户"""
    user = user_service.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="此邮箱已注册",
        )
    user = user_service.create(db, user_data=user_in)
    return user

@router.get("/", response_model=List[UserSchema])
def read_users(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_active_superuser),
) -> Any:
    """获取用户列表(仅超级管理员)"""
    users = db.query(User).offset(skip).limit(limit).all()
    return users 