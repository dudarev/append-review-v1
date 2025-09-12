# Overview

This is a note-taking and ranking application built with React and Express. The app allows users to write markdown content, parse it into individual notes, and then use a pairwise comparison system with Elo ratings to rank notes by importance or quality. The application features four main views: an Append page for writing markdown content, a Review page for comparing note pairs, a Ranking page for viewing sorted results, and an Archive page for managing archived notes.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The frontend uses React with TypeScript in a single-page application structure. The application follows a component-based architecture with:

- **State Management**: Custom hooks (like `useNotes`) manage application state without external state management libraries
- **UI Components**: Built with Radix UI primitives and styled with Tailwind CSS using the shadcn/ui design system
- **Routing**: Client-side routing with four main views (Append, Review, Ranking, Archive) managed through component state
- **Data Storage**: Browser localStorage for persistence, with a schema-based approach using Zod for validation
- **Theming**: Dark/light theme support with CSS custom properties
- **Archive System**: Notes can be archived to remove them from rankings while preserving their data

## Backend Architecture
The backend uses Express.js with TypeScript in a minimal setup for local development and optional static serving:

- **Server Framework**: Express with middleware for JSON parsing and request logging
- **Data Layer**: No backend database — app state persists in browser localStorage; server mainly serves the client and dev tooling
- **Route Structure**: Placeholder routes under `/api` (no persistence)
- **Development Setup**: Vite integration for development with Hot Module Replacement (HMR)

## Core Features
- **Markdown Parsing**: Converts markdown content into individual notes with intelligent parsing logic
- **Elo Rating System**: Implements pairwise comparison with Elo algorithm for note ranking
- **Pair Selection**: Smart algorithm for selecting note pairs based on recency, vote count, and randomization
- **Archive Management**: Archive notes to remove from rankings while preserving data and statistics
- **Mobile Responsive**: Dedicated mobile navigation and responsive design
- **Keyboard Shortcuts**: Extensive keyboard shortcuts for efficient navigation and voting

## Data Models
The application uses Zod schemas for type-safe data validation:

- **Note Schema**: Individual notes with text, rating, wins/losses, timestamps, and optional archive date
- **Settings Schema**: Configurable parameters for Elo algorithm and pair selection
- **App Data Schema**: Top-level container for all application data including active notes, archived notes, version and metadata

## Development Tools
- **Build System**: Vite for fast development and optimized production builds
- **Type Safety**: Full TypeScript coverage with strict configuration
- **Code Quality**: ESBuild for server-side bundling, PostCSS for style processing
- **Development Experience**: Replit integration with error overlay and cartographer plugins

# External Dependencies

## UI Framework
- **React**: Core frontend framework with hooks-based architecture
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Modern icon library for consistent iconography

## Utilities
- **TanStack Query**: Data fetching and caching (may be unused in v1)
- **React Hook Form**: Form handling with Zod integration
- **date-fns**: Date manipulation and formatting
- **uuid**: Unique identifier generation
- **DOMPurify**: HTML sanitization for security
- **clsx/cn**: Conditional CSS class utilities

## Development Dependencies
- **Vite**: Build tool with React plugin and runtime error overlay
- **TypeScript**: Static type checking with strict configuration
- **ESBuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution for development server
