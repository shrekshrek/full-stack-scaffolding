from typing import Optional
from pydantic import BaseModel


class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False


class TodoCreate(TodoBase):
    pass


class TodoUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    completed: Optional[bool] = None


class TodoInDB(TodoBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True


class Todo(TodoInDB):
    pass 