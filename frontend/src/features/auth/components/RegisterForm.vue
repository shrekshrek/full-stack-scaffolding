<template>
  <el-form
    ref="registerFormRef"
    :model="registerForm"
    :rules="rules"
    label-width="120px"
    class="register-form"
    @submit.prevent="handleSubmit"
  >
    <el-form-item label="用户名" prop="username">
      <el-input v-model="registerForm.username" placeholder="请输入您的用户名" />
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
      <el-button type="primary" native-type="submit" :loading="isLoading">
        注册
      </el-button>
    </el-form-item>
    <el-form-item v-if="errorMsg">
      <p class="text-red-500">{{ errorMsg }}</p>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ElForm, ElFormItem, ElInput, ElButton, type FormInstance, type FormRules } from 'element-plus';
import { useAuthStore } from '@/features/auth/store';
import type { RegisterPayload } from '@/features/auth/types';

const router = useRouter();
const authStore = useAuthStore();

const registerFormRef = ref<FormInstance>();

const registerForm = reactive<Omit<RegisterPayload, 'email' | 'password'> & { username: string; email: string; password: string; confirmPassword: string }>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const isLoading = computed(() => authStore.isLoading);
const errorMsg = computed(() => authStore.error);

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入密码'));
  } else {
    if (registerForm.confirmPassword !== '') {
      if (!registerFormRef.value) return;
      registerFormRef.value.validateField('confirmPassword', () => null);
    }
    callback();
  }
};

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'));
  } else if (value !== registerForm.password) {
    callback(new Error("两次输入的密码不一致!"));
  } else {
    callback();
  }
};

const rules = reactive<FormRules>({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: ['blur', 'change'] },
  ],
  password: [{ validator: validatePass, trigger: 'blur', required: true }],
  confirmPassword: [{ validator: validatePass2, trigger: 'blur', required: true }],
});

const handleSubmit = async () => {
  if (!registerFormRef.value) return;
  try {
    const valid = await registerFormRef.value.validate();
    if (valid) {
      const payload: RegisterPayload = {
        username: registerForm.username,
        email: registerForm.email,
        password: registerForm.password,
      };
      const success = await authStore.register(payload);
      if (success) {
        router.push('/');
      }
    }
  } catch (error) {
    // Validation failed, error is already handled by Element Plus form messages.
    // console.error('Validation failed:', error);
  }
};
</script>

<style scoped>
.register-form {
  max-width: 500px;
  margin: auto;
}
.text-red-500 {
  color: #f56c6c;
}
</style> 