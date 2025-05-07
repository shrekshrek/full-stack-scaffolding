#!/bin/bash
# 激活虚拟环境
source .venv/bin/activate

# 启动后端服务
python -m uvicorn app.main:app --reload

# 如果需要退出虚拟环境
# deactivate 