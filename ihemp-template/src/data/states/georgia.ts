import { State } from '../types'

export const georgia: State = {
  name: 'Georgia',
  slug: 'georgia',
  abbreviation: 'GA',
  status: 'restricted',
  summary: "Georgia permits hemp cultivation under state licensing and allows some hemp-derived products, but the retail market is more constrained than in many states because intoxicating cannabinoid products and low-THC formulations face closer scrutiny. Businesses should review both agriculture rules and evolving enforcement for finished products.",
  thcLimit: "0.3% THC on a dry-weight basis; production sampling and testing must satisfy USDA-compliant pre-harvest requirements.",
  laws: [
    { title: "HB213 Georgia Hemp Farming Act", url: "", year: 2019 }
  ],
  resources: [
    { label: "State Hemp Program", url: "https://agr.georgia.gov/hemp-program" },
    { label: "License/Application Portal", url: "" },
    { label: "Testing Requirements", url: "https://agr.georgia.gov/hemp-program" }
  ],
  regulatoryBody: "Georgia Department of Agriculture",
  regulatoryUrl: "https://agr.georgia.gov/hemp-program",
  licensingInfo: "GDA licenses growers and processors and requires site information, reporting, sampling and testing compliance, and disposal of non-compliant hemp. Retail product sellers should separately review Georgia consumable hemp requirements.",
  notes: "Enforcement and litigation around delta-8-style products and other intoxicating cannabinoids can shift quickly in Georgia. The law URL is left blank because I did not verify a stable direct official bill page to the required confidence level.",
  lastUpdated: '2026-04-07'
}
