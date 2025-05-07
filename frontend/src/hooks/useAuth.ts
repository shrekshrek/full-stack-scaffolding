import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute, RouteLocationRaw } from 'vue-router'
import { ElNotification } from 'element-plus'

/**
 * 身份验证相关的钩子函数
 * 提供登录、注册、登出和重定向等功能
 */
export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const route = useRoute()

  /**
   * 用户登录
   * @param username 用户名
   * @param password 密码
   * @param redirectPath 登录成功后的重定向路径
   */
  const login = async (username: string, password: string, redirectPath?: string) => {
    try {
      await authStore.login({
        email: username, // 这里使用username作为email参数
        password
      })

      ElNotification({
        title: '登录成功',
        message: `欢迎回来，${username}！`,
        type: 'success'
      })

      // 获取重定向路径，优先使用传入的参数，其次是URL中的查询参数，默认是首页
      const redirect = redirectPath || (route.query.redirect as string) || '/'

      router.push(redirect as RouteLocationRaw)
    } catch (error: any) {
      ElNotification({
        title: '登录失败',
        message: error.message || '用户名或密码错误',
        type: 'error'
      })
    }
  }

  /**
   * 用户注册
   * @param username 用户名
   * @param email 邮箱
   * @param password 密码
   */
  const register = async (username: string, email: string, password: string) => {
    try {
      await authStore.register({
        username,
        email,
        password
      })

      ElNotification({
        title: '注册成功',
        message: '您的账号已创建成功，现在可以登录了',
        type: 'success'
      })

      router.push('/login')
    } catch (error: any) {
      ElNotification({
        title: '注册失败',
        message: error.message || '注册过程中发生错误',
        type: 'error'
      })
    }
  }

  /**
   * 用户登出
   * @param redirectPath 登出后的重定向路径
   */
  const logout = (redirectPath: string = '/login') => {
    authStore.logout()

    ElNotification({
      title: '已登出',
      message: '您已成功退出登录',
      type: 'info'
    })

    router.push(redirectPath)
  }

  /**
   * 检查用户是否已认证
   * @param redirectToLogin 如果未认证，是否重定向到登录页
   * @returns 是否已认证
   */
  const checkAuth = (redirectToLogin: boolean = false): boolean => {
    const isAuthenticated = authStore.isAuthenticated

    if (!isAuthenticated && redirectToLogin) {
      router.push({
        path: '/login',
        query: { redirect: route.fullPath }
      })
    }

    return isAuthenticated
  }

  return {
    login,
    register,
    logout,
    checkAuth,
    isAuthenticated: authStore.isAuthenticated,
    user: authStore.user,
    username: authStore.username
  }
}
