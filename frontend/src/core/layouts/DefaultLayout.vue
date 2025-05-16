<template>
  <div class="default-layout-container min-h-screen bg-gray-50">
    <el-header class="app-header bg-white shadow-sm">
      <div class="container mx-auto flex items-center justify-between h-full px-4">
        <router-link to="/" class="text-xl font-bold text-blue-600 hover:text-blue-800">
          测试应用 <!-- Consistent App Name -->
        </router-link>
        <nav class="space-x-4 flex items-center">
          <router-link to="/" class="text-gray-600 hover:text-blue-600">首页</router-link>
          <router-link v-if="authStore.isLoggedIn" to="/dashboard" class="text-gray-600 hover:text-blue-600">仪表盘</router-link>
          <UserActionsMenu />
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
      &copy; {{ new Date().getFullYear() }} 测试应用. 保留所有权利. <!-- Consistent App Name -->
    </el-footer>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/features/auth/store';
import UserActionsMenu from '@/core/ui/UserActionsMenu.vue';
// Removed useRouter as navigation is handled by router-link or UserActionsMenu
// import { computed } from 'vue'; // Not directly used here now, but authStore has them

const authStore = useAuthStore();

// isLoggedIn and currentUser computed properties are available via authStore directly in template if needed
// or within UserActionsMenu component.
</script>

<style scoped lang="scss">
/* Styles copied from App.vue, with slight adjustments for DefaultLayout context if any */
.default-layout-container {
  /* Renamed from #app-container if it was an ID */
}

.app-header {
  height: 60px; 
  border-bottom: 1px solid #e5e7eb;
}

.app-main {
  min-height: calc(100vh - 60px - 50px); 
  flex-grow: 1; /* Ensure main content takes available space if layout is flex */
}

.app-footer {
  height: 50px; 
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