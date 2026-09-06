/**
 * Emits a static HTML file for every known route.
 *
 * The site is a client-rendered SPA, so without this every URL is served the
 * same empty index.html: crawlers that do not execute JavaScript (social
 * unfurlers, most link previewers, and search engines on their first pass) see
 * one identical title and description for the whole site.
 *
 * Each generated file carries that route's real title, description, canonical
 * and Open Graph tags, plus a plain-HTML copy of the page's opening content.
 * React replaces the #root contents on mount, so what a visitor sees and what
 * a crawler reads describe the same page.
 *
 * Netlify serves an existing static file before applying the SPA fallback
 * redirect, so /tools/word-counter/index.html wins over /* -> /index.html.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { allRoutes, SITE_URL, SITE_NAME } from './routes.mjs';

const DIST = 'dist';
const OG_IMAGE = `${SITE_URL}/og-cover.png`;

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const headFor = (route) => {
  const canonical = `${SITE_URL}${route.path === '/' ? '/' : route.path}`;
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}">`,
    `<link rel="canonical" href="${canonical}">`,
    '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">',
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}">`,
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

/** Mirrors the top of the rendered page so a non-JS crawler reads the same thing. */
const bodyFor = (route) => {
  const parts = [
    `<h1>${escapeHtml(route.heading || route.title)}</h1>`,
    `<p>${escapeHtml(route.body || route.description)}</p>`,
  ];
  if (route.steps?.length) {
    parts.push('<h2>How to use it</h2>');
    parts.push(`<ol>${route.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join('')}</ol>`);
  }
  if (route.faqs?.length) {
    parts.push('<h2>Frequently asked questions</h2>');
    parts.push(route.faqs.map((item) => `<h3>${escapeHtml(item.q)}</h3><p>${escapeHtml(item.a)}</p>`).join(''));
  }
  parts.push('<p><a href="/tools">All free tools</a> &middot; <a href="/blogs">Blog</a> &middot; <a href="/about-us">About</a> &middot; <a href="/contact-us">Contact</a></p>');
  return parts.join('\n      ');
};

const run = async () => {
  const template = await readFile(path.join(DIST, 'index.html'), 'utf8');

  // app.html is the neutral shell Netlify rewrites unmatched paths to. It must
  // stay canonical-free and index-neutral, because genuinely dynamic routes
  // (blog articles, category pages) are served from it and set their own tags
  // once React mounts. Writing it first, before index.html is overwritten with
  // the prerendered homepage.
  await writeFile(path.join(DIST, 'app.html'), template, 'utf8');

  // Strip the tags the template already carries so each page has exactly one.
  const base = template
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+name="description"[^>]*>\s*/i, '')
    .replace(/<meta\s+property="og:image"[^>]*>\s*/i, '')
    .replace(/<meta\s+property="og:site_name"[^>]*>\s*/i, '')
    .replace(/<meta\s+name="twitter:card"[^>]*>\s*/i, '');

  let written = 0;
  for (const route of allRoutes) {
    const html = base
      .replace('</head>', `  ${headFor(route)}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">\n      ${bodyFor(route)}\n    </div>`);

    // Written as "<route>.html" rather than "<route>/index.html": Netlify
    // resolves /tools/word-counter to tools/word-counter.html and serves it
    // directly, whereas the directory form is redirected to a trailing-slash
    // URL, which would disagree with the canonical tag inside the page.
    const outFile = route.path === '/'
      ? path.join(DIST, 'index.html')
      : path.join(DIST, `${route.path}.html`);
    await mkdir(path.dirname(outFile), { recursive: true });
    await writeFile(outFile, html, 'utf8');
    written += 1;
  }

  console.log(`[prerender] Wrote ${written} static HTML pages plus the app.html fallback shell.`);
};

run().catch((error) => {
  console.error('[prerender] Failed:', error);
  process.exit(1);
});
