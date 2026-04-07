import { State } from '../types'

export const michigan: State = {
  name: 'Michigan',
  slug: 'michigan',
  abbreviation: 'MI',
  status: 'legal',
  summary: "Michigan allows hemp cultivation and processing under a state program administered by the Michigan Department of Agriculture and Rural Development. The state follows the federal 0.3% total THC framework for hemp production, while taking a stricter approach to intoxicating hemp-derived cannabinoids by regulating products such as delta-8 THC through the state marijuana system.",
  thcLimit: "0.3% total THC on a dry-weight basis for hemp production, aligned with federal law; pre-harvest compliance is based on total THC.",
  laws: [
    { title: "Public Act 220 of 2020", url: "https://www.legislature.mi.gov/documents/2019-2020/publicact/pdf/2020-PA-0220.pdf", year: 2020 },
    { title: "Public Act 221 of 2020", url: "https://www.legislature.mi.gov/documents/2019-2020/publicact/pdf/2020-PA-0221.pdf", year: 2020 },
    { title: "Public Act 154 of 2021", url: "https://www.legislature.mi.gov/documents/2021-2022/publicact/pdf/2021-PA-0154.pdf", year: 2021 }
  ],
  resources: [
    { label: "State Hemp Program", url: "https://www.michigan.gov/mdard/plants-pests/plant-health/industrial-hemp" },
    { label: "License/Application Portal", url: "" },
    { label: "Testing Requirements", url: "https://www.michigan.gov/mdard/plants-pests/plant-health/industrial-hemp" }
  ],
  regulatoryBody: "Michigan Department of Agriculture and Rural Development (MDARD)",
  regulatoryUrl: "https://www.michigan.gov/mdard/plants-pests/plant-health/industrial-hemp",
  licensingInfo: "Michigan uses separate MDARD licenses for hemp growers and processor-handlers. Applicants must identify sites, comply with sampling, testing, harvest reporting, remediation or disposal rules for non-compliant material, and satisfy applicable eligibility requirements; businesses making foods or other consumable products may also need separate food or manufacturing approvals.",
  notes: "Michigan generally permits hemp and hemp-derived CBD products, but intoxicating tetrahydrocannabinols and similar hemp-derived cannabinoids are regulated as marijuana through the Cannabis Regulatory Agency rather than the hemp program. Public Act 154 of 2021 is included as the clearest single cite for that shift, though companion acts in the same 2021 legislative package may also affect marijuana-side compliance.",
  lastUpdated: '2026-04-07'
}
