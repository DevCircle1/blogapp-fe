/**
 * Build guard over the generated pages. Fails the build (exit 1) if any page
 * would ship a loading state or a broken tool.
 *
 * The failure this exists for is invisible: a page whose server render fell back
 * to a Suspense placeholder looks correct to a human, because the client render
 * fills it in a moment later. Only a check on the static HTML itself catches it.
 *
 * Every tool in the catalogue, in every language (English plus each localized
 * one), must have a page whose HTML contains the tool's own interactive root: a
 * <section data-tool-root="<slug>"> with at least one real form control inside.
 * Every page must additionally be free of loading fallbacks and of React's
 * client-render markers, must have a heading, and must be marked for hydration
 * unless it is a declared legacy route.
 */
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { allRoutes, CONTENT, SITE_URL } from './routes.mjs';
import { LEGACY_ROUTES } from './prerender-legacy.mjs';
import {
  ALL_LANGS, LOCALIZED_LANGS, hubPath, toolPath,
} from '../src/i18n/locales.js';
import { categoryHubs, toolBreadcrumb } from '../src/i18n/categories.js';
import { premiumTools } from '../src/components/tools/toolCatalog.js';

const DIST = 'dist';
const CONTROL = /<(textarea|input|select|button)\b/;

// What a page must never contain: the app's loading placeholder, and the
// markers React leaves when a boundary was abandoned to client rendering or
// streamed in late (an inline completion script or a hidden segment).
const FORBIDDEN = [
  ['loading fallback', 'aria-label="Loading page"'],
  ['client-render boundary marker', '<!--$!-->'],
  ['pending boundary marker', '<!--$?-->'],
  ['streamed segment', '<template id="B:'],
  ['streamed completion script', '$RC('],
  ['streamed error script', '$RX('],
];

const fileFor = (routePath) => (routePath === '/' ? path.join(DIST, 'index.html') : path.join(DIST, `${routePath}.html`));

const toolSection = (html, slug) => {
  const open = html.search(new RegExp(`<section\\b[^>]*data-tool-root="${slug}"[^>]*>`));
  if (open === -1) return null;
  const close = html.indexOf('</section>', open);
  return close === -1 ? null : html.slice(open, close);
};

const problems = [];
const problem = (routePath, message) => problems.push(`${routePath}: ${message}`);

const routeByPath = new Map(allRoutes.map((route) => [route.path, route]));
const toolRoutes = new Map();
for (const tool of premiumTools) {
  toolRoutes.set(`/tools/${tool.slug}`, tool.slug);
  ALL_LANGS.filter((lang) => lang !== 'en').forEach((lang) => toolRoutes.set(toolPath(lang, tool.slug), tool.slug));
}
for (const routePath of toolRoutes.keys()) {
  if (!routeByPath.has(routePath)) problem(routePath, 'is a catalogue tool page but is not in the route list, so no page was generated');
}

let checkedTools = 0;
let exempt = 0;
const exemptTools = [];
for (const route of allRoutes) {
  let html;
  try {
    html = await readFile(fileFor(route.path), 'utf8');
  } catch {
    problem(route.path, `no generated file at ${fileFor(route.path)}`);
    continue;
  }

  const rootStart = html.indexOf('<div id="root"');
  const rootTag = rootStart === -1 ? '' : html.slice(rootStart, html.indexOf('>', rootStart) + 1);
  if (rootStart === -1 || html.slice(rootStart + rootTag.length, rootStart + rootTag.length + 6) === '</div>') {
    problem(route.path, '#root is missing or empty');
    continue;
  }

  const legacy = LEGACY_ROUTES.has(route.path);
  if (legacy) {
    exempt += 1;
    if (rootTag.includes('data-ssr-rendered')) problem(route.path, 'legacy markup must not be marked for hydration');
    if (toolRoutes.has(route.path)) exemptTools.push(route.path);
    continue;
  }

  if (!rootTag.includes('data-ssr-rendered="true"')) problem(route.path, 'not marked data-ssr-rendered, so it would be replaced rather than hydrated');
  FORBIDDEN.forEach(([what, needle]) => {
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
      if (html.includes('rel="alternate" hreflang')) problem(hub.path, 'has hreflang alternates, but the hub exists in one language only');
      const trail = html.match(/"@type":"BreadcrumbList","itemListElement":(\[.*?\])\}/)?.[1];
      const names = trail ? JSON.parse(trail).map((item) => item.name) : [];
      if (names.length !== 2 || names[1] !== hub.name) problem(hub.path, `BreadcrumbList should be Home > ${hub.name} (two levels), found: ${names.join(' > ') || 'none'}`);
    }
  }

  // Every tool page's visible breadcrumb and BreadcrumbList follow the shared trail.
  for (const tool of langTools) {
    const path = toolPath(lang, tool.slug);
    if (LEGACY_ROUTES.has(path)) continue;
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
if (exemptTools.length) console.warn(`[verify] ${exemptTools.length} tool pages are EXEMPT from the interactive-root check as legacy routes (see scripts/prerender-legacy.mjs): ${[...new Set(exemptTools.map((p) => toolRoutes.get(p)))].join(', ')}`);
console.log(`[verify] category hubs: ${hubCount} in ${hubLanguages.join(', ') || 'no language'}; ${breadcrumbCount} tool-page breadcrumbs checked.`);
console.log(`[verify] ${allRoutes.length} pages OK: ${checkedTools} tool pages contain their interactive root, ${allRoutes.length - exempt} hydrate, ${exempt} legacy.`);
