import apiClient from '@/core/services/apiClient';
import type { LoginCredentials, RegisterPayload, AuthResponse, User } from './types';

/**
 * Logs in a user.
 * @param credentials - The login credentials (username, password).
 * @returns A promise that resolves to the authentication response.
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
  return response.data; 
}

/**
 * Registers a new user.
 * @param payload - The registration data (username, email, password).
 * @returns A promise that resolves to the authentication response.
 */
export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await apiClient.post<AuthResponse>('/auth/register', payload);
  return response.data;
}

/**
 * Fetches the current authenticated user's data.
 * @returns A promise that resolves to the user data.
 */
export async function fetchCurrentUserData(): Promise<User> {
  const response = await apiClient.get<User>('/auth/me');
  return response.data;
}

/**
 * Logs out the user (optional, if you have a backend logout endpoint).
 * This is often a "fire and forget" or has minimal response.
 * @returns A promise that resolves when the logout call is complete.
 */
export async function logoutUser(): Promise<void> {
  // Example: If your backend has a /auth/logout endpoint that needs to be called
  // await apiClient.post('/auth/logout');
  return Promise.resolve(); 
} 