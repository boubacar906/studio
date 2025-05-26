// src/hooks/useHistory.ts
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { HistoryEntry } from '@/lib/types';

const HISTORY_STORAGE_KEY = 'calorieCamHistory';
const MAX_HISTORY_ENTRIES = 20; // Reduced max entries to further help with potential size if small placeholders are used.

export function useHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (storedHistory) {
        // Ensure that entries from localStorage are properly formed HistoryEntry objects
        const parsedHistory: HistoryEntry[] = JSON.parse(storedHistory);
        setHistory(parsedHistory.map(entry => ({
          ...entry,
          // Ensure uploadedImage is a string, even if it was null/undefined in storage.
          // Or provide a default placeholder if it's truly missing.
          uploadedImage: entry.uploadedImage || "placeholder", // "placeholder" signifies it was not stored
        })));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage:", error);
      // localStorage.removeItem(HISTORY_STORAGE_KEY);
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  const addHistoryEntry = useCallback((newEntryData: Omit<HistoryEntry, 'id' | 'date'>) => {
    setHistory(prevHistory => {
      const entryWithDetails: HistoryEntry = {
        ...newEntryData,
        id: new Date().toISOString() + Math.random().toString(36).substring(2,9),
        date: new Date().toISOString(),
      };

      // Create a version of the entry for localStorage without the large image data URI
      // We store the original newEntryData.uploadedImage (which is the current one from estimator) in the live state
      // but store a placeholder for localStorage.
      const entryForStorage: HistoryEntry = {
        ...entryWithDetails,
        uploadedImage: "placeholder", // Indicate it's a placeholder, not the full Data URI for storage
      };
      
      // Update live history state with the full image for immediate display
      const liveUpdatedHistory = [entryWithDetails, ...prevHistory.map(h => ({...h, uploadedImage: h.uploadedImage || "placeholder"}))].slice(0, MAX_HISTORY_ENTRIES);

      // Update localStorage with entries that have placeholders for images
      const storageUpdatedHistory = liveUpdatedHistory.map(h => ({...h, uploadedImage: "placeholder"}));


      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(storageUpdatedHistory));
      } catch (error) {
        console.error("Failed to save history to localStorage:", error);
        // Potentially alert the user that history saving failed due to quota
        alert("Could not save to history: Local storage quota exceeded. Older entries might not be saved.");
      }
      return liveUpdatedHistory;
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
