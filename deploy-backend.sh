#!/bin/bash

echo "🚀 Deploying Backend to Fly.io..."

# Install Fly CLI if not installed
if ! command -v fly &> /dev/null; then
    echo "📥 Installing Fly CLI..."
    curl -L https://fly.io/install.sh | sh
    export PATH="$HOME/.fly/bin:$PATH"
fi

# Login to Fly.io
echo "🔐 Please login to Fly.io..."
fly auth login

# Create app if it doesn't exist
echo "🆕 Creating Fly.io app..."
fly apps create justsploit-api-$(date +%s) || true

# Set secrets (you'll need to replace these values)
echo "🔑 Setting environment variables..."
echo "Please set these secrets manually:"
echo "fly secrets set DATABASE_URL='your-supabase-connection-string'"
echo "fly secrets set SECRET_KEY='$(openssl rand -hex 32)'"
echo "fly secrets set REPLICATE_API_TOKEN='your-replicate-token'"
echo "fly secrets set CELERY_BROKER_URL='memory://'"
echo "fly secrets set CELERY_RESULT_BACKEND='memory://'"

# Deploy
echo "🚀 Deploying to Fly.io..."
fly deploy --dockerfile backend/Dockerfile.production

echo "✅ Backend deployed successfully!"
echo "🔗 Your API URL: https://your-app-name.fly.dev"