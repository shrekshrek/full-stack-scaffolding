/**
 * 待办事项完整数据结构
 */
export interface Todo {
  /** 唯一标识符 */
  id: number
  /** 标题 */
  title: string
  /** 描述信息 */
  description: string | null
  /** 是否已完成 */
  completed: boolean
  /** 所有者ID */
  owner_id: number
  /** 创建时间 */
  created_at?: string
  /** 更新时间 */
  updated_at?: string
}

/**
 * 创建待办事项所需数据
 */
export interface TodoCreateData {
  /** 标题 */
  title: string
  /** 描述信息 */
  description?: string
  /** 是否已完成 */
  completed?: boolean
}

/**
 * 更新待办事项所需数据
 */
export interface TodoUpdateData {
  /** 标题 */
  title?: string
  /** 描述信息 */
  description?: string
  /** 是否已完成 */
  completed?: boolean
}
