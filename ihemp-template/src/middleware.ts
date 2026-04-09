import { NextRequest, NextResponse } from 'next/server';

// Simple middleware to protect dashboard routes
export function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Only protect dashboard routes
  if (path.startsWith('/dashboard')) {
    // In a real implementation, you would check for:
    // 1. Valid session cookie
    // 2. JWT token
    // 3. IP whitelisting
    // 4. For now, we'll just allow access for development
    
    const authHeader = req.headers.get('authorization');
    const expectedAuth = `Bearer ${process.env.OPENCLAW_API_SECRET}`;
    
    // Allow if no auth required (development) or if auth matches
    if (!process.env.OPENCLAW_API_SECRET || authHeader === expectedAuth) {
      return NextResponse.next();
    }
    
    // Redirect to login or return 401
    return new NextResponse(
      JSON.stringify({ error: 'Unauthorized - CEO access required' }),
      {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'WWW-Authenticate': 'Bearer',
        },
      }
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};