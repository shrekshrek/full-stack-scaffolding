// Types specific to the Authentication feature module

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginCredentials {
  fullName?: string;
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
  fullName?: string;
  // roles?: string[];
  // permissions?: string[];
} 