#!/usr/bin/env python3
"""
Fix iHemp Vercel project configurations to match Colorado (working reference).
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

def get_colorado_config():
    """Get Colorado's working configuration."""
    projects = get_all_ihemp_projects()
    if "colorado" not in projects:
        print("❌ Colorado project not found!")
        return None
    
    colorado_id = projects["colorado"]["id"]
    result = api_request("GET", f"/v9/projects/{colorado_id}")
    
    if "error" in result:
        print(f"❌ Error fetching Colorado config: {result['error']}")
        return None
    
    return {
        "id": colorado_id,
        "name": "ihemp-colorado",
        "framework": result.get("framework"),
        "buildCommand": result.get("buildCommand"),
        "installCommand": result.get("installCommand"),
        "outputDirectory": result.get("outputDirectory"),
        "rootDirectory": result.get("rootDirectory"),
        "publicSource": result.get("publicSource")
    }

def fix_project_config(state, project_id, colorado_config):
    """Fix a project's configuration to match Colorado."""
    print(f"\n🔧 Fixing {state} ({project_id[:12]}...)")
    
    # Prepare update payload - match Colorado's settings
    update_payload = {}
    
    # Match Colorado's rootDirectory
    if colorado_config["rootDirectory"]:
        update_payload["rootDirectory"] = colorado_config["rootDirectory"]
        print(f"  ✅ Set rootDirectory: {colorado_config['rootDirectory']}")
    
    # Match Colorado's buildCommand (likely None, which means use defaults)
    if colorado_config["buildCommand"] is not None:
        update_payload["buildCommand"] = colorado_config["buildCommand"]
    else:
        update_payload["buildCommand"] = None
    print(f"  ✅ Set buildCommand: {colorado_config['buildCommand']}")
    
    # Match Colorado's installCommand
    if colorado_config["installCommand"] is not None:
        update_payload["installCommand"] = colorado_config["installCommand"]
    else:
        update_payload["installCommand"] = None
    print(f"  ✅ Set installCommand: {colorado_config['installCommand']}")
    
    # Match Colorado's outputDirectory
    if colorado_config["outputDirectory"] is not None:
        update_payload["outputDirectory"] = colorado_config["outputDirectory"]
    else:
        update_payload["outputDirectory"] = None
    print(f"  ✅ Set outputDirectory: {colorado_config['outputDirectory']}")
    
    # Apply the update
    result = api_request("PATCH", f"/v9/projects/{project_id}", update_payload)
    
    if "error" in result:
        print(f"  ❌ Update failed: {result['error']}")
        return False
    
    print(f"  ✅ Configuration updated for {state}")
    return True

def fix_environment_variable(state, project_id):
    """Fix the NEXT_PUBLIC_STATE environment variable."""
    print(f"  🔧 Fixing NEXT_PUBLIC_STATE for {state}...")
    
    # First, remove any existing incorrect NEXT_PUBLIC_STATE
    env_vars = api_request("GET", f"/v9/projects/{project_id}/env")
    if "error" not in env_vars:
        for env in env_vars.get("envs", []):
            if env.get("key") == "NEXT_PUBLIC_STATE":
                # Delete the incorrect one
                env_id = env.get("id")
                delete_result = api_request("DELETE", f"/v9/projects/{project_id}/env/{env_id}")
                if "error" not in delete_result:
                    print(f"  ✅ Removed incorrect NEXT_PUBLIC_STATE")
    
    # Create new correct environment variable
    env_payload = {
        "key": "NEXT_PUBLIC_STATE",
        "value": state,
        "type": "encrypted",
        "target": ["production", "preview", "development"]
    }
    
    result = api_request("POST", f"/v9/projects/{project_id}/env", env_payload)
    
    if "error" in result:
        print(f"  ⚠️  Could not set NEXT_PUBLIC_STATE: {result['error']}")
        return False
    
    print(f"  ✅ Set NEXT_PUBLIC_STATE = {state}")
    return True

def trigger_deployment(project_id, state):
    """Trigger a fresh deployment."""
    print(f"  🚀 Triggering deployment for {state}...")
    
    payload = {
        "name": f"ihemp-{state}",
        "project": project_id,
        "target": "production"
    }
    
    result = api_request("POST", "/v13/deployments", payload)
    
    if "error" in result:
        print(f"  ⚠️  Deployment trigger may have issues: {result['error']}")
        return None
    
    deployment_id = result.get("id", "Unknown")
    deployment_url = result.get("url", "Pending")
    
    print(f"  ✅ Deployment started: {deployment_id}")
    print(f"  🔗 Preview URL: {deployment_url}")
    
    return deployment_id

def main():
    print("🌿 iHemp Vercel Configuration Fix Script")
    print("=" * 80)
    
    # Get working reference (Colorado)
    print("\n📋 Getting Colorado (working reference) configuration...")
    colorado_config = get_colorado_config()
    
    if not colorado_config:
        print("❌ Cannot proceed without Colorado reference")
        return
    
    print(f"✅ Colorado config loaded:")
    print(f"   • Framework: {colorado_config['framework']}")
    print(f"   • Root directory: {colorado_config['rootDirectory']}")
    print(f"   • Build command: {colorado_config['buildCommand']}")
    print(f"   • Install command: {colorado_config['installCommand']}")
    print(f"   • Output directory: {colorado_config['outputDirectory']}")
    
    # Get all iHemp projects
    print("\n📋 Fetching all iHemp projects...")
    projects = get_all_ihemp_projects()
    
    if not projects:
        print("❌ No iHemp projects found")
        return
    
    print(f"✅ Found {len(projects)} iHemp projects")
    
    # Process projects (skip Colorado since it's already working)
    states_to_fix = sorted([s for s in projects.keys() if s != "colorado"])
    
    print(f"\n🎯 Will fix {len(states_to_fix)} projects:")
    for state in states_to_fix:
        print(f"   • {state}")
    
    print("\n🚀 Starting fixes...")
    print("=" * 80)
    
    fixed_count = 0
    env_fixed_count = 0
    deployment_triggered = 0
    
    for state in states_to_fix:
        project_id = projects[state]["id"]
        
        # Fix configuration
        config_fixed = fix_project_config(state, project_id, colorado_config)
        
        if config_fixed:
            fixed_count += 1
            
            # Fix environment variable
            env_fixed = fix_environment_variable(state, project_id)
            if env_fixed:
                env_fixed_count += 1
            
            # Trigger deployment
            deployment_id = trigger_deployment(project_id, state)
            if deployment_id:
                deployment_triggered += 1
            
            # Rate limiting
            time.sleep(1)
    
    # Summary
    print("\n" + "=" * 80)
    print("📊 FIX SUMMARY")
    print("=" * 80)
    
    print(f"\n✅ Configurations fixed: {fixed_count}/{len(states_to_fix)}")
    print(f"✅ Environment variables fixed: {env_fixed_count}/{len(states_to_fix)}")
    print(f"✅ Deployments triggered: {deployment_triggered}/{len(states_to_fix)}")
    
    print(f"\n🔗 Live URLs (after deployments complete):")
    for state in sorted(projects.keys()):
        print(f"   • https://ihemp{state}.com")
    
    print("\n⏱️  Deployments will take 2-5 minutes each.")
    print("📊 Pro plan allows 12 concurrent builds.")
    print("\n🔗 Monitor progress at: https://vercel.com/dave-crabills-projects")

if __name__ == "__main__":
    main()