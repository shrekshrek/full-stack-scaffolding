#!/usr/bin/env python3
"""
生成不同环境的配置文件
"""
import os
from pathlib import Path

def write_env_file(file_path, content):
    """写入环境变量文件"""
    # 确保在backend目录下生成文件
    backend_dir = Path(__file__).parent.parent
    full_path = backend_dir / file_path
    with open(full_path, 'w') as f:
        f.write(content)
    print(f"已创建: {full_path}")

def create_env_symlink(env_type):
    """创建环境配置文件的软链接"""
    backend_dir = Path(__file__).parent.parent
    env_file = backend_dir / '.env'
    target_file = backend_dir / f'.env.{env_type}'
    
    # 如果.env已存在，先删除
    if env_file.exists():
        env_file.unlink()
    
    # 创建软链接
    env_file.symlink_to(target_file)
    print(f"已创建软链接: .env -> .env.{env_type}")

# 开发环境配置
dev_env = """# 基本设置
PROJECT_NAME="FastAPI + Vue全栈应用"
API_V1_STR="/api/v1"

# 环境设置
ENV=development
DEBUG=true

# CORS设置
BACKEND_CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]

# 安全设置
SECRET_KEY=your-secret-key-here-should-be-at-least-32-characters
ACCESS_TOKEN_EXPIRE_MINUTES=1440
REFRESH_TOKEN_EXPIRE_MINUTES=43200
JWT_ALGORITHM=HS256

# 密码策略
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_SPECIAL=true
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_DIGITS=true

# 请求限制
RATE_LIMIT_PER_MINUTE=60

# 数据库设置 - SQLite (开发)
DATABASE_URL=sqlite:///./data/sql_app.db
DB_POOL_SIZE=10
DB_MAX_OVERFLOW=20

# 日志设置
LOG_LEVEL=DEBUG
"""

# 预发布环境配置
staging_env = """# 基本设置
PROJECT_NAME="FastAPI + Vue全栈应用"
API_V1_STR="/api/v1"

# 环境设置
ENV=staging
DEBUG=false

# CORS设置
BACKEND_CORS_ORIGINS=["https://staging.example.com"]

# 安全设置
SECRET_KEY=your-secret-key-here-should-be-at-least-32-characters
ACCESS_TOKEN_EXPIRE_MINUTES=1440
REFRESH_TOKEN_EXPIRE_MINUTES=43200
JWT_ALGORITHM=HS256

# 密码策略
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_SPECIAL=true
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_DIGITS=true

# 请求限制
RATE_LIMIT_PER_MINUTE=60

# 数据库设置 - PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/app_staging
DB_POOL_SIZE=10
DB_MAX_OVERFLOW=20

# 日志设置
LOG_LEVEL=INFO
"""

# 生产环境配置
prod_env = """# 基本设置
PROJECT_NAME="FastAPI + Vue全栈应用"
API_V1_STR="/api/v1"

# 环境设置
ENV=production
DEBUG=false

# CORS设置
BACKEND_CORS_ORIGINS=["https://example.com"]

# 安全设置
SECRET_KEY=your-secret-key-here-should-be-at-least-32-characters
ACCESS_TOKEN_EXPIRE_MINUTES=1440
REFRESH_TOKEN_EXPIRE_MINUTES=43200
JWT_ALGORITHM=HS256

# 密码策略
PASSWORD_MIN_LENGTH=8
PASSWORD_REQUIRE_SPECIAL=true
PASSWORD_REQUIRE_UPPERCASE=true
PASSWORD_REQUIRE_DIGITS=true

# 请求限制
RATE_LIMIT_PER_MINUTE=60

# 数据库设置 - PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/app_production
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=40

# 日志设置
LOG_LEVEL=WARNING
"""

def main():
    """主函数"""
    import argparse
    parser = argparse.ArgumentParser(description='生成环境配置文件')
    parser.add_argument('--env', choices=['development', 'staging', 'production'],
                      default='development', help='要生成的环境配置 (默认: development)')
    args = parser.parse_args()

    # 写入环境模板文件
    write_env_file('.env.development', dev_env)
    write_env_file('.env.staging', staging_env)
    write_env_file('.env.production', prod_env)

    # 创建当前环境的软链接
    create_env_symlink(args.env)

    print(f"\n环境配置文件创建完成。当前环境: {args.env}")
    print("注意: 不要将包含敏感信息的.env文件提交到版本控制系统。")
    print("对于生产环境，请手动修改.env.production并复制为.env，确保设置了所有必需的变量。")

if __name__ == "__main__":
    main() 