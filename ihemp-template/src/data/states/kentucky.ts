import { State } from '../types'

export const kentucky: State = {
  name: 'Kentucky',
  slug: 'kentucky',
  abbreviation: 'KY',
  status: 'legal',
  summary: "Kentucky runs a mature hemp program through KDA and allows cultivation, handling, and processing under state licensing tied to the USDA framework. The state also regulates hemp-derived cannabinoid products more closely than it once did, especially around packaging, testing, age limits, and retail sale of intoxicating products.",
  thcLimit: "0.3% total THC on a dry-weight basis, aligned with federal production rules; pre-harvest compliance is based on total THC.",
  laws: [
    { title: "SB50 Industrial Hemp", url: "https://apps.legislature.ky.gov/record/13rs/sb50.html", year: 2013 },
    { title: "SB47 Hemp-Derived Cannabinoid Products", url: "https://apps.legislature.ky.gov/record/23rs/sb47.html", year: 2023 }
  ],
  resources: [
    { label: "State Hemp Program", url: "https://www.kyagr.com/marketing/hemp.html" },
    { label: "License/Application Portal", url: "" },
    { label: "Testing Requirements", url: "https://www.kyagr.com/marketing/hemp.html" }
  ],
  regulatoryBody: "Kentucky Department of Agriculture",
  regulatoryUrl: "https://www.kyagr.com/marketing/hemp.html",
  licensingInfo: "KDA licenses growers and handlers or processors. Applicants identify sites, submit maps and reports, comply with sampling and testing, and destroy non-compliant crops.",
  notes: "SB47 in 2023 added a clearer framework for hemp-derived cannabinoid products. Retail product compliance deserves separate review from cultivation rules.",
  lastUpdated: '2026-04-07'
}
