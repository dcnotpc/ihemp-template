#!/usr/bin/env python3
import requests
import json
from pathlib import Path
import re

states_to_check = [
    # State name, current URL, suggested alternative
    ("alabama", "https://agi.alabama.gov/plant-protection/industrial-hemp-program/", "https://agi.alabama.gov/hemp/"),
    ("oklahoma", "https://ag.ok.gov/divisions/consumer-protection-service/industrial-hemp/", "https://ag.ok.gov/plant-industry/"),
    ("arkansas", "https://agriculture.arkansas.gov/", "https://agriculture.arkansas.gov/crops-industry/quality-control-and-compliance/hemp-home/"),
    ("mississippi", "https://www.mdac.ms.gov/", "https://www.mdac.ms.gov/programs/hemp-cultivation-in-ms/"),
    ("colorado", "https://ag.colorado.gov/plants/industrial-hemp-program", "https://ag.colorado.gov/plants/hemp"),  # Already fixed
    ("kansas", "https://www.agriculture.ks.gov/divisions-programs/plant-protect-weed-control/industrial-hemp", None),
    ("michigan", "https://www.michigan.gov/mdard/plants-pests/plant-health/industrial-hemp", None),
    ("tennessee", "https://www.tn.gov/agriculture/farms/hemp-industry.html", None),
    ("ohio", "https://agri.ohio.gov/divisions/hemp-program", "https://agri.ohio.gov/divisions/hemp-program"),  # Working
    ("ohio-faq", "https://agri.ohio.gov/divisions/hemp-program/faqs/questions", "https://agri.ohio.gov/divisions/hemp-program/faqs/questions"),  # Working
]

def check_url(url, description):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    try:
        resp = requests.get(url, headers=headers, timeout=10, allow_redirects=True)
        return {
            'url': url,
            'description': description,
            'status': resp.status_code,
            'success': 200 <= resp.status_code < 400,
            'final_url': resp.url
        }
    except Exception as e:
        return {
            'url': url,
            'description': description,
            'status': 'ERROR',
            'success': False,
            'error': str(e)
        }

print("Testing state URLs...")
print("="*80)

results = []
for state, current_url, suggested_url in states_to_check:
    # Check current URL
    print(f"\n{state.upper()}:")
    current_result = check_url(current_url, "Current URL")
    if current_result['success']:
        print(f"  ✅ Current URL works: HTTP {current_result['status']}")
    else:
        print(f"  ❌ Current URL failed: {current_result.get('status', 'ERROR')}")
        if 'error' in current_result:
            print(f"     Error: {current_result['error']}")
    
    # Check suggested URL if exists
    if suggested_url and suggested_url != current_url:
        suggested_result = check_url(suggested_url, "Suggested URL")
        if suggested_result['success']:
            print(f"  ✅ Suggested URL works: HTTP {suggested_result['status']}")
        else:
            print(f"  ❌ Suggested URL failed: {suggested_result.get('status', 'ERROR')}")
    
    results.append({
        'state': state,
        'current': current_result,
        'suggested': suggested_result if suggested_url else None
    })

print("\n" + "="*80)
print("ACTIONABLE FIXES:")
print("="*80)

# Show which states need fixes
for result in results:
    state = result['state']
    current = result['current']
    suggested = result.get('suggested')
    
    if not current['success'] and suggested and suggested['success']:
        print(f"🔧 {state.upper()}: Replace with working URL")
        print(f"   FROM: {current['url']}")
        print(f"   TO:   {suggested['url']}")
        print()
    elif not current['success'] and not suggested:
        print(f"🚧 {state.upper()}: Needs research - current URL broken")
        print(f"   BROKEN URL: {current['url']}")
        print(f"   STATUS: {current.get('status', 'ERROR')}")
        print()

# Generate summary
working = sum(1 for r in results if r['current']['success'])
broken = sum(1 for r in results if not r['current']['success'])
fixable = sum(1 for r in results if not r['current']['success'] and r.get('suggested') and r['suggested']['success'])

print("\n" + "="*80)
print(f"SUMMARY: {working} working, {broken} broken, {fixable} fixable")
print("="*80)