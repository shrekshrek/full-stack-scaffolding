<template>
  <div class="not-found-page">
    <div class="not-found-container">
      <h1 class="error-code">404</h1>
      <p class="error-message">页面不存在</p>
      <p class="error-description">您访问的页面可能已被移除或暂时无法使用</p>
      <el-button type="primary" @click="goHome">返回首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.not-found-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 60vh;
}

.not-found-container {
  text-align: center;
  padding: 2rem;
}

.error-code {
  font-size: 6rem;
  font-weight: 700;
  color: var(--el-color-primary);
  margin: 0;
  line-height: 1;
}

.error-message {
  font-size: 1.5rem;
  margin: 1rem 0;
  font-weight: 500;
}

.error-description {
  color: var(--el-text-color-secondary);
  margin-bottom: 2rem;
}
</style>
