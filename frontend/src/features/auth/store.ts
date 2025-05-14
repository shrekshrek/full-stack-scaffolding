// Example Pinia store for authentication
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/core/services/apiClient' // Your API client
import type { LoginCredentials, RegisterPayload, User, AuthResponse } from './types' // Feature-specific types

// Placeholder types until actual types are defined
// interface User { id: string; email: string; fullName?: string; }
// interface LoginCredentials { email: string; password: string; }

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const accessToken = ref<string | null>(localStorage.getItem('accessToken') || null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const isLoggedIn = computed(() => !!accessToken.value && !!currentUser.value)

  // Initialize apiClient authorization header if token exists from localStorage
  if (accessToken.value) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken.value}`;
  }

  function setAuthData(user: User | null, token: string | null) {
    currentUser.value = user
    accessToken.value = token
    if (token) {
      localStorage.setItem('accessToken', token)
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`; 
    } else {
      localStorage.removeItem('accessToken')
      delete apiClient.defaults.headers.common['Authorization'];
    }
    error.value = null
  }

  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
      setAuthData(response.data.user, response.data.accessToken)
      return true;
    } catch (e: any) {
      const message = e.response?.data?.message || e.message || 'Login failed'
      setAuthData(null, null)
      error.value = message
      return false;
    } finally {
      isLoading.value = false
    }
  }

  async function register(payload: RegisterPayload) {
    isLoading.value = true
    error.value = null
    try {
      const response = await apiClient.post<AuthResponse>('/auth/register', payload)
      setAuthData(response.data.user, response.data.accessToken)
      return true;
    } catch (e: any) {
      const message = e.response?.data?.message || e.message || 'Registration failed'
      setAuthData(null, null)
      error.value = message
      return false;
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    try {
      // Optional: notify backend. Backend should clear the session/token if necessary.
      // await apiClient.post('/auth/logout'); 
    } catch (e) {
      console.error("Error during logout API call:", e)
    }
    setAuthData(null, null)
    // router.push('/login'); // Consider moving redirection logic to the component that calls logout
    console.log('Logged out')
  }

  async function fetchCurrentUser() {
    if (!accessToken.value) {
      // If there's no token, ensure user is logged out state-wise
      // This can happen if the token expired and was removed by an interceptor, for example.
      if (currentUser.value) setAuthData(null, null); 
      return;
    }
    isLoading.value = true;
    try {
      // Assuming the /auth/me endpoint returns the user object directly or { user: User }
      const response = await apiClient.get<{ user: User }>('/auth/me'); 
      // If response is { user: User }, then use response.data.user
      // If response is User directly, then use response.data
      // For this example, let's assume it returns { user: User }
      currentUser.value = response.data.user; 
      // We already have a token, so no need to setAuthData unless token needs refresh/revalidation from response
    } catch (e: any) {
      console.error('Failed to fetch current user:', e);
      // If fetching user fails (e.g. token invalid), clear auth state
      setAuthData(null, null); 
    }
    finally {
      isLoading.value = false;
    }
  }

  // Initialize store: if token exists, try to fetch user data
  if (accessToken.value && !currentUser.value) { // Fetch only if user is not already set
     fetchCurrentUser(); 
  }


  return {
    currentUser,
    accessToken,
    isLoading,
    error,
    isLoggedIn,
    login,
    register,
    logout,
    fetchCurrentUser,
    setAuthData,
  }
}) 