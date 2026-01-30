/**
 * useLogs Hook
 * 
 * Custom hook for managing execution logs with localStorage persistence.
 * Handles adding, updating, and removing logs.
 */

import { useState, useEffect, useCallback } from 'react';
import { Log, getLogs, saveLogs } from '@/lib/storage';

export function useLogs() {
  // Initialize state from localStorage
  const [logs, setLogs] = useState<Log[]>(() => getLogs());

  // Save to localStorage whenever logs change
  useEffect(() => {
    saveLogs(logs);
  }, [logs]);

  /**
   * Add or update a log
   * If a log with the same ID exists, it updates it
   * Otherwise, it adds a new log
   */
  const addOrUpdateLog = useCallback((log: Log) => {
    setLogs(prev => {
      const existingIndex = prev.findIndex(l => l.id === log.id);
      if (existingIndex !== -1) {
        // Update existing log
        const updated = [...prev];
        updated[existingIndex] = log;
        return updated;
      }
      // Add new log
      return [...prev, log];
    });
  }, []);

  /**
   * Delete a log by ID
   */
  const deleteLog = useCallback((logId: string) => {
    setLogs(prev => prev.filter(log => log.id !== logId));
  }, []);

  /**
   * Get logs for a specific skill
   */
  const getLogsForSkill = useCallback((skillId: string) => {
    return logs.filter(log => log.skillId === skillId);
  }, [logs]);

  /**
   * Get logs for a specific date
   */
  const getLogsForDate = useCallback((date: string) => {
    return logs.filter(log => log.date === date);
  }, [logs]);

  return {
    logs,
    addOrUpdateLog,
    deleteLog,
    getLogsForSkill,
    getLogsForDate,
  };
}
