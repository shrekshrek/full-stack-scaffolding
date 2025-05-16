import type { RouteRecordRaw } from 'vue-router'

const authRoutes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/features/auth/views/LoginView.vue'), // Lazy load LoginView using alias
    meta: {
      layout: 'AuthLayout', // Example: specify a different layout for login page
      guest: true, // Example: For routes accessible only by unauthenticated users
    },
  },
  // Add other auth-related routes here (e.g., register, forgot-password)
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/features/auth/views/RegisterView.vue'), // Lazy load RegisterView using alias
    meta: {
      layout: 'AuthLayout', // Example: specify a different layout for register page
      guest: true,
    },
  },
  // Added UserProfile route here
  {
    path: '/user-profile',
    name: 'UserProfile',
    component: () => import('@/features/auth/views/UserProfileView.vue'),
    meta: {
      requiresAuth: true,
      title: '个人资料',
    },
  },
]

export default authRoutes
