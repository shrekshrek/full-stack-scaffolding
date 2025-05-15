<template>
  <div class="not-found-page flex flex-col items-center justify-center min-h-[calc(100vh-110px)] text-center p-6">
    <el-icon :size="80" class="text-gray-400 mb-6"><WarningFilled /></el-icon>
    <h1 class="text-6xl font-bold text-gray-700 mb-4">404</h1>
    <p class="text-2xl text-gray-500 mb-8">哎呀！页面未找到。</p>
    <p class="text-gray-500 mb-8">
      您要查找的页面不存在或已被移动。
    </p>
    <el-button type="primary" size="large" @click="goHome">
      返回首页
    </el-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { WarningFilled } from '@element-plus/icons-vue'; // Import icon

const router = useRouter();

const goHome = () => {
  router.push('/');
};
</script>

<style scoped>
/* min-h is calculated based on app header (60px) and footer (50px) heights */
.not-found-page {
  /* Add any specific styles if needed */
}
</style> 