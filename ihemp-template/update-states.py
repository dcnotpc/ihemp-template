#!/usr/bin/env python3
"""
Update state TypeScript files with real data from provided arrays
"""

import os
import json
import re
from typing import Dict, List, Any

# Data from first batch (12 states)
first_batch = """{
    "Kentucky": {
        "status": "legal",
        "summary": "Kentucky runs a mature hemp program through KDA and allows cultivation, handling, and processing under state licensing tied to the USDA framework. The state also regulates hemp-derived cannabinoid products more closely than it once did, especially around packaging, testing, age limits, and retail sale of intoxicating products.",
        "thcLimit": "0.3% total THC on a dry-weight basis, aligned with federal production rules; pre-harvest compliance is based on total THC.",
        "laws": [
            {"title": "SB50 Industrial Hemp", "url": "https://apps.legislature.ky.gov/record/13rs/sb50.html", "year": 2013},
            {"title": "SB47 Hemp-Derived Cannabinoid Products", "url": "https://apps.legislature.ky.gov/record/23rs/sb47.html", "year": 2023}
        ],
        "resources": [
            {"label": "State Hemp Program", "url": "https://www.kyagr.com/marketing/hemp.html"},
            {"label": "License/Application Portal", "url": ""},
            {"label": "Testing Requirements", "url": "https://www.kyagr.com/marketing/hemp.html"}
        ],
        "regulatoryBody": "Kentucky Department of Agriculture",
        "regulatoryUrl": "https://www.kyagr.com/marketing/hemp.html",
        "licensingInfo": "KDA licenses growers and handlers or processors. Applicants identify sites, submit maps and reports, comply with sampling and testing, and destroy non-compliant crops.",
        "notes": "SB47 in 2023 added a clearer framework for hemp-derived cannabinoid products. Retail product compliance deserves separate review from cultivation rules."
    },
    "Ohio": {
        "status": "legal",
        "summary": "Ohio permits hemp cultivation and processing under ODA licensing consistent with USDA rules. Hemp-derived products are generally allowed, but businesses should watch evolving enforcement and labeling expectations for intoxicating cannabinoids.",
        "thcLimit": "0.3% total THC on a dry-weight basis, aligned with federal production rules; pre-harvest compliance is based on total THC.",
        "laws": [
            {"title": "SB57 Legalize Hemp and Hemp Products", "url": "https://www.legislature.ohio.gov/legislation/133/sb57", "year": 2019}
        ],
        "resources": [
            {"label": "State Hemp Program", "url": "https://agri.ohio.gov/divisions/hemp-program"},
            {"label": "License/Application Portal", "url": ""},
            {"label": "Testing Requirements", "url": "https://agri.ohio.gov/divisions/hemp-program"}
        ],
        "regulatoryBody": "Ohio Department of Agriculture",
        "regulatoryUrl": "https://agri.ohio.gov/divisions/hemp-program",
        "licensingInfo": "ODA issues cultivation and processing licenses. Applicants register sites, report acreage and harvests, comply with sampling and testing, and remediate or dispose of non-compliant lots.",
        "notes": "Ohio is relatively straightforward on cultivation. Finished-product compliance can still involve separate food, drug, and consumer protection rules."
    },
    "Alabama": {
        "status": "legal",
        "summary": "Alabama allows hemp cultivation under ADAI licensing and uses USDA-style sampling and testing rules. The state permits hemp-derived products, but product-specific compliance requires closer review than cultivation alone.",
        "thcLimit": "0.3% total THC on a dry-weight basis, aligned with federal production rules; pre-harvest compliance is based on total THC.",
        "laws": [
            {"title": "SB225 Alabama Industrial Hemp Research Program Act", "url": "", "year": 2016},
            {"title": "HB445 Hemp Extract Products", "url": "", "year": 2021}
        ],
        "resources": [
            {"label": "State Hemp Program", "url": "https://agi.alabama.gov/plant-protection/industrial-hemp-program/"},
            {"label": "License/Application Portal", "url": ""},
            {"label": "Testing Requirements", "url": "https://agi.alabama.gov/plant-protection/industrial-hemp-program/"}
        ],
        "regulatoryBody": "Alabama Department of Agriculture and Industries",
        "regulatoryUrl": "https://agi.alabama.gov/plant-protection/industrial-hemp-program/",
        "licensingInfo": "ADAI licenses growers, processors, and universities under the state hemp program. Licensees register locations, comply with pre-harvest sampling and testing, maintain records, and dispose of non-compliant material.",
        "notes": "Consumer-product rules and enforcement deserve live review before launch. Official bill-link fields are left blank here where I was not sufficiently confident in a stable direct state bill URL."
    },
    "Florida": {
        "status": "legal",
        "summary": "Florida authorizes hemp cultivation through FDACS and broadly permits hemp extract products, subject to registration, labeling, testing, and food-safety rules. The market is legal but compliance-heavy, especially for consumer-facing products.",
        "thcLimit": "0.3% total THC on a dry-weight basis for cultivation, aligned with federal law; separate limits and testing standards apply to hemp extract products.",
        "laws": [
            {"title": "SB1020 State Hemp Program", "url": "https://www.flsenate.gov/Session/Bill/2019/1020", "year": 2019}
        ],
        "resources": [
            {"label": "State Hemp Program", "url": "https://www.fdacs.gov/Cannabis-Hemp/Hemp-CBD-in-Florida"},
            {"label": "License/Application Portal", "url": ""},
            {"label": "Testing Requirements", "url": "https://www.fdacs.gov/Cannabis-Hemp/Hemp-CBD-in-Florida"}
        ],
        "regulatoryBody": "Florida Department of Agriculture and Consumer Services",
        "regulatoryUrl": "https://www.fdacs.gov/Cannabis-Hemp/Hemp-CBD-in-Florida",
        "licensingInfo": "FDACS licenses hemp cultivators and separately regulates hemp extract and food-related businesses. Applicants register sites, follow sampling and testing rules, and meet product labeling and packaging standards where applicable.",
        "notes": "Florida has repeatedly considered tighter restrictions on intoxicating hemp products. Verify current FDACS product guidance if selling inhalable or psychoactive items."
    },
    "Georgia": {
        "status": "restricted",
        "summary": "Georgia permits hemp cultivation under state licensing and allows some hemp-derived products, but the retail market is more constrained than in many states because intoxicating cannabinoid products and low-THC formulations face closer scrutiny. Businesses should review both agriculture rules and evolving enforcement for finished products.",
        "thcLimit": "0.3% THC on a dry-weight basis; production sampling and testing must satisfy USDA-compliant pre-harvest requirements.",
        "laws": [
            {"title": "HB213 Georgia Hemp Farming Act", "url": "", "year": 2019}
        ],
        "resources": [
            {"label": "State Hemp Program", "url": "https://agr.georgia.gov/hemp-program"},
            {"label": "License/Application Portal", "url": ""},
            {"label": "Testing Requirements", "url": "https://agr.georgia.gov/hemp-program"}
        ],
        "regulatoryBody": "Georgia Department of Agriculture",
        "regulatoryUrl": "https://agr.georgia.gov/hemp-program",
        "licensingInfo": "GDA licenses growers and processors and requires site information, reporting, sampling and testing compliance, and disposal of non-compliant hemp. Retail product sellers should separately review Georgia consumable hemp requirements.",
        "notes": "Enforcement and litigation around delta-8-style products and other intoxicating cannabinoids can shift quickly in Georgia. The law URL is left blank because I did not verify a stable direct official bill page to the required confidence level."
    },
    "Indiana": {
        "status": "restricted",
        "summary": "Indiana allows hemp production under state oversight and permits low-THC hemp products, but it has historically taken a stricter position on smokable hemp and certain finished products than many other states. Cultivation is legal, but product-category compliance deserves close review.",
        "thcLimit": "0.3% total THC on a dry-weight basis for hemp production, aligned with federal law; finished-product rules can be more restrictive than the cultivation baseline.",
        "laws": [
            {"title": "HEA1349 Hemp and Hemp Products", "url": "https://iga.in.gov/legislative/2019/bills/house/1349/details", "year": 2019}
        ],
        "resources": [
            {"label": "State Hemp Program", "url": "https://www.oisc.purdue.edu/hemp/index.html"},
            {"label": "License/Application Portal", "url": ""},
            {"label": "Testing Requirements", "url": "https://www.oisc.purdue.edu/hemp/index.html"}
        ],
        "regulatoryBody": "Office of Indiana State Chemist / Indiana State Seed Commissioner",
        "regulatoryUrl": "https://www.oisc.purdue.edu/hemp/index.html",
        "licensingInfo": "Indiana requires state licensing or registration for hemp production activities and compliance with site reporting, sampling and testing, and crop disposition rules. Finished-product businesses may face separate low-THC extract and smokable-product requirements.",
        "notes": "Smokable hemp and low-THC extract rules have been recurring compliance flashpoints in Indiana."
    },
    "Iowa": {
        "status": "restricted",
        "summary": "Iowa permits hemp cultivation through IDALS, but it is one of the more restrictive Midwestern states for finished consumable hemp products. The state imposes tighter product limits and retail compliance rules than the federal cultivation baseline.",
        "thcLimit": "0.3% total THC on a dry-weight basis for hemp cultivation; separate potency caps and product limits apply to consumable hemp products.",
        "laws": [
            {"title": "SF599 Industrial Hemp", "url": "https://www.legis.iowa.gov/legislation/BillBook?ga=88&ba=SF599", "year": 2019},
            {"title": "HF2605 Consumable Hemp Products", "url": "https://www.legis.iowa.gov/legislation/BillBook?ga=90&ba=HF2605", "year": 2024}
        ],
        "resources": [
            {"label": "State Hemp Program", "url": "https://iowaagriculture.gov/industrial-hemp"},
            {"label": "License/Application Portal", "url": ""},
            {"label": "Testing Requirements", "url": "https://iowaagriculture.gov/industrial-hemp"}
        ],
        "regulatoryBody": "Iowa Department of Agriculture and Land Stewardship",
        "regulatoryUrl": "https://iowaagriculture.gov/industrial-hemp",
        "licensingInfo": "IDALS licenses hemp growers and handlers and requires site registration, sampling and testing, harvest reporting, and remediation or disposal of non-compliant hemp. Consumable product sellers must also comply with Iowa-specific product limits.",
        "notes": "Iowa now imposes strict consumable-hemp potency caps, making the product side meaningfully more restrictive than cultivation."
    },
    "Kansas": {
        "status": "restricted",
        "summary": "Kansas authorizes hemp cultivation through KDA, but the state has historically been more conservative than many neighboring states on retail cannabinoid products. Hemp production is legal, while finished-product compliance can be narrower and should be reviewed carefully.",
        "thcLimit": "0.3% total THC on a dry-weight basis for hemp production, aligned with federal law.",
        "laws": [
            {"title": "HB2167 Commercial Industrial Hemp Act", "url": "https://www.kslegislature.org/li/b2019_20/measures/hb2167/", "year": 2019}
        ],
        "resources": [
            {"label": "State Hemp Program", "url": "https://www.agriculture.ks.gov/divisions-programs/plant-protect-weed-control/industrial-hemp"},
            {"label": "License/Application Portal", "url": ""},
            {"label": "Testing Requirements", "url": "https://www.agriculture.ks.gov/divisions-programs/plant-protect-weed-control/industrial-hemp"}
        ],
        "regulatoryBody": "Kansas Department of Agriculture",
        "regulatoryUrl": "https://www.agriculture.ks.gov/divisions-programs/plant-protect-weed-control/industrial-hemp",
        "licensingInfo": "KDA administers grower licensing and related program requirements, including land registration, inspections, sampling and testing, and disposition of non-compliant crops. Product manufacturers and sellers should separately review finished-product rules.",
        "notes": "Kansas has historically taken a conservative view of allowable THC in retail products. Verify current finished-product rules before launch."
    },
    "Nebraska": {
        "status": "legal",
        "summary": "Nebraska permits hemp cultivation, processing, and handling through NDA registration under the Nebraska Hemp Farming Act. The state largely tracks federal production rules, though cannabinoid product compliance can involve separate requirements beyond cultivation.",
        "thcLimit": "0.3% total THC on a dry-weight basis, aligned with federal production rules; pre-harvest compliance is based on total THC.",
        "laws": [
            {"title": "LB657 Nebraska Hemp Farming Act", "url": "", "year": 2019}
        ],
        "resources": [
            {"label": "State Hemp Program", "url": "https://nda.nebraska.gov/hemp/"},
            {"label": "License/Application Portal", "url": ""},
            {"label": "Testing Requirements", "url": "https://nda.nebraska.gov/hemp/"}
        ],
        "regulatoryBody": "Nebraska Department of Agriculture",
        "regulatoryUrl": "https://nda.nebraska.gov/hemp/",
        "licensingInfo": "NDA registers growers, processors, handlers, and seed developers under the hemp program. Registrants identify sites, comply with sampling and testing, keep records, and handle non-compliant hemp as required.",
        "notes": "Cultivation is legal, but cannabinoid product compliance may involve separate statutes and agency interpretation. The law URL is left blank because I did not verify a stable direct official bill page to the required confidence level."
    },
    "Oklahoma": {
        "status": "legal",
        "summary": "Oklahoma allows hemp cultivation and processing under ODAFF licensing and has generally maintained an accessible production framework. Retail and finished-product compliance still requires attention to testing, labeling, and any state action involving intoxicating cannabinoids.",
        "thcLimit": "0.3% total THC on a dry-weight basis, aligned with federal production rules; pre-harvest compliance is based on total THC.",
        "laws": [
            {"title": "SB868 Oklahoma Industrial Hemp Program", "url": "", "year": 2019}
        ],
        "resources": [
            {"label": "State Hemp Program", "url": "https://ag.ok.gov/divisions/consumer-protection-service/industrial-hemp/"},
            {"label": "License/Application Portal", "url": ""},
            {"label": "Testing Requirements", "url": "https://ag.ok.gov/divisions/consumer-protection-service/industrial-hemp/"}
        ],
        "regulatoryBody": "Oklahoma Department of Agriculture, Food, and Forestry",
        "regulatoryUrl": "https://ag.ok.gov/divisions/consumer-protection-service/industrial-hemp/",
        "licensingInfo": "ODAFF licenses growers and processors or handlers. Applicants register land or facilities, comply with testing and reporting, and must remediate or destroy non-compliant hemp.",
        "notes": "Finished-product oversight can involve agencies beyond ODAFF. The law URL is left blank because I did not verify a stable direct official bill page to the required confidence level."
    },
    "Tennessee": {
        "status": "restricted",
        "summary": "Tennessee permits hemp cultivation under TDA, but it has become more restrictive on hemp-derived cannabinoid products sold at retail. The market remains legal, but age-gating, taxation, testing, and labeling rules make it a more regulated environment than many states.",
        "thcLimit": "0.3% total THC on a dry-weight basis for hemp production, aligned with federal law; finished hemp-derived cannabinoid products face additional state limits and compliance rules.",
        "laws": [
            {"title": "SB378 Hemp-Derived Cannabinoid Products", "url": "https://wapp.capitol.tn.gov/apps/BillInfo/default.aspx?BillNumber=SB0378&GA=113", "year": 2023}
        ],
        "resources": [
            {"label": "State Hemp Program", "url": "https://www.tn.gov/agriculture/farms/hemp-industry.html"},
            {"label": "License/Application Portal", "url": ""},
            {"label": "Testing Requirements", "url": "https://www.tn.gov/agriculture/farms/hemp-industry.html"}
        ],
        "regulatoryBody": "Tennessee Department of Agriculture",
        "regulatoryUrl": "https://www.tn.gov/agriculture/farms/hemp-industry.html",
        "licensingInfo": "TDA licenses hemp growers and requires site information, planting and harvest reporting, sampling and testing, and disposal of non-compliant crops. Retail sellers of hemp-derived cannabinoid products face separate tax and product-compliance requirements.",
        "notes": "Hemp-derived cannabinoid retail sales are legal but tightly regulated, including age-gating and taxation."
    },
    "Texas": {
        "status": "restricted",
        "summary": "Texas allows hemp cultivation through TDA and many consumable hemp products under a separate DSHS framework. The state remains a high-risk compliance market because smokable products, delta-8-type products, and other intoxicating cannabinoids have faced repeated regulatory and litigation uncertainty.",
        "thcLimit": "0.3% delta-9 THC on a dry-weight basis under Texas hemp law; producers must also comply with state testing rules for hemp crops.",
        "laws": [
            {"title": "HB1325 Hemp Production and Regulation", "url": "https://capitol.texas.gov/tlodocs/86R/billtext/html/HB01325F.htm", "year": 2019}
        ],
        "resources": [
            {"label": "State Hemp Program", "url": "https://www.texasagriculture.gov/Regulatory-Programs/Hemp"},
            {"label": "License/Application Portal", "url": ""},
            {"label": "Testing Requirements", "url": "https://www.texasagriculture.gov/Regulatory-Programs/Hemp"}
        ],
        "regulatoryBody": "Texas Department of Agriculture",
        "regulatoryUrl": "https://www.texasagriculture.gov/Regulatory-Programs/Hemp",
        "licensingInfo": "TDA licenses hemp producers and requires site registration, pre-harvest sampling and testing, reporting, and destruction of non-compliant crops. Consumable hemp manufacturers and retailers must also follow separate DSHS product rules.",
        "notes": "Texas has ongoing litigation and legislative churn around intoxicating consumable hemp products, so product-side compliance should be checked carefully before publication or launch."
    }
}"""

