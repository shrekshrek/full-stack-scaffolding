#!/bin/bash

# 显示标题
echo "======================================"
echo "   前后端服务一键启动脚本   "
echo "======================================"
echo ""

# 停止已占用端口的服务函数
stop_service_on_port() {
  local port=$1
  local service_name=$2
  
  echo "检查端口 $port 是否被占用..."
  
  if command -v lsof &> /dev/null; then
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
      echo "端口 $port 已被进程 $pid 占用，正在停止 $service_name 服务..."
      kill -9 $pid
      echo "$service_name 服务已停止"
    else
      echo "端口 $port 未被占用"
    fi
  else
    echo "警告: 未安装 lsof 工具，无法检查端口占用情况"
  fi
}

# 停止后端端口服务
stop_service_on_port 8000 "后端"

# 停止前端端口服务
stop_service_on_port 5173 "前端"

# 启动后端
echo "正在启动后端服务..."
cd backend
source .venv/bin/activate
python -m uvicorn app.main:app --reload &
BACKEND_PID=$!
echo "后端服务启动成功！PID: $BACKEND_PID"
echo "API文档: http://localhost:8000/api/docs"
echo ""

# 等待后端启动完成
sleep 3

# 启动前端
echo "正在启动前端服务..."
cd ../frontend
pnpm run dev &
FRONTEND_PID=$!
echo "前端服务启动成功！PID: $FRONTEND_PID"
echo "前端地址: http://localhost:5173"
echo ""

echo "前后端服务已启动，按 Ctrl+C 可同时终止所有服务"
echo "======================================"

# 捕获终止信号，关闭所有进程
trap "echo '正在关闭所有服务...'; kill $BACKEND_PID $FRONTEND_PID; echo '服务已关闭'; exit" SIGINT SIGTERM

# 等待用户中断
wait 