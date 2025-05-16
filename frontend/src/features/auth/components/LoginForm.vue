<template>
  <el-form @submit.prevent="handleLoginSubmit" ref="loginFormRef" :model="loginData">
    <el-form-item prop="username" label="用户名" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
      <el-input v-model="loginData.username" type="text" placeholder="请输入用户名" />
    </el-form-item>
    <el-form-item prop="password" label="密码" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
      <el-input v-model="loginData.password" type="password" placeholder="请输入密码" show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit" class="w-full" :loading="loading">
        登录
      </el-button>
    </el-form-item>
    <div v-if="formError" class="text-red-500 text-sm mt-2 text-center">
      {{ formError }}
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/features/auth/store';
import type { FormInstance } from 'element-plus';

const router = useRouter();
const authStore = useAuthStore();

const loginFormRef = ref<FormInstance>();

const loginData = reactive({
  username: '',
  password: '',
});

const loading = ref(false);
const formError = ref<string | null>(null);

const handleLoginSubmit = async () => {
  if (!loginFormRef.value) return;
  
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true;
      formError.value = null;
      const success = await authStore.login(loginData);
      if (success) {
        router.push('/'); // Redirect to homepage or dashboard
      } else {
        formError.value = authStore.error || '登录失败，请检查您的凭据。';
      }
      loading.value = false;
    } else {
      console.log('Login form validation failed');
    }
  });
};
</script>

<style scoped>
/* Add any specific styles for the form if needed */
</style> 