from fastapi import APIRouter

from app.apis.v1.endpoints import auth # Import your endpoint modules here
# from app.apis.v1.endpoints import users # Example for other endpoints

api_router_v1 = APIRouter()

api_router_v1.include_router(auth.router, prefix="/auth", tags=["Authentication"]) # Add auth router
# api_router_v1.include_router(users.router, prefix="/users", tags=["Users"]) # Example for other routers

# This v1 router will be included in the main app instance 