# FastAPI + Vue 全栈应用文档

## 项目概述

这是一个基于 FastAPI 和 Vue 3 的全栈应用脚手架，采用现代化的技术栈和最佳实践，提供完整的开发、测试和部署流程。

## 项目结构

全栈项目采用前后端分离架构，主要由以下部分组成：

```
/
├── frontend/          # 前端项目(Vue 3 + Vite)
├── backend/           # 后端项目(FastAPI)
├── docs/              # 项目文档
└── scripts/           # 项目脚本
```

> 各部分的详细结构请参考各自的文档：
> - [前端目录结构](frontend/GUIDE.md#项目结构)
> - [后端目录结构](backend/GUIDE.md#项目结构)

## 文档结构

```
docs/
├── frontend/          # 前端相关文档
│   ├── README.md     # 前端概述和目录结构
│   ├── GUIDE.md      # 前端开发指南
│   └── ENVIRONMENT.md # 前端环境配置
├── backend/          # 后端相关文档
│   ├── README.md     # 后端概述和目录结构
│   ├── GUIDE.md      # 后端开发指南
│   └── ENVIRONMENT.md # 后端环境配置
└── common/           # 通用文档
    ├── WORKFLOW.md   # 开发工作流程
    └── DEPLOYMENT.md # 部署指南
```

## 快速导航

### 前端文档
- [前端概述](frontend/README.md) - 前端架构和核心设计
- [前端开发指南](frontend/GUIDE.md) - 前端开发规范、组件设计和最佳实践
- [前端环境配置](frontend/ENVIRONMENT.md) - 前端环境变量和配置说明

### 后端文档
- [后端概述](backend/README.md) - 后端架构和核心设计
- [后端开发指南](backend/GUIDE.md) - 后端开发规范、API设计和最佳实践
- [后端环境配置](backend/ENVIRONMENT.md) - 后端环境变量和配置说明

### 通用文档
- [开发工作流程](common/WORKFLOW.md) - 开发流程、Git规范和代码审查
- [部署指南](common/DEPLOYMENT.md) - 环境部署和发布流程

## 技术栈

### 后端技术栈
- **核心框架**: FastAPI
- **数据库**: PostgreSQL + SQLAlchemy
- **缓存**: Redis
- **认证**: JWT
- **测试**: pytest
- **文档**: Swagger/OpenAPI

### 前端技术栈
- **核心框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **UI框架**: Element Plus
- **HTTP客户端**: Axios
- **测试**: Vitest

## 快速开始

### 环境要求
- Python 3.10+
- Node.js 16+
- pnpm 7+（推荐）
- PostgreSQL 14+
- Redis 6+

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/yourusername/fastapi-vue-scaffold.git
cd fastapi-vue-scaffold

# 设置后端
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m app.db_init

# 设置前端
cd ../frontend
pnpm install
```

### 启动开发服务器

```bash
# 使用一键启动脚本
./start-dev.sh

# 或分别启动
# 启动后端
cd backend
source .venv/bin/activate  # Windows: .venv\Scripts\activate
python -m app.main

# 启动前端
cd frontend
pnpm run dev
```

## 项目特点

### 架构设计
- 清晰的分层架构
- 模块化的代码组织
- 统一的错误处理
- 完善的日志系统

### 开发体验
- 完整的开发文档
- 统一的代码规范
- 自动化测试支持
- 便捷的开发工具

### 部署运维
- 多环境配置支持
- 容器化部署方案
- 自动化部署流程
- 监控和告警机制

## 文档维护

本文档采用 Markdown 格式编写，使用以下规范：

1. 文件命名使用大写，如 `GUIDE.md`
2. 中文文档使用中文标点符号
3. 代码块使用 ``` 标记，并指定语言
4. 图片等资源文件存放在对应目录的 `assets` 子目录中
5. 文档更新需要遵循以下流程：
   - 创建文档更新分支
   - 更新相关文档
   - 提交 Pull Request
   - 经过团队审查
   - 合并到主分支

## 文档更新日志

### 2024-05-02
- 更新前端目录结构
- 添加 UnoCSS 配置说明
- 优化文档组织结构

### 2024-05-01
- 初始文档结构
- 添加基础开发指南
- 添加环境配置说明

## 贡献指南

1. 遵循现有的文档结构和格式
2. 确保所有链接正确有效
3. 保持文档的及时更新
4. 重要更新需要经过团队审核
5. 更新文档时同步更新更新日志

## 许可证
MIT 