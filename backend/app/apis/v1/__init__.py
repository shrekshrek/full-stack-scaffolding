from fastapi import APIRouter

# Import your endpoint modules here when they are created
# from .endpoints import auth, users, ai_service # Example

api_router = APIRouter()

# Include routers from endpoint modules
# api_router.include_router(auth.router, tags=["Authentication"], prefix="/auth")
# api_router.include_router(users.router, tags=["Users"], prefix="/users")
# api_router.include_router(ai_service.router, tags=["AI Service"], prefix="/ai")

# This v1 router will be included in the main app instance 