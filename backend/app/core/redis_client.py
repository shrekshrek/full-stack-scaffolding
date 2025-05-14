import redis.asyncio as redis # Use redis.asyncio for redis-py >= 4.2
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from app.core.config import get_settings

settings = get_settings()

_redis_pool = None

def get_redis_pool_instance() -> redis.ConnectionPool:
    """Initializes and returns the Redis connection pool instance."""
    global _redis_pool
    if _redis_pool is None:
        # For redis-py 5.x, from_url creates an AsyncConnectionPool if redis.asyncio is used
        _redis_pool = redis.ConnectionPool.from_url(
            f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}",
            password=settings.REDIS_PASSWORD,
            decode_responses=True,  # Decode responses to str by default
            max_connections=10 # Example: configure max connections
        )
    return _redis_pool

@asynccontextmanager
async def get_redis_client() -> AsyncGenerator[redis.Redis, None]:
    """Provides an asynchronous Redis client from the connection pool."""
    pool = get_redis_pool_instance()
    # Each call to redis.Redis(connection_pool=pool) gets a connection from the pool
    client = redis.Redis(connection_pool=pool)
    try:
        yield client
    finally:
        # With redis.asyncio and a connection pool, closing the client typically
        # returns the connection to the pool. Explicit close is good practice.
        await client.aclose()

# FastAPI dependency to get a Redis client
async def get_redis() -> AsyncGenerator[redis.Redis, None]:
    async with get_redis_client() as client:
        yield client

# Optional: Function to close the pool on app shutdown
async def close_redis_pool():
    global _redis_pool
    if _redis_pool:
        # For redis.asyncio.ConnectionPool (which from_url should return when using redis.asyncio)
        # use .disconnect() or .aclose() if available for the pool object itself.
        # As of redis-py 5.x, the pool is an instance of AsyncConnectionPool.
        # Explicitly call disconnect on the pool object.
        await _redis_pool.disconnect() 
        _redis_pool = None

# Example usage in main.py for startup/shutdown:
# from app.core.redis_client import get_redis_pool_instance, close_redis_pool
#
# @app.on_event("startup")
# async def startup_event():
#     get_redis_pool_instance()  # Initialize the pool on startup
#     # Potentially ping Redis to ensure connection
#     try:
#         async with get_redis_client() as client:
#             await client.ping()
#         print("Successfully connected to Redis and pinged.")
#     except Exception as e:
#         print(f"Could not connect to Redis: {e}")
#
# @app.on_event("shutdown")
# async def shutdown_event():
#     await close_redis_pool()
#     print("Redis connection pool closed.") 