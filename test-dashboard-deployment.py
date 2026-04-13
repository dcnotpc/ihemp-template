#!/usr/bin/env python3
"""
Test the iHemp Dashboard deployment and authentication
"""

import requests
import time
import json

API_KEY = "bf2d1b3440e0f10ae637806e679ad91242d97106924d181c3dba48619be81c1c"
DEPLOYMENT_URLS = [
    "https://ihemp-dashboard-mdck6bcka-dave-crabills-projects.vercel.app",
    "https://ihemp-dashboard-dave-crabills-projects.vercel.app"
]
PRODUCTION_DOMAIN = "dashboard.ihempinternational.com"

def test_dashboard(url, path="/dashboard"):
    """Test dashboard endpoint with authentication."""
    full_url = url + path
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "User-Agent": "iHemp Dashboard Tester/1.0"
    }
    
    print(f"Testing: {full_url}")
    
    try:
        response = requests.get(full_url, headers=headers, timeout=10)
        print(f"  Status: {response.status_code}")
        print(f"  Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            print(f"  ✅ SUCCESS: Dashboard accessible at {url}")
            return True
        elif response.status_code == 401:
            print(f"  ❌ UNAUTHORIZED: API key rejected")
            # Try without auth to see what happens
            test_no_auth = requests.get(full_url, timeout=5)
            print(f"  No-auth status: {test_no_auth.status_code}")
            return False
        else:
            print(f"  ⚠️  UNEXPECTED: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        print(f"  ❌ ERROR: {e}")
        return False

def main():
    print("🌿 iHemp Dashboard Deployment Test")
    print("=" * 60)
    print(f"API Key: {API_KEY[:8]}...{API_KEY[-8:]}")
    print(f"Production Domain: {PRODUCTION_DOMAIN}")
    print()
    
    print("Testing Vercel deployment URLs...")
    success = False
    
    for url in DEPLOYMENT_URLS:
        print(f"\n🔗 {url}")
        if test_dashboard(url):
            success = True
            print(f"\n✅ Dashboard successfully deployed!")
            print(f"   URL: {url}/dashboard")
            print(f"   Auth: Bearer token working")
            
            # Try API endpoints
            api_endpoints = [
                "/api/dashboard/metrics",
                "/api/dashboard/content",
                "/api/dashboard/agents",
                "/api/dashboard/commerce"
            ]
            
            print(f"\nTesting API endpoints...")
            for endpoint in api_endpoints:
                test_result = test_dashboard(url, endpoint)
                if test_result:
                    print(f"  ✅ {endpoint}: OK")
                else:
                    print(f"  ❌ {endpoint}: Failed")
            
            break
    
    if not success:
        print(f"\n❌ No successful deployments found yet.")
        print(f"   Deployment may still be building...")
        print(f"   Check Vercel dashboard for status.")
    
    print(f"\n" + "=" * 60)
    print(f"📋 Next Steps:")
    print(f"1. Wait for Vercel build to complete (2-5 minutes)")
    print(f"2. Set DNS for {PRODUCTION_DOMAIN} to point to Vercel")
    print(f"3. Update login page with production URL")
    print(f"4. Test authentication with browser")
    
    print(f"\n🔗 Vercel Dashboard:")
    print(f"   https://vercel.com/dave-crabills-projects/ihemp-dashboard")
    
    return success

if __name__ == "__main__":
    main()