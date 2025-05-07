/**
 * 本地存储工具函数
 */

/**
 * 保存数据到localStorage
 * @param key 键名
 * @param value 要保存的值
 */
export function setItem(key: string, value: unknown): void {
  try {
    const serializedValue = JSON.stringify(value)
    localStorage.setItem(key, serializedValue)
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

/**
 * 从localStorage获取数据
 * @param key 键名
 * @param defaultValue 默认值，当获取失败时返回
 */
export function getItem<T>(key: string, defaultValue: T | null = null): T | null {
  try {
    const serializedValue = localStorage.getItem(key)
    if (serializedValue === null) {
      return defaultValue
    }
    return JSON.parse(serializedValue) as T
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return defaultValue
  }
}

/**
 * 从localStorage删除数据
 * @param key 键名
 */
export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error('Error removing from localStorage:', error)
  }
}

/**
 * 清空localStorage
 */
export function clear(): void {
  try {
    localStorage.clear()
  } catch (error) {
    console.error('Error clearing localStorage:', error)
  }
}
