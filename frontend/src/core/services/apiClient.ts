import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosError } from 'axios'

// VITE_API_BASE_URL should contain the full path prefix, e.g.,
// /api/v1 for dev (to be used with Vite proxy)
// or https://api.example.com/api/v1 for production.

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Directly use the env variable here
  headers: {
    'Content-Type': 'application/json',
    // You can add other default headers here
  },
})

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Modify config before request is sent (e.g., add auth token)
    // const token = localStorage.getItem('accessToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config
  },
  (error: AxiosError) => {
    // Handle request error
    return Promise.reject(error)
  }
)

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response
  },
  (error: AxiosError) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // Example: Handle 401 Unauthorized for token refresh or redirect to login
    // if (error.response && error.response.status === 401) {
    //   // Potentially try to refresh token or redirect to login
    //   console.error('Unauthorized, redirecting to login...');
    //   // router.push('/login'); // Make sure router is available here or use a different mechanism
    // }
    return Promise.reject(error)
  }
)

export default apiClient 