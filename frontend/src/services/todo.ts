import { get, post, put, del } from './api'
import type { Todo, TodoCreateData, TodoUpdateData } from '@/types/todo'

export const todoService = {
  /**
   * 获取所有待办事项
   */
  async getTodos(): Promise<Todo[]> {
    return get<Todo[]>('/todos/')
  },

  /**
   * 获取单个待办事项
   * @param id 待办事项ID
   */
  async getTodo(id: number): Promise<Todo> {
    return get<Todo>(`/todos/${id}`)
  },

  /**
   * 创建新的待办事项
   * @param data 待办事项数据
   */
  async createTodo(data: TodoCreateData): Promise<Todo> {
    return post<Todo>('/todos/', data)
  },

  /**
   * 更新待办事项
   * @param id 待办事项ID
   * @param data 待办事项更新数据
   */
  async updateTodo(id: number, data: TodoUpdateData): Promise<Todo> {
    return put<Todo>(`/todos/${id}`, data)
  },

  /**
   * 删除待办事项
   * @param id 待办事项ID
   */
  async deleteTodo(id: number): Promise<void> {
    return del<void>(`/todos/${id}`)
  }
}
