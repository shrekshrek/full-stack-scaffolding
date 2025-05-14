<template>
  <div class="register-view flex justify-center items-center min-h-screen bg-gray-100">
    <el-card class="w-full max-w-md shadow-lg">
      <template #header>
        <div class="text-2xl font-bold text-center">创建您的账户</div>
      </template>
      <RegisterForm />
      <div class="mt-6 text-center">
        <span class="text-gray-600">已经有账户了？</span>
        <router-link to="/login" class="text-blue-500 hover:text-blue-700 font-medium">
          立即登录
        </router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import RegisterForm from '@/features/auth/components/RegisterForm.vue'

// Logic for RegisterView, if any, would go here.
// For example, handling query params or specific layout concerns.
</script>

<style scoped lang="scss">
.register-view {
  // Add any specific styles for the view container if needed
}
</style> 