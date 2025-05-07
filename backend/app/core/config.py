import os
from typing import List, Optional
from pydantic_settings import BaseSettings
from pathlib import Path

# 预加载环境变量
from .config_loader import get_cors_origins, is_development_mode, is_production_mode, is_test_mode, validate_required_settings

# 获取项目根目录
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)  # 确保data目录存在

class Settings(BaseSettings):
    # 基本设置
    PROJECT_NAME: str = "FastAPI + Vue全栈应用"
    API_V1_STR: str = "/api/v1"
    ENV: str = os.getenv("ENV", "development")
    DEBUG: bool = is_development_mode()
    
    # CORS配置
    BACKEND_CORS_ORIGINS: List[str] = get_cors_origins()
    
    # 安全配置
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))  # 1天
    REFRESH_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_MINUTES", "43200"))  # 30天
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")

    # 密码策略
    PASSWORD_MIN_LENGTH: int = int(os.getenv("PASSWORD_MIN_LENGTH", "8"))
    PASSWORD_REQUIRE_SPECIAL: bool = os.getenv("PASSWORD_REQUIRE_SPECIAL", "true").lower() == "true"
    PASSWORD_REQUIRE_UPPERCASE: bool = os.getenv("PASSWORD_REQUIRE_UPPERCASE", "true").lower() == "true"
    PASSWORD_REQUIRE_DIGITS: bool = os.getenv("PASSWORD_REQUIRE_DIGITS", "true").lower() == "true"
    
    # 请求限制
    RATE_LIMIT_PER_MINUTE: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "60"))
    
    # 数据库配置
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        f"sqlite:///{DATA_DIR}/sql_app.db"  # 使用绝对路径
    )
    DB_POOL_SIZE: int = int(os.getenv("DB_POOL_SIZE", "10"))
    DB_MAX_OVERFLOW: int = int(os.getenv("DB_MAX_OVERFLOW", "20"))
    
    # 日志配置
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_FORMAT: str = "json" if is_production_mode() else "text"
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        env_file_encoding = "utf-8"

    def log_info(self):
        """打印配置信息"""
        print("应用配置:")
        print(f"  环境: {self.ENV} (调试模式: {self.DEBUG})")
        print(f"  数据库: {self.DATABASE_URL.split('@')[-1] if '@' in self.DATABASE_URL else self.DATABASE_URL}")
        print(f"  日志级别: {self.LOG_LEVEL}")
        print(f"  CORS源: {self.BACKEND_CORS_ORIGINS}")
        
        # 验证必要的配置
        missing_vars = validate_required_settings()
        if missing_vars:
            print("⚠️  警告: 一些关键配置使用了默认值，不建议用于生产环境")

# 全局设置实例
settings = Settings()

# 打印配置信息
if not is_test_mode():
    settings.log_info()