#!/usr/bin/env python3
"""
Check Alabama Vercel project status and deployment info.
"""

import json
import time
import urllib.request
import urllib.error

API_TOKEN = "vcp_2gmyM4JYDx9RG4qVW8e4afW5qfdhZd3wzX5XGLJw3x0JWvPOCn1ak7CF"
API_BASE = "https://api.vercel.com"

def api_request(method, endpoint, data=None):
    """Make authenticated API call."""
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
        error_body = e.read().decode('utf-8')
        try:
            error_data = json.loads(error_body)
        except:
            error_data = {"error": error_body}
        return {"error": error_data, "status": e.code}
    except Exception as e:
        return {"error": str(e)}

def main():
    print("🌿 Alabama Project Status Check")
    print("=" * 60)
    
    # Find Alabama project
    print("🔍 Finding Alabama project...")
    projects_result = api_request("GET", "/v9/projects")
    
    if "error" in projects_result:
        print(f"❌ Failed to fetch projects: {projects_result['error']}")
        return
    
    alabama_project = None
    for p in projects_result.get("projects", []):
        if p.get("name") == "ihemp-alabama":
            alabama_project = p
            break
    
    if not alabama_project:
        print("❌ ihemp-alabama project not found!")
        return
    
    print(f"✅ Found Alabama: ID={alabama_project.get('id')}")
    print(f"   - Framework: {alabama_project.get('framework')}")
    print(f"   - Root Directory: {alabama_project.get('rootDirectory')}")
    print(f"   - Build Command: {alabama_project.get('buildCommand')}")
    
    # Get environment variables
    print("\n🔍 Checking environment variables...")
    env_result = api_request("GET", f"/v9/projects/{alabama_project.get('id')}/env")
    
    if "error" in env_result:
        print(f"⚠️  Could not fetch env vars: {env_result['error']}")
    else:
        envs = env_result.get("envs", [])
        for env in envs:
            if env.get("key") == "NEXT_PUBLIC_STATE":
                value = env.get("value", "")
                print(f"✅ NEXT_PUBLIC_STATE = '{value}' ({env.get('type')})")
                if len(value) > 50 and "eyJ2IjoidjIi" in value:
                    print("⚠️  WARNING: Still appears to be encrypted!")
    
    # Get deployments
    print("\n🔍 Checking deployments...")
    deployments_result = api_request("GET", f"/v9/projects/{alabama_project.get('id')}/deployments")
    
    if "error" in deployments_result:
        print(f"⚠️  Could not fetch deployments: {deployments_result['error']}")
    else:
        deployments = deployments_result.get("deployments", [])
        print(f"📊 Found {len(deployments)} deployments")
        
        if deployments:
            latest = deployments[0]
            print(f"\n📈 Latest deployment:")
            print(f"   - ID: {latest.get('uid')}")
            print(f"   - State: {latest.get('state')}")
            print(f"   - Created: {latest.get('createdAt')}")
            
            # Get build info
            builds_result = api_request("GET", f"/v1/deployments/{latest.get('uid')}")
            if "error" not in builds_result:
                builds = builds_result.get("builds", [])
                if builds:
                    for build in builds:
                        print(f"   - Build state: {build.get('state')}")
                else:
                    print("   - No build info available")
            
            # Get deployment events
            events_result = api_request("GET", f"/v2/deployments/{latest.get('uid')}/events")
            if "error" not in events_result:
                events = events_result.get("events", [])
                error_events = [e for e in events if e.get("type") == "stderr" or e.get("type") == "stderr"]
                if error_events:
                    print(f"   - Found {len(error_events)} error events")
                    for err in error_events[:2]:
                        text = err.get("text", "")[:100]
                        print(f"     • {text}...")
    
    # Check if domain is connected
    print("\n🔍 Checking domain connection...")
    domains_result = api_request("GET", f"/v9/projects/{alabama_project.get('id')}/domains")
    
    if "error" in domains_result:
        print(f"⚠️  Could not fetch domains: {domains_result['error']}")
    else:
        domains = domains_result.get("domains", [])
        print(f"🌐 Found {len(domains)} domain(s):")
        for domain in domains:
            print(f"   • {domain.get('name')} - {domain.get('verification', {}).get('state', 'unknown')}")
    
    # Try to access the live site
    print("\n🔍 Testing live access...")
    import subprocess
    result = subprocess.run(["curl", "-s", "-I", "https://ihempalabama.com"], 
                           capture_output=True, text=True)
    
    if result.returncode == 0:
        lines = result.stdout.split('\n')
        if "HTTP/" in lines[0]:
            print(f"🌐 Site response: {lines[0].strip()}")
            # Look for redirects
            for line in lines:
                if "location:" in line.lower():
                    print(f"   ↪️  Redirects to: {line.split(':', 1)[1].strip()}")
    else:
        print("❌ Site not accessible via curl")
    
    print("\n" + "=" * 60)
    print("📊 ALABAMA STATUS SUMMARY:")
    print("=" * 60)
    
    # Quick diagnosis
    print("\n1. Configuration check:")
    if alabama_project.get("rootDirectory") == "ihemp-template":
        print("   ✅ rootDirectory is correct")
    else:
        print(f"   ❌ rootDirectory: {alabama_project.get('rootDirectory')}")
    
    print("\n2. Deployment check:")
    if deployments and deployments[0].get("state") == "READY":
        print("   ✅ Latest deployment is READY")
    elif deployments:
        print(f"   ⚠️  Latest deployment state: {deployments[0].get('state') if deployments else 'NONE'}")
    else:
        print("   ❌ No deployments found")
    
    print("\n3. Domain check:")
    if domains:
        domain = domains[0]
        if domain.get("verification", {}).get("state") == "VERIFIED":
            print("   ✅ Domain verified")
        else:
            print(f"   ⚠️  Domain state: {domain.get('verification', {}).get('state', 'unknown')}")
    else:
        print("   ❌ No domain attached")
    
    print("\n4. Live site check:")
    if "200" in result.stdout or "301" in result.stdout:
        print("   ✅ Site responds")
    else:
        print("   ❌ Site not responding")

if __name__ == "__main__":
    main()