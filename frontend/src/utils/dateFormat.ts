/**
 * 日期格式化工具函数
 */

/**
 * 将日期格式化为指定格式的字符串
 * @param date 要格式化的日期
 * @param format 格式字符串，如 'YYYY-MM-DD HH:mm:ss'
 * @returns 格式化后的日期字符串
 */
export function formatDate(date: Date | string | number, format = 'YYYY-MM-DD'): string {
  const d = date instanceof Date ? date : new Date(date)

  if (isNaN(d.getTime())) {
    return 'Invalid Date'
  }

  const replacers: Record<string, () => string> = {
    YYYY: () => String(d.getFullYear()),
    MM: () => String(d.getMonth() + 1).padStart(2, '0'),
    DD: () => String(d.getDate()).padStart(2, '0'),
    HH: () => String(d.getHours()).padStart(2, '0'),
    mm: () => String(d.getMinutes()).padStart(2, '0'),
    ss: () => String(d.getSeconds()).padStart(2, '0')
  }

  let result = format
  Object.entries(replacers).forEach(([pattern, replacer]) => {
    result = result.replace(pattern, replacer())
  })

  return result
}

/**
 * 格式化日期为本地化字符串
 * @param dateString ISO日期字符串
 * @param options 格式化选项
 * @returns 格式化后的日期字符串
 */
export function formatToLocale(
  dateString?: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }
): string {
  if (!dateString) return ''

  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', options)
}
