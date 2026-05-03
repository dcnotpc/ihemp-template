import { states } from '@/data/states';
import type { StateConfig } from './types';

// Base configuration that's common across all states
const baseConfig = {
  startYear: 2018,
  hero: {
    primaryCtaHref: '/laws',
    secondaryCtaHref: '/blog',
  },
  homepage: {
    cards: [
      {
        href: '/laws',
      },
      {
        href: '/blog',
      },
      {
        href: '/resources',
      }
    ],
    productSectionTitle: 'Featured Products',
    productSectionDescription: 'Helpful hemp-related products and recommendations.',
  },
  pages: {
    blog: {
      title: 'Blog',
    },
    laws: {
      title: 'Laws',
    },
    resources: {
      title: 'Resources',
    },
  },
  // Network states that appear in footer, etc.
  networkStates: [
    { name: 'Alabama', url: 'https://ihempalabama.com' },
    { name: 'Arkansas', url: 'https://ihemparkansas.com' },
    { name: 'California', url: 'https://ihempcalifornia.com' },
    { name: 'Colorado', url: 'https://ihempcolorado.com' },
    { name: 'Florida', url: 'https://ihempflorida.com' },
    { name: 'Georgia', url: 'https://ihempgeorgia.com' },
    { name: 'Indiana', url: 'https://ihempindiana.com' },
    { name: 'Iowa', url: 'https://ihempiowa.com' },
    { name: 'Kansas', url: 'https://ihempkansas.com' },
    { name: 'Kentucky', url: 'https://ihempkentucky.com' },
    { name: 'Michigan', url: 'https://ihempmi.com' },
    { name: 'Mississippi', url: 'https://ihempmississippi.com' },
    { name: 'Nebraska', url: 'https://ihempnebraska.com' },
    { name: 'Ohio', url: 'https://ihempohio.com' },
    { name: 'Oklahoma', url: 'https://ihempoklahoma.com' },
    { name: 'Tennessee', url: 'https://ihemptennessee.com' },
    { name: 'Texas', url: 'https://ihemptexas.com' },
  ],
};

// State-specific overrides for special cases
const stateOverrides: Record<string, Partial<ReturnType<typeof createStateConfig>>> = {
  colorado: {
    resources: {
      legislatureUrl: 'https://leg.colorado.gov/',
      findLegislatorUrl: 'https://leg.colorado.gov/find-my-legislator',
      hempProgramUrl: 'https://ag.colorado.gov/brands/industrial-hemp-program',
      congressUrl: 'https://www.congress.gov/',
    },
  },
  // Add other state-specific overrides as needed
};

// Create state-specific domain (ihemp{stateSlug}.com)
const getDomain = (stateSlug: string, stateName: string) => {
  const stateNameLower = stateName.toLowerCase().replace(/\s+/g, '');
  if (stateSlug === 'colorado') return 'ihempcolorado.com';
  if (stateSlug === 'michigan') return 'ihempmi.com';
  return `ihemp${stateNameLower}.com`;
};

// Create state-specific tagline
const getTagline = (stateName: string) => `Your ${stateName} Hemp Law Guide`;

// Create stateConfig for a given state slug
export const createStateConfig = (stateSlug: string): StateConfig => {
  const state = states.find(s => s.slug === stateSlug);
  if (!state) {
    throw new Error(`State with slug "${stateSlug}" not found`);
  }

  const domain = getDomain(stateSlug, state.name);
  const tagline = getTagline(state.name);
  
  const baseDescription = `Stay compliant with ${state.name} hemp regulations.`;
  const description = state.summary ? `${state.summary.split('.')[0]}.` : baseDescription;

  const heroTitle = `Your ${state.name} Hemp Law Guide`;
  const heroSubtitle = `Understand ${state.name} hemp laws, licensing, compliance updates, and industry news with practical resources for farmers, businesses, and consumers.`;

  const config = {
    name: state.name,
    abbreviation: state.abbreviation || state.abbreviation?.toUpperCase() || state.name.substring(0, 2).toUpperCase(),
    slug: state.slug || stateSlug,
    domain,
    siteName: `iHemp ${state.name}`,
    logo: `/images/ihemp-${stateSlug}-logo-cream.webp`,
    startYear: baseConfig.startYear,
    tagline,
    description,

    hero: {
      title: heroTitle,
      subtitle: heroSubtitle,
      primaryCtaLabel: `Explore ${state.name} Laws`,
      primaryCtaHref: baseConfig.hero.primaryCtaHref,
      secondaryCtaLabel: 'Read the Blog',
      secondaryCtaHref: baseConfig.hero.secondaryCtaHref,
    },

    homepage: {
      cards: baseConfig.homepage.cards.map((card, index) => {
        const titles = [
          `${state.name} Laws`,
          'Blog',
          'Resources'
        ];
        const descriptions = [
          `Browse ${state.name} hemp regulations and compliance requirements.`,
          `Read ${state.name} hemp industry news, policy changes, and educational guides.`,
          `Find advocacy tools, helpful links, and ways to support hemp in ${state.name}.`,
        ];
        return {
          ...card,
          title: titles[index],
          description: descriptions[index],
        };
      }),
      productSectionTitle: baseConfig.homepage.productSectionTitle,
      productSectionDescription: `${baseConfig.homepage.productSectionDescription} for ${state.name} readers.`,
    },

    pages: {
      blog: {
        title: baseConfig.pages.blog.title,
        description: `Updates, analysis, and commentary on hemp policy, consumer issues, and industry news in ${state.name}.`,
      },
      laws: {
        title: baseConfig.pages.laws.title,
        description: `Explore ${state.name} hemp laws, regulations, compliance requirements, and official policy resources.`,
      },
      resources: {
        title: baseConfig.pages.resources.title,
        description: `Explore advocacy tools, educational resources, and ways to support hemp in ${state.name}.`,
      },
    },

    resources: {
      legislatureUrl: `https://${state.abbreviation?.toLowerCase() || 'state'}.gov/`,
      findLegislatorUrl: '',
      hempProgramUrl: '',
      congressUrl: 'https://www.congress.gov/',
    },

    networkStates: baseConfig.networkStates,
    ...(stateOverrides[stateSlug] || {}),
  };

  return config;
};

// Default export that reads from environment variable
const DEFAULT_STATE = process.env.NEXT_PUBLIC_STATE || 'colorado';
export const stateConfig = createStateConfig(DEFAULT_STATE);