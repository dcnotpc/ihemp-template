#!/usr/bin/env python3
import json
import urllib.request

API_TOKEN = "vcp_2gmyM4JYDx9RG4qVW8e4afW5qfdhZd3wzX5XGLJw3x0JWvPOCn1ak7CF"
API_BASE = "https://api.vercel.com"

def api_request(method, endpoint):
    url = f"{API_BASE}{endpoint}"
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    request = urllib.request.Request(url, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(request) as response:
            return json.loads(response.read().decode('utf-8'))
    except Exception as e:
        return {"error": str(e)}

print("Testing Vercel API connectivity...")
print(f"Token length: {len(API_TOKEN)} characters")

# Test 1: Get user info
print("\n1. Testing user authentication...")
user_result = api_request("GET", "/v2/user")
if "user" in user_result:
    print(f"✅ Authenticated as: {user_result['user'].get('name')} ({user_result['user'].get('email')})")
    print(f"   User ID: {user_result['user'].get('id')}")
else:
    print(f"❌ Failed: {user_result.get('error', 'unknown')}")

# Test 2: Get projects
print("\n2. Testing projects endpoint...")
projects_result = api_request("GET", "/v9/projects")
if "projects" in projects_result:
    print(f"✅ Found {len(projects_result['projects'])} total projects")
    
    ihemp_projects = [p for p in projects_result['projects'] if p.get('name', '').startswith('ihemp-')]
    print(f"   Found {len(ihemp_projects)} iHemp projects")
    
    for p in ihemp_projects[:5]:  # Show first 5
        print(f"   • {p.get('name')}: id={p.get('id')}, framework={p.get('framework', 'unknown')}")
else:
    print(f"❌ Failed: {projects_result.get('error', 'unknown')}")

print("\nAPI test complete.")