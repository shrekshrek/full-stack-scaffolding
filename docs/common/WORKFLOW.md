# 开发工作流程指南

本文档详细说明项目的开发工作流程，包括代码管理、开发规范和协作流程。

## 目录

- [开发流程](#开发流程)
- [Git 规范](#git-规范)
- [代码审查](#代码审查)
- [发布流程](#发布流程)
- [最佳实践](#最佳实践)

## 开发流程

### 1. 环境准备

```bash
# 克隆项目
git clone https://github.com/yourusername/fastapi-vue-scaffold.git
cd fastapi-vue-scaffold

# 安装依赖
# 后端
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# 前端
cd frontend
pnpm install
```

### 2. 开发模式

- 前端开发服务器：`pnpm run dev`
- 后端开发服务器：`uvicorn app.main:app --reload`
- 数据库迁移：`alembic upgrade head`

### 3. 测试

```bash
# 后端测试
cd backend
pytest

# 前端测试
cd frontend
pnpm run test
```

## Git 规范

### 1. 分支管理

- `main`: 主分支，保持稳定
- `develop`: 开发分支，用于集成功能
- `feature/*`: 功能分支，用于开发新功能
- `bugfix/*`: 修复分支，用于修复问题
- `release/*`: 发布分支，用于版本发布
- `hotfix/*`: 热修复分支，用于紧急修复

### 2. 提交规范

提交信息格式：
```
<type>(<scope>): <subject>

<body>

<footer>
```

类型（type）：
- `feat`: 新功能
- `fix`: 修复
- `docs`: 文档
- `style`: 格式
- `refactor`: 重构
- `test`: 测试
- `chore`: 构建过程或辅助工具的变动

### 3. 工作流程

1. 从 `develop` 创建功能分支
2. 在功能分支上开发
3. 提交代码并推送到远程
4. 创建 Pull Request
5. 代码审查
6. 合并到 `develop`

## 代码审查

### 1. 审查清单

- 代码风格是否符合规范
- 是否包含必要的测试
- 是否有适当的文档
- 是否有潜在的安全问题
- 性能是否合理

### 2. 审查流程

1. 创建 Pull Request
2. 至少一名审查者批准
3. 所有测试通过
4. 解决所有评论
5. 合并代码

### 3. 审查工具

- GitHub Pull Requests
- ESLint
- Pylint
- SonarQube

## 发布流程

### 1. 版本号规范

遵循语义化版本（Semantic Versioning）：
- 主版本号：不兼容的 API 修改
- 次版本号：向下兼容的功能性新增
- 修订号：向下兼容的问题修正

### 2. 发布步骤

1. 创建发布分支
2. 更新版本号
3. 更新 CHANGELOG
4. 运行测试
5. 创建发布标签
6. 合并到主分支

### 3. 部署流程

1. 构建生产版本
2. 运行部署脚本
3. 验证部署结果
4. 监控系统状态

## 最佳实践

### 1. 代码质量

- 遵循编码规范
- 编写单元测试
- 使用类型检查
- 定期代码审查

### 2. 文档维护

- 及时更新文档
- 保持文档简洁
- 使用示例说明
- 记录重要决策

### 3. 协作建议

- 及时沟通
- 定期同步
- 互相审查
- 知识共享

### 4. 安全实践

- 定期更新依赖
- 代码安全审查
- 敏感信息保护
- 权限最小化

## 常见问题

### 1. 代码冲突

**问题**: 合并时出现代码冲突
**解决方案**:
- 定期同步主分支
- 使用 `git rebase` 更新分支
- 仔细解决冲突

### 2. 测试失败

**问题**: 提交后测试失败
**解决方案**:
- 本地运行测试
- 检查环境配置
- 查看测试日志

### 3. 部署问题

**问题**: 部署后出现问题
**解决方案**:
- 检查部署日志
- 验证环境配置
- 准备回滚方案

## 开发环境设置

### 依赖要求

- Python 3.10+
- Node.js 16+
- pnpm 7+（推荐）
- PostgreSQL 14+（生产）

### 初始设置

1. **克隆代码库**

```bash
git clone https://github.com/yourusername/fastapi-vue-scaffold.git
cd fastapi-vue-scaffold
```

2. **配置环境变量**

```bash
# 后端环境变量
cp backend/.env.example backend/.env
cp backend/.env.example backend/.env.development
cp backend/.env.example backend/.env.staging
cp backend/.env.example backend/.env.production

# 前端环境变量
cp frontend/.env.example frontend/.env
cp frontend/.env.example frontend/.env.development
cp frontend/.env.example frontend/.env.staging
cp frontend/.env.example frontend/.env.production

# Docker环境变量(可选)
cp .env.docker.example .env
```

3. **后端设置**

```bash
cd backend

# 创建虚拟环境
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt

# 初始化数据库
```

4. **前端设置**

```bash
cd frontend

# 安装依赖
pnpm install
```

### 启动开发环境

项目提供了便捷的一键启动脚本 `start-dev.sh`，可以同时启动前端和后端服务：

```bash
# 确保脚本有执行权限
chmod +x start-dev.sh

# 启动开发环境
./start-dev.sh
```

这个脚本会：
1. 启动后端服务（FastAPI）在 http://localhost:8000
2. 启动前端服务（Vue）在 http://localhost:5173
3. 自动处理进程管理和优雅退出

如果需要手动启动，可以分别执行：

```bash
# 终端1: 启动后端
cd backend
source .venv/bin/activate
python -m uvicorn app.main:app --reload

# 终端2: 启动前端
cd frontend
pnpm run dev
``` 