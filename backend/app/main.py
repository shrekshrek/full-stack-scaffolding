from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.apis.v1 import api_router_v1 # Use the correct variable name from apis/v1/__init__.py
from app.core.config import settings # Import settings directly
# from app.core.redis_client import get_redis_pool_instance, close_redis_pool # For startup/shutdown

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    version="0.1.0" # Added version
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS, # Directly use the list from settings
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router_v1, prefix=settings.API_V1_STR)

@app.get("/api/health") # Keep a simple health check outside API version prefix
async def health_check(): # Make it async
    return {"status": "OK"}

# Comment out Redis related startup/shutdown for now
# @app.on_event("startup")
# async def startup_event():
#     print("Starting up application...")
#     # get_redis_pool_instance()  # Initialize Redis pool
#     # print("Redis pool initialized.")
#     # from app.core.db import init_db # If you have an init_db function
#     # await init_db()
#     # print("Database initialized.")

# @app.on_event("shutdown")
# async def shutdown_event():
#     print("Shutting down application...")
#     # await close_redis_pool()
#     # print("Redis connection pool closed.") 