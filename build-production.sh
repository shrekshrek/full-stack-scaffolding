#!/bin/bash

echo "======================================"
echo "   生产环境构建脚本   "
echo "======================================"
echo ""

# 确认生产环境构建
read -p "您确定要构建生产环境吗？(y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]
then
    echo "操作已取消"
    exit 1
fi

# 前端构建
echo "正在构建前端应用(生产环境)..."
cd frontend
pnpm build:production  # 使用生产环境配置构建
echo "前端构建完成！"
echo ""

# 后端环境配置
echo "正在准备后端环境配置(生产环境)..."
cd ../backend
# 确保生产环境配置文件存在
if [ ! -f .env.production ]; then
    echo "错误：找不到生产环境配置文件 .env.production"
    exit 1
fi
echo "后端环境配置就绪，部署时需设置 ENV=production"

echo "生产环境构建完成！"
echo "======================================"

echo "注意：构建完成后，请使用部署工具将前端dist目录和后端应用上传至服务器" 