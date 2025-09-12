# Contributing

Thanks for your interest in improving Append Review! This project is a React (Vite) app with an Express dev server. Data lives in the browser via localStorage—no database.

## Quick start

Prereqs: Node.js ≥ 16 and npm.

```bash
make setup   # install deps + type check
make dev     # start Express + Vite on http://localhost:5000
```

Useful commands:
- `make check` — TypeScript type checking
- `make build` — Build server + client bundles
- `make build-static` — Static bundle with relative paths
- `make build-subdir` — Static bundle targeting `/append/`

## Code style
- TypeScript throughout (Node + React)
- 2-space indent, ~100 char lines, no trailing whitespace
- Prefer explicit types; validate runtime boundaries with Zod
- React: function components, PascalCase names
- Keep imports grouped (std/deps/local) and paths relative within each package

## Branches and commits
- Branch names: `feat/...`, `fix/...`, `docs/...`, `chore/...`
- Commits: small, focused, imperative subject (≤72 chars)
  - Example: `fix(review): debounce rating updates to reduce jank`

## Running checks locally
```bash
make check
make build
```

## Pull requests
1. Ensure `make check` and `make build` pass
2. Update `CHANGELOG.md` under Unreleased
3. If the change is user-facing, bump `src/package.json` version (semver)
4. Add screenshots/GIFs for UI changes
5. Link related issues and provide clear test steps

## Versioning & changelog
- Keep a Changelog (Unreleased → releases)
- Semantic Versioning
  - PATCH: docs/chore/non-breaking fixes
  - MINOR: backward-compatible features
  - MAJOR: breaking changes

To bump version (without tagging):
```bash
cd src && npm version patch --no-git-tag-version
```

## Static deploys
Build outputs to `src/dist/public/`. See README for Cloudflare Pages and subfolder deploy tips.

## Questions?
Open a Discussion or an issue.

