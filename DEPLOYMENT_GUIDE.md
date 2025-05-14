# 开发与部署指南

## 1. 概述

本文档旨在为本项目开发人员提供一个清晰、一致的指导，涵盖从本地开发环境搭建、编码规范、测试流程，到最终将应用部署至测试及生产环境的完整生命周期。项目采用前后端分离架构，后端使用 FastAPI (Python)，前端使用 Vue.js，并通过 Docker 进行容器化部署。

## 2. 整体工作流程

```mermaid
graph TD
    A[本地开发 & 单元测试] --> B{Git};
    B -- Feature Branch --> C[Pull Request (PR)];
    C -- Code Review & CI Checks --> D{Merge};
    D -- Merge to 'develop' --> E[CI/CD Pipeline: Test Env];
    E --> F[部署到测试服务器 (Docker)];
    F --> G{QA & UAT};
    G -- Approval --> H{Merge to 'main' / Tag};
    H --> I[CI/CD Pipeline: Prod Env];
    I --> J[部署到生产服务器 (Docker)];
```

1.  **本地开发**: 开发者在本地完成功能开发和单元测试。
2.  **Git**: 使用 Git进行版本控制，遵循指定的分支策略。
3.  **Pull Request (PR)**:提交 PR 进行代码审查。
4.  **CI/CD**: 自动化的持续集成和持续部署流程，包括代码检查、测试、构建 Docker 镜像和部署。
5.  **测试环境**: 部署到测试服务器进行集成测试和用户验收测试 (UAT)。
6.  **生产环境**: 经测试通过后，部署到生产服务器。

## 3. 环境准备

**通用工具:**

*   **Git**: 版本控制系统。
*   **Docker & Docker Compose**: 容器化平台。
*   **IDE**: Visual Studio Code (推荐，配置相关插件) 或其他偏好的 IDE。
*   **Shell**: Bash 或 Zsh。

**后端 (Python):**

*   **Python 3.11**: 确保已安装。
*   **PDM**: Python 包管理器。安装命令: `pip install pdm`。

**前端 (Vue.js):**

*   **Node.js**: (推荐 LTS 版本，例如 v18.x 或 v20.x)。
*   **pnpm**: 高效的包管理器。安装命令: `npm install -g pnpm`。

## 4. 本地开发环境设置

### 4.1. 克隆仓库

```bash
git clone <repository_url>
cd <project_directory>
```

### 4.2. 配置 Git Hooks (Pre-commit)

项目配置了 `pre-commit` 钩子，用于在提交代码前自动检查和修复代码风格、脚本权限等问题。请参考 `[.cursor/rules/project-conventions.mdc](mdc:.cursor/rules/project-conventions.mdc)` 中的 `recommended-git-hooks` 部分。
通常，首次设置需要初始化 (具体命令可能因 pre-commit 工具而异，如果使用了如 `pre-commit` 包，则为 `pre-commit install`)。

### 4.3. 后端本地设置 (`backend/`)

1.  **进入后端目录**:
    ```bash
    cd backend
    ```
2.  **安装依赖**:
    ```bash
    pdm install
    ```
    PDM 会自动创建并管理虚拟环境。
3.  **环境变量**:
    复制环境变量模板文件，并根据本地配置进行修改：
    ```bash
    cp .env.example .env
    ```
    编辑 `.env` 文件，配置数据库连接、Redis 连接、API 密钥等。
    ```env
    # backend/.env
    DATABASE_URL="postgresql+asyncpg://user:password@localhost:5432/mydatabase" # 示例
    REDIS_HOST="localhost"
    REDIS_PORT="6379"
    SECRET_KEY="your_strong_secret_key_here"
    # LangChain/LLM API Keys (示例)
    # OPENAI_API_KEY="sk-..."
    ```
4.  **数据库 (PostgreSQL/MySQL)**:
    *   确保本地已安装并运行所选的数据库服务，或者通过 Docker 启动一个数据库实例。
    *   在数据库中创建对应的数据库 (例如 `mydatabase`)。
    *   运行数据库迁移:
        ```bash
        pdm run alembic upgrade head
        ```
