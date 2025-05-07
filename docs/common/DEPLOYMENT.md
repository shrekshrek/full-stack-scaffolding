# 部署指南

本文档提供项目的部署流程指南，包括环境准备、构建和部署步骤。

## 目录

- [环境要求](#环境要求)
- [构建流程](#构建流程)
- [部署步骤](#部署步骤)
- [验证和回滚](#验证和回滚)
- [常见问题](#常见问题)

## 环境要求

### 系统要求
- Linux (Ubuntu 20.04+)
- Docker 20.10+
- Docker Compose 2.0+
- PostgreSQL 14+
- Nginx 1.18+

### 硬件要求
- CPU: 2核+
- 内存: 4GB+
- 磁盘: 20GB+

> 注意：详细的开发环境设置请参考[开发工作流程](WORKFLOW.md#开发环境设置)。

## 构建流程

### 预发布环境构建
```bash
# 构建预发布版本
./build-staging.sh
```
脚本会：
1. 使用 staging 配置构建前端
2. 验证后端 staging 配置
3. 生成构建产物在 `frontend/dist`

### 生产环境构建
```bash
# 构建生产版本
./build-production.sh
```
脚本会：
1. 确认生产环境构建
2. 使用 production 配置构建前端
3. 验证后端 production 配置
4. 生成构建产物在 `frontend/dist`

## 部署步骤

### 1. 服务器准备
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装必要工具
sudo apt install -y curl git nginx
curl -fsSL https://get.docker.com | sh
```

### 2. 项目部署
```bash
# 克隆项目
git clone https://github.com/yourusername/fastapi-vue-scaffold.git
cd fastapi-vue-scaffold

# 配置环境
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 部署后端
cd backend
docker build -t myapp/backend:latest .
docker-compose -f docker-compose.prod.yml up -d

# 部署前端
cd frontend
docker build -t myapp/frontend:latest .
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Nginx配置
```nginx
# /etc/nginx/sites-available/myapp
server {
    listen 80;
    server_name example.com;

    location / {
        root /var/www/myapp/frontend;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 验证和回滚

### 部署验证
```bash
# 检查服务状态
docker ps
docker logs myapp_backend
docker logs myapp_frontend

# 验证服务
curl http://localhost:8000/api/v1/health
curl -I http://localhost
```

### 回滚操作
```bash
# 代码回滚
git checkout v1.0.0
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d

# 数据库回滚
cd backend
alembic downgrade -1
```

## 常见问题

### 1. 部署失败
- 检查日志：`docker logs <container_id>`
- 验证环境变量配置
- 确认端口未被占用
- 检查磁盘空间

### 2. 服务无法访问
- 检查防火墙配置
- 验证 Nginx 配置
- 检查服务日志
- 确认域名解析

### 3. 性能问题
- 检查服务器资源使用
- 优化数据库查询
- 配置缓存
- 调整 Nginx 配置

## 相关文档

- [开发工作流程](WORKFLOW.md) - 包含详细的开发环境设置说明
- [前端环境配置](../frontend/ENVIRONMENT.md) - 前端环境变量和配置
- [后端环境配置](../backend/ENVIRONMENT.md) - 后端环境变量和配置 