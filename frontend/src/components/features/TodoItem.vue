<template>
  <el-card class="todo-item" :class="{ 'is-completed': todo.completed }" shadow="hover">
    <div class="todo-content">
      <el-checkbox v-model="isCompleted" @change="toggleCompleted" />

      <div class="todo-details">
        <h3 :class="{ 'completed-title': todo.completed }">
          {{ todo.title }}
        </h3>

        <p v-if="todo.description" class="todo-description">
          {{ todo.description }}
        </p>

        <span v-if="todo.updated_at" class="todo-date">
          更新: {{ formatToLocale(todo.updated_at) }}
        </span>
        <span v-else-if="todo.created_at" class="todo-date">
          创建: {{ formatToLocale(todo.created_at) }}
        </span>
      </div>

      <div class="todo-actions">
        <el-button size="small" @click="$emit('edit', todo)">编辑</el-button>
        <el-button size="small" type="danger" @click="$emit('delete', todo.id)">删除</el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Todo } from '@/types/todo'
import { formatToLocale } from '@/utils/dateFormat'

// 组件属性
const props = defineProps<{
  todo: Todo
}>()

// 组件事件
const emit = defineEmits<{
  (e: 'completed', id: number, completed: boolean): void
  (e: 'edit', todo: Todo): void
  (e: 'delete', id: number): void
}>()

// 计算属性 - 是否完成
const isCompleted = computed({
  get: () => props.todo.completed,
  set: (value) => {
    emit('completed', props.todo.id, value)
  }
})

// 切换完成状态
const toggleCompleted = () => {
  emit('completed', props.todo.id, isCompleted.value)
}
</script>

<style scoped>
.todo-item {
  margin-bottom: 0.75rem;
  transition: all 0.2s ease;
}

.todo-item.is-completed {
  background-color: var(--el-fill-color-light);
}

.todo-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.todo-details {
  flex: 1;
}

h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.5;
}

.completed-title {
  text-decoration: line-through;
  color: var(--el-text-color-secondary);
}

.todo-description {
  font-size: 0.875rem;
  color: var(--el-text-color-secondary);
  margin: 0.375rem 0 0 0;
  line-height: 1.5;
}

.todo-date {
  display: block;
  font-size: 0.75rem;
  color: var(--el-text-color-placeholder);
  margin-top: 0.5rem;
}

.todo-actions {
  display: flex;
  gap: 0.5rem;
}

@media (max-width: 576px) {
  .todo-content {
    flex-direction: column;
  }

  .todo-actions {
    margin-top: 0.75rem;
    justify-content: flex-end;
  }
}
</style>
