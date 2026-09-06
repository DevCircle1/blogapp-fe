/**
 * Writes dist/sitemap.xml at build time.
 *
 * Static routes and tool pages come from scripts/routes.mjs. Blog articles and
 * category pages are pulled from Supabase when credentials are present in the
 * build environment, so newly published posts appear in the sitemap on the next
 * deploy without anyone editing XML by hand.
 */
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { allRoutes, SITE_URL } from './routes.mjs';

/**
 * Netlify injects build environment variables directly; locally they live in
 * .env, which Vite reads but plain Node does not. Loading it here keeps a local
 * `npm run build` producing the same sitemap the deploy will.
 */
const loadEnvFile = async () => {
  try {
    const contents = await readFile('.env', 'utf8');
    for (const line of contents.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (!match) continue;
      const [, key, rawValue] = match;
      if (process.env[key]) continue;
      process.env[key] = rawValue.replace(/^["']|["']$/g, '');
    }
  } catch {
    /* No .env file present — rely on the environment as provided. */
  }
};

const today = new Date().toISOString().slice(0, 10);

const escapeXml = (value) => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

const fetchSupabase = async (table, query) => {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) return null;
  const response = await fetch(`${url}/rest/v1/${table}?${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) throw new Error(`${table}: ${response.status} ${response.statusText}`);
  return response.json();
};

const collectDynamicRoutes = async () => {
  const routes = [];
  try {
    const posts = await fetchSupabase('posts', 'select=slug,category_id,created_at,updated_at&status=eq.approved&order=created_at.desc&limit=5000');
    if (posts === null) {
      console.warn('[sitemap] Supabase credentials not set — blog URLs omitted from this build.');
      return routes;
    }
    posts.forEach((post) => {
      if (!post.slug) return;
      routes.push({
        path: `/blogs/article/${post.slug}`,
        lastmod: (post.updated_at || post.created_at || today).slice(0, 10),
        changefreq: 'monthly',
        priority: '0.7',
      });
    });

    // A category with no approved posts renders as noindex, so listing it here
    // would submit a URL we have asked Google not to index.
    const populated = new Set(posts.map((post) => String(post.category_id)));
    const categories = await fetchSupabase('categories', 'select=id,slug&limit=500');
    const listed = (categories || []).filter((category) => category.slug && populated.has(String(category.id)));
    listed.forEach((category) => {
      routes.push({ path: `/blogs/category/${category.slug}`, lastmod: today, changefreq: 'weekly', priority: '0.6' });
    });

    console.log(`[sitemap] Added ${posts.length} articles and ${listed.length} non-empty categories from Supabase.`);
  } catch (error) {
    // A sitemap missing blog URLs is far better than a failed deploy.
    console.warn(`[sitemap] Could not load blog URLs: ${error.message}`);
  }
  return routes;
};

const run = async () => {
  await loadEnvFile();
  const dynamic = await collectDynamicRoutes();
  const entries = [
    ...allRoutes.map((route) => ({ ...route, lastmod: today })),
    ...dynamic,
  ];

  const seen = new Set();
  const unique = entries.filter((entry) => {
    if (seen.has(entry.path)) return false;
    seen.add(entry.path);
    return true;
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...unique.map((entry) => [
      '  <url>',
      `    <loc>${escapeXml(SITE_URL + (entry.path === '/' ? '/' : entry.path))}</loc>`,
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
  console.log(`[sitemap] Wrote dist/sitemap.xml with ${unique.length} URLs.`);
};

run().catch((error) => {
  console.error('[sitemap] Failed:', error);
  process.exit(1);
});
