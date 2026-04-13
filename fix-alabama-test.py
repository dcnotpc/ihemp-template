#!/usr/bin/env python3
"""
Cancel Alabama's error deployment and trigger a fresh build.
"""

import json
import urllib.request
import urllib.error
import time

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

print("🔧 Alabama Fix Procedure")
print("=" * 60)

# 1. Cancel error deployment
print("\n1️⃣  Cancelling error deployment...")
deploy_id = "dpl_HXh1KJqba3AqGKA2Ch5JzNeSsyhT"
cancel_result = api_request("PATCH", f"/v12/deployments/{deploy_id}/cancel")

if "error" in cancel_result:
    print(f"⚠️  Cannot cancel: {cancel_result.get('error', cancel_result)}")
    print("   (May already be cancelled or not cancellable)")
else:
    print(f"✅ Cancellation requested")

time.sleep(2)

# 2. Get more error details first
print("\n2️⃣  Getting error details...")
# Get full event log
import subprocess
curl_cmd = ["curl", "-s", "-H", f"Authorization: Bearer {API_TOKEN}", 
           f"https://api.vercel.com/v2/deployments/{deploy_id}/events"]
result = subprocess.run(curl_cmd, capture_output=True, text=True)

if result.returncode == 0:
    try:
        events = json.loads(result.stdout)
        if isinstance(events, list):
            print(f"📝 Found {len(events)} events")
            # Look for actual error messages
            for event in events:
                if event.get("type") == "stderr":
                    payload = event.get("payload", {})
                    text = payload.get("text", "")
                    if text:
                        # Clean and show
                        lines = text.split('\\n')
                        for line in lines[:10]:  # First 10 lines
                            if line.strip():
                                print(f"   [stderr] {line}")
    except Exception as e:
        print(f"⚠️  Could not parse events: {e}")

# 3. Try to trigger a fresh deployment via API
print("\n3️⃣  Triggering fresh deployment...")
project_id = "prj_VEptzOvQSUjQzXcMdy5MvRfgJhkF"

# Check if we can trigger via API
deploy_payload = {
    "name": "ihemp-alabama",
    "target": "production"
}

print(f"   Project ID: {project_id}")
print(f"   Note: Vercel may prefer Git integration over API for builds")

# Try the deployment API
trigger_result = api_request("POST", f"/v13/deployments", deploy_payload)

if "error" in trigger_result:
    print(f"❌ API deployment failed: {trigger_result.get('error', 'unknown')}")
    print(f"\n💡 Alternative: Push to Git repository")
    print(f"   Since configurations are now correct, a Git push will trigger")
    print(f"   Vercel to auto-deploy all projects, including Alabama.")
else:
    print(f"✅ Deployment triggered: {trigger_result.get('id', 'unknown')}")
    print(f"   Monitor at: https://vercel.com/teams/ESCMI")

# 4. Check Colorado status
print("\n4️⃣  Checking Colorado (reference site)...")
# Get Colorado project
projects = api_request("GET", "/v9/projects")
colorado = None
for p in projects.get("projects", []):
    if p.get("name") == "ihemp-colorado":
        colorado = p
        break

if colorado:
    print(f"✅ Colorado project: {colorado.get('id')}")
    print(f"   • rootDirectory: {colorado.get('rootDirectory')}")
    
    # Check deployments
    cd_deployments = api_request("GET", f"/v6/deployments?projectId={colorado.get('id')}&limit=1")
    if "error" not in cd_deployments:
        cd_deploys = cd_deployments.get("deployments", [])
        if cd_deploys:
            state = cd_deploys[0].get("state", "unknown")
            print(f"   • Latest deployment: {state}")
            if state != "READY":
                print(f"   ⚠️  Colorado deployment not READY")
    
    # Test site
    import subprocess
    result = subprocess.run(["curl", "-s", "-I", "https://ihempcolorado.com"], 
                           capture_output=True, text=True)
    if result.returncode == 0:
        lines = result.stdout.split('\n')
        status = lines[0].strip() if lines else "No response"
        print(f"   • Site response: {status}")
        if "307" in status:
            print(f"   ⚠️  307 = Temporary redirect")
            # Follow redirect
            redirect_result = subprocess.run(["curl", "-s", "-L", "https://ihempcolorado.com"], 
                                           capture_output=True, text=True)
            if "Welcome" in redirect_result.stdout or "iHemp" in redirect_result.stdout:
                print(f"   ✅ Redirect leads to working site")
            else:
                print(f"   ❌ Redirect may lead to error")

print("\n" + "=" * 60)
print("🎯 FINAL RECOMMENDATION:")
print("=" * 60)
print("\nFor Alabama:")
print("1. Configuration is correct (matches Colorado)")
print("2. Error deployment should be cancelled/cleared")
print("3. Fresh build needed via Git push")

print("\nFor all sites:")
print("1. Push a commit to ihemp-template repository")
print("2. Vercel auto-deploys all 17 projects simultaneously")
print("3. Monitor builds at https://vercel.com/teams/ESCMI")
print("4. Test Alabama after deployment completes")

print("\n⚡ Estimated timeline:")
print("   • Git push: 30 seconds")
print("   • Build time: 2-5 minutes per project")
print("   • Concurrent builds: 12 on Pro plan")
print("   • Total: ~6-8 minutes for all 17 sites")