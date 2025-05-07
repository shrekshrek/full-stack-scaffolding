import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userService } from '@/services/user'
import type { User, LoginCredentials, RegisterData } from '@/types/user'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const token = ref<string | null>(localStorage.getItem('token'))
  const user = ref<User | null>(null)
  const loading = ref(false)

  // 计算属性
  const isAuthenticated = computed(() => !!token.value)
  const username = computed(() => user.value?.username || '')

  // 登录方法
  async function login(credentials: LoginCredentials) {
    loading.value = true
    try {
      const data = await userService.login(credentials)
      token.value = data.access_token
      localStorage.setItem('token', data.access_token)
      await fetchCurrentUser()
      return true
    } catch (error) {
      logout()
      throw error
    } finally {
      loading.value = false
    }
  }

  // 注册方法
  async function register(userData: RegisterData) {
    loading.value = true
    try {
      await userService.register(userData)
    } finally {
      loading.value = false
    }
  }

  // 获取当前用户信息
  async function fetchCurrentUser() {
    if (!token.value) return null

    loading.value = true
    try {
      const currentUser = await userService.getCurrentUser()
      user.value = currentUser
      return currentUser
    } catch (error) {
      logout()
      throw error
    } finally {
      loading.value = false
    }
  }

  // 登出方法
  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    // 状态
    token,
    user,
    loading,

    // 计算属性
    isAuthenticated,
    username,

    // 方法
    login,
    register,
    fetchCurrentUser,
    logout
  }
})
