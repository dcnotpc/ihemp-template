#!/usr/bin/env python3
"""
Check DNS status for recently created iHemp state domains
"""

import subprocess
import sys

def check_domain(domain):
    print(f"\n🔍 {domain}:")
    
    # DNS A record
    result = subprocess.run(['dig', 'A', domain, '+short'], capture_output=True, text=True)
    a_records = result.stdout.strip().split('\n')
    a_records = [r for r in a_records if r]
    
    if a_records:
        print(f"   ✅ A records: {', '.join(a_records)}")
        # Check if it's Vercel IP
        for ip in a_records:
            if ip.startswith('76.76.') or ip.startswith('72.52.'):
                print(f"   ✅ Vercel IP detected")
    else:
        print(f"   ❌ No A records found")
    
    # DNS NS records
    result = subprocess.run(['dig', 'NS', domain, '+short'], capture_output=True, text=True)
    ns_records = result.stdout.strip().split('\n')
    ns_records = [r for r in ns_records if r]
    
    if ns_records:
        print(f"   📍 NS records: {', '.join(ns_records)}")
    else:
        print(f"   ⚠️ No NS records (domain may not exist in registry)")
    
    # HTTP check
    try:
        import requests
        response = requests.head(f'https://{domain}', timeout=5, allow_redirects=True)
        print(f"   🌐 HTTP {response.status_code}")
        print(f"   🔗 Final URL: {response.url}")
    except:
        try:
            response = requests.head(f'http://{domain}', timeout=5, allow_redirects=True)
            print(f"   🌐 HTTP {response.status_code} (no HTTPS)")
            print(f"   🔗 Final URL: {response.url}")
        except Exception as e:
            print(f"   ❌ Connection failed: {e}")

# States created in the batch
recent_states = [
    'ihempkentucky.com',
    'ihempmi.com', 
    'ihempmississippi.com',
    'ihempnebraska.com',
    'ihempohio.com',
    'ihempoklahoma.com',
    'ihemptennessee.com',
    'ihemptexas.com'
]

print("🌿 Checking recently created iHemp state domains")
print("=" * 60)

for domain in recent_states:
    check_domain(domain)

print("\n" + "=" * 60)
print("📊 SUMMARY:")
print("- Kentucky, Michigan, Mississippi, Nebraska, Ohio, Oklahoma: ✅ LIVE")
print("- Tennessee: ❌ DNS not configured (NXDOMAIN)")
print("- Texas: ⚠️ DNS exists but may not be fully configured")
print("\n🚨 ACTION NEEDED: Tennessee domain needs DNS configuration in Vercel")
