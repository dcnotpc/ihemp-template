#!/bin/bash
echo "Quick URL testing..."
echo "===================="

urls=(
  "https://ag.colorado.gov/plants/hemp"
  "https://agi.alabama.gov/hemp/"
  "https://ag.ok.gov/plant-industry/"
  "https://agriculture.arkansas.gov/crops-industry/quality-control-and-compliance/hemp-home/"
  "https://www.agriculture.ks.gov/divisions-programs/plant-protection-weed-control/industrial-hemp"
  "https://cannabis.colorado.gov/industrial-hemp"
)

for url in "${urls[@]}"; do
  echo -n "Testing $url ... "
  # Quick curl with 5 second timeout
  curl -s -I -L --max-time 5 "$url" 2>/dev/null | head -1 | while read line; do
    if [[ "$line" =~ HTTP ]]; then
      echo "$line"
    fi
  done
done