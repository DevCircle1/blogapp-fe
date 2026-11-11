/**
 * Build guard over the pages Next prerendered (.next/server/app/**.html). Fails
 * the build (exit 1) if any page would ship a loading state or a broken tool.
 * Runs as the `postbuild` step.
 *
 * The failure this exists for is invisible: a page whose server render fell back
 * to client rendering looks correct to a human, because the browser fills it in a
 * moment later. Only a check on the static HTML itself catches it.
 *
 * Every tool in the catalogue, in every language (English plus each localized
 * one), must have a page whose HTML contains the tool's own interactive root: a
 * <section data-tool-root="<slug>"> with at least one real form control inside.
 * Every page must additionally be free of client-render markers, must have a
 * heading, and must have exactly one <title>, description and canonical (its own
 * URL).
 *
 * The blog (scripts/blog-pages.mjs) must be in the static HTML, not fetched
 * after load: every post page carries its title, its complete article body and
 * BlogPosting JSON-LD; the homepage, /blogs, category pages and guide indexes
 * carry their post titles and real links. No page may link to a blog URL that
 * has no page, and every sitemap URL must have one.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { allRoutes, CONTENT, SITE_URL } from './routes.mjs';
import {
  ALL_LANGS, BLOG_SEGMENTS, LOCALIZED_LANGS, blogPath, hubPath, toolPath, hasToolTranslation,
} from '../src/i18n/locales.js';
import { categoryHubs, toolBreadcrumb } from '../src/i18n/categories.js';
import { premiumTools } from '../src/components/tools/toolCatalog.js';
import { REMOVED_PATHS } from './removed-paths.mjs';
import { readBlogData } from './blog-data.mjs';
import { blogPages } from './blog-pages.mjs';

// Next writes each prerendered page as <route>.html (the home page as index.html).
const DIST = path.join('.next', 'server', 'app');
const SITEMAP = path.join('public', 'sitemap.xml');
const CONTROL = /<(textarea|input|select|button)\b/;

// What a page must never contain: Next's marker for a page that gave up on
// server rendering, and the markers React leaves when a boundary was abandoned
// to client rendering or streamed in late (an inline completion script or a
// hidden segment).
const FORBIDDEN = [
  ['client-side rendering bailout', 'BAILOUT_TO_CLIENT_SIDE_RENDERING'],
  ['client-render boundary marker', '<!--$!-->'],
  ['pending boundary marker', '<!--$?-->'],
  ['streamed segment', '<template id="B:'],
  ['streamed completion script', '$RC('],
  ['streamed error script', '$RX('],
];

// Pages that intentionally render part of themselves in the browser only: the Quill
// editor needs the DOM, so next/dynamic({ ssr: false }) leaves a client-render boundary
// (with a placeholder) where the editor goes. The rest of the page is in the static HTML.
const CLIENT_ONLY_BOUNDARY = new Set(['/text-to-html']);

const fileFor = (routePath) => (routePath === '/' ? path.join(DIST, 'index.html') : path.join(DIST, `${routePath}.html`));

const toolSection = (html, slug) => {
  const open = html.search(new RegExp(`<section\\b[^>]*data-tool-root="${slug}"[^>]*>`));
  if (open === -1) return null;
  const close = html.indexOf('</section>', open);
  return close === -1 ? null : html.slice(open, close);
};

const problems = [];
const problem = (routePath, message) => problems.push(`${routePath}: ${message}`);

const blog = blogPages(await readBlogData());
const routes = [...allRoutes, ...blog.routes];
const generated = new Set(routes.map((route) => route.path));

// Text as React writes it into HTML, for finding a title in the markup.
const asHtmlText = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
const count = (html, needle) => html.split(needle).length - 1;

// Internal URLs that only exist as blog pages: a link to one must have a page.
const sitePath = (href) => href.slice(href.startsWith(SITE_URL) ? SITE_URL.length : 0).split(/[?#]/)[0].replace(/(.)\/$/, '$1');
const isBlogUrl = (href) => {
  if (!href.startsWith('/') && !href.startsWith(SITE_URL)) return false;
  const target = sitePath(href);
  return target.startsWith('/blogs/article/') || target.startsWith('/blogs/category/')
    || Object.keys(BLOG_SEGMENTS).some((lang) => target === blogPath(lang) || target.startsWith(`${blogPath(lang)}/`));
};

const routeByPath = new Map(allRoutes.map((route) => [route.path, route]));
const toolRoutes = new Map();
for (const tool of premiumTools) {
  toolRoutes.set(`/tools/${tool.slug}`, tool.slug);
  ALL_LANGS.filter((lang) => lang !== 'en' && hasToolTranslation(lang, tool.slug)).forEach((lang) => toolRoutes.set(toolPath(lang, tool.slug), tool.slug));
}
for (const routePath of toolRoutes.keys()) {
  if (!routeByPath.has(routePath)) problem(routePath, 'is a catalogue tool page but is not in the route list, so no page was generated');
}

// A removed feature (scripts/removed-paths.mjs) must leave no trace: no
// internal link to it on any page and nothing in the sitemap. Having no route at
// all, every one of its URLs answers the global 404.
const linksToRemoved = (href) => {
  if (!href.startsWith('/') && !href.startsWith(SITE_URL)) return false;
  const target = href.slice(href.startsWith(SITE_URL) ? SITE_URL.length : 0).split(/[?#]/)[0].replace(/(.)\/$/, '$1');
  return REMOVED_PATHS.some((pattern) => (pattern.endsWith('/*') ? target.startsWith(pattern.slice(0, -1)) : target === pattern));
};
{
  const sitemap = await readFile(SITEMAP, 'utf8').catch(() => '');
  if (!sitemap) problem('/sitemap.xml', `is missing (${SITEMAP}); it is written by \`npm run sitemap\`, which the prebuild step runs`);
  for (const [, loc] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    if (linksToRemoved(loc)) problem('/sitemap.xml', `lists ${loc}, which belongs to a removed feature`);
    if (!generated.has(sitePath(loc) || '/')) problem('/sitemap.xml', `lists ${loc}, which has no generated page`);
  }
  // Removed features and unknown blog URLs have no route at all, so they are unmatched
  // and answered with a real 404 by src/app/global-not-found.jsx (noindex, no canonical).
  const notFound = await readFile(path.join(DIST, '_not-found.html'), 'utf8').catch(() => '');
  if (!notFound.includes('noindex') || notFound.includes('rel="canonical"')) {
    problem('/404', 'the global not-found page is missing, or is not noindex without a canonical');
  }
}

let checkedTools = 0;
let checkedBlog = 0;
for (const route of routes) {
  let html;
  try {
    html = await readFile(fileFor(route.path), 'utf8');
  } catch {
    problem(route.path, `no generated file at ${fileFor(route.path)}`);
    continue;
  }

  if (html.includes('\0')) problem(route.path, 'contains a NUL byte');
  // A value that was meant to be a string and was not. The classic case after the move to
  // Next: `import logo from './logo.png'` is an object there, so <img src={logo}> renders
  // src="[object Object]" and the browser requests a URL that 404s on every page.
  for (const [, attribute, value] of html.matchAll(/\s(src|href|srcSet|poster|action)="([^"]*\[object Object\][^"]*|undefined|null)"/g)) {
    problem(route.path, `${attribute}="${value}" is not a real URL`);
  }
  for (const [, href] of html.matchAll(/href="([^"]+)"/g)) {
    if (linksToRemoved(href)) problem(route.path, `links to ${href}, which belongs to a removed feature`);
    else if (isBlogUrl(href) && !generated.has(sitePath(href))) problem(route.path, `links to ${href}, which has no page (it answers 404)`);
  }

  // One of each, and the canonical is this page's own URL.
  const head = html.slice(0, html.indexOf('</head>'));
  [['<title', '<title>'], ['name="description"', 'meta description'], ['rel="canonical"', 'canonical']].forEach(([needle, label]) => {
    const found = count(head, needle);
    if (found !== 1) problem(route.path, `has ${found} ${label} tags in <head> (expected 1)`);
  });
  const canonical = head.match(/rel="canonical" href="([^"]+)"/)?.[1];
  const ownUrl = `${SITE_URL}${route.path === '/' ? '/' : route.path}`;
  if (canonical && canonical !== ownUrl) problem(route.path, `canonical is ${canonical}, expected ${ownUrl}`);

  const expected = blog.expect.get(route.path);
  if (expected) {
    checkedBlog += 1;
    const body = html.slice(html.indexOf('<body'));
    expected.texts.forEach((text) => {
      if (!body.includes(asHtmlText(text))) problem(route.path, `does not contain "${text}" in its static HTML`);
    });
    expected.links.forEach((link) => {
      if (!body.includes(`href="${link}"`)) problem(route.path, `does not link to ${link}`);
    });
    if (expected.body && !body.includes(expected.body)) problem(route.path, 'does not contain the complete article body');
    if (expected.article) {
      const title = expected.texts[0];
      // JSON-LD is rendered in the body (see src/components/common/Seo.jsx), not hoisted into <head>.
      const posting = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/g)]
        .map(([, json]) => { try { return JSON.parse(json); } catch { return null; } })
        .find((schema) => schema?.['@type'] === 'BlogPosting');
      if (!posting) problem(route.path, 'has no BlogPosting JSON-LD');
      else if (posting.headline !== title || !posting.datePublished || !posting.dateModified || !posting.author?.name) {
        problem(route.path, 'BlogPosting JSON-LD lacks headline, datePublished, dateModified or author');
      }
      if (!head.includes(`<title>${asHtmlText(title)}`)) problem(route.path, 'the <title> is not the post title');
    }
  }

  FORBIDDEN.forEach(([what, needle]) => {
    if (CLIENT_ONLY_BOUNDARY.has(route.path) && needle === '<!--$!-->') return;
    if (html.includes(needle)) problem(route.path, `contains a ${what} (${needle})`);
  });
  if (!/<h1[\s>]/.test(html)) problem(route.path, 'has no <h1>');

  const slug = toolRoutes.get(route.path);
  if (slug) {
    checkedTools += 1;
    const section = toolSection(html, slug);
    if (!section) problem(route.path, `has no <section data-tool-root="${slug}">, so the tool is not in the static HTML`);
    else if (!CONTROL.test(section)) problem(route.path, `data-tool-root="${slug}" contains no textarea, input, select or button`);
  }
}

/* ------------------------------------------------- category hubs (per language) */
const read = (routePath) => readFile(fileFor(routePath), 'utf8').catch(() => null);
const mainOf = (html) => {
  const start = html.indexOf('<main');
  return start === -1 ? '' : html.slice(start, html.indexOf('</main>', start));
};
const hrefsIn = (html) => [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1]);
let hubCount = 0;
let breadcrumbCount = 0;
const hubLanguages = [];

