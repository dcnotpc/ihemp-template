#!/bin/bash

# Start iHemp Dashboard Development Server
# This script ensures proper Node.js version and environment setup

echo "🚀 Starting iHemp Operations Dashboard..."
echo "========================================"

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)

if [ "$NODE_MAJOR" -lt 20 ]; then
    echo "⚠️  Warning: Node.js v$NODE_VERSION detected. Next.js requires Node.js >=20.9.0"
    echo "   Current Node.js path: $(which node)"
    echo "   Consider using nvm or updating Node.js"
    echo ""
fi

# Load environment variables
if [ -f ".env.local" ]; then
    echo "📝 Loading environment from .env.local"
    export $(grep -v '^#' .env.local | xargs)
fi

# Check for required environment variables
if [ -z "$OPENCLAW_API_SECRET" ]; then
    echo "⚠️  OPENCLAW_API_SECRET not set. Some API endpoints may be restricted."
fi

# Ensure content directory exists
mkdir -p content/blog

echo ""
echo "🌿 iHemp Marketing Network Dashboard Configuration:"
echo "   • OpenClaw API: ${OPENCLAW_API_SECRET:+✅ Set}"
echo "   • Dashboard URL: http://localhost:3080/dashboard"
echo "   • API Endpoints: http://localhost:3080/api/dashboard/metrics"
echo "   • Protected Routes: /dashboard/*"
echo ""

# Start Next.js development server
echo "▶️  Starting Next.js development server on port 3080..."
echo "   (Press Ctrl+C to stop)"
echo ""

npm run dev