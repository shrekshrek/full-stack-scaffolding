import os
import sys
from sqlalchemy import inspect
from sqlalchemy.orm import Session

# 添加父目录到路径以便导入
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.db import engine, Base
from app.models.user import User
from app.models.todo import Todo
from app.core.security import get_password_hash
from app.core.config import settings

def init_db():
    """初始化数据库，创建表并添加管理员用户"""
    # 创建所有表
    Base.metadata.create_all(bind=engine)
    
    # 创建数据库会话
    db = Session(engine)
    
    # 检查是否已存在用户
    admin_exists = db.query(User).filter(User.email == "admin@example.com").first() is not None
    
    if not admin_exists:
        # 创建默认管理员用户
        admin_user = User(
            email="admin@example.com",
            username="admin",
            hashed_password=get_password_hash("admin123"),
            is_superuser=True,
        )
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        # 为管理员创建一个示例待办事项
        sample_todo = Todo(
            title="欢迎使用Todo应用",
            description="这是一个示例待办事项。您可以添加、编辑或删除您的待办事项。",
            completed=False,
            owner_id=admin_user.id
        )
        db.add(sample_todo)
        db.commit()
    
    db.close()
    print("数据库初始化完成。")

if __name__ == "__main__":
    init_db() 