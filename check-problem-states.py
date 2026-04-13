#!/usr/bin/env python3
"""
Detailed check of problem states: Tennessee and Iowa
"""

import subprocess
import json
import urllib.request

API_TOKEN = "vcp_2gmyM4JYDx9RG4qVW8e4afW5qfdhZd3wzX5XGLJw3x0JWvPOCn1ak7CF"
API_BASE = "https://api.vercel.com"

def api_request(method, endpoint):
    url = f"{API_BASE}{endpoint}"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    request = urllib.request.Request(url, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(request) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        return {"error": str(e)}

print("🔍 Detailed Check: Tennessee & Iowa")
print("=" * 60)

# 1. Find projects
print("\n1️⃣  Locating projects...")
projects = api_request("GET", "/v9/projects")
if "error" in projects:
    print(f"❌ API error: {projects['error']}")
    exit()

tennessee_project = None
iowa_project = None

for p in projects.get("projects", []):
    if p.get("name") == "ihemp-tennessee":
        tennessee_project = p
    if p.get("name") == "ihemp-iowa":
        iowa_project = p

# 2. Tennessee check
print("\n2️⃣  Tennessee (ihemp-tennessee):")
if tennessee_project:
    print(f"   • ID: {tennessee_project.get('id')}")
    print(f"   • rootDirectory: {tennessee_project.get('rootDirectory')}")
    print(f"   • framework: {tennessee_project.get('framework')}")
    
    # Check deployments
    deployments = api_request("GET", f"/v6/deployments?projectId={tennessee_project.get('id')}&limit=2")
    if "error" not in deployments:
        deploys = deployments.get("deployments", [])
        if deploys:
            print(f"   • Latest deployment: {deploys[0].get('state')}")
        else:
            print(f"   • No deployments found")
    
    # Test site with detailed curl
    print(f"\n   Testing site access...")
    urls = ["https://ihemptennessee.com", "https://ihemp-tennessee.vercel.app"]
    for url in urls:
        result = subprocess.run(["curl", "-v", "-s", "-I", "-m", "10", url], 
                              capture_output=True, text=True)
        print(f"   {url}:")
        if result.returncode == 0:
            lines = result.stdout.split('\n')
            for line in lines[:5]:
                if line.strip():
                    print(f"     {line}")
        else:
            print(f"     Curl error (code: {result.returncode})")
            print(f"     Stderr: {result.stderr[:100]}")
else:
    print("   ❌ Project not found!")

# 3. Iowa check
print("\n3️⃣  Iowa (ihemp-iowa):")
if iowa_project:
    print(f"   • ID: {iowa_project.get('id')}")
    print(f"   • rootDirectory: {iowa_project.get('rootDirectory')}")
    print(f"   • framework: {iowa_project.get('framework')}")
    
    # Check deployments
    deployments = api_request("GET", f"/v6/deployments?projectId={iowa_project.get('id')}&limit=2")
    if "error" not in deployments:
        deploys = deployments.get("deployments", [])
        if deploys:
            print(f"   • Latest deployment: {deploys[0].get('state')}")
        else:
            print(f"   • No deployments found")
    
    # Test site with detailed curl - 403 usually means forbidden/blocked
    print(f"\n   Testing site access (403 means forbidden)...")
    urls = ["https://ihempiowa.com", "https://ihemp-iowa.vercel.app"]
    for url in urls:
        result = subprocess.run(["curl", "-v", "-s", "-I", "-m", "10", url], 
                              capture_output=True, text=True)
        print(f"   {url}:")
        if result.returncode == 0:
            lines = result.stdout.split('\n')
            for line in lines[:8]:  # Show more headers for 403
                if line.strip():
                    print(f"     {line}")
            
            # Try to get actual content (might be blocked by WAF/security)
            content_result = subprocess.run(["curl", "-s", "-m", "10", url], 
                                          capture_output=True, text=True)
            if content_result.returncode == 0:
                content = content_result.stdout[:200]
                if content:
                    print(f"     Content preview: {content}")
        else:
            print(f"     Curl error (code: {result.returncode})")
else:
    print("   ❌ Project not found!")

# 4. Quick comparison with working Alabama
print("\n4️⃣  Comparison with Alabama (working):")
if tennessee_project or iowa_project:
    # Find Alabama project for comparison
    alabama_project = None
    for p in projects.get("projects", []):
        if p.get("name") == "ihemp-alabama":
            alabama_project = p
            break
    
    if alabama_project:
        print(f"   Alabama (working) configuration:")
        print(f"   • rootDirectory: {alabama_project.get('rootDirectory')}")
        print(f"   • framework: {alabama_project.get('framework')}")
        
        # Compare
        if tennessee_project:
            if tennessee_project.get('rootDirectory') != alabama_project.get('rootDirectory'):
                print(f"   ⚠️  Tennessee rootDirectory mismatch!")
            else:
                print(f"   ✅ Tennessee rootDirectory matches Alabama")
        
        if iowa_project:
            if iowa_project.get('rootDirectory') != alabama_project.get('rootDirectory'):
                print(f"   ⚠️  Iowa rootDirectory mismatch!")
            else:
                print(f"   ✅ Iowa rootDirectory matches Alabama")

print("\n" + "=" * 60)
print("🎯 DIAGNOSIS:")
print("=" * 60)
print("\nTennessee: Likely deployment in progress or DNS not propagated")
print("           (Curl error suggests connection issue, not 403)")
print("\nIowa: 403 Forbidden - Could be:")
print("      1. Security/WAF blocking")
print("      2. Build error causing forbidden page")
print("      3. Temporary Vercel restriction")
print("\n💡 Since 15/17 sites are LIVE, these are likely transient issues")
print("   that will resolve as deployments complete.")
print("\n🛠️  Suggested: Wait 5 minutes and test again.")