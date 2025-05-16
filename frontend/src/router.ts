import { createRouter, createWebHistory, RouteRecordRaw, RouterScrollBehavior } from 'vue-router'
import { useAuthStore, authRoutes } from '@/features/auth' // Consolidated import

// Import feature routes here if they are in separate files
import { dashboardRoutes } from '@/features/dashboard' // Updated import for dashboard routes
// Example: import userRoutes from '@/features/user-profile/routes'
import { userProfileRoutes } from '@/features/user-profile' // Import user profile routes

const routes: Array<RouteRecordRaw> = [
  // Define your routes here
  // Example base route:
  {
    path: '/',
    name: 'Home',
    component: () => import('@/features/home').then(m => m.HomeView), // Lazy load HomeView via module index
    meta: {
      // layout: 'DefaultLayout', // Example: specify layout for this route
      requiresAuth: false,
    },
  },
  // Example route for a feature (auth)
  ...authRoutes, // Spread auth routes here
  ...dashboardRoutes, // Spread dashboard routes here
  // ...userRoutes,
  ...userProfileRoutes, // Spread user profile routes here

  // Catch-all 404 route (optional, but good practice)
  {
    path: '/:catchAll(.*)*',
    name: 'NotFound',
    component: () => import('@/core/ui/NotFoundPage.vue'), // Placeholder for a 404 component
    meta: { layout: 'BlankLayout' }, // Example for a blank layout
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // BASE_URL is usually '/'
  routes,
  scrollBehavior: ((to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }) as RouterScrollBehavior,
})

// Optional: Global navigation guards
router.beforeEach(async (to, from, next) => {
  // Initialize the auth store here if it's not already initialized
  // This is to ensure that the Pinia store is active before being used in the guard.
  // Direct usage of useAuthStore() outside setup or lifecycle hooks might behave unexpectedly
  // if Pinia isn't fully set up by the time the router is initialized.
  // However, in most setups with main.ts properly creating and using Pinia, this should be fine.
  const authStore = useAuthStore()

  // Fetch current user if not already loaded and has a token.
  // This helps in cases where the user refreshes a page that requires auth.
  if (authStore.accessToken && !authStore.currentUser && !authStore.isLoading) {
    // Only fetch if not already loading to prevent multiple fetches on rapid navigation
    await authStore.fetchCurrentUser()
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const guestOnly = to.matched.some((record) => record.meta.guest)

  if (requiresAuth && !authStore.isLoggedIn) {
    // If route requires auth and user is not logged in, redirect to login
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (guestOnly && authStore.isLoggedIn) {
    // If route is for guests only (like login/register) and user is logged in, redirect to home
    next({ name: 'Home' })
  } else {
    // Otherwise, proceed
    next()
  }
})

export default router