5.  **Redis**:
    *   确保本地已安装并运行 Redis 服务，或者通过 Docker 启动一个 Redis 实例。
6.  **运行后端开发服务器**:
    ```bash
    pdm run dev
    ```
    (此命令通常执行 `scripts/run_dev.sh`，内容类似: `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`)
    API 服务将在 `http://localhost:8000` 启动，OpenAPI 文档通常在 `http://localhost:8000/docs`。

### 4.4. 前端本地设置 (`frontend/`)

1.  **进入前端目录**:
    ```bash
    cd frontend
    ```
2.  **安装依赖**:
    ```bash
    pnpm install
    ```
3.  **环境变量**:
    复制环境变量模板文件：
    ```bash
    cp .env.example .env.development
    ```
    编辑 `.env.development` 文件，配置 API 基础路径等：
    ```env
    # frontend/.env.development
    VITE_APP_BASE_URL=/
    VITE_API_BASE_URL=http://localhost:8000/api/v1 # 后端API地址
    ```
4.  **运行前端开发服务器**:
    ```bash
    pnpm dev
    ```
    前端应用通常会在 `http://localhost:5173` (或 Vite 指定的其他端口) 启动。

### 4.5. 本地测试

*   **后端单元/集成测试**:
    在 `backend/` 目录下运行:
    ```bash
    pdm run test
    ```
    (此命令通常执行 `scripts/run_tests.sh`，内容类似: `pdm run pytest`)
*   **前端单元/组件测试**:
    在 `frontend/` 目录下运行:
    ```bash
    pnpm test
    ```
*   **本地端到端 (E2E) 集成验证 (推荐)**:
    为了在提交到 CI 前进行更全面的集成验证，推荐使用 Docker Compose 在本地模拟多服务环境。
    在项目根目录下，确保 `docker-compose.yml` 和 (可选的) `docker-compose.override.yml` 已配置好。
    ```bash
    docker-compose up --build -d
    ```
    访问前端 (`http://localhost:<frontend_nginx_port>`) 并测试与后端的交互。
    测试完毕后:
    ```bash
    docker-compose down
    ```

## 5. Docker化

应用通过 Docker 容器化，以便在不同环境中提供一致的运行方式。

### 5.1. Backend Dockerfile (`backend/Dockerfile`)

参考 `[.cursor/rules/backend-conventions.mdc](mdc:.cursor/rules/backend-conventions.mdc)` 中关于 Dockerfile 的规范。主要特点：
*   **多阶段构建**:
    1.  `builder` 阶段: 安装 PDM，复制项目文件，安装依赖。
    2.  `runner` 阶段: 从 `python:3.11-slim` 基础镜像开始，复制构建好的依赖和应用代码，设置非 root 用户，配置启动命令 (Uvicorn)。
*   **非 Root 用户**: 容器内应用以非 root 用户运行。
*   **端口暴露**: 暴露应用端口 (如 `8000`)。

### 5.2. Frontend Dockerfile (`frontend/Dockerfile`)

1.  **`builder` 阶段**:
    *   使用 `node:lts-alpine` 或类似镜像作为基础。
    *   安装 pnpm。
    *   复制 `package.json`, `pnpm-lock.yaml` 等，安装依赖 (`pnpm install --frozen-lockfile`)。
    *   复制前端代码。
    *   构建静态资源 (`pnpm build`)。
2.  **`runner` 阶段 (Nginx)**:
    *   使用 `nginx:stable-alpine` 作为基础镜像。
    *   从 `builder` 阶段复制构建好的静态文件 (通常在 `dist/` 目录) 到 Nginx 的 HTML 目录 (e.g., `/usr/share/nginx/html`)。
    *   复制自定义的 Nginx 配置文件 (例如 `nginx.conf`)，用于处理 SPA 路由 (将所有未匹配的路径指向 `index.html`) 和可能的反向代理配置 (如果前端直接调用外部 API)。
    *   暴露 Nginx 端口 (如 `80`)。

