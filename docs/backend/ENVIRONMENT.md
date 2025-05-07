# 后端环境配置指南

本文档详细说明后端项目的环境配置系统，包括环境变量、数据库配置和部署设置。

## 目录

- [环境类型](#环境类型)
- [环境变量配置](#环境变量配置)
- [配置加载](#配置加载)
- [数据库配置](#数据库配置)
- [日志配置](#日志配置)
- [环境变量验证](#环境变量验证)
- [环境切换](#环境切换)
- [常见问题](#常见问题)
- [最佳实践](#最佳实践)

## 环境类型

后端项目使用以下环境配置：

| 环境类型 | 配置文件 | 主要用途 |
|---------|----------|---------|
| 开发环境 | `.env.development` | 本地开发使用 |
| 预发布环境 | `.env.staging` | 类生产环境测试 |
| 生产环境 | `.env.production` | 正式上线环境 |

## 环境变量配置

### 核心配置变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `ENV` | 环境标识 | `development`, `staging`, `production` |
| `DEBUG` | 调试模式开关 | `true`, `false` |
| `API_V1_STR` | API前缀 | `/api/v1` |
| `DATABASE_URL` | 数据库连接串 | `sqlite:///./data/sql_app.db` |
| `SECRET_KEY` | JWT加密密钥 | `your-secret-key-should-be-very-long` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | 访问令牌过期时间(分钟) | `1440` (1天) |
| `BACKEND_CORS_ORIGINS` | CORS允许的来源 | `["http://localhost:5173"]` |
| `PROJECT_NAME` | 项目名称 | `"FastAPI + Vue全栈应用"` |
| `DB_POOL_SIZE` | 连接池大小 | `10` |
| `DB_MAX_OVERFLOW` | 最大溢出连接数 | `20` |

### 开发环境配置

```env
# 开发环境配置
ENV=development
DEBUG=true

# 数据库配置 - 使用SQLite用于开发
DATABASE_URL=sqlite:///./data/sql_app.db
DB_POOL_SIZE=10
DB_MAX_OVERFLOW=20

# CORS配置 - 允许本地开发服务器
BACKEND_CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000", "http://localhost:8080"]

# 日志配置
LOG_LEVEL=DEBUG
LOG_FORMAT=text

# 安全配置 - 开发环境值
SECRET_KEY=dev-secret-key-not-for-production-use
ACCESS_TOKEN_EXPIRE_MINUTES=14400  # 更长的过期时间，方便开发

# 速率限制 - 开发环境更宽松
RATE_LIMIT_PER_MINUTE=300
```

### 预发布环境配置

```env
# 预发布环境配置
ENV=staging
DEBUG=false
API_V1_STR=/api/v1

# 数据库配置 - 使用PostgreSQL用于预发布
DATABASE_URL=postgresql://user:password@staging-db:5432/app_staging
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=30

# CORS配置 - 仅允许预发布前端域名
BACKEND_CORS_ORIGINS=["https://staging.example.com", "https://www-staging.example.com"]

# 安全配置
SECRET_KEY=staging-secret-key-should-be-very-long-and-secure
ACCESS_TOKEN_EXPIRE_MINUTES=720  # 12小时
REFRESH_TOKEN_EXPIRE_MINUTES=10080  # 7天

# 密码策略 - 与生产相同
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_SPECIAL=true
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_DIGITS=true

# 速率限制
RATE_LIMIT_PER_MINUTE=120

# 日志配置
LOG_LEVEL=INFO
LOG_FORMAT=json

# 监控配置
ENABLE_METRICS=true
ENABLE_HEALTH_CHECK=true
```

### 生产环境配置

```env
# 生产环境配置
ENV=production
DEBUG=false

# 数据库配置 - 使用PostgreSQL用于生产环境
DATABASE_URL=postgresql://user:password@production-db:5432/app_production
DB_POOL_SIZE=50
DB_MAX_OVERFLOW=100

# CORS配置 - 限制为实际前端域名
BACKEND_CORS_ORIGINS=["https://example.com", "https://www.example.com"]

# 日志配置
LOG_LEVEL=INFO
LOG_FORMAT=json

# 安全配置
# SECRET_KEY= 请设置强随机密钥
ACCESS_TOKEN_EXPIRE_MINUTES=1440  # 1天
REFRESH_TOKEN_EXPIRE_MINUTES=43200  # 30天

# 速率限制
RATE_LIMIT_PER_MINUTE=60
```

## 配置加载

### 配置类定义

```python
# app/core/config.py
from typing import List, Union
from pydantic import AnyHttpUrl, BaseSettings, validator

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    @validator("BACKEND_CORS_ORIGINS", pre=True)
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
```

### 环境变量加载

```python
# app/core/config_loader.py
import os
from pathlib import Path
from dotenv import load_dotenv

def load_config_for_environment():
    """根据当前环境加载对应的环境变量文件"""
    env = os.getenv("ENV", "development")
    env_file = f".env.{env}"
    
    # 加载环境变量文件
    env_path = Path(__file__).parent.parent.parent / env_file
    if env_path.exists():
        load_dotenv(env_path)
    else:
        print(f"警告: 环境文件 {env_file} 不存在")
```

## 数据库配置

### SQLAlchemy 配置

```python
# app/db/session.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    echo=settings.DEBUG
)

AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)
```

## 日志配置

```python
# app/core/logging.py
import logging
import sys
from app.core.config import settings

def setup_logging():
    """配置日志系统"""
    logging.basicConfig(
        level=settings.LOG_LEVEL,
        format=settings.LOG_FORMAT,
        stream=sys.stdout
    )
```

## 环境变量验证

### 验证脚本

```python
# scripts/check_env.py
import os
from pathlib import Path

def check_required_vars():
    """检查必需的环境变量"""
    required_vars = [
        "SECRET_KEY",
        "DATABASE_URL",
        "BACKEND_CORS_ORIGINS"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"错误: 以下必需的环境变量未设置: {', '.join(missing_vars)}")
        return False
    return True
```

## 环境切换

### 开发环境

```bash
# 使用开发环境配置
export ENV=development
python -m uvicorn app.main:app --reload
```

### 预发布环境

```bash
# 使用预发布环境配置
export ENV=staging
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 生产环境

```bash
# 使用生产环境配置
export ENV=production
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 常见问题

1. **环境变量未生效**
   - 检查环境变量文件是否存在
   - 确认环境变量名称正确
   - 重启应用服务器

2. **数据库连接失败**
   - 验证数据库连接字符串
   - 检查数据库服务是否运行
   - 确认数据库用户权限

3. **CORS 错误**
   - 检查 `BACKEND_CORS_ORIGINS` 配置
   - 确认前端域名在允许列表中
   - 验证 CORS 中间件配置

## 最佳实践

1. **环境变量管理**
   - 使用 `.env.example` 作为模板
   - 敏感信息使用环境变量注入
   - 不同环境使用不同的配置文件

2. **安全配置**
   - 生产环境使用强密钥
   - 限制数据库连接池大小
   - 配置适当的速率限制

3. **日志管理**
   - 生产环境使用 JSON 格式
   - 配置适当的日志级别
   - 实现日志轮转 