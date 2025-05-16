<template>
  <div class="user-profile-page p-4">
    <h1 class="text-2xl font-semibold mb-4">个人资料</h1>
    <div v-if="authStore.isLoading && !currentUser" class="text-center">
      <p>正在加载个人信息...</p>
    </div>
    <div v-else-if="authStore.error && !currentUser" class="text-red-500">
      <p>加载失败: {{ authStore.error }}</p>
    </div>
    <div v-else-if="currentUser">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-1">
          <div class="bg-white shadow rounded-lg p-6 text-center">
            <img 
              :src="currentUser.avatarUrl || 'https://via.placeholder.com/150'" 
              alt="User Avatar" 
              class="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h2 class="text-xl font-semibold">{{ currentUser.nickname || currentUser.username }}</h2>
            <p class="text-gray-600">{{ currentUser.email }}</p>
          </div>
        </div>
        <div class="md:col-span-2">
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-semibold border-b pb-2 mb-4">详细信息</h3>
            <p><strong>用户ID:</strong> {{ currentUser.id }}</p>
            <p><strong>用户名:</strong> {{ currentUser.username }}</p>
            <p><strong>昵称:</strong> {{ currentUser.nickname || '未设置' }}</p>
            <p v-if="currentUser.roles && currentUser.roles.length > 0"><strong>角色:</strong> {{ currentUser.roles.join(', ') }}</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500">
      <p>未能加载用户资料，或用户未登录。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '@/features/auth/store';

const authStore = useAuthStore();

const currentUser = computed(() => authStore.currentUser);

</script>

<style scoped>
.user-profile-page {
  max-width: 1000px;
  margin: auto;
}
</style> 