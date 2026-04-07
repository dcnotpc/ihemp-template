#!/bin/bash
echo "🔍 Quick URL Check"
echo "=================="

# Function to check URL
check_url() {
    local url="$1"
    echo -n "Checking: $url ... "
    
    # Use curl with timeout and follow redirects
    if curl -s -f -L --connect-timeout 10 --max-time 20 "$url" > /dev/null 2>&1; then
        echo "✓ OK"
        return 0
    else
        echo "✗ FAILED"
        return 1
    fi
}

# Check a few key URLs
echo ""
echo "Kentucky URLs:"
check_url "https://apps.legislature.ky.gov/record/13rs/sb50.html"
check_url "https://apps.legislature.ky.gov/record/23rs/sb47.html"
check_url "https://www.kyagr.com/marketing/hemp.html"

echo ""
echo "Ohio URLs:"
check_url "https://www.legislature.ohio.gov/legislation/133/sb57"
check_url "https://agri.ohio.gov/divisions/plant-health/industrial-hemp"

echo ""
echo "Florida URLs:"
check_url "https://www.flsenate.gov/Session/Bill/2019/1020"
check_url "https://www.fdacs.gov/Cannabis-Hemp/Hemp-CBD-in-Florida"

echo ""
echo "Checking PDF links (Michigan):"
check_url "https://www.legislature.mi.gov/documents/2019-2020/publicact/pdf/2020-PA-0220.pdf"
