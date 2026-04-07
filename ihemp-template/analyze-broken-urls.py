#!/usr/bin/env python3
import re
import subprocess
import json

# First, let's get the actual verification output
with open('/tmp/url_verification_1775577941.txt', 'r') as f:
    lines = f.readlines()

# Parse the verification output
url_status = {}
current_url = None

for line in lines:
    line = line.strip()
    if line.startswith('❌') or line.startswith('✅'):
        parts = line.split()
        if len(parts) >= 2:
            status = parts[0]
            # The URL might be in different positions
            url = ' '.join(parts[1:])
            if url and url not in ['403', '404', '000', 'TIMEOUT/NODATA']:
                url_status[url] = status
                current_url = url
            elif current_url:
                # This is just a status code for the previous URL
                url_status[current_url] = status
    elif line.startswith('Checking ['):
        # Extract URL from checking line
        match = re.search(r'Checking \[.*\]: (.*?) \.\.\.', line)
        if match:
            current_url = match.group(1)

print("URL Status Analysis:")
print("===================")
print(f"Total URLs in report: {len(url_status)}")

broken_urls = []
for url, status in url_status.items():
    if '❌' in status:
        broken_urls.append(url)

print(f"\nBroken URLs ({len(broken_urls)}):")
print("-----------------")
for url in broken_urls:
    print(f"- {url}")

# Now map to states
print("\n\nMapping broken URLs to states:")
print("=============================")

# Get all state files
import os
state_files = [f for f in os.listdir('src/data/states') if f.endswith('.ts')]

for state_file in sorted(state_files):
    state = state_file.replace('.ts', '')
    with open(f'src/data/states/{state_file}', 'r') as f:
        content = f.read()
    
    # Find all URLs in this file
    urls_in_file = re.findall(r'url:\s*["\']([^"\']*)["\']', content)
    
    # Check for broken URLs
    broken_in_state = []
    for url in urls_in_file:
        if url in broken_urls:
            broken_in_state.append(url)
    
    if broken_in_state:
        print(f"\n{state.upper()}:")
        for url in broken_in_state:
            print(f"  - {url}")
    
    # Also check for empty URLs
    empty_count = content.count('url: ""')
    if empty_count > 0:
        print(f"  (Also has {empty_count} empty URLs)")

print("\n\nNow searching for replacements...")