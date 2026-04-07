# iHemp State Website Deployment Options

## Current Project Status
- ✅ **51 state data files** (including 16 CEO priority domains)
- ✅ **16 logo files** transferred
- ✅ **Next.js project** with multi-state configuration
- ❌ **Build blocked**: Requires Node.js 20.9.0+ (currently 18.19.1)
- ✅ **Configuration ready**: 16 domains listed in `state.static.ts`

## Deployment Options Analysis

### Option 1: Vercel (Recommended for Simplicity)
**Pros:**
- **Free Hobby Tier**: Supports unlimited static sites
- **Automatic builds** from GitHub/GitLab
- **Global CDN, SSL, DDoS protection included**
- **Perfect for Next.js** (created by Vercel team)
- **Easy custom domain setup** (your 16 domains)
- **No Node version management** - they handle it
- **Separate builds per branch/project** for each state

**Cons:**
- Hobby tier: 100GB bandwidth/month limit (plenty for educational sites)
- 1M serverless function invocations/month
- Cold starts on free tier (minor for mostly static sites)

**Cost:** $0 for Hobby tier, $20/user/month for Pro (if needed later)

**Setup steps:**
1. Create Vercel account (GitHub login)
2. Import project repository
3. Set up 16 projects (one per state domain)
4. Configure environment variables per state
5. Point domains from cPanel DNS

---

### Option 2: cPanel Server (Your Current Hosting)
**Pros:**
- **Already have domains there**
- **Full control** over everything
- **No third-party limits**

**Cons:**
- **Need Node.js 20+** on server (check if available)
- **Manual build/deploy process** for 16 sites
- **No automatic CI/CD** without setup
- **Responsibility for updates, SSL, security**

**Setup steps:**
1. Check if Node.js 20+ available on cPanel server
2. Build 16 sites locally or on server
3. Upload static files to 16 separate directories
4. Configure Apache/nginx for each domain
5. Manage SSL certificates (Let's Encrypt)

---

### Option 3: Hybrid Approach
**Pros:**
- Use Vercel for **speed and convenience**
- Keep cPanel for **email, non-website services**
- Best of both worlds

**Cons:**
- **DNS management** split between providers
- **Two systems** to maintain

**Setup steps:**
1. Deploy sites to Vercel
2. Point domains to Vercel via cPanel DNS (A/CNAME records)
3. Keep email, databases on cPanel

---

## Recommendation: **Vercel Hobby Tier**

### Why Vercel is the best choice:
1. **Zero upfront cost** - Free tier covers educational hemp sites
2. **Zero maintenance** - No server updates, security patches
3. **Perfect Next.js optimization** - Built by the creators
4. **Easy scaling** - Can upgrade to Pro later if traffic grows
5. **16 separate sites** - Each state gets its own deployment
6. **Automatic SSL** - HTTPS for all domains
7. **Fast global CDN** - Better user experience worldwide

### Bandwidth Considerations:
- **Hemp education sites**: Light traffic, mostly text/images
- **100GB/month**: ~300k page views (assuming 300KB/page)
- **16 sites**: 100GB shared across all (still plenty)
- **Upgrade later**: Pro tier removes limits if needed

### Implementation Plan:
1. **Create Vercel account** (5 minutes)
2. **Connect GitHub repository** (2 minutes)
3. **Deploy first state** (Colorado test) (5 minutes)
4. **Set up custom domain** (ihempcolorado.com) (5 minutes)
5. **Repeat for 15 more states** (45-60 minutes total)
6. **Update DNS in cPanel** (15 minutes)

### Time Estimate: **1-2 hours** for all 16 sites

### Questions Before Starting:
1. Are all 16 domains currently pointing to your cPanel server?
2. Do you have access to update DNS records in cPanel?
3. Would you like me to guide you through Vercel setup step-by-step?

---

## Alternative: Quick Node Upgrade & Local Build Test

If you want to verify the sites work before choosing deployment:
```bash
# Install Node.js 20+ using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Build test site for Colorado
cd ihemp-template
NEXT_PUBLIC_STATE=colorado npm run build
```

This would let us test locally first, then choose deployment method.

---

**Next Step**: Tell me which approach you prefer, or I can proceed with the Vercel setup guide.