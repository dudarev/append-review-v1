import { Note } from "@shared/schema";

export interface EloUpdate {
  winnerRating: number;
  loserRating: number;
}

export function calculateEloUpdate(
  winnerRating: number,
  loserRating: number,
  kFactor: number = 32
): EloUpdate {
  const expectedWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  const expectedLoser = 1 / (1 + Math.pow(10, (winnerRating - loserRating) / 400));

  const newWinnerRating = winnerRating + kFactor * (1 - expectedWinner);
  const newLoserRating = loserRating + kFactor * (0 - expectedLoser);

  return {
    winnerRating: Math.round(newWinnerRating),
    loserRating: Math.round(newLoserRating),
  };
}

export function updateNotesAfterVote(
  noteA: Note,
  noteB: Note,
  winner: "A" | "B" | "skip",
  kFactor: number = 32
): { noteA: Note; noteB: Note } {
  const now = new Date().toISOString();

  if (winner === "skip") {
    return {
      noteA: { ...noteA, lastReviewedAt: now },
      noteB: { ...noteB, lastReviewedAt: now },
    };
  }

  const isAWinner = winner === "A";
  const winnerNote = isAWinner ? noteA : noteB;
  const loserNote = isAWinner ? noteB : noteA;

  const eloUpdate = calculateEloUpdate(winnerNote.rating, loserNote.rating, kFactor);

  const updatedWinner = {
    ...winnerNote,
    rating: eloUpdate.winnerRating,
    wins: winnerNote.wins + 1,
    lastReviewedAt: now,
  };

  const updatedLoser = {
    ...loserNote,
    rating: eloUpdate.loserRating,
    losses: loserNote.losses + 1,
    lastReviewedAt: now,
  };

  return isAWinner
    ? { noteA: updatedWinner, noteB: updatedLoser }
    : { noteA: updatedLoser, noteB: updatedWinner };
}
