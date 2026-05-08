import type { StateTheme } from './types';

export const defaultStateTheme: StateTheme = {
  slug: 'default',
  name: 'iHemp Field',
  colors: {
    primary: '#2d5016',
    primaryDark: '#1f3a12',
    sage: '#87a96b',
    leaf: '#4a9e3f',
    gold: '#c9a227',
    cream: '#faf3e0',
    brown: '#5c4033',
    heroText: '#f5e6c8',
  },
  hero: {
    image: '/images/hemp-field.webp',
    alt: 'Hemp fiber field',
    overlayClass: 'bg-black/30',
    treatment: 'field',
  },
  motif: {
    name: 'Shared hemp field',
    pattern: 'none',
    accentLabel: 'Industrial hemp education and advocacy',
  },
  homepage: {
    quote: 'Growing the Future from Seeds of the Past',
    positioning: 'Industrial hemp resources for growers, businesses, and consumers.',
    ctaTone: 'advocacy',
  },
};

export const stateThemes: Partial<Record<string, StateTheme>> = {
  tennessee: {
    slug: 'tennessee',
    name: 'Tennessee Valley',
    colors: {
      primary: '#2f4a2a',
      primaryDark: '#1f3320',
      sage: '#7b9863',
      leaf: '#5f8c48',
      gold: '#b8843a',
      cream: '#fbf6ea',
      brown: '#4c382f',
      heroText: '#f6e6c8',
    },
    hero: {
      image: '/images/hemp-field.webp',
      alt: 'Hemp field representing Tennessee agriculture',
      overlayClass: 'bg-black/35',
      treatment: 'heritage',
    },
    motif: {
      name: 'Appalachian ridgelines and farm rows',
      pattern: 'topographic',
      accentLabel: 'Tennessee hemp compliance and retail readiness',
    },
    homepage: {
      quote: 'Rooted in working land, built for a changing hemp market.',
      positioning: 'A practical hemp guide for Tennessee growers, retailers, and consumers navigating stricter cannabinoid rules.',
      ctaTone: 'compliance',
    },
  },
  kentucky: {
    slug: 'kentucky',
    name: 'Kentucky Hemp Heritage',
    colors: {
      primary: '#294734',
      primaryDark: '#172c22',
      sage: '#809465',
      leaf: '#668b4f',
      gold: '#c49a47',
      cream: '#faf4e8',
      brown: '#49372f',
      heroText: '#f4e5c7',
    },
    hero: {
      image: '/images/hemp-field.webp',
      alt: 'Kentucky hemp field and agricultural landscape',
      overlayClass: 'bg-black/30',
      treatment: 'heritage',
    },
    motif: {
      name: 'Bluegrass heritage and hemp fiber rows',
      pattern: 'barnwood',
      accentLabel: 'Mature hemp program with deep agricultural roots',
    },
    homepage: {
      quote: 'Old crop knowledge, new market discipline.',
      positioning: 'A hemp law and market guide for Kentucky cultivation, processing, and cannabinoid product compliance.',
      ctaTone: 'heritage',
    },
  },
  colorado: {
    slug: 'colorado',
    name: 'Colorado Mountain Hemp',
    colors: {
      primary: '#24523e',
      primaryDark: '#163629',
      sage: '#789a76',
      leaf: '#4f8a62',
      gold: '#d2a13b',
      cream: '#f8f5ec',
      brown: '#3f3a33',
      heroText: '#f2e6c8',
    },
    hero: {
      image: '/images/hemp-field.webp',
      alt: 'Colorado hemp agriculture and mountain market landscape',
      overlayClass: 'bg-black/40',
      treatment: 'mountain',
    },
    motif: {
      name: 'Mountain contours and regulated innovation',
      pattern: 'topographic',
      accentLabel: 'Colorado hemp policy, products, and compliance',
    },
    homepage: {
      quote: 'High-altitude standards for a regulated hemp economy.',
      positioning: 'A Colorado-focused guide for hemp businesses balancing innovation, agriculture, and stricter product rules.',
      ctaTone: 'innovation',
    },
  },
};

export function getStateTheme(stateSlug: string): StateTheme {
  const theme = stateThemes[stateSlug];
  if (theme) return theme;

  return {
    ...defaultStateTheme,
    slug: stateSlug,
  };
}
