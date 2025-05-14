// Example utility file: date.utils.ts

/**
 * Formats a date object or timestamp into a string.
 * @param date The date to format (Date object, timestamp number, or string)
 * @param formatStr The format string (e.g., 'YYYY-MM-DD HH:mm:ss')
 * @returns Formatted date string or original input if formatting fails
 */
export function formatDate(date: Date | number | string, formatStr = 'YYYY-MM-DD'): string {
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      // For simple cases or if an external library like date-fns or dayjs is not used
      // console.warn('Invalid date passed to formatDate:', date);
      return String(date); // Return original if invalid
    }

    // Basic formatting (consider a library for complex needs)
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');

    let formatted = formatStr;
    formatted = formatted.replace('YYYY', year.toString());
    formatted = formatted.replace('MM', month);
    formatted = formatted.replace('DD', day);
    formatted = formatted.replace('HH', hours);
    formatted = formatted.replace('mm', minutes);
    formatted = formatted.replace('ss', seconds);

    return formatted;
  } catch (error) {
    // console.error('Error formatting date:', error);
    return String(date); // Fallback to original string representation
  }
}

// Example utility: debounce function
export function debounce<F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): (...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), waitFor);
  };
} 