**示例 `frontend/nginx.conf` (简化版):**
```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 如果需要通过Nginx代理API请求到后端 (通常在生产环境由入口反向代理处理)
    # location /api/ {
    #     proxy_pass http://backend_service_name:8000/api/; # docker-compose service name
    #     proxy_set_header Host $host;
    #     proxy_set_header X-Real-IP $remote_addr;
    #     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    #     proxy_set_header X-Forwarded-Proto $scheme;
    # }
}
```

### 5.3. Docker Compose (`docker-compose.yml`)

项目根目录的 `docker-compose.yml` 用于编排多容器应用 (本地E2E测试、测试/生产环境部署)。

**示例 `docker-compose.yml`:**
```yaml
version: '3.8' # 或 '3' 遵循项目规范

services:
  db:
    image: postgres:15-alpine # 或 mysql
    container_name: project_db
    volumes:
      - postgres_data:/var/lib/postgresql/data/ # 持久化数据
    environment:
      POSTGRES_USER: ${DB_USER:-user}
      POSTGRES_PASSWORD: ${DB_PASSWORD:-password}
      POSTGRES_DB: ${DB_NAME:-mydatabase}
    ports:
      - "5432:5432" # 仅本地开发或调试时暴露
    networks:
      - app_network
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    container_name: project_redis
    ports:
      - "6379:6379" # _仅本地开发或调试时暴露_
    networks:
      - app_network
    restart: unless-stopped

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: project_backend
    # .env 文件通常不直接用于 compose build, 而是运行时注入
    # 如果后端Dockerfile不处理.env, 则需通过env_file或environment指定
    env_file:
      - ./backend/.env.docker # 或特定于 compose 的 env 文件
    # environment: # 或者直接指定
    #   - DATABASE_URL=postgresql+asyncpg://${DB_USER:-user}:${DB_PASSWORD:-password}@db:5432/${DB_NAME:-mydatabase}
    #   - REDIS_HOST=redis
    #   - SECRET_KEY=${BACKEND_SECRET_KEY}
    depends_on:
      - db
      - redis
    ports:
      - "8000:8000" # _开发时暴露, 生产环境通常由反向代理处理_
    networks:
      - app_network
    restart: unless-stopped
    # command: ["sh", "-c", "pdm run alembic upgrade head && pdm run start_prod"] # 示例: 启动前迁移

  frontend: # Nginx 服务前端静态文件
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: project_frontend
    ports:
      - "8080:80" # 将Nginx的80端口映射到主机的8080
    depends_on:
      - backend # 确保后端先启动, 虽然通常是API调用关系
    networks:
      - app_network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  app_network:
    driver: bridge
```
**注意**:
*   上述 `docker-compose.yml` 中的端口映射 (`ports`) 对于生产环境，通常只暴露最外层的反向代理 (如 Nginx, Traefik, Caddy) 的端口 (80/443)，内部服务不直接暴露。
*   环境变量管理:
    *   对于 `docker-compose`, 可以使用 `env_file` 指令指向一个特定的 `.env` 文件 (例如 `backend/.env.docker`，这个文件应包含非敏感的运行时配置，或引用宿主机已设置的环境变量)。
    *   敏感信息 (如 `SECRET_KEY`, `DB_PASSWORD`) **绝不应**硬编码到 `docker-compose.yml` 或提交到版本库的 `.env` 文件中。在 CI/CD 或服务器部署时，这些应通过安全的方式注入 (如 CI/CD 平台 Secrets, 服务器环境变量)。
    *   `backend/.env.docker` 和 `frontend/.env.docker` (如果前端构建时也需要环境变量) 应包含 Docker 容器运行时所需的配置。

### 5.4. Docker Compose Override (`docker-compose.override.yml`) (可选)

用于本地开发的特定配置，例如：
*   挂载代码卷以支持热重载 (对编译型语言如 Python 后端或构建后的前端静态文件，热重载可能意味着重新构建镜像并重启容器，或者有特定的开发服务器配置)。
*   暴露额外的端口进行调试。

