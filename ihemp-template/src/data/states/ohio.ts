import { State } from '../types'

export const ohio: State = {
  name: 'Ohio',
  slug: 'ohio',
  abbreviation: 'OH',
  status: 'legal',
  summary: "Ohio permits hemp cultivation and processing under ODA licensing consistent with USDA rules. Hemp-derived products are generally allowed, but businesses should watch evolving enforcement and labeling expectations for intoxicating cannabinoids.",
  thcLimit: "0.3% total THC on a dry-weight basis, aligned with federal production rules; pre-harvest compliance is based on total THC.",
  laws: [
    { title: "SB57 Legalize Hemp and Hemp Products", url: "https://www.legislature.ohio.gov/legislation/133/sb57", year: 2019 }
  ],
  resources: [
    { label: "State Hemp Program", url: "https://agri.ohio.gov/divisions/hemp-program" },
    { label: "License/Application Portal", url: "" },
    { label: "Testing Requirements", url: "https://agri.ohio.gov/divisions/hemp-program" }
  ],
  regulatoryBody: "Ohio Department of Agriculture",
  regulatoryUrl: "https://agri.ohio.gov/divisions/hemp-program",
  licensingInfo: "ODA issues cultivation and processing licenses. Applicants register sites, report acreage and harvests, comply with sampling and testing, and remediate or dispose of non-compliant lots.",
  notes: "Ohio is relatively straightforward on cultivation. Finished-product compliance can still involve separate food, drug, and consumer protection rules.",
  lastUpdated: '2026-04-07'
}
