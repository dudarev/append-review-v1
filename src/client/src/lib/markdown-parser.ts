import { v4 as uuidv4 } from "uuid";
import { Note } from "@shared/schema";

export interface ParsedNote {
  text: string;
  id?: string;
}

export function parseMarkdownToNotes(markdown: string): ParsedNote[] {
  if (!markdown.trim()) return [];

  // Remove YAML front matter
  let content = markdown.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, "");
  
  // Remove HTML comments
  content = content.replace(/<!--[\s\S]*?-->/g, "");
  
  // Split by double newlines to get blocks
  const blocks = content.split(/\n\s*\n/);
  const notes: ParsedNote[] = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Skip headings
    if (/^#{1,6}\s/.test(trimmed)) continue;
    
    // Skip horizontal rules
    if (/^(---+|___+|\*\*\*+)\s*$/.test(trimmed)) continue;

    // Handle fenced code blocks
    if (/^```|^~~~/.test(trimmed)) {
      notes.push({ text: trimmed });
      continue;
    }

    // Handle list items - check if it's a list block
    if (/^\s*[-*+]\s|^\s*\d+\.\s/.test(trimmed)) {
      // Split list by blank lines within the block
      const listParts = trimmed.split(/\n\s*\n/);
      for (const part of listParts) {
        const partTrimmed = part.trim();
        if (partTrimmed) {
          notes.push({ text: partTrimmed });
        }
      }
      continue;
    }

    // Regular paragraphs
    notes.push({ text: trimmed });
  }

  // Remove duplicates - keep only first occurrence
  const seen = new Set<string>();
  return notes.filter(note => {
    if (seen.has(note.text)) {
      return false;
    }
    seen.add(note.text);
    return true;
  });
}

export function mergeNotesWithExisting(
  parsedNotes: ParsedNote[],
  existingNotes: Note[],
  initialRating: number
): Note[] {
  const existingByText = new Map<string, Note>();
  existingNotes.forEach(note => {
    existingByText.set(note.text, note);
  });

  const mergedNotes: Note[] = [];
  const now = new Date().toISOString();

  for (const parsed of parsedNotes) {
    const existing = existingByText.get(parsed.text);
    if (existing) {
      // Preserve existing note
      mergedNotes.push(existing);
    } else {
      // Create new note
      mergedNotes.push({
        id: uuidv4(),
        text: parsed.text,
        rating: initialRating,
        wins: 0,
        losses: 0,
        lastReviewedAt: null,
        createdAt: now,
      });
    }
  }

  return mergedNotes;
}
