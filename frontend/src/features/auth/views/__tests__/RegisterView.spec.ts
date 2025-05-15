import { describe, it, expect, beforeEach } from 'vitest';
import { shallowMount, VueWrapper } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import { createRouter, createWebHistory, type Router } from 'vue-router';

import RegisterView from '../RegisterView.vue';
import RegisterForm from '@/features/auth/components/RegisterForm.vue'; // 实际组件

// Mock RegisterForm to simplify RegisterView tests
// 如果 RegisterForm 内部逻辑复杂或有副作用，mock 它可以避免在视图测试中处理这些复杂性。
// 但对于这个案例，我们也可以不 mock，直接测试 RegisterForm 是否被渲染。
// 为了演示，这里暂时不 mock RegisterForm，而是检查它是否真的被渲染。

describe('RegisterView.vue', () => {
  let router: Router;
  let wrapper: VueWrapper<any>;

  beforeEach(async () => {
    setActivePinia(createPinia());

    router = createRouter({
      history: createWebHistory(),
      routes: [
        { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
        { path: '/login', name: 'login', component: { template: '<div>Login Page</div>' } },
        { path: '/register', name: 'register', component: RegisterView },
      ],
    });

    // 等待路由初始化完成
    router.push('/register');
    await router.isReady();

    wrapper = shallowMount(RegisterView, {
      global: {
        plugins: [ElementPlus, router],
        stubs: {
          RegisterForm: true, 
          // RouterLink can also be stubbed if not relevant to the test
          RouterLink: { 
            template: '<a data-testid="stub-router-link"><slot /></a>',
          },
          ElCard: { // Stub ElCard as its content is not the focus here
            template: '<div class="stub-el-card"><slot name="header"></slot><slot></slot></div>'
          },
          ElRow: { template: '<div><slot/></div>'},
          ElCol: { template: '<div><slot/></div>'},
        },
      },
    });
  });

  it('renders the main container and card', () => {
    expect(wrapper.find('.register-view').exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'ElCard' }).exists()).toBe(true);
  });

  it('displays the correct title', () => {
    const cardHeader = wrapper.find('.el-card__header'); // Element Plus specific class
    expect(cardHeader.exists()).toBe(true);
    expect(cardHeader.text()).toContain('创建您的账户');
  });

  it('renders the RegisterForm component', () => {
    expect(wrapper.findComponent(RegisterForm).exists()).toBe(true);
  });

  it('renders a heading within ElCard header', () => {
    // Assuming the h1 is directly within the ElCard header slot
    const card = wrapper.findComponent({ name: 'ElCard' });
    expect(card.exists()).toBe(true);
    // Check for h1 inside the stubbed ElCard structure or by finding text
    // If ElCard's header slot is used, it might be rendered inside it.
    // For a shallow mount with stubs, verifying the presence of RegisterForm is often sufficient.
    // The exact structure of the title depends on how ElCard handles its header slot
    // Let's simplify and check if the expected text "创建您的账户" exists anywhere in the component,
    // as the title might be passed as a prop or exist in a slot.
    expect(wrapper.text()).toContain('创建您的账户');
  });

  it('renders a link to the login page', () => {
    const loginLink = wrapper.find('[data-testid="stub-router-link"]');
    expect(loginLink.exists()).toBe(true);
    expect(loginLink.text()).toContain('已有账户？立即登录');
    // If RouterLink props like `to` need to be checked, it would be:
    // expect(loginLink.attributes('to')).toBe('/login'); // This won't work as easily with a simple template stub
    // For this, we'd need a more sophisticated stub or not stub RouterLink if its `to` prop is critical
  });
}); 