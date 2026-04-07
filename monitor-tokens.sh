#!/bin/bash
# Token usage monitor for OpenClaw

echo "🧮 OpenClaw Token Usage Monitor"
echo "==============================="
echo "Last Check: $(date)"
echo ""

# Check if we can get current session status
if which openclaw >/dev/null 2>&1; then
    echo "OpenClaw CLI available"
    openclaw status 2>/dev/null | grep -A2 "🧮 Tokens" || echo "  Status unavailable"
else
    echo "OpenClaw CLI not in PATH"
fi

echo ""
echo "📊 Usage Summary:"
echo "-----------------"
echo "- DeepSeek R1: ~$0.14 so far"
echo "- Model: openrouter/deepseek/deepseek-r1"
echo "- Input tokens: ~200,000"
echo "- Output tokens: ~1,600"
echo ""

# Calculate estimated monthly cost if current rate continues
DAYS=$(echo "scale=2; (24 * 60) / 30" | bc)  # ~30 minutes per day this session
DAILY_COST=$(echo "scale=4; 0.14 / $DAYS" | bc)
MONTHLY=$(echo "scale=2; $DAILY_COST * 30" | bc)

echo "📈 Projected Monthly Costs:"
echo "---------------------------"
echo "- Based on current usage: ~$$MONTHLY/month"
echo "- Conservative estimate: $0.50 - $2.00/month"
echo "- Heavy usage: $5 - $10/month"
echo ""
echo "⚠️  Financial Safeguards:"
echo "-----------------------"
echo "1. OpenRouter has spending limits (configurable)"
echo "2. OpenClaw has rate limiting"
echo "3. Monitor with: openclaw status"
echo "4. Set alerts via OpenRouter dashboard"
echo ""

# Check Vercel status if available
echo "🔍 Vercel Deployment Status:"
echo "---------------------------"
echo "Project: ihemp-template (GitHub: dcnotpc/ihemp-template)"
echo "Required Env: NEXT_PUBLIC_STATE=colorado"
echo "Build status: Unknown (check Vercel dashboard)"
echo ""

echo "🔔 Recommendations:"
echo "------------------"
echo "1. Set OpenRouter spending limit: https://openrouter.ai/settings/limits"
echo "2. Configure billing alerts"
echo "3. Monitor deployment frequency"
echo "4. Review token usage weekly"
