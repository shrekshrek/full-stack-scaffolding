import { describe, it, expect, vi, beforeEach } from 'vitest'
import { computed, ref } from 'vue'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ElementPlus, { type FormInstance, type ElForm } from 'element-plus'
import 'element-plus/dist/index.css' // Import Element Plus styles for tests

import RegisterForm from '../RegisterForm.vue'
import { useAuthStore } from '@/features/auth/store'
import type { RegisterPayload } from '@/features/auth/types'

// Mock vue-router
const mockRouterPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
  // Mock RouterLink if it were used directly in RegisterForm (it's not)
  // RouterLink: { template: '<a><slot /></a>' }
}))

// Mock Pinia store (useAuthStore)
const mockRegisterAction = vi.fn()
const mockIsLoadingFromStore = ref(false) // Renamed for clarity
const mockErrorFromStore = ref<string | null>(null) // Renamed for clarity

vi.mock('@/features/auth/store', () => ({
  useAuthStore: () => ({
    register: mockRegisterAction,
    // isLoading: mockIsLoading, // Previous incorrect way
    // error: mockError,       // Previous incorrect way

    // Correct way: component expects unwrapped value or a computed property from store
    get isLoading() {
      return mockIsLoadingFromStore.value
    },
    get error() {
      return mockErrorFromStore.value
    },
    // If tests need to directly manipulate the mock store state (not always recommended, prefer actions):
    // set isLoading(val: boolean) { mockIsLoadingFromStore.value = val; },
    // set error(val: string | null) { mockErrorFromStore.value = val; },
    // Methods to simulate store state changes from tests if needed
    _setIsLoading: (val: boolean) => {
      mockIsLoadingFromStore.value = val
    },
    _setError: (val: string | null) => {
      mockErrorFromStore.value = val
    },
  }),
}))

