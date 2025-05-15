// Types specific to the Authentication feature module

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginCredentials {
  username: string;
  // add other registration fields if needed
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string; // Optional
}

// You might want to define a more specific User type for auth contexts
// or import a global one if it suits your needs.
export interface User {
  id: string | number;
  email: string;
  username: string;
  // roles?: string[];
  // permissions?: string[];
} 

export interface AuthState {
  currentUser: User | null;
  accessToken: string | null;
  error: string | null; // Or a more specific error type, e.g., { message: string }
  isLoading: boolean;
  // Add other state properties like refreshToken if managed here
} 