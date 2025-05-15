<template>
  <div class="dashboard-view p-6">
    <el-card class="shadow-md">
      <template #header>
        <div class="text-xl font-semibold">仪表盘 (受保护的页面)</div>
      </template>
      <p v-if="authStore.currentUser">
        欢迎, {{ authStore.currentUser.username || authStore.currentUser.email }}!
      </p>
      <p>这里是您的仪表盘内容。</p>
      <el-alert title="这是一个受保护的页面" type="success" show-icon :closable="false" class="mt-4" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/features/auth/store';

const authStore = useAuthStore();

// You can add any dashboard specific logic here
// For example, fetching data for the dashboard
</script>

<style scoped>
.dashboard-view {
  /* Add any specific styles if needed */
}
</style> 