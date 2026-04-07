import { State } from '../types'

export const florida: State = {
  name: 'Florida',
  slug: 'florida',
  abbreviation: 'FL',
  status: 'legal',
  summary: "Florida authorizes hemp cultivation through FDACS and broadly permits hemp extract products, subject to registration, labeling, testing, and food-safety rules. The market is legal but compliance-heavy, especially for consumer-facing products.",
  thcLimit: "0.3% total THC on a dry-weight basis for cultivation, aligned with federal law; separate limits and testing standards apply to hemp extract products.",
  laws: [
    { title: "SB1020 State Hemp Program", url: "https://www.flsenate.gov/Session/Bill/2019/1020", year: 2019 }
  ],
  resources: [
    { label: "State Hemp Program", url: "https://www.fdacs.gov/Cannabis-Hemp/Hemp-CBD-in-Florida" },
    { label: "License/Application Portal", url: "" },
    { label: "Testing Requirements", url: "https://www.fdacs.gov/Cannabis-Hemp/Hemp-CBD-in-Florida" }
  ],
  regulatoryBody: "Florida Department of Agriculture and Consumer Services",
  regulatoryUrl: "https://www.fdacs.gov/Cannabis-Hemp/Hemp-CBD-in-Florida",
  licensingInfo: "FDACS licenses hemp cultivators and separately regulates hemp extract and food-related businesses. Applicants register sites, follow sampling and testing rules, and meet product labeling and packaging standards where applicable.",
  notes: "Florida has repeatedly considered tighter restrictions on intoxicating hemp products. Verify current FDACS product guidance if selling inhalable or psychoactive items.",
  lastUpdated: '2026-04-07'
}
