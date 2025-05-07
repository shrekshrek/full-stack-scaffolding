<template>
  <div class="profile-view">
    <el-row justify="center">
      <el-col :xs="24" :sm="24" :md="20" :lg="16" :xl="14">
        <h1 class="view-title">个人资料</h1>

        <el-card shadow="hover" class="profile-card">
          <template #header>
            <div class="card-header">
              <h2>基本信息</h2>
            </div>
          </template>

          <div class="user-info">
            <el-avatar :size="80" class="user-avatar">
              {{ authStore.username.charAt(0).toUpperCase() }}
            </el-avatar>

            <div class="user-details">
              <p class="user-name">{{ authStore.username }}</p>
              <p class="user-email">{{ authStore.user?.email }}</p>
              <p class="user-date">
                注册时间：{{
                  authStore.user?.created_at ? formatToLocale(authStore.user.created_at) : '未知'
                }}
              </p>
            </div>
          </div>
        </el-card>

        <el-card shadow="hover" class="profile-card mt-4">
          <template #header>
            <div class="card-header">
              <h2>统计信息</h2>
            </div>
          </template>

          <el-row :gutter="20">
            <el-col :span="8">
              <div class="stat-item">
                <h3>待办事项</h3>
                <p class="stat-value">{{ todosStore.todos.length }}</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-item">
                <h3>已完成</h3>
                <p class="stat-value">{{ todosStore.todos.filter((t) => t.completed).length }}</p>
              </div>
            </el-col>
            <el-col :span="8">
              <div class="stat-item">
                <h3>未完成</h3>
                <p class="stat-value">{{ todosStore.todos.filter((t) => !t.completed).length }}</p>
              </div>
            </el-col>
          </el-row>
        </el-card>

        <el-card shadow="hover" class="profile-card mt-4">
          <template #header>
            <div class="card-header">
              <h2>账户操作</h2>
            </div>
          </template>

          <div class="account-actions">
            <el-button type="danger" @click="handleLogout">退出登录</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTodosStore } from '@/stores/todos'
import { useRouter } from 'vue-router'
import { formatToLocale } from '@/utils/dateFormat'

const authStore = useAuthStore()
const todosStore = useTodosStore()
const router = useRouter()

onMounted(() => {
  todosStore.fetchTodos()
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.profile-view {
  padding: 1.5rem;
}

.view-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--el-text-color-primary);
}

.profile-card {
  margin-bottom: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--el-text-color-primary);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-avatar {
  background-color: var(--el-color-primary);
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
}

.user-details {
  flex: 1;
}

.user-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.user-email {
  font-size: 0.875rem;
  color: var(--el-text-color-secondary);
  margin: 0 0 0.5rem 0;
}

.user-date {
  font-size: 0.75rem;
  color: var(--el-text-color-placeholder);
  margin: 0;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  border-radius: 0.375rem;
  background-color: var(--el-fill-color-light);
}

.stat-item h3 {
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0 0 0.5rem 0;
  color: var(--el-text-color-secondary);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  color: var(--el-color-primary);
}

.account-actions {
  display: flex;
  gap: 1rem;
}

.mt-4 {
  margin-top: 1rem;
}

@media (max-width: 767px) {
  .profile-view {
    padding: 1rem 0.5rem;
  }

  .user-info {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .stat-item {
    margin-bottom: 1rem;
  }
}
</style>
