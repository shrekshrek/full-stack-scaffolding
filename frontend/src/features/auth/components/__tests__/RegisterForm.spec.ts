import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'; // Import Element Plus styles for tests

import RegisterForm from '../RegisterForm.vue';
import { useAuthStore } from '@/features/auth/store';
import type { RegisterPayload } from '@/features/auth/types';

// Mock vue-router
const mockRouterPush = vi.fn();
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
  // Mock RouterLink if it were used directly in RegisterForm (it's not)
  // RouterLink: { template: '<a><slot /></a>' }
}));

// Mock Pinia store (useAuthStore)
// We need to mock the actions that RegisterForm will call
const mockRegisterAction = vi.fn();
vi.mock('@/features/auth/store', () => ({
  useAuthStore: () => ({
    register: mockRegisterAction,
    isLoading: false, // Provide reactive properties if needed directly by the component
    error: null,
  }),
}));


describe('RegisterForm.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockRouterPush.mockClear();
    mockRegisterAction.mockClear();
    // Reset parts of the mocked store if necessary, for example, if error state persists
    const authStore = useAuthStore();
    // @ts-ignore - Allow direct modification for testing
    authStore.error = null; 
    // @ts-ignore
    authStore.isLoading = false;
  });

  const createWrapper = () => {
    return mount(RegisterForm, {
      global: {
        plugins: [ElementPlus], // Ensure Element Plus is installed for the test environment
        // stubs: { 'el-form': true, 'el-form-item': true, 'el-input': true, 'el-button': true } // Optional: stub heavy components
      },
    });
  };

  it('renders the registration form correctly', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('input[placeholder="请输入您的用户名"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="请输入邮箱地址"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="请输入密码"]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="请再次输入密码"]').exists()).toBe(true);
    expect(wrapper.find('button[type="submit"]').text()).toContain('注册');
  });

  it('updates form data on user input', async () => {
    const wrapper = createWrapper();
    await wrapper.find('input[placeholder="请输入您的用户名"]').setValue('Test User');
    await wrapper.find('input[placeholder="请输入邮箱地址"]').setValue('test@example.com');
    await wrapper.find('input[placeholder="请输入密码"]').setValue('password123');
    await wrapper.find('input[placeholder="请再次输入密码"]').setValue('password123');

    // Access the component instance to check the reactive form data
    // @ts-ignore - vm is available on wrapper
    const formViewModel = wrapper.vm.registerForm; 
    expect(formViewModel.fullName).toBe('Test User');
    expect(formViewModel.email).toBe('test@example.com');
    expect(formViewModel.password).toBe('password123');
    expect(formViewModel.confirmPassword).toBe('password123');
  });

  describe('Form Validation', () => {
    it('requires fullName, email, password, and confirmPassword', async () => {
      const wrapper = createWrapper();
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises(); // Wait for validation messages to appear

      const errorMessages = wrapper.findAll('.el-form-item__error');
      expect(errorMessages.length).toBeGreaterThanOrEqual(3); // fullName, email, password (confirmPassword might depend on password being filled)
      expect(wrapper.html()).toContain('请输入用户名');
      expect(wrapper.html()).toContain('请输入邮箱地址');
      expect(wrapper.html()).toContain('请输入密码');
      // Note: confirmPassword validation might only trigger after password has a value due to custom validator logic
    });

    it('requires a valid email format', async () => {
      const wrapper = createWrapper();
      const emailInput = wrapper.find('input[placeholder="请输入邮箱地址"]');
      await emailInput.setValue('invalid-email');
      await wrapper.find('form').trigger('submit.prevent'); // Or trigger blur on email field
      await flushPromises();
      expect(wrapper.html()).toContain('请输入有效的邮箱地址');
    });

    it('requires passwords to match', async () => {
      const wrapper = createWrapper();
      await wrapper.find('input[placeholder="请输入密码"]').setValue('password123');
      await wrapper.find('input[placeholder="请再次输入密码"]').setValue('password456');
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();
      expect(wrapper.html()).toContain('两次输入的密码不一致!');
    });

    it('validates successfully with correct inputs', async () => {
      const wrapper = createWrapper();
      await wrapper.find('input[placeholder="请输入您的用户名"]').setValue('Test User');
      await wrapper.find('input[placeholder="请输入邮箱地址"]').setValue('test@example.com');
      await wrapper.find('input[placeholder="请输入密码"]').setValue('password123');
      await wrapper.find('input[placeholder="请再次输入密码"]').setValue('password123');
      
      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();
      
      // Check that no error messages are displayed for these fields
      // This is a bit implicit; a more direct way would be to spy on the validate method of the form
      const form = wrapper.findComponent({ ref: 'registerFormRef' });
      let isValid = false;
      try {
        // @ts-ignore
        await form.vm.validate();
        isValid = true;
      } catch (e) {
        isValid = false;
      }
      expect(isValid).toBe(true);
      expect(wrapper.findAll('.el-form-item__error').length).toBe(0); 
    });
  });

  describe('Form Submission', () => {
    const fillFormCorrectly = async (wrapper: any) => {
      await wrapper.find('input[placeholder="请输入您的用户名"]').setValue('Test User');
      await wrapper.find('input[placeholder="请输入邮箱地址"]').setValue('test@example.com');
      await wrapper.find('input[placeholder="请输入密码"]').setValue('password123');
      await wrapper.find('input[placeholder="请再次输入密码"]').setValue('password123');
    };

    it('calls authStore.register and router.push on successful submission', async () => {
      const wrapper = createWrapper();
      await fillFormCorrectly(wrapper);

      // Mock store action to resolve successfully
      mockRegisterAction.mockResolvedValueOnce(true);
      // @ts-ignore
      useAuthStore().error = null; // Ensure no pre-existing error

      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises(); // Wait for async operations (store action, potential navigation)

      expect(mockRegisterAction).toHaveBeenCalledTimes(1);
      expect(mockRegisterAction).toHaveBeenCalledWith({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      } as RegisterPayload);
      expect(mockRouterPush).toHaveBeenCalledWith('/');
      expect(wrapper.find('.text-red-500').exists()).toBe(false); // No error message
    });

    it('displays error message from authStore on failed submission', async () => {
      const wrapper = createWrapper();
      await fillFormCorrectly(wrapper);
      
      const errorMessage = 'Registration failed from server';
      // Mock store action to resolve to false (failed registration)
      mockRegisterAction.mockResolvedValueOnce(false);
      // Simulate error being set in the store
      // @ts-ignore
      useAuthStore().error = errorMessage; 

      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises();

      expect(mockRegisterAction).toHaveBeenCalledTimes(1);
      expect(mockRouterPush).not.toHaveBeenCalled();
      const errorDiv = wrapper.find('.text-red-500');
      expect(errorDiv.exists()).toBe(true);
      expect(errorDiv.text()).toBe(errorMessage);
    });

    it('sets loading state during submission', async () => {
      const wrapper = createWrapper();
      await fillFormCorrectly(wrapper);

      // Make the mock register action take some time and control its resolution
      let resolveRegister: (value: boolean) => void;
      mockRegisterAction.mockImplementationOnce(() => {
        // @ts-ignore
        useAuthStore().isLoading = true; // Simulate store setting isLoading
        return new Promise(resolve => {
          resolveRegister = resolve;
        });
      });
      
      // @ts-ignore
      useAuthStore().isLoading = false; // Ensure isLoading is false initially

      wrapper.find('form').trigger('submit.prevent');
      await flushPromises(); // Let the submission start and isLoading be set
      
      // Check that the button is in loading state (Element Plus uses el-icon is-loading inside button)
      // Direct check on button's loading prop is also possible if component exposes it easily.
      // For now, we rely on the store's isLoading being reflected if the component binds to it.
      // The component itself has a local `loading` ref that should be true.
      // @ts-ignore
      expect(wrapper.vm.loading).toBe(true); // Check internal loading state of component

      // @ts-ignore
      resolveRegister(true); // Complete the registration
      await flushPromises(); // Wait for all promises to settle
      // @ts-ignore
      expect(wrapper.vm.loading).toBe(false); // Check loading state is reset
    });
  });
}); 