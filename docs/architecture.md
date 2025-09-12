# Architecture Overview

Last reviewed: 2025-09-12

This project is a local-first note ranking app built with React (Vite) and a lightweight Express server used for development and optional static serving. All user data persists in the browser via localStorage — there is no backend database.

## Frontend
- Framework: React + TypeScript (SPA)
- State: Local component state and custom hooks
- UI: Radix UI primitives styled with Tailwind (shadcn/ui patterns)
- Routing: In-app view switching (Append, Review, Ranking, Archive)
- Persistence: Browser `localStorage` with Zod validation at boundaries
- Theming: CSS variables with light/dark support

## Backend
- Purpose: Development server and optional static file serving
- Framework: Express with JSON middleware and simple routes under `/api`
- Persistence: None (no DB). All app state lives in the browser
- Dev tooling: Integrates Vite in middleware mode for fast HMR

## Core Features
- Markdown parsing into discrete notes
- Pairwise comparisons with Elo scoring
- Smart pair selection balancing recency and vote counts
- Archiving to remove notes from ranking while preserving data
- Mobile-responsive layout and keyboard shortcuts

## Data Model (Zod)
- Note: text, rating, wins/losses, timestamps, optional archive date
- Settings: Elo algorithm parameters and pair selection tuning
- App Data: active notes, archived notes, version/metadata

## Build & Tooling
- Build: Vite for client; esbuild for server bundling
- Types: TypeScript with strict config (`make check` runs `tsc`)
- Styles: Tailwind CSS (+ typography plugin)
- Dev: Express + Vite HMR for local development (`make dev`)

## Key Packages
This is a representative list to avoid drift; see `src/package.json` for the authoritative set and versions.

- React, React DOM
- Radix UI components
- Tailwind CSS (+ typography)
- Lucide React (icons)
- Zod (validation)
- Express (dev/serve)
- Vite, @vitejs/plugin-react, TypeScript, esbuild

## Deployment Notes
- The UI can be deployed as static files. The server is optional in production.
- Configure base path via `VITE_BASE_PATH` (`./` for relative assets, or `/append/` for subfolder hosting).

## Maintenance
Keep this doc aligned when any of the following change:
- Build toolchain (Vite, esbuild) or dev server setup
- Core UI/system dependencies (React/Radix/Tailwind/Zod/Express)
- Persistence model (e.g., switching away from localStorage)

For exhaustive dependency details, prefer linking to `src/package.json` rather than duplicating lists here.

