# 后端部署工具

本目录包含用于部署后端应用的各种工具和配置文件。

## 目录内容

- `fastapi-app.service` - 用于生产环境的systemd服务文件
- `fastapi-app-staging.service` - 用于预发布环境的systemd服务文件
- `install-service.sh` - 安装systemd服务的脚本

## 使用方法

### 在Linux服务器上使用systemd管理应用

1. 将部署目录上传到服务器
2. 进入部署目录
3. 给脚本添加执行权限: `chmod +x install-service.sh`
4. 安装服务:
   - 生产环境: `sudo ./install-service.sh production`
   - 预发布环境: `sudo ./install-service.sh staging`

### 手动管理服务

```bash
# 启动服务
sudo systemctl start fastapi-app  # 生产环境
sudo systemctl start fastapi-app-staging  # 预发布环境

# 停止服务
sudo systemctl stop fastapi-app
sudo systemctl stop fastapi-app-staging

# 重启服务
sudo systemctl restart fastapi-app
sudo systemctl restart fastapi-app-staging

# 查看服务状态
sudo systemctl status fastapi-app
sudo systemctl status fastapi-app-staging

# 查看服务日志
sudo journalctl -u fastapi-app -f
sudo journalctl -u fastapi-app-staging -f
```

## 安全注意事项

1. 服务文件中的`User`和`Group`应设置为一个专用的非root用户
2. 确保应用目录和文件权限正确设置
3. 建议定期更新服务配置以添加最新的安全措施

## 故障排除

如果服务无法启动，检查以下几点:

1. 环境配置文件(.env.production或.env.staging)是否存在且正确配置
2. Python虚拟环境是否正确安装且包含所有依赖
3. 数据库连接是否可用
4. 应用目录权限是否正确

可以通过以下命令查看详细的启动错误:

```bash
sudo journalctl -u fastapi-app -n 50
``` 