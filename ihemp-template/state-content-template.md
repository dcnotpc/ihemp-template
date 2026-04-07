# State Content Template

Copy this template for each state. Fill in all fields.

## Basic Info
- **State Name**: (e.g., Kentucky)
- **Slug**: (lowercase, hyphenated, e.g., kentucky)  
- **Abbreviation**: (2-letter, e.g., KY)
- **Status**: (legal/restricted/pending/illegal)
- **THC Limit**: (e.g., "0.3% total THC", "0.3% delta-9 THC", "1% total THC")
- **Regulatory Body**: (e.g., Kentucky Department of Agriculture)
- **Regulatory URL**: (official program page)
- **License/Application Portal URL**: (if different from regulatory URL)
- **Last Updated**: YYYY-MM-DD

## Summary Description
(1-3 paragraphs describing the state's hemp program, attitude, key regulations)

## Laws & Regulations
(Minimum 2-3 entries, with titles, URLs, and years)
- Title: (e.g., "Kentucky Hemp Commission Act")
  URL: https://...
  Year: 2023

- Title: (e.g., "HB 236 Hemp Regulation Update")
  URL: https://...
  Year: 2024

## Resources
(3-5 important links for farmers/businesses)
- Label: "State Hemp Program"
  URL: https://...

- Label: "Application Portal" 
  URL: https://...

- Label: "Testing Requirements"
  URL: https://...

## Licensing Information
(Detailed paragraph about licensing process, requirements, fees)

## Notes
(Any special considerations, restrictions, recent changes)

## Logo
- File name: `ihemp-<state-slug>-logo-cream.webp`
- Format: WebP preferred, PNG/SVG acceptable
- Dimensions: At least 200×200 pixels
- Color: Cream/white background preferred

---

# Example: Colorado

```typescript
import { State } from '../types'

export const colorado: State = {
  name: 'Colorado',
  slug: 'colorado',
  abbreviation: 'CO',
  status: 'legal',
  summary: 'Colorado permits hemp cultivation under a state registration program...',
  thcLimit: '0.3% total THC on a dry-weight basis...',
  laws: [
    { title: 'SB19-220 Industrial Hemp Regulatory Authority', url: 'https://ag.colorado.gov/plants/hemp', year: 2019 },
    { title: 'HB22-1341 Marijuana and Industrial Hemp Regulation', url: 'https://leg.colorado.gov/bills/hb22-1341', year: 2022 }
  ],
  resources: [
    { label: 'State Hemp Program', url: 'https://ag.colorado.gov/plants/industrial-hemp-program' },
    { label: 'License/Application Portal', url: '' },
    { label: 'Testing Requirements', url: 'https://ag.colorado.gov/plants/industrial-hemp-program' }
  ],
  regulatoryBody: 'Colorado Department of Agriculture',
  regulatoryUrl: 'https://ag.colorado.gov/plants/industrial-hemp-program',
  licensingInfo: 'Colorado uses registrations for hemp cultivation and seed activities...',
  notes: 'Colorado is more restrictive than many states on intoxicating hemp products...',
  lastUpdated: '2026-04-05'
}
```

# Data Collection Options

## Option 1: Google Sheets (Recommended)
Create a Google Sheet with columns matching above fields. I can import to TypeScript files.

## Option 2: CSV File
Upload a CSV file with same structure. I'll convert to TypeScript.

## Option 3: Individual Files
Upload 49 `.txt` or `.md` files (one per state) using the template above.

## Option 4: Direct File Creation
I can create initial files from basic info, then you review/edit.

# Next Steps
1. Choose collection method
2. Provide data (Google Sheet link, CSV, or files)
3. I'll generate all 49 TypeScript files
4. Upload logos to `/public/images/`
5. Test builds for all states

Ready when you are! 🌿