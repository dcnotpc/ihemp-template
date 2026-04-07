#!/usr/bin/env python3
"""
Convert state data from CSV/Google Sheets to TypeScript files.

Usage:
    python convert-state-data.py data.csv

CSV columns (required):
    name,slug,abbreviation,status,thcLimit,summary,regulatoryBody,regulatoryUrl,licensingInfo,lastUpdated

CSV columns (optional, can be JSON):
    laws (JSON array: [{"title": "...", "url": "...", "year": 2023}, ...])
    resources (JSON array: [{"label": "...", "url": "..."}, ...])
    notes (string)

Example CSV row:
    "Kentucky,kentucky,KY,legal,0.3% total THC,<summary>,Kentucky Department of Agriculture,https://...,<licensing>,2026-04-07,[{""title"":""..."",""url"":""..."",""year"":2023}],[{""label"":""..."",""url"":""...""}],<notes>"
"""

import csv
import json
import sys
import os
from pathlib import Path

def parse_json_field(value):
    """Parse JSON field or return empty list/dict."""
    if not value or value.strip() == '':
        return []
    try:
        return json.loads(value)
    except json.JSONDecodeError:
        print(f"Warning: Could not parse JSON field: {value[:50]}...")
        return []

def create_state_ts(slug, row):
    """Generate TypeScript content for a state."""
    
    # Parse optional JSON fields
    laws = parse_json_field(row.get('laws', ''))
    resources = parse_json_field(row.get('resources', ''))
    
    # Build TypeScript object
    ts = f"""import {{ State }} from '../types'

export const {slug.replace('-', '')}: State = {{
  name: '{row['name']}',
  slug: '{row['slug']}',
  abbreviation: '{row['abbreviation']}',
  status: '{row['status']}',
  summary: `{row['summary']}`,
  thcLimit: '{row['thcLimit']}',
  laws: {json.dumps(laws, indent=4)},
  resources: {json.dumps(resources, indent=4)},
  regulatoryBody: '{row['regulatoryBody']}',
  regulatoryUrl: '{row['regulatoryUrl']}',
  licensingInfo: `{row['licensingInfo']}`,
  notes: `{row.get('notes', '')}`,
  lastUpdated: '{row['lastUpdated']}'
}}
"""
    return ts

def main():
    if len(sys.argv) != 2:
        print("Usage: python convert-state-data.py data.csv")
        sys.exit(1)
    
    csv_file = sys.argv[1]
    states_dir = Path("src/data/states")
    
    if not states_dir.exists():
        print(f"Error: {states_dir} directory not found")
        sys.exit(1)
    
    with open(csv_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            slug = row['slug']
            filename = states_dir / f"{slug}.ts"
            
            try:
                ts_content = create_state_ts(slug, row)
                with open(filename, 'w', encoding='utf-8') as out:
                    out.write(ts_content)
                print(f"✓ Updated {filename}")
            except KeyError as e:
                print(f"✗ Missing required field {e} in row for {slug}")
            except Exception as e:
                print(f"✗ Error processing {slug}: {e}")
    
    print(f"\n✅ Updated {states_dir} files from {csv_file}")

if __name__ == "__main__":
    main()