# 🌿 Vercel Deployment - Simple Instructions

## **Dashboard Status**
✅ **LOCAL**: Working on `http://localhost:3000/dashboard`  
✅ **AUTH**: API key validated (`200 OK` with Bearer token)  
✅ **CODE**: Ready in `ihemp-template/`  
✅ **GIT**: Connected to `github.com/dcnotpc/ihemp-template`

## **3 Simple Steps to Deploy**

### **1. Push to GitHub (2 minutes)**
```bash
cd /home/dcnotpc420/.openclaw/workspace/ihemp-template
git add .
git commit -m "Dashboard ready for Vercel"
git push
```

### **2. Create Vercel Project (5 minutes)**
1. Open **[vercel.com](https://vercel.com)**
2. Login with GitHub
3. Click **"Add New Project"**
4. Select **`ihemp-template`** repository
5. Deploy with defaults

### **3. Add API Key in Vercel (2 minutes)**
In Vercel project settings → **Environment Variables**:
- **Key**: `OPENCLAW_API_SECRET`
- **Value**: `bf2d1b3440e0f10ae637806e679ad91242d97106924d181c3dba48619be81c1c`

## **Result**
- **Vercel URL**: `https://ihemp-template.vercel.app/dashboard`
- **Custom domain**: Add `dashboard.ihempinternational.com` later
- **HTTPS**: Automatic
- **Auto-updates**: Push to GitHub → Vercel deploys

## **Test Immediately**
1. **Visit Vercel URL** after deployment
2. **Use curl to test**:
   ```bash
   curl -H "Authorization: Bearer YOUR_KEY" https://ihemp-template.vercel.app/dashboard
   ```

## **Need Help?**
Which step should I help with:
1. Pushing to GitHub?
2. Vercel setup walkthrough?
3. Testing the deployment?

**The dashboard works locally. Vercel will make it public with HTTPS.**