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
- `make dev` — Start Express + Vite at `http://localhost:5000`.
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
- Maintain `CHANGELOG.md` following Keep a Changelog 1.1.0: https://keepachangelog.com/en/1.1.0/
  - Use an Unreleased section and categorize entries: Added, Changed, Fixed, Deprecated, Removed, Security.
- Follow Semantic Versioning 2.0.0: https://semver.org/
  - Bump version in `src/package.json` as needed: MAJOR.MINOR.PATCH.
  - Tag releases: `git tag -a vX.Y.Z -m "Release vX.Y.Z" && git push --tags`.

## Security & Configuration Tips
- No DB; data is stored in browser localStorage (`appendReview:v1`).
- Configure static deploy base via `VITE_BASE_PATH` (`./` or `/append/`).
- Do not commit real `.env`; use `.env.example` for reference.
