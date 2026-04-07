#!/usr/bin/env python3
import requests
import json
import re

# Target URLs that need checking
target_urls = [
    # Colorado
    ("https://ag.colorado.gov/plants/hemp", "colorado", "resources.0"),
    ("https://ag.colorado.gov/plants/industrial-hemp-program", "colorado", "regulatoryUrl"),
    
    # Kansas
    ("https://www.agriculture.ks.gov/divisions-programs/plant-protection-weed-control/industrial-hemp", "kansas", "resources.0"),
    
    # Michigan
    ("https://www.michigan.gov/mdard/plants-pests/plant-health/industrial-hemp", "michigan", "resources.0"),
    
    # Tennessee  
    ("https://www.tn.gov/agriculture/farms/hemp-industry.html", "tennessee", "resources.0"),
    
    # Ohio
    ("https://agri.ohio.gov/divisions/hemp-program", "ohio", "resources.0"),
    ("https://agri.ohio.gov/divisions/hemp-program/faqs/questions", "ohio", "test"),
]

def check_with_agent(url):
    """Check URL with proper headers"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
    try:
        resp = requests.get(url, headers=headers, timeout=10, allow_redirects=True)
        return {
            'status_code': resp.status_code,
            'final_url': resp.url,
            'success': 200 <= resp.status_code < 400
        }
    except Exception as e:
        return {
            'status_code': None,
            'error': str(e),
            'success': False
        }

print("Testing target URLs with proper user agent...")
print("="*60)

results = {}
for url, state, field in target_urls:
    print(f"Testing {state}: {url[:70]}...")
    result = check_with_agent(url)
    results[f"{state}.{field}"] = result
    
    status = result['status_code']
    if status and result['success']:
        print(f"  ✅ HTTP {status}")
    elif status:
        print(f"  ❌ HTTP {status}")
    else:
        print(f"  ⚠️  Error: {result.get('error', 'Unknown')}")
    
    # Check for redirects
    if 'final_url' in result and result['final_url'] != url:
        print(f"  ↪️  Redirected to: {result['final_url']}")

print("\n" + "="*60)
print("SUMMARY OF KEY URLS:")
print("="*60)

# Check which ones are good
good = {k: v for k, v in results.items() if v['success']}
bad = {k: v for k, v in results.items() if not v['success']}

print(f"✅ Working URLs: {len(good)}")
for key, result in good.items():
    print(f"  {key}: HTTP {result['status_code']}")

print(f"\n❌ Bad URLs: {len(bad)}")
for key, result in bad.items():
    status = result.get('status_code')
    error = result.get('error', 'Unknown')
    print(f"  {key}: {'HTTP ' + str(status) if status else error}")