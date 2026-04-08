import { State } from '../types'

export const oklahoma: State = {
  name: 'Oklahoma',
  slug: 'oklahoma',
  abbreviation: 'OK',
  status: 'legal',
  summary: "Oklahoma allows hemp cultivation and processing under ODAFF licensing and has generally maintained an accessible production framework. Retail and finished-product compliance still requires attention to testing, labeling, and any state action involving intoxicating cannabinoids.",
  thcLimit: "0.3% total THC on a dry-weight basis, aligned with federal production rules; pre-harvest compliance is based on total THC.",
  laws: [
    { title: "SB868 Oklahoma Industrial Hemp Program", url: "https://legiscan.com/OK/bill/SB868/2019", year: 2019 }
  ],
  resources: [
    { label: "State Hemp Program", url: "https://ag.ok.gov/plant-industry/" },
    { label: "License/Application Portal", url: "" },
    { label: "Testing Requirements", url: "https://ag.ok.gov/plant-industry/" }
  ],
  regulatoryBody: "Oklahoma Department of Agriculture, Food, and Forestry",
  regulatoryUrl: "https://ag.ok.gov/plant-industry/",
  licensingInfo: "ODAFF licenses growers and processors or handlers. Applicants register land or facilities, comply with testing and reporting, and must remediate or destroy non-compliant hemp.",
  notes: "Finished-product oversight can involve agencies beyond ODAFF. The law URL is left blank because I did not verify a stable direct official bill page to the required confidence level.",
  lastUpdated: '2026-04-07'
}
