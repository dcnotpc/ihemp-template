#!/usr/bin/env python3
"""
Diagnose iHemp Vercel project configurations.
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

def get_project_details(project_id):
    """Get detailed project configuration."""
    result = api_request("GET", f"/v9/projects/{project_id}")
    if "error" in result:
        print(f"❌ Error fetching project {project_id}: {result['error']}")
        return None
    return result

def get_project_env_vars(project_id):
    """Get environment variables for a project."""
    result = api_request("GET", f"/v9/projects/{project_id}/env")
    if "error" in result:
        print(f"⚠️  Error fetching env vars for {project_id}: {result['error']}")
        return []
    return result.get("envs", [])

def get_latest_deployment(project_id):
    """Get latest deployment status."""
    result = api_request("GET", f"/v6/deployments?projectId={project_id}&limit=1")
    if "error" in result:
        return {"status": "error-checking"}
    
    deployments = result.get("deployments", [])
    if not deployments:
        return {"status": "no-deployments"}
    
    latest = deployments[0]
    return {
        "status": latest.get("state", "unknown"),
        "readyState": latest.get("readyState", "unknown"),
        "url": latest.get("url", None),
        "error": latest.get("error", None)
    }

def main():
    print("🌿 iHemp Vercel Project Diagnostic")
    print("=" * 80)
    
    # Get all projects
    print("\n📋 Fetching all projects...")
    result = api_request("GET", "/v9/projects")
    if "error" in result:
        print(f"❌ Error: {result['error']}")
        return
    
    projects = []
    for p in result.get("projects", []):
        name = p.get("name", "")
        if name.startswith("ihemp-") and name != "test-ihemp-api":
            projects.append({
                "name": name,
                "id": p.get("id"),
                "framework": p.get("framework", "unknown")
            })
    
    print(f"✅ Found {len(projects)} iHemp projects")
    
    # Compare configurations
    print("\n🔍 Comparing configurations (Colorado vs Others):")
    print("-" * 80)
    
    colorado_config = None
    other_configs = []
    
    for proj in projects:
        state = proj["name"].replace("ihemp-", "")
        details = get_project_details(proj["id"])
        
        if not details:
            continue
        
        config = {
            "state": state,
            "name": proj["name"],
            "id": proj["id"],
            "framework": details.get("framework"),
            "buildCommand": details.get("buildCommand"),
            "installCommand": details.get("installCommand"),
            "outputDirectory": details.get("outputDirectory"),
            "rootDirectory": details.get("rootDirectory"),
            "publicSource": details.get("publicSource"),
            "gitRepository": details.get("gitRepository", {}),
            "envVars": get_project_env_vars(proj["id"]),
            "deployment": get_latest_deployment(proj["id"])
        }
        
        if state == "colorado":
            colorado_config = config
        else:
            other_configs.append(config)
    
    # Print Colorado configuration
    if colorado_config:
        print("\n✅ COLORADO (Working Reference):")
        print(f"  Framework: {colorado_config['framework']}")
        print(f"  Build command: {colorado_config['buildCommand']}")
        print(f"  Install command: {colorado_config['installCommand']}")
        print(f"  Output directory: {colorado_config['outputDirectory']}")
        print(f"  Root directory: {colorado_config['rootDirectory']}")
        print(f"  Git repo: {colorado_config['gitRepository'].get('repo', 'N/A')}")
        
        # Check NEXT_PUBLIC_STATE
        next_state_var = None
        for env in colorado_config["envVars"]:
            if env.get("key") == "NEXT_PUBLIC_STATE":
                next_state_var = env.get("value")
                break
        
        print(f"  NEXT_PUBLIC_STATE: {next_state_var}")
        print(f"  Deployment status: {colorado_config['deployment']['status']}")
        
        if colorado_config['deployment']['error']:
            print(f"  Deployment error: {colorado_config['deployment']['error']}")
    
    # Compare differences
    print("\n🔍 CONFIGURATION DIFFERENCES FOUND:")
    print("-" * 80)
    
    issues_found = 0
    
    for config in other_configs:
        issues = []
        
        # Check root directory
        if config["rootDirectory"] != colorado_config["rootDirectory"]:
            issues.append(f"rootDirectory: {config['rootDirectory']} != {colorado_config['rootDirectory']}")
        
        # Check build command
        if config["buildCommand"] != colorado_config["buildCommand"]:
            issues.append(f"buildCommand: {config['buildCommand']} != {colorado_config['buildCommand']}")
        
        # Check install command
        if config["installCommand"] != colorado_config["installCommand"]:
            issues.append(f"installCommand: {config['installCommand']} != {colorado_config['installCommand']}")
        
        # Check output directory
        if config["outputDirectory"] != colorado_config["outputDirectory"]:
            issues.append(f"outputDirectory: {config['outputDirectory']} != {colorado_config['outputDirectory']}")
        
        # Check NEXT_PUBLIC_STATE env var
        has_state_var = False
        for env in config["envVars"]:
            if env.get("key") == "NEXT_PUBLIC_STATE":
                has_state_var = True
                if env.get("value") != config["state"]:
                    issues.append(f"NEXT_PUBLIC_STATE value mismatch: {env.get('value')} != {config['state']}")
                break
        
        if not has_state_var:
            issues.append("Missing NEXT_PUBLIC_STATE environment variable")
        
        if issues:
            issues_found += 1
            print(f"\n⚠️  {config['state'].upper():<12} - {len(issues)} issues:")
            for issue in issues:
                print(f"   • {issue}")
    
    # Summary
    print("\n" + "=" * 80)
    print("📊 DIAGNOSTIC SUMMARY")
    print("=" * 80)
    
    if colorado_config:
        print(f"\n✅ Colorado (working reference) configuration:")
        print(f"   • Root directory: {colorado_config['rootDirectory']}")
        print(f"   • Build command: {colorado_config['buildCommand']}")
        print(f"   • Framework: {colorado_config['framework']}")
    
    print(f"\n🔍 Issues found in {issues_found} of {len(other_configs)} other projects")
    
    if issues_found > 0:
        print("\n🎯 RECOMMENDED FIXES:")
        print("   1. Update all projects to match Colorado's rootDirectory: 'ihemp-template'")
        print("   2. Remove explicit buildCommand (use Vercel Next.js defaults)")
        print("   3. Ensure NEXT_PUBLIC_STATE environment variable exists for each state")
        print("   4. Trigger fresh deployments after configuration updates")
        
        print("\n🚀 NEXT STEP: Run fix script to standardize configurations")
    else:
        print("\n✅ All configurations match Colorado. Issue may be elsewhere.")

if __name__ == "__main__":
    main()