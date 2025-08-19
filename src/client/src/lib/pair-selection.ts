import { Note, Settings } from "@shared/schema";

export interface PriorityScore {
  noteId: string;
  score: number;
  recency: number;
  lowVotes: number;
  random: number;
}

export function calculatePriorityScores(
  notes: Note[],
  settings: Settings
): PriorityScore[] {
  const now = new Date();
  const scores: PriorityScore[] = [];

  // Calculate individual components
  const recencyScores = notes.map(note => {
    if (!note.lastReviewedAt) return 1;
    const daysSince = (now.getTime() - new Date(note.lastReviewedAt).getTime()) / (1000 * 60 * 60 * 24);
    return Math.min(daysSince, settings.recencyCapDays) / settings.recencyCapDays;
  });

  const voteScores = notes.map(note => {
    const totalVotes = note.wins + note.losses;
    return 1 / (1 + totalVotes);
  });

  // Normalize vote scores
  const voteSum = voteScores.reduce((sum, score) => sum + score, 0);
  const normalizedVoteScores = voteSum > 0 
    ? voteScores.map(score => score / voteSum * notes.length)
    : voteScores.map(() => 1);

  // Calculate final priority scores
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const recency = recencyScores[i];
    const lowVotes = normalizedVoteScores[i];
    const random = Math.random();

    const score = 
      settings.selectionWeights.recency * recency +
      settings.selectionWeights.lowVotes * lowVotes +
      settings.selectionWeights.random * random;

    scores.push({
      noteId: note.id,
      score,
      recency,
      lowVotes,
      random,
    });
  }

  return scores;
}

export function selectNotePair(
  notes: Note[],
  settings: Settings,
  excludePair?: { noteAId: string; noteBId: string }
): { noteA: Note; noteB: Note } | null {
  if (notes.length < 2) return null;

  const priorityScores = calculatePriorityScores(notes, settings);
  
  // Select first note based on priority, excluding the last pair if provided
  let noteA = weightedRandomSelection(notes, priorityScores);
  if (!noteA) return null;
  
  // If this note was part of the last pair, try to select a different one
  if (excludePair && (noteA.id === excludePair.noteAId || noteA.id === excludePair.noteBId)) {
    const availableNotes = notes.filter(note => 
      note.id !== excludePair.noteAId && note.id !== excludePair.noteBId
    );
    if (availableNotes.length >= 2) {
      const availableScores = priorityScores.filter(score => 
        availableNotes.some(note => note.id === score.noteId)
      );
      const alternativeA = weightedRandomSelection(availableNotes, availableScores);
      if (alternativeA) {
        noteA = alternativeA;
      }
    }
  }

  // Build candidate set for second note, excluding the first note and last pair if provided
  let candidates = notes.filter(note => note.id !== noteA.id);
  
  // Further exclude the last pair if provided
  if (excludePair) {
    candidates = candidates.filter(note => 
      note.id !== excludePair.noteAId && note.id !== excludePair.noteBId
    );
  }
  
  let candidateSet = candidates.filter(note => 
    Math.abs(note.rating - noteA.rating) <= settings.pairRatingWindow
  );

  // Expand window if needed
  let window = settings.pairRatingWindow;
  while (candidateSet.length < Math.min(settings.minCandidates, candidates.length)) {
    window += 100;
    candidateSet = candidates.filter(note =>
      Math.abs(note.rating - noteA.rating) <= window
    );
  }

  if (candidateSet.length === 0) return null;

  // Select second note from candidates
  const candidateScores = priorityScores.filter(score =>
    candidateSet.some(note => note.id === score.noteId)
  );
  const candidateNotes = candidateSet;
  
  const noteB = weightedRandomSelection(candidateNotes, candidateScores);
  if (!noteB) return null;

  return { noteA, noteB };
}

function weightedRandomSelection(
  notes: Note[],
  scores: PriorityScore[]
): Note | null {
  if (notes.length === 0) return null;

  const totalWeight = scores.reduce((sum, score) => sum + score.score, 0);
  if (totalWeight <= 0) {
    // Fallback to random selection
    return notes[Math.floor(Math.random() * notes.length)];
  }

  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < notes.length; i++) {
    const note = notes[i];
    const score = scores.find(s => s.noteId === note.id);
    if (score) {
      random -= score.score;
      if (random <= 0) {
        return note;
      }
    }
  }

  return notes[notes.length - 1]; // Fallback
}
