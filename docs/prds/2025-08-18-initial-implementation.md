# Product Requirements Document — Append & Review (v1, Local, Mobile‑First)

## Overview

A browser app to paste or author Markdown, auto‑extract notes, and run pairwise “append & review” comparisons. Each vote updates Elo ratings so the most important notes rise to the top. Selection favors notes that are stale (reviewed long ago) and under‑reviewed (low total votes), while pairing tends to keep competitors close in rating. All data persists locally.

**Mobile‑first:** optimized layouts, large touch targets, no gestures in v1 (buttons only).

## Goals

* Mobile‑first UX: fast, thumb‑friendly, accessible.
* Paste or author Markdown and extract notes automatically.
* Run rapid pairwise votes with an Elo‑based ranking.
* Prioritize review by recency and low vote count.
* Persist everything locally (no backend).
* Show a ranked list with basic stats.

## Non‑Goals (v1)

* Multi‑user sync, accounts, collaboration.
* Server/cloud storage.
* MDX editor integration (post‑v1).
* Reordering within the original Markdown file (post‑v1).
* Archive view (post‑v1, design placeholder only).

## Primary User Stories

1. On mobile or desktop, I paste Markdown and the app extracts notes.
2. I can edit Markdown in a simple textarea with a basic preview.
3. I review two notes at a time and select the winner or skip.
4. The system schedules matches prioritizing older/less‑voted notes and similar ratings.
5. I see a ranked list; my data persists locally.
6. I can navigate quickly between Append, Review, and Ranking views.

## Scope (v1)

* **Views:**

  * **Append:** textarea editor + basic Markdown preview, parse/apply controls.
  * **Review:** pairing UI for voting (Top wins / Skip / Bottom wins buttons).
  * **Ranking:** sortable table of notes.
  * **Settings (simple):** Reset rankings (set all ratings to initial and clear W/L/lastReviewedAt); Clear all data.
