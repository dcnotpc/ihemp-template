# iHemp Network - Design System

## Tech Stack
- Framework: Next.js 14+ (App Router)
- Hosting: Vercel
- Styling: Tailwind CSS
- Blog: MDX files in repo
- CMS: Git-based
- Ads: Google AdSense component
- Affiliates: Amazon Associates auto-link component

## Base Color Palette
- Primary Green: #2D5A27
- Dark Green: #1A3A19
- Light Green: #E8F5E3
- Earth Brown: #8B6914
- Cream: #FAF8F0
- Text Dark: #1A1A1A
- Text Light: #F5F5F5

## State Accent Colors
- Michigan: #00274C
- Ohio: #BB0000
- Indiana: #002B5C
- Illinois: #FF6F00
- Kentucky: #0033A0
- Tennessee: #FF8200
- Wisconsin: #C5050C
- Pennsylvania: #002244

## Typography
- Headings: Inter (bold)
- Body: Inter (regular)
- Scale: 16px base, 1.5 line height

## Layout
- Mobile-first responsive
- Max content width: 768px
- Sidebar for ads on desktop
- Sticky nav with state branding
- Footer: affiliate disclosures, network links

## AI Agent Integration
- /content/ directory: Agents push MDX blog posts
- /data/affiliates.json: Amazon links managed by agents
- /data/ads.json: Ad placements managed by agents
- GitHub Actions: Auto-deploy on content push
- API routes: Webhook endpoints for agent triggers

## Google AdSense Placement
- Top banner (728x90)
- In-article after paragraph 3
- Sidebar rectangle (300x250)
- Bottom of article (responsive)

## Amazon Affiliate Strategy
- Auto-link component tags product mentions
- Product review cards with affiliate links
- State-specific product recommendations
