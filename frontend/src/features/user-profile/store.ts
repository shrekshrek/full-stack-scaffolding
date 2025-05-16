import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { UserProfile } from './types'; // UserProfileState might not be needed if TS infers well
import * as userProfileService from './service';
// Potentially import auth store to get current user ID if needed for API calls
// import { useAuthStore } from '@/features/auth/store';

// For a setup store, you typically don't need to annotate the return type of the setup function itself
// with the state interface directly. Pinia infers the state from the returned refs.
export const useUserProfileStore = defineStore('userProfile', () => {
  const profile = ref<UserProfile | null>(null);
  const isLoading = ref<boolean>(false);
  const error = ref<string | null>(null);

  // const authStore = useAuthStore(); // If needed for user ID

  async function fetchUserProfile(): Promise<void> {
    isLoading.value = true;
    error.value = null;
    try {
      // console.warn('fetchUserProfile in store is a placeholder and needs to call the actual service function.');
      const userProfileData = await userProfileService.getProfile();
      profile.value = userProfileData;
      console.log('[UserProfileStore] Fetched profile:', userProfileData);
    } catch (e: any) {
      const message = e.message || 'Failed to fetch user profile';
      console.error('[UserProfileStore] Error fetching profile:', e);
      error.value = message;
      profile.value = null; // Clear profile on error
    } finally {
      isLoading.value = false;
    }
  }
  
  // Example for an update action
  // async function updateUserProfile(payload: Partial<UserProfile>): Promise<boolean> { ... }

  return {
    // State refs
    profile,
    isLoading,
    error,
    // Actions
    fetchUserProfile,
    // updateUserProfile,
  };
}); 