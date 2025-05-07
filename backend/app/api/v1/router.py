from fastapi import APIRouter
from .endpoints import auth, users, todos

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["认证"])
api_router.include_router(users.router, prefix="/users", tags=["用户"])
api_router.include_router(todos.router, prefix="/todos", tags=["待办事项"]) 