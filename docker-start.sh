#!/bin/bash

echo "🚀 Starting JustSploit with Docker..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "📝 Please copy .env.example to .env and configure your settings:"
    echo "   cp .env.example .env"
    echo "   nano .env"
    exit 1
fi

# Check if REPLICATE_API_TOKEN is set
if ! grep -q "REPLICATE_API_TOKEN=.*[^[:space:]]" .env; then
    echo "⚠️  REPLICATE_API_TOKEN is not set in .env file"
    echo "🔑 Please get your token from: https://replicate.com/account/api-tokens"
    echo "📝 And add it to your .env file"
fi

# Build and start services
echo "🔨 Building Docker images..."
docker-compose build

echo "🚀 Starting services..."
docker-compose up -d

echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo ""
    echo "✅ JustSploit Backend is now running!"
    echo ""
    echo "🔧 Backend API: http://localhost:8000"
    echo "📊 API Docs: http://localhost:8000/docs"
    echo ""
    echo "💡 To start frontend:"
    echo "   cd frontend && npm run dev"
    echo ""
    echo "📝 To view logs: docker-compose logs -f"
    echo "🛑 To stop: docker-compose down"
else
    echo "❌ Failed to start services. Check logs with: docker-compose logs"
fi