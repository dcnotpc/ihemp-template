import { State } from '../types'

export const colorado: State = {
  name: 'Colorado',
  slug: 'colorado',
  abbreviation: 'CO',
  status: 'legal',
  summary: 'Colorado permits hemp cultivation under a state registration program administered by the Colorado Department of Agriculture, with sampling, testing, and disposal requirements aligned to the USDA framework. The state also allows many hemp-derived consumer products, but it takes a relatively strict approach to intoxicating or chemically modified hemp cannabinoids, especially in food, dietary supplements, and cosmetics.',
  thcLimit: '0.3% total THC on a dry-weight basis, aligned with federal law; Colorado requires total THC testing for production compliance before harvest.',
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
  licensingInfo: 'Colorado uses registrations for hemp cultivation and seed activities through the Colorado Department of Agriculture rather than a single universal hemp business license. Registrants must identify growing locations, comply with pre-harvest sampling and testing, maintain records, and dispose of non-compliant crops; businesses making ingestible or cosmetic hemp products may also need applicable food or manufacturing licenses.',
  notes: 'Colorado is more restrictive than many states on intoxicating hemp products and chemically modified or converted cannabinoids such as delta-8-style products. Finished-product compliance can also involve CDPHE and, for some product categories, marijuana rules; official General Assembly bill pages are used here because they are the reliable public bill record.',
  lastUpdated: '2026-04-05'
}
