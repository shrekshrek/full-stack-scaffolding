<template>
  <div class="login-view flex justify-center items-center min-h-screen bg-gray-100">
    <el-card class="w-full max-w-sm shadow-lg">
      <template #header>
        <div class="text-2xl font-bold text-center">欢迎回来</div>
      </template>
      
      <LoginForm />
      
      <div class="mt-6 text-center">
        <span class="text-gray-600">还没有账户？</span>
        <router-link to="/register" class="text-blue-500 hover:text-blue-700 font-medium">
          立即注册
        </router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import LoginForm from '@/features/auth/components/LoginForm.vue';
// Removed unused imports: reactive, ref, useRouter, useAuthStore
// Removed unused variables: loginData, loading, error, handleLoginSubmit
</script>

<style scoped lang="scss">
.login-view {
  // Add any specific styles for the view container if needed
}
</style> 