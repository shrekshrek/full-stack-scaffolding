import asyncio
from typing import AsyncGenerator, Generator

import pytest
import pytest_asyncio # Required for async fixtures
from httpx import AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.main import app # Import your FastAPI app
from app.core.config import get_settings
from app.core.db import Base, get_db_session # Import Base and get_db_session
# from app.core.redis_client import get_redis_client, close_redis_pool # If you need to manage Redis for tests
# from app.models import User # Example: Import your models if needed for test data

settings = get_settings()

# Create a new SQLite database URL for testing if not already configured for test
# It's crucial that tests run on a separate, temporary database.
# DATABASE_URL_TEST = settings.DATABASE_URL + "_test" # Simple way if using PostgreSQL
DATABASE_URL_TEST = "sqlite+aiosqlite:///./test.db" # For SQLite, ensure it's a test-specific file

engine_test = create_async_engine(DATABASE_URL_TEST, echo=False) # echo=False for cleaner test output
SessionTesting = sessionmaker(
    autocommit=False, 
    autoflush=False, 
    bind=engine_test, 
    class_=AsyncSession, 
    expire_on_commit=False
)

@pytest_asyncio.fixture(scope="session")
def event_loop() -> Generator:
    """Create an instance of the default event loop for each test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest_asyncio.fixture(scope="session", autouse=True)
async def setup_test_database():
    """Create test database tables before tests run, and drop them after."""
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    # await close_redis_pool() # If redis pool was initialized for tests

@pytest_asyncio.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """Yield a new database session for each test function, rolling back changes after."""
    async with SessionTesting() as session:
        await session.begin_nested() # Use nested transactions for rollback
        yield session
        await session.rollback() # Ensure test isolation

@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Get a TestClient instance that uses the test_db session."""
    
    def override_get_db_session() -> AsyncGenerator[AsyncSession, None]:
        yield db_session
        
    app.dependency_overrides[get_db_session] = override_get_db_session
    
    # If you use Redis and want to mock/override its dependency for tests:
    # def override_get_redis_client():
    #     # return mock_redis_client or a test-specific redis instance
    # app.dependency_overrides[get_redis_client] = override_get_redis_client

    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac
    
    # Clean up dependency overrides after test
    app.dependency_overrides.clear()

# Example fixture for creating a test user (if you have a User model)
# @pytest_asyncio.fixture(scope="function")
# async def test_user(db_session: AsyncSession) -> User:
#     from app.crud.user import user as crud_user
#     from app.schemas.user import UserCreate
#     from app.core.security import get_password_hash
#     user_in = UserCreate(
#         email="test@example.com", 
#         password=get_password_hash("testpassword"), 
#         full_name="Test User"
#     )
#     return await crud_user.create(db=db_session, obj_in=user_in) 