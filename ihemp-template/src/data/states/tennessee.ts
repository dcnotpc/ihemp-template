import { State } from '../types'

export const tennessee: State = {
  name: 'Tennessee',
  slug: 'tennessee',
  abbreviation: 'TN',
  status: 'restricted',
  summary: "Tennessee permits hemp cultivation under TDA, but it has become more restrictive on hemp-derived cannabinoid products sold at retail. The market remains legal, but age-gating, taxation, testing, and labeling rules make it a more regulated environment than many states.",
  thcLimit: "0.3% total THC on a dry-weight basis for hemp production, aligned with federal law; finished hemp-derived cannabinoid products face additional state limits and compliance rules.",
  laws: [
    { title: "SB378 Hemp-Derived Cannabinoid Products", url: "https://wapp.capitol.tn.gov/apps/BillInfo/default.aspx?BillNumber=SB0378&GA=113", year: 2023 }
  ],
  resources: [
    { label: "State Hemp Program", url: "https://www.tn.gov/agriculture/farms/hemp-industry.html" },
    { label: "License/Application Portal", url: "" },
    { label: "Testing Requirements", url: "https://www.tn.gov/agriculture/farms/hemp-industry.html" }
  ],
  regulatoryBody: "Tennessee Department of Agriculture",
  regulatoryUrl: "https://www.tn.gov/agriculture/farms/hemp-industry.html",
  licensingInfo: "TDA licenses hemp growers and requires site information, planting and harvest reporting, sampling and testing, and disposal of non-compliant crops. Retail sellers of hemp-derived cannabinoid products face separate tax and product-compliance requirements.",
  notes: "Hemp-derived cannabinoid retail sales are legal but tightly regulated, including age-gating and taxation.",
  lastUpdated: '2026-04-07'
}
