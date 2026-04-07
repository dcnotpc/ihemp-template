import { State } from '../types'

export const texas: State = {
  name: 'Texas',
  slug: 'texas',
  abbreviation: 'TX',
  status: 'restricted',
  summary: "Texas allows hemp cultivation through TDA and many consumable hemp products under a separate DSHS framework. The state remains a high-risk compliance market because smokable products, delta-8-type products, and other intoxicating cannabinoids have faced repeated regulatory and litigation uncertainty.",
  thcLimit: "0.3% delta-9 THC on a dry-weight basis under Texas hemp law; producers must also comply with state testing rules for hemp crops.",
  laws: [
    { title: "HB1325 Hemp Production and Regulation", url: "https://capitol.texas.gov/tlodocs/86R/billtext/html/HB01325F.htm", year: 2019 }
  ],
  resources: [
    { label: "State Hemp Program", url: "https://www.texasagriculture.gov/Regulatory-Programs/Hemp" },
    { label: "License/Application Portal", url: "" },
    { label: "Testing Requirements", url: "https://www.texasagriculture.gov/Regulatory-Programs/Hemp" }
  ],
  regulatoryBody: "Texas Department of Agriculture",
  regulatoryUrl: "https://www.texasagriculture.gov/Regulatory-Programs/Hemp",
  licensingInfo: "TDA licenses hemp producers and requires site registration, pre-harvest sampling and testing, reporting, and destruction of non-compliant crops. Consumable hemp manufacturers and retailers must also follow separate DSHS product rules.",
  notes: "Texas has ongoing litigation and legislative churn around intoxicating consumable hemp products, so product-side compliance should be checked carefully before publication or launch.",
  lastUpdated: '2026-04-07'
}
