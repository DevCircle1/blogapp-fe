/**
 * Single source of truth for every indexable URL on the site.
 * Consumed by both the sitemap generator and the prerender step so the two can
 * never disagree about what exists.
 */
import { premiumTools, standaloneTools } from '../src/components/tools/toolCatalog.js';

export const SITE_URL = 'https://talkandtool.com';
export const SITE_NAME = 'Talk & Tool';

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/3.png`,
  description: 'Talk & Tool publishes free online calculators, converters, text utilities, and developer tools that run entirely in your browser.',
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
};

export const staticRoutes = [
  {
    path: '/',
    schemas: [websiteSchema, organizationSchema],
    title: 'Talk & Tool — 70+ Free Online Tools, Calculators & Guides',
    description: 'Free online calculators, unit converters, text utilities, and developer tools that run entirely in your browser, plus practical guides. No sign-up, no downloads.',
    priority: '1.0',
    changefreq: 'daily',
    // Must mirror the rendered <h1> and hero copy: what a crawler reads before
    // JavaScript runs should describe the same page a visitor ends up on.
    heading: 'Free online tools and calculators',
    body: 'Over 70 calculators, converters, text utilities, and developer tools that run entirely in your browser. No sign-up, no downloads, and nothing you type is uploaded.',
  },
  {
    path: '/tools',
    title: `Free Online Tools, Calculators & Converters | ${SITE_NAME}`,
    description: 'Browse free online tools: calculators, unit converters, text utilities, and developer tools. Fast, mobile-friendly, and private — everything runs in your browser.',
    priority: '1.0',
    changefreq: 'weekly',
    heading: 'Free online tools that work instantly',
    body: 'A directory of free calculators, converters, text utilities, and developer tools. Every tool opens instantly, works on mobile, and processes your input locally in the browser.',
  },
  {
    path: '/blogs',
    title: `Blog — Guides, Tutorials and Practical How-Tos | ${SITE_NAME}`,
    description: 'Browse articles and guides from Talk & Tool, organised by topic. Practical tutorials on tools, calculations, development, and productivity.',
    priority: '0.8',
    changefreq: 'daily',
    heading: 'Guides, tutorials and practical how-tos',
    body: 'Articles and guides organised by topic, covering the tools on this site and the ideas behind them.',
  },
  {
    path: '/about-us',
    // No " | Talk & Tool" suffix: the title already names the brand, and the
    // Seo component skips the suffix in that case. Adding it here would make
    // the prerendered title differ from the one React sets on mount.
    title: 'About Talk & Tool',
    description: 'Talk & Tool builds free browser-based calculators, converters, and developer tools, plus practical guides. Learn who we are and how the site works.',
    priority: '0.5',
    changefreq: 'monthly',
    heading: 'About Talk & Tool',
    body: 'Talk & Tool is an independent site publishing free online tools and practical guides.',
  },
  {
    path: '/contact-us',
    title: `Contact Us | ${SITE_NAME}`,
    description: 'Get in touch with Talk & Tool for support, feedback, tool suggestions, or business enquiries.',
    priority: '0.5',
    changefreq: 'monthly',
    heading: 'Contact Talk & Tool',
    body: 'Send us a message about support, feedback, a tool suggestion, or a business enquiry.',
  },
  {
    path: '/help-center',
    title: `Help Center | ${SITE_NAME}`,
    description: 'Answers to common questions about using Talk & Tool: the free online tools, publishing articles, accounts, and getting in touch.',
    priority: '0.4',
    changefreq: 'monthly',
    heading: 'Help Center',
    body: 'Answers to common questions about the tools, accounts, publishing, and contacting us.',
  },
  {
    path: '/privacy-policy',
    title: `Privacy Policy | ${SITE_NAME}`,
    description: 'How Talk & Tool collects, uses, and protects your information, including cookies, analytics, and third-party advertising by Google AdSense.',
    priority: '0.3',
    changefreq: 'yearly',
    heading: 'Privacy Policy',
    body: 'How we collect, use, and protect your information, including cookies, analytics, and third-party advertising.',
  },
  {
    path: '/terms-and-conditions',
    title: `Terms and Conditions | ${SITE_NAME}`,
    description: 'The terms and conditions governing use of Talk & Tool, including acceptable use, disclaimers, and limitation of liability.',
    priority: '0.3',
    changefreq: 'yearly',
    heading: 'Terms and Conditions',
    body: 'The terms governing use of this site, including acceptable use, disclaimers, and limitation of liability.',
  },
  {
    path: '/word-game',
    title: `Daily Word Game — Guess the 5-Letter Word | ${SITE_NAME}`,
    description: 'Play the free daily word game. Guess the five-letter word of the day in six tries, with colour hints after every guess.',
    priority: '0.6',
    changefreq: 'daily',
    heading: 'Daily word game',
    body: 'Guess the five-letter word of the day in six tries. A new word every day, no sign-up required.',
  },
];

const STANDALONE_COPY = {
  'check-ip': {
    title: `What Is My IP Address? Free IP & Location Checker | ${SITE_NAME}`,
    description: 'Find your public IP address instantly, plus your approximate city, region, country, time zone, and internet provider. Free, no sign-up, nothing stored.',
    heading: 'What is my IP address?',
    body: 'See the public IP address your connection presents to the internet, along with the approximate location, time zone, and provider that any website can read from it.',
  },
  'screen-resolution': {
    title: `What Is My Screen Resolution? Free Screen Size Checker | ${SITE_NAME}`,
    description: 'Check your screen resolution, browser viewport size, device pixel ratio, colour depth, and current CSS breakpoint instantly.',
    heading: 'What is my screen resolution?',
    body: 'Live viewport size, full screen resolution, device pixel ratio, colour depth, and the CSS breakpoint your current window width falls into.',
  },
  'text-to-html': {
    title: `Rich Text to HTML Converter — Free WYSIWYG Editor | ${SITE_NAME}`,
    description: 'Write formatted content in a visual editor and export clean, valid HTML instantly. Headings, lists, links, and styling with no markup knowledge required.',
    heading: 'Rich text to HTML converter',
    body: 'Compose content in a visual editor and export clean semantic HTML ready to paste into a CMS, template, or page.',
  },
};

const APPLICATION_CATEGORY = {
  Finance: 'FinanceApplication',
  Health: 'HealthApplication',
  Developer: 'DeveloperApplication',
  Security: 'SecurityApplication',
  SEO: 'BusinessApplication',
};

/**
 * The same structured data the page emits at runtime, baked in statically.
 * Google renders JavaScript, but static JSON-LD is picked up on the first pass
 * instead of waiting for the render queue — which matters most for the FAQ and
 * HowTo markup that drives rich results.
 */
const toolSchemas = (tool, canonical) => [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    url: canonical,
    description: tool.description,
    applicationCategory: APPLICATION_CATEGORY[tool.category] || 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqs.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` },
      { '@type': 'ListItem', position: 3, name: tool.shortTitle, item: canonical },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to use the ${tool.shortTitle}`,
    description: tool.intro,
    totalTime: 'PT1M',
    step: tool.steps.map((step, index) => ({ '@type': 'HowToStep', position: index + 1, text: step })),
  },
];

export const toolRoutes = premiumTools.map((tool) => {
  const canonical = `${SITE_URL}/tools/${tool.slug}`;
  return {
    path: `/tools/${tool.slug}`,
    title: `${tool.title} | ${SITE_NAME}`,
    description: tool.description,
    priority: '0.8',
    changefreq: 'monthly',
    heading: tool.title,
    body: tool.intro,
    steps: tool.steps,
    faqs: tool.faqs,
    schemas: toolSchemas(tool, canonical),
  };
});

export const standaloneRoutes = standaloneTools
  .filter((tool) => STANDALONE_COPY[tool.slug])
  .map((tool) => ({
    path: tool.link,
    priority: '0.7',
    changefreq: 'monthly',
    ...STANDALONE_COPY[tool.slug],
  }));

export const allRoutes = [...staticRoutes, ...standaloneRoutes, ...toolRoutes];
