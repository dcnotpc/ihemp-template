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
  // Texas: dedicated hero artwork — the shared stylized landscape revised to
  // include rows of industrial hemp drawn into the field as part of the
  // illustration (single self-contained raster, no external image refs).
  texas: {
    ...defaultStateTheme,
    slug: 'texas',
    name: 'Texas Open Range',
    hero: {
      ...defaultStateTheme.hero,
      image: '/images/states/hero-texas.webp',
      alt: 'Industrial hemp field on a Texas ranch landscape',
    },
    motif: {
      ...defaultStateTheme.motif,
      name: 'Open range hills and industrial hemp rows',
    },
  },
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
      image: '/images/states/hero-tennessee.webp',
      alt: 'Industrial hemp field in rural Tennessee landscape',
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
      image: '/images/states/hero-kentucky.webp',
      alt: 'Industrial hemp field in rural Kentucky landscape',
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
      image: '/images/states/hero-colorado.webp',
      alt: 'Industrial hemp field in rural Colorado landscape',
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
  alabama: {
    ...defaultStateTheme,
    slug: 'alabama',
    hero: {
      ...defaultStateTheme.hero,
      image: '/images/states/hero-alabama.webp',
      alt: 'Industrial hemp field in rural Alabama landscape',
    },
  },
  arkansas: {
    ...defaultStateTheme,
    slug: 'arkansas',
    hero: {
      ...defaultStateTheme.hero,
      image: '/images/states/hero-arkansas.webp',
      alt: 'Industrial hemp field in rural Arkansas landscape',
    },
  },
  california: {
    ...defaultStateTheme,
    slug: 'california',
    hero: {
      ...defaultStateTheme.hero,
      image: '/images/states/hero-california.webp',
      alt: 'Industrial hemp field in rural California landscape',
    },
  },
  florida: {
    ...defaultStateTheme,
    slug: 'florida',
    hero: {
      ...defaultStateTheme.hero,
      image: '/images/states/hero-florida.webp',
      alt: 'Industrial hemp field in rural Florida landscape',
    },
  },
  georgia: {
    ...defaultStateTheme,
    slug: 'georgia',
    hero: {
      ...defaultStateTheme.hero,
      image: '/images/states/hero-georgia.webp',
      alt: 'Industrial hemp field in rural Georgia landscape',
    },
  },
  michigan: {
    ...defaultStateTheme,
    slug: 'michigan',
    hero: {
      ...defaultStateTheme.hero,
      image: '/images/states/hero-michigan.webp',
      alt: 'Industrial hemp field in rural Michigan landscape',
    },
  },
  indiana: {
    ...defaultStateTheme,
    slug: 'indiana',
    hero: {
      ...defaultStateTheme.hero,
      image: '/images/states/hero-indiana.webp',
      alt: 'Industrial hemp field in rural Indiana landscape',
    },
  },
  iowa: {
    ...defaultStateTheme,
    slug: 'iowa',
    hero: {
      ...defaultStateTheme.hero,
      image: '/images/states/hero-iowa.webp',
      alt: 'Industrial hemp field in rural Iowa landscape',
    },
  },
  kansas: {
    ...defaultStateTheme,
    slug: 'kansas',
    hero: {
      ...defaultStateTheme.hero,
      image: '/images/states/hero-kansas.webp',
      alt: 'Industrial hemp field in rural Kansas landscape',
    },
  },
  mississippi: {
    ...defaultStateTheme,
    slug: 'mississippi',
    hero: {
      ...defaultStateTheme.hero,
      image: '/images/states/hero-mississippi.webp',
      alt: 'Industrial hemp field in rural Mississippi landscape',
    },
  },
  nebraska: {
    ...defaultStateTheme,
    slug: 'nebraska',
    hero: {
      ...defaultStateTheme.hero,
      image: '/images/states/hero-nebraska.webp',
      alt: 'Industrial hemp field in rural Nebraska landscape',
    },
  },
  ohio: {
    ...defaultStateTheme,
    slug: 'ohio',
    hero: {
      ...defaultStateTheme.hero,
      image: '/images/states/hero-ohio.webp',
      alt: 'Industrial hemp field in rural Ohio landscape',
    },
  },
  oklahoma: {
    ...defaultStateTheme,
    slug: 'oklahoma',
    hero: {
      ...defaultStateTheme.hero,
      image: '/images/states/hero-oklahoma.webp',
      alt: 'Industrial hemp field in rural Oklahoma landscape',
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
