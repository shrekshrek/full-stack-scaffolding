import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.services.db import Base, get_db


# 使用内存SQLite数据库进行测试
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    # 创建数据库表
    Base.metadata.create_all(bind=engine)
    
    # 使用会话
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
    
    # 测试完成后清理
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    # 覆盖依赖
    def override_get_db():
        try:
            yield db
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides = {} 