# Second batch (3 states)
second_batch = """{
    "Colorado": {
        "status": "legal",
        "summary": "Colorado permits hemp cultivation under a state registration program administered by the Colorado Department of Agriculture, with sampling, testing, and disposal requirements aligned to the USDA framework. The state also allows many hemp-derived consumer products, but it takes a relatively strict approach to intoxicating or chemically modified hemp cannabinoids, especially in food, dietary supplements, and cosmetics.",
        "thcLimit": "0.3% total THC on a dry-weight basis, aligned with federal law; Colorado requires total THC testing for production compliance before harvest.",
        "laws": [
            {"title": "SB13-241 Regulation of Industrial Hemp", "url": "https://leg.colorado.gov/bills/sb13-241", "year": 2013},
            {"title": "SB19-220 Industrial Hemp Regulatory Authority", "url": "https://leg.colorado.gov/bills/sb19-220", "year": 2019},
            {"title": "HB19-1322 Legalize Hemp Food Additive", "url": "https://leg.colorado.gov/bills/hb19-1322", "year": 2019},
            {"title": "HB22-1341 Marijuana and Industrial Hemp Regulation", "url": "https://leg.colorado.gov/bills/hb22-1341", "year": 2022}
        ],
        "resources": [
            {"label": "State Hemp Program", "url": "https://ag.colorado.gov/plants/industrial-hemp-program"},
            {"label": "License/Application Portal", "url": ""},
            {"label": "Testing Requirements", "url": "https://ag.colorado.gov/plants/industrial-hemp-program"}
        ],
        "regulatoryBody": "Colorado Department of Agriculture",
        "regulatoryUrl": "https://ag.colorado.gov/plants/industrial-hemp-program",
        "licensingInfo": "Colorado uses registrations for hemp cultivation and seed activities through the Colorado Department of Agriculture rather than a single universal hemp business license. Registrants must identify growing locations, comply with pre-harvest sampling and testing, maintain records, and dispose of non-compliant crops; businesses making ingestible or cosmetic hemp products may also need applicable food or manufacturing licenses.",
        "notes": "Colorado is more restrictive than many states on intoxicating hemp products and chemically modified or converted cannabinoids such as delta-8-style products. Finished-product compliance can also involve CDPHE and, for some product categories, marijuana rules; official General Assembly bill pages are used here because they are the reliable public bill record."
    },
    "Michigan": {
        "status": "legal",
        "summary": "Michigan allows hemp cultivation and processing under a state program administered by the Michigan Department of Agriculture and Rural Development. The state follows the federal 0.3% total THC framework for hemp production, while taking a stricter approach to intoxicating hemp-derived cannabinoids by regulating products such as delta-8 THC through the state marijuana system.",
        "thcLimit": "0.3% total THC on a dry-weight basis for hemp production, aligned with federal law; pre-harvest compliance is based on total THC.",
        "laws": [
            {"title": "Public Act 220 of 2020", "url": "https://www.legislature.mi.gov/documents/2019-2020/publicact/pdf/2020-PA-0220.pdf", "year": 2020},
            {"title": "Public Act 221 of 2020", "url": "https://www.legislature.mi.gov/documents/2019-2020/publicact/pdf/2020-PA-0221.pdf", "year": 2020},
            {"title": "Public Act 154 of 2021", "url": "https://www.legislature.mi.gov/documents/2021-2022/publicact/pdf/2021-PA-0154.pdf", "year": 2021}
        ],
        "resources": [
            {"label": "State Hemp Program", "url": "https://www.michigan.gov/mdard/plants-pests/plant-health/industrial-hemp"},
            {"label": "License/Application Portal", "url": ""},
            {"label": "Testing Requirements", "url": "https://www.michigan.gov/mdard/plants-pests/plant-health/industrial-hemp"}
        ],
        "regulatoryBody": "Michigan Department of Agriculture and Rural Development (MDARD)",
        "regulatoryUrl": "https://www.michigan.gov/mdard/plants-pests/plant-health/industrial-hemp",
        "licensingInfo": "Michigan uses separate MDARD licenses for hemp growers and processor-handlers. Applicants must identify sites, comply with sampling, testing, harvest reporting, remediation or disposal rules for non-compliant material, and satisfy applicable eligibility requirements; businesses making foods or other consumable products may also need separate food or manufacturing approvals.",
        "notes": "Michigan generally permits hemp and hemp-derived CBD products, but intoxicating tetrahydrocannabinols and similar hemp-derived cannabinoids are regulated as marijuana through the Cannabis Regulatory Agency rather than the hemp program. Public Act 154 of 2021 is included as the clearest single cite for that shift, though companion acts in the same 2021 legislative package may also affect marijuana-side compliance."
    },
    "California": {
        "status": "restricted",
        "summary": "California permits hemp cultivation and the sale of many hemp-derived consumer products, but its framework is split between CDFA and county agricultural commissioners for cultivation and CDPH for finished products. The state is notably more restrictive than many others because inhalable hemp products remain effectively barred from ordinary retail sale unless the Legislature authorizes a tax, and hemp extract products are subject to detailed food, supplement, and cosmetic rules.",
        "thcLimit": "0.3% total THC on a dry-weight basis for hemp, aligned with federal law; California uses total THC for production compliance and also restricts THC in finished hemp products.",
        "laws": [
            {"title": "SB-566 Industrial hemp", "url": "https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=201320140SB566", "year": 2013},
            {"title": "AB-45 Industrial hemp products", "url": "https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202120220AB45", "year": 2021}
        ],
        "resources": [
            {"label": "State Hemp Program", "url": "https://www.cdfa.ca.gov/is/plant/industrialhemp/"},
            {"label": "License/Application Portal", "url": ""},
            {"label": "Testing Requirements", "url": "https://www.cdfa.ca.gov/is/plant/industrialhemp/"}
        ],
        "regulatoryBody": "California Department of Food and Agriculture (cultivation) and California Department of Public Health (finished hemp products)",
        "regulatoryUrl": "https://www.cdfa.ca.gov/is/plant/industrialhemp/",
        "licensingInfo": "California does not use a single statewide hemp business license for cultivation; growers, seed breeders, and certain institutions generally register through the county agricultural commissioner in the county where hemp is produced. Businesses manufacturing or selling hemp extract foods, beverages, dietary supplements, cosmetics, or similar products must also comply with CDPH requirements and any applicable food-facility or manufacturing registrations.",
        "notes": "California is unusual because retail sale of inhalable hemp products is still effectively blocked unless state law imposes an excise tax on those products. Businesses should review both cultivation rules and separate CDPH consumer-product rules; enforcement around intoxicating or synthetic hemp cannabinoids can be stricter than in many other states, and some implementation details may change through agency rulemaking."
    }
}"""

