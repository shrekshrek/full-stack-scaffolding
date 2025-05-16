<template>
  <div class="user-actions-menu flex items-center" v-if="isLoggedIn && currentUser">
    <el-dropdown @command="handleCommand">
      <span class="el-dropdown-link flex items-center cursor-pointer">
        <el-avatar :size="32" :src="currentUser.avatarUrl" class="mr-2">
          {{ currentUser.nickname ? currentUser.nickname[0] : (currentUser.username ? currentUser.username[0] : 'U') }}
        </el-avatar>
        <span class="hidden md:inline">{{ currentUser.nickname || currentUser.username }}</span>
        <el-icon class="el-icon--right hidden md:inline"><arrow-down /></el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">个人中心</el-dropdown-item>
          <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
  <div v-else>
    <router-link to="/login" class="px-3 py-2 hover:text-blue-500">登录</router-link>
    <router-link to="/register" class="px-3 py-2 hover:text-blue-500 ml-2">注册</router-link>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/features/auth/store';
import { ElAvatar, ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon } from 'element-plus';
import { ArrowDown } from '@element-plus/icons-vue';

const router = useRouter();
const authStore = useAuthStore();

const isLoggedIn = computed(() => authStore.isLoggedIn);
const currentUser = computed(() => authStore.currentUser);

const handleCommand = async (command: string | number | object) => {
  if (command === 'profile') {
    router.push('/user-profile'); // Assuming '/user-profile' is the route for user profile
  } else if (command === 'logout') {
    await authStore.logout();
    router.push('/login'); // Or to homepage, depending on desired UX
  }
};
</script>

<style scoped lang="scss">
.user-actions-menu .el-dropdown-link {
  color: var(--el-text-color-primary);
  &:focus {
    outline: none;
  }
}
/* Additional styling if needed */
</style> 