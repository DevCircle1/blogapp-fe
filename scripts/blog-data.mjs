/**
 * Build-time snapshot of the blog: every published post and every category,
 * fetched once from Supabase and written to dist-ssr/blog-data.json. The
 * sitemap, the prerender (which renders every post, category and guide index
 * from it and seeds each page with it) and the verify step all read this one
 * file, so they can never disagree about what exists.
 *
 * Uses the publishable (anon) key over the REST API, so row-level security
 * applies exactly as it does for a visitor. Never give it the service-role key.
 *
 * Fails the build — rather than shipping empty blog pages — when the
 * credentials are missing, a request fails, or no published post comes back.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseHTML } from 'linkedom';
import { sanitiseHtml } from '../src/lib/blog/sanitize.js';

export const BLOG_DATA_FILE = path.join('dist-ssr', 'blog-data.json');

// Only what the pages render. select=* would also carry columns such as
// author_id into every page's embedded data for no reason.
const POST_FIELDS = [
  'id', 'slug', 'title', 'content', 'excerpt', 'featured_image', 'created_at', 'updated_at',
  'category_id', 'status', 'author_name', 'language', 'translation_key',
];

/**
 * Netlify injects build environment variables directly; locally they live in
 * .env, which Vite reads but plain Node does not.
 */
export const loadEnvFile = async () => {
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

const fetchTable = async (table, query) => {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const response = await fetch(`${url}/rest/v1/${table}?${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) throw new Error(`${table}: ${response.status} ${response.statusText} ${await response.text()}`);
  return response.json();
};

/** The snapshot written by this script; throws if the build step did not run. */
export const readBlogData = async () => {
  try {
    return JSON.parse(await readFile(BLOG_DATA_FILE, 'utf8'));
  } catch (error) {
    throw new Error(`${BLOG_DATA_FILE} is missing or unreadable (run \`npm run blog:data\` first): ${error.message}`);
  }
};

const run = async () => {
  await loadEnvFile();
  if (!process.env.VITE_SUPABASE_URL || !process.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
    throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY must be set: the blog cannot be prerendered without them.');
  }

  const [rows, categories] = await Promise.all([
    // Selected with * and trimmed below, so a database without the newer
    // columns (language, translation_key, author_name, excerpt) still works.
    fetchTable('posts', 'select=*&status=eq.approved&order=created_at.desc&limit=10000'),
    fetchTable('categories', 'select=*&order=name&limit=1000'),
  ]);
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('Supabase returned 0 published posts. Refusing to build a site with empty blog pages.');
  }

  const { document } = parseHTML('<!doctype html><html><head></head><body></body></html>');
  // content stays as stored, because excerpts and reading times must be
  // computed from exactly what the browser gets when it refetches; html is
  // the sanitised body the post page renders.
  const posts = rows.map((row) => {
    const post = Object.fromEntries(POST_FIELDS.filter((field) => field in row).map((field) => [field, row[field]]));
    return { ...post, html: sanitiseHtml(post.content, document) };
  });
  const missing = posts.filter((post) => !post.slug || !post.title || !post.html);
  if (missing.length) {
    throw new Error(`${missing.length} published post(s) have no slug, title or body (ids: ${missing.map((post) => post.id).join(', ')}).`);
  }

  await mkdir(path.dirname(BLOG_DATA_FILE), { recursive: true });
  await writeFile(BLOG_DATA_FILE, JSON.stringify({ posts, categories }), 'utf8');
  console.log(`[blog-data] ${posts.length} published posts and ${categories.length} categories from Supabase.`);
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch((error) => {
    console.error(`[blog-data] Failed: ${error.message}`);
    process.exit(1);
  });
}