def create_ts_file(state_name: str, data: Dict[str, Any]) -> str:
    """Create TypeScript file content for a state"""
    
    # Format laws array
    laws_str = ""
    if data.get("laws"):
        laws_str = "[\n"
        for law in data["laws"]:
            url = law["url"].replace('"', '\\"') if law["url"] else ''
            laws_str += f'    {{ title: "{law["title"]}", url: "{url}", year: {law["year"]} }},\n'
        laws_str = laws_str.rstrip(",\n") + "\n  ]"
    else:
        laws_str = "[]"
    
    # Format resources array
    resources_str = ""
    if data.get("resources"):
        resources_str = "[\n"
        for resource in data["resources"]:
            url = resource["url"].replace('"', '\\"') if resource["url"] else ''
            resources_str += f'    {{ label: "{resource["label"]}", url: "{url}" }},\n'
        resources_str = resources_str.rstrip(",\n") + "\n  ]"
    else:
        resources_str = "[]"
    
    # Escape quotes in strings
    def escape_quotes(s: str) -> str:
        return s.replace('"', '\\"').replace('\n', ' ')
    
    summary = escape_quotes(data.get("summary", ""))
    thc_limit = escape_quotes(data.get("thcLimit", ""))
    licensing_info = escape_quotes(data.get("licensingInfo", ""))
    notes = escape_quotes(data.get("notes", ""))
    regulatory_body = escape_quotes(data.get("regulatoryBody", ""))
    regulatory_url = data.get("regulatoryUrl", "").replace('"', '\\"')
    
    # Get slug from state name (lowercase, replace spaces with hyphens)
    slug = state_name.lower().replace(' ', '-')
    abbreviation_map = {
        "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
        "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
        "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
        "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
        "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
        "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
        "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
        "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
        "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
        "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
        "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
        "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
        "Wisconsin": "WI", "Wyoming": "WY"
    }
    abbreviation = abbreviation_map.get(state_name, "")
    
    template = f'''import {{ State }} from '../types'

export const {slug.replace('-', '')}: State = {{
  name: '{state_name}',
  slug: '{slug}',
  abbreviation: '{abbreviation}',
  status: '{data.get("status", "pending")}',
  summary: "{summary}",
  thcLimit: "{thc_limit}",
  laws: {laws_str},
  resources: {resources_str},
  regulatoryBody: "{regulatory_body}",
  regulatoryUrl: "{regulatory_url}",
  licensingInfo: "{licensing_info}",
  notes: "{notes}",
  lastUpdated: '2026-04-07'
}}
'''
    return template

