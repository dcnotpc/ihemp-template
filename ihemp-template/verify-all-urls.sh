#!/bin/bash
echo "Comprehensive URL verification with state mapping..."
echo "===================================================="

# Create a temporary file for all URLs
TEMP_URLS="/tmp/all_state_urls.txt"
echo "" > "$TEMP_URLS"

# Extract all URLs with context from state files
for state_file in src/data/states/*.ts; do
    state=$(basename "$state_file" .ts)
    
    # Get line numbers and URLs
    grep -n "url:" "$state_file" | while IFS= read -r line; do
        line_num=$(echo "$line" | cut -d: -f1)
        content=$(echo "$line" | cut -d: -f3-)
        
        # Extract URL value
        url=$(echo "$content" | grep -o 'url: "[^"]*"' | sed 's/url: "//' | sed 's/"//' | sed "s/url: '//" | sed "s/'//")
        
        if [ -n "$url" ]; then
            echo "$state|$line_num|$url" >> "$TEMP_URLS"
        fi
    done
done

echo "Total URLs found: $(wc -l < "$TEMP_URLS")"
echo ""
echo "Now checking each URL..."
echo "========================"

# Check each URL
while IFS='|' read -r state line_num url; do
    if [[ -z "$url" ]]; then
        echo "⚠️ $state:$line_num - EMPTY URL"
        continue
    fi
    
    if [[ ! "$url" =~ ^https?:// ]]; then
        echo "⚠️ $state:$line_num - MALFORMED URL: $url"
        continue
    fi
    
    echo -n "Checking $state:$line_num - $url ... "
    
    # Use curl with timeout
    status_code=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 10 --connect-timeout 10 "$url" 2>/dev/null)
    
    if [[ "$status_code" =~ ^[2-3][0-9][0-9]$ ]]; then
        echo "✅ $status_code"
    elif [[ -z "$status_code" ]]; then
        echo "❌ TIMEOUT/NO_RESPONSE"
    else
        echo "❌ HTTP $status_code"
    fi
    
    sleep 0.3
done < "$TEMP_URLS"

rm -f "$TEMP_URLS"
echo ""
echo "Verification complete."