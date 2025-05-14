import { createRouter, createWebHistory, RouteRecordRaw, RouterScrollBehavior } from 'vue-router'

// Import feature routes here if they are in separate files
// Example: import authRoutes from '@/features/auth/routes'
// Example: import userRoutes from '@/features/user-profile/routes'

const routes: Array<RouteRecordRaw> = [
  // Define your routes here
  // Example base route:
  {
    path: '/',
    name: 'Home',
    // component: () => import('@/features/home/views/HomeView.vue'), // Lazy load home view
    // For now, a placeholder component until HomeView is created:
    component: { template: '<div>Welcome Home! (Placeholder)</div>' }, 
    meta: { 
      // layout: 'DefaultLayout', // Example: specify layout for this route
      // requiresAuth: false 
    }
  },
  // Example route for a feature (auth)
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import('@/features/auth/views/LoginView.vue'),
  //   meta: { layout: 'AuthLayout', guest: true } // Example: guest only, auth layout
  // },
  // ...authRoutes, // If authRoutes is an array of RouteRecordRaw
  // ...userRoutes,

  // Catch-all 404 route (optional, but good practice)
  {
    path: '/:catchAll(.*)*',
    name: 'NotFound',
    component: () => import('@/core/ui/NotFoundPage.vue'), // Placeholder for a 404 component
    meta: { layout: 'BlankLayout' } // Example for a blank layout
  }
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
// router.beforeEach((to, from, next) => {
//   // const isAuthenticated = !!localStorage.getItem('token'); // Example auth check
//   // if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
//   //   next({ name: 'Login' });
//   // } else if (to.matched.some(record => record.meta.guest) && isAuthenticated) {
//   //   next({ name: 'Home' });
//   // } else {
//   //   next();
//   // }
//   next(); // Proceed by default if no specific logic
// });

export default router 