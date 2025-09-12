# Changelog

All notable changes to this project are documented in this file.

The format follows Keep a Changelog 1.1.0 and this project adheres to Semantic Versioning 2.0.0.

## [Unreleased]

### Added
- Append page: Inline save status next to Editor title ("Saving…" then "Saved" for ~1.6s, no spinner).
- Append page: Persist collapsed/expanded state of Note Extraction Rules in localStorage.

### Changed
- Append page: Make editor height responsive (`h-[50vh]` on small screens, `h-[60vh]` on md+, with `min-h-[24rem]`) for better use of space.
- Improve contrast of the active desktop navigation tab in dark mode for better readability.

## [1.1.7] - 2025-09-12

### Added
- Review: Per-note expand/collapse controls to quickly toggle full view within cards.
- Settings: "Review text density" (compact/comfortable/expanded), default comfortable.

### Changed
- Review: Remove two-line truncation; wrap long lines and show more text by default with height-limited scroll and fade.

## [1.1.6] - 2025-09-12

### Changed
- Mobile: Hide footer completely to avoid partial overlap with bottom nav.
- Mobile: Add Settings button and Theme toggle to the header alongside About for discoverability.

## [1.1.4] - 2025-09-12

### Added
- Footer with links to the GitHub repository and Karpathy’s note.
- About dialog (accessible from header and footer) with project summary, version, links, and keyboard shortcuts.

## [1.1.3] - 2025-09-12

### Added
- Light website social image (SVG) and generated PNG at `src/client/public/og-image.(svg|png)`.
- Makefile target `social-png` to convert SVG previews to PNG (tries rsvg/resvg/inkscape/ImageMagick).

### Changed
- Meta tags in `src/client/index.html` now reference PNG for maximum compatibility and align copy to the new message ("Gamify your note review").

## [1.1.2] - 2025-09-12

### Added
- AGENTS.md: Voice input/transcription guidance (handle mis-hearings like "node"→"note", clarify ambiguity, prefer minimal reversible changes)

## [1.1.1] - 2025-09-12

### Added
- docs/ar.md — AR (Append & Review) project meta note with guidance and initial idea nodes (footer links, About dialog, editor polish, shortcut hints, data export/import)

## [1.1.0] - 2025-09-12

### Removed
- Preview pane on Append page (desktop and mobile)
- "Apply Changes" button (changes auto-apply when navigating to Review/Ranking)
- Notes extracted banner on Append page

### Changed
- Editor now uses full width on Append page for better focus
- Clarified auto-apply behavior by removing redundant controls

## [1.0.4] - 2025-09-12

### Changed
- Default development port switched from 5000 to 5252 to avoid conflicts; updated README, Makefile messages, `.env.example`, and AGENTS.md accordingly.

## [1.0.3] - 2025-09-12

### Changed
- Moved version label next to the app title in the header (desktop and a compact mobile header) for visibility across devices; removed footer version.

## [1.0.2] - 2025-09-12

### Changed
- Footer now includes a subtle top border to mirror the header and improve separation while keeping the version label unobtrusive.

## [1.0.1] - 2025-09-12

### Added
- Contributor guide `AGENTS.md` with incremental commits, changelog, and SemVer policies.
- Initial `CHANGELOG.md` following Keep a Changelog 1.1.0.

### Changed
- Bumped package version to 1.0.1.

[Unreleased]: https://github.com/dudarev/append-review-v1/compare/v1.1.7...HEAD
[1.1.7]: https://github.com/dudarev/append-review-v1/compare/v1.1.6...v1.1.7
[1.1.6]: https://github.com/dudarev/append-review-v1/compare/v1.1.5...v1.1.6
[1.1.4]: https://github.com/dudarev/append-review-v1/compare/v1.1.3...v1.1.4
[1.1.4]: https://github.com/dudarev/append-review-v1/compare/v1.1.3...v1.1.4
[1.1.3]: https://github.com/dudarev/append-review-v1/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/dudarev/append-review-v1/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/dudarev/append-review-v1/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/dudarev/append-review-v1/compare/v1.0.4...v1.1.0
[1.0.4]: https://github.com/dudarev/append-review-v1/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/dudarev/append-review-v1/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/dudarev/append-review-v1/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/dudarev/append-review-v1/compare/v1.0.0...v1.0.1
