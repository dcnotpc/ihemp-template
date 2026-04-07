#!/usr/bin/env python3
"""
Generate a clean CSV template with proper Colorado data.
"""

import csv
import json

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

# Colorado data from the actual TypeScript file
COLORADO_DATA = {
    "name": "Colorado",
    "slug": "colorado",
    "abbreviation": "CO",
    "status": "legal",
    "thcLimit": "0.3% total THC on a dry-weight basis",
    "summary": "Colorado permits hemp cultivation under a state registration program administered by the Colorado Department of Agriculture, with sampling, testing, and disposal requirements aligned to the USDA framework. The state also allows many hemp-derived consumer products, but it takes a relatively strict approach to intoxicating or chemically modified hemp cannabinoids, especially in food, dietary supplements, and cosmetics.",
    "regulatoryBody": "Colorado Department of Agriculture",
    "regulatoryUrl": "https://ag.colorado.gov/plants/industrial-hemp-program",
    "licensingInfo": "Colorado uses registrations for hemp cultivation and seed activities through the Colorado Department of Agriculture rather than a single universal hemp business license. Registrants must identify growing locations, comply with pre-harvest sampling and testing, maintain records, and dispose of non-compliant crops; businesses making ingestible or cosmetic hemp products may also need applicable food or manufacturing licenses.",
    "laws": json.dumps([
        {"title": "SB19-220 Industrial Hemp Regulatory Authority", "url": "https://ag.colorado.gov/plants/hemp", "year": 2019},
        {"title": "HB22-1341 Marijuana and Industrial Hemp Regulation", "url": "https://leg.colorado.gov/bills/hb22-1341", "year": 2022}
    ]),
    "resources": json.dumps([
        {"label": "State Hemp Program", "url": "https://ag.colorado.gov/plants/industrial-hemp-program"},
        {"label": "License/Application Portal", "url": ""},
        {"label": "Testing Requirements", "url": "https://ag.colorado.gov/plants/industrial-hemp-program"}
    ]),
    "notes": "Colorado is more restrictive than many states on intoxicating hemp products and chemically modified or converted cannabinoids such as delta-8-style products. Finished-product compliance can also involve CDPHE and, for some product categories, marijuana rules; official General Assembly bill pages are used here because they are the reliable public bill record.",
    "lastUpdated": "2026-04-05"
}

def main():
    output_file = "state-data-template-clean.csv"
    fieldnames = [
        'name', 'slug', 'abbreviation', 'status', 'thcLimit', 'summary',
        'regulatoryBody', 'regulatoryUrl', 'licensingInfo', 'laws', 
        'resources', 'notes', 'lastUpdated'
    ]
    
    with open(output_file, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        
        for name, abbr, slug in ALL_STATES:
            if slug == "colorado":
                writer.writerow(COLORADO_DATA)
            else:
                row = {
                    'name': name,
                    'slug': slug,
                    'abbreviation': abbr,
                    'status': 'pending',
                    'thcLimit': '0.3% total THC on a dry-weight basis',
                    'summary': f'Hemp regulations for {name} are currently being researched.',
                    'regulatoryBody': '',
                    'regulatoryUrl': '',
                    'licensingInfo': '',
                    'laws': '[]',
                    'resources': '[]',
                    'notes': '',
                    'lastUpdated': '2026-04-07'
                }
                writer.writerow(row)
    
    print(f"✅ Created {output_file}")
    print(f"📊 Colorado data complete, 49 states with placeholders")
    print(f"📝 Ready for Google Sheets import")

if __name__ == "__main__":
    main()