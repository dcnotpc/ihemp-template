# iHemp Operations Dashboard

## Overview
A centralized CEO console for real-time monitoring and management of the iHemp Marketing Network across all 18 WordPress sites, 2 e-commerce stores, 9 social platforms, and 8 AI agents.

---

## 🚀 Quick Access

### Dashboard URL
Once deployed, access at: `https://your-domain.com/dashboard`

### Local Development
```bash
cd /home/dcnotpc420/.openclaw/workspace/ihemp-template
npm run dev
# Access at: http://localhost:3000/dashboard
```

---

## 🎯 Dashboard Modules

### 1. System Metrics
- **OpenClaw Status**: Agent system health and token usage
- **Vercel Deployments**: 18 WordPress site deployment status  
- **URL Health**: 50 state hemp program URL monitoring
- **API Status**: External integration health checks

### 2. Content Review Console
- **Blog Post Management**: Draft, review, and published content
- **Compliance Tracking**: FDA/FTC compliance status
- **QA Approval**: Quality assurance workflow
- **Content Assembly Line**: Research → Content → SEO → Compliance → QA → Publish

### 3. Agent Operations Monitor
- **8 Agent Status**: Real-time activity monitoring
1. Research Agent - Fact-finding and source verification
2. Content Agent - Draft creation across platforms
3. SEO Agent - Search optimization
4. Compliance Agent - Legal and regulatory review (VETO POWER)
5. QA Agent - Final review before publishing
6. Social Media Agent - Platform distribution
7. E-Commerce Agent - Store operations
8. Email Agent - Email marketing campaigns

### 4. Commerce & Revenue
- **Amazon Associates**: Tracking via `dcnotpc08-20` store ID
- **Product Performance**: 4 active CBD salve recipe products
- **E-Commerce Stores**: iHemp International + iHemp Harvest
- **Revenue Metrics**: Combined Amazon + store revenue

---

## 🔧 API Endpoints

### 1. Dashboard Metrics
```http
GET /api/dashboard/metrics
```
Returns real-time system metrics for:
- OpenClaw token usage
- Vercel deployment status
- Content pipeline statistics
- Agent activity
- Revenue data

### 2. Content Management API (Existing)
```http
POST /api/posts
DELETE /api/posts
```
Blog post creation and management via OpenClaw agents

---

## 🛡️ Security & Access

### Authorization (Planned)
- CEO-only access (David Alan Crabill)
- API key authentication via `OPENCLAW_API_SECRET`
- Role-based access control
- Audit logging for all dashboard actions

### Current Status
- **Development**: Open access for testing
- **Production**: Should implement proper authentication
- **Data Protection**: No sensitive credentials displayed

---

## 📊 Data Sources Integration

### Connected Systems
1. **OpenClaw API** - AI agent operations and token usage
2. **WordPress REST API** - Content management and blog posts
3. **Vercel API** - Deployment status and site health
4. **Amazon Associates API** - Revenue and click tracking
5. **Custom Monitoring** - State URL verification system

### Mock Data Strategy
- Current implementation uses simulated/static data
- Replace with real API calls as integrations are added
- Modular design allows gradual data source integration

---

## 🎨 UI Components

### Dashboard Layout
- **DashboardHeader.tsx** - Title, refresh controls, summary stats
- **SystemMetrics.tsx** - 6 key system health indicators
- **ContentReview.tsx** - Blog post management table
- **AgentStatus.tsx** - 8 agent status panels with controls
- **CommerceMetrics.tsx** - Amazon + e-commerce tracking
- **LoadingSpinner.tsx** - Animated loading state

