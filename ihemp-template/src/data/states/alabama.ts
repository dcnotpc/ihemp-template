import { State } from '../types'

export const alabama: State = {
  name: 'Alabama',
  slug: 'alabama',
  abbreviation: 'AL',
  status: 'legal',
  summary: "Alabama allows hemp cultivation under ADAI licensing and uses USDA-style sampling and testing rules. The state permits hemp-derived products, but product-specific compliance requires closer review than cultivation alone.",
  thcLimit: "0.3% total THC on a dry-weight basis, aligned with federal production rules; pre-harvest compliance is based on total THC.",
  laws: [
    { title: "SB225 Alabama Industrial Hemp Research Program Act", url: "", year: 2016 },
    { title: "HB445 Hemp Extract Products", url: "", year: 2021 }
  ],
  resources: [
    { label: "State Hemp Program", url: "https://agi.alabama.gov/hemp/" },
    { label: "License/Application Portal", url: "" },
    { label: "Testing Requirements", url: "https://agi.alabama.gov/hemp/" }
  ],
  regulatoryBody: "Alabama Department of Agriculture and Industries",
  regulatoryUrl: "https://agi.alabama.gov/hemp/",
  licensingInfo: "ADAI licenses growers, processors, and universities under the state hemp program. Licensees register locations, comply with pre-harvest sampling and testing, maintain records, and dispose of non-compliant material.",
  notes: "Consumer-product rules and enforcement deserve live review before launch. Official bill-link fields are left blank here where I was not sufficiently confident in a stable direct state bill URL.",
  lastUpdated: '2026-04-07'
}
