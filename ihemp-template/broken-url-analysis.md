# Broken URL Analysis - iHemp State Data

## Based on URL verification (Apr 7, 2026)

From verification script: 14 broken URLs out of 39 checked (36% failure rate)

## Research to find working replacements:

### 1. Colorado - Broken URL:
**Current**: `https://ag.colorado.gov/plants/industrial-hemp-program` (403)
**Possible replacement**: `https://ag.colorado.gov/plants/hemp` (found in search)
**Alternative**: `https://cannabis.colorado.gov/industrial-hemp` 
**Verification needed**: Check if these are current/accurate

### 2. Alabama - Broken URL:
**Current**: `https://agi.alabama.gov/plant-protection/industrial-hemp-program/` (404)
**Found in search**: `https://agi.alabama.gov/hemp/` 
**Alternative**: `http://www.agi.alabama.gov/s/industrial-hemp---home---w-o/status-of-program-w-o`
**Status page**: Alabama Agriculture & Industries Hemp Program main page appears active

### 3. Oklahoma - Broken URL:
**Current**: `https://ag.ok.gov/divisions/consumer-protection-service/industrial-hemp/` (404)
**Found in search**: 
- `https://ag.ok.gov/plant-industry/` (Plant Industry page)
- `https://oklahomastatecannabis.org/hemp` (informational)
- `https://www.votehemp.com/states/oklahoma-hemp-law/` (legislative tracking)
**Best candidate**: `https://ag.ok.gov/plant-industry/` appears to be the ODAFF Plant Industry page

### 4. Arkansas - Broken URL:
**Current**: `https://agriculture.arkansas.gov/` (timeout)
**Notes**: Main agriculture department site may have rate limiting
**Possible alternative**: Need to find specific hemp program page
**Search needed**: "Arkansas Department of Agriculture hemp program"

### 5. Ohio - Broken URL:
**Current**: `https://agri.ohio.gov/divisions/hemp-program` (404)
**Alternative needed**: Search for Ohio Department of Agriculture hemp program
**Likely**: `https://agri.ohio.gov/divisions/plant-health/hemp`

### 6. Kansas - Broken URL:
**Current**: `https://www.agriculture.ks.gov/divisions-programs/plant-protect-weed-control/industrial-hemp` (403)
**Possible issue**: Access restricted or moved
**Alternative needed**: Kansas Department of Agriculture hemp program page

### 7. Michigan - Broken URL:
**Current**: `https://www.michigan.gov/mdard/plants-pests/plant-health/industrial-hemp` (403)
**Alternative**: Michigan Department of Agriculture hemp program likely moved
**Search needed**: "Michigan hemp program MDARD"

### 8. Tennessee - Broken URL:
**Current**: `https://www.tn.gov/agriculture/farms/hemp-industry.html` (000 - no response)
**Possible**: Site down or URL changed
**Alternative needed**: Tennessee Department of Agriculture hemp program

### 9. Mississippi - Broken URL:
**Current**: `https://www.mdac.ms.gov/` (timeout)
**Note**: This is the main MDAC site, not specific hemp page
**Alternative needed**: Specific Mississippi hemp program URL

## Other issues:

### Empty URLs (url: ''):
- 15 states have empty law URLs (intentional - "not sufficiently confident in a stable direct state bill URL")
- 15 states have empty "License/Application Portal" URLs  
- 15 states have empty "Testing Requirements" URLs

This appears to be by design for some fields where stable URLs weren't available.

## Next steps:

1. **Search for each broken URL** to find current, working alternatives
2. **Verify new URLs** actually work and are correct
3. **Update state files** with corrected URLs
4. **Consider whether empty URLs** should remain empty or be researched