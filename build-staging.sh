#!/bin/bash

echo "======================================"
echo "   预发布环境构建脚本   "
echo "======================================"
echo ""

# 前端构建
echo "正在构建前端应用(预发布环境)..."
cd frontend
pnpm build:staging  # 使用预发布环境配置构建
echo "前端构建完成！"
echo ""

# 后端环境配置
echo "正在准备后端环境配置(预发布环境)..."
cd ../backend
# 确保预发布环境配置文件存在
if [ ! -f .env.staging ]; then
    echo "错误：找不到预发布环境配置文件 .env.staging"
    exit 1
fi
echo "后端环境配置就绪，部署时需设置 ENV=staging"

echo "预发布环境构建完成！"
echo "======================================" 