<template>
  <el-container class="app-container">
    <el-header height="auto" class="app-header">
      <el-row class="header-row">
        <el-col :span="24">
          <div class="header-content">
            <div class="logo-container">
              <router-link to="/" class="logo-link">
                <i class="i-carbon-application logo-icon"></i>
                <span>全栈应用</span>
              </router-link>
            </div>

            <el-menu
              mode="horizontal"
              :ellipsis="false"
              class="main-menu"
              :default-active="activeIndex"
            >
              <el-menu-item index="/">
                <router-link to="/" class="nav-link">首页</router-link>
              </el-menu-item>
              <template v-if="authStore.isAuthenticated">
                <el-menu-item index="/todo">
                  <router-link to="/todo" class="nav-link">待办事项</router-link>
                </el-menu-item>
                <el-menu-item index="/profile">
                  <router-link to="/profile" class="nav-link">个人中心</router-link>
                </el-menu-item>
              </template>
            </el-menu>

            <div class="user-actions">
              <template v-if="!authStore.isAuthenticated">
                <router-link to="/login">
                  <el-button link class="login-btn">登录</el-button>
                </router-link>
                <router-link to="/register">
                  <el-button type="primary" class="register-btn">注册</el-button>
                </router-link>
              </template>
              <template v-else>
                <el-dropdown trigger="click" @command="handleCommand">
                  <div class="user-dropdown">
                    <el-avatar :size="32" class="user-avatar">
                      {{ authStore.username.charAt(0).toUpperCase() }}
                    </el-avatar>
                    <span class="username">{{ authStore.username }}</span>
                    <i class="i-carbon-chevron-down dropdown-icon"></i>
                  </div>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item command="profile">个人资料</el-dropdown-item>
                      <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-header>

    <el-main class="app-main">
      <el-row justify="center">
        <el-col :xs="24" :sm="24" :md="22" :lg="20" :xl="18">
          <slot></slot>
        </el-col>
      </el-row>
    </el-main>

    <el-footer height="auto" class="app-footer">
      <el-row justify="center">
        <el-col :span="24">
          <div class="footer-content">
            <p>&copy; {{ new Date().getFullYear() }} 全栈应用 - 版本 1.0.0</p>
          </div>
        </el-col>
      </el-row>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// 计算当前激活的导航项
const activeIndex = computed(() => {
  return route.path
})

const handleCommand = (command: string) => {
  if (command === 'logout') {
    authStore.logout()
    router.push('/login')
  } else if (command === 'profile') {
    router.push('/profile')
  }
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  overflow-x: hidden; /* 防止水平滚动条 */
}

.app-header {
  background-color: var(--el-color-primary);
  color: white;
  padding: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-row {
  height: 64px;
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
  text-decoration: none;
}

.logo-icon {
  font-size: 1.75rem;
  margin-right: 0.5rem;
}

.main-menu {
  --el-menu-bg-color: transparent !important;
  --el-menu-text-color: rgba(255, 255, 255, 0.9) !important;
  --el-menu-hover-text-color: white !important;
  --el-menu-active-color: white !important;
  --el-menu-hover-bg-color: rgba(255, 255, 255, 0.1) !important;
  border-bottom: none !important;
  height: 64px;
  flex: 1;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .main-menu {
    display: none;
  }
}

.main-menu .el-menu-item {
  border-bottom-color: transparent !important;
  height: 64px;
}

.main-menu .el-menu-item.is-active {
  border-bottom: 2px solid white !important;
  font-weight: 600;
}

.nav-link {
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s;
}

.nav-link:hover {
  color: white;
  text-decoration: none;
}

.nav-link.router-link-active {
  color: white;
  font-weight: 600;
}

.user-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.login-btn {
  color: white;
}

.register-btn {
  background-color: white !important;
  color: var(--el-color-primary) !important;
  border: none;
}

.user-dropdown {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: white;
}

.user-avatar {
  background-color: white;
  color: var(--el-color-primary);
  margin-right: 0.5rem;
}

.username {
  font-weight: 500;
}

.dropdown-icon {
  margin-left: 0.25rem;
  font-size: 0.875rem;
}

.app-main {
  background-color: #f5f7fa !important;
  padding: 1.5rem;
  min-height: calc(100vh - 64px - 60px); /* 减去头部和底部高度 */
  flex: 1;
  overflow-y: auto; /* 内容溢出时滚动 */
}

@media (max-width: 768px) {
  .app-main {
    padding: 1rem 0.5rem;
  }
}

.app-footer {
  background-color: #f0f2f5 !important;
  padding: 0.75rem 0;
  height: auto !important;
  min-height: 60px;
  width: 100%;
  box-sizing: border-box;
}

.footer-content {
  text-align: center;
  color: var(--el-text-color-secondary);
  font-size: 0.875rem;
  line-height: 1.4;
}
</style>