### Design System
- **Theme**: iHemp green (#2d5016) with complementary colors
- **Typography**: Inter + Fredoka fonts
- **Responsive**: Mobile-first responsive design
- **Brand Alignment**: Matches iHemp website aesthetics

---

## 🔗 Integration Points

### With Existing Project
1. **Amazon Associates Integration** - Uses existing `src/lib/amazon.ts`
2. **API Authentication** - Leverages existing API secret system
3. **Content Management** - Extends existing `/api/posts` endpoint
4. **State Content** - Can integrate state-specific data from `src/data/states/`

### Future Integrations
1. **WordPress REST API** - Real blog post data
2. **Google Analytics** - Traffic and engagement metrics
3. **Shopify/WooCommerce API** - Real e-commerce data
4. **Social Media APIs** - Platform engagement metrics

---

## 🚀 Deployment

### Local Testing
```bash
# 1. Start development server
npm run dev

# 2. Access dashboard
open http://localhost:3000/dashboard

# 3. Test API endpoints
curl http://localhost:3000/api/dashboard/metrics
```

### Vercel Deployment
1. Push to GitHub repository
2. Import to Vercel
3. Set environment variables:
   ```env
   OPENCLAW_API_SECRET=your_secret_key
   NEXT_PUBLIC_APP_ENV=production
   ```

### Environment Requirements
- Node.js >= 18.19.0
- Next.js 16.2.1
- React 19.2.4

---

## 📈 Roadmap

### Phase 1: MVP Dashboard (Current)
- [x] Basic dashboard layout
- [x] Mock data displays
- [x] Static agent status
- [x] Basic authentication structure

### Phase 2: Data Integration
- [ ] Connect to WordPress REST API
- [ ] Add real Amazon Associates data
- [ ] Integrate Vercel deployment status
- [ ] Add OpenClaw API data

### Phase 3: Advanced Features
- [ ] Real-time WebSocket updates
- [ ] Automated reporting engine
- [ ] Mobile app companion
- [ ] Advanced analytics dashboards

### Phase 4: Enterprise Features
- [ ] Multi-user access control
- [ ] Audit logging system
- [ ] Automated compliance checks
7. [ ] Predictive analytics

---

## 🔍 Troubleshooting

### Common Issues

#### Dashboard Not Loading
1. Check Node.js version: `node --version`
2. Ensure dependencies: `npm install`
3. Check Next.js server: `npm run dev`
4. Verify port availability: `http://localhost:3000`

#### API Endpoints Not Working
1. Verify middleware configuration
2. Check environment variables
3. Test API directly: `curl http://localhost:3000/api/dashboard/metrics`

#### Data Not Updating
1. Dashboard uses mock data for now
2. Real integration requires API connections
3. Refresh button triggers simulated updates

### Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Lint code
npm run lint
```

---

## 📝 Usage Guidelines

### For CEO (David Alan Crabill)
1. **Daily Review**: Check system health metrics
2. **Content Approval**: Review and approve blog posts
3. **Agent Monitoring**: Verify agent status and activity
4. **Revenue Tracking**: Monitor Amazon and store performance
5. **Compliance Oversight**: Ensure all content passes compliance

### For Agents
1. **Content Assembly Line**: Follow Research → Content → SEO → Compliance → QA → Publish
2. **Status Updates**: Agents update current task status
3. **Compliance First**: All content must pass compliance review
4. **QA Final**: No content publishes without QA approval

### For Developers
1. **Modular Architecture**: Each dashboard component is independent
2. **API-First Design**: All data should come from APIs
3. **Security First**: Never expose sensitive data
4. **Performance**: Optimize for fast loading times

---

## 📄 License & Compliance

### iHemp Compliance
- **SOUL.md Adherence**: All operations follow iHemp mission and values
- **FDA/FTC Compliance**: No health claims, proper disclaimers
- **2018 Farm Bill**: All content follows federal regulations
- **State Regulations**: State-specific compliance maintained

### Security Compliance
- CEO-only access for sensitive operations
- API key authentication required
- No storage of sensitive credentials
- Regular security audits

---

## 🆘 Support & Contact

### Immediate Issues
1. Check `/tmp/next-dev.log` for server errors
2. Verify Node.js version >= 18.19.0
3. Ensure all dashboard components exist
4. Test API endpoints directly

### Development Support
- **Primary Developer**: iHemp AI Operations System
- **CEO**: David Alan Crabill
- **Documentation**: This README and project comments
- **Source Code**: Available in workspace

### Version Information
- **Dashboard Version**: 1.0.0 (Initial Release)
- **Next.js Version**: 16.2.1
- **React Version**: 19.2.4
- **Last Updated**: April 9, 2026

---

**iHemp AI Operations System** 🌿
*"Education over hype, accuracy over speed, compliance always."*