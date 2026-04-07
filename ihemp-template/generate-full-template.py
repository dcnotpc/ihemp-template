#!/usr/bin/env python3
"""
Generate a complete CSV template with all 50 states.
Reads existing state files to preserve any data, adds placeholders for missing fields.
"""

import csv
import json
import os
from pathlib import Path

# List of all 50 US states with abbreviations
ALL_STATES = [
    ("Alabama", "AL", "alabama"),
    ("Alaska", "AK", "alaska"),
    ("Arizona", "AZ", "arizona"),
    ("Arkansas", "AR", "arkansas"),
    ("California", "CA", "california"),
    ("Colorado", "CO", "colorado"),
    ("Connecticut", "CT", "connecticut"),
    ("Delaware", "DE", "delaware"),
    ("Florida", "FL", "florida"),
    ("Georgia", "GA", "georgia"),
    ("Hawaii", "HI", "hawaii"),
    ("Idaho", "ID", "idaho"),
    ("Illinois", "IL", "illinois"),
    ("Indiana", "IN", "indiana"),
    ("Iowa", "IA", "iowa"),
    ("Kansas", "KS", "kansas"),
    ("Kentucky", "KY", "kentucky"),
    ("Louisiana", "LA", "louisiana"),
    ("Maine", "ME", "maine"),
    ("Maryland", "MD", "maryland"),
    ("Massachusetts", "MA", "massachusetts"),
    ("Michigan", "MI", "michigan"),
    ("Minnesota", "MN", "minnesota"),
    ("Mississippi", "MS", "mississippi"),
    ("Missouri", "MO", "missouri"),
    ("Montana", "MT", "montana"),
    ("Nebraska", "NE", "nebraska"),
    ("Nevada", "NV", "nevada"),
    ("New Hampshire", "NH", "new-hampshire"),
    ("New Jersey", "NJ", "new-jersey"),
    ("New Mexico", "NM", "new-mexico"),
    ("New York", "NY", "new-york"),
    ("North Carolina", "NC", "north-carolina"),
    ("North Dakota", "ND", "north-dakota"),
    ("Ohio", "OH", "ohio"),
    ("Oklahoma", "OK", "oklahoma"),
    ("Oregon", "OR", "oregon"),
    ("Pennsylvania", "PA", "pennsylvania"),
    ("Rhode Island", "RI", "rhode-island"),
    ("South Carolina", "SC", "south-carolina"),
    ("South Dakota", "SD", "south-dakota"),
    ("Tennessee", "TN", "tennessee"),
    ("Texas", "TX", "texas"),
    ("Utah", "UT", "utah"),
    ("Vermont", "VT", "vermont"),
    ("Virginia", "VA", "virginia"),
    ("Washington", "WA", "washington"),
    ("West Virginia", "WV", "west-virginia"),
    ("Wisconsin", "WI", "wisconsin"),
    ("Wyoming", "WY", "wyoming")
]

def extract_existing_data(slug):
    """Extract data from existing TypeScript file if it exists."""
    filepath = Path(f"src/data/states/{slug}.ts")
    if not filepath.exists():
        return {}
    
    try:
        content = filepath.read_text(encoding='utf-8')
        # Very basic extraction - just get the object content
        # This is simplified; a real parser would be better
        lines = content.split('\n')
        data = {}
        
        for line in lines:
            line = line.strip()
            if ':' in line and not line.startswith('import'):
                key_value = line.split(':', 1)
                key = key_value[0].strip()
                value = key_value[1].strip().rstrip(',')
                
                # Clean up quotes and backticks
                if value.startswith('`') and value.endswith('`'):
                    value = value[1:-1]
                elif value.startswith("'") and value.endswith("'"):
                    value = value[1:-1]
                elif value.startswith('"') and value.endswith('"'):
                    value = value[1:-1]
                elif value.startswith('[') and value.endswith(']'):
                    # JSON array
                    pass
                
                data[key] = value
        
        return data
    except Exception as e:
        print(f"Warning: Could not parse {filepath}: {e}")
        return {}

def main():
    output_file = "state-data-all-50.csv"
    fieldnames = [
        'name', 'slug', 'abbreviation', 'status', 'thcLimit', 'summary',
        'regulatoryBody', 'regulatoryUrl', 'licensingInfo', 'laws', 
        'resources', 'notes', 'lastUpdated'
    ]
    
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for name, abbr, slug in ALL_STATES:
            existing = extract_existing_data(slug)
            
            # Default values
            row = {
                'name': name,
                'slug': slug,
                'abbreviation': abbr,
                'status': existing.get('status', 'pending'),
                'thcLimit': existing.get('thcLimit', '0.3% total THC on a dry-weight basis'),
                'summary': existing.get('summary', f'Hemp regulations for {name} are currently being researched.'),
                'regulatoryBody': existing.get('regulatoryBody', ''),
                'regulatoryUrl': existing.get('regulatoryUrl', ''),
                'licensingInfo': existing.get('licensingInfo', ''),
                'laws': existing.get('laws', '[]'),
                'resources': existing.get('resources', '[]'),
                'notes': existing.get('notes', ''),
                'lastUpdated': existing.get('lastUpdated', '2026-04-07')
            }
            
            writer.writerow(row)
    
    print(f"✅ Created {output_file} with all 50 states")
    print(f"📊 Includes existing data from src/data/states/ files")
    print(f"📝 Ready for import into Google Sheets")

if __name__ == "__main__":
    main()