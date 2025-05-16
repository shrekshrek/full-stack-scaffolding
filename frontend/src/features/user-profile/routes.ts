import type { RouteRecordRaw } from 'vue-router';
import UserProfileView from './views/UserProfileView.vue';

const userProfileRoutes: Array<RouteRecordRaw> = [
  {
    path: '/user-profile', // Changed from /profile to /user-profile
    name: 'UserProfile',
    component: UserProfileView,
    meta: {
      requiresAuth: true, // Example: This route requires authentication
      // layout: 'DashboardLayout', // Example: If you use different layouts
      title: '个人资料' // Example: For browser tab title or breadcrumbs
    }
  },
  // Potentially add routes for editing profile, e.g., /profile/edit
  // {
  //   path: '/profile/edit',
  //   name: 'UserProfileEdit',
  //   component: () => import('./views/UserProfileEditView.vue'), // Lazy load if preferred
  //   meta: {
  //     requiresAuth: true,
  //     title: '编辑资料'
  //   }
  // }
];

export default userProfileRoutes; 