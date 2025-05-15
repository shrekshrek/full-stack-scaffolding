import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../store'; 
import apiClient from '@/core/services/apiClient'; 
import type { User, AuthResponse, LoginCredentials, RegisterPayload } from '../types';

// Mock apiClient
vi.mock('@/core/services/apiClient', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    defaults: {
      headers: {
        common: {},
      },
    },
  },
}));

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
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // Reset mocks and localStorage before each test
    vi.clearAllMocks();
    localStorageMock.clear();
    // Ensure apiClient common headers are reset if modified by store initialization
    // Accessing potentially undefined property, ensure it exists or handle safely
    // if (apiClient && apiClient.defaults && apiClient.defaults.headers && apiClient.defaults.headers.common) {
    //    apiClient.defaults.headers.common['Authorization'] = undefined;
    // } else {
    //   // console.warn('[AuthStore Test Setup] apiClient.defaults.headers.common not found for reset');
    // }
    // Simplified reset based on mock structure
    apiClient.defaults.headers.common['Authorization'] = undefined;
  });

  afterEach(() => {
    // Optional: any cleanup after tests if needed
  });

  it('initial state is correct', () => {
    const authStore = useAuthStore();
    expect(authStore.currentUser).toBeNull();
    expect(authStore.accessToken).toBeNull();
    expect(authStore.isLoading).toBe(false);
    expect(authStore.error).toBeNull();
    expect(authStore.isLoggedIn).toBe(false);
  });

  // --- Tests for setAuthData ---
  describe('setAuthData', () => {
    it('sets user, token, localStorage, and apiClient header correctly when token is provided', () => {
      const authStore = useAuthStore();
      const mockUser: User = { id: '1', email: 'test@example.com', username: 'testuser' };
      const mockToken = 'mock-access-token';

      authStore.setAuthData(mockUser, mockToken);

      expect(authStore.currentUser).toEqual(mockUser);
      expect(authStore.accessToken).toBe(mockToken);
      expect(localStorageMock.getItem('accessToken')).toBe(mockToken);
      expect(apiClient.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`);
      expect(authStore.error).toBeNull(); // Should clear error
    });

    it('clears user, token, localStorage, and apiClient header correctly when token is null', () => {
      const authStore = useAuthStore();
      // Simulate a previous login
      localStorageMock.setItem('accessToken', 'some-old-token');
      apiClient.defaults.headers.common['Authorization'] = 'Bearer some-old-token';
      authStore.currentUser = { id: '1', email: 'test@example.com', username: 'testuser' }; // Manually set for test setup
      authStore.accessToken = 'some-old-token';

      authStore.setAuthData(null, null);

      expect(authStore.currentUser).toBeNull();
      expect(authStore.accessToken).toBeNull();
      expect(localStorageMock.getItem('accessToken')).toBeNull();
      expect(apiClient.defaults.headers.common['Authorization']).toBeUndefined();
      expect(authStore.error).toBeNull(); // Should clear error
    });
  });

  // --- Tests for login action ---
  describe('login action', () => {
    const loginCredentials: LoginCredentials = { email: 'test@example.com', password: 'password123' };
    const mockUser: User = { id: '1', email: 'test@example.com', username: 'testuser' };
    const mockToken = 'mock-login-token';
    const mockAuthResponse: AuthResponse = { user: mockUser, accessToken: mockToken };

    it('handles successful login', async () => {
      const authStore = useAuthStore();
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockAuthResponse });

      const result = await authStore.login(loginCredentials);

      expect(result).toBe(true);
      expect(authStore.isLoading).toBe(false);
      expect(authStore.error).toBeNull();
      expect(authStore.currentUser).toEqual(mockUser);
      expect(authStore.accessToken).toBe(mockToken);
      expect(localStorageMock.getItem('accessToken')).toBe(mockToken);
      expect(apiClient.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`);
      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', loginCredentials);
    });

    it('handles failed login (API error)', async () => {
      const authStore = useAuthStore();
      const errorMessage = 'Invalid credentials';
      (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue({ response: { data: { message: errorMessage } } });

      const result = await authStore.login(loginCredentials);

      expect(result).toBe(false);
      expect(authStore.isLoading).toBe(false);
      expect(authStore.error).toBe(errorMessage);
      expect(authStore.currentUser).toBeNull();
      expect(authStore.accessToken).toBeNull();
      expect(localStorageMock.getItem('accessToken')).toBeNull();
      expect(apiClient.defaults.headers.common['Authorization']).toBeUndefined();
    });

    it('handles failed login (generic error)', async () => {
      const authStore = useAuthStore();
      const errorMessage = 'Network Error';
      (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue(new Error(errorMessage));

      const result = await authStore.login(loginCredentials);

      expect(result).toBe(false);
      expect(authStore.isLoading).toBe(false);
      expect(authStore.error).toBe(errorMessage); // Or a default like 'Login failed' depending on store logic
    });

    it('sets isLoading during login process', async () => {
      const authStore = useAuthStore();
      let resolvePromise: (value: { data: AuthResponse }) => void;
      (apiClient.post as ReturnType<typeof vi.fn>).mockImplementation(() => 
        new Promise(resolve => {
          resolvePromise = resolve;
        })
      );

      // Don't await here to check isLoading state during the call
      const loginPromise = authStore.login(loginCredentials);
      expect(authStore.isLoading).toBe(true);

      // @ts-ignore
      resolvePromise({ data: mockAuthResponse }); // Resolve the promise
      await loginPromise; // Now await for the promise to complete

      expect(authStore.isLoading).toBe(false);
    });
  });

  // --- Tests for register action ---
  describe('register action', () => {
    const registerPayload: RegisterPayload = { username: 'newuser', email: 'new@example.com', password: 'newpassword123' };
    const mockUser: User = { id: '2', email: 'new@example.com', username: 'newuser' };
    const mockToken = 'mock-register-token';
    const mockAuthResponse: AuthResponse = { user: mockUser, accessToken: mockToken };

    it('handles successful registration', async () => {
      const authStore = useAuthStore();
      (apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockAuthResponse });

      const result = await authStore.register(registerPayload);

      expect(result).toBe(true);
      expect(authStore.isLoading).toBe(false);
      expect(authStore.error).toBeNull();
      expect(authStore.currentUser).toEqual(mockUser);
      expect(authStore.accessToken).toBe(mockToken);
      expect(localStorageMock.getItem('accessToken')).toBe(mockToken);
      expect(apiClient.defaults.headers.common['Authorization']).toBe(`Bearer ${mockToken}`);
      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', registerPayload);
    });

    it('handles failed registration (API error)', async () => {
      const authStore = useAuthStore();
      const errorMessage = 'Email already exists';
      (apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue({ response: { data: { message: errorMessage } } });

      const result = await authStore.register(registerPayload);

      expect(result).toBe(false);
      expect(authStore.isLoading).toBe(false);
      expect(authStore.error).toBe(errorMessage);
      expect(authStore.currentUser).toBeNull();
      expect(authStore.accessToken).toBeNull();
    });
  });

  // --- Tests for logout action ---
  describe('logout action', () => {
    it('clears auth state and localStorage', async () => {
      const authStore = useAuthStore();
      // Simulate logged-in state
      const mockUser: User = { id: '1', email: 'test@example.com', username: 'testuser' };
      const mockToken = 'mock-existing-token';
      authStore.setAuthData(mockUser, mockToken);
      expect(localStorageMock.getItem('accessToken')).toBe(mockToken);
      
      await authStore.logout();

      expect(authStore.currentUser).toBeNull();
      expect(authStore.accessToken).toBeNull();
      expect(localStorageMock.getItem('accessToken')).toBeNull();
      expect(apiClient.defaults.headers.common['Authorization']).toBeUndefined();
      expect(authStore.error).toBeNull(); // Should also clear error state on logout
    });
  });

  // --- Tests for fetchCurrentUser action ---
  describe('fetchCurrentUser action', () => {
    const mockUser: User = { id: 'current-user-id', email: 'current@example.com', username: 'currentuser' };

    it('fetches and sets current user if token exists in store', async () => {
      const authStore = useAuthStore();
      authStore.accessToken = 'valid-token-in-store'; // Simulate token already in store but no user yet
      apiClient.defaults.headers.common['Authorization'] = 'Bearer valid-token-in-store';
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { user: mockUser } });

      await authStore.fetchCurrentUser();

      expect(authStore.isLoading).toBe(false);
      expect(authStore.currentUser).toEqual(mockUser);
      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
    });

    it('does not fetch user if no token is in store', async () => {
      const authStore = useAuthStore();
      authStore.accessToken = null; // Ensure no token

      await authStore.fetchCurrentUser();

      expect(apiClient.get).not.toHaveBeenCalled();
      expect(authStore.currentUser).toBeNull();
      expect(authStore.isLoading).toBe(false); 
    });

    it('clears auth state if fetching user fails', async () => {
      const authStore = useAuthStore();
      authStore.accessToken = 'invalid-token-in-store';
      apiClient.defaults.headers.common['Authorization'] = 'Bearer invalid-token-in-store';
      (apiClient.get as ReturnType<typeof vi.fn>).mockRejectedValue(new Error('Failed to fetch'));

      await authStore.fetchCurrentUser();

      expect(authStore.isLoading).toBe(false);
      expect(authStore.currentUser).toBeNull();
      expect(authStore.accessToken).toBeNull(); // Token should be cleared on auth failure
      expect(localStorageMock.getItem('accessToken')).toBeNull();
      expect(apiClient.defaults.headers.common['Authorization']).toBeUndefined();
    });

    it('initializes by fetching user if token exists in localStorage (store init)', () => {
      localStorageMock.setItem('accessToken', 'token-from-localstorage');
      (apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: { user: mockUser } });
      
      // Instantiate store, which should trigger fetchCurrentUser via its internal init logic
      const authStore = useAuthStore(); 
      
      // Need to wait for async operations triggered by store constructor
      // This is tricky because the call is internal. We check the mock call.
      expect(apiClient.get).toHaveBeenCalledWith('/auth/me');
      // To verify state after async: await nextTick() or flushPromises() if available from test-utils
      // For now, we mainly check if the call was made.
    });
  });

  // --- Tests for isLoggedIn getter ---
  describe('isLoggedIn getter', () => {
    it('returns true when user and token exist', () => {
      const authStore = useAuthStore();
      authStore.currentUser = { id: '1', email: 'test@example.com', username: 'testuser' };
      authStore.accessToken = 'some-token';
      expect(authStore.isLoggedIn).toBe(true);
    });

    it('returns false when user is null', () => {
      const authStore = useAuthStore();
      authStore.currentUser = null;
      authStore.accessToken = 'some-token';
      expect(authStore.isLoggedIn).toBe(false);
    });

    it('returns false when token is null', () => {
      const authStore = useAuthStore();
      authStore.currentUser = { id: '1', email: 'test@example.com', username: 'testuser' };
      authStore.accessToken = null;
      expect(authStore.isLoggedIn).toBe(false);
    });

    it('returns false when both user and token are null', () => {
      const authStore = useAuthStore();
      authStore.currentUser = null;
      authStore.accessToken = null;
      expect(authStore.isLoggedIn).toBe(false);
    });
  });
}); 