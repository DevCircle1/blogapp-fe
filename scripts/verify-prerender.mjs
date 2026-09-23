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
import { allRoutes } from './routes.mjs';
import { LEGACY_ROUTES } from './prerender-legacy.mjs';
import { ALL_LANGS, toolPath } from '../src/i18n/locales.js';
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

if (problems.length) {
  console.error(`[verify] ${problems.length} problem(s) in the generated pages:`);
  problems.slice(0, 60).forEach((line) => console.error(`  - ${line}`));
  if (problems.length > 60) console.error(`  ... and ${problems.length - 60} more`);
  process.exit(1);
}
if (exemptTools.length) console.warn(`[verify] ${exemptTools.length} tool pages are EXEMPT from the interactive-root check as legacy routes (see scripts/prerender-legacy.mjs): ${[...new Set(exemptTools.map((p) => toolRoutes.get(p)))].join(', ')}`);
console.log(`[verify] ${allRoutes.length} pages OK: ${checkedTools} tool pages contain their interactive root, ${allRoutes.length - exempt} hydrate, ${exempt} legacy.`);
