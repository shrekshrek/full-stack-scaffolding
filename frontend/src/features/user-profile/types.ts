// Types specific to the User Profile feature module

export interface UserProfile {
  id: string | number;
  username: string;
  email: string;
  nickname?: string;
  avatarUrl?: string;
  bio?: string;
  // Add other profile fields as needed, e.g.:
  // location?: string;
  // website?: string;
  // joinedAt?: string; // Or Date
}

// Interface for the UserProfile store state (if using Pinia)
export interface UserProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
}

// export {}; // If no other exports, ensures this is a module for older TS versions 