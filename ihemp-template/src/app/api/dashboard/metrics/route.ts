import { NextRequest, NextResponse } from "next/server";

const API_SECRET = process.env.OPENCLAW_API_SECRET;

export async function GET(req: NextRequest) {
  // Authentication
  const authHeader = req.headers.get("authorization");
  if (!API_SECRET || authHeader !== `Bearer ${API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // This is a mock implementation - in production, you would:
    // 1. Connect to OpenClaw API for token usage
    // 2. Check Vercel deployments
    // 3. Verify state URL health
    // 4. Pull from WordPress REST API for content stats
    // 5. Connect to Amazon Associates API
    
    const metrics = {
      openClaw: {
        tokensUsed: 1250,
        totalTokens: 10000,
        percentage: 12.5,
        agentsActive: 8,
        status: "healthy"
      },
      vercel: {
        totalSites: 18,
        deployed: 18,
        building: 0,
        failed: 0,
        lastDeployment: new Date().toISOString()
      },
      urls: {
        totalStates: 50,
        working: 48,
        broken: 2,
        percentage: 96,
        lastChecked: new Date().toISOString()
      },
      content: {
        totalPosts: 42,
        published: 42,
        drafts: 8,
        inReview: 3,
        complianceRejects: 2
      },
      commerce: {
        amazonClicks: 156,
        storeRevenue: 2450,
        activeProducts: 47,
        productReviews: 23
      },
      system: {
        lastUpdated: new Date().toISOString(),
        uptime: "99.8%",
        apiStatus: "healthy"
      }
    };

    return NextResponse.json({ 
      success: true, 
      data: metrics,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Dashboard metrics error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// Allow POST for dashboard updates
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!API_SECRET || authHeader !== `Bearer ${API_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { action, data } = body;

    // Handle different dashboard actions
    switch (action) {
      case 'refresh':
        return NextResponse.json({ 
          success: true, 
          message: "Dashboard refresh initiated",
          timestamp: new Date().toISOString()
        });
      
      case 'generateReport':
        return NextResponse.json({
          success: true,
          message: "Report generation queued",
          reportId: `report-${Date.now()}`
        });
      
      default:
        return NextResponse.json({ 
          success: false, 
          error: "Unknown action",
          availableActions: ['refresh', 'generateReport']
        }, { status: 400 });
    }

  } catch (error) {
    console.error("Dashboard POST error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}