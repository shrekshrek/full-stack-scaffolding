<template>
  <div class="login-view flex justify-center items-center min-h-screen bg-gray-100">
    <el-card class="w-full max-w-sm shadow-lg">
      <template #header>
        <div class="text-2xl font-bold text-center">欢迎回来</div>
      </template>
      
      <!-- Placeholder for LoginForm component or inline form -->
      <el-form @submit.prevent="handleLoginSubmit">
        <el-form-item label="邮箱">
          <el-input v-model="loginData.email" type="email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginData.password" type="password" placeholder="请输入密码" show-password />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" class="w-full" :loading="loading">
            登录
          </el-button>
        </el-form-item>
        <div v-if="error" class="text-red-500 text-sm mt-2 text-center">
          {{ error }}
        </div>
      </el-form>
      
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
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/features/auth/store'

const router = useRouter()
const authStore = useAuthStore()

const loginData = reactive({
  email: '',
  password: '',
})

const loading = ref(false)
const error = ref<string | null>(null)

const handleLoginSubmit = async () => {
  loading.value = true
  error.value = null
  const success = await authStore.login(loginData)
  if (success) {
    router.push('/') // Redirect to homepage or dashboard on successful login
  } else {
    error.value = authStore.error || '登录失败，请检查您的凭据。'
  }
  loading.value = false
}

// TODO: Create a dedicated LoginForm.vue component later if the form becomes complex.
</script>

<style scoped lang="scss">
.login-view {
  // Add any specific styles for the view container if needed
}
</style> 