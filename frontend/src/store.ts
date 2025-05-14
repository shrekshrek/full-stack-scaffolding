import { createPinia } from 'pinia'

// Optional: Import Pinia plugins if you use any
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // Example for state persistence

const pinia = createPinia()

// Optional: Use Pinia plugins
// pinia.use(piniaPluginPersistedstate) // Example

export default pinia

// You can also export individual stores from here if you prefer a centralized export point,
// though typically stores are imported directly from their feature modules.
// export * from '@/features/auth/store' // Example
// export * from '@/features/cart/store' // Example 