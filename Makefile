# Append Review Project Makefile
# This Makefile helps you set up and run the project locally

.PHONY: help install dev build start clean db-push db-setup check env-example build-static build-subdir 

# Default target
help: ## Show this help message
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

# Environment setup
env-example: ## Create example environment file
	@echo "Creating .env.example file..."
	@echo "# Application Configuration" > src/.env.example
	@echo "NODE_ENV=development" >> src/.env.example
	@echo "PORT=5000" >> src/.env.example
	@echo "" >> src/.env.example
	@echo "# Optional: Add any environment variables your app needs for future features" >> src/.env.example
	@echo "# Currently the app uses localStorage only and doesn't require any environment variables" >> src/.env.example
	@echo "✅ Created src/.env.example"
	@echo "ℹ️  This app uses localStorage only - no database required"

# Installation
install: ## Install all dependencies
	@echo "Installing dependencies..."
	@cd src && npm install
	@echo "✅ Dependencies installed"

# Development
dev: ## Start development server (client + server)
	@echo "Starting development server..."
	@echo "🚀 Client will be available at http://localhost:5000"
	@echo "📡 API will be available at http://localhost:5000/api"
	@cd src && npm run dev

# Build
build: ## Build the application for production
	@echo "Building application..."
	@cd src && npm run build
	@echo "✅ Build completed"

# Static builds (no Node server needed)
build-static: ## Build static bundle with relative asset paths (portable)
	@echo "Building static (relative paths)..."
	@cd src && npm run build:static
	@echo "✅ Static build (relative) at src/dist/public"

build-subdir: ## Build static bundle for /append/ subfolder (absolute /append/ base)
	@echo "Building static for subfolder /append/..."
	@cd src && npm run build:subdir
	@echo "✅ Subfolder build at src/dist/public (base=/append/)"

# Production start
start: ## Start production server
	@echo "Starting production server..."
	@cd src && npm run start

# Database operations (not used - app uses localStorage)
db-info: ## Show info about data storage
	@echo "ℹ️  This app uses localStorage for data persistence"
	@echo "� Data is stored in browser localStorage under key: appendReview:v1"
	@echo "🔄 No database setup required"

# Type checking
check: ## Run TypeScript type checking
	@echo "Running TypeScript type checking..."
	@cd src && npm run check
	@echo "✅ Type checking completed"

# Cleanup
clean: ## Clean build artifacts and node_modules
	@echo "Cleaning build artifacts..."
	@cd src && rm -rf dist/
	@cd src && rm -rf node_modules/
	@echo "✅ Cleanup completed"

# Quick setup for new developers
setup: ## Complete setup for new developers
	@echo "🚀 Setting up Append Review project..."
	@echo ""
	@echo "Step 1: Installing dependencies..."
	@$(MAKE) install
	@echo ""
	@echo "Step 2: Type checking..."
	@$(MAKE) check
	@echo ""
	@echo "🎉 Setup completed!"
	@echo ""
	@echo "ℹ️  This app uses localStorage - no database setup required"
	@echo "🚀 Run 'make dev' to start the development server"
	@echo ""

# Full development workflow  
full-setup: setup ## Complete setup (same as setup - no database needed)
	@echo "🎉 Full setup completed! You can now run 'make dev' to start developing."

# Quick development start
quick-start: ## Quick start for existing setup
	@echo "🚀 Quick starting development server..."
	@if [ ! -d src/node_modules ]; then \
		echo "📦 Installing dependencies..."; \
		$(MAKE) install; \
	fi
	@$(MAKE) dev

# Useful development commands
logs: ## Show recent logs (if you have a log file)
	@echo "Recent logs would go here (implement based on your logging setup)"

status: ## Show project status
	@echo "Project Status:"
	@echo "==============="
	@if [ -d src/node_modules ]; then echo "✅ Dependencies installed"; else echo "❌ Dependencies not installed"; fi
	@if [ -d src/dist ]; then echo "✅ Build artifacts exist"; else echo "ℹ️  No build artifacts (run 'make build')"; fi
	@echo "✅ Uses localStorage - no database required"
	@echo ""
	@echo "To get started:"
	@echo "- New setup: make setup"
	@echo "- Start development: make dev"
	@echo "- Build for production: make build"
