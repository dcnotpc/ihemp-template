#!/usr/bin/env python3
"""
Batch create Vercel projects for iHemp states.
"""

import json
import time
import urllib.request
import urllib.error

API_TOKEN = "vcp_2gmyM4JYDx9RG4qVW8e4afW5qfdhZd3wzX5XGLJw3x0JWvPOCn1ak7CF"
API_BASE = "https://api.vercel.com"
GIT_REPO = "dcnotpc/ihemp-template"

# 17 target states
STATES = [
    "alabama", "arkansas", "california", "colorado", "florida", "georgia",
    "indiana", "iowa", "kansas", "kentucky", "michigan", "mississippi",
    "nebraska", "ohio", "oklahoma", "tennessee", "texas"
]

DOMAINS = {
    "alabama": "ihempalabama.com",
    "arkansas": "ihemparkansas.com",
    "california": "ihempcalifornia.com",
    "colorado": "ihempcolorado.com",
    "florida": "ihempflorida.com",
    "georgia": "ihempgeorgia.com",
    "indiana": "ihempindiana.com",
    "iowa": "ihempiowa.com",
    "kansas": "ihempkansas.com",
    "kentucky": "ihempkentucky.com",
    "michigan": "ihempmi.com",
    "mississippi": "ihempmississippi.com",
    "nebraska": "ihempnebraska.com",
    "ohio": "ihempohio.com",
    "oklahoma": "ihempoklahoma.com",
    "tennessee": "ihemptennessee.com",
    "texas": "ihemptexas.com"
}

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

def get_existing_projects():
    """Get list of existing projects."""
    result = api_request("GET", "/v9/projects")
    if "error" in result:
        print(f"❌ Error fetching projects: {result['error']}")
        return []
    
    projects = result.get("projects", [])
    project_names = [p.get("name", "") for p in projects]
    print(f"📊 Found {len(project_names)} existing projects")
    return project_names

def create_project(state):
    """Create a Vercel project for a state."""
    project_name = f"ihemp-{state}"
    print(f"\n🚀 Creating project: {project_name}")
    
    payload = {
        "name": project_name,
        "framework": "nextjs",
        "gitRepository": {
            "repo": GIT_REPO,
            "type": "github"
        },
        "buildCommand": "npm run build",
        "installCommand": "npm ci",
        "outputDirectory": ".next",
        # Root directory omitted - defaults to repository root
        "environmentVariables": [
            {
                "key": "NEXT_PUBLIC_STATE",
                "value": state,
                "type": "encrypted",
                "target": ["production", "preview", "development"]
            }
        ]
    }
    
    result = api_request("POST", "/v10/projects", payload)
    
    if "error" in result:
        print(f"❌ Failed: {result['error']}")
        return None
    
    project_id = result.get("id")
    print(f"✅ Created: {result.get('name')} (ID: {project_id})")
    return project_id

def add_domain(project_id, domain):
    """Add custom domain to project."""
    print(f"   🌐 Adding domain: {domain}")
    
    result = api_request("POST", f"/v10/projects/{project_id}/domains", {"name": domain})
    
    if "error" in result:
        error_msg = str(result['error'])
        if "already exists" in error_msg.lower() or "already assigned" in error_msg.lower():
            print(f"   ℹ️  Domain already configured")
            return True
        else:
            print(f"   ❌ Failed: {result['error']}")
            return False
    
    print(f"   ✅ Domain added")
    return True

def trigger_deployment(project_id):
    """Trigger deployment."""
    print(f"   🚀 Triggering deployment...")
    
    result = api_request("POST", f"/v13/deployments", {
        "name": project_id,
        "project": project_id,
        "target": "production"
    })
    
    if "error" in result:
        print(f"   ⚠️  Deployment may have issues: {result['error']}")
        return False
    
    deployment_id = result.get("id", "Unknown")
    print(f"   ✅ Deployment triggered (ID: {deployment_id})")
    return True

def main():
    print("=" * 60)
    print("🌿 iHemp Vercel Batch Creator")
    print("=" * 60)
    
    # Test connection
    print("🔐 Testing API connection...")
    test = api_request("GET", "/v2/user")
    if "error" in test:
        print(f"❌ Connection failed: {test['error']}")
        return
    
    user = test.get("user", {})
    print(f"✅ Connected as: {user.get('name')} ({user.get('email')})")
    
    # Get existing projects
    existing = get_existing_projects()
    
    # Process states
    created = []
    failed = []
    
    for state in STATES:
        project_name = f"ihemp-{state}"
        
        if project_name in existing:
            print(f"\n⏩ {project_name} already exists, skipping...")
            created.append((state, project_name, "existing"))
            continue
        
        project_id = create_project(state)
        if not project_id:
            failed.append(state)
            continue
        
        # Add domain
        domain = DOMAINS.get(state)
        if domain:
            add_domain(project_id, domain)
        
        # Trigger deployment
        trigger_deployment(project_id)
        
        created.append((state, project_name, "created"))
        
        time.sleep(2)  # Rate limit
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 SUMMARY")
    print("=" * 60)
    
    print(f"\n✅ Processed: {len(created)} states")
    for state, project, status in created:
        domain = DOMAINS.get(state, "")
        print(f"   • {state:12} → {project:25} ({status:8}) → {domain}")
    
    if failed:
        print(f"\n❌ Failed: {len(failed)} states")
        for state in failed:
            print(f"   • {state}")
    
    print("\n🔗 Sites will be available at:")
    for state in STATES:
        domain = DOMAINS.get(state)
        if domain:
            print(f"   • https://{domain}")
    
    print("\n⏱️  Deployments take 2-5 minutes each. Check Vercel dashboard for status.")

if __name__ == "__main__":
    main()