import type { RouteRecordRaw } from 'vue-router';

const dashboardRoutes: Array<RouteRecordRaw> = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/features/dashboard/views/DashboardView.vue'),
    meta: {
      requiresAuth: true // This route requires authentication
    }
  }
];

export default dashboardRoutes; 