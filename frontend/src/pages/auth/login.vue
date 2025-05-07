<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <h2>用户登录</h2>
          <p class="subtitle">登录以访问您的待办事项</p>
        </div>
      </template>

      <el-form
        ref="loginForm"
        :model="formData"
        :rules="rules"
        label-position="top"
        @submit.prevent="handleLogin"
      >
        <el-form-item label="邮箱" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入邮箱"
            :prefix-icon="UserIcon"
            autocomplete="email"
            type="email"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码"
            :prefix-icon="PasswordIcon"
            autocomplete="current-password"
            show-password
          />
        </el-form-item>

        <div class="form-actions">
          <el-button type="primary" native-type="submit" :loading="loading" class="submit-btn">
            登录
          </el-button>
        </div>

        <div class="form-footer">
          <p>
            还没有账号？
            <router-link to="/register" class="register-link">立即注册</router-link>
          </p>
        </div>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuth } from '@/hooks/useAuth'
import type { FormInstance, FormRules } from 'element-plus'

// 图标
const UserIcon = 'i-carbon-user'
const PasswordIcon = 'i-carbon-password'

// 表单和验证
const loginForm = ref<FormInstance>()
const loading = ref(false)
const formData = reactive({
  username: '',
  password: ''
})

// 使用认证钩子
const { login } = useAuth()

// 表单校验规则
const rules: FormRules = {
  username: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 30, message: '密码长度应为6-30个字符', trigger: 'blur' }
  ]
}

// 处理登录
const handleLogin = async () => {
  if (!loginForm.value) return

  await loginForm.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        await login(formData.username, formData.password)
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<style scoped>
.login-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
}

.login-card {
  width: 100%;
  max-width: 450px;
  border-radius: 8px;
}

.card-header {
  text-align: center;
}

.card-header h2 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.subtitle {
  color: var(--el-text-color-secondary);
  margin-bottom: 0;
}

.form-actions {
  margin-top: 1.5rem;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
}

.form-footer {
  margin-top: 1.5rem;
  text-align: center;
  color: var(--el-text-color-secondary);
}

.register-link {
  color: var(--el-color-primary);
  text-decoration: none;
  font-weight: 500;
}

.register-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    box-shadow: none;
  }

  .login-container {
    padding: 1rem 0.5rem;
  }
}
</style>
