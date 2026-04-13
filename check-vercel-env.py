#!/usr/bin/env python3
"""
Check Vercel environment variables for Alabama project
"""

import json
import urllib.request
import sys

API_TOKEN = "vcp_2gmyM4JYDx9RG4qVW8e4afW5qfdhZd3wzX5XGLJw3x0JWvPOCn1ak7CF"
API_BASE = "https://api.vercel.com"

def get_environment_variables(project_id):
    """Get environment variables for a project."""
    url = f"{API_BASE}/v9/projects/{project_id}/env"
    
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    request = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(request) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        return {"error": str(e)}

def get_projects():
    """Get all projects."""
    url = f"{API_BASE}/v9/projects?teamId=team_gAWYEUWwVRpqT06PnaREKizB"
    
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    request = urllib.request.Request(url, headers=headers)
    
    try:
        with urllib.request.urlopen(request) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        return {"error": str(e)}

def find_alabama_project(projects):
    for project in projects.get("projects", []):
        if project.get("name") == "ihemp-alabama":
            return project
    return None

print("🔍 Checking Vercel Environment Variables for Alabama")
print("=" * 60)

# Get projects
projects_data = get_projects()
if "error" in projects_data:
    print(f"❌ Error fetching projects: {projects_data['error']}")
    sys.exit(1)

alabama_project = find_alabama_project(projects_data)
if not alabama_project:
    print("❌ Alabama project not found!")
    sys.exit(1)

print(f"✅ Found Alabama project: {alabama_project.get('id')}")
print()

# Get environment variables
env_vars = get_environment_variables(alabama_project.get('id'))
if "error" in env_vars:
    print(f"❌ Error fetching env vars: {env_vars['error']}")
    sys.exit(1)

print("📋 Environment Variables for ihemp-alabama:")
print("-" * 60)

found_state_var = False
for env in env_vars.get("envs", []):
    key = env.get("key", "")
    value = env.get("value", "")
    env_type = env.get("type", "")
    target = env.get("target", [])
    
    print(f"🔑 {key}:")
    print(f"   Value: {value[:50]}{'...' if len(value) > 50 else ''}")
    print(f"   Type: {env_type}")
    print(f"   Target: {target}")
    print()
    
    if key == "NEXT_PUBLIC_STATE":
        found_state_var = True
        if value.lower() != "alabama":
            print(f"❌ PROBLEM: NEXT_PUBLIC_STATE is '{value}', should be 'alabama'")
        else:
            print(f"✅ NEXT_PUBLIC_STATE correctly set to 'alabama'")

if not found_state_var:
    print("❌ CRITICAL: NEXT_PUBLIC_STATE environment variable not found!")
    print()
    print("🚨 This is why Alabama shows Colorado data.")
    print("   The build system needs NEXT_PUBLIC_STATE=alabama to know")
    print("   which state's data to use.")

# Also check the latest deployment
print()
print("📦 Latest Deployment Info:")
print("-" * 60)

try:
    import subprocess
    # Get deployment info
    deployment_cmd = [
        "curl", "-s", 
        "-H", f"Authorization: Bearer {API_TOKEN}",
        f"{API_BASE}/v6/deployments?projectId={alabama_project.get('id')}&limit=1"
    ]
    
    result = subprocess.run(deployment_cmd, capture_output=True, text=True)
    if result.returncode == 0:
        deployments = json.loads(result.stdout)
        if deployments.get("deployments"):
            deploy = deployments["deployments"][0]
            print(f"ID: {deploy.get('uid')}")
            print(f"State: {deploy.get('state')}")
            print(f"Created: {deploy.get('createdAt')}")
            print(f"Ready: {deploy.get('ready')}")
            print(f"Inspector URL: {deploy.get('inspectorUrl', 'N/A')}")
    else:
        print("Could not fetch deployment info")
except Exception as e:
    print(f"Error: {e}")

print()
print("🎯 Recommended Fix:")
print("=" * 60)
print("1. Go to Vercel dashboard: https://vercel.com/teams/ESCMI")
print("2. Select ihemp-alabama project")
print("3. Go to Settings → Environment Variables")
print("4. Add/update NEXT_PUBLIC_STATE with value 'alabama'")
print("5. Trigger a new deployment")
print()
print("Alternatively, use Vercel CLI:")
print("  vercel env add NEXT_PUBLIC_STATE alabama -p ihemp-alabama")