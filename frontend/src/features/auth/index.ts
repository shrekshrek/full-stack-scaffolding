// This file can be used to re-export elements from the auth module
// for cleaner imports in other parts of the application.

export * from './store';
export * from './service';
export * from './types';
export { default as authRoutes } from './routes';

export { default as LoginView } from './views/LoginView.vue';
export { default as RegisterView } from './views/RegisterView.vue';

export { default as LoginForm } from './components/LoginForm.vue';
export { default as RegisterForm } from './components/RegisterForm.vue';

// Example: export a composable directly
// export * from './composables/useAuthForm'; // if you had one

// console.log('Auth feature module index loaded.'); 