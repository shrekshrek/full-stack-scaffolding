#!/usr/bin/env python3
import os
import requests
from pathlib import Path


def download_file(url: str, save_path: str):
    """下载文件到指定路径"""
    response = requests.get(url)
    response.raise_for_status()

    # 确保目录存在
    os.makedirs(os.path.dirname(save_path), exist_ok=True)

    # 保存文件
    with open(save_path, "wb") as f:
        f.write(response.content)
    print(f"已下载: {save_path}")


def main():
    # 获取backend目录的路径
    backend_dir = Path(__file__).parent.parent
    # 获取静态文件目录
    static_dir = backend_dir / "static"
    static_dir.mkdir(exist_ok=True)

    # 要下载的文件列表 - 使用国内CDN
    files_to_download = {
        "swagger-ui-bundle.js": "https://cdn.bootcdn.net/ajax/libs/swagger-ui/5.12.0/swagger-ui-bundle.js",
        "swagger-ui.css": "https://cdn.bootcdn.net/ajax/libs/swagger-ui/5.12.0/swagger-ui.css",
        "redoc.standalone.js": "https://cdn.bootcdn.net/ajax/libs/redoc/2.1.3/redoc.standalone.js",
    }

    # 下载所有文件
    for filename, url in files_to_download.items():
        try:
            save_path = static_dir / filename
            download_file(url, str(save_path))
        except Exception as e:
            print(f"下载 {filename} 失败: {str(e)}")


if __name__ == "__main__":
    main()
