/**
 * Writes dist/sitemap.xml at build time.
 *
 * Static routes and tool pages come from scripts/routes.mjs. Blog posts,
 * non-empty category pages and localized guide indexes come from the
 * build-time Supabase snapshot (scripts/blog-data.mjs) through
 * scripts/blog-pages.mjs — the same list the prerender writes pages for — so
 * newly published posts appear on the next deploy and the sitemap never lists
 * a URL without a page.
 */
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { allRoutes, SITE_URL } from './routes.mjs';
import { readBlogData } from './blog-data.mjs';
import { blogPages } from './blog-pages.mjs';

const today = new Date().toISOString().slice(0, 10);

/*
 * <lastmod> must be the date a page's content last changed, not the build
 * date: stamping every URL with today on each deploy teaches Google that our
 * lastmod is noise, and it then stops using it to schedule recrawls of the
 * pages that really did change. Blog posts carry updated_at from the database;
 * every other route is fingerprinted here and the fingerprint is compared with
 * the one recorded in LASTMOD_FILE. Only a changed fingerprint moves the date.
 *
 * Commit LASTMOD_FILE after a local build that changed it — a Netlify build
 * cannot write back to the repo, so an uncommitted change keeps re-dating
 * those pages to the deploy day until it is committed.
 */
const LASTMOD_FILE = new URL('./sitemap-lastmod.json', import.meta.url);
// Crawl hints, not content: changing them must not re-date a page.
const NON_CONTENT_KEYS = new Set(['priority', 'changefreq', 'lastmod']);

const fingerprint = (route) => createHash('sha1')
  .update(JSON.stringify(route, (key, value) => (NON_CONTENT_KEYS.has(key) ? undefined : value)))
  .digest('hex')
  .slice(0, 16);

const readLastmods = async () => {
  try {
    return JSON.parse(await readFile(LASTMOD_FILE, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return {};
    throw error;
  }
};

const datedRoutes = async (routes) => {
  const previous = await readLastmods();
  const next = {};
  let changed = 0;
  const dated = routes.map((route) => {
    const hash = fingerprint(route);
    const known = previous[route.path];
    const lastmod = known?.hash === hash ? known.lastmod : today;
    if (known?.hash !== hash) changed += 1;
    next[route.path] = { hash, lastmod };
    return { ...route, lastmod };
  });
  const sorted = Object.fromEntries(Object.keys(next).sort().map((path) => [path, next[path]]));
  await writeFile(LASTMOD_FILE, `${JSON.stringify(sorted, null, 2)}\n`, 'utf8');
  if (changed) console.log(`[sitemap] ${changed} route(s) changed content and were re-dated to ${today} — commit scripts/sitemap-lastmod.json.`);
  return dated;
};

const escapeXml = (value) => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const run = async () => {
  const blog = blogPages(await readBlogData());
  const entries = [
    ...await datedRoutes(allRoutes),
    ...blog.routes,
  ];

  const seen = new Set();
  const unique = entries.filter((entry) => {
    if (seen.has(entry.path)) return false;
    seen.add(entry.path);
    return true;
  });

  const absolute = (path) => escapeXml(SITE_URL + (path === '/' ? '/' : path));

  // hreflang is declared here as well as in each page's <head>: the sitemap
  // is often read before the pages themselves are crawled, so Google learns
  // about every language version of a tool from the first fetch.
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...unique.map((entry) => [
      '  <url>',
      `    <loc>${absolute(entry.path)}</loc>`,
      ...(entry.alternates || []).map((alternate) => (
        `    <xhtml:link rel="alternate" hreflang="${alternate.hreflang}" href="${absolute(alternate.path)}"/>`
      )),
      `    <lastmod>${entry.lastmod}</lastmod>`,
      `    <changefreq>${entry.changefreq || 'monthly'}</changefreq>`,
      `    <priority>${entry.priority || '0.5'}</priority>`,
      '  </url>',
    ].join('\n')),
    '</urlset>',
    '',
  ].join('\n');

  await mkdir('dist', { recursive: true });
  await writeFile('dist/sitemap.xml', xml, 'utf8');
  console.log(`[sitemap] Wrote dist/sitemap.xml with ${unique.length} URLs (${blog.routes.length} from the blog).`);
};

run().catch((error) => {
  console.error('[sitemap] Failed:', error);
  process.exit(1);
});
