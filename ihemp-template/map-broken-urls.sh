#!/bin/bash
echo "Mapping broken URLs to states..."
echo "================================="

# First, let's get a clean list of URLs from our earlier verification
BROKEN_URLS=$(cat /tmp/url_verification_1775577941.txt 2>/dev/null | grep "❌" | awk '{print $NF}' | sed 's/|//g')

echo "Broken URLs found:"
echo "$BROKEN_URLS"
echo ""
echo "Now checking which states these belong to..."

# For each state file, check if it contains broken URLs
for state_file in src/data/states/*.ts; do
    state=$(basename "$state_file" .ts)
    
    # Extract all URLs from this state file
    urls=$(grep -o 'url: "[^"]*"' "$state_file" | sed 's/url: "//' | sed 's/"//' | grep -v '^$')
    
    # Check if any broken URLs are in this file
    broken_in_state=""
    for url in $urls; do
        if echo "$BROKEN_URLS" | grep -q "$url"; then
            broken_in_state="$broken_in_state $url"
        fi
    done
    
    if [ ! -z "$broken_in_state" ]; then
        echo "State: $state"
        echo "  Broken URLs:"
        for url in $broken_in_state; do
            echo "    - $url"
        done
        echo ""
    fi
done

echo "Now checking for empty URLs (url: '')..."
echo "========================================="
for state_file in src/data/states/*.ts; do
    state=$(basename "$state_file" .ts)
    empty_count=$(grep -c 'url: ""' "$state_file")
    if [ $empty_count -gt 0 ]; then
        echo "$state: $empty_count empty URLs"
    fi
done