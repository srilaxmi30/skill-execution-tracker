/**
 * useSkills Hook
 * 
 * Custom hook for managing skills state with localStorage persistence.
 * Handles all CRUD operations for skills.
 */

import { useState, useEffect, useCallback } from 'react';
import { Skill, getSkills, saveSkills, getLogs, saveLogs } from '@/lib/storage';

export function useSkills() {
  // Initialize state from localStorage
  const [skills, setSkills] = useState<Skill[]>(() => getSkills());

  // Save to localStorage whenever skills change
  useEffect(() => {
    saveSkills(skills);
  }, [skills]);

  /**
   * Add a new skill
   */
  const addSkill = useCallback((skill: Skill) => {
    setSkills(prev => [...prev, skill]);
  }, []);

  /**
   * Update an existing skill
   */
  const updateSkill = useCallback((updatedSkill: Skill) => {
    setSkills(prev => 
      prev.map(skill => 
        skill.id === updatedSkill.id ? updatedSkill : skill
      )
    );
  }, []);

  /**
   * Delete a skill and its associated logs
   */
  const deleteSkill = useCallback((skillId: string) => {
    // Remove skill
    setSkills(prev => prev.filter(skill => skill.id !== skillId));
    
    // Also remove associated logs
    const logs = getLogs();
    const filteredLogs = logs.filter(log => log.skillId !== skillId);
    saveLogs(filteredLogs);
  }, []);

  /**
   * Add or update a skill (for form handling)
   */
  const saveSkill = useCallback((skill: Skill) => {
    const existingSkill = skills.find(s => s.id === skill.id);
    if (existingSkill) {
      updateSkill(skill);
    } else {
      addSkill(skill);
    }
  }, [skills, addSkill, updateSkill]);

  return {
    skills,
    addSkill,
    updateSkill,
    deleteSkill,
    saveSkill,
  };
}
