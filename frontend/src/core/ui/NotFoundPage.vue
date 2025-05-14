<template>
  <div class="not-found-page flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center p-8">
    <h1 class="text-6xl font-bold text-blue-500 mb-4">404</h1>
    <h2 class="text-3xl font-semibold mb-6">Oops! Page Not Found</h2>
    <p class="text-gray-600 mb-8 max-w-md">
      The page you are looking for might have been removed, had its name changed,
      or is temporarily unavailable.
    </p>
    <router-link 
      to="/" 
      class="px-6 py-3 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition-colors duration-300"
    >
      Go to Homepage
    </router-link>
  </div>
</template>

<script setup lang="ts">
// No specific script needed for this simple static page
// console.log('NotFoundPage rendered');
</script>

<style scoped lang="scss">
/* 
  Styling is primarily done with UnoCSS utility classes in the template.
  You can add specific scoped styles here if needed.
*/
.not-found-page {
  // You could add a background image or other specific styles here if utilities are not enough.
}
</style> 