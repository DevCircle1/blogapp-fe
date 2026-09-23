/**
 * Emits a static HTML file for every known route, with the page rendered by
 * the real React tree.
 *
 * Each file carries that route's title, description, canonical, hreflang
 * cluster, language, Open Graph tags and JSON-LD in <head> (headFor below),
 * and the server-rendered app — navbar, page, footer — inside #root. React
 * hydrates that markup on load (src/main.jsx), so what a crawler reads and what
 * a visitor sees are the same document, tool included.
 *
 * The server render is src/entry-server.jsx, built by
 * `vite build --ssr src/entry-server.jsx --outDir dist-ssr` (npm run build does
 * this first). Routes in LEGACY_ROUTES cannot be rendered yet and still get the
 * old hand-written markup from prerender-legacy.mjs.
 *
 * Every route is rendered before any file is written, and one that fails
 * (including a boundary that errored and would have shipped as a loading
 * fallback) fails the whole run, so no partial output is ever left behind.
 *
 * Idempotent: each page is rebuilt from the pristine shell in dist/app.html
 * (written on the first run), never from a previously generated page.
 *
 * Netlify serves an existing static file before applying the SPA fallback
 * redirect, so /tools/word-counter.html wins over /* -> /index.html.
 */
import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';
import { allRoutes, SITE_URL, SITE_NAME } from './routes.mjs';
import { LOCALES } from '../src/i18n/locales.js';
import { escapeHtml } from './html.mjs';
import { LEGACY_ROUTES, legacyRootHtml } from './prerender-legacy.mjs';
import { render } from '../dist-ssr/entry-server.js';

const DIST = 'dist';
const OG_IMAGE = `${SITE_URL}/og-cover.png`;
const ROOT_PLACEHOLDER = '<div id="root"></div>';

const absolute = (routePath) => `${SITE_URL}${routePath === '/' ? '/' : routePath}`;

const headFor = (route) => {
  const canonical = absolute(route.path);
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const locale = LOCALES[route.lang || 'en'];
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}">`,
    `<link rel="canonical" href="${canonical}">`,
    // Every version of the page lists every other, plus itself and
    // x-default — the same cluster the page's <Seo> emits at runtime.
    ...(route.alternates || []).map((alternate) => (
      `<link rel="alternate" hreflang="${alternate.hreflang}" href="${absolute(alternate.path)}">`
    )),
    '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">',
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}">`,
    `<meta property="og:locale" content="${locale.ogLocale}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${canonical}">`,
    '<meta property="og:type" content="website">',
    `<meta property="og:image" content="${OG_IMAGE}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${title}">`,
    `<meta name="twitter:description" content="${description}">`,
    `<meta name="twitter:image" content="${OG_IMAGE}">`,
    // Static JSON-LD, so structured data does not depend on the crawler
    // running JavaScript. "</" is escaped because an unescaped closing tag
    // inside a string would terminate the script element early.
    ...(route.schemas || []).map((schema) => (
      `<script type="application/ld+json" data-prerendered="true">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`
    )),
  ].join('\n    ');
};

const exists = (file) => access(file).then(() => true, () => false);

const run = async () => {
  // app.html is the neutral shell Netlify rewrites unmatched paths to. It must
  // stay canonical-free and index-neutral, because genuinely dynamic routes
  // (blog articles, category pages) are served from it and set their own tags
  // once React mounts. It is also this script's pristine input: the first run
  // saves it, later runs read it, so index.html (overwritten below with the
  // prerendered homepage) is never mistaken for the template.
  const shellFile = path.join(DIST, 'app.html');
  if (!(await exists(shellFile))) {
    await writeFile(shellFile, await readFile(path.join(DIST, 'index.html'), 'utf8'), 'utf8');
  }
  const template = await readFile(shellFile, 'utf8');

  // Strip the tags the template already carries so each page has exactly one.
  const base = template
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+name="description"[^>]*>\s*/i, '')
    .replace(/<meta\s+property="og:image"[^>]*>\s*/i, '')
    .replace(/<meta\s+property="og:site_name"[^>]*>\s*/i, '')
    .replace(/<meta\s+name="twitter:card"[^>]*>\s*/i, '');

  if (!base.includes('<html lang="en">')) {
    throw new Error('The shell no longer contains <html lang="en">; update the language substitution below.');
  }
  if (!base.includes(ROOT_PLACEHOLDER)) {
    throw new Error(`The shell no longer contains ${ROOT_PLACEHOLDER}; nothing to render into.`);
  }

  // Render everything first; write only if every route succeeded.
  const pages = [];
  const failures = [];
  for (const route of allRoutes) {
    try {
      // data-ssr-rendered tells src/main.jsx this markup came from the real
      // component tree and can be hydrated in place. Legacy markup does not
      // match that tree, so it stays unmarked and is replaced instead.
      const root = LEGACY_ROUTES.has(route.path)
        ? `<div id="root">${legacyRootHtml(route)}</div>`
        : `<div id="root" data-ssr-rendered="true">${await render(route.path)}</div>`;
      pages.push({ route, root });
    } catch (error) {
      failures.push({ path: route.path, message: String(error?.message || error).split('\n')[0] });
    }
  }
  if (failures.length) {
    failures.forEach((failure) => console.error(`[prerender] ${failure.path}: ${failure.message}`));
    throw new Error(`${failures.length} route(s) failed to render; nothing was written.`);
  }

  for (const { route, root } of pages) {
    const html = base
      .replace('<html lang="en">', `<html lang="${LOCALES[route.lang || 'en'].htmlLang}">`)
      .replace('</head>', () => `  ${headFor(route)}\n  </head>`)
      .replace(ROOT_PLACEHOLDER, () => root);

    // Written as "<route>.html" rather than "<route>/index.html": Netlify
    // resolves /tools/word-counter to tools/word-counter.html and serves it
    // directly, whereas the directory form is redirected to a trailing-slash
    // URL, which would disagree with the canonical tag inside the page.
    const outFile = route.path === '/'
      ? path.join(DIST, 'index.html')
      : path.join(DIST, `${route.path}.html`);
    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, html, 'utf8');
  }

  const legacy = pages.filter(({ route }) => LEGACY_ROUTES.has(route.path)).length;
  console.log(`[prerender] Wrote ${pages.length} pages (${pages.length - legacy} server-rendered, ${legacy} legacy) plus the app.html fallback shell.`);
  const byReason = new Map();
  pages.forEach(({ route }) => {
    if (LEGACY_ROUTES.has(route.path)) byReason.set(LEGACY_ROUTES.get(route.path), [...(byReason.get(LEGACY_ROUTES.get(route.path)) || []), route.path]);
  });
  byReason.forEach((paths, reason) => console.log(`[prerender]   legacy x${paths.length} (${paths.slice(0, 2).join(', ')}${paths.length > 2 ? ', ...' : ''}): ${reason}`));
};

run().catch((error) => {
  console.error('[prerender] Failed:', error);
  process.exit(1);
});
