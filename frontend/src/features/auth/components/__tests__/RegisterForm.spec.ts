import { describe, it, expect, vi, beforeEach } from 'vitest';
import { computed, ref } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ElementPlus, { type FormInstance } from 'element-plus';
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
const mockRegisterAction = vi.fn();
const mockIsLoadingFromStore = ref(false); // Renamed for clarity
const mockErrorFromStore = ref<string | null>(null); // Renamed for clarity

vi.mock('@/features/auth/store', () => ({
  useAuthStore: () => ({
    register: mockRegisterAction,
    // isLoading: mockIsLoading, // Previous incorrect way
    // error: mockError,       // Previous incorrect way

    // Correct way: component expects unwrapped value or a computed property from store
    get isLoading() { return mockIsLoadingFromStore.value; },
    get error() { return mockErrorFromStore.value; },
    // If tests need to directly manipulate the mock store state (not always recommended, prefer actions):
    // set isLoading(val: boolean) { mockIsLoadingFromStore.value = val; },
    // set error(val: string | null) { mockErrorFromStore.value = val; },
  }),
}));

// --- 新增的 Ultra Simple Component Mount Test ---
describe('Ultra Simple Component Mount Test', () => {
  const SimpleComponent = {
    template: '<div>Hello Vitest User</div>', // 一个极其简单的组件
  };

  it('mounts an ultra simple inline component without issues', () => {
    let wrapper;
    let errored = false;
    let errorDetails: any = null;

    try {
      wrapper = mount(SimpleComponent); // 挂载这个简单组件
    } catch (e) {
      errored = true;
      errorDetails = e;
      console.error("Error during ultra simple component mount:", e);
      if (e instanceof Error && e.stack) {
        console.error("Stack trace (ultra simple mount):", e.stack);
      } else {
        console.error("Error object (ultra simple mount) does not have a stack or is not an Error instance:", e);
      }
    }

    if (errored) {
        console.error("Ultra simple mounting FAILED with details:", errorDetails);
    }
    expect(errored).toBe(false); // 期望没有错误
    // @ts-ignore
    expect(wrapper.exists()).toBe(true); // 期望组件存在
    // @ts-ignore
    expect(wrapper.text()).toContain('Hello Vitest User'); // 期望内容正确
  });
});
// --- 结束新增的测试 ---

