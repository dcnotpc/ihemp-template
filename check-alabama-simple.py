#!/usr/bin/env python3
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

print("🔍 Alabama Project Quick Check")
print("=" * 50)

# 1. Get Alabama project details
print("\n1️⃣  Project Configuration:")
projects = api_request("GET", "/v9/projects")
if "error" in projects:
    print(f"❌ Couldn't fetch projects: {projects['error']}")
else:
    alabama = None
    for p in projects.get("projects", []):
        if p.get("name") == "ihemp-alabama":
            alabama = p
            break
    
    if alabama:
        print(f"✅ Found: {alabama.get('name')} (ID: {alabama.get('id')})")
        print(f"   • rootDirectory: {alabama.get('rootDirectory')}")
        print(f"   • framework: {alabama.get('framework')}")
        print(f"   • buildCommand: {alabama.get('buildCommand')}")
        
        # Check env vars
        envs = api_request("GET", f"/v9/projects/{alabama.get('id')}/env")
        if "error" not in envs:
            for env in envs.get("envs", []):
                if env.get("key") == "NEXT_PUBLIC_STATE":
                    val = env.get("value", "")
                    print(f"   • NEXT_PUBLIC_STATE: '{val}' (type: {env.get('type')})")
    else:
        print("❌ ihemp-alabama project not found!")

# 2. Check deployments with correct endpoint
print("\n2️⃣  Deployment Status:")
if alabama:
    # Try v6 deployments endpoint
    deployments = api_request("GET", f"/v6/deployments?projectId={alabama.get('id')}&limit=5")
    if "error" in deployments:
        print(f"⚠️  No deployments found or API error: {deployments['error']}")
    else:
        deploys = deployments.get("deployments", [])
        print(f"Found {len(deploys)} deployments")
        for d in deploys[:3]:
            print(f"   • {d.get('state')} - {d.get('createdAt')}")

# 3. Check domains
print("\n3️⃣  Domain Configuration:")
if alabama:
    domains = api_request("GET", f"/v9/projects/{alabama.get('id')}/domains")
    if "error" in domains:
        print(f"⚠️  Couldn't fetch domains: {domains['error']}")
    else:
        doms = domains.get("domains", [])
        print(f"Found {len(doms)} domain(s)")
        for d in doms:
            print(f"   • {d.get('name')}")

# 4. Manual curl test
print("\n4️⃣  Live Site Test:")
import subprocess
sites = ["https://ihempalabama.com", "https://ihemp-alabama.vercel.app"]
for site in sites:
    result = subprocess.run(["curl", "-s", "-I", site], capture_output=True, text=True, timeout=5)
    if result.returncode == 0:
        lines = result.stdout.split('\n')
        status = lines[0] if lines else "No response"
        print(f"   {site}: {status}")
    else:
        print(f"   {site}: Failed (curl error)")

print("\n" + "=" * 50)
print("🎯 QUICK DIAGNOSIS:")
if alabama and alabama.get("rootDirectory") == "ihemp-template":
    print("✅ Configuration is correct")
else:
    print("❌ Configuration issue")

print("\nNext: Check if deployments exist at all, and trigger one if needed.")