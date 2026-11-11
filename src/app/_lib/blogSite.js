import { fetchBlogSnapshot, isBlogConfigured } from '../../lib/blog/server.js';
import { blogPages } from '../../../scripts/blog-pages.mjs';

/**
 * The blog as the server renders it: the Supabase snapshot plus everything
 * derived from it (per-page seeds, sitemap-style route list, guide index).
 * Memoised for a few minutes because one render touches it several times
 * (static params, the page, its seed); freshness across deploys is handled by
 * each page's `revalidate`, which re-runs this after the window.
 */
const TTL_MS = 5 * 60 * 1000;
let cached = null;

async function load() {
  if (!isBlogConfigured() && process.env.NODE_ENV !== 'production') {
    console.warn('[blog] Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY): blog pages are empty in development.');
    const snapshot = { posts: [], categories: [] };
    return { ...snapshot, pages: blogPages(snapshot) };
  }
  const snapshot = await fetchBlogSnapshot({ revalidate: TTL_MS / 1000 });
  return { ...snapshot, pages: blogPages(snapshot) };
}

export function getBlogSite() {
  if (!cached || Date.now() - cached.at > TTL_MS) {
    const entry = { at: Date.now(), promise: null };
    entry.promise = load().catch((error) => {
      // Do not memoise a failure: the next render retries.
      if (cached === entry) cached = null;
      throw error;
    });
    cached = entry;
  }
  return cached.promise;
}

/** What a page at `path` renders with (src/context/seed.js), or {} if the blog has nothing for it. */
export async function getPageSeed(path) {
  const { pages } = await getBlogSite();
  const seed = pages.seeds.get(path);
  const guides = pages.guidesFor(path);
  return guides.length ? { ...seed, [`guides:${path}`]: guides } : (seed ?? {});
}

/** True when the blog generated a page for this path (a post, a non-empty category, a guide index). */
export async function hasBlogPage(path) {
  const { pages } = await getBlogSite();
  return pages.routes.some((route) => route.path === path);
}

export async function findPost(slug) {
  const { posts } = await getBlogSite();
  return posts.find((post) => post.slug === slug);
}
