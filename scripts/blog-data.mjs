/**
 * Build-time snapshot of the blog, written to .blog-data/blog-data.json for the
 * scripts that run outside Next: the sitemap generator and the verify step.
 * (The site itself reads the same data through src/app/_lib/blogSite.js.)
 *
 * The fetch, sanitising and validation live in src/lib/blog/server.js, so the
 * pages, the sitemap and verify can never disagree about what exists. Fails the
 * build — rather than shipping empty blog pages — when the credentials are
 * missing, a request fails, or no published post comes back.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { fetchBlogSnapshot } from '../src/lib/blog/server.js';

export const BLOG_DATA_FILE = path.join('.blog-data', 'blog-data.json');

/**
 * Next loads .env itself, but these scripts run under plain Node, which does
 * not. Netlify injects build environment variables directly.
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
  const snapshot = await fetchBlogSnapshot();
  await mkdir(path.dirname(BLOG_DATA_FILE), { recursive: true });
  await writeFile(BLOG_DATA_FILE, JSON.stringify(snapshot), 'utf8');
  console.log(`[blog-data] ${snapshot.posts.length} published posts and ${snapshot.categories.length} categories from Supabase.`);
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run().catch((error) => {
    console.error(`[blog-data] Failed: ${error.message}`);
    process.exit(1);
  });
}
