import { State } from '../types'

export const iowa: State = {
  name: 'Iowa',
  slug: 'iowa',
  abbreviation: 'IA',
  status: 'restricted',
  summary: "Iowa permits hemp cultivation through IDALS, but it is one of the more restrictive Midwestern states for finished consumable hemp products. The state imposes tighter product limits and retail compliance rules than the federal cultivation baseline.",
  thcLimit: "0.3% total THC on a dry-weight basis for hemp cultivation; separate potency caps and product limits apply to consumable hemp products.",
  laws: [
    { title: "SF599 Industrial Hemp", url: "https://www.legis.iowa.gov/legislation/BillBook?ga=88&ba=SF599", year: 2019 },
    { title: "HF2605 Consumable Hemp Products", url: "https://www.legis.iowa.gov/legislation/BillBook?ga=90&ba=HF2605", year: 2024 }
  ],
  resources: [
    { label: "State Hemp Program", url: "https://iowaagriculture.gov/hemp" },
    { label: "License/Application Portal", url: "https://iowaagriculture.gov/hemp" },
    { label: "Testing Requirements", url: "https://iowaagriculture.gov/hemp" }
  ],
  regulatoryBody: "Iowa Department of Agriculture and Land Stewardship",
  regulatoryUrl: "https://iowaagriculture.gov/hemp",
  licensingInfo: "IDALS licenses hemp growers and handlers and requires site registration, sampling and testing, harvest reporting, and remediation or disposal of non-compliant hemp. Consumable product sellers must also comply with Iowa-specific product limits.",
  notes: "Iowa now imposes strict consumable-hemp potency caps, making the product side meaningfully more restrictive than cultivation.",
  lastUpdated: '2026-04-07'
}
