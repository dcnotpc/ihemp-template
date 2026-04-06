# iHemp Next.js Template — Multi-State Deployment Guide

This Next.js template is configured for dynamic deployment across all 50 US states. Each state gets a customized website with state-specific content, branding, and domain.

## Architecture Overview

### Core Components
1. **State Data**: `src/data/states/` — 50 `.ts` files, one per state
2. **Dynamic Configuration**: `src/config/state.ts` — Loads state-specific config based on `NEXT_PUBLIC_STATE`
3. **Type Safety**: `src/config/types.ts` — TypeScript interfaces for configuration
4. **Components**: All components reference `stateConfig` for dynamic content

### How It Works
- Environment variable `NEXT_PUBLIC_STATE` determines which state to build
- At build time, `createStateConfig()` loads the corresponding state data
- All UI components (Header, Footer, Hero, etc.) render state-specific content
- CSS uses Tailwind with hemp-themed colors (`hemp-green`, `hemp-cream`, `hemp-brown`)

## Deployment Models

### Option A: Separate Vercel Projects (Recommended)
**For iHemp's 18 current states:**
1. Create 18 separate Vercel projects
2. Each project has environment variable: `NEXT_PUBLIC_STATE=<state-slug>`
3. Connect custom domain: `ihemp<state>.com`
4. Deploy from this repository

**Advantages:**
- Complete isolation between states
- Independent scaling and billing
- Separate analytics and logs
- No cross-state contamination
- Matches existing WordPress model

### Option B: Single Vercel Project with Preview Deployments
1. Single Vercel project
2. Branch-based deployments: `feature/colorado`, `feature/kentucky`, etc.
3. Vercel Preview Deployments for each branch
4. Environment variables set per branch in Vercel UI

**Advantages:**
- Single codebase management
- Easier shared component updates
- Consolidated analytics (if needed)

## State Data Structure

Each state file (`src/data/states/<state-slug>.ts`) contains:
```typescript
export const stateSlug: State = {
  name: 'State Name',
  slug: 'state-slug',
  abbreviation: 'XX',
  status: 'legal' | 'pending' | 'restricted',
  summary: 'Detailed regulatory summary...',
  thcLimit: '0.3% total THC on dry-weight basis',
  laws: [{ title: 'Law Title', url: '...', year: 2023 }],
  resources: [{ label: 'Resource', url: '...' }],
  regulatoryBody: 'State Department of Agriculture',
  regulatoryUrl: 'https://...',
  licensingInfo: 'Detailed licensing requirements...',
  notes: 'Additional compliance notes...',
  lastUpdated: '2026-04-06'
}
```

## Dynamic Configuration

The config system (`src/config/state.ts`) generates:
- **Domain**: `ihemp<state>.com` (e.g., `ihempcolorado.com`)
- **Logo path**: `/images/ihemp-<state>-logo-cream.webp`
- **Tagline**: "Your {State} Hemp Law Guide"
- **Site name**: `iHemp {State}`
- **Descriptions**: State-specific meta descriptions and page content
- **Resources**: State legislature, hemp program, and regulatory URLs
- **Network states**: List of partner states for footer navigation

## Build & Deployment Scripts

### Individual State Builds
```bash
# Build Colorado
NEXT_PUBLIC_STATE=colorado npm run build

# Build Kentucky  
NEXT_PUBLIC_STATE=kentucky npm run build

# Build Texas
NEXT_PUBLIC_STATE=texas npm run build
```

### Batch Build All States
```bash
chmod +x build-all-states.sh
./build-all-states.sh dist
```

This creates build artifacts for all target states in `dist/` directory.

### Package Scripts
```json
{
  "build:colorado": "NEXT_PUBLIC_STATE=colorado npm run build",
  "build:kentucky": "NEXT_PUBLIC_STATE=kentucky npm run build", 
  "build:texas": "NEXT_PUBLIC_STATE=texas npm run build",
  "build:all": "./build-all-states.sh dist",
  "test:states": "npx tsx test-dynamic.ts"
}
```

## Vercel Setup Instructions

### For Each State Project:
1. **Import repository** to Vercel
2. **Environment Variables**:
   ```
   NEXT_PUBLIC_STATE=colorado
   ```
3. **Build Command**: `npm run build`
4. **Output Directory**: `.next`
5. **Custom Domain**: `ihempcolorado.com` (configure in Vercel Domains)

### Deployment Pipeline:
```
GitHub Push → Vercel Build → State-specific Website
```

## Content Management

### Adding/Updating State Data
1. Edit the state file in `src/data/states/`
2. Update `lastUpdated` field
3. Deploy affected states

### Adding New States
1. Create `src/data/states/<new-state>.ts`
2. Add to `src/data/states/index.ts` imports and exports
3. Update network states list in `src/config/state.ts` if needed
4. Create state-specific logo in `/public/images/`
5. Deploy new Vercel project

### Logo Requirements
- File name: `ihemp-<state>-logo-cream.webp`
- Location: `/public/images/`
- Theme: Cream/white logo on transparent background
- Dimensions: Optimized for web (max 500px width)

## Compliance Notes

⚠️ **Important for iHemp Compliance**:
- All content must follow FDA/FTC guidelines
- No health claims about CBD products
- State-specific regulations must be verified
- Content assembly line process applies:
  - Research → Content → SEO → Compliance → QA → Publish
- CEO approval required for all public content

## Testing

### Configuration Tests
```bash
npm run test:states
```

Tests that state config loads correctly for multiple states.

### Build Tests
```bash
# Test Colorado build
npm run build:colorado

# Test Kentucky build  
npm run build:kentucky
```

## Troubleshooting

### TypeScript Errors
If you see `Type 'string | undefined' is not assignable to type 'string'`:
- Check state data files for missing required fields
- All states must have: `name`, `slug`, `abbreviation`

### Build Failures
1. Check `NEXT_PUBLIC_STATE` environment variable is set
2. Verify state file exists in `src/data/states/`
3. Ensure Node.js v22.22.1+ is used
4. Check syntax in state data files

### Logo Issues
If logo doesn't load:
- Check file exists in `/public/images/`
- Verify filename matches: `ihemp-<state>-logo-cream.webp`
- Check logo path in rendered HTML

## Future Enhancements

1. **CMS Integration**: Contentful or Sanity for state data
2. **Automated Updates**: Script to pull state regulation updates
3. **Analytics Dashboard**: Consolidated metrics across all states
4. **Shared Component Library**: NPM package for common components
5. **CDN for Images**: Cloudinary or similar for logo/images

## Support

For iHemp-specific issues:
- Contact: David Alan Crabill (CEO)
- Compliance questions: Flag immediately
- Technical issues: Open GitHub issue

---

**Last Updated**: 2026-04-06  
**Next.js Version**: 16.2.1  
**Node.js Required**: ≥20.9.0  
**Recommended**: v22.22.1 (via nvm)