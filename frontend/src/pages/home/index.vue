<template>
  <div class="container mx-auto py-12 px-4 text-center">
    <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">全栈应用</h1>
    <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
      欢迎来到基于FastAPI和Vue的全栈示例应用
    </p>

    <div v-if="!authStore.isAuthenticated" class="flex gap-4 justify-center">
      <router-link to="/login" class="btn-primary">登录</router-link>
      <router-link to="/register" class="btn-secondary">注册</router-link>
    </div>

    <div v-else class="card max-w-md mx-auto p-6">
      <p class="text-xl mb-4">
        👋 欢迎回来，
        <span class="font-bold text-primary">{{ authStore.username }}</span>
      </p>
      <div class="flex gap-4 justify-center mt-6">
        <router-link to="/profile" class="btn-primary">个人资料</router-link>
        <router-link to="/todo" class="btn-secondary">待办事项</router-link>
        <button class="btn-danger" @click="logout">退出登录</button>
      </div>
    </div>

    <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
      <div class="card p-6">
        <div class="text-3xl mb-4 text-primary">🚀</div>
        <h2 class="text-xl font-bold mb-2">快速开发</h2>
        <p class="text-gray-600">基于现代工具链的全栈应用，开发效率高</p>
      </div>

      <div class="card p-6">
        <div class="text-3xl mb-4 text-primary">🔒</div>
        <h2 class="text-xl font-bold mb-2">安全可靠</h2>
        <p class="text-gray-600">采用JWT认证，保障API安全</p>
      </div>

      <div class="card p-6">
        <div class="text-3xl mb-4 text-primary">📱</div>
        <h2 class="text-xl font-bold mb-2">响应式设计</h2>
        <p class="text-gray-600">完美适配各种设备屏幕</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

// 退出登录方法
const logout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #4f46e5;
  color: #fff;
}

.btn-secondary {
  background-color: #e5e7eb;
  color: #1f2937;
}

.btn-danger {
  background-color: #ef4444;
  color: #fff;
  margin-left: 1rem;
  border: none;
}

.btn-primary:hover {
  background-color: #4338ca;
}

.btn-secondary:hover {
  background-color: #d1d5db;
}

.btn-danger:hover {
  background-color: #dc2626;
}
</style>
