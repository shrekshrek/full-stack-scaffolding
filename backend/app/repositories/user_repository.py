from typing import Optional, List
from sqlalchemy.orm import Session
from ..models.user import User
from ..schemas.user import UserCreate, UserUpdate
from ..core.security import get_password_hash
from ..services.db import BaseRepository

class UserRepository(BaseRepository):
    """用户仓储类，处理用户相关的数据访问逻辑"""
    model = User
    
    def get_by_email(self, email: str) -> Optional[User]:
        """通过邮箱获取用户"""
        return self.db.query(User).filter(User.email == email).first()
    
    def get_by_username(self, username: str) -> Optional[User]:
        """通过用户名获取用户"""
        return self.db.query(User).filter(User.username == username).first()
    
    def create_with_password(self, user_data: UserCreate) -> User:
        """创建新用户（包括哈希密码处理）"""
        db_user = User(
            email=user_data.email,
            username=user_data.username,
            hashed_password=get_password_hash(user_data.password),
            is_active=True,
            is_superuser=False,
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user
    
    def update_password(self, user_id: int, new_password: str) -> Optional[User]:
        """更新用户密码"""
        user = self.get(user_id)
        if not user:
            return None
        
        user.hashed_password = get_password_hash(new_password)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def get_active_users(self) -> List[User]:
        """获取所有活跃用户"""
        return self.db.query(User).filter(User.is_active == True).all()
    
    def deactivate(self, user_id: int) -> Optional[User]:
        """停用用户账户"""
        user = self.get(user_id)
        if not user:
            return None
        
        user.is_active = False
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def activate(self, user_id: int) -> Optional[User]:
        """激活用户账户"""
        user = self.get(user_id)
        if not user:
            return None
        
        user.is_active = True
        self.db.commit()
        self.db.refresh(user)
        return user 