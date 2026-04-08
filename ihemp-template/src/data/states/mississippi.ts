import { State } from '../types'

export const mississippi: State = {
  name: 'Mississippi',
  slug: 'mississippi',
  abbreviation: 'MS',
  status: 'legal',
  summary: 'Mississippi authorizes hemp cultivation under a state program overseen by the Mississippi Department of Agriculture and Commerce. The cultivation framework generally tracks federal hemp standards, though businesses should separately review state treatment of consumable and intoxicating hemp-derived products because that area can change faster than the grower program.',
  thcLimit: '0.3% total THC on a dry-weight basis for hemp production, aligned with federal law; pre-harvest compliance is based on total THC.',
  laws: [
    { title: 'Mississippi Hemp Cultivation Act (SB2725)', url: 'https://billstatus.ls.state.ms.us/documents/2020/html/SB/2700-2799/SB2725CS.htm', year: 2020 }
  ],
  resources: [
    { label: 'State Hemp Program', url: 'https://www.mdac.ms.gov/programs/hemp-cultivation-in-ms/' },
    { label: 'License/Application Portal', url: '' },
    { label: 'Testing Requirements', url: '' }
  ],
  regulatoryBody: 'Mississippi Department of Agriculture and Commerce',
  regulatoryUrl: 'https://www.mdac.ms.gov/programs/hemp-cultivation-in-ms/',
  licensingInfo: 'Mississippi licenses hemp growers and related program participants through MDAC. Applicants must register sites, comply with sampling and testing requirements, keep program records, and remediate or destroy non-compliant material as required by the state plan.',
  notes: 'Mississippi hemp cultivation is legal, but consumer-product compliance should be checked carefully before launch because the state has historically taken a relatively cautious approach to cannabis-adjacent products. Direct bill and program-page links are left blank where not independently verified.',
  lastUpdated: '2026-04-07'
}
