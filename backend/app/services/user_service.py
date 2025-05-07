from typing import Optional, Dict, Any
import re
from sqlalchemy.orm import Session
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate
from ..core.security import get_password_hash, verify_password
from ..core.config import settings

def get_by_email(db: Session, email: str) -> Optional[User]:
    """通过邮箱获取用户"""
    return db.query(User).filter(User.email == email).first()

def get_by_id(db: Session, user_id: int) -> Optional[User]:
    """通过ID获取用户"""
    return db.query(User).filter(User.id == user_id).first()

# 别名方法，与get_by_id相同
def get(db: Session, id: int) -> Optional[User]:
    """通过ID获取用户（别名方法）"""
    return get_by_id(db, user_id=id)

def create(db: Session, user_data: UserCreate) -> User:
    """创建新用户"""
    # 验证密码强度
    validate_password(user_data.password)
    
    db_user = User(
        email=user_data.email,
        username=user_data.username,
        hashed_password=get_password_hash(user_data.password),
        is_active=True,
        is_superuser=False,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate(db: Session, email: str, password: str) -> Optional[User]:
    """验证用户身份"""
    user = get_by_email(db, email=email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def validate_password(password: str) -> Dict[str, Any]:
    """验证密码强度"""
    errors = []
    
    if len(password) < settings.PASSWORD_MIN_LENGTH:
        errors.append(f"密码长度不能少于{settings.PASSWORD_MIN_LENGTH}个字符")
    
    if settings.PASSWORD_REQUIRE_UPPERCASE and not any(c.isupper() for c in password):
        errors.append("密码必须包含至少一个大写字母")
    
    if settings.PASSWORD_REQUIRE_DIGITS and not any(c.isdigit() for c in password):
        errors.append("密码必须包含至少一个数字")
    
    if settings.PASSWORD_REQUIRE_SPECIAL and not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append("密码必须包含至少一个特殊字符")
    
    return {"valid": len(errors) == 0, "errors": errors} 