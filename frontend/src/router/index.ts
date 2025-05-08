import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 定义路由
const routes: RouteRecordRaw[] = [
  // 公共路由
  {
    path: '/',
    component: () => import('@/pages/home/index.vue'),
    meta: { title: '首页' }
  },
  {
    path: '/login',
    component: () => import('@/pages/auth/login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/register',
    component: () => import('@/pages/auth/register.vue'),
    meta: { title: '注册' }
  },

  // 需要认证的路由
  {
    path: '/profile',
    component: () => import('@/pages/profile/index.vue'),
    meta: { title: '个人资料', requiresAuth: true }
  },
  {
    path: '/todo',
    component: () => import('@/pages/todo/index.vue'),
    meta: { title: '待办事项', requiresAuth: true }
  },

  // 错误页面
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/pages/error/not-found/index.vue'),
    meta: { title: '页面不存在' }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || '首页'} | ${import.meta.env.VITE_APP_TITLE || 'FastAPI+Vue全栈应用'}`

  // 检查认证要求
  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token')
    if (!token) {
      next({ path: '/login', query: { redirect: to.fullPath } })
      return
    }
  }

  next()
})

export default router
