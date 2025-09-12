import { useState, useEffect, useCallback } from "react";
import { Note } from "@shared/schema";
import { storage } from "@/lib/storage";
import { parseMarkdownToNotes, mergeNotesWithExisting } from "@/lib/markdown-parser";
import { updateNotesAfterVote } from "@/lib/elo-algorithm";
import { selectNotePair } from "@/lib/pair-selection";

export function useNotes() {
  const [data, setData] = useState(() => storage.getData());
  const [currentPair, setCurrentPair] = useState<{ noteA: Note; noteB: Note } | null>(null);
  const [lastPair, setLastPair] = useState<{ noteAId: string; noteBId: string } | null>(null);

  const refreshData = useCallback(() => {
    setData(storage.getData());
  }, []);

  const updateMarkdown = useCallback((content: string) => {
    const prevContent = storage.getData().markdownContent;
    storage.updateMarkdownContent(content);
    
    // Check if new paragraphs were added (simple heuristic)
    const prevParagraphs = prevContent.split(/\n\s*\n/).filter(p => p.trim()).length;
    const newParagraphs = content.split(/\n\s*\n/).filter(p => p.trim()).length;
    
    // If the user added new paragraphs, auto-parse after a delay
    if (newParagraphs > prevParagraphs) {
      setTimeout(() => {
        // Parse and apply notes inline to avoid circular dependency
        const currentData = storage.getData();
        const parsedNotes = parseMarkdownToNotes(currentData.markdownContent);
        
        // Only merge with active notes (not archived ones)
        const activeNotes = currentData.notes.filter(note => !note.archivedAt);
        const mergedNotes = mergeNotesWithExisting(
          parsedNotes,
          activeNotes,
          currentData.settings.initialRating
        );
        
        storage.setNotes(mergedNotes);
        
        // Force immediate refresh of the UI
        setData(storage.getData());
      }, 1000); // Give user time to finish typing
    }
    
    refreshData();
  }, [refreshData]);

  const generateNewPair = useCallback(() => {
    const currentData = storage.getData();
    // Filter out archived notes for pairing
    const activeNotes = currentData.notes.filter(note => !note.archivedAt);
    const pair = selectNotePair(activeNotes, currentData.settings, lastPair || undefined);
    setCurrentPair(pair);
    return pair;
  }, [lastPair]);


  const parseAndApplyNotes = useCallback(() => {
    const currentData = storage.getData();
    const parsedNotes = parseMarkdownToNotes(currentData.markdownContent);
    
    // Only merge with active notes (not archived ones)
    const activeNotes = currentData.notes.filter(note => !note.archivedAt);
    const mergedNotes = mergeNotesWithExisting(
      parsedNotes,
      activeNotes,
      currentData.settings.initialRating
    );
    
    storage.setNotes(mergedNotes);
    
    // Force immediate refresh of the UI
    setData(storage.getData());
    
    // Generate new pair if needed
    setTimeout(() => {
      const newData = storage.getData();
      const newActiveNotes = newData.notes.filter(note => !note.archivedAt);
      if (newActiveNotes.length >= 2 && !currentPair) {
        generateNewPair();
      }
    }, 100);
  }, [currentPair, generateNewPair]);

  const submitVote = useCallback((winner: "A" | "B" | "skip") => {
    if (!currentPair) return;

    // Track this pair as the last pair to avoid immediate repeats
    setLastPair({
      noteAId: currentPair.noteA.id,
      noteBId: currentPair.noteB.id
    });

    const currentData = storage.getData();
    const { noteA: updatedA, noteB: updatedB } = updateNotesAfterVote(
      currentPair.noteA,
      currentPair.noteB,
      winner,
      currentData.settings.kFactor
    );

    // Update notes in storage
    storage.updateNote(updatedA.id, updatedA);
    storage.updateNote(updatedB.id, updatedB);
    
    // Refresh data first, then generate new pair
    refreshData();
    
    // Small delay to ensure data is refreshed before generating new pair
    setTimeout(() => {
      generateNewPair();
    }, 10);
  }, [currentPair, refreshData, generateNewPair]);

  const resetRankings = useCallback(() => {
    storage.resetRankings();
    
    // Force immediate UI update
    setData(storage.getData());
    setCurrentPair(null);
    setLastPair(null);
    
    setTimeout(() => {
      refreshData();
    }, 10);
  }, [refreshData]);

  const updateSettings = useCallback((settings: Partial<import("@shared/schema").Settings>) => {
    storage.updateSettings(settings);
    setData(storage.getData());
  }, []);

  const archiveNote = useCallback((noteId: string) => {
    storage.archiveNote(noteId);
    
    // Clear current pair first if the archived note was in it
    if (currentPair && (currentPair.noteA.id === noteId || currentPair.noteB.id === noteId)) {
      setCurrentPair(null);
      // Also clear the last pair since it involved an archived note
      setLastPair(null);
    }
    
    // Force immediate UI update
    setData(storage.getData());
    
    // Generate new pair if needed
    setTimeout(() => {
      const newData = storage.getData();
      const newActiveNotes = newData.notes.filter(note => !note.archivedAt);
      if (newActiveNotes.length >= 2) {
        generateNewPair();
      }
    }, 100);
  }, [currentPair, generateNewPair]);

  const unarchiveNote = useCallback((noteId: string) => {
    storage.unarchiveNote(noteId);
    
    // Force immediate UI update
    setData(storage.getData());
    
    setTimeout(() => {
      const newData = storage.getData();
      const newActiveNotes = newData.notes.filter(note => !note.archivedAt);
      if (newActiveNotes.length >= 2 && !currentPair) {
        generateNewPair();
      }
    }, 100);
  }, [currentPair, generateNewPair]);

  const clearAllData = useCallback(() => {
    storage.clearAllData();
    
    // Force immediate UI update
    setData(storage.getData());
    setCurrentPair(null);
    setLastPair(null);
    
    setTimeout(() => {
      refreshData();
    }, 10);
  }, [refreshData]);

  // Auto-generate pair when notes change
  useEffect(() => {
    const activeNotes = data.notes.filter(note => !note.archivedAt);
    if (activeNotes.length >= 2 && !currentPair) {
      generateNewPair();
    }
  }, [data.notes.length, currentPair, generateNewPair]);

  const activeNotes = data.notes.filter(note => !note.archivedAt);
  
  return {
    data,
    activeNotes,
    archivedNotes: data.archivedNotes || [],
    currentPair,
    updateMarkdown,
    parseAndApplyNotes,
    generateNewPair,
    submitVote,
    archiveNote,
    unarchiveNote,
    resetRankings,
    clearAllData,
    updateSettings,
    canReview: activeNotes.length >= 2,
  };
}
