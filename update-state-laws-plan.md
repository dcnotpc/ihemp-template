# State Laws Page Update Plan

## Current Status
- **17 state websites deployed** and mostly live (15/17 confirmed working)
- **Laws pages exist** but use hardcoded Colorado data (`import { colorado }`) instead of dynamic state data
- **All 17 states have data files** with varying completeness
- **Key issue**: `/laws` page imports Colorado state data directly, not using dynamic state configuration

## Technical Issue Identified
**File**: `/home/dcnotpc420/.openclaw/workspace/ihemp-template/src/app/laws/page.tsx`

**Problem**: 
```typescript
import { colorado } from '@/data/states/colorado'
const stateData = colorado  // Always Colorado!
```

**Should be**:
```typescript
import { stateConfig } from '@/config/state'
import { getStateBySlug } from '@/data/states'
const stateData = getStateBySlug(stateConfig.slug)
```

## Fix Applied ✓
Updated `page.tsx` to use dynamic state data based on `NEXT_PUBLIC_STATE` environment variable.

## State Data Assessment
### ✅ States with Complete Data (8):
1. **Colorado** - Full data with 4 laws
2. **California** - Complete with 2 laws
3. **Michigan** - Complete with 3 laws
4. **Alabama** - Complete with 2 laws
5. **Arkansas** - Complete with 1 law
6. **Iowa** - Complete with 2 laws
7. **Kentucky** - Complete with 2 laws
8. **Texas** - Complete with 1 law

### ⚠️ States with Basic Data (9):
Most states have placeholder data needing completion:
- Florida, Georgia, Indiana, Kansas, Mississippi, Nebraska, Ohio, Oklahoma, Tennessee

## Immediate Actions Required

### 1. **Verify Dynamic State Configuration Works**
Test that Alabama laws page shows Alabama data, not Colorado data:
```bash
curl -s "https://ihempalabama.com/laws" | grep -i "alabama.*hemp.*laws"
curl -s "https://ihempcalifornia.com/laws" | grep -i "california.*hemp.*laws"
```

### 2. **Complete State Data Files**
**Priority order**:
1. States with deployed websites (17 states)
2. States with existing but incomplete data
3. Remaining states for future deployment

### 3. **Research Requirements for Each State**
For each state, gather:
- **Summary**: 2-3 sentence overview of hemp legality
- **THC limit**: Exact percentage and testing method
- **Key laws**: Major hemp legislation with stable URLs
- **Licensing info**: How farmers/businesses get licensed
- **Regulatory body**: Official state agency
- **Resources**: Program page, license portal, testing links

## Implementation Strategy

### Phase 1: Verify & Fix Current Configuration
```bash
# Test all 17 sites for correct state display
cd /home/dcnotpc420/.openclaw/workspace
python3 test-state-laws.py
```

### Phase 2: Research & Update Data Files
**Approach**: 
- Web search for each state's hemp program
- Use official .gov websites for accuracy
- Verify law URLs are stable/working
- Update `lastUpdated` to current date

### Phase 3: Build Automation Tools
1. **URL verification script** - Check all regulatory URLs
2. **Data validation script** - Ensure all required fields present
3. **Build test script** - Verify each state compiles correctly
4. **Deployment script** - Push changes to GitHub for auto-deploy

## Compliance Considerations
- **No health claims** about CBD products
- **Accurate representation** of state laws
- **Clear disclaimers** about legal information not constituting legal advice
- **Source citations** from official government websites
- **Regular updates** as laws change

## Timeline
- **Today**: Verify dynamic configuration works + fix any issues
- **Week 1**: Complete data for first 5 priority states
- **Week 2**: Complete remaining 12 deployed states
- **Ongoing**: Quarterly review and update as laws change

## Success Metrics
- ✅ All 17 state laws pages show correct state data
- ✅ No placeholder text in any deployed state
- ✅ All regulatory URLs working and current
- ✅ Users can access accurate hemp law information for their state
- ✅ Website builds successfully for all state configurations

## Next Steps
1. **Test current fix** with Alabama and California sites
2. **Create research checklist** for state data collection
3. **Begin systematic updates** starting with highest-priority states
4. **Implement automated validation** to maintain data quality