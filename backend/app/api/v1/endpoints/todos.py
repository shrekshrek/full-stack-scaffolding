from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ....models.user import User
from ....schemas.todo import Todo, TodoCreate, TodoUpdate
from ....services import todo_service
from ...deps import get_current_user, get_db

router = APIRouter()


@router.get("/", response_model=List[Todo])
def read_todos(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """获取当前用户的所有待办事项"""
    todos = todo_service.get_user_todos(db, current_user.id, skip=skip, limit=limit)
    return todos


@router.post("/", response_model=Todo)
def create_todo(
    todo: TodoCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """创建新待办事项"""
    return todo_service.create(db, todo, current_user.id)


@router.get("/{todo_id}", response_model=Todo)
def read_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """获取单个待办事项"""
    # 检查待办事项是否存在并属于当前用户
    if not todo_service.check_todo_exists_and_belongs_to_user(db, todo_id, current_user.id):
        raise HTTPException(status_code=404, detail="待办事项不存在")
        
    todo = db.query(Todo).filter(Todo.id == todo_id).first()
    return todo


@router.put("/{todo_id}", response_model=Todo)
def update_todo(
    todo_id: int,
    todo_update: TodoUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """更新待办事项"""
    # 检查待办事项是否存在并属于当前用户
    if not todo_service.check_todo_exists_and_belongs_to_user(db, todo_id, current_user.id):
        raise HTTPException(status_code=404, detail="待办事项不存在")
        
    updated_todo = todo_service.update(db, todo_id, todo_update)
    if updated_todo is None:
        raise HTTPException(status_code=404, detail="待办事项不存在")
        
    return updated_todo


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_todo(
    todo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """删除待办事项"""
    # 检查待办事项是否存在并属于当前用户
    if not todo_service.check_todo_exists_and_belongs_to_user(db, todo_id, current_user.id):
        raise HTTPException(status_code=404, detail="待办事项不存在")
        
    success = todo_service.delete(db, todo_id)
    if not success:
        raise HTTPException(status_code=404, detail="待办事项不存在") 