# iHemp Operations Dashboard

## Overview
A comprehensive CEO dashboard for monitoring the iHemp Marketing Network across 18 WordPress sites, 2 e-commerce stores, and 8 AI agents.

## Features

### 📊 **System Metrics**
- OpenClaw token usage and costs
- Vercel deployment health (18 sites)
- State URL monitoring (50 states)
- API health checks

### 📝 **Content Review Console**
- Real-time blog post tracking
- Draft status and publication queue
- Compliance and QA approval workflow
- Content assembly line visualization

### 🤖 **Agent Operations Monitor**
- 8 AI agent status tracking
- Task completion metrics
- Agent authority hierarchy display
- Manual agent control (pause/activate)

### 🛒 **Commerce & Revenue Dashboard**
- Amazon Associates tracking (`dcnotpc08-20`)
- E-commerce revenue metrics
- Product performance analytics
- Click-through and conversion tracking

## Security
- CEO-only access via API key authentication
- Protected `/dashboard/*` routes
- Environment-based configuration
- Audit logging ready

## Quick Start

### 1. Start the Dashboard
```bash
# Make script executable
chmod +x start-dashboard.sh

# Start development server
./start-dashboard.sh
```

### 2. Access the Dashboard
- **URL**: http://localhost:3080/dashboard
- **API**: http://localhost:3080/api/dashboard/metrics

### 3. Authentication
The dashboard uses the same `OPENCLAW_API_SECRET` as your content API:
```bash
# In .env.local
<OPENCLAW_API_SECRET>
```

## API Endpoints

### GET `/api/dashboard/metrics`
Returns real-time system metrics:
```json
{
  "openClaw": {
    "tokensUsed": 1250,
    "totalTokens": 10000,
    "percentage": 12.5,
    "agentsActive": 8,
    "status": "healthy"
  },
  "vercel": {
    "totalSites": 18,
    "deployed": 18,
    "building": 0,
    "failed": 0
  },
  "urls": {
    "totalStates": 50,
    "working": 48,
    "broken": 2,
    "percentage": 96
  },
  "content": {
    "totalPosts": 42,
    "published": 42,
    "drafts": 8,
    "inReview": 3
  },
  "commerce": {
    "amazonClicks": 156,
    "storeRevenue": 2450,
    "activeProducts": 47
  }
}
```

### POST `/api/dashboard/metrics`
Actions for dashboard management:
```json
{
  "action": "refresh" | "generateReport",
  "data": {}
}
```

## Dashboard Components

### 1. **DashboardHeader.tsx**
- Network overview stats (18 sites, 2 stores, 9 platforms, 8 agents)
- Refresh controls
- Status indicators

### 2. **SystemMetrics.tsx**
- Live system health monitoring
- Token usage tracking
- URL health status
- Quick action buttons

### 3. **ContentReview.tsx**
- Blog post approval workflow
- Compliance and QA status
- Content assembly line visualization
- One-click publish/revise actions

### 4. **AgentStatus.tsx**
- All 8 agent status monitoring
- Task completion tracking
- Authority hierarchy display
- Manual agent control

### 5. **CommerceMetrics.tsx**
- Amazon Associates performance
- E-commerce revenue tracking
- Product performance analytics
- Store switching (iHemp International / iHemp Harvest)

### 6. **LoadingSpinner.tsx**
- Animated loading state
- Connection status indicators

## Integration Points

### OpenClaw Integration
- Agent status monitoring
- Token usage tracking
- Content pipeline coordination

### WordPress Integration
- Blog post management
- Publication status
- Draft tracking

### Amazon Associates
- Automatic tracking with `dcnotpc08-20` tag
- Product performance analytics
- Revenue tracking

### Vercel Integration
- Deployment health monitoring
- Site status tracking

## Development

### Prerequisites
- Node.js >= 20.9.0 (Next.js requirement)
- npm or yarn
- OpenClaw API secret

### Environment Setup
```bash
# Copy example environment
cp .env.local.example .env.local

# Edit with your API secret
nano .env.local
```

### Build & Deploy
```bash
# Development
npm run dev

# Production build
npm run build
npm run start
```

## Deployment

### Vercel Deployment
The dashboard is configured for Vercel deployment:
- `output: "standalone"` in `next.config.ts`
- Environment variables in `.env.local`
- Protected routes via middleware

### Security Notes
- Dashboard routes are protected by API key
- CEO-only access enforced
- All API calls require authentication
- No sensitive data in client bundles

## Future Enhancements

### Phase 2 (Next 30 days)
- [ ] Real OpenClaw API integration
- [ ] WordPress REST API connectivity
- [ ] Amazon Associates API integration
- [ ] Vercel deployment status API

### Phase 3 (Next 60 days)
- [ ] Automated reporting system
- [ ] Email alerts for critical issues
- [ ] Mobile-responsive design improvements
- [ ] Historical data analytics

### Phase 4 (Next 90 days)
- [ ] Advanced agent task assignment
- [ ] Content calendar integration
- [ ] Social media performance tracking
- [ ] Compliance audit logs

## Troubleshooting

### Node.js Version Issues
```bash
# Check Node.js version
node --version

# If < 20.9.0, update using nvm
nvm install 20
nvm use 20
```

### API Authentication Issues
1. Verify `OPENCLAW_API_SECRET` in `.env.local`
2. Check middleware authentication logic
3. Ensure API calls include `Authorization: Bearer <secret>`

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
rm -rf node_modules/.cache

# Reinstall dependencies
npm install

# Rebuild
npm run build
```

## Support
For dashboard issues:
1. Check the browser console for errors
2. Verify API endpoints are accessible
3. Check environment variables
4. Review Next.js build logs

---

**Last Updated**: April 9, 2026  
**Version**: 1.0.0  
**Maintainer**: iHemp AI Operations System