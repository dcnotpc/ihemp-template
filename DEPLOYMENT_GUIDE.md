# iHemp Dashboard Deployment to dashboard.ihempinternational.com

## Current Status
✅ **Dashboard is running locally** on http://localhost:3000/dashboard
✅ **Authentication system** is working (API key: `bf2d1b3440e0f10ae637806e679ad91242d97106924d181c3dba48619be81c1c`)
✅ **Login page created** at `/home/dcnotpc420/.openclaw/workspace/dashboard-login.html`

## Deployment Steps for CPanel

### 1. Build the Production Version
Since Node.js 18.19.1 is installed but Next.js requires >=20.9.0, we need to:

```bash
# Use the correct Node.js version (v22.22.1 is available)
export PATH="$HOME/.nvm/versions/node/v22.22.1/bin:$PATH"
node --version  # Should show v22.22.1

# Navigate to the project
cd /home/dcnotpc420/.openclaw/workspace/ihemp-template

# Install dependencies
npm ci

# Build for production
npm run build
```

### 2. Create Production Bundle
The build will create a `.next` directory. We need to package it for CPanel:

```bash
# Create deployment directory
mkdir -p ~/dashboard-deploy

# Copy essential files
cp -r .next ~/dashboard-deploy/
cp -r public ~/dashboard-deploy/
cp -r src ~/dashboard-deploy/
cp package.json ~/dashboard-deploy/
cp package-lock.json ~/dashboard-deploy/
cp next.config.ts ~/dashboard-deploy/
cp .env.local ~/dashboard-deploy/.env
cp -r node_modules ~/dashboard-deploy/  # Or let CPanel install them
```

### 3. CPanel Setup Instructions

#### Option A: Node.js App in CPanel (Recommended)
1. Go to CPanel → **Node.js Selector**
2. Click **Create Application**
3. Configure:
   - **Application root**: `/home/yourusername/dashboard.ihempinternational.com`
   - **Application URL**: `https://dashboard.ihempinternational.com`
   - **Application startup file**: `server.js` (we'll create this)
   - **Node.js version**: **22.x** (must be >=20.9.0)
   - **Application mode**: `production`

#### Option B: Static Export (Simpler but limited)
If Node.js isn't available, we can create a static version:

```bash
# Update next.config.ts to enable static export
echo 'import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  env: {
    NEXT_PUBLIC_STATE: process.env.NEXT_PUBLIC_STATE || "colorado"
  }
};

export default nextConfig;' > next.config.ts

# Rebuild as static
npm run build

# The static files will be in the "out" directory
# Upload everything in "out" to CPanel public_html/dashboard/
```

### 4. Create Production Server File
Create `server.js` in your CPanel application root:

```javascript
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

const PORT = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
```

### 5. Environment Variables for CPanel
Create `.env` file in CPanel app root:

```
OPENCLAW_API_SECRET=bf2d1b3440e0f10ae637806e679ad91242d97106924d181c3dba48619be81c1c
NODE_ENV=production
NEXT_PUBLIC_STATE=colorado
```

### 6. Upload Files to CPanel
Use File Manager or FTP to upload:

1. **Required files:**
   - `.next/` (entire directory)
   - `public/` (entire directory)
   - `package.json`
   - `package-lock.json`
   - `next.config.ts`
   - `.env` (with your API key)
   - `server.js` (if using Node.js app)

2. **Directory structure:**
   ```
   /home/yourusername/dashboard.ihempinternational.com/
   ├── .next/
   ├── public/
   ├── package.json
   ├── package-lock.json
   ├── next.config.ts
   ├── .env
   └── server.js
   ```

### 7. Install Dependencies in CPanel
In CPanel Node.js app interface:
1. Click **Run NPM Install**
2. Or SSH command: `npm ci --production`

### 8. Start/Restart Application
In CPanel Node.js app interface:
1. Click **Restart Application**
2. Check logs for errors

### 9. Configure Login Page
Upload the login page to a separate location:

1. Upload `dashboard-login.html` to: `/home/yourusername/public_html/dashboard-login.html`
2. Update the login page's `DASHBOARD_URL` to: `https://dashboard.ihempinternational.com/dashboard`

### 10. Test Access
1. Visit: `https://ihempinternational.com/dashboard-login.html`
2. Enter API key: `bf2d1b3440e0f10ae637806e679ad91242d97106924d181c3dba48619be81c1c`
3. Should redirect to: `https://dashboard.ihempinternational.com/dashboard`

## Quick Fix for Node.js Version Issue

If CPanel doesn't have Node.js 22.x:

```bash
# Alternative: Use a Node.js version manager in your home directory
cd ~
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22

# Then install and run manually
cd /home/yourusername/dashboard.ihempinternational.com
npm ci
npm run build
npm start
```

## Security Notes

1. **API Key Protection:** The API key is hardcoded in `.env` - keep this file secure
2. **HTTPS Required:** CPanel should automatically provide SSL via Let's Encrypt
3. **Access Control:** Only the dashboard route (`/dashboard/*`) requires authentication
4. **Logging:** All access attempts are logged by the middleware

## Troubleshooting

### If Dashboard Shows "Unauthorized"
1. Check `.env` file has correct `OPENCLAW_API_SECRET`
2. Verify middleware is reading environment variable
3. Check browser console for authentication errors

### If Node.js Version Error
```bash
# Check Node.js version
node --version

# If < 20.9.0, update engines in package.json:
# "engines": { "node": ">=18.19.0" } -> "engines": { "node": ">=20.9.0" }
```

### If Build Fails
```bash
# Clear cache
rm -rf .next
rm -rf node_modules/.cache

# Reinstall
npm ci

# Try building with specific Node.js version
PATH="$HOME/.nvm/versions/node/v22.22.1/bin:$PATH" npm run build
```

## Alternative: Vercel Deployment (Easier)

If CPanel is problematic, deploy to Vercel:

1. Push code to GitHub
2. Connect repo to Vercel
3. Set environment variable `OPENCLAW_API_SECRET`
4. Deploy automatically

Vercel handles Node.js version automatically.

## Ready-to-Use Package

I can create a ZIP file with everything pre-configured:

```bash
cd /home/dcnotpc420/.openclaw/workspace
zip -r dashboard-deploy.zip dashboard-login.html ihemp-template/ -x "ihemp-template/node_modules/*" "ihemp-template/.next/*"
```

Then you can upload `dashboard-deploy.zip` to CPanel and extract.

**Which approach would you prefer?** I can:
1. Guide you through CPanel Node.js setup
2. Create a static export version
3. Help with Vercel deployment
4. Create a ready-to-upload ZIP package