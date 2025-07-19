#!/bin/bash

echo "🚀 Deploying Frontend to Vercel..."

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for production
echo "🔨 Building for production..."
npm run build

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
npx vercel --prod

echo "✅ Frontend deployed successfully!"
echo "🔗 Update your API URL in the Vercel dashboard or redeploy after backend is ready"