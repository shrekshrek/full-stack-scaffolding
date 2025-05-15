<template>
  <div id="app-container" class="min-h-screen bg-gray-50">
    <el-header class="app-header bg-white shadow-sm">
      <div class="container mx-auto flex items-center justify-between h-full px-4">
        <router-link to="/" class="text-xl font-bold text-blue-600 hover:text-blue-800">
          测试应用
        </router-link>
        <nav class="space-x-4">
          <router-link to="/" class="text-gray-600 hover:text-blue-600">首页</router-link>
          <template v-if="authStore.isLoggedIn">
            <router-link to="/dashboard" class="text-gray-600 hover:text-blue-600">仪表盘</router-link>
            <span class="text-gray-700">你好, {{ authStore.currentUser?.username || authStore.currentUser?.email }}</span>
            <el-button type="info" plain size="small" @click="handleLogout">登出</el-button>
          </template>
          <template v-else>
            <router-link to="/login" class="text-gray-600 hover:text-blue-600">登录</router-link>
            <router-link to="/register" class="text-gray-600 hover:text-blue-600">注册</router-link>
          </template>
        </nav>
      </div>
    </el-header>

    <main class="app-main container mx-auto py-6 px-4">
      <router-view v-slot="{ Component, route }">
        <transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>

    <el-footer class="app-footer bg-gray-100 text-center py-4 text-gray-600 text-sm">
      &copy; {{ new Date().getFullYear() }} 测试应用. 保留所有权利.
    </el-footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/features/auth/store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  router.push('/login'); // Redirect to login after logout
};
</script>

<style lang="scss">
/* 
  Global styles can be placed here or in a separate `styles/global.scss` imported in `main.ts`.
  It's often cleaner to keep this file focused on the App shell 
  and manage global styles, resets, and utilities in the `styles` directory.
*/

/* Example: Basic reset or body styling (better in styles/main.scss or styles/_reset.scss) */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50; /* Example text color */
}

#app {
  /* Styles for the main app container if needed */
  /* text-align: center; */ /* Example */
}

.app-header {
  height: 60px; /* Or your preferred height */
  border-bottom: 1px solid #e5e7eb;
}

.app-main {
  min-height: calc(100vh - 60px - 50px); /* Adjust based on header and footer height */
}

.app-footer {
  height: 50px; /* Or your preferred height */
}

/* Transition for router-view */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 