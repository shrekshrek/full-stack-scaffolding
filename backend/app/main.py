from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.apis.v1 import api_router as api_v1_router # Ensure this matches the actual import path
# from app.apis.v1 import api_router as api_v1_router # Placeholder
from app.core.config import get_settings
from app.core.redis_client import get_redis_pool_instance, close_redis_pool # For startup/shutdown

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_v1_router, prefix=settings.API_V1_STR)

@app.get("/api/health")
def health_check():
    return {"status": "OK"}

@app.on_event("startup")
async def startup_event():
    print("Starting up application...")
    get_redis_pool_instance()  # Initialize Redis pool
    # You can add a ping to Redis here if desired, as shown in redis_client.py comments
    print("Redis pool initialized.")
    # from app.core.db import init_db # If you have an init_db function
    # await init_db()
    # print("Database initialized.")

@app.on_event("shutdown")
async def shutdown_event():
    print("Shutting down application...")
    await close_redis_pool()
    print("Redis connection pool closed.")

# Add startup/shutdown events if needed
# @app.on_event("startup")
# async def startup_event():
#     # Initialize DB, Redis, etc.
#     pass

# @app.on_event("shutdown")
# async def shutdown_event():
#     # Close DB, Redis connections, etc.
#     pass 