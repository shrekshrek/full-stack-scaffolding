# 全栈项目脚手架 (Full-Stack Project Starter)

本项目是一个现代化的全栈应用脚手架，旨在提供一个结构清晰、规范统一、易于扩展的开发起点。

## 技术栈概览

- **前端**: Vue 3, Vite, Element Plus, TypeScript, Pinia, UnoCSS
- **后端**: Python 3.11, FastAPI, SQLAlchemy (异步), PDM, LangChain, Redis
- **容器化**: Docker & Docker Compose
- **代码规范与质量**: Prettier, ESLint (前端), Black, Ruff, MyPy (后端), EditorConfig
- **CI/CD**: GitHub Actions (示例)

## 项目结构

- `frontend/`: 包含前端应用代码。更多详情请参见 [`frontend/README.md`](./frontend/README.md)。
- `backend/`: 包含后端服务代码。更多详情请参见 [`backend/README.md`](./backend/README.md)。
- `docs/`: 包含项目级文档，如开发与部署指南。
- `scripts/`: 包含项目级通用脚本。
- `.github/`: 包含 GitHub Actions CI/CD 工作流配置。
- `.cursor/rules/`: 包含项目开发规范文档。

## 快速开始

1.  **克隆仓库**:
    ```bash
    git clone <repository_url>
    cd <project_directory>
    ```

2.  **详细设置与运行**:
    - **前端**: 请参考 [`frontend/README.md`](./frontend/README.md) 中的说明进行环境配置、依赖安装和启动。
    - **后端**: 请参考 [`backend/README.md`](./backend/README.md) 中的说明进行环境配置、依赖安装和启动。
    - **整体部署**: 详细的本地、测试及生产环境部署指南，请参阅 [`docs/DEPLOYMENT_GUIDE.md`](./docs/DEPLOYMENT_GUIDE.md)。

## 开发规范

本项目遵循一系列开发规范以确保代码质量和团队协作效率：
- [项目通用规范](mdc:.cursor/rules/project-conventions.mdc)
- [前端开发规范](mdc:.cursor/rules/frontend-conventions.mdc)
- [后端开发规范](mdc:.cursor/rules/backend-conventions.mdc)
- [开发与部署指南](./docs/DEPLOYMENT_GUIDE.md)

建议所有开发者在开始工作前熟悉这些规范。

## 贡献

欢迎参与项目贡献！请确保遵循相关的开发规范和提交流程。 