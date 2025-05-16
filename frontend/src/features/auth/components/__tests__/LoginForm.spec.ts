import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount, VueWrapper, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus, { type FormInstance } from 'element-plus'
import LoginForm from '@/features/auth/components/LoginForm.vue'
// Assuming AuthStore type and LoginPayload might be useful, adjust path if necessary
// import { useAuthStore, type AuthStoreState } from '@/features/auth/store';
// import type { LoginPayload } from '@/features/auth/types';
import type { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus'
import { useAuthStore } from '../../store'
import type { AuthState } from '../../types'
import { useRouter } from 'vue-router'

// --- Mocks ---
const mockRouterPushFn = vi.fn()
vi.mock('vue-router', async () => {
  const actual = await vi.importActual('vue-router')
  return {
    ...actual,
    useRouter: () => ({
      push: mockRouterPushFn,
    }),
  }
})

const mockAuthStoreLogin = vi.fn()
const mockAuthStoreRegister = vi.fn()
const mockAuthStoreLogout = vi.fn()
const mockAuthStoreClearError = vi.fn()

// Define a more flexible mock for useAuthStore
// This allows individual tests to spyOn or change parts of the mock store if needed
let mockErrorValue: string | null = null
let mockIsLoadingValue = false

const mockedAuthStoreInstance = {
  login: mockAuthStoreLogin,
  register: mockAuthStoreRegister,
  logout: mockAuthStoreLogout,
  clearError: mockAuthStoreClearError,
  get currentUser() {
    return null
  }, // Example, can be made more dynamic if needed
  get accessToken() {
    return null
  }, // Example
  get error() {
    return mockErrorValue
  },
  set error(value: string | null) {
    mockErrorValue = value
  }, // Allow setting for tests
  get isLoading() {
    return mockIsLoadingValue
  },
  set isLoading(value: boolean) {
    mockIsLoadingValue = value
  }, // Allow setting for tests
  // Add other getters/actions if they are used and need specific mock behavior
}

vi.mock('../../store', () => ({
  useAuthStore: vi.fn(() => mockedAuthStoreInstance),
}))
// --- End Mocks ---

describe('LoginForm.vue', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    setActivePinia(createPinia())

    mockRouterPushFn.mockClear()
    mockAuthStoreLogin.mockClear()
    mockAuthStoreRegister.mockClear()
    mockAuthStoreLogout.mockClear()
    mockAuthStoreClearError.mockClear()
    mockedAuthStoreInstance.error = null
    mockedAuthStoreInstance.isLoading = false

    const capturedErrors: any[] = []

    wrapper = mount(LoginForm, {
      global: {
        plugins: [ElementPlus],
        stubs: {
          teleport: true,
          transition: false,
          'transition-group': false,
        },
        config: {
          // Vue app config for the test instance
          errorHandler: (err, instance, info) => {
            console.error('[Vue Test Utils Global Error Handler] Error:', err)
            console.error('[Vue Test Utils Global Error Handler] Instance:', instance)
            console.error('[Vue TestUtils Global Error Handler] Info:', info)
            capturedErrors.push({ err, instance, info })
          },
          warnHandler: (msg, instance, trace) => {
            console.warn('[Vue Test Utils Global Warn Handler] Msg:', msg)
            console.warn('[Vue Test Utils Global Warn Handler] Instance:', instance)
            console.warn('[Vue Test Utils Global Warn Handler] Trace:', trace)
          },
        },
      },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    if (wrapper && wrapper.exists()) {
      wrapper.unmount()
    }
  })

  it('renders initial form elements', () => {
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
    const buttons = wrapper.findAllComponents({ name: 'ElButton' })
    console.log('Found ElButtons:', buttons.length)
    buttons.forEach((btn, index) => {
      console.log(`Button ${index} props:`, btn.props())
    })
    const submitButton = buttons.find((button) => button.props('nativeType') === 'submit')
    console.log('Submit button found:', submitButton ? submitButton.exists() : false)
    expect(submitButton?.exists()).toBe(true)
    expect(submitButton?.text()).toBe('登录')
  })

  it('binds username and password to loginData', async () => {
    const usernameInput = wrapper.find('input[type="text"]')
    const passwordInput = wrapper.find('input[type="password"]')

    await usernameInput.setValue('testuser')
    await passwordInput.setValue('password123')

    expect(wrapper.vm.loginData.username).toBe('testuser')
    expect(wrapper.vm.loginData.password).toBe('password123')
  })

  // --- Validation Tests ---
  describe('Form Validation / Prevent Submission on Invalid', () => {
    let formInstance: FormInstance | undefined
    let validateSpy: ReturnType<typeof vi.spyOn>

    beforeEach(async () => {
      formInstance = wrapper.vm.loginFormRef
      await flushPromises()
      await wrapper.vm.$nextTick()
      // It's crucial that formInstance is defined here
      if (formInstance) {
        // Mock the validate method to call its callback
        validateSpy = vi
          .spyOn(formInstance, 'validate')
          .mockImplementation((callback?: (isValid: boolean, invalidFields?: any) => void) => {
            // This default mock implementation simulates validation failure for these tests.
            // Individual tests can override this if they need to simulate success.
            if (typeof callback === 'function') {
              // Simulate validation failure by passing false to the callback
              callback(false, {
                /* mock invalid fields if component uses them */
              })
            }
            // Element Plus validate also returns a Promise, but component uses callback style here
            // For callback style, it might not return a promise or one that resolves/rejects based on validation
            // However, to be safe and cover if it ALSO returns a promise that the component might somehow use:
            return Promise.resolve(false) // Or Promise.reject() if that's more accurate for ElPlus callback + promise mix
          })
      }
    })

    afterEach(() => {
      validateSpy?.mockRestore() // Restore original validate method
    })

    it('does not call authStore.login if username is empty', async () => {
      expect(formInstance).toBeDefined() // Ensure formInstance was set up
      await wrapper.find('input[type="text"]').setValue('')
      await wrapper.find('input[type="password"]').setValue('password123')

      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()
      await wrapper.vm.$nextTick()

      expect(validateSpy).toHaveBeenCalled()
      expect(mockAuthStoreLogin).not.toHaveBeenCalled()
    })

    it('does not call authStore.login if password is empty', async () => {
      expect(formInstance).toBeDefined()
      await wrapper.find('input[type="text"]').setValue('testuser')
      await wrapper.find('input[type="password"]').setValue('')

      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()
      await wrapper.vm.$nextTick()

      expect(validateSpy).toHaveBeenCalled()
      expect(mockAuthStoreLogin).not.toHaveBeenCalled()
    })
  })

  // --- Submission Tests ---
  describe('Form Submission', () => {
    let formInstance: FormInstance | undefined
    let validateSpy: any // Revert to any for simplicity if strict typing is problematic

    beforeEach(async () => {
      formInstance = wrapper.vm.loginFormRef
      await flushPromises()
      await wrapper.vm.$nextTick()
      if (formInstance) {
        // Ensure the mock implementation focuses on the callback usage in the component
        validateSpy = vi
          .spyOn(formInstance as any, 'validate')
          .mockImplementation((callback?: (isValid: boolean) => void) => {
            if (typeof callback === 'function') {
              callback(true) // Simulate validation success for these tests
            }
            // The component primarily uses the callback, but returning a resolved promise
            // can prevent issues if any part of the chain awaits it.
            return Promise.resolve(true)
          })
      }
      mockAuthStoreLogin.mockClear()
      mockRouterPushFn.mockClear()
      mockAuthStoreClearError.mockClear()
    })

    afterEach(() => {
      validateSpy?.mockRestore()
    })

    it('calls authStore.login and router.push on successful submission', async () => {
      expect(formInstance).toBeDefined()
      mockAuthStoreLogin.mockResolvedValue(true)

      await wrapper.find('input[type="text"]').setValue('testuser')
      await wrapper.find('input[type="password"]').setValue('password123')

      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()

      expect(validateSpy).toHaveBeenCalled()
      expect(mockAuthStoreLogin).toHaveBeenCalledTimes(1)
      expect(mockAuthStoreLogin).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      })
      expect(mockRouterPushFn).toHaveBeenCalledTimes(1)
      expect(mockRouterPushFn).toHaveBeenCalledWith('/')
      expect(wrapper.find('.text-red-500').exists()).toBe(false)
    })

    it('displays error message and does not redirect on failed login', async () => {
      expect(formInstance).toBeDefined()
      const loginError = { message: 'Invalid credentials' }
      mockAuthStoreLogin.mockResolvedValue(false)
      mockedAuthStoreInstance.error = loginError.message

      await wrapper.find('input[type="text"]').setValue('testuser')
      await wrapper.find('input[type="password"]').setValue('wrongpassword')

      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()

      expect(validateSpy).toHaveBeenCalled()
      expect(mockAuthStoreLogin).toHaveBeenCalledTimes(1)
      expect(mockRouterPushFn).not.toHaveBeenCalled()

      const errorDiv = wrapper.find('.text-red-500')
      expect(errorDiv.exists()).toBe(true)
      expect(errorDiv.text()).toBe(loginError.message)
    })

    it('shows loading state during submission and resets it', async () => {
      expect(formInstance).toBeDefined()
      // Mock validate to pass
      // validateSpy is already set up in beforeEach of this describe block to simulate success

      mockAuthStoreLogin.mockImplementation(() => {
        // Simulate async login that takes time
        return new Promise((resolve) =>
          setTimeout(() => {
            resolve(true) // Login eventually succeeds
          }, 50)
        )
      })
      // Ensure component's loading ref is initially false if not already by beforeEach
      wrapper.vm.loading = false // Directly set for test clarity before action

      await wrapper.find('input[type="text"]').setValue('testuser')
      await wrapper.find('input[type="password"]').setValue('password123')

      wrapper.find('form').trigger('submit.prevent') // Don't await this directly

      // 1. Check if loading becomes true almost immediately after submit (after validate callback)
      await flushPromises() // Process validate callback and its sync effects
      await wrapper.vm.$nextTick() // Allow Vue to react to loading.value = true

      let submitButton = wrapper
        .findAllComponents({ name: 'ElButton' })
        .find((b) => b.props('nativeType') === 'submit')
      expect(submitButton?.props('loading')).toBe(true) // Component sets its loading ref to true

      // 2. Wait for the mocked login (setTimeout) to complete.
      // This should trigger the component to set its loading state back to false in the callback of login.
      await new Promise((resolve) => setTimeout(resolve, 100)) // Wait longer than mock login
      await flushPromises() // Process promise from mockAuthStoreLogin & subsequent loading=false
      await wrapper.vm.$nextTick() // Process Vue updates from loading.value = false

      submitButton = wrapper
        .findAllComponents({ name: 'ElButton' })
        .find((b) => b.props('nativeType') === 'submit')
      expect(submitButton?.props('loading')).toBe(false)
    })

    // This test is effectively covered by the tests in 'Form Validation / Prevent Submission on Invalid'
    // We can remove it or keep it as a more direct E2E-like scenario if validate is mocked for failure.
    /*
    it('does not call authStore.login if form validation fails', async () => {
      if (formInstance) { // Ensure spy is setup if we are to re-use this test
        validateSpy = vi.spyOn(formInstance as any, 'validate').mockImplementation((callback?: (isValid: boolean) => void) => {
          if (typeof callback === 'function') callback(false); // Simulate validation failure
          return Promise.resolve(false);
        });
      }
      await wrapper.find('input[type="text"]').setValue(''); 
      await wrapper.find('input[type="password"]').setValue('password123');
      
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises(); 
      await wrapper.vm.$nextTick();

      expect(validateSpy).toHaveBeenCalled();
      expect(mockAuthStoreLogin).not.toHaveBeenCalled();
      expect(mockRouterPushFn).not.toHaveBeenCalled();
    });
    */
  })
})
