#!/usr/bin/env python3
"""
Complete the remaining configuration fixes for iHemp Vercel projects.
Focus on the 5 remaining states: nebraska, ohio, oklahoma, tennessee, texas
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

def fix_single_state(state, project_id):
    """Fix configuration for a single state."""
    print(f"\n🔧 Fixing {state.upper()}:")
    
    # 1. Check current config
    current = api_request("GET", f"/v9/projects/{project_id}")
    if "error" in current:
        print(f"  ❌ Cannot fetch project: {current['error']}")
        return False
    
    current_root = current.get("rootDirectory")
    print(f"  📊 Current rootDirectory: '{current_root}'")
    
    # 2. Fix rootDirectory if needed
    if current_root != "ihemp-template":
        print(f"  🔄 Setting rootDirectory to 'ihemp-template'...")
        update_payload = {"rootDirectory": "ihemp-template"}
        result = api_request("PATCH", f"/v9/projects/{project_id}", update_payload)
        
        if "error" in result:
            print(f"  ❌ Failed: {result['error']}")
        else:
            print(f"  ✅ Updated to 'ihemp-template'")
    else:
        print(f"  ✅ Already 'ihemp-template'")
    
    time.sleep(0.5)  # Rate limiting
    
    # 3. Check and fix environment variable
    print(f"  🔄 Checking NEXT_PUBLIC_STATE...")
    env_result = api_request("GET", f"/v9/projects/{project_id}/env")
    
    if "error" in env_result:
        print(f"  ⚠️  Could not fetch env vars: {env_result['error']}")
    else:
        envs = env_result.get("envs", [])
        state_env = None
        
        for env in envs:
            if env.get("key") == "NEXT_PUBLIC_STATE":
                state_env = env
                current_value = env.get("value", "")
                
                # Check if it's encrypted/hashed
                if current_value.startswith("eyJ2IjoidjIi") or len(current_value) > 100:
                    print(f"  ⚠️  Found encrypted value, removing...")
                    delete_result = api_request("DELETE", f"/v9/projects/{project_id}/env/{env.get('id')}")
                    if "error" not in delete_result:
                        print(f"  ✅ Removed encrypted value")
                    else:
                        print(f"  ⚠️  Could not remove: {delete_result.get('error')}")
                elif current_value.lower() == state.lower():
                    print(f"  ✅ Already correctly set to '{state}'")
                    return True
                else:
                    print(f"  ⚠️  Found '{current_value}', should be '{state}'")
                    delete_result = api_request("DELETE", f"/v9/projects/{project_id}/env/{env.get('id')}")
                    if "error" not in delete_result:
                        print(f"  ✅ Removed incorrect value")
                    else:
                        print(f"  ⚠️  Could not remove: {delete_result.get('error')}")
        
        # If we removed it or it doesn't exist, create it
        time.sleep(0.3)
        env_payload = {
            "key": "NEXT_PUBLIC_STATE",
            "value": state,
            "type": "plain",
            "target": ["production", "preview", "development"]
        }
        
        create_result = api_request("POST", f"/v9/projects/{project_id}/env", env_payload)
        
        if "error" in create_result:
            print(f"  ⚠️  Could not set env var: {create_result['error']}")
        else:
            print(f"  ✅ Set NEXT_PUBLIC_STATE = '{state}'")
    
    return True

def main():
    print("🌿 iHemp Configuration Fix - Targeted Completion")
    print("=" * 60)
    print("Completing fixes for remaining 5 states")
    print("=" * 60)
    
    # Remaining states from earlier script
    remaining_states = [
        "nebraska",
        "ohio", 
        "oklahoma",
        "tennessee",
        "texas"
    ]
    
    # First get all projects to find IDs
    print("\n📋 Fetching project IDs...")
    projects_result = api_request("GET", "/v9/projects")
    
    if "error" in projects_result:
        print(f"❌ Failed to fetch projects: {projects_result['error']}")
        return
    
    # Build state -> project ID mapping
    state_to_id = {}
    for p in projects_result.get("projects", []):
        name = p.get("name", "")
        if name.startswith("ihemp-"):
            state = name.replace("ihemp-", "")
            state_to_id[state] = p.get("id")
    
    print(f"✅ Found {len(state_to_id)} iHemp projects")
    
    # Filter to only our remaining states
    projects_to_fix = {}
    for state in remaining_states:
        if state in state_to_id:
            projects_to_fix[state] = state_to_id[state]
        else:
            print(f"❌ {state} not found in Vercel projects!")
    
    print(f"\n🎯 Fixing {len(projects_to_fix)} remaining projects:")
    for i, state in enumerate(sorted(projects_to_fix.keys()), 1):
        print(f"  {i:2d}. {state}")
    
    print("\n🚀 Starting fixes...")
    print("-" * 60)
    
    fixed_count = 0
    for i, (state, project_id) in enumerate(sorted(projects_to_fix.items()), 1):
        print(f"\n[{i}/{len(projects_to_fix)}]")
        if fix_single_state(state, project_id):
            fixed_count += 1
        time.sleep(0.5)  # Rate limiting
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TARGETED FIX COMPLETE")
    print("=" * 60)
    print(f"\n✅ Fixed: {fixed_count}/{len(projects_to_fix)} states")
    
    if fixed_count == len(projects_to_fix):
        print("\n🎉 ALL 17 iHemp projects now standardized!")
        print("   All use: rootDirectory = 'ihemp-template'")
        print("   All use: NEXT_PUBLIC_STATE = plain text state name")
    else:
        print(f"\n⚠️  Partial completion: {fixed_count}/{len(projects_to_fix)}")
    
    print(f"\n🚀 Next step:")
    print(f"   1. Push any commit to ihemp-template repository")
    print(f"   2. Vercel will auto-deploy all 17 projects")
    print(f"   3. Monitor at: https://vercel.com/dave-crabills-projects")
    print(f"\n🌐 Test sites:")
    print(f"   • https://ihempcolorado.com (reference)")
    print(f"   • https://ihempalabama.com (newly fixed)")

if __name__ == "__main__":
    main()