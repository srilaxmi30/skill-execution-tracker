/**
 * localStorage Utility Functions
 * 
 * Handles persistent storage for skills and execution logs.
 * All data survives page refresh.
 */

// Storage keys - centralized to avoid typos
const STORAGE_KEYS = {
  SKILLS: 'skill-tracker-skills',
  LOGS: 'skill-tracker-logs',
} as const;

/**
 * Generic function to get data from localStorage
 * Returns default value if key doesn't exist or parsing fails
 */
export function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored === null) {
      return defaultValue;
    }
    return JSON.parse(stored) as T;
  } catch (error) {
    // If parsing fails, return default value
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Generic function to save data to localStorage
 */
export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
}

// ============================================
// SKILL-SPECIFIC STORAGE FUNCTIONS
// ============================================

export interface Skill {
  id: string;
  name: string;
  weeklyGoal: number;
  createdAt: number;
}

/**
 * Get all skills from localStorage
 */
export function getSkills(): Skill[] {
  return getFromStorage<Skill[]>(STORAGE_KEYS.SKILLS, []);
}

/**
 * Save skills array to localStorage
 */
export function saveSkills(skills: Skill[]): void {
  saveToStorage(STORAGE_KEYS.SKILLS, skills);
}

/**
 * Generate a unique ID for new skills
 * Using timestamp + random string for uniqueness
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// ============================================
// LOG-SPECIFIC STORAGE FUNCTIONS
// ============================================

export interface Log {
  id: string;
  skillId: string;
  date: string; // Format: YYYY-MM-DD
  count: number;
}

/**
 * Get all logs from localStorage
 */
export function getLogs(): Log[] {
  return getFromStorage<Log[]>(STORAGE_KEYS.LOGS, []);
}

/**
 * Save logs array to localStorage
 */
export function saveLogs(logs: Log[]): void {
  saveToStorage(STORAGE_KEYS.LOGS, logs);
}

/**
 * Check if a log already exists for a skill on a specific date
 * This prevents duplicate logging
 */
export function logExistsForDate(skillId: string, date: string): boolean {
  const logs = getLogs();
  return logs.some(log => log.skillId === skillId && log.date === date);
}

/**
 * Get logs for a specific skill
 */
export function getLogsForSkill(skillId: string): Log[] {
  const logs = getLogs();
  return logs.filter(log => log.skillId === skillId);
}

/**
 * Get logs for a date range (inclusive)
 * Useful for weekly reports
 */
export function getLogsInDateRange(startDate: string, endDate: string): Log[] {
  const logs = getLogs();
  return logs.filter(log => log.date >= startDate && log.date <= endDate);
}
