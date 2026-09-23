/**
 * Category hub pages: /<lang>/<category-slug>, one per tool category, for every
 * language whose content gives its categories a `slug` (currently German only).
 * The categories themselves are the `category` ids already on each catalogue
 * tool, with their names and blurbs in that language's content file.
 *
 * Plain JS so the React pages and the Node build scripts (routes, sitemap,
 * prerender, verify) share one definition of the hubs and of the breadcrumb
 * trail — two copies of a trail drift apart.
 */
import { premiumTools } from '../components/tools/toolCatalog.js';
import { toolHubSchemas } from '../seo/toolSchema.js';
import { LOCALES, hubPath } from './locales.js';
import { TOOL_SLUGS } from './slugs.js';

const hasHubs = (categories) => Object.values(categories).some((category) => category.slug);

export const categoryHubPath = (lang, categories, id) => (
  categories[id]?.slug ? `${hubPath(lang)}/${categories[id].slug}` : null
);

export const categoryIdForSlug = (categories, slug) => (
  Object.keys(categories).find((id) => categories[id].slug === slug)
);

const toolsIn = (content, id) => premiumTools.filter((tool) => tool.category === id && content.tools[tool.slug]);

/** The hubs of one language, for the links to them from its directory page. */
export const categoryHubs = (lang, content) => {
  if (!hasHubs(content.categories)) return [];
  return Object.entries(content.categories)
    .filter(([, category]) => category.slug)
    .map(([id, category]) => ({
      id,
      slug: category.slug,
      name: category.name,
      blurb: category.blurb,
      path: categoryHubPath(lang, content.categories, id),
      count: toolsIn(content, id).length,
    }));
};

/** Breadcrumb for a tool page: Home > Category > Tool, or Home > Tools > Tool where the language has no hubs. */
export const toolBreadcrumb = (lang, content, tool, path) => {
  const { chrome, categories } = content;
  const hubLink = categoryHubPath(lang, categories, tool.category);
  return [
    { name: chrome.home, path: '/' },
    hubLink
      ? { name: categories[tool.category].name, path: hubLink }
      : { name: chrome.tools, path: hubPath(lang) },
    { name: tool.shortTitle, path },
  ];
};

/** Everything a category hub page needs: head copy, its own tools, and structured data. */
export const categoryHubPage = (lang, content, id) => {
  const { chrome, categories, hub, tools } = content;
  const category = categories[id];
  const path = categoryHubPath(lang, categories, id);
  const title = hub.categoryTitle.replace('{name}', category.name);
  const items = toolsIn(content, id).map((tool) => ({
    slug: tool.slug,
    icon: tool.icon,
    category: id,
    title: tools[tool.slug].shortTitle,
    description: tools[tool.slug].description,
    path: `/${lang}/${TOOL_SLUGS[tool.slug][lang]}`,
  }));
  return {
    id,
    name: category.name,
    title,
    description: category.blurb,
    path,
    items,
    schemas: toolHubSchemas({
      name: title,
      path,
      description: category.blurb,
      lang: LOCALES[lang].htmlLang,
      items: items.map((item) => ({ name: item.title, path: item.path })),
      breadcrumb: [{ name: chrome.home, path: '/' }, { name: category.name, path }],
    }),
  };
};

/**
 * Build-time guard: a category slug shares its URL space with the tool slugs
 * (/de/<slug>), so a clash would silently shadow a tool, and a duplicate
 * would silently merge two hubs.
 */
export const assertCategorySlugs = (lang, categories) => {
  const taken = new Set(Object.values(TOOL_SLUGS).map((slugs) => slugs[lang]));
  const seen = new Set();
  Object.entries(categories).forEach(([id, category]) => {
    if (!category.slug) return;
    if (!/^[a-z0-9-]+$/.test(category.slug)) throw new Error(`[categories] ${lang}/${id}: slug "${category.slug}" must be lowercase ASCII, digits and hyphens.`);
    if (taken.has(category.slug)) throw new Error(`[categories] ${lang}/${id}: slug "${category.slug}" is already a tool page (/${lang}/${category.slug}).`);
    if (seen.has(category.slug)) throw new Error(`[categories] ${lang}: slug "${category.slug}" is used by more than one category.`);
    seen.add(category.slug);
  });
};
