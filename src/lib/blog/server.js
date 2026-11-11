/**
 * Server-side blog snapshot: every published post and every category, fetched
 * from Supabase and shaped for the pages. Plain ESM with no framework imports,
 * so the Next app (src/app/_lib/blogSite.js) and the build scripts (sitemap,
 * verify) read the blog through the same code and cannot disagree.
 *
 * Uses the publishable (anon) key over the REST API, so row-level security
 * applies exactly as it does for a visitor. Never give it a service-role key.
 */
import { parseHTML } from 'linkedom';
import { sanitiseHtml } from './sanitize.js';

// Only what the pages render. select=* would also carry columns such as
// author_id into every page's embedded data for no reason.
const POST_FIELDS = [
  'id', 'slug', 'title', 'content', 'excerpt', 'featured_image', 'created_at', 'updated_at',
  'category_id', 'status', 'author_name', 'language', 'translation_key',
];

// Literal property accesses, so Next can inline them; the VITE_ names are the
// fallback for scripts run with an old .env.
export const supabaseCredentials = () => ({
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL,
  key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
});

export const isBlogConfigured = () => {
  const { url, key } = supabaseCredentials();
  return Boolean(url && key);
};

const fetchTable = async (table, query, revalidate) => {
  const { url, key } = supabaseCredentials();
  const response = await fetch(`${url}/rest/v1/${table}?${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
    // Read by Next's data cache; plain Node (the build scripts) ignores it.
    next: { revalidate, tags: ['blog'] },
  });
  if (!response.ok) throw new Error(`${table}: ${response.status} ${response.statusText} ${await response.text()}`);
  return response.json();
};

/**
 * { posts, categories }. Each post carries `html`, the sanitised body the page
 * renders, next to `content`, the body as stored (excerpts and reading times
 * must be computed from exactly what the browser gets when it refetches).
 *
 * Throws when the credentials are missing, a request fails, a post has no slug,
 * title or body, or nothing is published: a deploy must fail rather than ship
 * empty blog pages, and a failed background revalidation keeps the last good page.
 */
export async function fetchBlogSnapshot({ revalidate = 300 } = {}) {
  if (!isBlogConfigured()) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be set: the blog cannot be rendered without them.');
  }

  const [rows, categories] = await Promise.all([
    // Selected with * and trimmed below, so a database without the newer
    // columns (language, translation_key, author_name, excerpt) still works.
    fetchTable('posts', 'select=*&status=eq.approved&order=created_at.desc&limit=10000', revalidate),
    fetchTable('categories', 'select=*&order=name&limit=1000', revalidate),
  ]);
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('Supabase returned 0 published posts. Refusing to render a site with empty blog pages.');
  }

  const { document } = parseHTML('<!doctype html><html><head></head><body></body></html>');
  const posts = rows.map((row) => {
    const post = Object.fromEntries(POST_FIELDS.filter((field) => field in row).map((field) => [field, row[field]]));
    return { ...post, html: sanitiseHtml(post.content, document) };
  });
  const missing = posts.filter((post) => !post.slug || !post.title || !post.html);
  if (missing.length) {
    throw new Error(`${missing.length} published post(s) have no slug, title or body (ids: ${missing.map((post) => post.id).join(', ')}).`);
  }
  return { posts, categories };
}
