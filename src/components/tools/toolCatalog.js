import { financeTools } from './data/finance.js';
import { calculatorTools } from './data/calculators.js';
import { datetimeTools } from './data/datetime.js';
import { healthTools } from './data/health.js';
import { textTools } from './data/text.js';
import { developerTools } from './data/developer.js';
import { seoTools } from './data/seo.js';
import { RELATED_TOOLS } from './data/relatedTools.js';
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

/**
 * Related tools power internal linking, which is how deep tool pages get
 * crawled. The curated list in data/relatedTools.js is the primary source —
 * it picks genuinely related tools rather than just same-category ones — and
 * same-category/shared-tag matching only fills in behind it, so a tool added
 * without a curated entry yet still gets a reasonable set instead of none.
 */
const MIN_RELATED = 4;

export const getRelatedTools = (slug, limit = 6) => {
  const tool = bySlug.get(slug);
  if (!tool) return [];

  const curated = (RELATED_TOOLS[slug] || [])
    .map((relatedSlug) => bySlug.get(relatedSlug))
    .filter(Boolean);
  // A curated list that already meets the minimum is used as-is, capped at
  // `limit` — it is never topped up with looser automatic matches, so a
  // deliberately-short, high-quality list (e.g. 4 tools) is never diluted
  // by a same-category pick just to reach a round number.
  if (curated.length >= MIN_RELATED) return curated.slice(0, limit);

  const seen = new Set([slug, ...curated.map((item) => item.slug)]);
  const sameCategory = premiumTools.filter((item) => !seen.has(item.slug) && item.category === tool.category);
  const sharedTag = premiumTools.filter((item) => (
    !seen.has(item.slug)
    && item.category !== tool.category
    && item.tags.some((tag) => tool.tags.includes(tag))
  ));
  return [...curated, ...sameCategory, ...sharedTag].slice(0, MIN_RELATED);
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
