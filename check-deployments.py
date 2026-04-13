#!/usr/bin/env python3
"""
Check deployment status and triggers for all iHemp projects.
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
        return {"error": error_body, "status": e.code}
    except Exception as e:
        return {"error": str(e)}

def get_all_ihemp_projects():
    """Get all iHemp projects."""
    result = api_request("GET", "/v9/projects")
    if "error" in result:
        return {}
    
    projects = {}
    for p in result.get("projects", []):
        name = p.get("name", "")
        if name.startswith("ihemp-") and name != "test-ihemp-api":
            projects[name] = {
                "id": p.get("id"),
                "framework": p.get("framework"),
                "rootDirectory": p.get("rootDirectory")
            }
    
    return projects

def get_project_deployments(project_id):
    """Get latest deployments for a project."""
    result = api_request("GET", f"/v6/deployments?projectId={project_id}&limit=3")
    if "error" in result:
        return []
    
    return result.get("deployments", [])

def get_project_env_vars(project_id):
    """Get environment variables for a project."""
    result = api_request("GET", f"/v9/projects/{project_id}/env")
    if "error" in result:
        return []
    
    return result.get("envs", [])

def test_deployment_trigger(project_id, project_name):
    """Test triggering a deployment."""
    payload = {
        "name": project_name,
        "project": project_id,
        "target": "production"
    }
    
    result = api_request("POST", "/v13/deployments", payload)
    
    if "error" in result:
        return {"success": False, "error": result["error"]}
    
    return {"success": True, "deployment_id": result.get("id"), "url": result.get("url")}

def main():
    print("🌿 iHemp Deployment Status Check")
    print("=" * 70)
    
    # Get all projects
    projects = get_all_ihemp_projects()
    
    if not projects:
        print("❌ No iHemp projects found")
        return
    
    print(f"✅ Found {len(projects)} iHemp projects")
    
    # Check each project
    for name, project in sorted(projects.items()):
        project_id = project["id"]
        state = name.replace("ihemp-", "")
        
        print(f"\n📋 {name.upper()}:")
        print(f"   ID: {project_id}")
        print(f"   Framework: {project.get('framework', 'unknown')}")
        print(f"   Root directory: {project.get('rootDirectory', 'None')}")
        
        # Check environment variables
        env_vars = get_project_env_vars(project_id)
        has_next_public_state = False
        next_public_state_value = None
        
        for env in env_vars:
            if env.get("key") == "NEXT_PUBLIC_STATE":
                has_next_public_state = True
                next_public_state_value = env.get("value", "")
                # Don't show encrypted values
                if len(next_public_state_value) > 50:
                    next_public_state_value = f"[ENCRYPTED {len(next_public_state_value)} chars]"
                break
        
        print(f"   NEXT_PUBLIC_STATE: {'✅' if has_next_public_state else '❌'}")
        if has_next_public_state and next_public_state_value:
            print(f"     Value: {next_public_state_value}")
        
        # Check deployments
        deployments = get_project_deployments(project_id)
        
        if deployments:
            print(f"   Latest deployments: {len(deployments)}")
            for i, deployment in enumerate(deployments[:2]):  # Show latest 2
                state_status = deployment.get("state", "unknown")
                ready_state = deployment.get("readyState", "unknown")
                created = deployment.get("createdAt", "unknown")
                url = deployment.get("url", "N/A")
                
                print(f"   [{i+1}] State: {state_status}, Ready: {ready_state}")
                print(f"       Created: {created}")
                print(f"       URL: {url}")
        else:
            print(f"   Deployments: ❌ No deployments found")
        
        # Test deployment trigger for Colorado first to see if it works
        if state == "colorado":
            print(f"\n   🔧 Testing deployment trigger...")
            test_result = test_deployment_trigger(project_id, name)
            
            if test_result["success"]:
                print(f"   ✅ Trigger successful!")
                print(f"      Deployment ID: {test_result.get('deployment_id')}")
                print(f"      URL: {test_result.get('url')}")
            else:
                error_text = test_result.get("error", "Unknown error")
                # Try to parse JSON error
                try:
                    error_obj = json.loads(error_text)
                    if "error" in error_obj:
                        error_msg = error_obj["error"].get("message", str(error_obj))
                        print(f"   ❌ Trigger failed: {error_msg}")
                    else:
                        print(f"   ❌ Trigger failed: {error_obj}")
                except:
                    print(f"   ❌ Trigger failed: {error_text[:200]}...")

if __name__ == "__main__":
    main()