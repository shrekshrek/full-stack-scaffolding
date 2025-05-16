// User profile specific API service functions
import apiClient from '@/core/services/apiClient';
import type { UserProfile } from './types';

/**
 * Fetches the current user's profile data.
 */
export async function getProfile(): Promise<UserProfile> {
  // Assuming the API endpoint for fetching the current user's profile is '/users/me'
  // Adjust the endpoint if it's different in your backend.
  const response = await apiClient.get<{ data: UserProfile }>('/users/me'); // Adjust based on your API response structure
  return response.data.data; // Or response.data if UserProfile is the direct response
}

// You can add other service functions here, e.g., for updating the profile:
// export async function updateProfile(payload: Partial<UserProfile>): Promise<UserProfile> {
//   const response = await apiClient.put<{ data: UserProfile }>('/users/me', payload);
//   return response.data.data;
// }

export {}; // Ensures this is treated as a module 