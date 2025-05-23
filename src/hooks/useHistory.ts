// src/hooks/useHistory.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { HistoryEntry } from '@/lib/types';

const HISTORY_STORAGE_KEY = 'calorieCamHistory';

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
      // Optionally clear corrupted storage
      // localStorage.removeItem(HISTORY_STORAGE_KEY);
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  const addHistoryEntry = useCallback((newEntry: Omit<HistoryEntry, 'id' | 'date'>) => {
    setHistory(prevHistory => {
      const entryWithDetails: HistoryEntry = {
        ...newEntry,
        id: new Date().toISOString() + Math.random().toString(36).substring(2,9), // Simple unique ID
        date: new Date().toISOString(),
      };
      const updatedHistory = [entryWithDetails, ...prevHistory].slice(0, 50); // Keep last 50 entries
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
      } catch (error) {
        console.error("Failed to save history to localStorage:", error);
      }
      return updatedHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear history from localStorage:", error);
    }
  }, []);

  return { history, addHistoryEntry, clearHistory, isHistoryLoading };
}
