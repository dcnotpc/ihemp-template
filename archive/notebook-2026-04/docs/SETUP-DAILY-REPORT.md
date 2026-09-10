# iHemp Daily Report - Setup Instructions

## 📋 What's Been Created

1. **Report Generator**: `generate-daily-report.py`
   - Generates Option A Operations Dashboard
   - 5 monitoring areas: OpenClaw, Vercel, URLs, Content, Compliance

2. **Scheduler Script**: `schedule-daily-report.sh`
   - Runs the report generator
   - Creates notification files
   - Logs to `reports/cron-logs/`

3. **Cron Template**: `cron-ihemp-daily`
   - Configured for 7:30 AM Eastern (11:30 UTC EDT)

## ⚙️ Installation Steps

### Step 1: Test the Report Generator
```bash
cd ~/.openclaw/workspace
python3 generate-daily-report.py
```

### Step 2: Test the Scheduler Script
```bash
cd ~/.openclaw/workspace
./schedule-daily-report.sh
```

Check for:
- `daily-operations-dashboard.txt` (full report)
- `daily-report-summary.txt` (summary)
- `reports/cron-logs/daily-report-*.log` (logs)
- `ALERT-DAILY-REPORT-READY.txt` (notification)

### Step 3: Install Cron Job

**Option A: User Crontab** (Recommended)
```bash
# Add to your personal crontab
crontab -e
```

Add this line:
```
# iHemp Daily Report at 7:30 AM Eastern (11:30 UTC EDT)
30 11 * * * /bin/bash /home/dcnotpc420/.openclaw/workspace/schedule-daily-report.sh
```

**Option B: System Cron**
```bash
# Copy to system cron.d
sudo cp cron-ihemp-daily /etc/cron.d/ihemp-daily
sudo chown root:root /etc/cron.d/ihemp-daily
```

## ⏰ Time Zone Considerations

- **Current System Time Zone**: America/Detroit (EDT, UTC-4)
- **Cron runs in system time (UTC)**
- **7:30 AM Eastern = 11:30 UTC** (during EDT, Apr-Oct)
- **7:30 AM Eastern = 12:30 UTC** (during EST, Nov-Mar)

**IMPORTANT**: Update the cron entry when daylight saving time changes:
- **November**: Change from `30 11` to `30 12`
- **March**: Change from `30 12` to `30 11`

## 📊 Report Contents

The daily report includes:

### 1. OpenClaw Status
- Token usage and costs
- Context usage
- Session information

### 2. Vercel Deployments
- Project count (target: 18 sites)
- Deployment health
- Environment variables status
- Build errors

### 3. State Law URL Health
- All 50 state hemp program URLs
- Broken link detection
- Critical issues (404, 403, SSL errors)

### 4. Content Pipeline
- Blog post count
- Drafts vs published
- Recent activity

### 5. Compliance Status
- Compliance keyword detection
- Agent configuration status
- FDA/FTC compliance framework

### 6. Critical Alerts
- System failures
- Blocking issues
- Action items

## 🚨 Notification System

After each run, these files are created:

1. **`ALERT-DAILY-REPORT-READY.txt`**
   - Main notification for CEO
   - Contains summary and quick commands
   - **You should check this file each morning**

2. **`daily-operations-dashboard.txt`**
   - Full detailed report
   - Complete operational snapshot

3. **`daily-report-summary.txt`**
   - Condensed version
   - Critical alerts and key metrics

4. **`reports/cron-logs/daily-report-YYYYMMDD.log`**
   - Complete execution log
   - Debugging information

## 🔧 Troubleshooting

### Report Fails to Generate
```bash
# Check Python dependencies
python3 -c "import requests, json, os, sys from pathlib import Path"

# Check script permissions
ls -la generate-daily-report.py schedule-daily-report.sh

# Run manually with debug
cd ~/.openclaw/workspace
python3 generate-daily-report.py 2>&1 | less
```

### Cron Not Running
```bash
# Check cron logs
sudo grep CRON /var/log/syslog | tail -20

# Check your crontab
crontab -l

# Test cron syntax
echo "30 11 * * * echo 'test'" | crontab -
```

### Missing Vercel API Token
The report needs a valid Vercel API token in `check-deployments.py`. Update:
```python
API_TOKEN = "your_actual_vercel_token_here"
```

## 📈 Future Enhancements

Potential improvements:
1. **Email integration** - Send report via email
2. **Telegram bot** - Auto-post to Telegram channel
3. **Web dashboard** - Real-time monitoring interface
4. **Historical trends** - Track metrics over time
5. **Alert thresholds** - Automatic paging for critical issues

## 🛡️ Security Notes

- **No sensitive data** in reports (costs are estimates)
- **Local files only** - Reports stay in workspace
- **Manual review required** - No auto-posting to external channels
- **Compliance-safe** - Follows iHemp SOUL.md guidelines

## ✅ Verification

After setup, verify:
- [ ] Report generates successfully
- [ ] Notification files are created
- [ ] Cron job is scheduled
- [ ] You receive and review first report
- [ ] Critical alerts are actionable

---

**Maintained by**: iHemp AI Operations System  
**Last Updated**: 2026-04-09  
**Contact**: Dave Crabill (CEO)