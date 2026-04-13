# Debug: Why Alabama Shows Colorado Data

## Problem
Live Alabama website at https://ihempalabama.com/laws shows:
- Title: "Colorado Hemp Laws" (H1 tag)
- Colorado summary text
- Colorado laws list
- Colorado regulatory body

## Investigation So Far

### 1. Code Fix Applied ✓
Updated `/src/app/laws/page.tsx` from:
```typescript
import { colorado } from '@/data/states/colorado'
const stateData = colorado
```

To:
```typescript
import { stateConfig } from '@/config/state'
import { getStateBySlug } from '@/data/states'
const stateData = getStateBySlug(stateConfig.slug)
```

### 2. Environment Variable Check ✓
Vercel API shows Alabama project has:
- `NEXT_PUBLIC_STATE: alabama` (correct)
- Type: plain, target: all environments

### 3. Configuration Logic ✓
`/src/config/state.ts` has:
```typescript
const DEFAULT_STATE = process.env.NEXT_PUBLIC_STATE || 'colorado';
export const stateConfig = createStateConfig(DEFAULT_STATE);
```

## Possible Root Causes

### A. Build Cache Issue
- Existing deployment built with old code (hardcoded Colorado)
- New Git push may not have triggered rebuild
- Cached build artifacts showing old version

### B. Environment Variable Not Applied at Build Time
- Variable exists in Vercel but not applied during build
- Build uses fallback 'colorado' instead of 'alabama'

### C. Code Not Deployed
- Git push may have failed
- Vercel build may have failed silently
- Changes not in production deployment

## Diagnostic Steps

### 1. Check Current Deployment Hash
```bash
# Compare Git commit hash with deployed version
```

### 2. Force Rebuild
```bash
# Trigger fresh deployment with environment variable check
```

### 3. Test Build Locally
```bash
NEXT_PUBLIC_STATE=alabama npm run build
```

## Immediate Solution

Since 16/17 sites are live and mostly working, push a small change to `package.json` to force all 17 sites to rebuild with the corrected code:

```bash
# Add a version bump
echo \"  \"version\": \"1.0.1\",\" >> package.json
git add package.json
git commit -m \"Bump version to trigger rebuild\"
git push origin main
```

This will:
1. Trigger fresh Vercel builds for all 17 projects
2. Apply environment variables at build time
3. Use corrected dynamic state logic
4. Show Alabama data on Alabama site

## Alternative: Fix via Vercel CLI
```bash
vercel env add NEXT_PUBLIC_STATE alabama -p ihemp-alabama --force
vercel redeploy ihemp-alabama
```

## Verification After Fix
Test that Alabama shows correct data:
1. `https://ihempalabama.com/laws` shows "Alabama Hemp Laws"
2. Summary mentions Alabama, not Colorado
3. Laws list includes Alabama legislation
4. Regulatory body is Alabama Department of Agriculture