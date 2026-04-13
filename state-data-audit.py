#!/usr/bin/env python3
"""
Audit state data files for completeness and accuracy.
"""

import os
import re
import json
import subprocess

# List of 17 deployed states (based on Vercel projects)
deployed_states = [
    "alabama", "arkansas", "california", "colorado", "florida",
    "georgia", "indiana", "iowa", "kansas", "kentucky",
    "michigan", "mississippi", "nebraska", "ohio", "oklahoma",
    "tennessee", "texas"
]

states_dir = "/home/dcnotpc420/.openclaw/workspace/ihemp-template/src/data/states"

def check_state_file(state_slug):
    """Check completeness of a state data file."""
    filepath = f"{states_dir}/{state_slug}.ts"
    
    if not os.path.exists(filepath):
        return {"status": "missing", "file": filepath}
    
    with open(filepath, 'r') as f:
        content = f.read()
    
    # Extract and parse State object
    try:
        # Find the export const section
        match = re.search(r'export const \w+: State = ({.*?})', content, re.DOTALL)
        if not match:
            match = re.search(r'export const \w+ = ({.*?})', content, re.DOTALL)
        
        if not match:
            return {"status": "parse_error", "file": filepath}
        
        # Try to parse as JSON (simplified approach)
        obj_str = match.group(1)
        
        # Quick checks for key fields
        checks = {
            "has_name": '"name"' in obj_str or "'name'" in obj_str,
            "has_summary": '"summary"' in obj_str or "'summary'" in obj_str,
            "has_laws": '"laws"' in obj_str and '[]' not in obj_str,  # Check not empty array
            "has_thc_limit": '"thcLimit"' in obj_str or "'thcLimit'" in obj_str,
            "has_licensing_info": '"licensingInfo"' in obj_str or "'licensingInfo'" in obj_str,
            "has_regulatory_body": '"regulatoryBody"' in obj_str or "'regulatoryBody'" in obj_str,
            "has_regulatory_url": '"regulatoryUrl"' in obj_str and '""' not in obj_str and "''" not in obj_str,
            "has_status": '"status"' in obj_str or "'status'" in obj_str,
        }
        
        # Check if summary is placeholder
        placeholder_indicators = [
            "currently being researched",
            "Information pending",
            "pending research",
            "needs to be collected",
            "placeholder",
            "TBD",
            "TODO",
        ]
        
        has_placeholder = False
        for indicator in placeholder_indicators:
            if indicator.lower() in obj_str.lower():
                has_placeholder = True
                break
        
        # Count non-empty laws
        laws_match = re.search(r'laws: \[(.*?)\]', content, re.DOTALL)
        law_count = 0
        if laws_match:
            laws_content = laws_match.group(1)
            # Count non-empty law objects
            law_objects = re.findall(r'{.*?}', laws_content)
            law_count = len(law_objects)
        
        # Check lastUpdated
        last_updated_match = re.search(r"lastUpdated: '([^']+)'", content)
        last_updated = last_updated_match.group(1) if last_updated_match else "unknown"
        
        return {
            "status": "exists",
            "file": filepath,
            "has_placeholder": has_placeholder,
            "law_count": law_count,
            "last_updated": last_updated,
            **checks
        }
        
    except Exception as e:
        return {"status": f"error: {str(e)}", "file": filepath}

print("🌿 iHemp State Data Audit Report")
print("=" * 80)
print(f"Auditing {len(deployed_states)} deployed state data files")
print()

results = []
for state in deployed_states:
    result = check_state_file(state)
    results.append((state, result))

# Calculate statistics
total = len(results)
with_data = 0
with_laws = 0
with_urls = 0
completed = []

for state, result in results:
    if result.get("status") == "exists":
        with_data += 1
        if result.get("has_laws", False):
            with_laws += 1
        if result.get("has_regulatory_url", False):
            with_urls += 1
        if not result.get("has_placeholder", True):
            completed.append(state)

print("📊 SUMMARY STATISTICS:")
print(f"• Total states deployed: {total}")
print(f"• State data files exist: {with_data}/{total}")
print(f"• States with law entries: {with_laws}/{total}")
print(f"• States with regulatory URLs: {with_urls}/{total}")
print(f"• States with completed data: {len(completed)}/{total}")
print()

print("📋 DETAILED STATE AUDIT:")
print("-" * 80)

for state, result in results:
    if result["status"] == "exists":
        status_emoji = "✅" if not result.get("has_placeholder", True) else "⚠️"
        laws_emoji = "✅" if result.get("has_laws", False) else "❌"
        url_emoji = "✅" if result.get("has_regulatory_url", False) else "❌"
        
        print(f"{state:15} {status_emoji} Data exists")
        if result.get("has_placeholder", False):
            print(f"                ⚠️  Contains placeholder text")
        print(f"                📜 Laws: {result.get('law_count', 0)} entries {laws_emoji}")
        print(f"                🔗 Regulatory URL: {url_emoji}")
        print(f"                📅 Last updated: {result.get('last_updated', 'unknown')}")
    elif result["status"] == "missing":
        print(f"{state:15} ❌ File missing")
    else:
        print(f"{state:15} ❌ {result['status']}")

print()
print("🎯 PRIORITY ACTIONS:")
print("=" * 80)

# Identify incomplete states
incomplete = []
for state, result in results:
    if result.get("status") == "exists" and result.get("has_placeholder", True):
        incomplete.append(state)
    elif result.get("status") != "exists":
        incomplete.append(state)

if incomplete:
    print(f"1. Update {len(incomplete)} states with placeholder/incomplete data:")
    for i, state in enumerate(incomplete):
        print(f"   {i+1}. {state}")
    
    # Provide template for data collection
    print()
    print("2. Data needed for each state:")
    print("   • Summary: 2-3 sentence overview of hemp legality")
    print("   • THC limit: Specific state requirement")
    print("   • Key laws: List of major hemp legislation with URLs")
    print("   • Licensing info: How to get licensed in the state")
    print("   • Regulatory body & URL: Official state agency")
    print("   • Resources: Program, license portal, testing links")
    print()
    
    print("3. Sample research sources:")
    print("   • State Department of Agriculture websites")
    print("   • Official state hemp program pages")
    print("   • Legislative bill tracking sites")
    print("   • USDA hemp programs directory")
    print("   • NORML state hemp law guides")
    print()

# Generate quick edit commands
print("🛠️  QUICK EDIT COMMANDS:")
print("-" * 80)
for state, result in results:
    if result.get("status") == "exists" and result.get("has_placeholder", True):
        filepath = result["file"]
        print(f"# Edit {state}:")
        print(f"vim {filepath}")
        print()