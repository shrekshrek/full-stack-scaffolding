# 前端开发指南

本文档详细说明前端项目的开发规范、技术栈和最佳实践。

## 目录

- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [开发规范](#开发规范)
- [组件开发](#组件开发)
- [状态管理](#状态管理)
- [路由管理](#路由管理)
- [API 集成](#api-集成)
- [测试指南](#测试指南)
- [性能优化](#性能优化)

## 技术栈

- Vue 3
- TypeScript
- Vite
- Pinia
- Vue Router
- Element Plus
- Axios
- Vitest
- ESLint + Prettier

## 项目结构

```
frontend/
├── src/
│   ├── assets/        # 静态资源
│   ├── components/    # 通用组件
│   ├── composables/   # 组合式函数
│   ├── layouts/       # 布局组件
│   ├── pages/         # 页面组件
│   ├── router/        # 路由配置
│   ├── stores/        # 状态管理
│   ├── types/         # TypeScript 类型
│   ├── utils/         # 工具函数
│   ├── App.vue        # 根组件
│   └── main.ts        # 入口文件
├── public/            # 公共资源
├── tests/             # 测试文件
└── vite.config.ts     # Vite 配置
```

## 开发规范

### 1. 命名规范

- 组件名：PascalCase
- 文件名：kebab-case
- 变量名：camelCase
- 常量名：UPPER_SNAKE_CASE
- CSS 类名：kebab-case

### 2. 代码风格

```typescript
// 组件定义
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { User } from '@/types'

// Props 定义
const props = defineProps<{
  userId: string
}>()

// 响应式状态
const user = ref<User | null>(null)

// 生命周期钩子
onMounted(async () => {
  user.value = await fetchUser(props.userId)
})
</script>

<template>
  <div class="user-profile">
    <h1>{{ user?.name }}</h1>
  </div>
</template>

<style scoped>
.user-profile {
  padding: 1rem;
}
</style>
```

### 3. 注释规范

```typescript
/**
 * 用户服务
 * @description 处理用户相关的 API 请求
 */
export class UserService {
  /**
   * 获取用户信息
   * @param userId - 用户ID
   * @returns 用户信息
   */
  async getUser(userId: string): Promise<User> {
    // 实现代码
  }
}
```

## 组件开发

### 1. 组件分类

- 基础组件：Button、Input 等
- 业务组件：UserCard、OrderList 等
- 布局组件：Header、Sidebar 等
- 页面组件：Home、Profile 等

### 2. 组件通信

- Props 向下传递
- Emits 向上传递
- Provide/Inject 跨层级
- Pinia 状态管理

### 3. 组件示例

```vue
<!-- UserCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '@/types'

const props = defineProps<{
  user: User
}>()

const fullName = computed(() => {
  return `${props.user.firstName} ${props.user.lastName}`
})
</script>

<template>
  <div class="user-card">
    <img :src="user.avatar" :alt="fullName" />
    <h3>{{ fullName }}</h3>
    <p>{{ user.email }}</p>
  </div>
</template>
```

## 状态管理

### 1. Pinia 配置

```typescript
// stores/user.ts
import { defineStore } from 'pinia'
import type { User } from '@/types'

export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null as User | null,
    loading: false,
    error: null as string | null
  }),
  
  actions: {
    async fetchUser(id: string) {
      this.loading = true
      try {
        this.currentUser = await userService.getUser(id)
      } catch (error) {
        this.error = error.message
      } finally {
        this.loading = false
      }
    }
  }
})
```

### 2. 状态使用

```vue
<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
</script>

<template>
  <div v-if="userStore.loading">加载中...</div>
  <div v-else-if="userStore.error">{{ userStore.error }}</div>
  <div v-else>
    {{ userStore.currentUser?.name }}
  </div>
</template>
```

## 路由管理

### 1. 路由配置

```typescript
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/pages/Home.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/pages/Profile.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})
```

### 2. 路由守卫

```typescript
// router/guards.ts
import { useUserStore } from '@/stores/user'

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ name: 'Login' })
  } else {
    next()
  }
})
```

## API 集成

### 1. Axios 配置

```typescript
// utils/axios.ts
import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### 2. API 调用

```typescript
// services/user.ts
import { api } from '@/utils/axios'
import type { User } from '@/types'

export const userService = {
  async getUser(id: string): Promise<User> {
    const { data } = await api.get(`/users/${id}`)
    return data
  }
}
```

## 测试指南

### 1. 单元测试

```typescript
// tests/components/UserCard.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import UserCard from '@/components/UserCard.vue'

describe('UserCard', () => {
  it('renders user information correctly', () => {
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    }
    
    const wrapper = mount(UserCard, {
      props: { user }
    })
    
    expect(wrapper.text()).toContain(user.name)
    expect(wrapper.text()).toContain(user.email)
  })
})
```

### 2. E2E 测试

```typescript
// tests/e2e/login.spec.ts
import { test, expect } from '@playwright/test'

test('user can login', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[name="email"]', 'user@example.com')
  await page.fill('input[name="password"]', 'password')
  await page.click('button[type="submit"]')
  
  await expect(page).toHaveURL('/dashboard')
})
```

## 性能优化

### 1. 代码分割

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'element-plus': ['element-plus']
        }
      }
    }
  }
})
```

### 2. 图片优化

```vue
<template>
  <img
    v-lazy="imageUrl"
    :alt="alt"
    loading="lazy"
  />
</template>
```

### 3. 缓存策略

```typescript
// utils/cache.ts
export const cache = {
  set(key: string, value: any, ttl: number) {
    const item = {
      value,
      expiry: Date.now() + ttl
    }
    localStorage.setItem(key, JSON.stringify(item))
  },
  
  get(key: string) {
    const item = localStorage.getItem(key)
    if (!item) return null
    
    const { value, expiry } = JSON.parse(item)
    if (Date.now() > expiry) {
      localStorage.removeItem(key)
      return null
    }
    
    return value
  }
}
```

## 最佳实践

### 1. 性能优化

- 使用代码分割
- 懒加载组件
- 优化图片加载
- 使用缓存策略

### 2. 安全实践

- 输入验证
- XSS 防护
- CSRF 防护
- 敏感信息保护

### 3. 可维护性

- 组件复用
- 代码模块化
- 类型安全
- 文档完善 