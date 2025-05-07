from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from app.models.todo import Todo
from app.schemas.todo import TodoCreate, TodoUpdate


class TodoRepository:
    """
    Todo数据访问仓储类，负责所有与Todo模型相关的数据库操作
    """

    def __init__(self, db_session: Session):
        self.db_session = db_session

    def get_by_id(self, todo_id: int) -> Optional[Todo]:
        """根据ID获取单个待办事项"""
        return self.db_session.query(Todo).filter(Todo.id == todo_id).first()

    def get_by_user_id(self, user_id: int) -> List[Todo]:
        """获取用户的所有待办事项"""
        return self.db_session.query(Todo).filter(Todo.owner_id == user_id).order_by(Todo.id).all()

    def create(self, user_id: int, todo_create: TodoCreate) -> Todo:
        """创建新的待办事项"""
        todo = Todo(
            owner_id=user_id,
            title=todo_create.title,
            description=todo_create.description,
            completed=todo_create.completed if todo_create.completed is not None else False
        )
        self.db_session.add(todo)
        self.db_session.commit()
        self.db_session.refresh(todo)
        return todo

    def update(self, todo_id: int, todo_update: TodoUpdate) -> Optional[Todo]:
        """更新待办事项"""
        todo = self.get_by_id(todo_id)
        if not todo:
            return None
            
        update_data = todo_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(todo, key, value)
            
        self.db_session.commit()
        self.db_session.refresh(todo)
        return todo

    def delete(self, todo_id: int) -> bool:
        """删除待办事项"""
        todo = self.get_by_id(todo_id)
        if not todo:
            return False
            
        self.db_session.delete(todo)
        self.db_session.commit()
        return True

    def exists(self, todo_id: int, user_id: int) -> bool:
        """检查待办事项是否存在且属于指定用户"""
        return self.db_session.query(Todo).filter(
            Todo.id == todo_id, 
            Todo.owner_id == user_id
        ).first() is not None 