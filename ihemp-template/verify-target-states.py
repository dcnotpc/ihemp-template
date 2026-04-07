#!/usr/bin/env python3
import requests
import re
import json
from pathlib import Path
import sys

project_root = Path(__file__).parent

# CEO's target domain list
target_domains = [
    "iHempArkansas.com",
    "iHempCalifornia.com", 
    "iHempColorado.com",
    "iHempFlorida.com",
    "iHempGeorgia.com",
    "iHempIndiana.com",
    "iHempIowa.com",
    "iHempKansas.com",
    "iHempKentucky.com",
    "iHempMI.com",  # Michigan
    "iHempMississippi.com",
    "iHempNebraska.com",
    "iHempOhio.com",
    "iHempOklahoma.com",
    "iHempTennessee.com",
    "iHempTexas.com"
]

# Map domain names to state slugs
domain_to_state = {
    "iHempArkansas.com": "arkansas",
    "iHempCalifornia.com": "california",
    "iHempColorado.com": "colorado",
    "iHempFlorida.com": "florida",
    "iHempGeorgia.com": "georgia",
    "iHempIndiana.com": "indiana",
    "iHempIowa.com": "iowa",
    "iHempKansas.com": "kansas",
    "iHempKentucky.com": "kentucky",
    "iHempMI.com": "michigan",
    "iHempMississippi.com": "mississippi",
    "iHempNebraska.com": "nebraska",
    "iHempOhio.com": "ohio",
    "iHempOklahoma.com": "oklahoma",
    "iHempTennessee.com": "tennessee",
    "iHempTexas.com": "texas"
}

print("CEO Domain Targets Analysis")
print("="*60)
print(f"Target domains: {len(target_domains)}")
print()

# Load all state files
state_files = list(project_root.glob("src/data/states/*.ts"))
state_slugs = [f.stem for f in state_files]
state_slugs.sort()

# Check which target states have files
print("State Coverage:")
print("-"*40)
for domain in sorted(target_domains):
    state_slug = domain_to_state.get(domain)
    if state_slug in state_slugs:
        print(f"✅ {domain} -> {state_slug}.ts")
    else:
        print(f"❌ {domain} -> No {state_slug}.ts file found")

print("\n" + "="*60)
print("Testing URLs for target states...")
print("="*60)

# Test URLs for target states
def test_url(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    try:
        resp = requests.get(url, headers=headers, timeout=10, allow_redirects=True)
        return {
            'status': resp.status_code,
            'success': 200 <= resp.status_code < 400,
            'final_url': resp.url,
            'redirected': resp.url != url
        }
    except Exception as e:
        return {
            'status': 'ERROR',
            'success': False,
            'error': str(e)
        }

results_by_state = {}

for state_slug in sorted(domain_to_state.values()):
    state_file = project_root / "src/data/states" / f"{state_slug}.ts"
    if not state_file.exists():
        continue
        
    with open(state_file, 'r') as f:
        content = f.read()
    
    # Find all URLs
    url_pattern = r'url:\s*"([^"]*)"'
    matches = list(re.finditer(url_pattern, content))
    
    print(f"\n{state_slug.upper()}:")
    
    state_results = []
    for match in matches:
        url = match.group(1).strip()
        if not url:
            continue
            
        # Get line number and context
        line_num = content[:match.start()].count('\n') + 1
        lines = content.split('\n')
        start = max(0, line_num - 2)
        end = min(len(lines), line_num + 1)
        context = '\n'.join(lines[start:end])
        
        # Extract field name from context
        field = 'unknown'
        if 'label:' in context:
            label_match = re.search(r'label:\s*"([^"]*)"', context)
            if label_match:
                field = label_match.group(1)
        elif 'regulatoryUrl:' in context:
            field = 'regulatoryUrl'
        elif 'title:' in context:
            field = re.search(r'title:\s*"([^"]*)"', context).group(1) if re.search(r'title:\s*"([^"]*)"', context) else 'law'
        
        # Test URL
        result = test_url(url)
        status_display = result['status'] if isinstance(result['status'], int) else result['status']
        
        if result['success']:
            print(f"  ✅ {field}: HTTP {status_display}")
        else:
            error_msg = f" ({result.get('error', '')})" if 'error' in result else ''
            print(f"  ❌ {field}: {status_display}{error_msg}")
        
        state_results.append({
            'field': field,
            'url': url,
            'result': result,
            'line': line_num
        })
    
    results_by_state[state_slug] = state_results

print("\n" + "="*60)
print("URL HEALTH SUMMARY FOR TARGET STATES")
print("="*60)

# Calculate statistics
total_urls = 0
broken_urls = 0
working_urls = 0

for state_slug, results in results_by_state.items():
    total_urls += len(results)
    state_broken = sum(1 for r in results if not r['result']['success'])
    state_working = sum(1 for r in results if r['result']['success'])
    broken_urls += state_broken
    working_urls += state_working
    
    status = "✅" if state_broken == 0 else "❌"
    print(f"{status} {state_slug.upper()}: {state_working} working, {state_broken} broken")

print(f"\nTOTAL: {working_urls} working, {broken_urls} broken URLs")

# Show broken URLs that need attention
if broken_urls > 0:
    print("\n" + "="*60)
    print("BROKEN URLs NEEDING ATTENTION:")
    print("="*60)
    
    for state_slug, results in results_by_state.items():
        broken = [r for r in results if not r['result']['success']]
        if broken:
            print(f"\n{state_slug.upper()}:")
            for item in broken:
                status = item['result']['status']
                error = item['result'].get('error', '')
                print(f"  • {item['field']}: {status} {error}")
                print(f"    {item['url']}")

# Save to file
report_path = project_root / "url-health-report.json"
with open(report_path, 'w') as f:
    json.dump({
        'target_states': domain_to_state,
        'results_by_state': results_by_state,
        'summary': {
            'total_urls': total_urls,
            'working_urls': working_urls,
            'broken_urls': broken_urls
        }
    }, f, indent=2)

print(f"\nFull report saved to: {report_path}")