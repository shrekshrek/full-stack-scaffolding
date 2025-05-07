# 开发工作流程

本文档详细说明项目的开发工作流程，包括环境设置、开发模式、测试流程等。

## 目录

- [开发环境设置](#开发环境设置)
- [开发模式](#开发模式)
- [测试流程](#测试流程)
- [Git 工作流](#git-工作流)
- [代码审查](#代码审查)
- [发布流程](#发布流程)
- [文档维护](#文档维护)
- [协作指南](#协作指南)
- [安全实践](#安全实践)

## 开发环境设置

### 1. 系统要求
- Python 3.8+
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Docker & Docker Compose

### 2. 环境配置
```bash
# 克隆项目
git clone https://github.com/yourusername/fastapi-vue-scaffold.git
cd fastapi-vue-scaffold

# 后端环境
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt

# 前端环境
cd frontend
npm install
```

### 3. 数据库设置
```bash
# 创建数据库
createdb myapp_dev

# 运行迁移
cd backend
alembic upgrade head
```

### 4. 环境变量
```bash
# 后端
cp backend/.env.example backend/.env
# 前端
cp frontend/.env.example frontend/.env
```

## 开发模式

### 1. 后端开发
```bash
# 启动后端服务
cd backend
uvicorn main:app --reload
```

### 2. 前端开发
```bash
# 启动前端服务
cd frontend
npm run dev
```

### 3. 数据库迁移
```bash
# 创建迁移
alembic revision --autogenerate -m "description"

# 应用迁移
alembic upgrade head
```

## 测试流程

### 1. 单元测试
```bash
# 后端测试
pytest backend/tests

# 前端测试
npm run test:unit
```

### 2. 集成测试
```bash
# 运行集成测试
pytest backend/tests/integration
```

### 3. E2E测试
```bash
# 运行E2E测试
npm run test:e2e
```

## Git 工作流

### 1. 分支管理
- `main`: 主分支，保持稳定
- `develop`: 开发分支
- `feature/*`: 功能分支
- `hotfix/*`: 紧急修复分支

### 2. 提交规范
```
<type>(<scope>): <subject>

<body>

<footer>
```

类型：
- feat: 新功能
- fix: 修复
- docs: 文档
- style: 格式
- refactor: 重构
- test: 测试
- chore: 构建

### 3. 工作流程
1. 从develop创建功能分支
2. 开发并提交代码
3. 创建Pull Request
4. 代码审查
5. 合并到develop

## 代码审查

### 1. 审查清单
- 代码风格符合规范
- 测试覆盖充分
- 文档更新完整
- 性能影响评估
- 安全考虑

### 2. 审查流程
1. 提交PR
2. 自动检查
3. 人工审查
4. 修改反馈
5. 批准合并

## 发布流程

### 1. 版本管理
- 遵循语义化版本
- 更新CHANGELOG
- 打标签

### 2. 发布步骤
1. 更新版本号
2. 更新文档
3. 运行测试
4. 构建发布
5. 部署验证

## 文档维护

### 1. 文档类型
- 技术文档
- API文档
- 部署文档
- 用户指南

### 2. 更新流程
1. 识别需要更新的文档
2. 准备更新内容
3. 提交PR
4. 审查更新
5. 合并发布

## 协作指南

### 1. 沟通渠道
- 项目看板
- 技术讨论
- 代码审查
- 文档协作

### 2. 最佳实践
- 及时沟通
- 明确责任
- 保持同步
- 记录决策

## 安全实践

### 1. 代码安全
- 依赖更新
- 安全扫描
- 代码审计
- 漏洞修复

### 2. 数据安全
- 敏感信息保护
- 数据加密
- 访问控制
- 审计日志

## 相关文档

- [部署指南](DEPLOYMENT.md) - 包含部署相关的详细说明
- [前端环境配置](../frontend/ENVIRONMENT.md) - 前端环境变量和配置
- [后端环境配置](../backend/ENVIRONMENT.md) - 后端环境变量和配置 