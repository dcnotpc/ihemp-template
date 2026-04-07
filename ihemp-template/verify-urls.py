#!/usr/bin/env python3
"""
Verify URLs from state files with context
"""
import subprocess
import json
import re
import sys
from pathlib import Path

def extract_urls_with_context():
    """Extract URLs with file and line context."""
    result = subprocess.check_output(
        ["grep", "-n", "-r", "url:", "src/data/states/*.ts"],
        text=True
    )
    
    urls = []
    for line in result.strip().split('\n'):
        if not line:
            continue
            
        # Extract file and line
        match = re.match(r'([^:]+):(\d+):(.*)', line)
        if not match:
            continue
            
        file_path, line_num, content = match.groups()
        
        # Extract URL value
        url_match = re.search(r'url:\s*["\']([^"\']*)["\']', content)
        if not url_match:
            continue
            
        url = url_match.group(1)
        if not url or url.startswith('http'):
            # Get more context - look for law titles or resource labels
            context = content.strip()
            urls.append({
                'file': file_path,
                'line': int(line_num),
                'url': url,
                'context': context[:100]
            })
    
    return urls

def check_url(url):
    """Check if URL is accessible."""
    if not url or not url.startswith('http'):
        return {'status': 'invalid', 'error': 'Empty or non-HTTP URL'}
    
    try:
        # Use curl for checking
        result = subprocess.run(
            ['curl', '-s', '-o', '/dev/null', '-w', '%{http_code}', '-L', '--max-time', '10', url],
            capture_output=True,
            text=True
        )
        status = result.stdout.strip()
        
        if status and status.isdigit():
            if status.startswith('2') or status.startswith('3'):
                return {'status': 'success', 'code': int(status)}
            else:
                return {'status': 'error', 'code': int(status), 'error': f'HTTP {status}'}
        else:
            return {'status': 'error', 'code': 0, 'error': 'No response'}
            
    except Exception as e:
        return {'status': 'error', 'code': 0, 'error': str(e)}

def main():
    print("Extracting URLs from state files...")
    urls = extract_urls_with_context()
    
    print(f"\nFound {len(urls)} URLs to verify")
    print("-" * 80)
    
    issues_by_state = {}
    
    for i, item in enumerate(urls, 1):
        print(f"[{i}/{len(urls)}] Checking: {item['url'][:60]}...")
        
        if not item['url']:
            print(f"   ⚠️  Empty URL in {item['file']}:{item['line']}")
            
            # Track by state
            state_match = re.search(r'/([a-z-]+)\.ts$', item['file'])
            state = state_match.group(1) if state_match else 'unknown'
            if state not in issues_by_state:
                issues_by_state[state] = []
            issues_by_state[state].append(f"Empty URL - {item['context']}")
            
        elif item['url'].startswith('http'):
            result = check_url(item['url'])
            if result['status'] == 'success':
                print(f"   ✅ {item['url']}")
            else:
                print(f"   ❌ {item['url']} - {result.get('error', 'Unknown error')}")
                
                # Track by state
                state_match = re.search(r'/([a-z-]+)\.ts$', item['file'])
                state = state_match.group(1) if state_match else 'unknown'
                if state not in issues_by_state:
                    issues_by_state[state] = []
                issues_by_state[state].append(f"Bad URL {item['url']} - {result.get('error', 'Unknown error')}")
        
        else:
            print(f"   ⚠️  Malformed URL: {item['url']}")
    
    # Summary report
    print("\n" + "="*80)
    print("URL VERIFICATION SUMMARY")
    print("="*80)
    
    working = sum(1 for item in urls if item['url'] and item['url'].startswith('http'))
    empty = sum(1 for item in urls if not item['url'])
    malformed = sum(1 for item in urls if item['url'] and not item['url'].startswith('http'))
    
    print(f"Total URLs examined: {len(urls)}")
    print(f"  Working HTTP URLs: {working}")
    print(f"  Empty URLs: {empty}")
    print(f"  Malformed URLs: {malformed}")
    
    if issues_by_state:
        print("\n" + "="*80)
        print("ISSUES BY STATE")
        print("="*80)
        
        for state, issues in sorted(issues_by_state.items()):
            state_name = state.replace('-', ' ').title()
            print(f"\n{state_name.upper()}:")
            for issue in issues:
                print(f"  • {issue}")
    
    # Save detailed report
    report = {
        'total_urls': len(urls),
        'working_http': working,
        'empty_urls': empty,
        'malformed_urls': malformed,
        'issues_by_state': issues_by_state,
        'details': urls
    }
    
    with open('/tmp/url_report.json', 'w') as f:
        json.dump(report, f, indent=2)
    
    print(f"\nDetailed report saved to: /tmp/url_report.json")

if __name__ == '__main__':
    main()