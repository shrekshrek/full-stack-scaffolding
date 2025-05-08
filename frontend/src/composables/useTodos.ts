import { useTodosStore } from '@/stores/todos'
import { ElNotification } from 'element-plus'
import type { Todo, TodoCreateData, TodoUpdateData } from '@/types/todo'
import { ref, computed } from 'vue'

/**
 * 待办事项相关的组合式函数
 * 提供获取、创建、更新和删除待办事项的功能
 */
export function useTodos() {
  const todosStore = useTodosStore()
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 所有待办事项，使用计算属性确保响应性
  const todos = computed(() => todosStore.todos)

  // 计算属性：已完成的待办事项
  const completedTodos = computed(() => todosStore.todos.filter((todo) => todo.completed))

  // 计算属性：未完成的待办事项
  const activeTodos = computed(() => todosStore.todos.filter((todo) => !todo.completed))

  /**
   * 获取所有待办事项
   */
  const fetchTodos = async () => {
    try {
      loading.value = true
      error.value = null
      await todosStore.fetchTodos()
    } catch (err: any) {
      const errorMessage = err.message || '无法加载待办事项'
      error.value = errorMessage
      ElNotification({
        title: '加载失败',
        message: errorMessage,
        type: 'error'
      })
    } finally {
      loading.value = false
    }
  }

  /**
   * 创建新的待办事项
   * @param title 待办事项标题
   * @param description 待办事项描述
   */
  const createTodo = async (title: string, description: string = '') => {
    try {
      loading.value = true
      error.value = null
      const data: TodoCreateData = { title, description }
      await todosStore.createTodo(data)

      ElNotification({
        title: '创建成功',
        message: '待办事项已添加',
        type: 'success'
      })

      // 创建成功后重新获取列表
      await fetchTodos()
    } catch (err: any) {
      const errorMessage = err.message || '无法创建待办事项'
      error.value = errorMessage
      ElNotification({
        title: '创建失败',
        message: errorMessage,
        type: 'error'
      })
    } finally {
      loading.value = false
    }
  }

  /**
   * 更新待办事项
   * @param todo 要更新的待办事项对象
   */
  const updateTodo = async (todo: Todo) => {
    try {
      loading.value = true
      error.value = null
      const data: TodoUpdateData = {
        title: todo.title,
        description: todo.description || '', // 将null值转换为空字符串
        completed: todo.completed
      }
      await todosStore.updateTodo(todo.id, data)

      ElNotification({
        title: '更新成功',
        message: '待办事项已更新',
        type: 'success'
      })

      // 更新成功后重新获取列表
      await fetchTodos()
    } catch (err: any) {
      const errorMessage = err.message || '无法更新待办事项'
      error.value = errorMessage
      ElNotification({
        title: '更新失败',
        message: errorMessage,
        type: 'error'
      })
    } finally {
      loading.value = false
    }
  }

  /**
   * 删除待办事项
   * @param id 待办事项ID
   */
  const deleteTodo = async (id: number) => {
    try {
      loading.value = true
      error.value = null
      await todosStore.deleteTodo(id)

      ElNotification({
        title: '删除成功',
        message: '待办事项已删除',
        type: 'success'
      })

      // 删除成功后重新获取列表
      await fetchTodos()
    } catch (err: any) {
      const errorMessage = err.message || '无法删除待办事项'
      error.value = errorMessage
      ElNotification({
        title: '删除失败',
        message: errorMessage,
        type: 'error'
      })
    } finally {
      loading.value = false
    }
  }

  /**
   * 切换待办事项的完成状态
   * @param todo 待办事项对象
   */
  const toggleTodoCompleted = async (todo: Todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed }
    await updateTodo(updatedTodo)
  }

  return {
    todos,
    completedTodos,
    activeTodos,
    loading,
    error,
    fetchTodos,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodoCompleted
  }
}
