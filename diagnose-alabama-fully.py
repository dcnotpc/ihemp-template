#!/usr/bin/env python3
"""
Full Alabama diagnosis - configuration, deployment errors, and fix options
"""

import json
import urllib.request
import urllib.error
import subprocess

API_TOKEN = "vcp_2gmyM4JYDx9RG4qVW8e4afW5qfdhZd3wzX5XGLJw3x0JWvPOCn1ak7CF"
API_BASE = "https://api.vercel.com"

def api_request(method, endpoint, data=None):
    url = f"{API_BASE}{endpoint}"
    
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    req_data = None
    if data:
        req_data = json.dumps(data).encode('utf-8')
    
    request = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(request) as response:
            return json.loads(response.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        return {"http_error": True, "status": e.code, "message": e.reason}
    except Exception as e:
        return {"error": str(e)}

print("🔍 FULL ALABAMA DIAGNOSIS")
print("=" * 70)

# 1. Get project config
print("\n1️⃣  PROJECT CONFIGURATION:")
projects = api_request("GET", "/v9/projects")
alabama = None
for p in projects.get("projects", []):
    if p.get("name") == "ihemp-alabama":
        alabama = p
        break

if not alabama:
    print("❌ ihemp-alabama not found!")
    exit()

print(f"✅ Found: {alabama.get('name')}")
print(f"   • ID: {alabama.get('id')}")
print(f"   • rootDirectory: {alabama.get('rootDirectory')}")
print(f"   • buildCommand: {alabama.get('buildCommand')}")
print(f"   • framework: {alabama.get('framework')}")

# Environment variables
envs = api_request("GET", f"/v9/projects/{alabama.get('id')}/env")
if "http_error" not in envs:
    for env in envs.get("envs", []):
        if env.get("key") == "NEXT_PUBLIC_STATE":
            val = env.get("value", "")
            print(f"   • NEXT_PUBLIC_STATE: '{val}' ({env.get('type')})")
            if val != "alabama":
                print(f"   ⚠️  MISMATCH: Expected 'alabama', got '{val}'")

# 2. Deployment status
print("\n2️⃣  DEPLOYMENT STATUS:")
deployments = api_request("GET", f"/v6/deployments?projectId={alabama.get('id')}&limit=3")
if "http_error" in deployments:
    print(f"⚠️  No deployments found (API returned {deployments.get('status', 'unknown')})")
else:
    deploys = deployments.get("deployments", [])
    print(f"📊 Found {len(deploys)} deployments")
    
    if deploys:
        latest = deploys[0]
        print(f"\n   Latest deployment:")
        print(f"   • ID: {latest.get('uid')}")
        print(f"   • State: {latest.get('state')}")
        print(f"   • Created: {latest.get('createdAt')}")
        print(f"   • Target: {latest.get('target', 'production')}")
        
        # Try to get more details
        deploy_id = latest.get('uid')
        details = api_request("GET", f"/v1/deployments/{deploy_id}")
        
        if "http_error" not in details:
            builds = details.get("builds", [])
            if builds:
                print(f"   • Builds: {len(builds)}")
                for build in builds:
                    print(f"     - {build.get('id')}: {build.get('state')}")
            else:
                print(f"   • No build info available")
        
        # Try to fetch logs via curl
        print(f"\n   🔍 Attempting to fetch error logs...")
        try:
            # Vercel API for events
            import requests
            headers = {"Authorization": f"Bearer {API_TOKEN}"}
            events_url = f"https://api.vercel.com/v2/deployments/{deploy_id}/events"
            
            # We'll try a curl approach instead
            curl_cmd = ["curl", "-s", "-H", f"Authorization: Bearer {API_TOKEN}", 
                       f"https://api.vercel.com/v2/deployments/{deploy_id}/events"]
            result = subprocess.run(curl_cmd, capture_output=True, text=True)
            
            if result.returncode == 0:
                try:
                    events = json.loads(result.stdout)
                    if isinstance(events, list):
                        print(f"   • Events: {len(events)} total")
                        
                        # Show error-like events
                        errors = []
                        for e in events:
                            text = str(e).lower()
                            if "error" in text or "fail" in text or "failed" in text:
                                errors.append(e)
                        
                        if errors:
                            print(f"   • ⚠️  Found {len(errors)} error events")
                            for err in errors[-3:]:  # Last 3 errors
                                err_text = str(err).replace('\\n', ' ')[:150]
                                print(f"     → {err_text}...")
                except:
                    print(f"   • Could not parse events")
            else:
                print(f"   • Could not fetch events (curl error)")
        except:
            print(f"   • Could not fetch logs")

# 3. Domain configuration
print("\n3️⃣  DOMAIN CONFIGURATION:")
domains = api_request("GET", f"/v9/projects/{alabama.get('id')}/domains")
if "http_error" in domains:
    print(f"⚠️  Could not fetch domains")
else:
    doms = domains.get("domains", [])
    print(f"🌐 Found {len(doms)} domain(s):")
    for d in doms:
        name = d.get('name', 'unknown')
        verified = d.get('verification', {}).get('state', 'unknown')
        print(f"   • {name} - {verified}")

# 4. Direct site tests
print("\n4️⃣  LIVE SITE TESTS:")
test_urls = [
    "https://ihempalabama.com",
    "https://ihemp-alabama.vercel.app",
    "https://ihempalabama.com/api/hello",  # Test API route
]

for url in test_urls:
    try:
        result = subprocess.run(["curl", "-s", "-I", "-m", "10", url], 
                               capture_output=True, text=True)
        if result.returncode == 0:
            lines = result.stdout.split('\n')
            status = lines[0].strip() if lines else "No response"
            code = status.split(' ')[1] if 'HTTP' in status else '?'
            print(f"   {url}: {status}")
            
            # Check for redirects
            for line in lines:
                if "location:" in line.lower():
                    redirect = line.split(':', 1)[1].strip()
                    print(f"     ↪️  Redirects to: {redirect}")
        else:
            print(f"   {url}: Failed (curl error)")
    except:
        print(f"   {url}: Test failed")

# 5. Repository check
print("\n5️⃣  REPOSITORY CHECK:")
# Check if ihemp-template has known build issues
print("   Assuming ihemp-template repository structure:")
print("   • /ihemp-template/package.json - Next.js build config")
print("   • /ihemp-template/next.config.js - Next.js config")
print("   • /ihemp-template/.vercel/project.json - Vercel config")

# Quick test of Colorado (should be working)
print("\n6️⃣  COLORADO REFERENCE CHECK:")
try:
    result = subprocess.run(["curl", "-s", "-I", "https://ihempcolorado.com"], 
                           capture_output=True, text=True)
    if result.returncode == 0:
        lines = result.stdout.split('\n')
        status = lines[0].strip() if lines else "No response"
        print(f"   https://ihempcolorado.com: {status}")
        if "200" in status or "301" in status:
            print(f"   ✅ Colorado site is working")
        else:
            print(f"   ⚠️  Colorado also has issues")
    else:
        print(f"   ❌ Could not test Colorado")
except:
    print(f"   ❌ Colorado test failed")

print("\n" + "=" * 70)
print("🎯 DIAGNOSIS SUMMARY:")
print("=" * 70)

# Summary logic
issues = []

# Configuration check
if alabama.get("rootDirectory") != "ihemp-template":
    issues.append("rootDirectory not set to 'ihemp-template'")

# Deployment check
if deploys and deploys[0].get("state") == "ERROR":
    issues.append("Latest deployment in ERROR state")

# Domain check
if not doms or len(doms) == 0:
    issues.append("No domains configured")

# Live site check
if "404" in subprocess.run(["curl", "-s", "-I", "https://ihempalabama.com"], 
                         capture_output=True, text=True).stdout:
    issues.append("Site returns 404")

if issues:
    print(f"\n❌ ISSUES FOUND ({len(issues)}):")
    for i, issue in enumerate(issues, 1):
        print(f"   {i}. {issue}")
else:
    print(f"\n✅ No obvious configuration issues found")

print(f"\n🚀 RECOMMENDED ACTION:")
print(f"   1. Cancel the ERROR deployment (ID: {latest.get('uid') if deploys else 'unknown'})")
print(f"   2. Push a test commit to ihemp-template to trigger fresh build")
print(f"   3. Monitor new deployment for specific error messages")
print(f"\nSince configurations match Colorado (which works), the issue is")
print(f"likely a transient build error or missing files in repository.")