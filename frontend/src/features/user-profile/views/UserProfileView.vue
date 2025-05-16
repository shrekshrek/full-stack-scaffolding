<template>
  <div class="user-profile-page p-4">
    <h1 class="text-2xl font-semibold mb-4">个人资料</h1>
    <div v-if="isLoading" class="text-center">
      <p>正在加载个人信息...</p>
      <!-- Optional: Add a spinner or loading animation -->
    </div>
    <div v-else-if="error" class="text-red-500">
      <p>加载失败: {{ error }}</p>
    </div>
    <div v-else-if="userProfile">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="md:col-span-1">
          <!-- Placeholder for Avatar and basic info -->
          <div class="bg-white shadow rounded-lg p-6 text-center">
            <img 
              :src="userProfile.avatarUrl || 'https://via.placeholder.com/150'" 
              alt="User Avatar" 
              class="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
            />
            <h2 class="text-xl font-semibold">{{ userProfile.username }}</h2>
            <p class="text-gray-600">{{ userProfile.email }}</p>
          </div>
        </div>
        <div class="md:col-span-2">
          <!-- Placeholder for more detailed info -->
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-semibold border-b pb-2 mb-4">详细信息</h3>
            <p><strong>用户ID:</strong> {{ userProfile.id }}</p>
            <p><strong>昵称:</strong> {{ userProfile.nickname || '未设置' }}</p>
            <p><strong>简介:</strong> {{ userProfile.bio || '暂无简介' }}</p>
            <!-- Add more fields as needed -->
            
            <!-- Example: Edit button -->
            <!-- 
            <div class="mt-6">
              <el-button type="primary" @click="handleEditProfile">编辑资料</el-button>
            </div>
            -->
          </div>
        </div>
      </div>
    </div>
    <div v-else class="text-center text-gray-500">
      <p>未能加载用户资料。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useUserProfileStore } from '../store'; // Assuming store is created
import type { UserProfile } from '../types'; // Assuming types are defined

const userProfileStore = useUserProfileStore();

const userProfile = computed(() => userProfileStore.profile);
const isLoading = computed(() => userProfileStore.isLoading);
const error = computed(() => userProfileStore.error);

onMounted(() => {
  // Fetch profile data when component is mounted if not already loaded
  // Consider if data should be fetched here or if authStore already provides some initial user data
  if (!userProfile.value && !isLoading.value) {
    userProfileStore.fetchUserProfile();
  }
});

// const handleEditProfile = () => {
//  // router.push('/profile/edit'); // Or open a modal
//   console.log('Navigate to edit profile page or open modal');
// };

</script>

<style scoped>
/* Add any specific styles for the profile page if needed */
.user-profile-page {
  max-width: 1000px;
  margin: auto;
}
</style> 