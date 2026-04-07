# Vercel Setup Guide for 16 iHemp State Websites

## Overview
Deploy 16 separate state websites (one per domain) on Vercel's free Hobby tier, with DNS pointing from your cPanel.

## Step 0: Prerequisites
1. **GitHub repository**: `https://github.com/dcnotpc/ihemp-template`
2. **Vercel account**: Sign up at [vercel.com](https://vercel.com) (free)
3. **16 domains** ready in cPanel (see list below)
4. **GitHub authentication** for Vercel

## Step 1: Initial Site Setup (Colorado First)
1. Log into Vercel
2. Click "Add New" → "Project"
3. Import from GitHub: `dcnotpc/ihemp-template`
4. **Project Name**: `ihemp-colorado`
5. **Framework Preset**: Next.js (auto-detected)
6. **Build & Output Settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm ci`
7. **Environment Variables**:
   - Add: `NEXT_PUBLIC_STATE` = `colorado`
8. Click "Deploy"

## Step 2: Custom Domain Setup (Colorado)
After deployment:
1. Go to Project → Settings → Domains
2. Add Domain: `ihempcolorado.com`
3. Vercel will show DNS records needed
4. **Take note of**:
   - `A` record: `76.76.21.21` (or similar)
   - `CNAME` record: `cname.vercel-dns.com`

## Step 3: DNS Configuration (in cPanel)
For each domain:
1. Log into cPanel
2. Go to **Zone Editor** or **DNS Management**
3. Update/Add records:
   - **Remove existing** `A` record for root domain (@)
   - **Add new** `A` record:
     - Name: `@`
     - TTL: `14400`
     - Points to: `76.76.21.21` (Vercel's IP)
   - **Optional**: Add `www` CNAME if desired
4. Save changes

**DNS propagation**: 5-60 minutes

## Step 4: Repeat for 15 More States
For each state, create a NEW Vercel project:

### Quick Reference Table
| State | Vercel Project Name | Environment Variable | Domain |
|-------|---------------------|----------------------|---------|
| Colorado | `ihemp-colorado` | `colorado` | ihempcolorado.com |
| Arkansas | `ihemp-arkansas` | `arkansas` | ihemparkansas.com |
| California | `ihemp-california` | `california` | ihempcalifornia.com |
| Florida | `ihemp-florida` | `florida` | ihempflorida.com |
| Georgia | `ihemp-georgia` | `georgia` | ihempgeorgia.com |
| Indiana | `ihemp-indiana` | `indiana` | ihempindiana.com |
| Iowa | `ihemp-iowa` | `iowa` | ihempiowa.com |
| Kansas | `ihemp-kansas` | `kansas` | ihempkansas.com |
| Kentucky | `ihemp-kentucky` | `kentucky` | ihempkentucky.com |
| Michigan | `ihemp-michigan` | `michigan` | ihempmi.com |
| Mississippi | `ihemp-mississippi` | `mississippi` | ihempmississippi.com |
| Nebraska | `ihemp-nebraska` | `nebraska` | ihempnebraska.com |
| Ohio | `ihemp-ohio` | `ohio` | ihempohio.com |
| Oklahoma | `ihemp-oklahoma` | `oklahoma` | ihempoklahoma.com |
| Tennessee | `ihemp-tennessee` | `tennessee` | ihemptennessee.com |
| Texas | `ihemp-texas` | `texas` | ihemptexas.com |

**Note**: Use exact lowercase state slugs as shown.

## Step 5: Batch Processing Script
For faster setup, use this script after initial Colorado deployment:

```bash
#!/bin/bash
# Create vercel.json templates for each state

STATES=(
  "arkansas:arkansas:ihemparkansas.com"
  "california:california:ihempcalifornia.com"
  "florida:florida:ihempflorida.com"
  "georgia:georgia:ihempgeorgia.com"
  "indiana:indiana:ihempindiana.com"
  "iowa:iowa:ihempiowa.com"
  "kansas:kansas:ihempkansas.com"
  "kentucky:kentucky:ihempkentucky.com"
  "michigan:michigan:ihempmi.com"
  "mississippi:mississippi:ihempmississippi.com"
  "nebraska:nebraska:ihempnebraska.com"
  "ohio:ohio:ihempohio.com"
  "oklahoma:oklahoma:ihempoklahoma.com"
  "tennessee:tennessee:ihemptennessee.com"
  "texas:texas:ihemptexas.com"
)

for state in "${STATES[@]}"; do
  IFS=':' read -r slug name domain <<< "$state"
  
  # Create project directory structure (optional)
  mkdir -p "deploy/$slug"
  
  # Create vercel.json for this state
  cat > "deploy/$slug/vercel.json" << EOF
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next",
      "config": {
        "installCommand": "npm ci",
        "buildCommand": "npm run build",
        "outputDirectory": ".next",
        "nodeVersion": "22.x"
      }
    }
  ],
  "env": {
    "NEXT_PUBLIC_STATE": "$slug"
  }
}
EOF
  
  echo "Created config for $name ($domain)"
done
```

## Step 6: DNS Propagation Check
After all DNS updates, verify:
```bash
# Check DNS resolution
dig ihempcolorado.com +short
dig ihemparkansas.com +short
# Should show Vercel IPs

# Check SSL certificate
curl -I https://ihempcolorado.com
# Should show valid certificate
```

## Step 7: Post-Deployment Verification
1. Visit each site: `https://ihempcolorado.com`, etc.
2. Check for broken links using: `npm run lint` locally
3. Test responsive design on mobile/desktop
4. Verify logos load correctly

## Estimated Timeline
- **Initial setup**: 30 minutes (Colorado)
- **Additional 15 sites**: 1-2 hours (batch processing)
- **DNS propagation**: 5-60 minutes
- **SSL certificates**: Auto-provisioned (~5 minutes)

## Cost Breakdown
- **Vercel**: $0 (Hobby tier, 16 projects)
- **Domains**: Already owned
- **cPanel**: Already paid for email services
- **Total**: $0/month

## Notes
1. **Email remains on cPanel** - DNS changes won't affect email if MX records stay
2. **Automatic SSL** - Vercel provides free SSL certificates
3. **Automatic deployments** - Push to GitHub → Vercel rebuilds
4. **Bandwidth limits**: 100GB/month free (plenty for educational sites)

## Troubleshooting
- **DNS not propagating**: Wait 1 hour, check at [dnschecker.org](https://dnschecker.org)
- **Build fails**: Check Node version (needs 20+)
- **Logo missing**: Verify file path: `/public/images/ihemp-{state}-logo-cream.webp`
- **State data missing**: Check `src/data/states/{state}.ts` exists

---

**Next Steps**:
1. Create Vercel account
2. Deploy Colorado first (test)
3. Update DNS for one domain
4. Verify SSL and site functionality
5. Scale to remaining 15 states

Estimated total time: **2-3 hours** for all 16 sites.