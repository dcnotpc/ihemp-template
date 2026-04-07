# Vercel 16-State Deployment Checklist

## ✅ Current Status
- [x] GitHub repository: `dcnotpc/ihemp-template`
- [x] 51 state data files complete
- [x] 16 priority state logos ready
- [x] Colorado Vercel project created (according to Dave)
- [ ] Colorado domain connected (ihempcolorado.com)
- [ ] DNS updated for Colorado
- [ ] 15 more Vercel projects to create

## 🔧 Colorado Verification Steps (Do These First)

### 1. Confirm Colorado Vercel Project
```bash
# Check if you can access:
# https://vercel.com/projects/ihemp-colorado
```
Should show:
- ✅ Domain: ihempcolorado.com (or .vercel.app)
- ✅ Latest commit: b52a76f (state data updates)
- ✅ Deployment status: Live/Ready

### 2. Check DNS Configuration (cPanel)
Log into cPanel → Zone Editor → ihempcolorado.com:
- **A record (@)** should point to: `76.76.21.21` (or Vercel's IP)
- **CNAME (www)** optional
- **MX records** remain untouched for email

### 3. Test Live Site
```bash
# Quick test from browser
https://ihempcolorado.com
```
Should show:
- ✅ Colorado logo and branding
- ✅ Working navigation (Home, Blog, Laws, Resources)
- ✅ State-specific content

## 🚀 Phase 1: Complete Colorado Setup

### Step 1: Add Custom Domain in Vercel
1. Go to Vercel Dashboard → ihemp-colorado project → Settings → Domains
2. Add Domain: `ihempcolorado.com`
3. Vercel shows DNS records to add (if not already done)

### Step 2: Verify SSL Certificate
Wait 5-10 minutes after DNS update, then:
```bash
curl -I https://ihempcolorado.com
# Should show valid SSL certificate
```

### Step 3: Test Full Functionality
- [ ] Homepage loads with Colorado content
- [ ] Navigation works
- [ ] Blog section loads
- [ ] Resources page shows Colorado-specific links
- [ ] Network states in footer show correct URLs

## 📋 Phase 2: 15 Remaining States (Batch Process)

### Quick Reference Table
| State | Vercel Project Name | Domain | Environment Variable |
|-------|---------------------|---------|----------------------|
| Arkansas | `ihemp-arkansas` | ihemparkansas.com | `NEXT_PUBLIC_STATE=arkansas` |
| California | `ihemp-california` | ihempcalifornia.com | `NEXT_PUBLIC_STATE=california` |
| Florida | `ihemp-florida` | ihempflorida.com | `NEXT_PUBLIC_STATE=florida` |
| Georgia | `ihemp-georgia` | ihempgeorgia.com | `NEXT_PUBLIC_STATE=georgia` |
| Indiana | `ihemp-indiana` | ihempindiana.com | `NEXT_PUBLIC_STATE=indiana` |
| Iowa | `ihemp-iowa` | ihempiowa.com | `NEXT_PUBLIC_STATE=iowa` |
| Kansas | `ihemp-kansas` | ihempkansas.com | `NEXT_PUBLIC_STATE=kansas` |
| Kentucky | `ihemp-kentucky` | ihempkentucky.com | `NEXT_PUBLIC_STATE=kentucky` |
| Michigan | `ihemp-michigan` | ihempmi.com | `NEXT_PUBLIC_STATE=michigan` |
| Mississippi | `ihemp-mississippi` | ihempmississippi.com | `NEXT_PUBLIC_STATE=mississippi` |
| Nebraska | `ihemp-nebraska` | ihempnebraska.com | `NEXT_PUBLIC_STATE=nebraska` |
| Ohio | `ihemp-ohio` | ihempohio.com | `NEXT_PUBLIC_STATE=ohio` |
| Oklahoma | `ihemp-oklahoma` | ihempoklahoma.com | `NEXT_PUBLIC_STATE=oklahoma` |
| Tennessee | `ihemp-tennessee` | ihemptennessee.com | `NEXT_PUBLIC_STATE=tennessee` |
| Texas | `ihemp-texas` | ihemptexas.com | `NEXT_PUBLIC_STATE=texas` |

### Batch Creation Script
Create this script to semi-automate the process:
```bash
#!/bin/bash
# generate-vercel-projects.sh

STATES=(
  "arkansas"
  "california"
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

echo "Manual steps for each state:"
echo "1. Go to Vercel dashboard"
echo "2. Click 'Add New' → 'Project'"
echo "3. Import from GitHub: dcnotpc/ihemp-template"
echo "4. Configure settings (see below)"
echo "5. Deploy"
echo ""

for state in "${STATES[@]}"; do
  state_name=$(echo "$state" | sed 's/.*/\u&/')
  
  echo "=== ${state_name^^} ==="
  echo "Project Name: ihemp-$state"
  echo "Framework Preset: Next.js"
  echo "Environment Variables:"
  echo "  NEXT_PUBLIC_STATE = $state"
  echo "Custom Domain: ihemp${state}.com"
  echo ""
done
```

## 🔄 Vercel Project Creation Steps (For Each State)

1. **Create New Project**
   - Vercel Dashboard → Add New → Project
   - Import: `dcnotpc/ihemp-template`

2. **Configure Project**
   - **Project Name**: `ihemp-{state}` (lowercase, dash)
   - **Root Directory**: `/` (default)
   - **Framework Preset**: Next.js (auto-detected)
   - **Build & Output Settings** (keep defaults):
     - Build Command: `npm run build`
     - Output Directory: `.next`
     - Install Command: `npm ci`

3. **Add Environment Variable**
   - `NEXT_PUBLIC_STATE` = `{state}` (lowercase exact match)

4. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes for build

5. **Add Custom Domain**
   - Project → Settings → Domains
   - Add: `ihemp{state}.com`
   - Follow DNS instructions

## ⚡ Fast Track (2-3 hours total)

### Hour 1: Setup & Colorado Verification
- [ ] Verify Colorado Vercel project
- [ ] Update DNS for ihempcolorado.com
- [ ] Test SSL and site functionality
- [ ] Create first 5 additional projects

### Hour 2: Batch Create Remaining 10 Projects
- [ ] Create projects for remaining states (2-3 minutes each)
- [ ] Add environment variables
- [ ] Start deployments

### Hour 3: DNS Updates & Verification
- [ ] Update DNS for all 15 new domains in cPanel
- [ ] Wait for propagation (5-60 minutes)
- [ ] Test each site
- [ ] Create bookmark list of all 16 sites

## 🔍 Post-Deployment Verification

### Quick Health Check Script
```bash
#!/bin/bash
# health-check.sh

DOMAINS=(
  "ihempcolorado.com"
  "ihemparkansas.com"
  "ihempcalifornia.com"
  "ihempflorida.com"
  "ihempgeorgia.com"
  "ihempindiana.com"
  "ihempiowa.com"
  "ihempkansas.com"
  "ihempkentucky.com"
  "ihempmi.com"
  "ihempmississippi.com"
  "ihempnebraska.com"
  "ihempohio.com"
  "ihempoklahoma.com"
  "ihemptennessee.com"
  "ihemptexas.com"
)

for domain in "${DOMAINS[@]}"; do
  echo -n "$domain: "
  
  # Check DNS resolution
  ip=$(dig +short "$domain" | head -1)
  if [[ -z "$ip" ]]; then
    echo "❌ No DNS resolution"
    continue
  fi
  
  # Check HTTPS
  if curl -s -I "https://$domain" 2>/dev/null | head -1 | grep -q "200"; then
    echo "✅ Online (HTTPS)"
  elif curl -s -I "http://$domain" 2>/dev/null | head -1 | grep -q "200"; then
    echo "⚠️  HTTP only (SSL may be pending)"
  else
    echo "❌ Not responding"
  fi
done
```

## 🛠️ Troubleshooting

### Common Issues & Solutions:

1. **"Import failed" in Vercel**
   - Check GitHub repository access
   - Ensure you're logged in with correct GitHub account

2. **Build fails with Node version error**
   - Vercel automatically uses Node 22.x (configured in `vercel.json`)
   - Local builds need Node 20+ (`nvm use 22`)

3. **DNS not propagating**
   - Wait 1 hour max
   - Check at [dnschecker.org](https://dnschecker.org)
   - Verify A record points to Vercel IP

4. **SSL certificate pending**
   - Can take 5-10 minutes after DNS propagation
   - Vercel handles automatically

5. **Logo not showing**
   - Check file exists: `public/images/ihemp-{state}-logo-cream.webp`
   - File must be committed to GitHub

## 📊 Success Metrics
- ✅ 16 live websites
- ✅ HTTPS on all domains
- ✅ State-specific content
- ✅ Working navigation
- ✅ DNS properly configured for email + websites

## 📞 Support Reference
- **Vercel Docs**: [Custom Domains](https://vercel.com/docs/projects/domains)
- **cPanel Docs**: [Zone Editor](https://docs.cpanel.net/knowledge-base/web-services/zone-editor/)
- **GitHub**: `dcnotpc/ihemp-template`
- **Colorado Reference Site**: `https://ihempcolorado.com`

---

**Next Action:** Verify Colorado Vercel deployment and DNS, then batch create remaining 15 projects.