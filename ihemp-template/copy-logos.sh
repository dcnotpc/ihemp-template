#!/bin/bash
# Copy and rename logo files from Pictures to project

SRC_DIR="/home/dcnotpc420/Pictures"
DEST_DIR="/home/dcnotpc420/.openclaw/workspace/ihemp-template/public/images"

# Mapping of source filenames to destination filenames
declare -A LOGO_MAP=(
    ["ihemp arkansas logo.webp"]="ihemp-arkansas-logo-cream.webp"
    ["ihempcalifornia logo.webp"]="ihemp-california-logo-cream.webp"
    ["ihemp colorado logo cream.webp"]="ihemp-colorado-logo-cream.webp"  # Already exists but ensure consistency
    ["ihemp florida logo.webp"]="ihemp-florida-logo-cream.webp"
    ["ihemp georgia logo.webp"]="ihemp-georgia-logo-cream.webp"
    ["ihemp indiana.webp"]="ihemp-indiana-logo-cream.webp"
    ["ihemp iowa.webp"]="ihemp-iowa-logo-cream.webp"
    ["ihemp kansas logo.webp"]="ihemp-kansas-logo-cream.webp"
    ["ihemp kentucky logo.webp"]="ihemp-kentucky-logo-cream.webp"
    ["ihemp michigan logo-1.webp"]="ihemp-michigan-logo-cream.webp"
    ["ihemp mississippi logo.webp"]="ihemp-mississippi-logo-cream.webp"
    ["ihemp nebraska logo.webp"]="ihemp-nebraska-logo-cream.webp"
    ["ihemp ohio logo.webp"]="ihemp-ohio-logo-cream.webp"
    ["ihemp oklahoma logo.webp"]="ihemp-oklahoma-logo-cream.webp"
    ["ihemp tennesee logo.webp"]="ihemp-tennessee-logo-cream.webp"  # Correct spelling
    ["ihemp texas logo.webp"]="ihemp-texas-logo-cream.webp"
)

echo "Copying logo files from $SRC_DIR to $DEST_DIR"
echo "=============================================="

for src_file in "${!LOGO_MAP[@]}"; do
    dest_file="${LOGO_MAP[$src_file]}"
    
    if [[ -f "$SRC_DIR/$src_file" ]]; then
        echo "✓ Copying: $src_file -> $dest_file"
        cp "$SRC_DIR/$src_file" "$DEST_DIR/$dest_file"
    else
        echo "✗ Missing: $src_file"
    fi
done

echo ""
echo "Verifying copied files..."
echo "========================="
ls -la "$DEST_DIR"/ihemp-*-logo-cream.webp 2>/dev/null | wc -l | xargs echo "Total logo files:"