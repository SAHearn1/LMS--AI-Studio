#!/bin/bash

echo "🚀 Setting up Root Work Framework LMS development environment..."

# Check prerequisites
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v pnpm >/dev/null 2>&1 || { echo "❌ pnpm is required but not installed. Run: npm install -g pnpm" >&2; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting." >&2; exit 1; }

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose -f docker/development/docker-compose.yml up -d

# Wait for PostgreSQL
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Generate Prisma client
echo "🔨 Generating Prisma client..."
pnpm db:generate

# Run migrations
echo "🗃️  Running database migrations..."
pnpm db:push

# Seed database
echo "🌱 Seeding database..."
pnpm db:seed

echo "✅ Setup complete!"
echo "📚 Run 'pnpm dev' to start development servers"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001"
echo "📖 API Docs: http://localhost:3001/api/docs"
echo "📧 MailHog: http://localhost:8025"
