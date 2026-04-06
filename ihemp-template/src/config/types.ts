export interface PageConfig {
  title: string;
  description: string;
}

export interface CardConfig {
  title: string;
  description: string;
  href: string;
}

export interface HeroConfig {
  title: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
}

export interface HomepageConfig {
  cards: CardConfig[];
  productSectionTitle: string;
  productSectionDescription: string;
}

export interface ResourcesConfig {
  legislatureUrl: string;
  findLegislatorUrl: string;
  hempProgramUrl: string;
  congressUrl: string;
}

export interface NetworkState {
  name: string;
  url: string;
}

export interface StateConfig {
  name: string;
  abbreviation: string;
  slug: string;
  domain: string;
  siteName: string;
  logo: string;
  startYear: number;
  tagline: string;
  description: string;
  
  hero: HeroConfig;
  homepage: HomepageConfig;
  pages: Record<string, PageConfig>;
  resources: ResourcesConfig;
  networkStates: NetworkState[];
}