#!/bin/bash
echo "=== STATE COMPLETION STATUS ==="
echo ""

echo "1. STATES WITH LOGOS (16):"
echo "-------------------------"
ls -1 public/images/ihemp-*-logo-cream.webp 2>/dev/null | sed 's|.*/ihemp-||' | sed 's/-logo-cream.webp//' | sort | tr '\n' ',' | sed 's/,/, /g' | fold -s
echo ""
echo ""

echo "2. STATES WITH PENDING STATUS (needs data):"
echo "------------------------------------------"
grep -l "status: 'pending'" src/data/states/*.ts 2>/dev/null | sed 's|.*/||' | sed 's/\.ts//' | sort | tr '\n' ',' | sed 's/,/, /g' | fold -s
echo ""
echo ""

echo "3. STATES WITH REAL DATA (completed):"
echo "-------------------------------------"
# States that don't have pending status and aren't placeholder templates
echo "Based on manual verification:"
echo "Arkansas, California, Colorado, Florida, Georgia, Indiana, Iowa, Kansas, Kentucky, Michigan, Mississippi, Nebraska, Ohio, Oklahoma, Tennessee, Texas"
echo ""
echo ""

echo "4. STATES WITH BROKEN/EMPTY URLS (needs fixing):"
echo "-----------------------------------------------"
echo "From URL verification: 14 broken URLs across various states"
echo "These need to be researched and corrected"
echo ""
echo ""

echo "5. SUMMARY:"
echo "----------"
TOTAL_STATES=51
STATES_WITH_LOGO=$(ls public/images/ihemp-*-logo-cream.webp 2>/dev/null | wc -l)
STATES_PENDING=$(grep -l "status: 'pending'" src/data/states/*.ts 2>/dev/null | wc -l)
STATES_COMPLETE=$((TOTAL_STATES - STATES_PENDING))

echo "Total states: $TOTAL_STATES"
echo "States with logos: $STATES_WITH_LOGO"
echo "States with real data (complete): $STATES_COMPLETE"
echo "States pending data: $STATES_PENDING"
echo "States needing URL fixes: ~14 URLs"