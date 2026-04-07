import { State } from '../types'

export const california: State = {
  name: 'California',
  slug: 'california',
  abbreviation: 'CA',
  status: 'restricted',
  summary: "California permits hemp cultivation and the sale of many hemp-derived consumer products, but its framework is split between CDFA and county agricultural commissioners for cultivation and CDPH for finished products. The state is notably more restrictive than many others because inhalable hemp products remain effectively barred from ordinary retail sale unless the Legislature authorizes a tax, and hemp extract products are subject to detailed food, supplement, and cosmetic rules.",
  thcLimit: "0.3% total THC on a dry-weight basis for hemp, aligned with federal law; California uses total THC for production compliance and also restricts THC in finished hemp products.",
  laws: [
    { title: "SB-566 Industrial hemp", url: "https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=201320140SB566", year: 2013 },
    { title: "AB-45 Industrial hemp products", url: "https://leginfo.legislature.ca.gov/faces/billTextClient.xhtml?bill_id=202120220AB45", year: 2021 }
  ],
  resources: [
    { label: "State Hemp Program", url: "https://www.cdfa.ca.gov/is/plant/industrialhemp/" },
    { label: "License/Application Portal", url: "" },
    { label: "Testing Requirements", url: "https://www.cdfa.ca.gov/is/plant/industrialhemp/" }
  ],
  regulatoryBody: "California Department of Food and Agriculture (cultivation) and California Department of Public Health (finished hemp products)",
  regulatoryUrl: "https://www.cdfa.ca.gov/is/plant/industrialhemp/",
  licensingInfo: "California does not use a single statewide hemp business license for cultivation; growers, seed breeders, and certain institutions generally register through the county agricultural commissioner in the county where hemp is produced. Businesses manufacturing or selling hemp extract foods, beverages, dietary supplements, cosmetics, or similar products must also comply with CDPH requirements and any applicable food-facility or manufacturing registrations.",
  notes: "California is unusual because retail sale of inhalable hemp products is still effectively blocked unless state law imposes an excise tax on those products. Businesses should review both cultivation rules and separate CDPH consumer-product rules; enforcement around intoxicating or synthetic hemp cannabinoids can be stricter than in many other states, and some implementation details may change through agency rulemaking.",
  lastUpdated: '2026-04-07'
}
