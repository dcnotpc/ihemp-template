#!/bin/bash
# iHemp States Dir Setup - Edit STATES array below

STATES=(
    "co" "ky" "or" "ca" "mi" "nc" "tn" "sc" "pa" "mo"
    # Add more: "wa" "fl" "tx" etc.
)

BASE="public/images/states"

for state in "${STATES[@]}"; do
    mkdir -p "$BASE/$state"/{logos,heroes,features}
    echo "Created: $BASE/$state/ (logos/ heroes/ features/)"
done

echo "All done! Check: ls -R $BASE/"
