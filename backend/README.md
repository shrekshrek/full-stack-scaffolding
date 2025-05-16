# 后端服务

本项目后端服务。

有关整体项目信息和前端设置，请参阅[项目根 README.md](../../README.md)。

## 概述

此目录包含项目的后端服务。它使用 Python、FastAPI 构建，并利用 PDM进行依赖和项目管理。

## 技术栈

- **Python 版本**: 3.11
- **Web 框架**: FastAPI
- **数据库 ORM**: SQLAlchemy (异步) 与 Alembic (数据库迁移)
- **数据校验/序列化**: Pydantic
- **包管理**: PDM
- **测试框架**: Pytest 与 `pytest-asyncio`
- **代码格式化**: Black
- **代码检查 (Linter)**: Ruff
- **类型检查**: MyPy
- **ASGI 服务器**: Uvicorn
- **AI 集成**: LangChain (侧重 LCEL)
- **缓存/消息队列**: Redis (通过 `redis-py` 异步客户端)
- **环境变量**: `python-dotenv` 和 Pydantic Settings (`app/core/config.py`)

## 环境准备

- Python 3.11
- PDM (Python Dependency Manager): [安装指南](https://pdm.fming.dev/latest/installation/)

## 安装与设置

1.  **进入后端项目目录**:
    ```bash
    cd backend
    ```

2.  **使用 PDM 安装依赖**:
    此命令会自动创建虚拟环境 (`.venv`，如果尚不存在) 并安装所有项目依赖和开发依赖。
    ```bash
    pdm install
    ```
    若要包含可选的开发依赖：
    ```bash
    pdm install -G dev
    ```
    如果希望严格按照锁文件 (`pdm.lock`) 同步：
    ```bash
    pdm sync
    ```

3.  **环境变量**:
    - 复制环境变量模板文件：
      ```bash
      cp .env.example .env
      ```
    - 修改 `.env` 文件，配置您的本地环境（例如：数据库 URL、密钥、API 密钥等）。关键变量通常包括：
      - `DATABASE_URL`: 例如 `sqlite+aiosqlite:///./test.db` 或 `postgresql+asyncpg://user:pass@host:port/dbname`
      - `SECRET_KEY`: 用于 JWT 和其他安全功能的强密钥。
      - 如果使用 Redis，则配置 Redis 连接信息。
      - 外部服务（如 OpenAI）的 API 密钥。

## 运行应用

### 1. 数据库迁移

首次运行应用前，或在数据库模型发生任何更改后，请应用数据库迁移：
```bash
pdm run db_upgrade
# 或者使用 `pyproject.toml` 中定义的别名，如果配置了诸如：
# pdm run db_migrate
```

在模型更改后生成新的迁移脚本：
```bash
pdm run db_revision -m "your_migration_message"
# (请检查 pyproject.toml 中 `db_revision` 脚本的具体定义，通常是 `alembic revision --autogenerate -m "..."`)
```

### 2. 启动开发服务器

以开发模式运行 FastAPI 应用 (Uvicorn, 带自动重载)：
```bash
pdm run dev
```
应用通常会在 `http://localhost:8000` 上可用。

## API 文档

服务器运行后，API 文档 (Swagger UI 和 ReDoc) 将在以下地址可用：
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## 开发任务

### 运行测试

使用 Pytest 执行测试套件：
```bash
pdm run run_tests
```

### 代码规范与格式化

-   **检查代码风格和质量 (Linting, 格式化, 类型检查)**:
    ```bash
    pdm run run_lint
    ```
-   **应用自动修复 (格式化, 导入排序, 部分 lint 规则)**:
    ```bash
    pdm run apply_lint
    ```

这些命令利用 Ruff 进行 linting 和导入排序，Black 进行格式化，MyPy 进行类型检查，具体配置见 `pyproject.toml`。

## 项目结构

-   `app/`:核心应用代码。
    -   `main.py`: FastAPI 应用入口与配置。
    -   `core/`: 核心组件 (配置, 数据库, 安全, 依赖注入)。
    -   `apis/`: API 路由模块 (按版本组织)。
    -   `models/`: SQLAlchemy ORM 模型。
    -   `schemas/`: Pydantic 数据校验模型。
    -   `crud/`: CRUD 数据库操作。
    -   `services/`: 业务逻辑层。
    -   `langchain_module/`: LangChain 相关逻辑。
    -   `worker/`: (可选) Celery 或其他任务队列的工作进程。
-   `alembic/`: Alembic 数据库迁移脚本和配置。
-   `tests/`: Pytest 测试文件，目录结构镜像 `app/`。
-   `scripts/`: 后端项目的辅助脚本。
-   `pyproject.toml`: 项目元数据和 PDM 配置。
-   `.env.example`: 环境变量模板。
-   `.env`: 本地环境变量 (已在 `.gitignore` 中忽略)。

更详细的结构说明，请参阅[后端开发规范](mdc:.cursor/rules/backend-conventions.mdc#2-项目结构与文件命名-功能优先的模块化)。

## 贡献代码

请参考主项目的贡献指南，并确保您的代码遵循项目内部的[后端开发规范](mdc:.cursor/rules/backend-conventions.mdc)中概述的后端开发规范。
在提交代码前，请确保代码通过所有代码规范检查和测试。

## 部署

关于构建和部署后端服务的说明，请参阅项目根目录下的 [`docs/DEPLOYMENT_GUIDE.md`](../../docs/DEPLOYMENT_GUIDE.md)。 