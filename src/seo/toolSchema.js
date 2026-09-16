import { SITE_NAME, SITE_URL, absoluteUrl, breadcrumbSchema, faqSchema } from './siteMeta.js';

export const APPLICATION_CATEGORY = {
  Finance: 'FinanceApplication',
  Calculator: 'UtilitiesApplication',
  Health: 'HealthApplication',
  Developer: 'DeveloperApplication',
  Security: 'SecurityApplication',
  Text: 'UtilitiesApplication',
  'Date & Time': 'UtilitiesApplication',
  SEO: 'BusinessApplication',
};

/**
 * Structured data for a catalogue tool page in any language. Shared by the
 * React pages and scripts/prerender.mjs, so the JSON-LD a crawler reads
 * before JavaScript runs matches what the live page emits afterwards.
 *
 * `tool` carries the copy in the page's own language; `category` stays the
 * English catalogue id because it maps to a schema.org application type.
 */
export const toolPageSchemas = ({ tool, path, lang = 'en', breadcrumb, howToName, currency = 'USD' }) => [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    url: absoluteUrl(path),
    description: tool.description,
    inLanguage: lang,
    applicationCategory: APPLICATION_CATEGORY[tool.category] || 'UtilitiesApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: currency },
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  },
  faqSchema(tool.faqs),
  breadcrumbSchema(breadcrumb),
  {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howToName,
    description: tool.intro,
    totalTime: 'PT1M',
    step: tool.steps.map((step, index) => ({ '@type': 'HowToStep', position: index + 1, text: step })),
  },
];

/** The /tools directory and its language equivalents. */
export const toolHubSchemas = ({ name, path, description, lang = 'en', items, faqs, breadcrumb }) => [
  {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: absoluteUrl(path),
    description,
    inLanguage: lang,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        url: absoluteUrl(item.path),
      })),
    },
  },
  faqSchema(faqs),
  breadcrumbSchema(breadcrumb),
];
