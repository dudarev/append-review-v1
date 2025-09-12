# AR — Append & Review (project meta)

AR is short for Append & Review. This document is a lightweight, running log of ideas for the project itself. Treat it like a working memory:

- Append new ideas at the top (newest first).
- As ideas become less relevant, move them down; prune when necessary.
- Keep each idea as a short “note” (1–3 sentences). Separate notes with a single blank line. Keep it concise and clear.

Inspiration: Andrej Karpathy’s “The Append and Review Note” — https://karpathy.bearblog.dev/the-append-and-review-note/

Scope: This project primarily implements the Review part of that idea. The “Append” here is simply adding thoughts to this file (or entering notes in the app) and then using Review/Ranking to surface the best ones over time.

---

Footer: Add a small footer with links to the GitHub repo and to Karpathy’s note. Consider an “About” link/modal (like Settings) that summarizes the project, version, links, and keyboard shortcuts.

Editor polish: Make editor height responsive (e.g., h-[60vh] with a sensible min). Add a subtle “Saving…” → “Saved” indicator next to the Editor title. Collapse the Note Extraction Rules by default to reduce visual noise.

Discoverability: Show a gentle hint for shortcuts — 1: Append, 2: Review, 3: Ranking, 4: Archive — as a tooltip or in the About dialog.

Data UX: Add export/import of localStorage data to a JSON file (backup/restore and sharing between devices).

Review pairing: When there are many notes, optionally avoid pairing very low-activity notes repeatedly; offer a “freshness boost” to recently added notes for a short window.

