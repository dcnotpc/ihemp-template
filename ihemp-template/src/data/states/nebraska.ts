import { State } from '../types'

export const nebraska: State = {
  name: 'Nebraska',
  slug: 'nebraska',
  abbreviation: 'NE',
  status: 'legal',
  summary: "Nebraska permits hemp cultivation, processing, and handling through NDA registration under the Nebraska Hemp Farming Act. The state largely tracks federal production rules, though cannabinoid product compliance can involve separate requirements beyond cultivation.",
  thcLimit: "0.3% total THC on a dry-weight basis, aligned with federal production rules; pre-harvest compliance is based on total THC.",
  laws: [
    { title: "LB657 Nebraska Hemp Farming Act", url: "", year: 2019 }
  ],
  resources: [
    { label: "State Hemp Program", url: "https://nda.nebraska.gov/hemp/" },
    { label: "License/Application Portal", url: "" },
    { label: "Testing Requirements", url: "https://nda.nebraska.gov/hemp/" }
  ],
  regulatoryBody: "Nebraska Department of Agriculture",
  regulatoryUrl: "https://nda.nebraska.gov/hemp/",
  licensingInfo: "NDA registers growers, processors, handlers, and seed developers under the hemp program. Registrants identify sites, comply with sampling and testing, keep records, and handle non-compliant hemp as required.",
  notes: "Cultivation is legal, but cannabinoid product compliance may involve separate statutes and agency interpretation. The law URL is left blank because I did not verify a stable direct official bill page to the required confidence level.",
  lastUpdated: '2026-04-07'
}
