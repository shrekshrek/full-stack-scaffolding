import { createRouter, createWebHistory, RouteRecordRaw, RouterScrollBehavior } from 'vue-router'
import { useAuthStore, authRoutes } from '@/features/auth' // Consolidated import, authRoutes now includes user profile route

// Import feature routes here if they are in separate files
import { dashboardRoutes } from '@/features/dashboard' // Updated import for dashboard routes
// Example: import userRoutes from '@/features/user-profile/routes'
// import { userProfileRoutes } from '@/features/user-profile' // REMOVED: User profile routes are now part of authRoutes

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
  ...authRoutes, // Spread auth routes here (includes user profile route)
  ...dashboardRoutes, // Spread dashboard routes here
  // ...userRoutes,
  // ...userProfileRoutes, // REMOVED: User profile routes are now part of authRoutes

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
  const authStore = useAuthStore();

  // If there's an access token and current user is not set, ensure user data is loaded before proceeding.
  // This await is crucial. It ensures that by the time we check isLoggedIn,
  // a fetch attempt (if needed) has completed.
  if (authStore.accessToken && !authStore.currentUser) {
    await authStore.fetchCurrentUser();
  }

  // Get the LATEST state of isLoggedIn *after* any potential await above.
  const isLoggedIn = authStore.isLoggedIn;

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
  const guestOnly = to.matched.some((record) => record.meta.guest);

  if (requiresAuth && !isLoggedIn) {
    // If route requires auth and user is not logged in, redirect to login
    next({ name: 'Login', query: { redirect: to.fullPath } });
  } else if (guestOnly && isLoggedIn) {
    // If route is for guests only (like login/register) and user is logged in, redirect to home
    next({ name: 'Home' });
  } else {
    // Otherwise, proceed
    next();
  }
});

export default router
