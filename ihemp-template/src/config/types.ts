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

export interface StateThemeColors {
  primary: string;
  primaryDark: string;
  sage: string;
  leaf: string;
  gold: string;
  cream: string;
  brown: string;
  heroText: string;
}

export interface StateThemeHero {
  image: string;
  alt: string;
  overlayClass: string;
  treatment: 'field' | 'mountain' | 'heritage' | 'prairie' | 'delta' | 'coastal';
}

export interface StateThemeMotif {
  name: string;
  pattern: 'none' | 'topographic' | 'barnwood' | 'river-lines' | 'quilt' | 'grain';
  accentLabel?: string;
}

export interface StateThemeHomepage {
  quote: string;
  positioning: string;
  ctaTone: 'compliance' | 'heritage' | 'innovation' | 'market-access' | 'advocacy';
}

export interface StateTheme {
  slug: string;
  name: string;
  colors: StateThemeColors;
  hero: StateThemeHero;
  motif: StateThemeMotif;
  homepage: StateThemeHomepage;
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
  theme: StateTheme;
}
