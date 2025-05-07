#!/bin/bash

# 安装systemd服务脚本
# 使用方法: sudo ./install-service.sh [production|staging]

set -e

# 检查是否以root权限运行
if [ "$(id -u)" -ne 0 ]; then
    echo "错误: 请使用root权限运行此脚本 (sudo ./install-service.sh)"
    exit 1
fi

# 默认环境为production
ENV=${1:-production}

# 检查环境参数
if [ "$ENV" != "production" ] && [ "$ENV" != "staging" ]; then
    echo "错误: 环境参数必须是 'production' 或 'staging'"
    echo "用法: sudo ./install-service.sh [production|staging]"
    exit 1
fi

# 获取脚本所在目录的绝对路径
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")

# 服务文件源和目标路径
if [ "$ENV" == "production" ]; then
    SERVICE_FILE="$SCRIPT_DIR/fastapi-app.service"
    SERVICE_NAME="fastapi-app.service"
else
    SERVICE_FILE="$SCRIPT_DIR/fastapi-app-staging.service"
    SERVICE_NAME="fastapi-app-staging.service"
fi

# 检查服务文件是否存在
if [ ! -f "$SERVICE_FILE" ]; then
    echo "错误: 服务文件 $SERVICE_FILE 不存在"
    exit 1
fi

# 复制服务文件到systemd目录
cp "$SERVICE_FILE" "/etc/systemd/system/$SERVICE_NAME"
echo "服务文件已复制到 /etc/systemd/system/$SERVICE_NAME"

# 重新加载systemd配置
systemctl daemon-reload
echo "systemd配置已重新加载"

# 启用服务
systemctl enable "$SERVICE_NAME"
echo "服务已启用，将在系统启动时自动启动"

# 启动服务
systemctl start "$SERVICE_NAME"
echo "服务已启动"

# 显示服务状态
systemctl status "$SERVICE_NAME"

echo "安装完成: $SERVICE_NAME"
echo "管理命令:"
echo "  启动服务: sudo systemctl start $SERVICE_NAME"
echo "  停止服务: sudo systemctl stop $SERVICE_NAME"
echo "  重启服务: sudo systemctl restart $SERVICE_NAME"
echo "  查看状态: sudo systemctl status $SERVICE_NAME"
echo "  查看日志: sudo journalctl -u $SERVICE_NAME" 