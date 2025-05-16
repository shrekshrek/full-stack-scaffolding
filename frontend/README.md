# 前端应用

此目录包含项目的前端应用程序。

有关整体项目信息和后端设置，请参阅[项目根 README.md](../../README.md)。

## 概览

- **框架**: Vue 3 (组合式 API 与 `<script setup>`)
- **构建工具**: Vite
- **UI 库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router
- **CSS**: UnoCSS (原子化 CSS)
- **语言**: TypeScript

有关技术栈和开发规范的详细说明，请参阅项目内部的[前端开发规范](mdc:.cursor/rules/frontend-conventions.mdc)。

## 项目结构

重要目录概览：

- `src/`: 包含所有源代码。
  - `main.ts`: 应用程序入口点。
  - `App.vue`: 根 Vue 组件。
  - `router.ts`: 主 Vue Router 配置。
  - `assets/`: 静态资源，如图片和字体。
  - `core/`: 核心模块、共享服务、工具函数、UI 组件和布局。
  - `features/`: 基于功能的模块 (例如 `auth`, `dashboard`)。
  - `styles/`: 全局样式、Element Plus 主题覆盖和 UnoCSS 自定义项。
  - `types/`: 全局 TypeScript 类型定义。

更多详情，请参阅前端规范中的[目录结构指南](mdc:.cursor/rules/frontend-conventions.mdc#2-目录结构与文件命名-功能优先)。

## 开始使用

### 环境准备

- Node.js (版本遵循项目根目录的 `.nvmrc` 文件，或使用最新的 LTS 版本)
- pnpm (版本遵循项目根目录 `package.json` 文件中的 `packageManager` 字段，或使用最新版本)

### 安装依赖

1.  进入 `frontend` 目录:
    ```bash
    cd frontend
    ```

2.  使用 pnpm 安装依赖:
    ```bash
    pnpm install
    ```

### 运行开发服务器

启动 Vite 开发服务器 (通常运行于 `http://localhost:3000` 或 Vite 指定的其他端口):

```bash
pnpm dev
```

开发服务器支持热模块替换 (HMR)。

## 可用脚本命令

在 `frontend` 目录中，您可以通过 pnpm 运行以下脚本命令 (请检查 `package.json` 以获取最新列表):

- `pnpm dev`: 启动开发服务器。
- `pnpm build`: 构建生产版本的应用程序。
- `pnpm preview`: 在本地预览生产构建版本。
- `pnpm lint`: 进行代码检查。
- `pnpm format`: 进行代码格式化。
- `pnpm type-check`: 运行 TypeScript 类型检查。
- `pnpm test`: 运行单元测试。

## 代码规范与约定

所有代码均应遵守已建立的[前端开发规范](mdc:.cursor/rules/frontend-conventions.mdc)和通用的[项目开发规范](mdc:.cursor/rules/project-conventions.mdc)。

## 应用部署

关于构建和部署前端应用程序的说明，请参阅项目根目录下的 [`docs/DEPLOYMENT_GUIDE.md`](../../docs/DEPLOYMENT_GUIDE.md)。
前端应用通常会构建为静态资源，由 Nginx 等 Web 服务器提供服务。 