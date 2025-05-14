from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.core.config import get_settings

settings = get_settings()

# Create async engine instance
engine = create_async_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True, # Good practice for checking connections
    # echo=True, # Uncomment for SQLAlchemy Core & ORM logging, can be verbose
)

# Create sessionmaker instance for async sessions
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False, # Good default for FastAPI to prevent issues with related objects
)

# If you need to initialize the database (e.g., create tables for the first time)
# you can create a function here and call it from main.py on startup, or use Alembic.
# Example (ensure your models are imported, typically via Base.metadata.create_all):
# from app.models.base import Base  # Assuming your Base is defined here
# async def init_db():
#     async with engine.begin() as conn:
#         # await conn.run_sync(Base.metadata.drop_all) # Use with caution!
#         await conn.run_sync(Base.metadata.create_all) 