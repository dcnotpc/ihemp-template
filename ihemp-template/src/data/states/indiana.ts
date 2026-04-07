import { State } from '../types'

export const indiana: State = {
  name: 'Indiana',
  slug: 'indiana',
  abbreviation: 'IN',
  status: 'restricted',
  summary: "Indiana allows hemp production under state oversight and permits low-THC hemp products, but it has historically taken a stricter position on smokable hemp and certain finished products than many other states. Cultivation is legal, but product-category compliance deserves close review.",
  thcLimit: "0.3% total THC on a dry-weight basis for hemp production, aligned with federal law; finished-product rules can be more restrictive than the cultivation baseline.",
  laws: [
    { title: "HEA1349 Hemp and Hemp Products", url: "https://iga.in.gov/legislative/2019/bills/house/1349/details", year: 2019 }
  ],
  resources: [
    { label: "State Hemp Program", url: "https://www.oisc.purdue.edu/hemp/index.html" },
    { label: "License/Application Portal", url: "" },
    { label: "Testing Requirements", url: "https://www.oisc.purdue.edu/hemp/index.html" }
  ],
  regulatoryBody: "Office of Indiana State Chemist / Indiana State Seed Commissioner",
  regulatoryUrl: "https://www.oisc.purdue.edu/hemp/index.html",
  licensingInfo: "Indiana requires state licensing or registration for hemp production activities and compliance with site reporting, sampling and testing, and crop disposition rules. Finished-product businesses may face separate low-THC extract and smokable-product requirements.",
  notes: "Smokable hemp and low-THC extract rules have been recurring compliance flashpoints in Indiana.",
  lastUpdated: '2026-04-07'
}
