import os
from pathlib import Path
from typing import Dict, Any, Optional
import json
from dotenv import load_dotenv

def load_env_file(env_file: str) -> None:
    """加载指定的环境变量文件"""
    if os.path.exists(env_file):
        load_dotenv(env_file, override=True)
        print(f"加载环境配置: {env_file}")
    else:
        print(f"警告: 环境配置文件 {env_file} 不存在")

def load_config_for_environment() -> None:
    """根据当前环境加载适当的配置文件"""
    # 项目根目录
    root_dir = Path(__file__).parent.parent.parent
    
    # 基础配置文件，始终加载
    base_env_file = os.path.join(root_dir, ".env")
    load_env_file(base_env_file)
    
    # 检查当前环境
    env = os.getenv("ENV", "development").lower()
    
    # 加载特定环境的配置
    env_specific_file = os.path.join(root_dir, f".env.{env}")
    load_env_file(env_specific_file)
    
    print(f"当前运行环境: {env}")

def validate_required_settings() -> Dict[str, str]:
    """验证必需的环境变量是否已设置，返回缺失的变量列表"""
    required_vars = [
        "SECRET_KEY",
        "DATABASE_URL",
    ]
    
    missing_vars = {}
    for var in required_vars:
        if not os.getenv(var) or os.getenv(var) == "your-secret-key-here-should-be-at-least-32-characters":
            missing_vars[var] = "未设置或使用了默认值"
    
    if missing_vars:
        print("警告: 缺少必需的环境变量:")
        for var, reason in missing_vars.items():
            print(f"  - {var}: {reason}")
    
    return missing_vars

def get_cors_origins() -> list:
    """从环境变量中解析CORS来源列表"""
    origins_str = os.getenv("BACKEND_CORS_ORIGINS", "[]")
    try:
        origins = json.loads(origins_str)
        if isinstance(origins, list):
            return origins
        return []
    except json.JSONDecodeError:
        print(f"错误: BACKEND_CORS_ORIGINS不是有效的JSON: {origins_str}")
        return []

def is_development_mode() -> bool:
    """检查是否为开发模式"""
    return os.getenv("ENV", "development").lower() == "development"

def is_production_mode() -> bool:
    """检查是否为生产模式"""
    return os.getenv("ENV", "development").lower() == "production"

def is_test_mode() -> bool:
    """检查是否为测试模式"""
    return os.getenv("ENV", "development").lower() == "testing"

# 初始化时自动加载环境配置
load_config_for_environment() 