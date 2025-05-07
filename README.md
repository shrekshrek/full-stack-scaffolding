# FastAPI + Vue 3 全栈应用脚手架

这是一个基于FastAPI（后端）和Vue 3（前端）的全栈应用脚手架，提供了完整的项目结构和基础功能，可以快速开始全栈Web应用的开发。

## 功能特性

### 后端 (FastAPI)
- 用户认证系统（JWT令牌）
- 用户管理（注册、登录、权限控制）
- 数据库集成（支持PostgreSQL和SQLite）
- API文档自动生成
- CORS设置
- 模块化结构
- 中间件系统

### 前端 (Vue 3)
- 组合式API (Composition API)
- TypeScript支持
- Pinia状态管理
- Vue Router路由管理
- Axios HTTP客户端
- 响应式UI
- 三层组件架构
- 工具函数库

## 快速开始

### 依赖要求
- Python 3.10+ 
- Node.js 16+
- pnpm 7+（推荐）

### 安装和运行

1. **克隆仓库**
```bash
git clone https://github.com/yourusername/fastapi-vue-scaffold.git
cd fastapi-vue-scaffold
```

2. **配置环境变量**
```bash
# 后端环境变量
cp backend/.env.example backend/.env.development

# 前端环境变量
cp frontend/.env.example frontend/.env.development
```

3. **设置后端**
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m app.db_init  # 初始化数据库
python -m app.main  # 启动后端服务器
```

4. **设置前端**
```bash
cd frontend
pnpm install
pnpm run dev
```

5. **访问应用**
- 前端: http://localhost:5173
- 后端API: http://localhost:8000
- API文档: http://localhost:8000/api/docs

### 默认管理员账户
- 邮箱: admin@example.com
- 密码: admin123

## 架构优化

本项目采用现代前后端最佳实践，进行了以下架构优化：

### 前端架构
- **组件分层**: 通用组件/布局组件/功能组件的三层架构
- **工具函数库**: 日期处理、本地存储等通用功能
- **类型安全**: 完整的TypeScript类型支持

### 后端架构
- **领域分离**: 通过仓储模式分离数据访问和业务逻辑
- **中间件系统**: 处理横切关注点如日志、认证
- **异步处理**: 采用FastAPI异步处理提高性能

### 环境变量管理
- **职责分工**: 前端/后端/Docker环境变量职责明确分离
- **示例文件**: 提供所有配置的示例文件（.env.example）
- **验证机制**: 环境变量检查和验证工具
- **Docker定制**: 专用的Docker环境变量配置

## 文档指南

完整的项目文档请查看[文档目录](./docs/README.md)，包括：

- **[项目结构](./docs/PROJECT_STRUCTURE.md)** - 详细的项目目录和文件结构
- **[开发指南](./docs/DEVELOPMENT_GUIDE.md)** - 开发环境设置和开发流程
- **[部署指南](./docs/DEPLOYMENT.md)** - 部署应用到各种环境的详细说明
- **[后端技术文档](./docs/backend/README.md)** - 后端架构和实现细节
- **[前端技术文档](./docs/frontend/README.md)** - 前端架构和组件说明

## 许可证

本项目采用 MIT 许可证，详情请参见 [LICENSE](./LICENSE) 文件。 