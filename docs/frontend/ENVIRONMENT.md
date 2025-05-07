# 前端环境配置指南

本文档详细说明前端项目的环境配置系统，包括环境变量、构建配置和开发工具设置。

## 环境类型

前端项目使用以下环境配置：

| 环境类型 | 配置文件 | 主要用途 |
|---------|----------|---------|
| 开发环境 | `.env.development` | 本地开发使用 |
| 预发布环境 | `.env.staging` | 类生产环境测试 |
| 生产环境 | `.env.production` | 正式上线环境 |

## 环境变量配置

### 核心配置变量

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `VITE_API_BASE_URL` | API基础URL | `/api/v1` |
| `VITE_APP_TITLE` | 应用标题 | `FastAPI + Vue3全栈应用` |
| `VITE_APP_ENV` | 环境标识 | `development`, `staging`, `production` |

### 开发环境配置

```env
# 前端开发环境配置
VITE_API_BASE_URL=/api/v1
VITE_APP_TITLE=FastAPI + Vue3全栈应用 (开发)
VITE_APP_ENV=development
VITE_ENABLE_LOGGER=true
VITE_ENABLE_DEVTOOLS=true
```

### 预发布环境配置

```env
# 前端预发布环境配置
VITE_API_BASE_URL=/api/v1
VITE_APP_TITLE=FastAPI + Vue3全栈应用 (预发布)
VITE_APP_ENV=staging
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ENABLE_ERROR_TRACKING=true
VITE_SHOW_STAGING_BANNER=true
```

### 生产环境配置

```env
# 前端生产环境配置
VITE_API_BASE_URL=/api/v1
VITE_APP_TITLE=FastAPI + Vue3全栈应用
VITE_APP_ENV=production
VITE_ENABLE_PERFORMANCE_MONITORING=true
VITE_ENABLE_ERROR_TRACKING=true
```

## 构建配置

### Vite 配置

```typescript
// vite.config.ts
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL,
          changeOrigin: true
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      // 生产环境优化
      minify: mode === 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor': ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus']
          }
        }
      }
    }
  }
})
```

## 开发工具配置

### VS Code 配置

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "typescript",
    "vue"
  ],
  "vetur.validation.template": false,
  "vetur.validation.script": false,
  "vetur.validation.style": false
}
```

### ESLint 配置

```javascript
// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'plugin:vue/vue3-recommended',
    '@vue/typescript/recommended',
    '@vue/prettier'
  ],
  parserOptions: {
    ecmaVersion: 2021
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}
```

## 环境变量使用

### 在组件中使用

```vue
<script setup lang="ts">
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const appTitle = import.meta.env.VITE_APP_TITLE
</script>
```

### 在构建脚本中使用

```typescript
// build.ts
const env = process.env.VITE_APP_ENV
const isProd = env === 'production'

// 根据环境执行不同的构建逻辑
if (isProd) {
  // 生产环境构建逻辑
} else {
  // 开发环境构建逻辑
}
```

## 环境切换

### 开发环境

```bash
pnpm run dev
```

### 预发布环境

```bash
pnpm run build:staging
```

### 生产环境

```bash
pnpm run build:prod
```

## 常见问题

1. **环境变量未生效**
   - 确保变量名以 `VITE_` 开头
   - 检查 `.env` 文件是否正确加载
   - 重启开发服务器

2. **跨域问题**
   - 检查 `vite.config.ts` 中的代理配置
   - 确认后端 CORS 配置正确

3. **构建失败**
   - 检查环境变量格式
   - 确认所有依赖已正确安装
   - 查看构建日志获取详细错误信息

## 最佳实践

1. **环境变量管理**
   - 敏感信息不要直接写在环境变量中
   - 使用 `.env.example` 作为模板
   - 将 `.env` 文件添加到 `.gitignore`

2. **构建优化**
   - 生产环境启用代码分割
   - 使用 CDN 加速静态资源
   - 启用 gzip 压缩

3. **开发体验**
   - 使用 VS Code 插件提升开发效率
   - 配置自动格式化
   - 启用热更新 