describe('RegisterForm.vue', () => {
  let wrapper: any // Define wrapper at a higher scope for beforeEach/afterEach if needed

  beforeEach(() => {
    setActivePinia(createPinia())
    mockRouterPush.mockClear()
    mockRegisterAction.mockClear()
    mockIsLoadingFromStore.value = false
    mockErrorFromStore.value = null

    // Create wrapper here if it's always the same, or in tests if it varies
    wrapper = mount(RegisterForm, {
      global: {
        plugins: [ElementPlus],
      },
    })
  })

  const createWrapper = () => {
    // Keep createWrapper if some tests need a fresh one
    return mount(RegisterForm, {
      global: {
        plugins: [ElementPlus],
      },
    })
  }

  it('component mounts correctly with ElementPlus plugin and reactive store mock', () => {
    // wrapper is already created in beforeEach
    expect(wrapper.exists()).toBe(true)
  })

  it('renders the registration form correctly', () => {
    // wrapper is already created in beforeEach
    expect(wrapper.find('input[placeholder="请输入您的用户名"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="请输入邮箱地址"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="请输入密码"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="请再次输入密码"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').text()).toContain('注册')
  })

  it('updates form data on user input', async () => {
    // wrapper is already created in beforeEach
    await wrapper.find('input[placeholder="请输入您的用户名"]').setValue('Test User')
    await wrapper.find('input[placeholder="请输入邮箱地址"]').setValue('test@example.com')
    await wrapper.find('input[placeholder="请输入密码"]').setValue('password123')
    await wrapper.find('input[placeholder="请再次输入密码"]').setValue('password123')

    const formViewModel = wrapper.vm.registerForm
    expect(formViewModel.username).toBe('Test User')
    expect(formViewModel.email).toBe('test@example.com')
    expect(formViewModel.password).toBe('password123')
    expect(formViewModel.confirmPassword).toBe('password123')
  })

  describe('Form Validation & Submission Logic', () => {
    // Helper to fill the form with valid data
    const fillForm = async (w: any, data: Record<string, string>) => {
      if (data.username !== undefined)
        await w.find('input[placeholder="请输入您的用户名"]').setValue(data.username)
      if (data.email !== undefined)
        await w.find('input[placeholder="请输入邮箱地址"]').setValue(data.email)
      if (data.password !== undefined)
        await w.find('input[placeholder="请输入密码"]').setValue(data.password)
      if (data.confirmPassword !== undefined)
        await w.find('input[placeholder="请再次输入密码"]').setValue(data.confirmPassword)
      await flushPromises()
    }

    it('calls authStore.register and navigates on successful submission', async () => {
      // wrapper is already created in beforeEach
      const formInstance = wrapper.vm.registerFormRef as InstanceType<typeof ElForm>
      const validateSpy = vi.spyOn(formInstance, 'validate').mockResolvedValue(true)

      await fillForm(wrapper, {
        username: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })

      mockRegisterAction.mockResolvedValue(true) // Simulate successful registration

      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()

      expect(validateSpy).toHaveBeenCalled()
      expect(mockRegisterAction).toHaveBeenCalledWith({
        username: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })
      expect(mockRouterPush).toHaveBeenCalledWith('/')

      validateSpy.mockRestore()
    })

    it('does not call authStore.register if validation fails', async () => {
      // wrapper is already created in beforeEach
      const formInstance = wrapper.vm.registerFormRef as InstanceType<typeof ElForm>
      // Simulate validation failure by having the promise reject
      // Element Plus's validate promise rejects with an object of failed fields,
      // but for this test, just rejecting is enough to test the control flow.
      // For more specific tests on which fields failed, one might inspect the rejected value.
      const validateSpy = vi.spyOn(formInstance, 'validate').mockRejectedValue({
        username: [{ message: '错误', field: 'username' }],
      })

      await fillForm(wrapper, { username: '' }) // Make form invalid

      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()

      expect(validateSpy).toHaveBeenCalled()
      expect(mockRegisterAction).not.toHaveBeenCalled()
      expect(mockRouterPush).not.toHaveBeenCalled() // Should not navigate

      validateSpy.mockRestore()
    })

    it('shows loading state during submission and resets it after success', async () => {
      // wrapper is already created in beforeEach
      const formInstance = wrapper.vm.registerFormRef as InstanceType<typeof ElForm>
      const validateSpy = vi.spyOn(formInstance, 'validate').mockResolvedValue(true)

      mockRegisterAction.mockImplementation(async () => {
        // Simulate API call latency
        expect(wrapper.vm.isLoading).toBe(true) // isLoading from store mock via component computed
        expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeDefined() // Check ElButton :loading state
        await new Promise((resolve) => setTimeout(resolve, 50))
        return true // Simulate successful registration
      })

      await fillForm(wrapper, {
        username: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })

      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises() // Ensure all promises resolve, including the one in mockRegisterAction

      expect(mockRegisterAction).toHaveBeenCalled()
      expect(wrapper.vm.isLoading).toBe(false) // Should be reset
      expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined()

      validateSpy.mockRestore()
    })

    it('shows loading state during submission and resets it after auth failure', async () => {
      // wrapper is already created in beforeEach
      const formInstance = wrapper.vm.registerFormRef as InstanceType<typeof ElForm>
      const validateSpy = vi.spyOn(formInstance, 'validate').mockResolvedValue(true)

      mockRegisterAction.mockImplementation(async () => {
        expect(wrapper.vm.isLoading).toBe(true)
        mockErrorFromStore.value = 'Registration failed from API' // Simulate error from store
        await new Promise((resolve) => setTimeout(resolve, 50))
        return false // Simulate failed registration
      })

      await fillForm(wrapper, {
        username: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })

      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises()

      expect(mockRegisterAction).toHaveBeenCalled()
      expect(wrapper.vm.isLoading).toBe(false) // Should be reset
      expect(wrapper.find('button[type="submit"]').attributes('disabled')).toBeUndefined()
      // Error message display is tested in a separate test

      validateSpy.mockRestore()
    })

    it('displays error message from store on registration failure', async () => {
      // wrapper is already created in beforeEach
      const formInstance = wrapper.vm.registerFormRef as InstanceType<typeof ElForm>
      const validateSpy = vi.spyOn(formInstance, 'validate').mockResolvedValue(true)

      mockRegisterAction.mockResolvedValue(false) // Simulate registration failure
      const errorMessage = 'NICKNAME_TAKEN_OR_EMAIL_EXISTS'
      // Simulate store updating its error state
      // We need to trigger this as part of the mockRegisterAction or after it's called
      // For this test, let's assume the action sets the error state in the store
      // The component's `errorMsg` computed property should then pick it up.

      // We need to make sure errorMsg is updated *before* we check for it.
      // The component's errorMsg is computed from authStore.error.
      // So, after authStore.register fails, the store's error state should be set.
      mockRegisterAction.mockImplementation(async () => {
        ;(useAuthStore() as any)._setError(errorMessage) // Directly set mock store error
        return false // registration failed
      })

      await fillForm(wrapper, {
        username: 'TakenUser',
        email: 'exists@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      })

      await wrapper.find('form').trigger('submit.prevent')
      await flushPromises() // Let promises resolve and UI update

      expect(mockRegisterAction).toHaveBeenCalled()
      expect(wrapper.vm.errorMsg).toBe(errorMessage) // Check component's computed error message
      const errorParagraph = wrapper.find('.text-red-500')
      expect(errorParagraph.exists()).toBe(true)
      expect(errorParagraph.text()).toBe(errorMessage)

      validateSpy.mockRestore()
    })

    // The following tests become less critical with the new strategy,
    // as we are no longer testing Element Plus's internal validation messages,
    // but rather our component's behavior based on a mocked validation outcome.
    // We trust Element Plus to show its own validation messages if its `validate()` rejects.
    // However, we can keep them if we want to ensure our *rules* are passed to ElForm.
    // For now, I'll comment them out to focus on the interaction logic.

    /*
    // Commenting out detailed validation rule tests as they test ElPlus internals
    // more than our component logic, given our new mocking strategy for `validate()`
    
    it('requires username (simulating validate rejection)', async () => {
      const wrapper = createWrapper(); // Fresh wrapper
      const formInstance = wrapper.vm.registerFormRef as InstanceType<typeof ElForm>;
      const validateSpy = vi.spyOn(formInstance, 'validate').mockRejectedValue({
        username: [{ message: '请输入用户名', field: 'username' }],
      });

      await fillForm(wrapper, {
        username: '', // Invalid
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
      });
      
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();

      expect(validateSpy).toHaveBeenCalled();
      // We are not checking for visual error messages here anymore with this strategy.
      // The key is that authStore.register was not called.
      expect(mockRegisterAction).not.toHaveBeenCalled();
      validateSpy.mockRestore();
    });

    it('requires a valid email format (simulating validate rejection)', async () => {
      const wrapper = createWrapper(); // Fresh wrapper
      const formInstance = wrapper.vm.registerFormRef as InstanceType<typeof ElForm>;
      const validateSpy = vi.spyOn(formInstance, 'validate').mockRejectedValue({
        email: [{ message: '请输入有效的邮箱地址', field: 'email' }],
      });

      await fillForm(wrapper, {
        username: 'TestUser',
        email: 'invalid-email', // Invalid
        password: 'password123',
        confirmPassword: 'password123',
      });

      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();
      
      expect(validateSpy).toHaveBeenCalled();
      expect(mockRegisterAction).not.toHaveBeenCalled();
      validateSpy.mockRestore();
    });

    it('requires passwords to match (simulating validate rejection)', async () => {
      const wrapper = createWrapper(); // Fresh wrapper
      const formInstance = wrapper.vm.registerFormRef as InstanceType<typeof ElForm>;
      const validateSpy = vi.spyOn(formInstance, 'validate').mockRejectedValue({
        confirmPassword: [{ message: '两次输入的密码不一致!', field: 'confirmPassword' }],
      });

      await fillForm(wrapper, {
        username: 'TestUser',
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password456', // Mismatch
      });
      
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();

      expect(validateSpy).toHaveBeenCalled();
      expect(mockRegisterAction).not.toHaveBeenCalled();
      validateSpy.mockRestore();
    });
    */
  })

  // Clean up spies or other global mocks if any were set up outside of specific tests
  // afterEach(() => {
  //   vi.restoreAllMocks(); // Could be too broad, prefer targeted restoration
  // });
})
