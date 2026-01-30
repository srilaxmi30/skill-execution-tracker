/**
 * SkillList Component
 * 
 * Displays all skills with edit and delete actions.
 * Shows skill name and weekly goal.
 */

import { Skill } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Target } from 'lucide-react';

interface SkillListProps {
  skills: Skill[];
  onEdit: (skill: Skill) => void;
  onDelete: (skillId: string) => void;
}

export function SkillList({ skills, onEdit, onDelete }: SkillListProps) {
  if (skills.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Target className="h-12 w-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No skills added yet</p>
        <p className="text-xs mt-1">Add your first skill to start tracking!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {skills.map((skill) => (
        <div
          key={skill.id}
          className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-smooth group animate-fade-in"
        >
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-foreground truncate">
              {skill.name}
            </h4>
            <p className="text-sm text-muted-foreground">
              Goal: {skill.weeklyGoal}× per week
            </p>
          </div>

          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-smooth">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(skill)}
              className="h-8 w-8 p-0 hover:bg-secondary"
              aria-label={`Edit ${skill.name}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(skill.id)}
              className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              aria-label={`Delete ${skill.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
