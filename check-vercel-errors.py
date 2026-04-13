#!/usr/bin/env python3
"""
Check Vercel deployment errors for iHemp projects.
"""

import json
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
    print("🌿 Checking Vercel deployment failures...")
    print("=" * 60)
    
    # First, check Colorado (should be working based on user report)
    print("\n🔍 Checking Colorado (reference project)...")
    
    # Get Colorado project ID
    result = api_request("GET", "/v9/projects")
    if "error" in result:
        print(f"❌ Error fetching projects: {result['error']}")
        return
    
    colorado_id = None
    for p in result.get("projects", []):
        if p.get("name") == "ihemp-colorado":
            colorado_id = p.get("id")
            break
    
    if not colorado_id:
        print("❌ Colorado project not found")
        return
    
    print(f"✅ Colorado project ID: {colorado_id}")
    
    # Get Colorado deployments
    deployments = api_request("GET", f"/v6/deployments?projectId={colorado_id}&limit=3")
    
    if "error" in deployments:
        print(f"❌ Error fetching deployments: {deployments['error']}")
        return
    
    deployments_list = deployments.get("deployments", [])
    print(f"Found {len(deployments_list)} deployments for Colorado")
    
    for i, deploy in enumerate(deployments_list[:2]):
        print(f"\nDeployment #{i+1}:")
        print(f"  ID: {deploy.get('id')}")
        print(f"  State: {deploy.get('state')}")
        print(f"  ReadyState: {deploy.get('readyState')}")
        print(f"  Created: {deploy.get('createdAt', '')[:19]}")
        
        # Get build logs if available
        if 'id' in deploy:
            deploy_id = deploy['id']
            builds = api_request("GET", f"/v6/deployments/{deploy_id}/builds")
            
            if "error" not in builds:
                builds_list = builds.get("builds", [])
                if builds_list:
                    print(f"  Found {len(builds_list)} builds")
                    for build in builds_list:
                        if 'error' in build and build['error']:
                            print(f"  ❌ Build error: {build['error']}")
                        if 'output' in build and build['output']:
                            # Look for specific error patterns
                            output = build['output']
                            if 'error' in output.lower():
                                print(f"  ⚠️  Error in output: {output[:300]}...")
    
    # Check a failing project
    print("\n" + "=" * 60)
    print("🔍 Checking a newly created project (e.g., Texas)...")
    
    texas_id = None
    for p in result.get("projects", []):
        if p.get("name") == "ihemp-texas":
            texas_id = p.get("id")
            break
    
    if texas_id:
        print(f"✅ Texas project ID: {texas_id}")
        
        # Get project configuration
        project_config = api_request("GET", f"/v9/projects/{texas_id}")
        if "error" not in project_config:
            print(f"  Framework: {project_config.get('framework', 'Not set')}")
            print(f"  Build command: {project_config.get('buildCommand', 'Default')}")
            print(f"  Install command: {project_config.get('installCommand', 'Default')}")
            print(f"  Output directory: {project_config.get('outputDirectory', 'Default')}")
    
    # Check environment variables
    print("\n" + "=" * 60)
    print("🔍 Checking environment variables for a project...")
    
    if colorado_id:
        env_vars = api_request("GET", f"/v9/projects/{colorado_id}/env")
        if "error" not in env_vars:
            envs = env_vars.get("envs", [])
            print(f"Colorado has {len(envs)} environment variables:")
            for env in envs:
                if env.get("key") == "NEXT_PUBLIC_STATE":
                    print(f"  ✅ {env['key']}: {env.get('value', 'Not set')}")
                else:
                    print(f"  • {env['key']}: {env.get('value', 'Not set')}")
    
    print("\n" + "=" * 60)
    print("💡 Common issues to check:")
    print("1. Next.js version compatibility")
    print("2. Build/install commands")
    print("3. Environment variables (NEXT_PUBLIC_STATE)")
    print("4. Node.js version compatibility")
    print("5. Framework detection (should be 'nextjs')")
    print("\n🔗 Check dashboard: https://vercel.com/dave-crabills-projects")

if __name__ == "__main__":
    main()