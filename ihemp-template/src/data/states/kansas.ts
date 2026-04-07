import { State } from '../types'

export const kansas: State = {
  name: 'Kansas',
  slug: 'kansas',
  abbreviation: 'KS',
  status: 'restricted',
  summary: "Kansas authorizes hemp cultivation through KDA, but the state has historically been more conservative than many neighboring states on retail cannabinoid products. Hemp production is legal, while finished-product compliance can be narrower and should be reviewed carefully.",
  thcLimit: "0.3% total THC on a dry-weight basis for hemp production, aligned with federal law.",
  laws: [
    { title: "HB2167 Commercial Industrial Hemp Act", url: "https://www.kslegislature.org/li/b2019_20/measures/hb2167/", year: 2019 }
  ],
  resources: [
    { label: "State Hemp Program", url: "https://www.agriculture.ks.gov/divisions-programs/plant-protect-weed-control/industrial-hemp" },
    { label: "License/Application Portal", url: "" },
    { label: "Testing Requirements", url: "https://www.agriculture.ks.gov/divisions-programs/plant-protect-weed-control/industrial-hemp" }
  ],
  regulatoryBody: "Kansas Department of Agriculture",
  regulatoryUrl: "https://www.agriculture.ks.gov/divisions-programs/plant-protect-weed-control/industrial-hemp",
  licensingInfo: "KDA administers grower licensing and related program requirements, including land registration, inspections, sampling and testing, and disposition of non-compliant crops. Product manufacturers and sellers should separately review finished-product rules.",
  notes: "Kansas has historically taken a conservative view of allowable THC in retail products. Verify current finished-product rules before launch.",
  lastUpdated: '2026-04-07'
}
