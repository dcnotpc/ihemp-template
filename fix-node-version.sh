#!/bin/bash
# Switch to Node.js v22.22.1 for iHemp Dashboard

echo "=== iHemp Dashboard Node.js Version Fix ==="

# Source nvm
if [ -s "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
    echo "✓ Loaded nvm"
else
    echo "✗ nvm not found at $HOME/.nvm/nvm.sh"
    exit 1
fi

# Check current Node.js version
echo "Current Node.js version: $(node --version)"

# List available versions
echo -e "\nAvailable Node.js versions:"
nvm list

# Use v22.22.1
echo -e "\nSwitching to Node.js v22.22.1..."
nvm use v22.22.1

# Verify switch
echo -e "\nNew Node.js version: $(node --version)"
echo "Which node: $(which node)"

# Check Next.js compatibility
echo -e "\nChecking Next.js compatibility..."
NODE_MAJOR=$(node --version | cut -d. -f1 | tr -d 'v')
if [ "$NODE_MAJOR" -ge 20 ]; then
    echo "✓ Node.js v$NODE_MAJOR.x is compatible with Next.js (requires >=20.9.0)"
else
    echo "✗ Node.js v$NODE_MAJOR.x is NOT compatible with Next.js (requires >=20.9.0)"
fi

# Test building the dashboard
echo -e "\nTesting dashboard build..."
cd /home/dcnotpc420/.openclaw/workspace/ihemp-template

echo "Cleaning cache..."
rm -rf .next
rm -rf node_modules/.cache

echo "Installing dependencies (if needed)..."
npm ci --silent 2>&1 | tail -20

echo "Attempting build..."
if npm run build 2>&1 | tail -50; then
    echo -e "\n✓ Build successful!"
    echo -e "\nDashboard can now be built and deployed."
    echo "To start development server:"
    echo "  cd /home/dcnotpc420/.openclaw/workspace/ihemp-template"
    echo "  npm run dev"
else
    echo -e "\n✗ Build failed. Check errors above."
fi

# Set as default for future shells
echo -e "\nSetting v22.22.1 as default Node.js version..."
nvm alias default v22.22.1

echo -e "\n=== Complete ==="
echo "To use this Node.js version in current shell, run:"
echo "  source ~/.bashrc"
echo "  nvm use v22.22.1"
echo ""
echo "Or open a new terminal."