**示例 `docker-compose.override.yml` (主要用于后端开发时的代码同步):**
```yaml
services:
  backend:
    volumes:
      - ./backend/app:/app/app # 将本地 app 目录挂载到容器内
    # command: pdm run dev # 覆盖 Dockerfile 中的 CMD 以使用开发服务器
    ports: # 确保端口与主 docker-compose.yml 一致或按需修改
      - "8000:8000"

  # 前端通常在本地使用 pnpm dev, docker-compose override 更多用于模拟生产Nginx环境
  # frontend:
  #   volumes:
  #     - ./frontend/dist:/usr/share/nginx/html # 如果你想本地构建后直接测试Nginx
  #   ports:
  #     - "8080:80"
```
**运行**: `docker-compose -f docker-compose.yml -f docker-compose.override.yml up`

## 6. Git 工作流

*   **主分支**:
    *   `main`: 稳定的生产代码。只接受来自 `develop` 的合并 (经过测试和批准) 或紧急热修复。
    *   `develop`: 开发主分支，集成了所有已完成的功能，准备进行测试环境部署。
*   **支持分支**:
    *   `feature/<feature-name>`: 从 `develop` 分支创建，用于开发新功能。完成后合并回 `develop`。
    *   `fix/<fix-name>`: 从 `develop` 分支创建，用于修复 `develop` 分支上的非紧急 bug。
    *   `hotfix/<issue-id>`: 从 `main` 分支创建，用于修复生产环境的紧急 bug。修复后合并回 `main` 和 `develop`。
*   **Pull Requests (PRs)**:
    *   所有合并到 `develop` 和 `main` 的代码都必须通过 PR。
    *   PR 需要至少一名其他开发者 review。
    *   CI 检查 (linting, tests, build) 必须通过。
*   **提交信息规范**: 遵循 Conventional Commits 规范 (e.g., `feat: add user login endpoint`)。

## 7. CI/CD 管道 (以 GitHub Actions 为例)

在 `.github/workflows/` 目录下定义工作流。

### 7.1. CI Workflow ( triggered on PR to `develop` / `main` or push to `feature/*`)

```yaml
# .github/workflows/ci.yml
name: Continuous Integration

on:
  push:
    branches:
      - feature/**
      - fix/**
      - hotfix/**
  pull_request:
    branches:
      - develop
      - main

jobs:
  lint-and-test-backend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./backend
    steps:
      - uses: actions/checkout@v4
      - name: Set up Python 3.11
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install PDM
        run: pip install pdm
      - name: Install dependencies
        run: pdm install --dev # 安装开发依赖以进行测试和linting
      - name: Run linters and formatters
        run: pdm run lint # 假设 'lint' 脚本在 pyproject.toml 中定义 (black, ruff, mypy)
      - name: Run tests
        run: pdm run test

  lint-and-test-frontend:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: ./frontend
    steps:
      - uses: actions/checkout@v4
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20' # 或项目指定的版本
      - name: Install pnpm
        run: npm install -g pnpm
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      - name: Run linters
        run: pnpm lint
      - name: Run tests
        run: pnpm test

  # (可选) Build Docker images to check if they build successfully
  # build-docker-images:
  #   needs: [lint-and-test-backend, lint-and-test-frontend]
  #   runs-on: ubuntu-latest
  #   steps:
  #     - uses: actions/checkout@v4
  #     - name: Build Backend Docker image
  #       run: docker build -t myapp-backend:ci-check ./backend
  #     - name: Build Frontend Docker image
  #       run: docker build -t myapp-frontend:ci-check ./frontend
```

### 7.2. CD Workflow (Test Environment - triggered on merge to `develop`)

