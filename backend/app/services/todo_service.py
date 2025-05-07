from typing import List, Optional

from sqlalchemy.orm import Session

from ..models.todo import Todo
from ..schemas.todo import TodoCreate, TodoUpdate
from ..repositories.todo_repository import TodoRepository


def get_todos(db: Session, skip: int = 0, limit: int = 100) -> List[Todo]:
    """获取所有待办事项（管理员功能）"""
    # 使用仓储层进行数据访问
    result = db.query(Todo).offset(skip).limit(limit).all()
    return result


def get_user_todos(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Todo]:
    """获取用户的所有待办事项"""
    # 使用仓储层进行数据访问
    result = db.query(Todo).filter(Todo.owner_id == user_id).offset(skip).limit(limit).all()
    return result


def create(db: Session, todo_create: TodoCreate, user_id: int) -> Todo:
    """创建新的待办事项"""
    # 使用仓储层创建待办事项
    todo = Todo(
        owner_id=user_id,
        title=todo_create.title,
        description=todo_create.description,
        completed=todo_create.completed
    )
    db.add(todo)
    db.commit()
    db.refresh(todo)
    return todo


def update(db: Session, todo_id: int, todo_update: TodoUpdate) -> Optional[Todo]:
    """更新待办事项"""
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if todo is None:
        return None
        
    update_data = todo_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(todo, key, value)
        
    db.commit()
    db.refresh(todo)
    return todo


def delete(db: Session, todo_id: int) -> bool:
    """删除待办事项"""
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if todo is None:
        return False
        
    db.delete(todo)
    db.commit()
    return True


def check_todo_exists_and_belongs_to_user(db: Session, todo_id: int, user_id: int) -> bool:
    """检查待办事项是否存在且属于指定用户"""
    todo = db.query(Todo).filter(Todo.id == todo_id, Todo.owner_id == user_id).first()
    return todo is not None 