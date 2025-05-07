import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'

// API请求结果接口
export interface ApiResponse<T = any> {
  data: T
  success: boolean
  message?: string
}

// 创建axios实例
export const createAPI = (): AxiosInstance => {
  // 获取环境变量中的API基础URL
  const baseURL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

  const api = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 15000, // 15秒超时
    withCredentials: true
  })

  // 请求计数器和锁，用于防止重复请求
  const pendingRequests = new Map<string, AbortController>()

  // 生成请求Key
  const getRequestKey = (config: AxiosRequestConfig): string => {
    const { url, method, params, data } = config
    return `${method}_${url}_${JSON.stringify(params)}_${JSON.stringify(data)}`
  }

  // 请求拦截器
  api.interceptors.request.use((config) => {
    // 添加token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // 防止重复请求
    if (config.headers['X-Allow-Duplicate'] !== 'true') {
      const requestKey = getRequestKey(config)

      // 如果已存在相同请求，则取消之前的请求
      if (pendingRequests.has(requestKey)) {
        pendingRequests.get(requestKey)?.abort()
      }

      // 为当前请求创建AbortController
      const controller = new AbortController()
      config.signal = controller.signal
      pendingRequests.set(requestKey, controller)

      config.transitional = {
        ...config.transitional,
        clarifyTimeoutError: true
      }
    }

    return config
  })

  // 响应拦截器
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      // 请求完成后，从pendingRequests中移除
      const requestKey = getRequestKey(response.config)
      pendingRequests.delete(requestKey)

      return response
    },
    async (error: any) => {
      // 从pendingRequests中移除请求
      if (error?.config) {
        const requestKey = getRequestKey(error.config)
        pendingRequests.delete(requestKey)
      }

      // 错误处理
      if (axios.isCancel(error)) {
        return Promise.reject(new Error('请求已取消'))
      }

      // 超时处理
      if (error?.code === 'ECONNABORTED' && error.message?.includes('timeout')) {
        ElMessage.error('请求超时，请稍后重试')
        return Promise.reject(error)
      }

      // 网络错误
      if (error?.message === 'Network Error') {
        ElMessage.error('网络连接失败，请检查您的网络')
        return Promise.reject(error)
      }

      // 服务器响应的错误
      if (error?.response) {
        const errorMessages: Record<number, string> = {
          400: '请求参数错误',
          401: '登录已过期，请重新登录',
          403: '您没有权限执行此操作',
          404: '请求的资源不存在',
          500: '服务器内部错误'
        }

        const status = error.response.status
        const message = errorMessages[status] || `请求失败: ${error.message || '未知错误'}`

        ElMessage.error(message)

        // 未授权，清除token并跳转到登录页
        if (status === 401) {
          localStorage.removeItem('token')
          setTimeout(() => {
            window.location.href = '/login'
          }, 1500)
        }
      }

      return Promise.reject(error)
    }
  )

  return api
}

// 导出API实例
export const api = createAPI()

// 封装HTTP请求方法
export const get = async <T>(
  url: string,
  params?: any,
  config?: AxiosRequestConfig
): Promise<T> => {
  const response = await api.get<T>(url, { params, ...config })
  return response.data
}

export const post = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.post<T>(url, data, config)
  return response.data
}

export const put = async <T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.put<T>(url, data, config)
  return response.data
}

export const del = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await api.delete<T>(url, config)
  return response.data
}
