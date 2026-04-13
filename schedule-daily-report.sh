#!/bin/bash
# iHemp Daily Report Scheduler
# Run at 7:30 AM Eastern Time (11:30 UTC during EDT)

set -e

WORKSPACE="/home/dcnotpc420/.openclaw/workspace"
LOG_DIR="$WORKSPACE/reports/cron-logs"
LOG_FILE="$LOG_DIR/daily-report-$(date +%Y%m%d).log"

# Create log directory
mkdir -p "$LOG_DIR"

# Log start
echo "=== iHemp Daily Report Started at $(date) ===" >> "$LOG_FILE"

# Change to workspace
cd "$WORKSPACE"

# Generate report - output both to log and stdout
echo "[$(date)] Generating daily operations dashboard..." | tee -a "$LOG_FILE"
python3 generate-daily-report.py 2>&1 | tee -a "$LOG_FILE"

# Check if successful
if [ $? -eq 0 ]; then
    echo "[$(date)] Report generated successfully" >> "$LOG_FILE"
    
    # Create notification file for CEO
    NOTIFICATION_FILE="$WORKSPACE/ALERT-DAILY-REPORT-READY.txt"
    
    # Get current timestamp
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S %Z')
    
    # Create notification
    cat > "$NOTIFICATION_FILE" << EOF
🌿 DAILY iHEMP REPORT READY - $(date '+%Y-%m-%d')
======================================================================

📅 Generated: $TIMESTAMP
📊 Report File: $WORKSPACE/daily-operations-dashboard.txt
📁 Full Log: $LOG_FILE
📈 Summary: $WORKSPACE/daily-report-summary.txt

🔔 ACTION REQUIRED:
1. Review the daily report
2. Address any critical alerts
3. Check deployment status

📋 QUICK SUMMARY:
$(tail -20 "$WORKSPACE/daily-operations-dashboard.txt" 2>/dev/null | grep -A5 "🚨\|📊\|📋" || echo "Check full report for details")

⚡ QUICK COMMANDS:
• View report:  cat $WORKSPACE/daily-operations-dashboard.txt
• View summary: cat $WORKSPACE/daily-report-summary.txt
• View logs:    tail -20 $LOG_FILE
• Manual run:   cd $WORKSPACE && python3 generate-daily-report.py

======================================================================
Notification will be cleared when you check the report.
This file indicates a report is waiting for review.
EOF
    
    # Create summary file
    SUMMARY_FILE="$WORKSPACE/daily-report-summary.txt"
    
    if [ -f "$WORKSPACE/daily-operations-dashboard.txt" ]; then
        # Extract key sections
        {
            echo "🌿 iHemp Daily Report Summary - $(date '+%Y-%m-%d %H:%M')"
            echo "======================================================================"
            echo ""
            
            # Get OpenClaw status section
            awk '/📊 OPENCLAW STATUS/,/🚀 VERCEL DEPLOYMENTS/' "$WORKSPACE/daily-operations-dashboard.txt" | \
                grep -v "VERCEL DEPLOYMENTS" | head -10
            
            echo ""
            
            # Get critical alerts
            awk '/🚨 CRITICAL ALERTS/,/📋 RECOMMENDED ACTIONS/' "$WORKSPACE/daily-operations-dashboard.txt" | \
                grep -v "RECOMMENDED ACTIONS"
            
            echo ""
            echo "======================================================================"
            echo "Full report: $WORKSPACE/daily-operations-dashboard.txt"
        } > "$SUMMARY_FILE"
    fi
    
    echo "[$(date)] Notification created: $NOTIFICATION_FILE" >> "$LOG_FILE"
    echo "[$(date)] Summary created: $SUMMARY_FILE" >> "$LOG_FILE"
    
else
    echo "[$(date)] ERROR: Failed to generate report" >> "$LOG_FILE"
    
    # Create error notification
    ERROR_NOTIFICATION="$WORKSPACE/ALERT-REPORT-FAILED.txt"
    cat > "$ERROR_NOTIFICATION" << EOF
❌ DAILY iHEMP REPORT FAILED - $(date '+%Y-%m-%d')
======================================================================

🚨 ERROR: Daily report generation failed
📅 Time: $(date)
📁 Error Log: $LOG_FILE

🔧 TROUBLESHOOTING:
1. Check Python installation: python3 --version
2. Check script permissions: ls -la $WORKSPACE/generate-daily-report.py
3. Run manually: cd $WORKSPACE && python3 generate-daily-report.py
4. Check dependencies: pip list | grep requests

📞 IMMEDIATE ACTION:
• Review the error log above
• Fix any dependency issues
• Verify report script can run

======================================================================
This is a critical alert - daily monitoring is not functioning.
EOF
    
    echo "[$(date)] Error notification created: $ERROR_NOTIFICATION" >> "$LOG_FILE"
    exit 1
fi

echo "[$(date)] Daily report process completed" >> "$LOG_FILE"
echo "=== iHemp Daily Report Completed at $(date) ===" >> "$LOG_FILE"