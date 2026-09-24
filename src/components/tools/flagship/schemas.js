import {
  SITE_NAME, SITE_URL, absoluteUrl, breadcrumbSchema, faqSchema,
} from '../../../seo/siteMeta.js';

/**
 * Structured data for a flagship tool page. Pure data so the prerender step
 * (scripts/routes.mjs) and the live page (FlagshipShell) emit identical JSON-LD.
 */
export function flagshipBreadcrumb(page) {
  const trail = [
    { name: 'Home', path: '/' },
    { name: 'Tools', path: '/tools' },
  ];
  if (page.parent) trail.push({ name: page.parent.name, path: page.parent.path });
  trail.push({ name: page.crumb || page.h1, path: page.path });
  return trail;
}

export function flagshipSchemas(page) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: page.appName || page.h1,
      url: absoluteUrl(page.path),
      description: page.description,
      applicationCategory: page.applicationCategory || 'UtilitiesApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    },
    page.faqs?.length ? faqSchema(page.faqs) : null,
    breadcrumbSchema(flagshipBreadcrumb(page)),
  ].filter(Boolean);
}
