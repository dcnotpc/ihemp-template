#!/usr/bin/env python3
import subprocess
import json
import re
import sys
import os
from pathlib import Path

# Get project root
project_root = Path(__file__).parent

# Find all state files
state_files = list(project_root.glob("src/data/states/*.ts"))
state_files.sort()

print(f"Found {len(state_files)} state files")

broken_by_state = {}

for state_file in state_files:
    state_name = state_file.stem
    print(f"\nChecking {state_name}...")
    
    with open(state_file, 'r') as f:
        content = f.read()
    
    # Find all URLs in the file
    url_pattern = r'url:\s*"([^"]*)"'
    matches = re.finditer(url_pattern, content)
    
    for match in matches:
        url = match.group(1).strip()
        if not url:
            continue
            
        line_num = content[:match.start()].count('\n') + 1
        
        # Try to get context (2 lines before and after)
        lines = content.split('\n')
        start = max(0, line_num - 3)
        end = min(len(lines), line_num + 2)
        context_lines = lines[start:end]
        context = '\n'.join(context_lines)
        
        # Test the URL with curl
        try:
            # Use curl with proper user agent
            cmd = ['curl', '-s', '-I', '-L', '-A', 'Mozilla/5.0', '-m', '10', url]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=15)
            
            # Check status code from headers
            status_match = re.search(r'HTTP/\d\.\d\s+(\d+)', result.stdout)
            if status_match:
                status = int(status_match.group(1))
                if status >= 400 or status == 0:
                    if state_name not in broken_by_state:
                        broken_by_state[state_name] = []
                    broken_by_state[state_name].append({
                        'url': url,
                        'status': status,
                        'line': line_num,
                        'context': context[:200] + '...' if len(context) > 200 else context
                    })
                    print(f"  ❌ Line {line_num}: {url} - HTTP {status}")
            elif "curl:" in result.stderr:
                # Curl error
                if state_name not in broken_by_state:
                    broken_by_state[state_name] = []
                broken_by_state[state_name].append({
                    'url': url,
                    'status': 'CURL_ERROR',
                    'line': line_num,
                    'context': context[:200] + '...' if len(context) > 200 else context,
                    'error': result.stderr[:100]
                })
                print(f"  ❌ Line {line_num}: {url} - CURL ERROR")
                    
        except subprocess.TimeoutExpired:
            if state_name not in broken_by_state:
                broken_by_state[state_name] = []
            broken_by_state[state_name].append({
                'url': url,
                'status': 'TIMEOUT',
                'line': line_num,
                'context': context[:200] + '...' if len(context) > 200 else context
            })
            print(f"  ❌ Line {line_num}: {url} - TIMEOUT")
        except Exception as e:
            print(f"  ⚠️  Line {line_num}: {url} - Exception: {e}")

print("\n" + "="*80)
print("BROKEN URL SUMMARY")
print("="*80)

if broken_by_state:
    total_broken = sum(len(urls) for urls in broken_by_state.values())
    print(f"Total broken URLs: {total_broken}")
    
    for state, urls in broken_by_state.items():
        print(f"\n{state.upper()} ({len(urls)} broken):")
        for item in urls:
            print(f"  Line {item['line']}: {item['url']}")
            print(f"    Status: {item['status']}")
            if 'error' in item:
                print(f"    Error: {item['error']}")
            print()
else:
    print("🎉 No broken URLs found!")

# Save to file for reference
if broken_by_state:
    with open('broken_urls_report.json', 'w') as f:
        json.dump(broken_by_state, f, indent=2)
    print(f"\nFull report saved to: {project_root/'broken_urls_report.json'}")