* **Editor:** textarea + preview toggle (no MDX). Paste or type text; autosaves continuously.
* **Parser:** treat as notes paragraph‑level blocks separated by blank lines; exclude headings, horizontal rules, YAML front matter, and HTML comments.
* **Lists & code blocks:**

  * Contiguous list (no blank lines between items) → one note.
  * Blank lines within a list split it into multiple notes by those blank‑line boundaries.
  * Each fenced code block (\`\`\` or \~\~\~) is one note; multiple fenced blocks separated by blank lines are separate notes.
* **Voting UI:**

  * **Mobile:** stacked cards (top vs bottom). Horizontal button bar pinned near thumb: \[Top wins] \[Skip] \[Bottom wins]. Left button maps to the top note; right button maps to the bottom note. No swipe gestures in v1.
  * **Desktop:** side‑by‑side cards with click/keyboard; buttons clustered centrally so mouse travel is minimal.
  * Keyboard: `A` = top wins, `L` = bottom wins, `K` = skip, `N` = next, `1/2/3` = view switch.
* **Ranking:** table with columns (Note, Rating, Wins, Losses, Last Reviewed), sort by any column, text filter.
* **Persistence:** localStorage JSON. **No export in v1.** Import is just pasting text into Append.

## Parsing Rules (v1)

* **Exclude:**

  * Headings (`#`…`######`).
  * Horizontal rules (`---`, `***`, `___` on their own line).
  * YAML front matter block at file start (`---`…`---`).
  * HTML comments (`<!-- ... -->`).
* **Include as notes:**

  * Paragraphs separated by one or more blank lines.
  * Contiguous lists (as one note) or list segments split by blank lines (as multiple notes).
  * Fenced code blocks, each block = one note.
* Trim whitespace; ignore empty blocks.

### Re‑parse & merge policy (v1)

* The **Append** textarea is the source of truth. On “Apply” or when switching views, the app re‑parses.
* **Exact‑text match (after trimming)** is the only way to preserve an existing note; any text change creates a **new note** with a new id and **initial rating**.
* Any existing note whose text is **no longer present** is **removed** (its rating and stats are discarded).
* **Duplicate handling:** if the current document yields two or more **identical trimmed notes**, **silently keep only the first occurrence** by position; the rest are ignored.

## Data Model (local only)

```json
{
  "version": 1,
  "createdAt": "ISO",
  "notes": [
    {
      "id": "uuid",
      "text": "string",
      "rating": 1000,
      "wins": 0,
      "losses": 0,
      "lastReviewedAt": null,
      "createdAt": "ISO"
    }
  ],
  "settings": {
    "initialRating": 1000,
    "kFactor": 32,
    "pairRatingWindow": 200,
    "minCandidates": 5,
    "recencyCapDays": 14,
    "selectionWeights": { "recency": 0.5, "lowVotes": 0.3, "random": 0.2 }
  }
}
```

## Algorithms

### Elo Update

* Expected score: `E_A = 1 / (1 + 10^((R_B - R_A)/400))`.
* Score `S`: 1 for win, 0 for loss. **Skip**: no change to rating or vote counts.
* Fixed `K = 32` (v1 simplicity).
* Update: `R_A' = R_A + K * (S_A - E_A)`; symmetric for B.

### Recency & Low‑Votes Priority (sampling weight per note i)

* `rec_i = min(days_since_last_review, recencyCapDays) / recencyCapDays` (0..1). If never reviewed, treat as `rec_i = 1`.
* `votes_i = wins_i + losses_i`.
* `lv_i = 1 / (1 + votes_i)`, then normalize across notes.
* `u_i ∈ (0,1)` random jitter.
* Priority score: `P_i = w_r*rec_i + w_l*lv_i + w_u*u_i`.

### Pair Selection (per round)

1. **Prereq:** require **≥ 2 total notes** to enable Review; otherwise prompt user to add more.
2. Sample **A** from all notes with probability ∝ `P_i`.
3. Build candidate set `C = { j | |R_j - R_A| ≤ pairRatingWindow }`.
4. If `|C| < minCandidates`, expand the window in +100 steps until `|C| ≥ minCandidates` or all notes included.
5. Sample **B** from `C` with probability ∝ `P_j`, ensuring `B ≠ A`.
6. **Skip behavior:** record interaction as a skip (no rating change, no win/loss increment); **do** update `lastReviewedAt` for both notes to now to prevent immediate re‑sampling.

## UI/UX Details

* **Navigation:** bottom tab bar (mobile) with Append, Review, Ranking; keyboard shortcuts **1/2/3** to switch views (desktop). Optional quick‑switch button in header.
* **Mobile layout:** stacked cards, sticky vote bar, large touch targets (≥ 44×44 px), inertial lists, and on‑device fonts.
* **Keyboard (desktop):** `A` = left/top wins, `L` = right/bottom wins, `K` = skip, `N` = next, `1/2/3` = view switch. Buttons are clustered centrally between/under the cards to minimize mouse travel.
* **Micro‑interactions:** instant save (debounced), haptic/vibration on vote (if supported), toasts for import/export, progressive disclosure of metadata.
* **Performance:** virtualize Ranking table for large sets; minimal reflows after votes; batch localStorage writes.
* **Accessibility:** focus states, aria‑labels on buttons, reduced motion mode, high‑contrast toggle.

## Persistence

* Single localStorage key: `appendReview:v1`.
* **Autosave:** changes in Append are saved continuously (debounced). Switching to **Review** triggers **parse & commit** automatically.
* **No export in v1.** Import is simply pasting/typing text into the Append textarea; parsing happens locally.
* **No backups in v1.**

## Acceptance Criteria

* Mobile and desktop layouts both usable; on phones, stacked cards with a horizontal three‑button bar (\[Top wins] \[Skip] \[Bottom wins]) work reliably.
* Parsing excludes headings, HRs, YAML front matter, and HTML comments; contiguous lists and single code fences are treated as notes as specified.
* **Re‑parse policy works as specified:** exact‑text match preserves a note; any text change becomes a new note; notes not present are removed.
* **Duplicate handling** keeps only the first occurrence silently.
* Review is enabled when there are at least 2 notes.
* Selection prioritizes stale/low‑vote notes and generally pairs similar ratings (±200 by default, auto‑expanding if needed).
* Elo updates on wins/losses; **skips** cause no rating or win/loss changes but **do** update `lastReviewedAt` for both notes.
* **No rating is displayed during voting**.
* Ranking table sorts and filters; data persists across reloads.
* **Settings → Reset rankings** sets all ratings to initial and clears W/L/lastReviewedAt.

## Risks/Tradeoffs

* No export or backups in v1 means data is device‑local; accidental storage clears will lose data until export/backups ship.
* **Edits discard prior ratings** due to the new‑node policy; this is simple but may feel lossy.
* No match history (to keep storage compact) reduces auditability and advanced analytics.
* Treating contiguous lists as a single note may make very long lists hard to compare — mitigated by blank‑line splitting guidance.
* Fixed K is simple but less statistically adaptive — acceptable for v1.

## Roadmap (post‑v1 ideas)

* Export/import (JSON and Markdown); optional cloud sync.
* Rolling backups with retention.
* MDX editor integration (visual ↔ raw toggle).
* Archive mode: move notes from Append to a read‑only archive view; optional limits.
* Reorder original Markdown by current ranking.
* Session target (e.g., 25 votes) with progress UI.
* Optional visibility of ratings during voting; analytics view.
* Optional mobile gestures for faster voting.
* Smarter reconciliation: fuzzy matching to preserve ratings across small edits; manual merge tools.
* PWA install/offline cache.

## Open Questions

* None for v1.
