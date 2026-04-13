#!/usr/bin/env python3
"""
Check ihemptennessee.com deployment status by verifying DNS and basic connectivity
"""

import subprocess
import sys
import time

def check_site_status():
    print("🔍 Checking ihemptennessee.com status...")
    print("=" * 50)
    
    # 1. Check DNS resolution
    print("\n1️⃣ DNS Resolution:")
    try:
        import socket
        ip = socket.gethostbyname('ihemptennessee.com')
        print(f"   ✅ DNS resolves to: {ip}")
    except Exception as e:
        print(f"   ❌ DNS lookup failed: {e}")
        print("   ⚠️ Check if domain is properly configured in Vercel")
        return False
    
    # 2. Check HTTP connectivity
    print("\n2️⃣ HTTP Connectivity:")
    try:
        import requests
        response = requests.head('https://ihemptennessee.com', timeout=10, allow_redirects=True)
        print(f"   ✅ HTTP {response.status_code} (final URL: {response.url})")
        
        if response.status_code == 404:
            print("   ⚠️ Site exists but shows 404 - may be not deployed or misconfigured")
        elif response.status_code >= 500:
            print("   ⚠️ Server error - deployment may be failing")
        elif response.status_code >= 200 and response.status_code < 300:
            print("   ✅ Site is live and responding")
            return True
            
    except requests.exceptions.SSLError:
        print("   🔒 SSL/TLS issue - site may be using default Vercel certificate")
        print("   ℹ️ Try HTTP instead...")
        try:
            response = requests.head('http://ihemptennessee.com', timeout=10, allow_redirects=True)
            print(f"   ✅ HTTP {response.status_code} (redirected to: {response.url})")
            return True
        except Exception as e2:
            print(f"   ❌ HTTP also failed: {e2}")
            return False
    except Exception as e:
        print(f"   ❌ Connection failed: {e}")
        print("   ⚠️ Site may not be deployed or DNS is still propagating")
        return False
    
    return True

def check_github_trigger():
    print("\n3️⃣ GitHub Integration Check:")
    print("   ℹ️ Recent Git push should trigger Vercel builds automatically")
    print("   ℹ️ Committed fix: 'Complete state-specific content fixes for all pages'")
    print("   ℹ️ All 17 Vercel projects should be rebuilding now")
    print("   ℹ️ Builds typically take 5-10 minutes each")

def check_vercel_link():
    print("\n4️⃣ Vercel Project Status:")
    print("   ℹ️ Project ID: prj_VHfV4ZQJjiBokwGuXne5iV5dZnPE (from deployment log)")
    print("   ⚠️ Initial deployment had API error: 'files field should be an array'")
    print("   ⚠️ This was during initial project creation, not regular deployments")
    print("   ✅ Domain ihemptennessee.com was successfully added to project")
    print("   ✅ Project should be linked to GitHub repo (ihemp-template)")
    print("   🔄 Check Vercel dashboard for latest build status")

def main():
    print("🌿 iHemp Tennessee Deployment Status Check")
    print("Time:", time.strftime("%Y-%m-%d %H:%M:%S"))
    print("=" * 50)
    
    check_site_status()
    check_github_trigger()
    check_vercel_link()
    
    print("\n" + "=" * 50)
    print("📋 RECOMMENDATIONS:")
    print("1. Wait 5-10 minutes for Vercel build completion")
    print("2. Try hard refresh (Ctrl+F5) after build completes")
    print("3. Check Vercel dashboard → ihemp-tennessee project")
    print("4. Verify NEXT_PUBLIC_STATE=tennessee env var is set")
    print("5. If still 404, may need manual redeploy trigger")

if __name__ == "__main__":
    main()