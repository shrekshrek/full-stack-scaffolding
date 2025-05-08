# 前端技术文档

本文档描述了项目前端的架构设计和实现细节。

## 前端架构

项目前端使用Vue 3构建，主要特点：

- 组合式API (Composition API)
- TypeScript类型支持
- Pinia状态管理
- Vue Router路由管理
- UnoCSS原子化CSS
- 响应式设计
- Vite构建工具

## 项目结构

前端项目采用模块化的结构组织：

```
frontend/
├── src/                  # 源代码目录
│   ├── components/       # 全局共用组件（扁平结构）
│   ├── layouts/          # 页面布局组件
│   ├── pages/            # 业务功能页面
│   │   └── [page-name]/  # 具体页面
│   │       ├── index.vue # 页面组件
│   │       └── components/# 页面专属组件
│   ├── stores/           # 状态管理
│   ├── services/         # API服务
│   ├── composables/      # 可复用的组合式函数
│   └── ...其他模块
├── public/               # 静态资源
└── ...配置文件
```

> 详细的项目结构和说明请参考[前端开发指南](GUIDE.md#项目结构)

## 核心功能模块

### 状态管理

使用Pinia进行状态管理，主要store包括：

- **AuthStore** - 处理用户认证状态和权限
- **TodoStore** - 管理待办事项数据
- **UserStore** - 用户信息管理
- **AppStore** - 应用全局状态

### 组合式函数（Composables）

项目使用Vue 3的组合式API将可复用的逻辑抽取到composables中：

- **useAuth** - 身份验证相关功能
- **useTodos** - 待办事项管理功能

### API通信

与后端通信的关键模块：

- **API客户端** - 使用axios进行HTTP请求
- **服务模块** - 封装业务逻辑的API调用

### 工具函数库

前端提供了一系列实用工具函数，包括日期处理、本地存储等。

## 环境配置

前端支持多环境构建：

- **开发环境** (`.env.development`)
- **预发布环境** (`.env.staging`) 
- **生产环境** (`.env.production`)

> 详细配置说明请参考[前端环境配置](ENVIRONMENT.md)

## 开发注意事项

1. 遵循Vue 3组合式API最佳实践
2. 使用统一的项目结构组织代码
3. 使用TypeScript类型提高代码质量
4. 将通用逻辑抽取到composables和utils中
5. 使用Pinia进行状态管理
6. 分离UI和业务逻辑

## 相关文档

- [前端开发指南](GUIDE.md) - 详细的开发规范和最佳实践
- [前端环境配置](ENVIRONMENT.md) - 环境变量和构建配置 