<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { ElNotification } from 'element-plus'
import MainLayout from '@/layouts/MainLayout.vue'

const authStore = useAuthStore()

// 应用启动时检查是否已登录
onMounted(async () => {
  if (localStorage.getItem('token')) {
    try {
      await authStore.fetchCurrentUser()
    } catch (error: any) {
      console.error('加载用户信息失败', error)

      ElNotification({
        title: '用户会话已过期',
        message: '请重新登录以继续使用',
        type: 'warning'
      })
    }
  }
})
</script>

<template>
  <div class="app-container">
    <MainLayout>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </MainLayout>
  </div>
</template>

<style>
.app-container {
  width: 100% !important;
  min-height: 100vh !important;
  background-color: #ffffff !important; /* 强制使用白色背景 */
  display: block !important;
  overflow-x: hidden !important; /* 防止水平滚动条 */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
