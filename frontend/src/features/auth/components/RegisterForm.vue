<template>
  <el-form
    ref="registerFormRef"
    :model="registerForm"
    :rules="registerRules"
    label-position="top"
    @submit.prevent="handleSubmit"
  >
    <el-form-item label="用户名" prop="fullName">
      <el-input v-model="registerForm.fullName" placeholder="请输入您的用户名" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="registerForm.email" type="email" placeholder="请输入邮箱地址" />
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" show-password />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input
        v-model="registerForm.confirmPassword"
        type="password"
        placeholder="请再次输入密码"
        show-password
      />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" native-type="submit" :loading="loading" class="w-full">
        注册
      </el-button>
    </el-form-item>
    <div v-if="error" class="text-red-500 text-sm mt-2 text-center">
      {{ error }}
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { useAuthStore } from '@/features/auth/store' // Will be used later
import type { RegisterPayload } from '@/features/auth/types' // Ensure this type exists
import { useRouter } from 'vue-router' // Import and use router for navigation

const registerFormRef = ref<FormInstance>()
const authStore = useAuthStore() // Will be used later
const router = useRouter() // Import and use router for navigation

const registerForm = reactive<RegisterPayload & { confirmPassword?: string }>({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const loading = ref(false) // Placeholder for authStore.isLoading
const error = ref<string | null>(null) // Placeholder for authStore.error

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'))
  } else {
    if (registerForm.confirmPassword !== '') {
      if (!registerFormRef.value) return
      registerFormRef.value.validateField('confirmPassword', () => null)
    }
    callback()
  }
}
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerForm.password) {
    callback(new Error("两次输入的密码不一致!"))
  } else {
    callback()
  }
}

const registerRules = reactive<FormRules>({
  fullName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] },
  ],
  password: [
    { required: true, validator: validatePass, trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validatePass2, trigger: 'blur' }
  ],
})

const handleSubmit = async () => {
  if (!registerFormRef.value) return
  await registerFormRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      error.value = null
      // Simulate registration call
      // console.log('Simulating registration with:', {
      //   fullName: registerForm.fullName,
      //   email: registerForm.email,
      //   password: registerForm.password,
      // });
      // await new Promise(resolve => setTimeout(resolve, 1500));
      const success = await authStore.register({ // Will be used later
        fullName: registerForm.fullName,
        email: registerForm.email,
        password: registerForm.password,
      });
      // const success = Math.random() > 0.3; // Simulate success/failure
      if (success) {
        console.log('Registration successful (simulated)');
        router.push('/'); // Redirect on success
      } else {
        error.value = authStore.error || '注册失败，请稍后重试';
        console.error('Registration failed (simulated)');
      }
      loading.value = false
    }
  })
}
</script>

<style scoped>
/* Add any component-specific styles here if needed */
</style> 