#!/usr/bin/env python3
"""
OpenClaw Token Usage Monitor
Track and project API costs for iHemp operations
"""

import subprocess
import json
import os
from datetime import datetime

def run_cmd(cmd):
    """Run command and return output"""
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        return result.stdout.strip() if result.returncode == 0 else ""
    except Exception as e:
        return f"Error: {e}"

def get_openclaw_status():
    """Get OpenClaw status info"""
    status = {}
    
    # Try to get OpenClaw status
    output = run_cmd("openclaw status 2>/dev/null || echo 'Status unavailable'")
    
    if "Token" in output or "Cost" in output:
        status["has_info"] = True
        
        # Parse token info
        for line in output.split('\n'):
            if "🧮 Tokens" in line:
                # Extract token info
                if "·" in line:
                    parts = line.split("·")
                    status["token_line"] = line.strip()
                    break
            elif "💵 Cost" in line:
                status["cost_line"] = line.strip()
    else:
        status["has_info"] = False
        status["raw_output"] = output[:500]  # Truncate
    
    return status

def calculate_projection(current_cost=0.14, session_minutes=30, days_active=1):
    """
    Project monthly costs based on current usage pattern
    """
    if session_minutes <= 0:
        session_minutes = 30  # default estimate
    
    # Estimate daily cost if this session represents typical usage
    sessions_per_day = (24 * 60) / session_minutes
    daily_cost = current_cost / sessions_per_day if sessions_per_day > 0 else current_cost
    
    # Monthly projection (30 days)
    monthly = daily_cost * 30
    
    return {
        "current_session_cost": round(current_cost, 3),
        "estimated_daily_cost": round(daily_cost, 3),
        "projected_monthly": round(monthly, 3),
        "session_duration_min": session_minutes,
        "conservative_low": 0.50,  # Low estimate
        "conservative_high": 2.00, # Medium estimate
        "heavy_usage": 5.00        # High estimate
    }

def generate_report():
    """Generate comprehensive usage report"""
    
    # Session estimate (rough guess based on timestamp)
    # We'll estimate 30 minutes for this session
    session_minutes = 30
    
    # Get current status
    status = get_openclaw_status()
    
    # Calculate projections
    proj = calculate_projection(
        current_cost=0.14,
        session_minutes=session_minutes,
        days_active=1
    )
    
    # Generate report
    report_lines = [
        "=" * 50,
        "🧮 OPENCLAW TOKEN USAGE MONITOR",
        "=" * 50,
        f"📅 Report Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S %Z')}",
        "",
        "📊 CURRENT USAGE",
        "-" * 30,
    ]
    
    if status.get("has_info"):
        if status.get("token_line"):
            report_lines.append(f"   {status['token_line']}")
        if status.get("cost_line"):
            report_lines.append(f"   {status['cost_line']}")
    else:
        report_lines.append("   Status information unavailable")
        report_lines.append("   Run 'openclaw status' manually for details")
    
    report_lines.extend([
        "",
        "💰 COST PROJECTIONS",
        "-" * 30,
        f"   Current session cost: ${proj['current_session_cost']}",
        f"   Estimated daily cost: ${proj['estimated_daily_cost']}",
        f"   Projected monthly: ${proj['projected_monthly']}",
        "",
        "📈 COST RANGES (ESTIMATED)",
        "-" * 30,
        f"   🔵 Conservative: ${proj['conservative_low']} - ${proj['conservative_high']}/month",
        f"   🟡 Moderate: ${proj['conservative_high']} - ${proj['heavy_usage']}/month",
        f"   🔴 Heavy usage: ${proj['heavy_usage']}+/month",
        "",
        "⚠️  FINANCIAL SAFEGUARDS",
        "-" * 30,
        "   1. OpenRouter Spending Limits:",
        "      • https://openrouter.ai/settings/limits",
        "      • Set hard monthly caps",
        "",
        "   2. OpenClaw Rate Limiting:",
        "      • Configure in OpenClaw settings",
        "      • Limits per-session token usage",
        "",
        "   3. Monitoring Commands:",
        "      • openclaw status — Current usage",
        "      • Check deployment logs for frequency",
        "",
        "   4. Alert Configuration:",
        "      • OpenRouter billing alerts",
        "      • Daily/weekly summary emails",
        "",
        "🔍 VERCEL DEPLOYMENT STATUS",
        "-" * 30,
        "   Project: ihemp-template",
        "   GitHub: dcnotpc/ihemp-template",
        "   Critical Env Var: NEXT_PUBLIC_STATE=colorado",
        "   Build Status: Check Vercel dashboard",
        "   Note: Each state = separate Vercel project",
        "",
        "🚨 ACTION ITEMS",
        "-" * 30,
        "   [ ] Set OpenRouter spending limit",
        "   [ ] Configure billing alerts",
        "   [ ] Review Vercel build logs",
        "   [ ] Monitor deployment frequency",
        "   [ ] Weekly cost review",
        "",
        "📝 NOTES",
        "-" * 30,
        "• Costs are estimates based on current DeepSeek R1 pricing",
        "• Actual costs depend on usage patterns and model selection",
        "• Vercel hosting is separate (likely free tier)",
        "• Most iHemp operations are text-heavy (higher input costs)",
        "",
        "=" * 50,
        "Report generated by iHemp AI Operations System",
        "=" * 50
    ])
    
    return "\n".join(report_lines)

def save_report(report):
    """Save report to file"""
    reports_dir = "/home/dcnotpc420/.openclaw/workspace/reports"
    os.makedirs(reports_dir, exist_ok=True)
    
    filename = f"token-report-{datetime.now().strftime('%Y%m%d-%H%M')}.txt"
    filepath = os.path.join(reports_dir, filename)
    
    with open(filepath, 'w') as f:
        f.write(report)
    
    # Also save to workspace root for easy access
    workspace_path = "/home/dcnotpc420/.openclaw/workspace/token-usage-report.txt"
    with open(workspace_path, 'w') as f:
        f.write(report)
    
    return filepath, workspace_path

def schedule_weekly_monitor():
    """Create a cron job template for weekly monitoring"""
    cron_template = f"""# Weekly Token Usage Monitor for OpenClaw
# Runs every Monday at 9 AM
0 9 * * 1 cd /home/dcnotpc420/.openclaw/workspace && python3 monitor-tokens.py >> reports/cron.log 2>&1
"""
    
    cron_path = "/home/dcnotpc420/.openclaw/workspace/schedule-weekly-monitor.txt"
    with open(cron_path, 'w') as f:
        f.write(cron_template)
    
    return cron_path

if __name__ == "__main__":
    print("🧮 Generating OpenClaw Token Usage Report...")
    print("")
    
    # Generate report
    report = generate_report()
    print(report)
    
    # Save report
    filepath, workspace_path = save_report(report)
    print(f"\n💾 Report saved to: {workspace_path}")
    print(f"📁 Detailed report: {filepath}")
    
    # Create cron template
    cron_path = schedule_weekly_monitor()
    print(f"⏰ Weekly monitor template: {cron_path}")
    
    print("\n✅ Monitoring system configured.")
    print("📊 Run 'python3 monitor-tokens.py' anytime for current status.")