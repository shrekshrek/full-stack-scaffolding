#!/usr/bin/env python3
"""
生成安全密钥的工具脚本
"""
import secrets
import os
import argparse
from pathlib import Path
import re

def generate_secret_key(length=32):
    """生成加密安全的随机密钥"""
    return secrets.token_urlsafe(length)

def update_env_file(file_path, key, value):
    """在环境变量文件中更新指定的密钥"""
    try:
        if not os.path.exists(file_path):
            print(f"文件 {file_path} 不存在")
            return False
        
        with open(file_path, 'r') as file:
            content = file.read()
        
        # 检查是否已经存在这个密钥
        pattern = re.compile(f"^{key}=.*$", re.MULTILINE)
        match = pattern.search(content)
        
        if match:
            # 替换已有的密钥
            new_content = pattern.sub(f"{key}={value}", content)
            print(f"更新密钥 {key}")
        else:
            # 添加新密钥
            new_content = content
            if not new_content.endswith('\n'):
                new_content += '\n'
            new_content += f"{key}={value}\n"
            print(f"添加密钥 {key}")
        
        with open(file_path, 'w') as file:
            file.write(new_content)
        
        return True
    except Exception as e:
        print(f"更新环境变量文件出错: {e}")
        return False

def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='生成安全密钥并更新环境配置')
    parser.add_argument('--env-file', type=str, default='.env',
                        help='要更新的环境变量文件 (默认: .env)')
    parser.add_argument('--key-name', type=str, default='SECRET_KEY',
                        help='密钥的名称 (默认: SECRET_KEY)')
    parser.add_argument('--length', type=int, default=32,
                        help='密钥的长度 (默认: 32字符)')
    parser.add_argument('--print-only', action='store_true',
                        help='仅打印生成的密钥，不更新文件')
    
    args = parser.parse_args()
    
    # 生成密钥
    secret_key = generate_secret_key(args.length)
    
    if args.print_only:
        print(f"{args.key_name}={secret_key}")
    else:
        # 获取相对路径
        env_file = Path(args.env_file)
        
        # 更新环境变量文件
        if update_env_file(env_file, args.key_name, secret_key):
            print(f"成功更新 {env_file} 文件")
            print(f"新生成的 {args.key_name}={secret_key}")
        else:
            print(f"更新 {env_file} 文件失败")
            print(f"请手动添加: {args.key_name}={secret_key}")

if __name__ == "__main__":
    main() 