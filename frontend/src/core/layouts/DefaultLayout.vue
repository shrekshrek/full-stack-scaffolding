<template>
  <div class="default-layout">
    <header class="default-layout__header">
      <!-- Example: Site Logo and Navigation -->
      <div class="container mx-auto flex items-center justify-between p-4">
        <div class="text-xl font-bold">MyAppLogo</div>
        <nav>
          <router-link to="/" class="px-3 py-2 hover:text-blue-500">Home</router-link>
          <!-- Add other global navigation links here -->
          <router-link v-if="!isLoggedIn" to="/login" class="px-3 py-2 hover:text-blue-500">Login</router-link>
          <router-link v-if="!isLoggedIn" to="/register" class="px-3 py-2 hover:text-blue-500 ml-2">Register</router-link>
          <button v-if="isLoggedIn" @click="handleLogout" class="px-3 py-2 hover:text-blue-500">Logout</button>
        </nav>
      </div>
    </header>

    <main class="default-layout__main container mx-auto p-4">
      <router-view /> <!-- Page content will be rendered here -->
    </main>

    <footer class="default-layout__footer bg-gray-100 p-4 text-center text-sm text-gray-600">
      <div class="container mx-auto">
        &copy; {{ new Date().getFullYear() }} MyApp. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// import { computed } from 'vue'
// import { useAuthStore } from '@/features/auth/store' // Example, assuming auth store exists
// const authStore = useAuthStore()
// const isLoggedIn = computed(() => authStore.isLoggedIn)

// Placeholder for isLoggedIn and handleLogout until auth is implemented
const isLoggedIn = ref(false) // Replace with actual auth state
// To use the actual auth state, uncomment the lines below and remove the placeholder
// import { useAuthStore } from '@/features/auth/store';
// import { computed } from 'vue';
// const authStore = useAuthStore();
// const isLoggedIn = computed(() => authStore.isLoggedIn);

const handleLogout = () => {
  console.log('Logout action');
  isLoggedIn.value = false;
  // authStore.logout(); 
  // router.push('/login');
};

// You might want to inject a router instance if needed for programmatic navigation
// import { useRouter } from 'vue-router'
// const router = useRouter()
</script>

<style scoped lang="scss">
.default-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  &__header {
    // Example header styling
    border-bottom: 1px solid #e5e7eb; // gray-200
  }

  &__main {
    flex-grow: 1;
  }

  &__footer {
    // Example footer styling
  }
}

// UnoCSS is preferred for styling, but you can add component-specific styles here.
// Example using UnoCSS classes directly in template is often cleaner for layouts.
</style> 