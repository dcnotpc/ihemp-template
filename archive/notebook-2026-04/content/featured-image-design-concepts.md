# Featured Image Design Concepts for iHemp Blog Posts

## Overview
Create unique, non-AI looking featured images for each state-specific hemp blog post. Images should be simple, engaging, and consistent with iHemp brand identity.

## Brand Colors Reference
  - **Primary Green**: `#2D5A27` (hemp-green from tailwind.config.ts)
  - **Cream/White**: `#FFFEF2` or `#F5F5DC` (assumed from logo cream backgrounds)
  - **Accent**: Could use state flag colors or complementary tones

## Design Concept Options

### Option 1: Diagonal Split with Logo
**Layout:**
- Diagonal line from top-left to bottom-right
- Left side: Solid hemp-green background
- Right side: Subtle texture or gradient (lighter green to cream)
- State logo positioned on diagonal line intersection
- Minimal text overlay: "HEMP" in large font, state abbreviation smaller

**Dimensions:** 1200×630px (social media optimized)
**Example for Arkansas:**
- Background: Diagonal split #2D5A27 / #E8F5E8
- Logo: ihemp-arkansas-logo-cream.webp centered
- Text: "HEMP" in cream, "AR" in smaller size below

### Option 2: Minimalist Badge Style  
**Layout:**
- Circular or rounded rectangle badge centered
- Solid hemp-green background with subtle pattern
- State logo in center with glow/outline
- Thin border in complementary color
- Clean, no text overlays

**Dimensions:** 1200×630px
**Example:**
- Background: #2D5A27 with subtle hemp leaf pattern (5% opacity)
- Circular badge with Arkansas logo
- Thin cream border

### Option 3: Landscape Banner with Typography
**Layout:**
- Horizontal gradient: dark green → light green
- State logo left-aligned
- Right side: "HEMP [State Name]" in bold typography
- Optional: Subtle hemp leaf silhouette in background

**Dimensions:** 1200×400px (blog header optimized)
**Example:**
- Gradient: #2D5A27 → #4A7C42
- Arkansas logo left
- "HEMP ARKANSAS" right in cream color

### Option 4: Geometric Pattern with Logo Cutout
**Layout:**
- Geometric pattern background (hexagons, triangles)
- Cutout shape containing state logo
- Pattern colors: various greens (dark to light)
- Logo appears to be "placed on" the pattern

**Dimensions:** 1200×630px
**Example:**
- Hexagon pattern in 4 shades of green
- Circular cutout center with Arkansas logo
- Shadow effect for depth

## Technical Specifications

### File Format
- **Primary:** WebP (as existing assets)
- **Fallback:** JPG/PNG if needed
- **Size:** 1200×630px (Facebook/Twitter optimized)
- **Quality:** 85-90% compression

### Naming Convention
```
featured-arkansas-2026-hemp-industry.webp
featured-california-2026-regulatory-guide.webp
```

### Storage Location
```
/public/images/featured/
  /featured-arkansas-2026-hemp-industry.webp
  /featured-california-2026-regulatory-guide.webp
```

## Generation Methods

### Option A: Programmatic (Canvas/Node.js)
- Use `canvas` library to generate images
- Templates with dynamic text/logo placement
- Consistent across all states

### Option B: Agent + Design Tool
- AI agent describes design to human designer
- Manual creation in Figma/Photoshop
- Higher quality, more control

### Option C: Template System
- Create 3-4 templates in design software
- Batch process with state logos
- Semi-automated but consistent

## Recommended Approach

**Phase 1 (Immediate):** Create simple Option 1 (Diagonal Split) for Arkansas and California
**Phase 2 (Scale):** Build programmatic generator for all 15 target states
**Phase 3 (Refine):** Add variations based on post type/topic

## Agent Task Description

**Agent Name:** "featured-image-generator"
**Role:** Create unique featured images for blog posts
**Inputs:**
- State slug (e.g., "arkansas")
- State logo path (e.g., "/public/images/ihemp-arkansas-logo-cream.webp")
- Post title/slug for naming
- Design template choice

**Outputs:**
- Generated WebP image in `/public/images/featured/`
- Return path for frontmatter inclusion

**Constraints:**
- No AI-generated imagery (use programmatic designs)
- Consistent with iHemp brand colors
- Mobile-responsive dimensions
- Fast generation (<30 seconds per image)

## Next Steps
1. Choose preferred design concept
2. Create agent implementation
3. Generate Arkansas and California images
4. Test in blog layout
5. Scale to all target states