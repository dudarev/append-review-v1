# AR — Append & Review (project meta)

AR is short for Append & Review. This document is a lightweight, running log of ideas for the project itself. Treat it like a working memory:

- Append new ideas at the top (newest first).
- As ideas become less relevant, move them down; prune when necessary.
- Keep each idea as a short “note” (1–3 sentences). Separate notes with a single blank line. Keep it concise and clear.

Inspiration: Andrej Karpathy’s “The Append and Review Note” — https://karpathy.bearblog.dev/the-append-and-review-note/

Scope: This project primarily implements the Review part of that idea. The “Append” here is simply adding thoughts to this file (or entering notes in the app) and then using Review/Ranking to surface the best ones over time.

---

Too much empty space when reviewing notes on mobile. 

When Restore button is clicked in the archive view, the note should be visibly removed from the view. 

Full-view idea: Add an optional full note view from Review (modal) with the complete text and copy action. Keep cards compact by default, allow per-note expand/collapse, and offer a global density setting to control how much text is visible at a glance.

Data UX: Add export/import of localStorage data to a JSON file (backup/restore and sharing between devices).

Review pairing: When there are many notes, optionally avoid pairing very low-activity notes repeatedly; offer a “freshness boost” to recently added notes for a short window.
