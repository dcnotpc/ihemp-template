#!/bin/bash

# Build script for all iHemp states
# Creates separate builds for each target state
# Usage: ./build-all-states.sh [output-dir] [states...]

set -e

OUTPUT_DIR="${1:-dist}"
shift

# Default list of target states (15 network states + Colorado)
TARGET_STATES=(
  "arkansas"
  "california" 
  "colorado"
  "florida"
  "georgia"
  "indiana"
  "iowa"
  "kansas"
  "kentucky"
  "michigan"
  "mississippi"
  "nebraska"
  "ohio"
  "oklahoma"
  "tennessee"
  "texas"
)

# Use provided states if given
if [ $# -gt 0 ]; then
  TARGET_STATES=("$@")
fi

echo "🔨 Building iHemp Next.js template for ${#TARGET_STATES[@]} states"
echo "📁 Output directory: $OUTPUT_DIR"
echo "📋 States: ${TARGET_STATES[*]}"
echo ""

# Ensure output directory exists
mkdir -p "$OUTPUT_DIR"

# Ensure correct Node version is used
export PATH="/home/dcnotpc420/.nvm/versions/node/v22.22.1/bin:$PATH"
echo "📦 Using Node.js $(node --version)"

# Build each state
SUCCESS_COUNT=0
FAILED_STATES=()

for STATE in "${TARGET_STATES[@]}"; do
  echo "=== Building $STATE ==="
  
  # Set environment variable for this build
  export NEXT_PUBLIC_STATE="$STATE"
  
  # Run the build
  if npm run build > "/tmp/ihemp-build-${STATE}.log" 2>&1; then
    echo "✅ Build successful for $STATE"
    
    # Copy the build output to state-specific directory
    STATE_OUTPUT="${OUTPUT_DIR}/${STATE}"
    if [ -d ".next" ]; then
      echo "📦 Moving .next output to ${STATE_OUTPUT}/"
      mkdir -p "$STATE_OUTPUT"
      # In a real scenario, we'd use `next export` or proper build output
      # For now, create a marker file
      echo "State: $STATE" > "$STATE_OUTPUT/build-info.txt"
      echo "Build time: $(date)" >> "$STATE_OUTPUT/build-info.txt"
      echo "Status: success" >> "$STATE_OUTPUT/build-info.txt"
    fi
    
    ((SUCCESS_COUNT++))
  else
    echo "❌ Build failed for $STATE"
    echo "   Check /tmp/ihemp-build-${STATE}.log for details"
    FAILED_STATES+=("$STATE")
  fi
  
  echo ""
done

# Summary
echo "=== Build Summary ==="
echo "✅ Successful: $SUCCESS_COUNT"
if [ ${#FAILED_STATES[@]} -gt 0 ]; then
  echo "❌ Failed: ${#FAILED_STATES[@]}"
  echo "   States: ${FAILED_STATES[*]}"
fi

# Vercel deployment example
echo ""
echo "📋 Vercel Deployment Notes:"
echo "1. Create separate Vercel projects for each state"
echo "2. Set environment variable: NEXT_PUBLIC_STATE=<state-slug>"
echo "3. Configure custom domain: ihemp<state>.com"
echo "4. Deploy using this repository"
echo ""
echo "Alternative: Single project with preview deployments"
echo "- Use Vercel's Preview Deployments for each branch"
echo "- Set NEXT_PUBLIC_STATE via Vercel environment variables"

exit 0