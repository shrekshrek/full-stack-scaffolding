import { defineStore } from 'pinia'
import { ref } from 'vue'
import { todoService } from '@/services/todo'
import type { Todo, TodoCreateData, TodoUpdateData } from '@/types/todo'

export const useTodosStore = defineStore('todos', () => {
  const todos = ref<Todo[]>([])
  const loading = ref(false)
  const error = ref('')

  // 获取待办事项列表
  async function fetchTodos() {
    loading.value = true
    error.value = ''
    try {
      todos.value = await todoService.getTodos()
    } catch (err: any) {
      error.value = err.message || '获取待办事项失败'
    } finally {
      loading.value = false
    }
  }

  // 创建待办事项
  async function createTodo(data: TodoCreateData) {
    try {
      const newTodo = await todoService.createTodo(data)
      todos.value.push(newTodo)
      return newTodo
    } catch (err: any) {
      error.value = err.message || '创建待办事项失败'
      throw err
    }
  }

  // 更新待办事项
  async function updateTodo(id: number, data: TodoUpdateData) {
    try {
      const updatedTodo = await todoService.updateTodo(id, data)
      const index = todos.value.findIndex((todo) => todo.id === id)
      if (index !== -1) {
        todos.value[index] = updatedTodo
      }
      return updatedTodo
    } catch (err: any) {
      error.value = err.message || '更新待办事项失败'
      throw err
    }
  }

  // 删除待办事项
  async function deleteTodo(id: number) {
    try {
      await todoService.deleteTodo(id)
      todos.value = todos.value.filter((todo) => todo.id !== id)
    } catch (err: any) {
      error.value = err.message || '删除待办事项失败'
      throw err
    }
  }

  // 切换待办事项完成状态
  async function toggleCompleted(id: number) {
    const todo = todos.value.find((t) => t.id === id)
    if (todo) {
      return updateTodo(id, { completed: !todo.completed })
    }
  }

  return {
    todos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleCompleted
  }
})
