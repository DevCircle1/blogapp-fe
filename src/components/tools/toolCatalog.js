import { financeTools } from './data/finance.js';
import { calculatorTools } from './data/calculators.js';
import { datetimeTools } from './data/datetime.js';
import { healthTools } from './data/health.js';
import { textTools } from './data/text.js';
import { developerTools } from './data/developer.js';
import { seoTools } from './data/seo.js';
import { SITE_URL } from '../../seo/siteMeta.js';

export { SITE_URL };

/**
 * Every entry here becomes an indexable page at /tools/<slug>.
 * Slugs are permanent: renaming one breaks an indexed URL, so add a redirect
 * in netlify.toml instead of editing a slug in place.
 */
export const premiumTools = [
  ...developerTools,
  ...calculatorTools,
  ...financeTools,
  ...textTools,
  ...datetimeTools,
  ...healthTools,
  ...seoTools,
];

export const toolCategories = [...new Set(premiumTools.map((tool) => tool.category))].sort();

const bySlug = new Map(premiumTools.map((tool) => [tool.slug, tool]));

export const getToolBySlug = (slug) => bySlug.get(slug);

/** Related tools power internal linking, which is how deep tool pages get crawled. */
export const getRelatedTools = (slug, limit = 4) => {
  const tool = bySlug.get(slug);
  if (!tool) return [];
  const sameCategory = premiumTools.filter((item) => item.slug !== slug && item.category === tool.category);
  const sharedTag = premiumTools.filter((item) => (
    item.slug !== slug
    && item.category !== tool.category
    && item.tags.some((tag) => tool.tags.includes(tag))
  ));
  return [...sameCategory, ...sharedTag].slice(0, limit);
};

/** Standalone pages that live outside /tools/<slug> but belong in the directory and sitemap. */
export const standaloneTools = [
  { slug: 'check-ip', title: 'IP Address Checker', shortTitle: 'IP Address Checker', link: '/check-ip', description: 'See your public IP address, approximate location, and network details.', icon: 'IP', category: 'Developer', tags: ['ip address', 'network', 'location'] },
  { slug: 'screen-resolution', title: 'Screen Resolution Checker', shortTitle: 'Screen Resolution', link: '/screen-resolution', description: 'Check your screen resolution, viewport size, pixel ratio, and colour depth.', icon: 'RES', category: 'Developer', tags: ['screen resolution', 'viewport', 'display'] },
  { slug: 'text-to-html', title: 'Rich Text to HTML Editor', shortTitle: 'Rich Text to HTML', link: '/text-to-html', description: 'Write formatted content in a visual editor and export clean HTML markup.', icon: 'RTE', category: 'Text', tags: ['rich text', 'html', 'editor', 'wysiwyg'] },
  { slug: 'word-game', title: 'Daily Word Game', shortTitle: 'Word Game', link: '/word-game', description: 'Guess the five-letter word of the day in six tries.', icon: 'WRD', category: 'Games', tags: ['word game', 'puzzle', 'daily'] },
  { slug: 'codes', title: 'CodeShare', shortTitle: 'CodeShare', link: '/codes', description: 'Share and collaborate on code snippets in real time.', icon: '</>', category: 'Developer', tags: ['code', 'share', 'snippet'] },
];

/** Single list used by the /tools directory page and the sitemap generator. */
export const allToolLinks = [
  ...premiumTools.map((tool) => ({ ...tool, link: `/tools/${tool.slug}`, premium: true })),
  ...standaloneTools,
];
