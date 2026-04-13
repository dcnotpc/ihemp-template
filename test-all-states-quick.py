#!/usr/bin/env python3
"""
Quick test of all 17 iHemp state sites after Alabama success report.
"""

import subprocess
import time
import concurrent.futures

states = [
    "alabama", "arkansas", "california", "colorado", "florida",
    "georgia", "indiana", "iowa", "kansas", "kentucky",
    "michigan", "mississippi", "nebraska", "ohio", "oklahoma",
    "tennessee", "texas"
]

def test_state(state):
    """Test a single state's website."""
    url = f"https://ihemp{state}.com"
    start = time.time()
    
    try:
        result = subprocess.run(
            ["curl", "-s", "-I", "-m", "10", url],
            capture_output=True,
            text=True,
            timeout=12
        )
        
        elapsed = time.time() - start
        
        if result.returncode == 0:
            lines = result.stdout.split('\n')
            status = lines[0].strip() if lines else "No response"
            
            # Check for specific status codes
            if "200" in status:
                return state, "✅ LIVE", status, elapsed
            elif "307" in status or "301" in status:
                # Follow redirect to see where it goes
                redirect_result = subprocess.run(
                    ["curl", "-s", "-L", "-m", "10", url],
                    capture_output=True,
                    text=True,
                    timeout=15
                )
                if redirect_result.returncode == 0:
                    content = redirect_result.stdout.lower()
                    if "ihemp" in content or "hemp" in content or "welcome" in content:
                        return state, "✅ LIVE (redirect)", status, elapsed
                    else:
                        return state, "⚠️  REDIRECT UNKNOWN", status, elapsed
                else:
                    return state, "⚠️  REDIRECT ERROR", status, elapsed
            elif "404" in status:
                return state, "❌ 404", status, elapsed
            elif "502" in status or "503" in status or "504" in status:
                return state, "🔄 BUILDING", status, elapsed
            else:
                return state, f"❓ {status}", status, elapsed
        else:
            return state, "❌ CURL ERROR", "Failed", elapsed
            
    except subprocess.TimeoutExpired:
        return state, "⏱️ TIMEOUT", "Timeout", time.time() - start
    except Exception as e:
        return state, f"❌ ERROR: {str(e)[:20]}", "Exception", time.time() - start

print("🌿 Testing All 17 iHemp State Sites")
print("=" * 70)
print(f"Testing at: {time.strftime('%Y-%m-%d %H:%M:%S EDT')}")
print()

# Test all states with threading for speed
results = []
with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
    future_to_state = {executor.submit(test_state, state): state for state in states}
    for future in concurrent.futures.as_completed(future_to_state):
        state = future_to_state[future]
        try:
            result = future.result(timeout=15)
            results.append(result)
        except Exception as e:
            results.append((state, f"❌ TEST ERROR: {str(e)[:20]}", "Exception", 0))

# Sort by status
results.sort(key=lambda x: x[1])

# Print results
live_count = 0
building_count = 0
error_count = 0

for state, status, http_status, elapsed in results:
    print(f"{state:15} {status:25} ({http_status[:30]:30}) {elapsed:.1f}s")
    
    if "✅" in status:
        live_count += 1
    elif "🔄" in status:
        building_count += 1
    else:
        error_count += 1

print()
print("=" * 70)
print(f"📊 SUMMARY: {live_count} LIVE | {building_count} BUILDING | {error_count} NEEDS ATTENTION")

# Quick Vercel API check for deployments
print("\n⚡ Checking Vercel deployment status via API...")
try:
    import json
    import urllib.request
    
    API_TOKEN = "vcp_2gmyM4JYDx9RG4qVW8e4afW5qfdhZd3wzX5XGLJw3x0JWvPOCn1ak7CF"
    API_BASE = "https://api.vercel.com"
    
    headers = {
        "Authorization": f"Bearer {API_TOKEN}",
        "Content-Type": "application/json"
    }
    
    # Get recent deployments
    request = urllib.request.Request(
        f"{API_BASE}/v6/deployments?teamId=team_gAWYEUWwVRpqT06PnaREKizB&limit=10",
        headers=headers
    )
    
    with urllib.request.urlopen(request) as response:
        deployments = json.loads(response.read().decode('utf-8'))
        deploys = deployments.get("deployments", [])
        
        print(f"Latest {len(deploys)} deployments:")
        for d in deploys[:5]:
            name = d.get("name", "unknown")
            state = d.get("state", "unknown")
            created = d.get("createdAt", 0)
            print(f"  • {name}: {state}")
            
except Exception as e:
    print(f"⚠️  Could not fetch Vercel deployments: {e}")

print()
print("🎯 Next steps:")
print("1. If all sites show ✅ LIVE: Network deployment complete!")
print("2. If 🔄 BUILDING: Wait 2-5 minutes for deployments to finish")
print("3. If ❌ errors: Check Vercel dashboard for specific build issues")
print()
print("🔗 Vercel Dashboard: https://vercel.com/teams/ESCMI")