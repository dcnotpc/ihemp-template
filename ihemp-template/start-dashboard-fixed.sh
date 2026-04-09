#!/bin/bash

# Start iHemp Dashboard with correct Node.js version
# Force use of nvm Node.js v22.22.1

echo "🚀 Starting iHemp Dashboard (Node.js v22.22.1)..."

# Kill any existing dashboard process
pkill -f "next.*3080" 2>/dev/null || true

# Set up environment for nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node.js v22.22.1
nvm use 22.22.1 2>/dev/null || nvm use 22 2>/dev/null

# Set PATH to use nvm's node
export PATH="$HOME/.nvm/versions/node/v22.22.1/bin:$PATH"

echo "📊 Node.js version: $(node --version)"
echo "📦 Next.js version: $(npx next --version 2>/dev/null || echo 'Checking...')"
echo ""
echo "🌿 Dashboard URL: http://localhost:3080/dashboard"
echo "🔐 Protected by: OPENCLAW_API_SECRET"
echo ""

# Start the dashboard
npx next dev -p 3080