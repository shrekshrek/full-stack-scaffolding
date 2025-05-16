// Types specific to the Authentication feature module

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterPayload extends Omit<LoginCredentials, 'username'> {
  username: string;
  email: string;
  password: string;
  // add other registration fields if needed
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refreshToken?: string; // Optional
  token_type?: string; // Added to match API response, optional
}

// You might want to define a more specific User type for auth contexts
// or import a global one if it suits your needs.
export interface User {
  id: string | number;
  email: string;
  username: string;
  nickname?: string;   // Replaces displayName, and made primary for user-friendly name
  avatarUrl?: string;   // Added for user avatar
  roles?: string[];    // Added for user roles
  permissions?: string[]; // Added for user permissions
} 

export interface AuthState {
  currentUser: User | null;
  accessToken: string | null;
  error: string | null; // Or a more specific error type, e.g., { message: string }
  isLoading: boolean;
  // Add other state properties like refreshToken if managed here
} 