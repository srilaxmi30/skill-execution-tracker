/**
 * ExecutionLogger Component
 * 
 * Allows users to log skill executions for a specific date.
 * Prevents duplicate logs for the same skill on the same date.
 */

import { useState } from 'react';
import { Skill, Log, logExistsForDate, generateId, getLogs } from '@/lib/storage';
import { getTodayString, parseDate, formatDateForDisplay } from '@/lib/dateUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Calendar, Plus } from 'lucide-react';

interface ExecutionLoggerProps {
  skills: Skill[];
  onLogExecution: (log: Log) => void;
}

export function ExecutionLogger({ skills, onLogExecution }: ExecutionLoggerProps) {
  // Default date is today
  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [selectedSkillId, setSelectedSkillId] = useState('');
  const [executionCount, setExecutionCount] = useState('1');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  /**
   * Handle logging an execution
   */
  const handleLogExecution = () => {
    // Validation
    if (!selectedSkillId) {
      setFeedback({ type: 'error', message: 'Please select a skill' });
      return;
    }

    const count = parseInt(executionCount, 10);
    if (isNaN(count) || count < 1) {
      setFeedback({ type: 'error', message: 'Count must be at least 1' });
      return;
    }

    // Check for duplicate
    if (logExistsForDate(selectedSkillId, selectedDate)) {
      setFeedback({ 
        type: 'error', 
        message: 'Already logged this skill for this date. Edit or delete the existing log first.' 
      });
      return;
    }

    // Create and submit log
    const newLog: Log = {
      id: generateId(),
      skillId: selectedSkillId,
      date: selectedDate,
      count: count,
    };

    onLogExecution(newLog);

    // Get skill name for feedback
    const skill = skills.find(s => s.id === selectedSkillId);
    const dateDisplay = formatDateForDisplay(parseDate(selectedDate));

    setFeedback({ 
      type: 'success', 
      message: `Logged ${count}× ${skill?.name || 'skill'} for ${dateDisplay}` 
    });

    // Reset count to 1 for next entry
    setExecutionCount('1');

    // Clear feedback after delay
    setTimeout(() => setFeedback(null), 3000);
  };

  /**
   * Quick log button for each skill - logs 1 execution for today
   */
  const handleQuickLog = (skill: Skill) => {
    const today = getTodayString();
    
    // Check for duplicate
    if (logExistsForDate(skill.id, today)) {
      // If already logged today, increment the count instead
      const logs = getLogs();
      const existingLog = logs.find(l => l.skillId === skill.id && l.date === today);
      if (existingLog) {
        const updatedLog: Log = {
          ...existingLog,
          count: existingLog.count + 1,
        };
        onLogExecution(updatedLog);
        setFeedback({ 
          type: 'success', 
          message: `Updated ${skill.name} to ${updatedLog.count}× today` 
        });
      }
    } else {
      // Create new log
      const newLog: Log = {
        id: generateId(),
        skillId: skill.id,
        date: today,
        count: 1,
      };
      onLogExecution(newLog);
      setFeedback({ 
        type: 'success', 
        message: `Logged 1× ${skill.name} for today` 
      });
    }

    setTimeout(() => setFeedback(null), 3000);
  };

  if (skills.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Calendar className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">Add skills first to start logging</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quick Log Section */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">
          Quick Log (Today)
        </h4>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Button
              key={skill.id}
              variant="outline"
              size="sm"
              onClick={() => handleQuickLog(skill)}
              className="gap-1.5 hover:bg-primary hover:text-primary-foreground transition-smooth"
            >
              <Plus className="h-3.5 w-3.5" />
              {skill.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Detailed Log Form */}
      <div className="border-t border-border pt-4">
        <h4 className="text-sm font-medium text-muted-foreground mb-3">
          Log for Specific Date
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Date Picker */}
          <div className="space-y-1.5">
            <Label htmlFor="log-date" className="text-xs">Date</Label>
            <Input
              id="log-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="h-9"
            />
          </div>

          {/* Skill Selector */}
          <div className="space-y-1.5">
            <Label htmlFor="log-skill" className="text-xs">Skill</Label>
            <select
              id="log-skill"
              value={selectedSkillId}
              onChange={(e) => setSelectedSkillId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Select skill...</option>
              {skills.map((skill) => (
                <option key={skill.id} value={skill.id}>
                  {skill.name}
                </option>
              ))}
            </select>
          </div>

          {/* Count Input */}
          <div className="space-y-1.5">
            <Label htmlFor="log-count" className="text-xs">Count</Label>
            <div className="flex gap-2">
              <Input
                id="log-count"
                type="number"
                min="1"
                max="20"
                value={executionCount}
                onChange={(e) => setExecutionCount(e.target.value)}
                className="h-9 flex-1"
              />
              <Button 
                onClick={handleLogExecution}
                className="h-9 px-4"
              >
                Log
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div 
          className={`flex items-center gap-2 p-3 rounded-lg text-sm animate-fade-in ${
            feedback.type === 'success' 
              ? 'bg-success/10 text-success' 
              : 'bg-destructive/10 text-destructive'
          }`}
        >
          {feedback.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
          {feedback.message}
        </div>
      )}
    </div>
  );
}
