/**
 * URLs of features that were removed from the site: Job Alerts and the
 * Ask Anything Q&A. They were indexed and linked in the past, so they must
 * keep answering with a real 404 instead of the SPA fallback's 200.
 *
 * Nothing in src/app routes to them, so they are unmatched URLs and answer the global 404
 * (src/app/global-not-found.jsx). scripts/verify-prerender.mjs fails the build if any page, or
 * the sitemap, links to one. Patterns use a trailing /* to cover every sub-path.
 */
export const REMOVED_PATHS = [
  '/job-alert', '/job-alert/*',
  '/ask-anything', '/ask-anything/*',
  '/create', '/create/*',
  '/q/*',
  '/my-answers', '/my-answers/*',
];
