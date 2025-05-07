#!/usr/bin/env python3
"""
修复环境配置文件中缺少的变量
使用方法: python fix-env.py [env_file]
"""

import os
import sys
import re
from pathlib import Path

def add_missing_config(env_file):
    """添加缺少的配置项"""
    print(f"正在检查配置文件: {env_file}")
    
    if not os.path.exists(env_file):
        print(f"错误: 文件 {env_file} 不存在")
        return False
    
    # 读取当前文件内容
    with open(env_file, 'r') as f:
        content = f.read()
    
    changes_made = False
    
    # 检查并添加缺少的变量
    if "REFRESH_TOKEN_EXPIRE_MINUTES" not in content:
        print("添加缺少的 REFRESH_TOKEN_EXPIRE_MINUTES 配置...")
        
        # 定位 ACCESS_TOKEN_EXPIRE_MINUTES 行
        access_token_pattern = r'(ACCESS_TOKEN_EXPIRE_MINUTES\s*=\s*\d+.*?\n)'
        match = re.search(access_token_pattern, content, re.DOTALL)
        
        if match:
            # 在ACCESS_TOKEN行后添加REFRESH_TOKEN行
            insert_pos = match.end()
            if 'production' in env_file.lower():
                refresh_line = "REFRESH_TOKEN_EXPIRE_MINUTES=43200  # 30天\n"
            elif 'staging' in env_file.lower():
                refresh_line = "REFRESH_TOKEN_EXPIRE_MINUTES=10080  # 7天\n"
            else:  # 开发环境或其他
                refresh_line = "REFRESH_TOKEN_EXPIRE_MINUTES=86400  # 60天，便于开发测试\n"
            
            content = content[:insert_pos] + refresh_line + content[insert_pos:]
            changes_made = True
        else:
            # 如果找不到ACCESS_TOKEN行，添加到文件末尾
            if 'production' in env_file.lower():
                content += "\n# 刷新令牌过期时间\nREFRESH_TOKEN_EXPIRE_MINUTES=43200  # 30天\n"
            elif 'staging' in env_file.lower():
                content += "\n# 刷新令牌过期时间\nREFRESH_TOKEN_EXPIRE_MINUTES=10080  # 7天\n"
            else:  # 开发环境或其他
                content += "\n# 刷新令牌过期时间\nREFRESH_TOKEN_EXPIRE_MINUTES=86400  # 60天，便于开发测试\n"
            
            changes_made = True
    
    # 检查数据库URL
    if 'production' in env_file.lower() and "DATABASE_URL=" not in content.replace("#", ""):
        print("修复数据库URL配置...")
        db_placeholder = "DATABASE_URL=postgresql://user:password@db-host:5432/app_db\n"
        
        # 查找被注释的数据库行
        commented_db_line = re.search(r'#\s*DATABASE_URL.*?\n', content)
        if commented_db_line:
            # 替换注释的行
            content = content.replace(commented_db_line.group(0), db_placeholder)
        else:
            # 添加到文件中适当位置
            db_section = re.search(r'(#.*?数据库.*?\n)', content)
            if db_section:
                insert_pos = db_section.end()
                content = content[:insert_pos] + db_placeholder + content[insert_pos:]
            else:
                # 如果找不到合适位置，添加到文件末尾
                content += "\n# 数据库配置\n" + db_placeholder
        
        changes_made = True
    
    # 保存修改
    if changes_made:
        # 创建备份文件
        backup_file = f"{env_file}.bak"
        print(f"创建备份文件: {backup_file}")
        with open(backup_file, 'w') as f:
            f.write(content)
        
        # 写入修改后的内容
        with open(env_file, 'w') as f:
            f.write(content)
        
        print(f"配置文件已更新: {env_file}")
        return True
    else:
        print("配置文件已经包含所有必需的变量，无需修改")
        return False

def fix_env_files():
    """修复环境变量文件权限"""
    env_files = [
        os.path.join(backend_dir, ".env"),
        os.path.join(backend_dir, ".env.development"),
        os.path.join(backend_dir, ".env.staging"),
        os.path.join(backend_dir, ".env.production"),
    ]

if __name__ == "__main__":
    # 获取环境文件路径
    if len(sys.argv) > 1:
        env_file = sys.argv[1]
    else:
        # 默认检查所有环境文件
        backend_dir = Path(__file__).parent.parent
        env_files = [
            os.path.join(backend_dir, ".env"),
            os.path.join(backend_dir, ".env.development"),
            os.path.join(backend_dir, ".env.staging"),
            os.path.join(backend_dir, ".env.production"),
        ]
        
        fixed_any = False
        for env_file in env_files:
            if os.path.exists(env_file):
                fixed = add_missing_config(env_file)
                fixed_any = fixed_any or fixed
                print("---")
        
        if not fixed_any:
            print("所有环境文件已经包含必需的配置")
        
        sys.exit(0)
    
    # 处理单个指定的环境文件
    if not os.path.exists(env_file):
        print(f"错误: 文件 {env_file} 不存在")
        sys.exit(1)
    
    add_missing_config(env_file) 