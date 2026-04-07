#!/bin/bash
# Extract all URLs from state files and check HTTP status

TEMP_FILE="/tmp/state_urls_$(date +%s).txt"
OUTPUT_FILE="/tmp/url_verification_$(date +%s).txt"

echo "Extracting URLs from state files..."
echo "===================================" > "$OUTPUT_FILE"

# Extract all non-empty URLs
grep -r "url:" src/data/states/*.ts | grep -v "url: ''" | grep -v "License/Application Portal" | grep -v "Testing Requirements" | sed 's/.*url: //' | sed 's/,//' | sed 's/.*\"\(http[^\"]*\)\".*/\1/' | sort -u > "$TEMP_FILE"

TOTAL_URLS=$(wc -l < "$TEMP_FILE")
echo "Found $TOTAL_URLS unique URLs to verify" >> "$OUTPUT_FILE"
echo "" >> "$OUTPUT_FILE"

echo "Verifying URLs (this may take a moment)..."
echo "Status | URL" >> "$OUTPUT_FILE"
echo "------ | ---" >> "$OUTPUT_FILE"

count=0
while IFS= read -r url; do
    if [[ -n "$url" ]]; then
        count=$((count + 1))
        echo -n "Checking [$count/$TOTAL_URLS]: $url ... "
        
        # Try curl with timeout and follow redirects
        status=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 10 --connect-timeout 10 "$url" 2>/dev/null)
        
        if [[ "$status" =~ ^[2-3][0-9][0-9]$ ]]; then
            echo "✅ $status" | tee -a "$OUTPUT_FILE"
        elif [[ -z "$status" ]]; then
            echo "❌ TIMEOUT/NODATA" | tee -a "$OUTPUT_FILE"
        else
            echo "❌ $status" | tee -a "$OUTPUT_FILE"
        fi
        
        sleep 0.5  # Avoid overwhelming servers
    fi
done < "$TEMP_FILE"

echo "" >> "$OUTPUT_FILE"
echo "Verification complete. Results saved to $OUTPUT_FILE"
echo ""
echo "Summary:"
echo "========"
grep -c "✅" "$OUTPUT_FILE" | awk '{print "Working: " $1}'
grep -c "❌" "$OUTPUT_FILE" | awk '{print "Failed: " $1}'

rm -f "$TEMP_FILE"