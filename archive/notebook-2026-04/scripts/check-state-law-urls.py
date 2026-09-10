#!/usr/bin/env python3
"""
Check which states have missing law URLs.
"""

import os
import re

deployed_states = [
    "alabama", "arkansas", "california", "colorado", "florida",
    "georgia", "indiana", "iowa", "kansas", "kentucky",
    "michigan", "mississippi", "nebraska", "ohio", "oklahoma",
    "tennessee", "texas"
]

states_dir = "/home/dcnotpc420/.openclaw/workspace/ihemp-template/src/data/states"

def check_state_laws(state_slug):
    filepath = f"{states_dir}/{state_slug}.ts"
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Extract laws array
    laws_match = re.search(r'laws: \[(.*?)\],', content, re.DOTALL)
    if not laws_match:
        return {"error": "No laws array found"}
    
    laws_content = laws_match.group(1)
    # Find individual law objects
    law_objects = re.findall(r'\{.*?\}', laws_content, re.DOTALL)
    
    laws = []
    missing_urls = 0
    total_laws = len(law_objects)
    
    for i, law_obj in enumerate(law_objects):
        # Extract title and URL
        title_match = re.search(r'title:\s*"([^"]+)"', law_obj)
        url_match = re.search(r'url:\s*"([^"]*)"', law_obj)
        year_match = re.search(r'year:\s*(\d+)', law_obj)
        
        title = title_match.group(1) if title_match else f"Law {i+1}"
        url = url_match.group(1) if url_match else ""
        year = year_match.group(1) if year_match else ""
        
        is_missing = url == ""
        
        laws.append({
            "title": title,
            "url": url,
            "year": year,
            "missing": is_missing
        })
        
        if is_missing:
            missing_urls += 1
    
    return {
        "total_laws": total_laws,
        "missing_urls": missing_urls,
        "laws": laws
    }

print("🌿 Checking State Law URLs")
print("=" * 80)

states_with_missing = []
all_missing_count = 0

for state in deployed_states:
    result = check_state_laws(state)
    
    if "error" in result:
        print(f"{state:15} ❌ {result['error']}")
        continue
    
    missing_count = result["missing_urls"]
    total = result["total_laws"]
    
    if missing_count > 0:
        status = f"❌ {missing_count}/{total} URLs missing"
        states_with_missing.append((state, missing_count, result["laws"]))
        all_missing_count += missing_count
    else:
        status = f"✅ {total} laws, all URLs present"
    
    print(f"{state:15} {status}")

print()
print("📊 Summary:")
print(f"• States with missing law URLs: {len(states_with_missing)}/17")
print(f"• Total missing URLs: {all_missing_count}")
print()

if states_with_missing:
    print("🔍 States needing law URL research:")
    print("-" * 80)
    
    for state, missing_count, laws in states_with_missing:
        print(f"\n{state.upper()}:")
        for law in laws:
            if law["missing"]:
                print(f"  • {law['title']} ({law['year']}) - URL MISSING")
                # Suggest search query
                query = law["title"].replace(" ", "+") + "+" + state
                print(f"    Search: https://search.brave.com/search?q={query}")
            else:
                print(f"  • {law['title']} ({law['year']}) - URL OK: {law['url'][:60]}...")

# Also check regulatory URLs
print()
print("🔗 Checking Regulatory URLs:")
print("-" * 80)

for state in deployed_states:
    filepath = f"{states_dir}/{state}.ts"
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Find regulatoryUrl
    reg_match = re.search(r'regulatoryUrl:\s*"([^"]*)"', content)
    reg_url = reg_match.group(1) if reg_match else ""
    
    if not reg_url or reg_url.strip() == "":
        print(f"{state:15} ❌ Regulatory URL missing")
    else:
        print(f"{state:15} ✅ Regulatory URL present")