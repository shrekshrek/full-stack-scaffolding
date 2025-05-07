<template>
  <div class="register-container">
    <el-row justify="center" align="middle">
      <el-col :span="24" :sm="16" :md="12" :lg="8" :xl="6">
        <el-card shadow="always" class="register-card">
          <template #header>
            <div class="card-header">
              <h1>用户注册</h1>
            </div>
          </template>

          <el-alert
            v-if="error"
            type="error"
            :title="error"
            :closable="false"
            class="mb-4"
            show-icon
          />
          <el-alert
            v-if="success"
            type="success"
            :title="success"
            :closable="false"
            class="mb-4"
            show-icon
          />

          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-position="top"
            size="large"
            @submit.prevent="handleRegister"
          >
            <el-form-item prop="username" label="用户名">
              <el-input
                v-model="formData.username"
                placeholder="请输入用户名"
                type="text"
                :prefix-icon="UserIcon"
                autofocus
              />
            </el-form-item>

            <el-form-item prop="email" label="邮箱">
              <el-input
                v-model="formData.email"
                placeholder="请输入邮箱地址"
                type="email"
                :prefix-icon="EmailIcon"
              />
            </el-form-item>

            <el-form-item prop="password" label="密码">
              <el-input
                v-model="formData.password"
                placeholder="请输入密码"
                type="password"
                :prefix-icon="PasswordIcon"
                show-password
              />
            </el-form-item>

            <el-form-item prop="confirmPassword" label="确认密码">
              <el-input
                v-model="formData.confirmPassword"
                placeholder="请再次输入密码"
                type="password"
                :prefix-icon="PasswordIcon"
                show-password
              />
            </el-form-item>

            <el-form-item>
              <el-button type="primary" native-type="submit" :loading="loading" style="width: 100%">
                {{ loading ? '注册中...' : '注册' }}
              </el-button>
            </el-form-item>
          </el-form>

          <div class="text-center mt-4">
            <router-link to="/login" class="login-link">已有账号？立即登录</router-link>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'

// 图标导入
const UserIcon = 'i-carbon-user'
const EmailIcon = 'i-carbon-email'
const PasswordIcon = 'i-carbon-password'

const authStore = useAuthStore()
const router = useRouter()
const formRef = ref<FormInstance>()

const formData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// 密码一致性校验
const validatePassword = (_rule: any, value: string, callback: (error?: Error) => void) => {
  if (value !== formData.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应为3-20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少为6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePassword, trigger: 'blur' }
  ]
})

const error = ref('')
const success = ref('')
const loading = ref(false)

const handleRegister = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    error.value = ''
    success.value = ''

    try {
      await authStore.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      })

      // 注册成功
      success.value = '注册成功！正在跳转到登录页...'

      // 延迟跳转到登录页
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      error.value = err.response?.data?.detail || '注册失败，请稍后重试'
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-fill-color-light);
}

.register-card {
  width: 100%;
  max-width: 460px;
  margin: 2rem auto;
}

.card-header {
  text-align: center;
}

.card-header h1 {
  font-size: 1.5rem;
  margin: 0;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.login-link {
  font-size: 0.875rem;
  color: var(--el-color-primary);
  text-decoration: none;
}

.login-link:hover {
  text-decoration: underline;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mt-4 {
  margin-top: 1rem;
}

.text-center {
  text-align: center;
}

@media (max-width: 767px) {
  .register-container {
    padding: 1rem 0.5rem;
  }
}
</style>
