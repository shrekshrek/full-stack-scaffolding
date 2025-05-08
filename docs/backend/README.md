# 后端技术文档

本文档描述了项目后端的架构设计和实现细节。

## 后端架构

项目后端使用FastAPI框架构建，主要特点：

- RESTful API设计
- JWT身份验证
- SQLAlchemy异步ORM数据库访问
- 仓储模式设计
- 异步请求处理
- 自动生成API文档

## 项目结构

后端项目采用模块化的结构组织：

```
backend/
├── app/                  # 应用主目录
│   ├── api/             # API路由
│   ├── core/            # 核心配置
│   ├── models/          # 数据模型
│   ├── schemas/         # 数据验证模式
│   ├── services/        # 业务逻辑
│   ├── repositories/    # 数据访问层
│   └── middlewares/     # 中间件
├── tests/                # 测试目录
├── migrations/           # 数据库迁移脚本
└── ...配置文件
```

> 详细的项目结构和说明请参考[后端开发指南](GUIDE.md#项目结构)

## 核心功能模块

### 数据访问层

采用仓储模式隔离数据访问逻辑：

```python
# 仓储类
class TodoRepository:
    def __init__(self, db_session: AsyncSession):
        self.db_session = db_session

    async def get_by_id(self, todo_id: int) -> Optional[Todo]:
        result = await self.db_session.execute(
            select(Todo).filter(Todo.id == todo_id)
        )
        return result.scalars().first()
```

### 业务服务层

处理核心业务逻辑，调用仓储层：

```python
# 服务层
async def get_todo(db: AsyncSession, todo_id: int) -> Optional[Todo]:
    repo = TodoRepository(db)
    return await repo.get_by_id(todo_id)
```

### 认证授权

使用JWT实现用户认证和权限控制。

## 关键优化

后端实施了多项优化，主要包括：

### 安全性增强
- JWT认证流程增强（令牌刷新、令牌类型区分）
- 密码强度验证和安全哈希
- 请求速率限制

### 异常处理与日志
- 统一异常处理中间件
- 结构化JSON日志
- 请求跟踪和性能监控

### 数据库优化
- 异步连接池管理优化
- 仓储模式标准化实现
- 自动化数据库迁移

## 环境配置

后端支持多环境部署：

- **开发环境** (`.env.development`)
- **预发布环境** (`.env.staging`) 
- **生产环境** (`.env.production`)

> 详细配置说明请参考[后端环境配置](ENVIRONMENT.md)

## 开发注意事项

1. 遵循仓储模式分离数据访问逻辑
2. 使用环境变量管理配置
3. 编写测试确保代码质量
4. 使用Alembic管理数据库迁移
5. 将业务逻辑放在service层，保持控制器简洁

## 相关文档

- [后端开发指南](GUIDE.md) - 详细的开发规范和最佳实践
- [后端环境配置](ENVIRONMENT.md) - 环境变量和配置说明 