# Append Review v1 - Local Development Setup

This project is a React + Express.js application for reviewing and ranking notes using an ELO algorithm. All data is stored locally in the browser using localStorage.

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

**Note: No database required** - this app uses localStorage for data persistence.

### Option 1: Quick Setup (Recommended)
```bash
# Complete setup for new developers
make setup

# Start development server
make dev
```

### Option 2: Manual Setup
1. **Install dependencies:**
   ```bash
   make install
   ```

2. **Start development server:**
   ```bash
   make dev
   ```

## Available Commands

Run `make help` to see all available commands:

- `make setup` - Complete setup for new developers
- `make dev` - Start development server
- `make build` - Build for production
- `make start` - Start production server
- `make check` - Run TypeScript type checking
- `make clean` - Clean build artifacts
- `make status` - Show project status
- `make build-static` - Build static bundle with relative paths
- `make build-subdir` - Build static bundle targeted at /append/

## Data Storage

This application uses **localStorage** for data persistence as specified in the PRD. No database setup is required.

- **Storage Key:** `appendReview:v1`
- **Location:** Browser localStorage
- **Backup:** Data is stored locally in your browser

### Storage Notes
Uses browser localStorage only; no server/database required.

## Project Structure

```
src/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── pages/      # Application pages
│   │   ├── hooks/      # Custom React hooks
│   │   └── lib/        # Utility functions
├── server/          # Express.js backend
├── shared/          # Shared TypeScript types and schemas
└── package.json     # Dependencies and scripts
```

## Development Workflow

1. **First time setup:**
   ```bash
   make setup
   make dev
   ```

2. **Daily development:**
   ```bash
   make dev
   ```

3. **Before committing:**
   ```bash
   make check    # Type checking
   make build    # Ensure build works
   ```

## Database

This project uses **localStorage** for data persistence as per the PRD requirements. No database setup is required.

- **Data Storage:** Browser localStorage under key `appendReview:v1`
- **Schema:** Defined in `src/shared/schema.ts` (Zod schemas for validation)
- **Persistence:** Automatic save to localStorage on data changes

## Ports

- **Development:** http://localhost:5000 (both client and API)
- **API Endpoints:** http://localhost:5000/api/*

## Troubleshooting

### Common Issues

1. **Port already in use:**
   - Change PORT in your environment or kill the process: `lsof -ti:5000 | xargs kill`

2. **Dependencies issues:**
   - Try `make clean && make install`

3. **Data not persisting:**
   - Check browser localStorage (data stored under key `appendReview:v1`)
   - Ensure you're not in incognito/private browsing mode

4. **Performance issues with large notes:**
   - The app handles large datasets well, but browser localStorage has limits (~5-10MB)

### Getting Help

Run `make status` to check your setup status and see what might be missing.

## Features

- **Append Page:** Add new notes to your collection
- **Review Page:** Compare and rank notes using ELO algorithm
- **Ranking Page:** View your notes sorted by rating
- **Archive Page:** Manage archived notes
- **Settings:** Configure rating algorithm parameters

## Technology Stack


## Static Deployment (Cloudflare Pages / Subfolder)

You can deploy the UI as pure static files; the Express server is optional for local development convenience.

Build variants (Make targets wrap npm scripts):

```bash
# Relative asset paths (portable into any subfolder like /append/)
make build-static

# Absolute asset paths rooted at /append/
make build-subdir
```

Output directory: `src/dist/public/`

Cloudflare Pages:
1. Project root: `src`
2. Build command: `make build-static` (or `make build-subdir` if deploying strictly at /append/)
3. Output directory: `dist/public`

Existing site subfolder (e.g. https://example.com/append/):
1. Run `make build-static` (recommended for portability)
2. Copy contents of `src/dist/public/` into your site's `append/` directory
3. Link to it with `<a href="/append/">Append & Review</a>`

Configure base path:
- Default (unset): relative assets (`./`) for portability
- Set `VITE_BASE_PATH=/append/` during build for absolute subfolder references

State persists per browser via localStorage (`appendReview:v1`). No server required.
