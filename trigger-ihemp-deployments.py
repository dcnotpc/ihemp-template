#!/usr/bin/env python3
"""
Trigger deployments for all iHemp state projects.
"""

import json
import time
import urllib.request
import urllib.error

API_TOKEN = "vcp_2gmyM4JYDx9RG4qVW8e4afW5qfdhZd3wzX5XGLJw3x0JWvPOCn1ak7CF"
API_BASE = "https://api.vercel.com"

# All 17 iHemp states
ALL_STATES = [
    'alabama', 'arkansas', 'california', 'colorado', 'florida',
    'georgia', 'indiana', 'iowa', 'kansas', 'kentucky',
    'michigan', 'mississippi', 'nebraska', 'ohio', 'oklahoma',
    'tennessee', 'texas'
]

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

def get_project_info():
    """Get all iHemp projects."""
    print("📊 Fetching iHemp projects...")
    result = api_request("GET", "/v9/projects")
    
    if "error" in result:
        print(f"❌ Error: {result['error']}")
        return {}
    
    projects = result.get("projects", [])
    ihemp_projects = {}
    
    for p in projects:
        name = p.get("name", "")
        if name.startswith("ihemp-") and name != "test-ihemp-api":
            state = name.replace("ihemp-", "")
            if state in ALL_STATES:  # Only include our 17 states
                ihemp_projects[state] = {
                    "id": p.get("id"),
                    "name": name,
                    "framework": p.get("framework"),
                    "teamId": p.get("teamId")
                }
    
    print(f"✅ Found {len(ihemp_projects)} iHemp projects")
    return ihemp_projects

def check_deployment_status(project_id, project_name):
    """Check latest deployment status for a project."""
    result = api_request("GET", f"/v6/deployments?projectId={project_id}&limit=1")
    
    if "error" in result:
        return {"status": "error-checking", "url": None}
    
    deployments = result.get("deployments", [])
    if not deployments:
        return {"status": "no-deployments", "url": None}
    
    latest = deployments[0]
    return {
        "status": latest.get("state", "unknown"),
        "url": latest.get("url", None),
        "readyState": latest.get("readyState", None),
        "createdAt": latest.get("createdAt", None)
    }

def trigger_deployment(project_id, state):
    """Trigger a new deployment for a project."""
    print(f"  🚀 Triggering deployment for {state}...")
    
    payload = {
        "name": f"ihemp-{state}",
        "project": project_id,
        "target": "production"
    }
    
    result = api_request("POST", "/v13/deployments", payload)
    
    if "error" in result:
        print(f"  ❌ Failed: {result['error']}")
        return None
    
    deployment_id = result.get("id", "Unknown")
    deployment_url = result.get("url", "Pending")
    
    print(f"  ✅ Deployment started: {deployment_id}")
    print(f"  🔗 Preview URL: {deployment_url}")
    
    return deployment_id

def main():
    print("=" * 60)
    print("🌿 iHemp Automated Deployment Trigger")
    print("=" * 60)
    
    # Get projects
    projects = get_project_info()
    
    if not projects:
        print("❌ No iHemp projects found")
        return
    
    print("\n📋 Project List:")
    for state in sorted(projects.keys()):
        project = projects[state]
        print(f"  • {state:12} → {project['name']} (ID: {project['id'][:12]}...)")
    
    # Check deployment status and trigger if needed
    print("\n🚀 Deployment Status & Trigger:")
    print("-" * 60)
    
    triggered = []
    skipped = []
    
    for state in sorted(projects.keys()):
        project = projects[state]
        project_id = project["id"]
        project_name = project["name"]
        
        print(f"\n[{state.upper()}] Checking {project_name}...")
        
        # Check current deployment status
        status_info = check_deployment_status(project_id, project_name)
        current_status = status_info["status"]
        
        # Determine if we should trigger
        if current_status in ["READY", "BUILDING", "QUEUED", "INITIALIZING"]:
            print(f"  ⏩ Already {current_status}, skipping...")
            print(f"  🔗 URL: {status_info.get('url', 'N/A')}")
            skipped.append(state)
            continue
        
        # Trigger new deployment
        deployment_id = trigger_deployment(project_id, state)
        
        if deployment_id:
            triggered.append(state)
        
        # Rate limiting
        time.sleep(1)
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 DEPLOYMENT SUMMARY")
    print("=" * 60)
    
    print(f"\n✅ Triggered deployments: {len(triggered)} states")
    for state in triggered:
        print(f"  • {state}")
    
    print(f"\n⏩ Skipped (already deploying/deployed): {len(skipped)} states")
    for state in skipped:
        print(f"  • {state}")
    
    print(f"\n🎯 Total iHemp states: {len(ALL_STATES)}")
    print(f"📈 Deployment progress: {len(skipped) + len(triggered)}/{len(ALL_STATES)}")
    
    print("\nℹ️  Deployment takes 2-5 minutes per project.")
    print("ℹ️  Check progress at: https://vercel.com/dave-crabills-projects")
    print("ℹ️  Pro plan allows 12 concurrent builds!")

if __name__ == "__main__":
    main()