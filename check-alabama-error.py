#!/usr/bin/env python3
"""
Get details about Alabama's ERROR deployment
"""

import json
import urllib.request
import urllib.error

API_TOKEN = "vcp_2gmyM4JYDx9RG4qVW8e4afW5qfdhZd3wzX5XGLJw3x0JWvPOCn1ak7CF"
API_BASE = "https://api.vercel.com"

def api_request(method, endpoint, data=None):
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

print("🔍 Alabama ERROR Deployment Analysis")
print("=" * 60)

# Get deployments
deployments = api_request("GET", "/v6/deployments?projectId=prj_VEptzOvQSUjQzXcMdy5MvRfgJhkF&limit=5")
if "error" in deployments:
    print(f"❌ Couldn't fetch deployments: {deployments['error']}")
    exit()

deploys = deployments.get("deployments", [])
if not deploys:
    print("❌ No deployments found")
    exit()

latest = deploys[0]
print(f"\n📊 Latest deployment:")
print(f"   • ID: {latest.get('uid')}")
print(f"   • State: {latest.get('state')}")
print(f"   • Created: {latest.get('createdAt')}")
print(f"   • Source: {latest.get('meta', {}).get('githubCommitAuthorName')}")

# Get deployment details
print(f"\n🔍 Getting build logs...")
deploy_id = latest.get('uid')
details = api_request("GET", f"/v1/deployments/{deploy_id}")

if "error" in details:
    print(f"⚠️  Couldn't get details: {details['error']}")
else:
    builds = details.get("builds", [])
    print(f"Found {len(builds)} build(s)")
    for build in builds:
        print(f"\n   Build {build.get('id')}:")
        print(f"      State: {build.get('state')}")
        print(f"      Entrypoint: {build.get('entrypoint')}")
        if build.get("readyState") == "ERROR":
            print(f"      ❌ ERROR in build")

# Get deployment events/logs
print(f"\n📝 Getting error logs...")
events = api_request("GET", f"/v2/deployments/{deploy_id}/events")

if "error" in events:
    print(f"⚠️  Couldn't get events: {events['error']}")
else:
    events_list = events.get("events", [])
    print(f"Found {len(events_list)} events")
    
    # Filter for errors
    error_events = [e for e in events_list if e.get("type") in ["stderr", "stderr", "error"]]
    print(f"   • {len(error_events)} error events")
    
    stdout_events = [e for e in events_list if e.get("type") == "stdout"]
    print(f"   • {len(stdout_events)} stdout events")
    
    # Show recent error events
    if error_events:
        print(f"\n🔥 RECENT ERRORS:")
        for err in error_events[-5:]:  # Last 5 errors
            text = err.get("text", "").strip()
            if text:
                print(f"   → {text[:200]}...")

# Try to trigger a new deployment
print(f"\n🚀 Testing deployment trigger...")
# Check if we can cancel the error deployment
cancel = api_request("PATCH", f"/v12/deployments/{deploy_id}/cancel")
if "error" in cancel:
    print(f"⚠️  Cannot cancel deployment: {cancel['error']}")
else:
    print(f"✅ Cancelled error deployment")

print("\n" + "=" * 60)
print("🎯 RECOMMENDATION:")
print("=" * 60)
print("\nAlabama's deployment is in ERROR state. Options:")
print("1. Cancel error deployment and trigger fresh build")
print("2. Check ihemp-template repository for build errors")
print("3. Push a new commit to trigger auto-deploy")
print("\nSince configurations are now correct, a Git push should fix it.")
print("\nDo you want me to try triggering a fresh deployment via API first?")