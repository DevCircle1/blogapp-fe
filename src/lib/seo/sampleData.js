/**
 * A small, fictional Search Console dataset (example.com) that contains one
 * example of every problem the tools look for. Used by "Try sample data" so
 * the tools can be seen working before anyone uploads a real export.
 */
const r = (query, page, clicks, impressions, position) => ({
  query, page: `https://example.com${page}`, clicks, impressions, ctr: impressions ? clicks / impressions : 0, position,
});

export const SAMPLE_QUERY_PAGE = [
  // Cannibalized: two guides split one query.
  r('keyword research guide', '/blog/keyword-research', 60, 1200, 6.2),
  r('keyword research guide', '/guides/keyword-research-tips', 35, 900, 8.1),
  r('keyword research tips', '/blog/keyword-research', 22, 700, 7.4),
  r('keyword research tips', '/guides/keyword-research-tips', 31, 800, 6.9),
  // One page clearly leads; the second is a token appearance, not a problem.
  r('seo checklist', '/seo-checklist', 600, 5000, 3.0),
  r('seo checklist', '/blog/seo-checklist-2023', 2, 140, 14.0),
  // Brand query legitimately returns two URLs.
  r('example seo tool', '/', 900, 2000, 1.1),
  r('example seo tool', '/tools', 300, 800, 2.2),
  // Striking distance: page two, lots of impressions.
  r('how to write meta descriptions', '/blog/meta-descriptions', 40, 3200, 12.4),
  r('schema markup examples', '/blog/schema-markup', 25, 2100, 15.6),
  r('robots txt example', '/blog/robots-txt', 30, 1500, 11.3),
  // Low CTR for the position.
  r('what is a canonical url', '/blog/canonical-urls', 12, 2500, 4.1),
  r('page speed test', '/tools/page-speed', 0, 900, 5.5),
  // Healthy filler.
  r('seo audit template', '/templates/seo-audit', 210, 2600, 2.4),
  r('internal linking strategy', '/blog/internal-linking', 130, 2400, 3.6),
];

const agg = (rows, key) => {
  const map = new Map();
  rows.forEach((row) => {
    const entry = map.get(row[key]) || { [key]: row[key], clicks: 0, impressions: 0, weighted: 0 };
    entry.clicks += row.clicks;
    entry.impressions += row.impressions;
    entry.weighted += row.position * row.impressions;
    map.set(row[key], entry);
  });
  return [...map.values()].map((e) => ({
    [key]: e[key], clicks: e.clicks, impressions: e.impressions, ctr: e.impressions ? e.clicks / e.impressions : 0, position: e.weighted / e.impressions,
  }));
};

export const SAMPLE_QUERIES = agg(SAMPLE_QUERY_PAGE, 'query');
export const SAMPLE_PAGES_CURRENT = agg(SAMPLE_QUERY_PAGE, 'page');

const p = (path, clicks, impressions, position) => ({
  page: `https://example.com${path}`, clicks, impressions, ctr: clicks / impressions, position,
});
// Previous period: same site three months earlier, with a few pages that have decayed.
export const SAMPLE_PAGES_PREVIOUS = [
  p('/blog/keyword-research', 190, 2400, 4.8),
  p('/guides/keyword-research-tips', 70, 1600, 7.5),
  p('/seo-checklist', 640, 5200, 3.0),
  p('/blog/meta-descriptions', 55, 3300, 12.0),
  p('/blog/canonical-urls', 60, 2400, 4.0),
  p('/blog/robots-txt', 120, 2600, 8.0),
  p('/tools/page-speed', 85, 1100, 5.1),
  p('/templates/seo-audit', 205, 2500, 2.4),
  p('/blog/old-guide', 90, 1500, 6.0),
];
