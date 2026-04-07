# Download CSV File for Google Sheets

## File Location
`/home/dcnotpc420/.openclaw/workspace/ihemp-template/state-data-template-clean.csv`

## Download Methods

### Method 1: Terminal/SSH (Recommended)
```bash
# Copy to your Downloads folder:
cp ~/.openclaw/workspace/ihemp-template/state-data-template-clean.csv ~/Downloads/

# Then open Google Sheets:
# 1. Go to https://sheets.google.com
# 2. Click "New" → "File" → "Import"
# 3. Upload the CSV
```

### Method 2: Direct Paste into Google Sheets
1. **Open Google Sheets** (https://sheets.google.com)
2. **Create new spreadsheet**
3. **Click cell A1** (top-left)
4. **Paste CSV content** (see below)

### Method 3: HTTP Download (if local network)
```
http://dcnotpclab:8080/state-data-template-clean.csv
```

## CSV Content Summary
3 states complete, 47 to fill:

### States COMPLETE (real data):
1. **Colorado** - All fields filled, real regulations

### States PLACEHOLDER (needs research):
- Kentucky, Texas, Florida, Michigan, Ohio, etc.

### Columns to Fill:
1. **status** (legal/restricted/pending/illegal)
2. **thcLimit** (e.g., "0.3% total THC")
3. **summary** (1-3 paragraph description)
4. **regulatoryBody** (state agency name)
5. **regulatoryUrl** (official program URL)
6. **licensingInfo** (paragraph about licensing)
7. **laws** (JSON array of laws with URLs)
8. **resources** (JSON array of helpful links)
9. **notes** (any special considerations)
10. **lastUpdated** (YYYY-MM-DD)

## Next Steps After Google Sheets Creation
1. Share Sheet link with me (view-only access is fine)
2. I'll set up automated CSV export → TypeScript conversion
3. We'll batch update all 49 state files
4. Test deployments for each state

---

**Quick Start**: Use Method 1 (terminal) to copy file, then Method 2 (Google Sheets import).