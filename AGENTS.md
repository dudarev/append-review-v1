# Repository Guidelines

This repository hosts a React (Vite) frontend and a lightweight Express server for local development. Data persists in the browser via localStorage; the server primarily serves the app and dev tooling.

## Project Structure & Module Organization
- `src/client/` — React app (Vite). Entry: `src/client/src/main.tsx`; pages in `src/client/src/pages/`; UI in `src/client/src/components/`; hooks in `src/client/src/hooks/`; utilities in `src/client/src/lib/`.
- `src/server/` — Express server for dev and optional static serving (`index.ts`, `routes.ts`, `vite.ts`).
- `src/shared/` — Shared TypeScript types/schemas (`schema.ts`).
- `src/dist/public/` — Built static assets (output of `make build*`).
- `Makefile` — Primary developer commands. Run `make help`.

## Build, Test, and Development Commands
- `make setup` — Install dependencies and run type check.
- `make dev` — Start Express + Vite at `http://localhost:5252`.
- `make build` — Build client and server bundles into `src/dist/` and `src/dist/public/`.
- `make start` — Run production server from `dist/`.
- `make build-static` — Build static bundle with relative asset paths.
- `make build-subdir` — Build static bundle for `/append/` base path.
- `make check` — TypeScript type checking via `tsc`.

## Coding Style & Naming Conventions
- TypeScript for Node + React. Favor explicit types and Zod validation for runtime boundaries.
- Indentation: 2 spaces; keep lines under ~100 chars; no trailing whitespace.
- Filenames: kebab-case (e.g., `use-mobile.tsx`, `settings-dialog.tsx`).
- React components: PascalCase component names; prefer function components.
- Imports: group standard/deps/local; keep paths relative within each package.

## Testing Guidelines
- No test framework configured yet. Validate by:
  - Running `make check` and `make build`.
  - Manually exercising flows (Append, Review, Ranking, Archive).
- If adding tests, prefer Vitest + React Testing Library; colocate as `*.test.ts(x)` next to sources.

## Commit & Pull Request Guidelines
- Commits: small, incremental, and logically scoped. Use an imperative, concise subject (≤72 chars) and add body for context when needed.
  - Example: `fix(review): debounce rating updates to reduce jank`.
  - Make incremental commits as you complete discrete steps; add a final polishing commit if needed.
- PRs: clear description, linked issues, screenshots/GIFs for UI, test steps, and note breaking changes.

## Changelog & Versioning
- Maintain `CHANGELOG.md` per Keep a Changelog 1.1.0: https://keepachangelog.com/en/1.1.0/
  - Keep an Unreleased section and categorize entries (Added, Changed, Fixed, Deprecated, Removed, Security).
- Follow Semantic Versioning 2.0.0: https://semver.org/
  - Always update CHANGELOG and bump version together in the same PR when behavior, docs, or tooling changes warrant it.
  - Typical bumps: docs/chore = PATCH, backward‑compatible feature = MINOR, breaking change = MAJOR.
  - Update `src/package.json` (and lockfile) and move Unreleased entries under the new version with date on release.
  - Tag every release and push tags so CHANGELOG compare links work. Use annotated tags: `git tag -a vX.Y.Z -m "Release vX.Y.Z" && git push --tags`.

### Agent expectations (UI changes)
- Any user-visible UI change must include:
  - A CHANGELOG entry under the appropriate category (e.g., Changed/Removed).
  - A SemVer bump in `src/package.json` (at least PATCH; MINOR if removing or altering a primary workflow or feature).
  - Keep the version displayed in the header in sync via `import.meta.env.VITE_APP_VERSION` (derived from `src/package.json`).

## Release Process (Quick)
- Add/change code; update CHANGELOG under Unreleased.
- Decide version bump (semver) and update `src/package.json` (e.g., `cd src && npm version patch --no-git-tag-version`).
- Commit both changes together and open PR; merge to main.
- Tag the release on the merge commit with an annotated tag and push tags (required):
  - Manual: `git tag -a vX.Y.Z -m "Release vX.Y.Z" && git push --tags`
  - Or via Make: `make tag` then `make push-tags` (see Makefile)

Notes:
- Tags must follow `v<semver>` (e.g., `v1.2.3`).
- Tagging is required so GitHub compare links in CHANGELOG resolve correctly.
- To backfill missing tags, tag the commit that bumped `src/package.json` and CHANGELOG for each historical version.

## Security & Configuration Tips
- No DB; data is stored in browser localStorage (`appendReview:v1`).
- Configure static deploy base via `VITE_BASE_PATH` (`./` or `/append/`).
- Do not commit real `.env`; use `.env.example` for reference.

## Docs Stewardship
- Owner: maintainers (keep this section and docs current).
- Source of truth for architecture: `docs/architecture.md`.
- Update triggers (when any apply):
  - Build/dev pipeline changes (Vite config, esbuild, dev server)
  - Core dependencies added/removed (React, Radix UI, Tailwind, Zod, Express)
  - Storage model changes (localStorage vs any backend persistence)
- Avoid exhaustive dependency lists in docs; link to `src/package.json` instead.

## Voice Input & Transcription
- Many commands and instructions may be dictated by voice. Expect occasional transcription errors (e.g., "node" instead of "note").
- When wording is ambiguous, infer intent from context and ask a brief clarification if risk is high.
- Prefer minimal, reversible changes when acting under ambiguity; document assumptions in the PR/commit description.
- Normalize obvious mis-transcriptions in UI copy and docs (e.g., use "note" consistently) unless the user explicitly prefers otherwise.
