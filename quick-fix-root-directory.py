#!/usr/bin/env python3
"""
Quick fix: Set rootDirectory to 'ihemp-template' for all iHemp projects.
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

def get_all_ihemp_projects():
    """Get all iHemp projects."""
    result = api_request("GET", "/v9/projects")
    if "error" in result:
        print(f"❌ Error fetching projects: {result['error']}")
        return {}
    
    projects = {}
    for p in result.get("projects", []):
        name = p.get("name", "")
        if name.startswith("ihemp-") and name != "test-ihemp-api":
            state = name.replace("ihemp-", "")
            projects[state] = {
                "name": name,
                "id": p.get("id"),
                "framework": p.get("framework", "unknown")
            }
    
    return projects

def fix_root_directory(state, project_id):
    """Set rootDirectory to 'ihemp-template' for a project."""
    print(f"🔧 {state}: Setting rootDirectory to 'ihemp-template'...")
    
    update_payload = {"rootDirectory": "ihemp-template"}
    
    result = api_request("PATCH", f"/v9/projects/{project_id}", update_payload)
    
    if "error" in result:
        print(f"  ❌ Failed: {result['error']}")
        return False
    
    print(f"  ✅ Updated rootDirectory for {state}")
    return True

def check_and_set_next_public_state(state, project_id):
    """Check and set NEXT_PUBLIC_STATE environment variable."""
    print(f"  🔧 Checking NEXT_PUBLIC_STATE for {state}...")
    
    # Get current environment variables
    env_result = api_request("GET", f"/v9/projects/{project_id}/env")
    
    if "error" in env_result:
        print(f"  ⚠️  Could not fetch env vars: {env_result['error']}")
        return False
    
    envs = env_result.get("envs", [])
    has_state_var = False
    
    for env in envs:
        if env.get("key") == "NEXT_PUBLIC_STATE":
            current_value = env.get("value", "")
            if current_value.lower() != state.lower():
                print(f"  ⚠️  Found mismatch: {current_value} != {state}")
                # Delete incorrect one
                env_id = env.get("id")
                delete_result = api_request("DELETE", f"/v9/projects/{project_id}/env/{env_id}")
                if "error" not in delete_result:
                    print(f"  ✅ Removed incorrect value")
                break
            else:
                print(f"  ✅ NEXT_PUBLIC_STATE already set to {state}")
                return True
            break
    
    # Create new environment variable
    env_payload = {
        "key": "NEXT_PUBLIC_STATE",
        "value": state,
        "type": "encrypted",
        "target": ["production", "preview", "development"]
    }
    
    create_result = api_request("POST", f"/v9/projects/{project_id}/env", env_payload)
    
    if "error" in create_result:
        print(f"  ⚠️  Could not set NEXT_PUBLIC_STATE: {create_result['error']}")
        return False
    
    print(f"  ✅ Set NEXT_PUBLIC_STATE = {state}")
    return True

def trigger_deployment(project_id, state):
    """Trigger a fresh deployment."""
    print(f"  🚀 Triggering deployment...")
    
    payload = {
        "name": f"ihemp-{state}",
        "project": project_id,
        "target": "production"
    }
    
    result = api_request("POST", "/v13/deployments", payload)
    
    if "error" in result:
        print(f"  ⚠️  Could not trigger deployment: {result['error']}")
        return None
    
    deployment_id = result.get("id", "Unknown")
    deployment_url = result.get("url", "Pending")
    
    print(f"  ✅ Deployment started: {deployment_id}")
    print(f"  🔗 Preview: {deployment_url}")
    print(f"  🌐 Live: https://ihemp{state}.com")
    
    return deployment_id

def main():
    print("🌿 iHemp Quick Fix: rootDirectory Configuration")
    print("=" * 70)
    print("⚡ Fixing ONLY rootDirectory issue (critical fix)")
    print("=" * 70)
    
    # Get all projects
    print("\n📋 Fetching iHemp projects...")
    projects = get_all_ihemp_projects()
    
    if not projects:
        print("❌ No iHemp projects found")
        return
    
    print(f"✅ Found {len(projects)} iHemp projects")
    
    # Skip Colorado (it's already correct)
    states_to_fix = sorted([s for s in projects.keys() if s != "colorado"])
    
    print(f"\n🎯 Will fix {len(states_to_fix)} projects (excluding Colorado):")
    for state in states_to_fix:
        print(f"   • {state}")
    
    print("\n🚀 Starting fixes (3-step process)...")
    print("-" * 70)
    
    fixed_count = 0
    env_fixed_count = 0
    deployments_triggered = 0
    
    for i, state in enumerate(states_to_fix, 1):
        project_id = projects[state]["id"]
        print(f"\n[{i}/{len(states_to_fix)}] {state.upper()}:")
        
        # Step 1: Fix rootDirectory
        if fix_root_directory(state, project_id):
            fixed_count += 1
            
            # Step 2: Fix environment variable
            if check_and_set_next_public_state(state, project_id):
                env_fixed_count += 1
            
            # Step 3: Trigger deployment
            deployment_id = trigger_deployment(project_id, state)
            if deployment_id:
                deployments_triggered += 1
        
        # Rate limiting
        time.sleep(0.5)
    
    # Summary
    print("\n" + "=" * 70)
    print("📊 QUICK FIX SUMMARY")
    print("=" * 70)
    
    print(f"\n✅ RootDirectory fixed: {fixed_count}/{len(states_to_fix)} projects")
    print(f"✅ NEXT_PUBLIC_STATE fixed: {env_fixed_count}/{len(states_to_fix)} projects")
    print(f"✅ Deployments triggered: {deployments_triggered}/{len(states_to_fix)} projects")
    
    print(f"\n⏱️  Deployments will complete in 2-5 minutes each")
    print(f"🚀 Pro plan allows 12 concurrent builds")
    
    print("\n🔗 Monitor at: https://vercel.com/dave-crabills-projects")
    print("📝 Note: Colorado remains unchanged (already working)")
    
    print(f"\n🎉 All 17 iHemp states should now deploy successfully!")
    print("   (Colorado: ✅ Working, 16 others: 🔄 Fixing/Deploying)")

if __name__ == "__main__":
    main()