```yaml
# .github/workflows/cd-test.yml
name: Deploy to Test Environment

on:
  push:
    branches:
      - develop

jobs:
  build-and-push-images:
    runs-on: ubuntu-latest
    outputs:
      backend_image_tag: ${{ steps.meta_backend.outputs.tags }}
      frontend_image_tag: ${{ steps.meta_frontend.outputs.tags }}
    steps:
      - uses: actions/checkout@v4
      - name: Log in to Docker Hub # 或其他镜像仓库
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKERHUB_USERNAME }}
          password: ${{ secrets.DOCKERHUB_TOKEN }}

      - name: Docker meta for backend
        id: meta_backend
        uses: docker/metadata-action@v5
        with:
          images: yourdockerhubusername/project-backend # 替换
          tags: |
            type=sha,prefix=dev-
            type=raw,value=dev-latest

      - name: Build and push Backend image
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: ${{ steps.meta_backend.outputs.tags }}
          labels: ${{ steps.meta_backend.outputs.labels }}

      - name: Docker meta for frontend
        id: meta_frontend
        uses: docker/metadata-action@v5
        with:
          images: yourdockerhubusername/project-frontend # 替换
          tags: |
            type=sha,prefix=dev-
            type=raw,value=dev-latest

      - name: Build and push Frontend image
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: ${{ steps.meta_frontend.outputs.tags }}
          labels: ${{ steps.meta_frontend.outputs.labels }}

  deploy-to-test-server:
    needs: build-and-push-images
    runs-on: ubuntu-latest # Or a self-hosted runner on the test server
    environment: test # GitHub Environment for secrets
    steps:
      - name: Deploy to test server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.TEST_SERVER_HOST }}
          username: ${{ secrets.TEST_SERVER_USERNAME }}
          key: ${{ secrets.TEST_SERVER_SSH_KEY }}
          script: |
            cd /path/to/your/project-on-server
            # 更新 .env 文件 (如果需要，或者通过 docker-compose.yml 的 env_file 管理)
            # 例如: echo "BACKEND_IMAGE_TAG=${{ needs.build-and-push-images.outputs.backend_image_tag }}" > .env.test.backend
            # echo "FRONTEND_IMAGE_TAG=${{ needs.build-and-push-images.outputs.frontend_image_tag }}" > .env.test.frontend
            
            # 使用标签更新 docker-compose.yml 或一个专门的 docker-compose.test.yml
            # 这里假设 docker-compose.yml 使用了变量如 BACKEND_IMAGE_TAG
            export BACKEND_IMAGE_TAG=${{ needs.build-and-push-images.outputs.backend_image_tag }}
            export FRONTEND_IMAGE_TAG=${{ needs.build-and-push-images.outputs.frontend_image_tag }}
            
            docker-compose pull backend frontend # 拉取最新镜像 (如果compose文件用的是 latest 标签或者带sha的标签)
            docker-compose up -d --remove-orphans backend frontend db redis # 确保所有服务都启动
            
            # 运行数据库迁移
            docker-compose exec -T backend pdm run alembic upgrade head
            
            # (可选) 清理旧的 Docker 镜像和容器
            docker image prune -af
            docker container prune -f
```
**GitHub Secrets 需要配置:**
*   `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`
*   `TEST_SERVER_HOST`, `TEST_SERVER_USERNAME`, `TEST_SERVER_SSH_KEY`
*   Potentially `DB_PASSWORD_TEST`, etc., if managing env files on server via CI.

### 7.3. CD Workflow (Production Environment - triggered on merge to `main` or tag)

类似测试环境的 CD，但：
*   触发条件为合并到 `main` 或创建 tag (e.g., `v1.0.0`)。
*   Docker 镜像 tag 应为稳定版本 (e.g., `latest`, `1.0.0`)。
*   部署目标为生产服务器，使用生产环境的 secrets。
*   可能包含手动审批步骤。
*   更关注零停机部署策略 (如果需要)。

## 8. 环境配置管理

*   **本地开发**:
    *   `backend/.env` (gitignored)
    *   `frontend/.env.development` (gitignored)
*   **Docker (Compose)**:
    *   为 Docker Compose 创建特定的环境变量文件，如 `backend/.env.docker`, `frontend/.env.docker` (不包含敏感信息，可提交到版本库)。
    *   敏感信息通过宿主机环境变量或 CI/CD 注入。
