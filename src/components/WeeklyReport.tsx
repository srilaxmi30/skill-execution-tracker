/**
 * WeeklyReport Component
 * 
 * Displays the weekly progress report for all skills.
 * Shows Monday-Sunday week range with real calculated data.
 */

import { useMemo } from 'react';
import { generateWeeklyReport, getProgressStatus, SkillProgress } from '@/lib/reportUtils';
import { TrendingUp, Award, Calendar, Target } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  isComplete: boolean;
}

/**
 * Animated progress bar component
 */
function ProgressBar({ progress, isComplete }: ProgressBarProps) {
  return (
    <div className="h-2.5 bg-muted rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ease-out ${
          isComplete ? 'progress-complete' : 'progress-gradient'
        }`}
        style={{ 
          width: `${Math.min(progress, 100)}%`,
          // CSS variable for animation
          '--progress-width': `${Math.min(progress, 100)}%` 
        } as React.CSSProperties}
      />
    </div>
  );
}

/**
 * Single skill progress card
 */
function SkillProgressCard({ skill }: { skill: SkillProgress }) {
  const status = getProgressStatus(skill);
  
  const statusStyles = {
    'complete': 'bg-success/10 text-success border-success/20',
    'on-track': 'bg-primary/10 text-primary border-primary/20',
    'behind': 'bg-warning/10 text-warning border-warning/20',
  };

  const statusLabels = {
    'complete': 'Complete!',
    'on-track': 'On Track',
    'behind': 'Behind',
  };

  return (
    <div className="p-4 rounded-lg bg-card border border-border shadow-card animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground truncate">
            {skill.skillName}
          </h4>
          <p className="text-sm text-muted-foreground">
            {skill.completedCount} / {skill.weeklyGoal} executions
          </p>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
          {statusLabels[status]}
        </span>
      </div>

      <ProgressBar 
        progress={skill.progressPercentage} 
        isComplete={skill.isComplete} 
      />

      <div className="mt-2 text-right text-sm font-medium text-muted-foreground">
        {Math.round(skill.progressPercentage)}%
      </div>

      {/* Daily breakdown */}
      <div className="mt-4 pt-3 border-t border-border">
        <div className="grid grid-cols-7 gap-1">
          {skill.dailyBreakdown.map((day) => (
            <div key={day.date} className="text-center">
              <div className="text-xs text-muted-foreground mb-1">
                {day.dayName}
              </div>
              <div 
                className={`text-xs font-medium rounded py-1 ${
                  day.count > 0 
                    ? 'bg-primary/20 text-primary' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {day.count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function WeeklyReport() {
  // Generate report from real data
  const report = useMemo(() => generateWeeklyReport(), []);

  // Empty state
  if (report.skills.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Target className="h-16 w-16 mx-auto mb-4 opacity-30" />
        <p className="text-lg font-medium">No Skills to Report</p>
        <p className="text-sm mt-1">Add skills and log executions to see your progress</p>
      </div>
    );
  }

  const completedSkills = report.skills.filter(s => s.isComplete).length;

  return (
    <div className="space-y-6">
      {/* Header with week range */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm">
          <Calendar className="h-4 w-4" />
          <span className="font-medium">{report.weekRange}</span>
        </div>
      </div>

      {/* Overall Progress Summary */}
      <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Weekly Progress
            </h3>
          </div>
          {completedSkills > 0 && (
            <div className="flex items-center gap-1 text-success">
              <Award className="h-4 w-4" />
              <span className="text-sm font-medium">
                {completedSkills} skill{completedSkills !== 1 ? 's' : ''} complete
              </span>
            </div>
          )}
        </div>

        <div className="flex items-end gap-4">
          <div className="flex-1">
            <ProgressBar 
              progress={report.overallProgress} 
              isComplete={report.overallProgress >= 100} 
            />
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-foreground">
              {Math.round(report.overallProgress)}%
            </div>
            <div className="text-xs text-muted-foreground">
              {report.totalCompleted} / {report.totalGoal} total
            </div>
          </div>
        </div>
      </div>

      {/* Individual Skill Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground px-1">
          Skill Breakdown
        </h3>
        {report.skills.map((skill) => (
          <SkillProgressCard key={skill.skillId} skill={skill} />
        ))}
      </div>
    </div>
  );
}