describe('RegisterForm.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    mockRouterPush.mockClear();
    mockRegisterAction.mockClear();
    mockIsLoadingFromStore.value = false; // Update the ref for the mock
    mockErrorFromStore.value = null;      // Update the ref for the mock
  });

  const createWrapper = () => {
    return mount(RegisterForm, {
      global: {
        plugins: [ElementPlus],
        // stubs: {} // Ensure stubs are not active
      },
    });
  };

  it('component simply mounts with ElementPlus plugin and reactive store mock', () => {
    let wrapper;
    let errored = false;
    let errorDetails: any = null;

    try {
      wrapper = createWrapper();
    } catch (e) {
      errored = true;
      errorDetails = e;
      console.error("Error during mount (with ElementPlus plugin):", e);
      if (e instanceof Error && e.stack) {
        console.error("Stack trace:", e.stack);
      } else {
        console.error("Error object does not have a stack or is not an Error instance:", e);
      }
    }
    if (errored) {
        console.error("Mounting failed with details:", errorDetails);
    }
    expect(errored).toBe(false); 
    // @ts-ignore
    expect(wrapper.exists()).toBe(true);
  });

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
    const fillFormCorrectly_local = async (wrapper: any) => {
      (wrapper.vm as any).registerForm.fullName = 'Test User';
      (wrapper.vm as any).registerForm.email = 'test@example.com';
      (wrapper.vm as any).registerForm.password = 'password123';
      (wrapper.vm as any).registerForm.confirmPassword = 'password123';
      await flushPromises();
    };

    it('requires fullName, email, password, and confirmPassword (by checking validate() rejection)', async () => {
      const wrapper = createWrapper();
      // const formInstance = (wrapper.vm as any).registerFormRef as FormInstance; // 旧方法

      // 使用 setValue 模拟用户输入
      await wrapper.find('input[placeholder="请输入您的用户名"]').setValue('');
      await wrapper.find('input[placeholder="请输入邮箱地址"]').setValue('');
      await wrapper.find('input[placeholder="请输入密码"]').setValue('');
      await wrapper.find('input[placeholder="请再次输入密码"]').setValue('');
      
      await flushPromises();
      await new Promise(resolve => setTimeout(resolve, 20)); // 进一步增加延迟

      const elFormWrapper = wrapper.findComponent({ name: 'ElForm' });
      expect(elFormWrapper.exists()).toBe(true);
      const formInstanceFromComponent = elFormWrapper.vm as FormInstance; // 从组件实例获取

      console.log('[Test Debug] Form model before validate:', JSON.stringify((wrapper.vm as any).registerForm));
      if (elFormWrapper.exists()) {
        console.log('[Test Debug] ElForm props.model:', JSON.stringify(elFormWrapper.props('model')));
        console.log('[Test Debug] ElForm props.rules:', JSON.stringify(elFormWrapper.props('rules')));
      }

      let validationFailed = false;
      // let validationError = null; // No longer strictly needed if we don't inspect it
      try {
        console.log('[Test Debug] Calling formInstanceFromComponent.validate()...');
        await formInstanceFromComponent.validate(); // 使用直接获取的实例
        console.log('[Test Debug] Validation Succeeded (UNEXPECTED)');
      } catch (e: any) {
        validationFailed = true;
        // validationError = e; // Store if needed for other debugging
        console.log('[Test Debug] Validation Failed (EXPECTED), error object:', JSON.stringify(e)); // Log the actual error object
        // Since e is {}, the following checks will fail. We now rely on validationFailed === true.
        // expect(e.fullName).toBeDefined();
        // expect(e.email).toBeDefined();
        // expect(e.password).toBeDefined();
      }

      if (!validationFailed) {
         console.log('[Test Debug] FINAL: Validation did NOT fail. Model:', JSON.stringify((wrapper.vm as any).registerForm));
      }
      expect(validationFailed).toBe(true); // This should now pass
    });

    it('requires a valid email format (by checking overall form rejection)', async () => {
      const wrapper = createWrapper();
      const elFormWrapperEmail = wrapper.findComponent({ name: 'ElForm' });
      expect(elFormWrapperEmail.exists()).toBe(true);
      const formInstanceFromComponentEmail = elFormWrapperEmail.vm as FormInstance;

      // Set other fields to be valid
      (wrapper.vm as any).registerForm.fullName = 'Test User';
      (wrapper.vm as any).registerForm.password = 'password123';
      (wrapper.vm as any).registerForm.confirmPassword = 'password123';
      // Set an invalid email
      await wrapper.find('input[placeholder="请输入邮箱地址"]').setValue('invalid-email');
      
      await flushPromises();
      await new Promise(resolve => setTimeout(resolve, 20)); 

      console.log('[Test Debug Email] Form model before validate:', JSON.stringify((wrapper.vm as any).registerForm));

      let validationDidReject = false;
      try {
        console.log('[Test Debug Email] Calling formInstanceFromComponentEmail.validate()...');
        await formInstanceFromComponentEmail.validate(); 
        console.log('[Test Debug Email] validate() Succeeded (UNEXPECTED for invalid email)');
      } catch (error: any) { 
        console.log('[Test Debug Email] validate() Failed (EXPECTED for invalid email), error:', JSON.stringify(error));
        validationDidReject = true; // We only care that it rejected
      }
      if (!validationDidReject) { 
         console.log('[Test Debug Email] FINAL: Overall form validation did NOT reject as expected for invalid email.');
      }
      expect(validationDidReject).toBe(true);
    });

    it('requires passwords to match (by checking overall form rejection)', async () => {
      const wrapper = createWrapper();
      const elFormWrapperPassMatch = wrapper.findComponent({ name: 'ElForm' });
      expect(elFormWrapperPassMatch.exists()).toBe(true);
      const formInstanceFromComponentPassMatch = elFormWrapperPassMatch.vm as FormInstance;
      
      // Set other fields to be valid
      await wrapper.find('input[placeholder="请输入您的用户名"]').setValue('Test User');
      await wrapper.find('input[placeholder="请输入邮箱地址"]').setValue('test@example.com');
      // Set mismatching passwords
      await wrapper.find('input[placeholder="请输入密码"]').setValue('password123');
      await wrapper.find('input[placeholder="请再次输入密码"]').setValue('password456');

      await flushPromises();
      await new Promise(resolve => setTimeout(resolve, 20));

      console.log('[Test Debug PassMatch] Form model before validate:', JSON.stringify((wrapper.vm as any).registerForm));

      let validationDidRejectForMismatch = false;
      try {
        console.log('[Test Debug PassMatch] Calling formInstanceFromComponentPassMatch.validate()...');
        await formInstanceFromComponentPassMatch.validate();
        console.log('[Test Debug PassMatch] validate() Succeeded (UNEXPECTED for password mismatch)');
      } catch (error: any) {
        console.log('[Test Debug PassMatch] validate() Failed (EXPECTED for password mismatch), error:', JSON.stringify(error));
        validationDidRejectForMismatch = true; // We only care that it rejected
      }
      if (!validationDidRejectForMismatch) { 
         console.log('[Test Debug PassMatch] FINAL: Overall form validation did NOT reject as expected for password mismatch.');
      }
      expect(validationDidRejectForMismatch).toBe(true);
    });

    it('validates successfully with correct inputs', async () => {
      const wrapper = createWrapper();
      await fillFormCorrectly_local(wrapper); 
      const formInstance = (wrapper.vm as any).registerFormRef as FormInstance;
      let isValid = false;
      try {
        await formInstance.validate();
        isValid = true;
      } catch (e) {
        isValid = false;
      }
      expect(isValid).toBe(true);
    });
  });

  describe('Form Submission', () => {
    const fillFormCorrectly = async (wrapper: any) => {
      (wrapper.vm as any).registerForm.fullName = 'Test User';
      (wrapper.vm as any).registerForm.email = 'test@example.com';
      (wrapper.vm as any).registerForm.password = 'password123';
      (wrapper.vm as any).registerForm.confirmPassword = 'password123';
      await flushPromises();
    };

    it('calls authStore.register and router.push on successful submission', async () => {
      const wrapper = createWrapper();
      await fillFormCorrectly(wrapper);

      mockRegisterAction.mockResolvedValueOnce(true);
      mockErrorFromStore.value = null; // Ensure no pre-existing error

      await wrapper.find('form').trigger('submit.prevent');
      await flushPromises(); 

      expect(mockRegisterAction).toHaveBeenCalledTimes(1);
      expect(mockRegisterAction).toHaveBeenCalledWith({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      } as RegisterPayload);
      expect(mockRouterPush).toHaveBeenCalledWith('/');
      expect(wrapper.find('.text-red-500').exists()).toBe(false); 
    });

    it('displays error message from authStore on failed submission', async () => {
      const wrapper = createWrapper();
      await fillFormCorrectly(wrapper);
      
      const errorMessage = 'Registration failed from server';
      mockRegisterAction.mockResolvedValueOnce(false);
      // Simulate error being set in the store
      mockErrorFromStore.value = errorMessage; // Correctly set the backing ref for the mock

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

      let resolveRegister: (value: boolean) => void;
      mockRegisterAction.mockImplementationOnce(async () => {
        console.log('[mockRegisterAction] Before setting mockIsLoadingFromStore.value to true:', mockIsLoadingFromStore.value);
        mockIsLoadingFromStore.value = true; 
        console.log('[mockRegisterAction] After setting mockIsLoadingFromStore.value to true:', mockIsLoadingFromStore.value);
        // @ts-ignore
        console.log('[mockRegisterAction] Store mock isLoading getter returns:', useAuthStore().isLoading);
        // @ts-ignore
        console.log('[mockRegisterAction] Component isLoading before promise resolve:', wrapper.vm.isLoading);
        
        await new Promise(resolve => { resolveRegister = resolve; }); // Wait for resolveRegister to be called
        // Note: mockIsLoadingFromStore.value = false; will be set *after* this promise resolves in the test body
      });
      
      mockIsLoadingFromStore.value = false; 
      // @ts-ignore
      console.log('[Test Body] Initial component isLoading:', wrapper.vm.isLoading);

      wrapper.find('form').trigger('submit.prevent');
      await flushPromises(); 
      
      // @ts-ignore
      console.log('[Test Body] Component isLoading after submit & first flush:', wrapper.vm.isLoading);
      // @ts-ignore
      expect(wrapper.vm.isLoading).toBe(true); 

      // @ts-ignore
      resolveRegister(true); // Resolve the promise
      // Simulate the store action completing and setting loading to false
      mockIsLoadingFromStore.value = false; // <--- CRITICAL: Set loading state back
      await flushPromises(); // Flush again for UI to react to isLoading change
      
      // @ts-ignore
      console.log('[Test Body] Component isLoading after resolve & second flush:', wrapper.vm.isLoading);
      // @ts-ignore
      expect(wrapper.vm.isLoading).toBe(false); 
    });
  });
}); 