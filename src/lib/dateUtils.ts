/**
 * Date Utility Functions
 * 
 * Handles all date-related operations for the Skill Tracker.
 * Week calculation follows Monday-Sunday convention.
 */

/**
 * Format a Date object to YYYY-MM-DD string
 * This is the standard format used throughout the app
 */
export function formatDateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayString(): string {
  return formatDateToString(new Date());
}

/**
 * Parse a YYYY-MM-DD string to a Date object
 * Sets time to midnight to avoid timezone issues
 */
export function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Get the Monday of the week containing the given date
 * 
 * Logic explanation for freshers:
 * - JavaScript's getDay() returns 0 for Sunday, 1 for Monday, etc.
 * - We want Monday as the start of the week
 * - If it's Sunday (0), we need to go back 6 days
 * - For any other day, we go back (dayOfWeek - 1) days
 */
export function getWeekStart(date: Date): Date {
  const result = new Date(date);
  const dayOfWeek = result.getDay();
  
  // Calculate days to subtract to get to Monday
  // If Sunday (0), go back 6 days; otherwise go back (day - 1) days
  const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  result.setDate(result.getDate() - daysToSubtract);
  result.setHours(0, 0, 0, 0); // Reset time to midnight
  
  return result;
}

/**
 * Get the Sunday of the week containing the given date
 */
export function getWeekEnd(date: Date): Date {
  const weekStart = getWeekStart(date);
  const result = new Date(weekStart);
  result.setDate(result.getDate() + 6); // Monday + 6 = Sunday
  result.setHours(23, 59, 59, 999); // End of day
  
  return result;
}

/**
 * Get the current week's start (Monday) and end (Sunday) dates
 */
export function getCurrentWeekRange(): { start: Date; end: Date } {
  const today = new Date();
  return {
    start: getWeekStart(today),
    end: getWeekEnd(today),
  };
}

/**
 * Format a date for display (e.g., "Jan 29")
 */
export function formatDateForDisplay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a week range for display (e.g., "Jan 29 – Feb 4")
 */
export function formatWeekRange(start: Date, end: Date): string {
  const startStr = formatDateForDisplay(start);
  const endStr = formatDateForDisplay(end);
  return `${startStr} – ${endStr}`;
}

/**
 * Get all dates in a week as YYYY-MM-DD strings
 * Useful for iterating through the week
 */
export function getWeekDates(weekStart: Date): string[] {
  const dates: string[] = [];
  const current = new Date(weekStart);
  
  for (let i = 0; i < 7; i++) {
    dates.push(formatDateToString(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

/**
 * Check if a date string is today
 */
export function isToday(dateString: string): boolean {
  return dateString === getTodayString();
}

/**
 * Get the day name from a date (e.g., "Monday")
 */
export function getDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'long' });
}

/**
 * Get short day name from a date (e.g., "Mon")
 */
export function getShortDayName(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}
