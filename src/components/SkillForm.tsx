/**
 * SkillForm Component
 * 
 * Handles adding and editing skills.
 * Validates input before submission.
 */

import { useState, useEffect } from 'react';
import { Skill, generateId } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface SkillFormProps {
  /** Skill to edit (null for adding new skill) */
  editingSkill: Skill | null;
  /** Called when form is submitted with new/updated skill */
  onSubmit: (skill: Skill) => void;
  /** Called when form is cancelled */
  onCancel: () => void;
}

export function SkillForm({ editingSkill, onSubmit, onCancel }: SkillFormProps) {
  // Form state
  const [name, setName] = useState('');
  const [weeklyGoal, setWeeklyGoal] = useState('');
  const [error, setError] = useState('');

  // Populate form when editing
  useEffect(() => {
    if (editingSkill) {
      setName(editingSkill.name);
      setWeeklyGoal(editingSkill.weeklyGoal.toString());
    } else {
      setName('');
      setWeeklyGoal('');
    }
    setError('');
  }, [editingSkill]);

  /**
   * Validate and submit the form
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Skill name is required');
      return;
    }
    
    const goalNumber = parseInt(weeklyGoal, 10);
    if (isNaN(goalNumber) || goalNumber < 1) {
      setError('Weekly goal must be at least 1');
      return;
    }
    
    if (goalNumber > 50) {
      setError('Weekly goal cannot exceed 50');
      return;
    }

    // Create skill object
    const skill: Skill = {
      id: editingSkill?.id || generateId(),
      name: trimmedName,
      weeklyGoal: goalNumber,
      createdAt: editingSkill?.createdAt || Date.now(),
    };

    onSubmit(skill);
    
    // Reset form if adding new
    if (!editingSkill) {
      setName('');
      setWeeklyGoal('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          {editingSkill ? 'Edit Skill' : 'Add New Skill'}
        </h3>
        {editingSkill && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {/* Skill Name Input */}
        <div className="space-y-1.5">
          <Label htmlFor="skill-name" className="text-sm font-medium">
            Skill Name
          </Label>
          <Input
            id="skill-name"
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            placeholder="e.g., Practice Guitar, Read Books"
            className="h-10"
            autoFocus
          />
        </div>

        {/* Weekly Goal Input */}
        <div className="space-y-1.5">
          <Label htmlFor="weekly-goal" className="text-sm font-medium">
            Weekly Goal (executions per week)
          </Label>
          <Input
            id="weekly-goal"
            type="number"
            min="1"
            max="50"
            value={weeklyGoal}
            onChange={(e) => {
              setWeeklyGoal(e.target.value);
              setError('');
            }}
            placeholder="e.g., 5"
            className="h-10"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-sm text-destructive animate-fade-in">
          {error}
        </p>
      )}

      {/* Submit Buttons */}
      <div className="flex gap-2 pt-1">
        <Button type="submit" className="flex-1">
          {editingSkill ? 'Update Skill' : 'Add Skill'}
        </Button>
        {editingSkill && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
