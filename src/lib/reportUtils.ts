/**
 * Weekly Report Calculation Utilities
 * 
 * Calculates progress data for the weekly report feature.
 * All calculations are based on real log data, not mocks.
 */

import { Skill, Log, getLogsInDateRange, getSkills, getLogs } from './storage';
import { 
  getCurrentWeekRange, 
  formatDateToString, 
  formatWeekRange,
  getWeekDates,
  parseDate
} from './dateUtils';

/**
 * Progress data for a single skill
 */
export interface SkillProgress {
  skillId: string;
  skillName: string;
  weeklyGoal: number;
  completedCount: number;
  progressPercentage: number;
  isComplete: boolean;
  dailyBreakdown: DailyExecution[];
}

/**
 * Execution data for a single day
 */
export interface DailyExecution {
  date: string;
  dayName: string;
  count: number;
}

/**
 * Complete weekly report data
 */
export interface WeeklyReport {
  weekRange: string;
  startDate: string;
  endDate: string;
  skills: SkillProgress[];
  overallProgress: number;
  totalGoal: number;
  totalCompleted: number;
}

/**
 * Calculate progress for a single skill in the current week
 * 
 * Logic explanation:
 * 1. Get all logs for this skill in the current week
 * 2. Sum up the execution counts
 * 3. Calculate percentage (capped at 100%)
 */
export function calculateSkillProgress(
  skill: Skill,
  weekLogs: Log[],
  weekDates: string[]
): SkillProgress {
  // Filter logs for this specific skill
  const skillLogs = weekLogs.filter(log => log.skillId === skill.id);
  
  // Sum up all execution counts for this skill
  const completedCount = skillLogs.reduce((sum, log) => sum + log.count, 0);
  
  // Calculate percentage (cap at 100 for display purposes)
  const rawPercentage = skill.weeklyGoal > 0 
    ? (completedCount / skill.weeklyGoal) * 100 
    : 0;
  const progressPercentage = Math.min(rawPercentage, 100);
  
  // Create daily breakdown for detailed view
  const dailyBreakdown: DailyExecution[] = weekDates.map(date => {
    const dayLog = skillLogs.find(log => log.date === date);
    const dateObj = parseDate(date);
    return {
      date,
      dayName: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
      count: dayLog?.count || 0,
    };
  });
  
  return {
    skillId: skill.id,
    skillName: skill.name,
    weeklyGoal: skill.weeklyGoal,
    completedCount,
    progressPercentage,
    isComplete: completedCount >= skill.weeklyGoal,
    dailyBreakdown,
  };
}

/**
 * Generate the complete weekly report
 * This is the main function called by the WeeklyReport component
 */
export function generateWeeklyReport(): WeeklyReport {
  // Get current week boundaries (Monday to Sunday)
  const { start, end } = getCurrentWeekRange();
  const startStr = formatDateToString(start);
  const endStr = formatDateToString(end);
  
  // Get all skills and logs for this week
  const skills = getSkills();
  const weekLogs = getLogsInDateRange(startStr, endStr);
  const weekDates = getWeekDates(start);
  
  // Calculate progress for each skill
  const skillsProgress = skills.map(skill => 
    calculateSkillProgress(skill, weekLogs, weekDates)
  );
  
  // Calculate overall statistics
  const totalGoal = skills.reduce((sum, skill) => sum + skill.weeklyGoal, 0);
  const totalCompleted = skillsProgress.reduce((sum, sp) => sum + sp.completedCount, 0);
  const overallProgress = totalGoal > 0 
    ? Math.min((totalCompleted / totalGoal) * 100, 100) 
    : 0;
  
  return {
    weekRange: formatWeekRange(start, end),
    startDate: startStr,
    endDate: endStr,
    skills: skillsProgress,
    overallProgress,
    totalGoal,
    totalCompleted,
  };
}

/**
 * Get a summary string for a skill's progress
 * Useful for quick display
 */
export function getProgressSummary(progress: SkillProgress): string {
  return `${progress.completedCount}/${progress.weeklyGoal} (${Math.round(progress.progressPercentage)}%)`;
}

/**
 * Get the status label for a skill's progress
 */
export function getProgressStatus(progress: SkillProgress): 'complete' | 'on-track' | 'behind' {
  if (progress.isComplete) {
    return 'complete';
  }
  
  // Calculate expected progress based on day of week
  const today = new Date();
  const dayOfWeek = today.getDay();
  // Convert to Monday=1 based (Mon=1, Tue=2, ... Sun=7)
  const daysElapsed = dayOfWeek === 0 ? 7 : dayOfWeek;
  const expectedProgress = (daysElapsed / 7) * progress.weeklyGoal;
  
  return progress.completedCount >= expectedProgress ? 'on-track' : 'behind';
}
