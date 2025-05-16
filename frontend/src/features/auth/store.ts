// Example Pinia store for authentication
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/core/services/apiClient' // Your API client
import type { LoginCredentials, RegisterPayload, User, AuthResponse } from './types' // Feature-specific types
import * as authService from './service'; // Import the service functions

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
    console.log('[AuthStore] setAuthData called with user:', user, 'token:', token);
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
    console.log('[AuthStore] setAuthData finished - currentUser:', currentUser.value, 'accessToken:', accessToken.value, 'isLoggedIn:', isLoggedIn.value);
  }

  async function login(credentials: LoginCredentials) {
    isLoading.value = true
    error.value = null
    console.log('[AuthStore] Attempting login with:', credentials);
    try {
      const authDataResponse = await authService.loginUser(credentials);
      console.log('[AuthStore] Login API response:', authDataResponse);
      setAuthData(authDataResponse.user, authDataResponse.access_token)
      console.log('[AuthStore] After login setAuthData - currentUser:', currentUser.value, 'isLoggedIn:', isLoggedIn.value);
      return true;
    } catch (e: any) {
      const message = e.response?.data?.message || e.message || 'Login failed'
      console.error('[AuthStore] Login API error:', message, e);
      setAuthData(null, null)
      console.log('[AuthStore] After login error setAuthData - currentUser:', currentUser.value, 'isLoggedIn:', isLoggedIn.value);
      error.value = message
      return false;
    } finally {
      isLoading.value = false
    }
  }

  async function register(payload: RegisterPayload) {
    isLoading.value = true
    error.value = null
    console.log('[AuthStore] Attempting registration with:', payload);
    try {
      const authDataResponse = await authService.registerUser(payload);
      console.log('[AuthStore] Register API response:', authDataResponse);
      setAuthData(authDataResponse.user, authDataResponse.access_token)
      console.log('[AuthStore] After register setAuthData - currentUser:', currentUser.value, 'isLoggedIn:', isLoggedIn.value);
      return true;
    } catch (e: any) {
      const message = e.response?.data?.message || e.message || 'Registration failed'
      console.error('[AuthStore] Register API error:', message, e);
      setAuthData(null, null)
      console.log('[AuthStore] After register error setAuthData - currentUser:', currentUser.value, 'isLoggedIn:', isLoggedIn.value);
      error.value = message
      return false;
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    console.log('[AuthStore] Attempting logout.');
    try {
      await authService.logoutUser();
    } catch (e) {
      console.error("[AuthStore] Error during logout API call:", e)
    }
    setAuthData(null, null)
    console.log('[AuthStore] Logged out - currentUser:', currentUser.value, 'isLoggedIn:', isLoggedIn.value);
  }

  async function fetchCurrentUser() {
    if (!accessToken.value) {
      // If there's no token, ensure user is logged out state-wise
      // This can happen if the token expired and was removed by an interceptor, for example.
      if (currentUser.value) setAuthData(null, null); 
      return;
    }
    isLoading.value = true;
    console.log('[AuthStore] fetchCurrentUser: Attempting to fetch user data with token:', accessToken.value);
    try {
      const userDataResponse = await authService.fetchCurrentUserData();
      console.log('[AuthStore] fetchCurrentUser API response:', userDataResponse);
      // API directly returns the user object, and service now reflects this
      currentUser.value = userDataResponse; 
      console.log('[AuthStore] fetchCurrentUser success - currentUser:', currentUser.value);
    } catch (e: any) {
      console.error('[AuthStore] Failed to fetch current user:', e);
      // If fetching user fails (e.g. token invalid), clear auth state
      setAuthData(null, null); 
      console.log('[AuthStore] fetchCurrentUser error - currentUser set to null, isLoggedIn:', isLoggedIn.value);
    }
    finally {
      isLoading.value = false;
    }
  }

  // Initialize store: if token exists, try to fetch user data
  if (accessToken.value && !currentUser.value) { // Fetch only if user is not already set
     console.log('[AuthStore] Initializing: Token found, currentUser not set. Fetching current user.');
     fetchCurrentUser(); 
  } else if (accessToken.value && currentUser.value) {
    console.log('[AuthStore] Initializing: Token found, currentUser IS set. User:', currentUser.value);
  } else {
    console.log('[AuthStore] Initializing: No token found or currentUser already set.');
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