*   **测试/生产服务器**:
    *   环境变量由部署脚本 (CI/CD) 或服务器上的配置管理工具 (Ansible, Chef, Puppet) 设置。
    *   对于 Docker Compose, 可以在服务器上维护一个 `.env` 文件 (e.g., `/path/to/your/project-on-server/.env.prod`)，然后在 `docker-compose.yml` 中通过 `env_file` 指令引用，或者在启动 `docker-compose` 命令前 `export` 这些变量。这个服务器上的 `.env` 文件**必须严格保密**。

## 9. 手动部署到服务器 (Docker)

如果 CI/CD 未完全建立或需要手动干预：

**服务器要求:**
*   Docker Engine
*   Docker Compose

**步骤:**

1.  **准备代码和配置文件**:
    *   将项目代码 (或至少 `docker-compose.yml` 和相关的 `.env.docker` 或服务器专用的 `.env.prod` 文件) 同步到服务器。
    *   确保服务器上有最新的 Docker 镜像 (可以手动 `docker pull yourdockerhubusername/project-backend:tag` 和 `.../project-frontend:tag`)。
2.  **配置环境变量**:
    *   在服务器上创建或更新环境变量文件 (e.g., `/opt/my-app/.env.prod`)，包含数据库连接、API 密钥等。
3.  **启动应用**:
    进入包含 `docker-compose.yml` 的目录：
    ```bash
    # 确保环境变量文件被 docker-compose 读取
    # (如果 docker-compose.yml 中有 env_file: .env.prod)
    # 或者
    # export $(grep -v '^#' .env.prod | xargs) # Bash way to load .env vars
    
    docker-compose pull backend frontend # 拉取最新的镜像 (如果 compose 文件中指定了具体标签)
    docker-compose up -d --remove-orphans
    ```
4.  **运行数据库迁移 (后端)**:
    ```bash
    docker-compose exec -T backend pdm run alembic upgrade head
    ```
5.  **检查状态**:
    ```bash
    docker-compose ps
    docker-compose logs -f backend
    docker-compose logs -f frontend
    ```

## 10. 数据库迁移 (Alembic for Backend)

*   **生成迁移脚本 (本地)**:
    当 `backend/app/models/` 中的 SQLAlchemy 模型发生变化后：
    ```bash
    cd backend
    pdm run alembic revision -m "描述性的迁移信息，例如add_user_age_column"
    ```
    检查生成的迁移脚本 (`backend/alembic/versions/`)。
*   **应用迁移**:
    *   本地开发: `pdm run alembic upgrade head`
    *   服务器 (通过 Docker Compose): `docker-compose exec -T backend pdm run alembic upgrade head`
    此步骤应在应用新版本代码后、服务实际处理请求前执行。

## 11. 故障排查与日志

*   **本地开发**:
    *   检查后端 FastAPI 和前端 Vite 开发服务器的控制台输出。
    *   使用浏览器的开发者工具检查网络请求和前端错误。
*   **Docker 环境**:
    *   `docker-compose logs -f <service_name>` (e.g., `docker-compose logs -f backend`) 查看实时日志。
    *   `docker-compose ps` 查看容器状态。
    *   `docker exec -it <container_id_or_name> sh` 进入容器内部进行排查。
*   **生产环境**:
    *   依赖于配置的日志聚合系统 (ELK, Loki, Datadog) 和监控系统 (Prometheus, Sentry)。

## 12. 未来考虑

*   **零停机部署**: 蓝/绿部署或金丝雀发布。
*   **配置管理工具**: Ansible, Chef, Puppet 用于更复杂的服务器配置。
*   **服务发现**: Consul, etcd (对于更大型的微服务部署)。
*   **密钥管理**: HashiCorp Vault。
*   **更详细的监控和告警**: Prometheus, Grafana, Sentry。

---

本文档应随项目进展和技术栈变化而更新。 