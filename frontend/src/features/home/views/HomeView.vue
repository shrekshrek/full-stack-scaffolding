<template>
  <div class="home-view p-6">
    <el-card class="shadow-md">
      <template #header>
        <div class="text-xl font-semibold">欢迎来到首页</div>
      </template>
      <p v-if="authStore.isLoggedIn">你好, {{ authStore.currentUser?.username || authStore.currentUser?.email }}!</p>
      <p v-else>请 <router-link to="/login" class="text-blue-500 hover:text-blue-700">登录</router-link> 或 <router-link to="/register" class="text-blue-500 hover:text-blue-700">注册</router-link> 以继续。</p>
      
      <div class="mt-4">
        <el-button type="primary" @click="goToDashboard" v-if="authStore.isLoggedIn">前往仪表盘 (受保护)</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/features/auth/store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const goToDashboard = () => {
  router.push('/dashboard');
};
</script>

<style scoped>
.home-view {
  /* Add any specific styles if needed */
}
</style> 