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
import { writeFile, mkdir } from 'node:fs/promises';
import { allRoutes, SITE_URL } from './routes.mjs';
import { readBlogData } from './blog-data.mjs';
import { blogPages } from './blog-pages.mjs';

const today = new Date().toISOString().slice(0, 10);

const escapeXml = (value) => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const run = async () => {
  const blog = blogPages(await readBlogData());
  const entries = [
    ...allRoutes.map((route) => ({ ...route, lastmod: today })),
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
