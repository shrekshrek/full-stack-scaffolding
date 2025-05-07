/**
 * 用户信息接口
 */
export interface User {
  /** 用户ID */
  id: number
  /** 电子邮箱 */
  email: string
  /** 用户名 */
  username: string
  /** 是否激活 */
  is_active: boolean
  /** 是否为超级用户 */
  is_superuser: boolean
  /** 创建时间 */
  created_at?: string
  /** 上次登录时间 */
  last_login?: string
}

/**
 * 登录凭证接口
 */
export interface LoginCredentials {
  /** 用户邮箱 */
  email: string
  /** 用户密码 */
  password: string
}

/**
 * 登录响应接口
 */
export interface LoginResponse {
  /** JWT访问令牌 */
  access_token: string
  /** 令牌类型 */
  token_type?: string
}

/**
 * 注册数据接口
 */
export interface RegisterData {
  /** 用户邮箱 */
  email: string
  /** 用户名 */
  username: string
  /** 用户密码 */
  password: string
}

/**
 * 身份验证状态接口
 */
export interface AuthState {
  /** JWT令牌 */
  token: string | null
  /** 当前用户信息 */
  user: User | null
  /** 是否已认证 */
  isAuthenticated: boolean
}
