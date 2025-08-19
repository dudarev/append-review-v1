import { z } from "zod";

export const noteSchema = z.object({
  id: z.string(),
  text: z.string(),
  rating: z.number(),
  wins: z.number(),
  losses: z.number(),
  lastReviewedAt: z.string().nullable(),
  createdAt: z.string(),
  archivedAt: z.string().nullable().optional(),
});

export const settingsSchema = z.object({
  initialRating: z.number().default(1000),
  kFactor: z.number().default(32),
  pairRatingWindow: z.number().default(200),
  minCandidates: z.number().default(5),
  recencyCapDays: z.number().default(14),
  selectionWeights: z.object({
    recency: z.number().default(0.5),
    lowVotes: z.number().default(0.3),
    random: z.number().default(0.2),
  }).default({
    recency: 0.5,
    lowVotes: 0.3,
    random: 0.2,
  }),
});

export const appDataSchema = z.object({
  version: z.number().default(1),
  createdAt: z.string(),
  markdownContent: z.string().default(""),
  notes: z.array(noteSchema).default([]),
  archivedNotes: z.array(noteSchema).default([]),
  settings: settingsSchema.default({}),
});

export type Note = z.infer<typeof noteSchema>;
export type Settings = z.infer<typeof settingsSchema>;
export type AppData = z.infer<typeof appDataSchema>;

export const insertNoteSchema = noteSchema.omit({ id: true, createdAt: true });
export type InsertNote = z.infer<typeof insertNoteSchema>;