for (const lang of LOCALIZED_LANGS) {
  const content = CONTENT[lang];
  const hubs = categoryHubs(lang, content);
  const langTools = premiumTools.filter((tool) => content.tools[tool.slug]);

  if (hubs.length) {
    hubLanguages.push(lang);
    // The directory page must lead with the hubs: every hub link comes before the first tool link.
    const directory = await read(hubPath(lang));
    const directoryMain = directory ? mainOf(directory) : '';
    const directoryLinks = hrefsIn(directoryMain);
    const firstTool = Math.min(...langTools.map((tool) => directoryLinks.indexOf(toolPath(lang, tool.slug))).filter((index) => index >= 0));
    hubs.forEach((hub) => {
      const at = directoryLinks.indexOf(hub.path);
      if (at === -1) problem(hubPath(lang), `does not link the ${hub.name} hub (${hub.path})`);
      else if (at > firstTool) problem(hubPath(lang), `links the ${hub.name} hub after the first tool link, so it is not the primary navigation`);
    });

    for (const hub of hubs) {
      hubCount += 1;
      const html = await read(hub.path);
      if (!html) continue;
      // Exactly this category's tools (plus the way back to the directory), nothing from other categories.
      const expected = new Set(langTools.filter((tool) => tool.category === hub.id).map((tool) => toolPath(lang, tool.slug)));
      const found = new Set(hrefsIn(mainOf(html)));
      expected.forEach((href) => { if (!found.has(href)) problem(hub.path, `is missing its tool ${href}`); });
      langTools.filter((tool) => tool.category !== hub.id).forEach((tool) => {
        if (found.has(toolPath(lang, tool.slug))) problem(hub.path, `lists ${toolPath(lang, tool.slug)}, which belongs to another category`);
      });
      if (!expected.size) problem(hub.path, 'has no tools');
      if (/rel="alternate" hreflang/i.test(html)) problem(hub.path, 'has hreflang alternates, but the hub exists in one language only');
      const trail = html.match(/"@type":"BreadcrumbList","itemListElement":(\[.*?\])\}/)?.[1];
      const names = trail ? JSON.parse(trail).map((item) => item.name) : [];
      if (names.length !== 2 || names[1] !== hub.name) problem(hub.path, `BreadcrumbList should be Home > ${hub.name} (two levels), found: ${names.join(' > ') || 'none'}`);
    }
  }

  // Every tool page's visible breadcrumb and BreadcrumbList follow the shared trail.
  for (const tool of langTools) {
    const path = toolPath(lang, tool.slug);
    const html = await read(path);
    if (!html) continue;
    breadcrumbCount += 1;
    const trail = toolBreadcrumb(lang, content, { ...tool, ...content.tools[tool.slug] }, path);
    const navStart = html.indexOf(`<nav aria-label="${content.chrome.breadcrumb}"`);
    const nav = navStart === -1 ? '' : html.slice(navStart, html.indexOf('</nav>', navStart));
    if (!nav) { problem(path, 'has no breadcrumb nav'); continue; }
    if (!nav.includes(`href="${trail[1].path}"`)) problem(path, `breadcrumb does not link ${trail[1].path}`);
    const ld = html.match(/"@type":"BreadcrumbList","itemListElement":(\[.*?\])\}/)?.[1];
    const items = ld ? JSON.parse(ld) : [];
    const expectedItems = trail.map((crumb) => (crumb.path === '/' ? `${SITE_URL}/` : `${SITE_URL}${crumb.path}`));
    if (items.length !== 3 || items.some((item, index) => item.item !== expectedItems[index])) {
      problem(path, `BreadcrumbList should be ${expectedItems.join(' > ')}, found: ${items.map((item) => item.item).join(' > ') || 'none'}`);
    }
    if (!hubs.length && !nav.includes(`href="${hubPath(lang)}"`)) problem(path, 'a language without hubs must keep its Tools breadcrumb level');

    // Related-tools row: no tool twice, and the language's pinned tool exactly once where it applies.
    const asideStart = html.indexOf('<aside');
    const related = asideStart === -1 ? [] : hrefsIn(html.slice(asideStart, html.indexOf('</aside>', asideStart)));
    const repeated = related.filter((href, index) => related.indexOf(href) !== index);
    if (repeated.length) problem(path, `related-tools row repeats ${[...new Set(repeated)].join(', ')}`);
    const pinned = content.pinnedRelated;
    if (pinned && pinned.slug !== tool.slug && pinned.categories.includes(tool.category)) {
      const pinnedPath = toolPath(lang, pinned.slug);
      const occurrences = related.filter((href) => href === pinnedPath).length;
      if (occurrences !== 1) problem(path, `related-tools row should link ${pinnedPath} exactly once, found ${occurrences}`);
    }
  }
}

if (problems.length) {
  console.error(`[verify] ${problems.length} problem(s) in the generated pages:`);
  problems.slice(0, 60).forEach((line) => console.error(`  - ${line}`));
  if (problems.length > 60) console.error(`  ... and ${problems.length - 60} more`);
  process.exit(1);
}
console.log(`[verify] category hubs: ${hubCount} in ${hubLanguages.join(', ') || 'no language'}; ${breadcrumbCount} tool-page breadcrumbs checked.`);
console.log(`[verify] ${routes.length} pages OK: ${checkedTools} tool pages contain their interactive root, ${checkedBlog} blog pages contain their posts (${blog.routes.length} blog-only pages).`);
