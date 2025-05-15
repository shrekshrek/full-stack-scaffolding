import { describe, it, expect, beforeEach } from 'vitest';
import { shallowMount, VueWrapper } from '@vue/test-utils';
import LoginView from '@/features/auth/views/LoginView.vue';
import LoginForm from '@/features/auth/components/LoginForm.vue'; // The actual component, will be stubbed

describe('LoginView.vue', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {
    wrapper = shallowMount(LoginView, {
      global: {
        stubs: {
          LoginForm: true, // Stub the LoginForm component
          RouterLink: { 
            template: '<a data-testid="stub-router-link"><slot /></a>',
          },
          ElCard: {
            template: '<div class="stub-el-card"><slot name="header"></slot><slot></slot></div>'
          },
          ElRow: { template: '<div><slot/></div>'}, // Stub if LoginView uses them directly
          ElCol: { template: '<div><slot/></div>'}, // Stub if LoginView uses them directly
        },
      },
    });
  });

  it('renders the LoginForm component', () => {
    expect(wrapper.findComponent(LoginForm).exists()).toBe(true);
  });

  it('renders a heading within ElCard header', () => {
    const card = wrapper.findComponent({ name: 'ElCard' });
    expect(card.exists()).toBe(true);
    // Check for the title text within the component's rendered output
    expect(wrapper.text()).toContain('欢迎回来');
  });

  it('renders a link to the register page', () => {
    const registerLink = wrapper.find('[data-testid="stub-router-link"]');
    expect(registerLink.exists()).toBe(true);
    expect(registerLink.text()).toContain('还没有账户？立即注册');
    // Optionally check the `to` prop if the stub was more sophisticated
    // For example, if RouterLink stub was: { template: '<a :to="to" data-testid="stub-router-link"><slot /></a>', props: ['to'] }
    // Then you could do: expect(registerLink.attributes('to')).toBe('/register');
  });
}); 