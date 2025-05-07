# 后端工具脚本

本目录包含了一些用于后端开发和部署的辅助脚本。

## 脚本列表

### 1. setup_env_files.py

环境配置文件生成脚本，用于生成不同环境的配置文件。

```bash
# 生成开发环境配置（默认）
python scripts/setup_env_files.py

# 生成预发布环境配置
python scripts/setup_env_files.py --env staging

# 生成生产环境配置
python scripts/setup_env_files.py --env production
```

脚本会生成以下文件：
- `.env.development` (开发环境模板)
- `.env.staging` (预发布环境模板)
- `.env.production` (生产环境模板)
- `.env` (当前环境的软链接，指向对应的环境模板)

### 2. download_static_files.py

下载必要的静态文件（如 Swagger UI、Redoc 等）到 backend/static 目录。

```bash
python scripts/download_static_files.py
```

下载的文件包括：
- swagger-ui-bundle.js
- swagger-ui.css
- redoc.standalone.js

### 3. gen_secrets.py

生成安全密钥的工具脚本。

```bash
# 默认更新 .env 文件中的 SECRET_KEY
python scripts/gen_secrets.py

# 指定环境文件和密钥名称
python scripts/gen_secrets.py --env-file .env.production --key-name JWT_SECRET

# 仅打印生成的密钥，不更新文件
python scripts/gen_secrets.py --print-only
```

## 使用说明

1. 所有脚本都应该在 backend 目录下运行
2. 确保已安装所需的依赖（requirements.txt）
3. 脚本执行前会自动创建必要的目录

## 环境配置说明

1. 环境配置文件采用模板+软链接的方式：
   - `.env.development`、`.env.staging`、`.env.production` 作为环境模板
   - `.env` 作为软链接，指向当前使用的环境模板
   - 使用 `setup_env_files.py --env <环境>` 切换环境

2. 注意事项：
   - 环境配置文件（.env.*）包含敏感信息，不要提交到版本控制系统
   - 生产环境的密钥应该妥善保管，建议使用密钥管理系统
   - 静态文件的下载可能需要代理，请确保网络连接正常 