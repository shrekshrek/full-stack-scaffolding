# 后端开发指南

本文档详细说明后端项目的开发规范、技术栈和最佳实践。

## 目录

- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [开发规范](#开发规范)
- [API 设计](#api-设计)
- [数据库设计](#数据库设计)
- [认证授权](#认证授权)
- [错误处理](#错误处理)
- [测试指南](#测试指南)
- [性能优化](#性能优化)
- [工具脚本](#工具脚本)
- [数据库迁移](#数据库迁移)

## 技术栈

- FastAPI
- SQLAlchemy
- Pydantic
- Alembic
- PostgreSQL
- Redis
- JWT
- pytest

## 项目结构

```
backend/
├── app/
│   ├── api/           # API 路由
│   ├── core/          # 核心配置
│   ├── db/            # 数据库
│   ├── models/        # 数据模型
│   ├── schemas/       # Pydantic 模型
│   ├── services/      # 业务逻辑
│   └── utils/         # 工具函数
├── data/             # 数据文件目录
│   ├── .gitkeep     # 保持目录存在
│   └── *.db         # SQLite数据库文件
├── scripts/           # 工具脚本
│   ├── setup_env_files.py    # 环境配置生成
│   ├── check_env.py          # 环境检查
│   ├── download_static_files.py  # 静态文件下载
│   └── gen_secrets.py        # 密钥生成
├── tests/             # 测试文件
├── alembic/           # 数据库迁移
└── main.py           # 应用入口
```

## 开发规范

### 1. 代码风格

```python
# 导入顺序
import os
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse

# 路由定义
router = APIRouter()

@router.post("/users/", response_model=UserResponse)
async def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
) -> UserResponse:
    """
    创建新用户
    
    Args:
        user: 用户创建数据
        db: 数据库会话
        
    Returns:
        创建的用户信息
    """
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
```

### 2. 命名规范

- 文件名：小写字母，下划线分隔
- 类名：大驼峰命名
- 函数名：小写字母，下划线分隔
- 变量名：小写字母，下划线分隔
- 常量名：大写字母，下划线分隔

### 3. 注释规范

```python
def calculate_total(items: List[Item]) -> float:
    """
    计算商品总价
    
    Args:
        items: 商品列表
        
    Returns:
        总价
        
    Raises:
        ValueError: 当商品列表为空时
    """
    if not items:
        raise ValueError("商品列表不能为空")
    return sum(item.price for item in items)
```

## API 设计

### 1. RESTful API 规范

- 使用 HTTP 方法表示操作
- 使用复数名词表示资源
- 使用查询参数进行过滤
- 使用状态码表示结果

```python
@router.get("/users/", response_model=List[UserResponse])
async def list_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
) -> List[UserResponse]:
    """获取用户列表"""
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: Session = Depends(get_db)
) -> UserResponse:
    """获取指定用户"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")
    return user
```

### 2. 请求验证

```python
from pydantic import BaseModel, EmailStr, constr

class UserCreate(BaseModel):
    email: EmailStr
    password: constr(min_length=8)
    name: constr(min_length=2, max_length=50)
    
    class Config:
        schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "password123",
                "name": "John Doe"
            }
        }
```

## 数据库设计

### 1. 模型定义

```python
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func

from app.db.base_class import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

### 2. 数据库配置

#### SQLite 配置
在开发环境中，我们使用 SQLite 数据库，数据库文件存储在 `data` 目录下：

```python
# app/core/config.py
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"

# 确保数据目录存在
DATA_DIR.mkdir(exist_ok=True)

# SQLite 数据库 URL
SQLITE_DATABASE_URL = f"sqlite:///{DATA_DIR}/app.db"
```

#### PostgreSQL 配置
在生产环境中，我们使用 PostgreSQL 数据库：

```python
# 生产环境数据库 URL
POSTGRES_DATABASE_URL = "postgresql://user:password@localhost:5432/dbname"
```

### 3. 数据库初始化

```python
# app/db/init_db.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.db.base import Base

def init_db():
    """初始化数据库"""
    engine = create_engine(settings.DATABASE_URL)
    Base.metadata.create_all(bind=engine)
    
    # 创建会话工厂
    SessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine
    )
    return SessionLocal()
```

## 认证授权

### 1. JWT 认证

```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt

def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """创建访问令牌"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    return encoded_jwt
```

### 2. 权限控制

```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """获取当前用户"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="无效的认证凭据",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    return user
```

## 错误处理

### 1. 异常处理

```python
from fastapi import HTTPException
from starlette.requests import Request
from starlette.responses import JSONResponse

async def http_exception_handler(
    request: Request,
    exc: HTTPException
) -> JSONResponse:
    """HTTP 异常处理器"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "code": exc.status_code,
            "message": exc.detail
        }
    )
```

### 2. 业务异常

```python
class BusinessError(Exception):
    """业务异常基类"""
    def __init__(
        self,
        code: int,
        message: str,
        data: Optional[dict] = None
    ):
        self.code = code
        self.message = message
        self.data = data
        super().__init__(message)

class UserNotFoundError(BusinessError):
    """用户不存在异常"""
    def __init__(self, user_id: int):
        super().__init__(
            code=404,
            message=f"用户 {user_id} 不存在"
        )
```

## 测试指南

### 1. 单元测试

```python
# tests/test_user.py
import pytest
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.main import app
from app.models.user import User

def test_create_user(client: TestClient, db: Session):
    """测试创建用户"""
    response = client.post(
        "/users/",
        json={
            "email": "test@example.com",
            "password": "password123",
            "name": "Test User"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["name"] == "Test User"
```

### 2. 集成测试

```python
# tests/integration/test_auth.py
def test_login(client: TestClient, db: Session):
    """测试用户登录"""
    # 创建测试用户
    user = User(
        email="test@example.com",
        hashed_password=get_password_hash("password123"),
        name="Test User"
    )
    db.add(user)
    db.commit()
    
    # 测试登录
    response = client.post(
        "/token",
        data={
            "username": "test@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
```

## 性能优化

### 1. 数据库优化

```python
# 使用索引
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    name = Column(String, index=True)

# 使用连接池
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

engine = create_engine(
    settings.DATABASE_URL,
    poolclass=QueuePool,
    pool_size=5,
    max_overflow=10
)
```

### 2. 缓存优化

```python
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis

async def setup_cache():
    """设置缓存"""
    redis = aioredis.from_url(
        settings.REDIS_URL,
        encoding="utf8",
        decode_responses=True
    )
    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")

@router.get("/users/{user_id}")
@cache(expire=60)
async def get_user(user_id: int):
    """获取用户信息（带缓存）"""
    return await user_service.get_user(user_id)
```

## 最佳实践

### 1. 代码组织

- 使用依赖注入
- 遵循单一职责原则
- 保持代码简洁
- 编写清晰的文档

### 2. 安全实践

- 使用参数验证
- 实现速率限制
- 保护敏感信息
- 使用安全的依赖

### 3. 可维护性

- 编写单元测试
- 使用类型注解
- 遵循代码规范
- 保持文档更新

## 工具脚本

项目提供了一系列工具脚本来简化开发和部署流程。这些脚本位于 `backend/scripts` 目录下。

### 1. 环境配置

#### 生成环境配置文件
```bash
python scripts/setup_env_files.py
```
此脚本会生成以下环境配置文件：
- `.env` - 默认环境配置
- `.env.development` - 开发环境配置
- `.env.staging` - 预发布环境配置
- `.env.production` - 生产环境配置

#### 检查环境配置
```bash
python scripts/check_env.py
```
此脚本会检查：
- 必需的环境变量是否存在
- CORS 配置是否正确
- 数据库连接是否有效
- 安全配置是否合理

### 2. 安全密钥

#### 生成安全密钥
```bash
# 生成默认密钥
python scripts/gen_secrets.py

# 生成指定长度的密钥
python scripts/gen_secrets.py --length 64

# 仅打印密钥，不更新文件
python scripts/gen_secrets.py --print-only

# 指定环境文件
python scripts/gen_secrets.py --env-file .env.production
```

### 3. 静态文件

#### 下载静态文件
```bash
python scripts/download_static_files.py
```
此脚本会下载 Swagger UI 和 ReDoc 的静态文件到 `static` 目录。

### 使用建议

1. 首次克隆项目后，先运行 `setup_env_files.py` 生成环境配置
2. 使用 `check_env.py` 确保环境配置正确
3. 在部署到生产环境前，使用 `gen_secrets.py` 生成新的安全密钥
4. 如需离线使用 API 文档，运行 `download_static_files.py` 下载静态文件

### 注意事项

1. 运行脚本前确保已激活 Python 虚拟环境
2. 环境配置文件（.env）不应提交到版本控制系统
3. 生产环境的密钥应该使用 `gen_secrets.py` 生成，并妥善保管
4. 所有脚本的详细说明请参考 `scripts/README.md` 

## 数据库迁移

### 1. 迁移工具

项目使用 Alembic 进行数据库迁移管理。Alembic 是 SQLAlchemy 作者开发的数据库迁移工具，提供了：

- 自动生成迁移脚本
- 版本控制数据库架构
- 支持升级和回滚
- 团队协作支持

### 2. 目录结构

```
backend/
├── migrations/           # 数据库迁移目录
│   ├── versions/        # 迁移版本文件
│   ├── env.py          # 迁移环境配置
│   └── script.py.mako  # 迁移脚本模板
```

### 3. 常用命令

```bash
# 生成迁移脚本
alembic revision --autogenerate -m "描述变更内容"

# 应用所有迁移
alembic upgrade head

# 回滚一个版本
alembic downgrade -1

# 查看当前版本
alembic current

# 查看迁移历史
alembic history
```

### 4. 迁移流程

1. **开发新功能时**：
   - 修改数据库模型（app/models/）
   - 生成迁移脚本：`alembic revision --autogenerate -m "描述"`
   - 检查生成的迁移脚本
   - 应用迁移：`alembic upgrade head`

2. **部署时**：
   - 确保所有迁移脚本已提交
   - 在部署脚本中添加：`alembic upgrade head`
   - 如果出错，可以回滚：`alembic downgrade -1`

3. **团队协作**：
   - 提交迁移脚本到版本控制
   - 其他开发者拉取后运行：`alembic upgrade head`
   - 避免手动修改数据库架构

### 5. 最佳实践

1. **迁移脚本命名**：
   - 使用清晰的描述
   - 包含功能或问题编号
   - 例如：`add_user_table`、`fix_email_length`

2. **数据安全**：
   - 重要变更前备份数据
   - 测试环境验证迁移脚本
   - 准备回滚方案

3. **代码审查**：
   - 检查自动生成的迁移脚本
   - 确保没有数据丢失风险
   - 验证回滚操作

4. **环境管理**：
   - 开发环境：频繁迁移
   - 测试环境：完整迁移测试
   - 生产环境：谨慎迁移

### 6. 常见问题

1. **迁移冲突**：
   - 原因：多人同时修改数据库架构
   - 解决：合并迁移脚本，按顺序应用

2. **数据丢失**：
   - 原因：迁移脚本设计不当
   - 预防：重要操作前备份，测试迁移脚本

3. **版本不一致**：
   - 原因：团队成员未同步迁移
   - 解决：统一使用 `alembic upgrade head`

4. **回滚失败**：
   - 原因：迁移脚本未考虑回滚
   - 预防：测试回滚操作，准备手动修复方案 