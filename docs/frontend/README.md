# 前端技术文档

本文档描述了项目前端的架构设计和实现细节。

## 前端架构

项目前端使用Vue 3构建，主要特点：

- 组合式API (Composition API)
- TypeScript类型支持
- Pinia状态管理
- Vue Router路由管理
- 响应式设计
- Vite构建工具

## 目录结构

```
frontend/
├── public/               # 静态资源
├── src/                  # 源代码
│   ├── assets/           # 静态资源
│   │   └── scss/         # SCSS样式
│   ├── components/       # Vue组件
│   │   ├── common/       # 通用UI组件
│   │   ├── layout/       # 布局组件
│   │   └── features/     # 功能组件
│   ├── composables/      # 组合式函数
│   ├── router/           # 路由配置
│   ├── stores/           # Pinia状态
│   ├── services/         # API服务
│   ├── types/            # TypeScript类型
│   ├── utils/            # 工具函数
│   └── views/            # 页面视图
├── tests/                # 测试目录
└── package.json          # 依赖配置
```

## 组件结构

前端组件已按功能和用途分为三层：

1. **通用组件** (`components/common/`)
   - 独立、可复用的UI组件
   - 如 `HelloWorld.vue` - 示例欢迎组件
   - 不包含业务逻辑
   - 适合在多个场景重复使用

2. **布局组件** (`components/layout/`)
   - 处理页面布局和结构
   - 如 `AppLayout.vue` - 全局应用布局组件
   - 提供整体页面框架
   - 通常包含导航、侧边栏、页脚等

3. **功能组件** (`components/features/`)
   - 特定功能的业务组件
   - 如 `TodoItem.vue` - 待办事项组件
   - 实现特定的业务场景
   - 通常包含具体业务逻辑

## 状态管理

使用Pinia进行状态管理，主要store包括：

- **AuthStore** - 处理用户认证状态和权限
- **TodoStore** - 管理待办事项数据
- **UserStore** - 用户信息管理
- **AppStore** - 应用全局状态

## API通信

与后端通信的关键模块：

- **API客户端**
  - 使用axios进行HTTP请求
  - 基础URL配置为环境变量`VITE_API_BASE_URL`
  - 统一的请求/响应拦截器
  - 支持请求重试、错误处理、请求去重
  - 自动处理认证令牌

- **服务模块**
  - userService - 用户认证和管理
  - todoService - 待办事项管理

## 工具函数库

前端提供了一系列实用工具函数：

1. **日期处理** (`utils/dateFormat.ts`)
   - 提供日期格式化功能
   - 支持相对时间显示（如"3分钟前"）
   - 提供多种日期展示格式

2. **本地存储** (`utils/storage.ts`)
   - localStorage操作的类型安全封装
   - 支持复杂对象的自动序列化和反序列化
   - 提供命名空间防止键名冲突

## 环境配置

前端支持多环境构建：

- **开发环境** (`.env.development`)
- **预发布环境** (`.env.staging`) 
- **生产环境** (`.env.production`)

每个环境可配置不同的API基础URL、应用标题等参数。

## 开发注意事项

1. 遵循Vue 3组合式API最佳实践
2. 组件按照通用/布局/功能三层架构组织
3. 使用TypeScript类型提高代码质量
4. 将通用逻辑抽取到工具函数和组合式函数
5. 分离UI和业务逻辑 