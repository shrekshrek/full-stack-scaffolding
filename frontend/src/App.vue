<template>
  <component :is="layoutComponent">
    <!-- The router-view is now inside the layout component -->
  </component>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent, markRaw } from 'vue';
import { useRoute } from 'vue-router';

// Eagerly import DefaultLayout as it's the most common
import DefaultLayout from '@/core/layouts/DefaultLayout.vue';
// Example: For other layouts, you might use async components
// const AdminLayout = defineAsyncComponent(() => import('@/core/layouts/AdminLayout.vue'));

const route = useRoute();

const layouts: Record<string, any> = {
  DefaultLayout: markRaw(DefaultLayout),
  // AdminLayout: markRaw(AdminLayout), // If you had an AdminLayout
};

const layoutComponent = computed(() => {
  const layoutName = route.meta.layout as string | undefined;
  return layouts[layoutName || 'DefaultLayout'] || DefaultLayout; // Fallback to DefaultLayout
});
</script>

<style lang="scss">
/* 
  Global styles (like body margin, font-family) are ideally placed in a global CSS/SCSS file 
  (e.g., src/styles/main.scss) and imported in main.ts.
  For this refactor, we'll keep essential body styles here for now, 
  but they were also copied to DefaultLayout.vue. Consider centralizing them.
*/
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/* Remove app-specific structure styles like .app-header, .app-main, .app-footer as they are in DefaultLayout.vue */
/* Keep transitions if they are intended to apply to the layout switch itself, or move to DefaultLayout if for view within layout */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 