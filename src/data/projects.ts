// ─── Shared project data ──────────────────────────────────────────────────────
// Used by both Work (grid) and WorkDetail (case study template).
// Add/edit projects here and both pages update automatically.

export type ProjectSize = 'large' | 'medium' | 'small'

export interface Project {
  slug:      string
  title:     string
  client:    string
  year:      string
  category:  string
  tags:      string[]
  desc:      string
  url:       string | null
  size:      ProjectSize
  visual:    string
  // Detail page fields
  role:      string
  duration:  string
  overview:  string
  challenge: string
  solution:  string
  results:   { value: string; label: string }[]
  // Optional: add screenshot src paths here when ready
  screens?:  string[]
}

export const PROJECTS: Project[] = [
  {
    slug:     'ponds-india',
    title:    "Pond's India",
    client:   'Unilever / HUL',
    year:     '2023',
    category: 'E-Commerce',
    tags:     ['Shopify', 'React', 'GSAP', 'Design System', 'Storefront API'],
    desc:     "Shopify DTC skincare platform — AI Skin Expert, product collections, wishlist & cart for POND'S India.",
    url:      'https://ponds.in',
    size:     'large',
    visual:   'ponds',
    role:     'Frontend Developer (Lead)',
    duration: '8 months · 2022–2023',
    overview: "Built the end-to-end Shopify DTC platform for POND'S India (Unilever / HUL). The site covers the full skincare journey — product discovery, an AI Skin Expert quiz, science-backed editorial content, and a seamless checkout experience. Delivered at Langoor for one of India's most recognised beauty brands.",
    challenge:"The existing POND'S digital presence was fragmented across multiple microsites with no unified commerce layer. The team needed a performant, scalable Shopify DTC platform that could support product collections, an interactive AI skin quiz, blog/editorial content, wishlist, and fast checkout — all without compromising on brand aesthetics.",
    solution: "Architected the Shopify theme using a custom Liquid + React hybrid approach — static Liquid for SEO-critical pages, React components for interactive islands (quiz, wishlist, cart drawer). Integrated Shopify Storefront API for headless cart logic. Implemented GSAP scroll animations and a bespoke design system with Figma token pipelining for pixel-perfect brand consistency.",
    results: [
      { value: '+25%',  label: 'Conversion rate uplift' },
      { value: '45%',   label: 'Faster page loads' },
      { value: '2×',    label: 'Quiz completion rate' },
      { value: '98%',   label: 'Client satisfaction' },
    ],
    screens: [
      '/projects/ponds/ponds-home-hero.png',
      '/projects/ponds/ponds-spotlight-bb.jpg',
      '/projects/ponds/ponds-spotlight-vitc.jpg',
      '/projects/ponds/ponds-pdp-hero.png',
      '/projects/ponds/ponds-spotlight-sun.jpg',
    ],
  },
  {
    slug:     'liquid-iv-canada',
    title:    'Liquid I.V. Canada',
    client:   'Unilever',
    year:     '2022',
    category: 'E-Commerce',
    tags:     ['Shopify', 'Liquid', 'Performance', 'A/B Testing', 'i18n'],
    desc:     'Bilingual EN/FR hydration brand storefront — multi-flavour catalog, bundles, sustainability messaging.',
    url:      'https://liquid-iv.ca',
    size:     'large',
    visual:   'liqca',
    role:     'Frontend Developer',
    duration: '5 months · 2022',
    overview: 'Delivered the Canadian DTC storefront for Liquid I.V. — a Unilever hydration brand. The platform required full bilingual (EN/FR) support, multi-flavour catalog, bundle configurator, and strong sustainability storytelling, all on Shopify.',
    challenge:"Liquid I.V. Canada needed to match the US brand experience while meeting Canadian bilingual requirements (CRTC compliance). Performance on mobile was a critical KPI — the previous site scored poorly on Core Web Vitals, directly impacting paid media ROI.",
    solution: 'Rebuilt the Shopify theme from scratch with a mobile-first Liquid architecture, lazy-loaded sections, and optimised image delivery via Shopify CDN. Implemented i18n using Shopify\'s native translation layer. Ran A/B tests on the PDP and checkout — bundle upsell variant lifted AOV by 22%.',
    results: [
      { value: '+35%',  label: 'Checkout conversion' },
      { value: '+22%',  label: 'AOV via bundle upsell' },
      { value: '40%',   label: 'Manual update reduction' },
      { value: '92',    label: 'Lighthouse score' },
    ],
    screens: [],
  },
  {
    slug:     'liquid-iv-australia',
    title:    'Liquid I.V. Australia',
    client:   'Unilever',
    year:     '2023',
    category: 'E-Commerce',
    tags:     ['Shopify', 'i18n', 'Liquid', 'UX', 'AUD Localisation'],
    desc:     'AUD-localised Shopify storefront with promotions, impact messaging, and Southern Cross branding.',
    url:      'https://liquid-iv.com.au',
    size:     'medium',
    visual:   'liqau',
    role:     'Frontend Developer',
    duration: '4 months · 2023',
    overview: "Localised and launched Liquid I.V.'s Australian DTC storefront — adapted from the US base theme to suit AUD pricing, local promotions, impact messaging, and region-specific UX patterns.",
    challenge: 'Adapting the existing US Shopify theme for Australia while preserving brand consistency required deep Liquid customisation — AUD currency formatting, local shipping logic, AU-specific promotional banners, and adjusted compliance copy.',
    solution: 'Extended the base theme with a modular section architecture enabling AU-specific overrides without forking the core codebase. Rebuilt the promotions system as a configurable Liquid section. Collaborated closely with Unilever\'s brand team on Southern Cross visual identity elements.',
    results: [
      { value: '30%',   label: 'Faster launch vs fork' },
      { value: '+18%',  label: 'AU organic traffic' },
      { value: '100%',  label: 'Brand audit pass rate' },
      { value: '4.8★',  label: 'Client rating' },
    ],
    screens: [],
  },
  {
    slug:     'hal-web-app',
    title:    'HAL Web Platform',
    client:   'Hindustan Aeronautics Ltd',
    year:     '2020',
    category: 'Enterprise',
    tags:     ['HTML5', 'CSS3', 'JavaScript', 'Responsive', 'jQuery'],
    desc:     "Custom enterprise HTML web application for India's premier aerospace & defence manufacturer.",
    url:      null,
    size:     'medium',
    visual:   'hal',
    role:     'Senior Frontend Developer',
    duration: '6 months · 2019–2020',
    overview: 'Designed and built a custom enterprise web application for Hindustan Aeronautics Limited (HAL) — one of India\'s largest aerospace and defence PSUs. The platform centralised internal workflows into a single responsive interface.',
    challenge: 'HAL\'s legacy systems were siloed, slow, and desktop-only. The goal was a responsive, accessible web application that could serve both field engineers and administrative staff across varied devices and network conditions.',
    solution: 'Built a vanilla HTML5/CSS3/JS application with modular component architecture — no heavy framework overhead, ensuring performance on constrained hardware. Implemented progressive enhancement for IE11 compatibility required by internal IT policy. Responsive grid system built from scratch.',
    results: [
      { value: '100%',  label: 'Device compatibility' },
      { value: '0',     label: 'Framework dependencies' },
      { value: 'IE11+', label: 'Browser support' },
      { value: '6mo',   label: 'Delivered on time' },
    ],
    screens: [],
  },
  {
    slug:     'bel-platform',
    title:    'BEL Digital Platform',
    client:   'Bharat Electronics Ltd',
    year:     '2019',
    category: 'Enterprise',
    tags:     ['HTML5', 'CSS3', 'jQuery', 'WordPress', 'Bootstrap'],
    desc:     'Responsive web platform for a Navratna public-sector electronics corporation.',
    url:      null,
    size:     'medium',
    visual:   'bel',
    role:     'Senior Frontend Developer',
    duration: '4 months · 2019',
    overview: 'Delivered a responsive digital platform for Bharat Electronics Limited (BEL) — a Navratna public-sector defence electronics corporation. The project covered wireframing, front-end development, and WordPress CMS integration.',
    challenge: 'BEL needed a modern, accessible public-facing platform that met government web accessibility guidelines while providing editors with an easy CMS workflow for regular content updates.',
    solution: 'Built with Bootstrap 4 for responsive layout, custom jQuery for interactive components, and WordPress as the CMS backbone. Developed custom page templates and Gutenberg blocks to empower non-technical editors. Strict WCAG 2.0 AA accessibility compliance throughout.',
    results: [
      { value: 'WCAG',  label: '2.0 AA compliant' },
      { value: '100%',  label: 'Editor self-sufficiency' },
      { value: '4mo',   label: 'Delivered on time' },
      { value: '0',     label: 'Post-launch bugs' },
    ],
    screens: [],
  },
  {
    slug:     'webar-experience',
    title:    'WebAR Experience',
    client:   'Langoor',
    year:     '2022',
    category: 'WebAR',
    tags:     ['8th Wall', 'Three.js', 'WebAR', 'GSAP', 'JavaScript'],
    desc:     'Immersive augmented reality web experience built with 8th Wall and Three.js — no app install required.',
    url:      null,
    size:     'medium',
    visual:   'webar',
    role:     'Frontend Developer (AR Lead)',
    duration: '3 months · 2022',
    overview: 'Created an immersive browser-based augmented reality experience using 8th Wall and Three.js for a Langoor client campaign. Users could activate AR directly in their mobile browser — no app download required — delivering a frictionless branded moment.',
    challenge: 'Delivering a performant AR experience across a wide range of iOS and Android devices, without a native app, while maintaining brand-quality visuals and sub-3-second load times.',
    solution: 'Used 8th Wall\'s SLAM tracking for world-space AR anchoring combined with Three.js for custom 3D asset rendering and GSAP for entry animations. Heavy assets loaded via progressive streaming. Implemented WebXR fallback for non-supported browsers.',
    results: [
      { value: '< 3s',  label: 'Load time on mobile' },
      { value: '85%+',  label: 'Device compatibility' },
      { value: '4×',    label: 'Avg. session duration' },
      { value: '0',     label: 'App installs required' },
    ],
    screens: [],
  },
  {
    slug:     'nexval-fintech',
    title:    'Nexval Fintech UI',
    client:   'Nexval Group',
    year:     '2017',
    category: 'UI Dev',
    tags:     ['HTML5', 'Bootstrap', 'jQuery', 'Sass', 'Responsive'],
    desc:     'Responsive UI component library for fintech mortgage & servicing web platforms.',
    url:      null,
    size:     'small',
    visual:   'fintech',
    role:     'UI Developer',
    duration: '18 months · 2016–2018',
    overview: 'Built a reusable responsive UI component library for Nexval Group\'s suite of mortgage and loan servicing platforms. Components covered data tables, form systems, dashboards, and document workflows.',
    challenge: 'The fintech platforms served diverse users — loan officers, servicers, and customers — each with distinct workflow needs. A shared component library had to be flexible enough for all contexts while maintaining strict visual consistency.',
    solution: 'Designed and implemented a Bootstrap 4 extension library with custom Sass variables and utility classes. All components were built accessibility-first with keyboard navigation and ARIA roles. Documented with inline usage examples for the engineering team.',
    results: [
      { value: '40+',   label: 'Components shipped' },
      { value: '30%',   label: 'Dev velocity increase' },
      { value: 'WCAG',  label: 'AA compliant' },
      { value: '18mo',  label: 'Engagement duration' },
    ],
    screens: [],
  },
  {
    slug:     'netbramha-projects',
    title:    'NetBramha Studio',
    client:   'NetBramha',
    year:     '2026',
    category: 'UI Dev',
    tags:     ['React', 'Next.js', 'TypeScript', 'Figma', 'Design System'],
    desc:     'Frontend Lead role — architecture, design systems, and polished digital products for global UX clients.',
    url:      null,
    size:     'small',
    visual:   'netbramha',
    role:     'Frontend Lead',
    duration: 'Feb 2026 – Present',
    overview: 'Currently serving as Frontend Lead at NetBramha Studio — a global UX design agency. Leading frontend architecture decisions, establishing engineering standards, and driving design-to-code workflows across multiple concurrent client projects.',
    challenge: 'Scaling a design-forward frontend practice across a growing team of engineers and designers — ensuring consistency, velocity, and quality across simultaneous projects with different tech stacks and client requirements.',
    solution: 'Introduced a Figma token pipeline feeding directly into a shared React/TypeScript design system. Established code review standards, CI/CD workflows, and component documentation. Mentoring junior engineers on animation-first development with GSAP.',
    results: [
      { value: '3×',    label: 'Faster design handoff' },
      { value: '100%',  label: 'Type-safe codebase' },
      { value: '+40%',  label: 'Team velocity gain' },
      { value: '2026',  label: 'Ongoing' },
    ],
    screens: [],
  },
]

export const getProject = (slug: string) => PROJECTS.find(p => p.slug === slug)
export const getAdjacentProjects = (slug: string) => {
  const idx  = PROJECTS.findIndex(p => p.slug === slug)
  const prev = idx > 0 ? PROJECTS[idx - 1] : null
  const next = idx < PROJECTS.length - 1 ? PROJECTS[idx + 1] : null
  return { prev, next }
}
