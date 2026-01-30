/**
 * Skill Execution Tracker - Main Page
 * 
 * A productivity app for tracking skill-building consistency.
 * Features: Skill CRUD, Daily Logging, Weekly Reports
 * 
 * Data is persisted in localStorage and survives page refresh.
 */

import { useState, useCallback } from 'react';
import { useSkills } from '@/hooks/useSkills';
import { useLogs } from '@/hooks/useLogs';
import { Skill } from '@/lib/storage';
import { SkillForm } from '@/components/SkillForm';
import { SkillList } from '@/components/SkillList';
import { ExecutionLogger } from '@/components/ExecutionLogger';
import { WeeklyReport } from '@/components/WeeklyReport';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Calendar, 
  BarChart3, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Index = () => {
  // State management via custom hooks
  const { skills, saveSkill, deleteSkill } = useSkills();
  const { addOrUpdateLog } = useLogs();

  // UI State
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('report');

  /**
   * Handle skill form submission (add or update)
   */
  const handleSkillSubmit = useCallback((skill: Skill) => {
    saveSkill(skill);
    setEditingSkill(null);
  }, [saveSkill]);

  /**
   * Handle skill deletion with confirmation
   */
  const handleDeleteConfirm = useCallback(() => {
    if (deleteConfirm) {
      deleteSkill(deleteConfirm);
      setDeleteConfirm(null);
    }
  }, [deleteConfirm, deleteSkill]);

  /**
   * Cancel editing
   */
  const handleCancelEdit = useCallback(() => {
    setEditingSkill(null);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Skill Execution Tracker
              </h1>
              <p className="text-sm text-muted-foreground">
                Build consistency, track progress
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Panel - Skills Management */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Add/Edit Skill Form */}
            <section className="p-5 rounded-xl bg-card border border-border shadow-card">
              <SkillForm
                editingSkill={editingSkill}
                onSubmit={handleSkillSubmit}
                onCancel={handleCancelEdit}
              />
            </section>

            {/* Skills List */}
            <section className="p-5 rounded-xl bg-card border border-border shadow-card">
              <div className="flex items-center gap-2 mb-4">
                <Target className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">
                  Your Skills
                </h2>
                <span className="ml-auto text-sm text-muted-foreground">
                  {skills.length} skill{skills.length !== 1 ? 's' : ''}
                </span>
              </div>
              <SkillList
                skills={skills}
                onEdit={setEditingSkill}
                onDelete={setDeleteConfirm}
              />
            </section>
          </aside>

          {/* Right Panel - Logging & Reports */}
          <div className="lg:col-span-8">
            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger 
                  value="report" 
                  className="gap-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <BarChart3 className="h-4 w-4" />
                  Weekly Report
                </TabsTrigger>
                <TabsTrigger 
                  value="log" 
                  className="gap-2 text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <Calendar className="h-4 w-4" />
                  Log Execution
                </TabsTrigger>
              </TabsList>

              {/* Weekly Report Tab */}
              <TabsContent value="report" className="mt-4">
                <section className="p-5 rounded-xl bg-card border border-border shadow-card">
                  <WeeklyReport />
                </section>
              </TabsContent>

              {/* Log Execution Tab */}
              <TabsContent value="log" className="mt-4">
                <section className="p-5 rounded-xl bg-card border border-border shadow-card">
                  <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">
                      Log Your Progress
                    </h2>
                  </div>
                  <ExecutionLogger
                    skills={skills}
                    onLogExecution={addOrUpdateLog}
                  />
                </section>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={deleteConfirm !== null} 
        onOpenChange={(open) => !open && setDeleteConfirm(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Delete Skill?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this skill and all its execution logs.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Footer */}
      <footer className="border-t border-border mt-auto py-4">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground">
            Track your skills consistently. Build habits that last.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
