import { post, get } from './api'
import type { LoginCredentials, User, RegisterData, LoginResponse } from '@/types/user'

export const userService = {
  /**
   * 用户登录
   * @param credentials 登录凭证
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const formData = new URLSearchParams()
    formData.append('username', credentials.email)
    formData.append('password', credentials.password)

    return post<LoginResponse>('/auth/login', formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Allow-Duplicate': 'true'
      }
    })
  },

  /**
   * 获取当前用户信息
   */
  async getCurrentUser(): Promise<User> {
    return get<User>('/users/me')
  },

  /**
   * 注册新用户
   * @param userData 用户注册数据
   */
  async register(userData: RegisterData) {
    return post('/users', userData)
  }
}
