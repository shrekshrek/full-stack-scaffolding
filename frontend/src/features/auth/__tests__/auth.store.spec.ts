import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '../store'
import apiClient from '@/core/services/apiClient'
import type { User, AuthResponse, LoginCredentials, RegisterPayload } from '../types'

// Mock apiClient
vi.mock('@/core/services/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    defaults: {
      headers: {
        common: {},
      },
    },
  },
}))

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('Auth Store', () => {
  beforeEach(() => {
    // Create a new Pinia instance and make it active for each test
    setActivePinia(createPinia());
    // Reset mocks and localStorage before each test
    localStorageMock.clear();
    vi.mocked(apiClient.get).mockClear();
    vi.mocked(apiClient.post).mockClear();
    delete apiClient.defaults.headers.common['Authorization'];
  });

  it('initial state is correct when no token in localStorage', () => {
    const authStore = useAuthStore();
    expect(authStore.currentUser).toBeNull();
    expect(authStore.accessToken).toBeNull();
    expect(authStore.isLoggedIn).toBe(false);
    expect(authStore.isLoading).toBe(false);
    expect(authStore.error).toBeNull();
  });

  it('initializes with token from localStorage and fetches user', async () => {
    const mockToken = 'test-token';
    const mockUser: User = { id: '1', email: 'test@example.com', fullName: 'Test User' };
    localStorageMock.setItem('accessToken', mockToken);
    vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { user: mockUser } });

    const authStore = useAuthStore(); // Initialize store, which should trigger fetchCurrentUser

    // Wait for fetchCurrentUser to complete (it's async)
    // A more robust way might involve awaiting a promise if fetchCurrentUser returned one
    // or checking isLoading state changes, but for now a small timeout or direct check is okay.
    await vi.waitFor(() => expect(authStore.isLoading).toBe(false));
    
    expect(authStore.accessToken).toBe(mockToken);
    expect(apiClient.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`);
    expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
    expect(authStore.currentUser).toEqual(mockUser);
    expect(authStore.isLoggedIn).toBe(true);
  });

  describe('login action', () => {
    const loginCredentials: LoginCredentials = { email: 'test@example.com', password: 'password' };
    const mockUser: User = { id: '1', email: loginCredentials.email, fullName: 'Test User' };
    const mockToken = 'user-token';
    const mockAuthResponse: AuthResponse = { user: mockUser, accessToken: mockToken };

    it('successfully logs in, updates state, and stores token', async () => {
      const authStore = useAuthStore();
      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockAuthResponse });

      const result = await authStore.login(loginCredentials);

      expect(result).toBe(true);
      expect(authStore.isLoading).toBe(false);
      expect(authStore.error).toBeNull();
      expect(authStore.currentUser).toEqual(mockUser);
      expect(authStore.accessToken).toBe(mockToken);
      expect(authStore.isLoggedIn).toBe(true);
      expect(localStorageMock.getItem('accessToken')).toBe(mockToken);
      expect(apiClient.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`);
      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', loginCredentials);
    });

    it('handles login failure, resets state, and clears token', async () => {
      const authStore = useAuthStore();
      const errorMessage = 'Invalid credentials';
      vi.mocked(apiClient.post).mockRejectedValueOnce({ response: { data: { message: errorMessage } } });
      
      // Simulate a previous logged-in state to ensure it gets cleared
      authStore.currentUser = mockUser;
      authStore.accessToken = 'old-token';
      localStorageMock.setItem('accessToken', 'old-token');
      apiClient.defaults.headers.common['Authorization'] = 'Bearer old-token';

      const result = await authStore.login(loginCredentials);

      expect(result).toBe(false);
      expect(authStore.isLoading).toBe(false);
      expect(authStore.error).toBe(errorMessage);
      expect(authStore.currentUser).toBeNull();
      expect(authStore.accessToken).toBeNull();
      expect(authStore.isLoggedIn).toBe(false);
      expect(localStorageMock.getItem('accessToken')).toBeNull();
      expect(apiClient.defaults.headers.common['Authorization']).toBeUndefined();
    });
  });

  describe('register action', () => {
    const registerPayload: RegisterPayload = {
      fullName: 'New User',
      email: 'new@example.com',
      password: 'newpassword'
    };
    const mockUser: User = { id: '2', email: registerPayload.email, fullName: registerPayload.fullName };
    const mockToken = 'new-user-token';
    const mockAuthResponse: AuthResponse = { user: mockUser, accessToken: mockToken };

    it('successfully registers, updates state, and stores token', async () => {
      const authStore = useAuthStore();
      vi.mocked(apiClient.post).mockResolvedValueOnce({ data: mockAuthResponse });

      const result = await authStore.register(registerPayload);

      expect(result).toBe(true);
      expect(authStore.isLoading).toBe(false);
      expect(authStore.error).toBeNull();
      expect(authStore.currentUser).toEqual(mockUser);
      expect(authStore.accessToken).toBe(mockToken);
      expect(authStore.isLoggedIn).toBe(true);
      expect(localStorageMock.getItem('accessToken')).toBe(mockToken);
      expect(apiClient.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`);
      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', registerPayload);
    });

    it('handles registration failure, resets state, and clears token', async () => {
      const authStore = useAuthStore();
      const errorMessage = 'Email already exists';
      vi.mocked(apiClient.post).mockRejectedValueOnce({ response: { data: { message: errorMessage } } });

      const result = await authStore.register(registerPayload);

      expect(result).toBe(false);
      expect(authStore.isLoading).toBe(false);
      expect(authStore.error).toBe(errorMessage);
      expect(authStore.currentUser).toBeNull();
      expect(authStore.accessToken).toBeNull();
      expect(authStore.isLoggedIn).toBe(false);
      expect(localStorageMock.getItem('accessToken')).toBeNull();
      expect(apiClient.defaults.headers.common['Authorization']).toBeUndefined();
    });
  });

  describe('logout action', () => {
    it('clears user, token, localStorage, and apiClient header', async () => {
      const authStore = useAuthStore();
      // Simulate a logged-in state
      const mockUser: User = { id: '1', email: 'test@example.com' };
      const mockToken = 'test-token';
      authStore.currentUser = mockUser;
      authStore.accessToken = mockToken;
      localStorageMock.setItem('accessToken', mockToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;

      await authStore.logout();

      expect(authStore.currentUser).toBeNull();
      expect(authStore.accessToken).toBeNull();
      expect(authStore.isLoggedIn).toBe(false);
      expect(localStorageMock.getItem('accessToken')).toBeNull();
      expect(apiClient.defaults.headers.common['Authorization']).toBeUndefined();
      // Optionally, check if apiClient.post was called if you decide to implement backend logout notification
      // expect(apiClient.post).toHaveBeenCalledWith('/auth/logout');
    });
  });

  describe('fetchCurrentUser action', () => {
    const mockUser: User = { id: '1', email: 'test@example.com', fullName: 'Test User' };
    const mockToken = 'valid-token';

    it('does nothing if no access token exists', async () => {
      const authStore = useAuthStore();
      localStorageMock.removeItem('accessToken'); // Ensure no token
      authStore.accessToken = null; // Ensure store state reflects no token
      
      await authStore.fetchCurrentUser();

      expect(apiClient.get).not.toHaveBeenCalled();
      expect(authStore.currentUser).toBeNull();
      expect(authStore.isLoading).toBe(false);
    });

    it('successfully fetches and sets current user if token exists', async () => {
      const mockTokenLocal = 'valid-token-for-success-fetch'; // Use unique token
      const mockUserLocal: User = { id: 'fetched-user-1', email: 'fetch-success@example.com' };

      localStorageMock.setItem('accessToken', mockTokenLocal);
      // Set up the mock BEFORE initializing the store for the init-time fetchCurrentUser
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { user: mockUserLocal } });

      const authStore = useAuthStore(); 
      // fetchCurrentUser should have been called during store initialization here
      // because accessToken is in localStorage and currentUser is initially null.

      // Wait for the async fetchCurrentUser (and subsequent isLoading state change) to complete
      await vi.waitFor(() => expect(authStore.isLoading).toBe(false));

      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(authStore.currentUser).toEqual(mockUserLocal);
      expect(authStore.accessToken).toBe(mockTokenLocal);
      expect(authStore.isLoading).toBe(false); // Already checked by waitFor, but good to assert final state
      expect(authStore.error).toBeNull();
      expect(authStore.isLoggedIn).toBe(true); // This should now pass
    });

    it('handles failure when fetching current user and clears auth state', async () => {
      localStorageMock.setItem('accessToken', mockToken);
      const authStore = useAuthStore(); // Re-initialize
      authStore.accessToken = mockToken;

      vi.mocked(apiClient.get).mockRejectedValueOnce(new Error('Network error'));

      await authStore.fetchCurrentUser();

      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(authStore.currentUser).toBeNull();
      expect(authStore.accessToken).toBeNull(); // Token should be cleared on fetch failure
      expect(authStore.isLoggedIn).toBe(false);
      expect(authStore.isLoading).toBe(false);
      expect(localStorageMock.getItem('accessToken')).toBeNull(); // Also check localStorage
      expect(apiClient.defaults.headers.common['Authorization']).toBeUndefined();
    });

     it('fetchCurrentUser is called on initialization if token exists and user is not set', async () => {
      localStorageMock.setItem('accessToken', mockToken);
      vi.mocked(apiClient.get).mockResolvedValueOnce({ data: { user: mockUser } });

      const authStore = useAuthStore(); // Store initialization triggers the call

      await vi.waitFor(() => expect(authStore.isLoading).toBe(false)); // Wait for async operations in init

      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
      expect(authStore.currentUser).toEqual(mockUser);
    });
  });

}); 