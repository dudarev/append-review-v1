import { AppData, appDataSchema, Note, Settings } from "@shared/schema";

const STORAGE_KEY = "appendReview:v1";

export class LocalStorage {
  private data: AppData | null = null;

  constructor() {
    this.loadData();
  }

  private loadData(): AppData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsedData = JSON.parse(stored);
        // Migration: ensure archivedNotes field exists
        if (!parsedData.archivedNotes) {
          parsedData.archivedNotes = [];
        }
        this.data = appDataSchema.parse(parsedData);
      } else {
        this.data = this.createDefaultData();
        this.saveData();
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
      this.data = this.createDefaultData();
      this.saveData();
    }
    return this.data;
  }

  private createDefaultData(): AppData {
    return {
      version: 1,
      createdAt: new Date().toISOString(),
      markdownContent: "",
      notes: [],
      archivedNotes: [],
      settings: {
        initialRating: 1000,
        kFactor: 32,
        pairRatingWindow: 200,
        minCandidates: 5,
        recencyCapDays: 14,
        selectionWeights: {
          recency: 0.5,
          lowVotes: 0.3,
          random: 0.2,
        },
      },
    };
  }

  private saveData(): void {
    if (this.data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    }
  }

  getData(): AppData {
    if (!this.data) {
      return this.loadData();
    }
    return this.data;
  }

  updateMarkdownContent(content: string): void {
    if (this.data) {
      this.data.markdownContent = content;
      this.saveData();
    }
  }

  setNotes(notes: Note[]): void {
    if (this.data) {
      this.data.notes = notes;
      this.saveData();
    }
  }

  updateNote(noteId: string, updates: Partial<Note>): void {
    if (this.data) {
      const noteIndex = this.data.notes.findIndex(n => n.id === noteId);
      if (noteIndex !== -1) {
        this.data.notes[noteIndex] = { ...this.data.notes[noteIndex], ...updates };
        this.saveData();
      }
    }
  }

  updateSettings(settings: Partial<Settings>): void {
    if (this.data) {
      this.data.settings = { ...this.data.settings, ...settings };
      this.saveData();
    }
  }

  resetRankings(): void {
    if (this.data) {
      // Reset rankings for both active and archived notes
      this.data.notes = this.data.notes.map(note => ({
        ...note,
        rating: this.data!.settings.initialRating,
        wins: 0,
        losses: 0,
        lastReviewedAt: null,
      }));
      
      if (this.data.archivedNotes) {
        this.data.archivedNotes = this.data.archivedNotes.map(note => ({
          ...note,
          rating: this.data!.settings.initialRating,
          wins: 0,
          losses: 0,
          lastReviewedAt: null,
        }));
      }
      
      this.saveData();
    }
  }

  archiveNote(noteId: string): void {
    if (this.data) {
      const noteIndex = this.data.notes.findIndex(n => n.id === noteId);
      if (noteIndex !== -1) {
        const note = this.data.notes[noteIndex];
        const archivedNote = { ...note, archivedAt: new Date().toISOString() };
        
        // Remove note from active notes
        this.data.notes.splice(noteIndex, 1);
        
        // Add to archived notes
        this.data.archivedNotes.unshift(archivedNote);
        
        // Remove the note text from markdown content
        this.removeNoteFromMarkdown(note.text);
        
        this.saveData();
      }
    }
  }

  unarchiveNote(noteId: string): void {
    if (this.data) {
      const noteIndex = this.data.archivedNotes.findIndex(n => n.id === noteId);
      if (noteIndex !== -1) {
        const note = this.data.archivedNotes[noteIndex];
        const unarchivedNote = { ...note, archivedAt: undefined };
        
        // Remove from archived notes
        this.data.archivedNotes.splice(noteIndex, 1);
        
        // Add back to active notes
        this.data.notes.push(unarchivedNote);
        
        // Add the note text back to markdown content
        this.addNoteToMarkdown(note.text);
        
        this.saveData();
      }
    }
  }

  private removeNoteFromMarkdown(noteText: string): void {
    if (this.data && this.data.markdownContent) {
      // Split markdown by double newlines to get blocks
      const blocks = this.data.markdownContent.split(/\n\s*\n/);
      
      // Filter out the block that matches this note text (trimmed)
      const filteredBlocks = blocks.filter(block => {
        const trimmedBlock = block.trim();
        return trimmedBlock !== noteText.trim() && trimmedBlock !== "";
      });
      
      // Rejoin the blocks
      this.data.markdownContent = filteredBlocks.join("\n\n");
    }
  }

  private addNoteToMarkdown(noteText: string): void {
    if (this.data) {
      // Add the note text back to the end of the markdown content
      if (this.data.markdownContent.trim()) {
        this.data.markdownContent += "\n\n" + noteText;
      } else {
        this.data.markdownContent = noteText;
      }
    }
  }

  clearAllData(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.data = this.createDefaultData();
    this.saveData();
  }
}

export const storage = new LocalStorage();