def main():
    # Parse the data
    import json
    first_data = json.loads(first_batch)
    second_data = json.loads(second_batch)
    
    # Combine all data
    all_states = {**first_data, **second_data}
    
    print(f"Updating {len(all_states)} state files...")
    
    # Get the states directory
    states_dir = "src/data/states"
    if not os.path.exists(states_dir):
        print(f"Error: Directory {states_dir} not found")
        return
    
    # Update each state file
    updated_count = 0
    for state_name, state_data in all_states.items():
        # Get the proper filename (lowercase, hyphenated)
        slug = state_name.lower().replace(' ', '-')
        filename = f"{slug}.ts"
        filepath = os.path.join(states_dir, filename)
        
        if not os.path.exists(filepath):
            print(f"Warning: File {filename} not found, skipping {state_name}")
            continue
        
        # Create new content
        new_content = create_ts_file(state_name, state_data)
        
        # Write the file
        with open(filepath, 'w') as f:
            f.write(new_content)
        
        print(f"✓ Updated {filename} ({state_name})")
        updated_count += 1
    
    print(f"\n✅ Successfully updated {updated_count} state files")
    
    # Also update the index.ts file to ensure imports are correct
    print("\n📝 Note: Remember to check src/data/states/index.ts")
    print("   Ensure all state imports are correctly named (e.g., 'kentucky' not 'kentuckyts')")

if __name__ == "__main__":
    main()