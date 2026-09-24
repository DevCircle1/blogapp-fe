import { expectedCtr } from './ctrCurve.js';

/**
 * The four Search Console analyses. Pure functions over normalised rows
 * ({ query?, page?, clicks, impressions, ctr, position }), so the CSV upload
 * path and any future API path run identical logic.
 *
 * Every "clicks" figure that comes out of the CTR curve is an estimate; the
 * fields are named accordingly (estimated…, potential…).
 */

/** Same page, however the URL was written: scheme, www, trailing slash, query string and fragment ignored. */
export function normalizeUrl(raw) {
  try {
    const url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    return `${url.hostname.replace(/^www\./i, '').toLowerCase()}${path}`;
  } catch {
    return String(raw).trim().toLowerCase().replace(/[?#].*$/, '').replace(/\/+$/, '');
  }
}

export const pathOf = (raw) => {
  try { return new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`).pathname || '/'; } catch { return raw; }
};

/** Best guess at the brand word from the site's own URLs ("example" for example.com). */
export function guessBrandTerms(rows) {
  const counts = new Map();
  rows.forEach((row) => {
    if (!row.page) return;
    try {
      const host = new URL(/^https?:\/\//i.test(row.page) ? row.page : `https://${row.page}`).hostname.replace(/^www\./i, '');
      const label = host.split('.')[0];
      if (label.length >= 3) counts.set(label, (counts.get(label) || 0) + 1);
    } catch { /* not a URL */ }
  });
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
  return top ? [top[0]] : [];
}

const isBranded = (query, terms) => {
  const q = query.toLowerCase().replace(/[\s\-_.]+/g, '');
  return terms.some((term) => term && q.includes(term.toLowerCase().replace(/[\s\-_.]+/g, '')));
};

/* --------------------------------------------------------- cannibalization */

/**
 * A query is cannibalized when two or more of the site's URLs each earn a real
 * share of its impressions at similar positions, so they are competing for
 * the same result. Filters exist to keep false positives out, because a
 * flagged brand query or a URL with a token share is noise:
 *   - each URL needs `minImpressions` and at least `minShare` of the query's impressions
 *   - positions must be within `maxPositionGap` of the best one
 *   - brand queries are reported separately, not as problems
 */
export function findCannibalization(rows, {
  minImpressions = 50, minShare = 0.1, maxPositionGap = 10, brandTerms = [],
} = {}) {
  const byQuery = new Map();
  for (const row of rows) {
    if (!row.query || !row.page) continue;
    if (!byQuery.has(row.query)) byQuery.set(row.query, new Map());
    const pages = byQuery.get(row.query);
    const key = normalizeUrl(row.page);
    const entry = pages.get(key) || { page: row.page, clicks: 0, impressions: 0, weightedPosition: 0 };
    entry.clicks += row.clicks;
    entry.impressions += row.impressions;
    entry.weightedPosition += row.position * row.impressions;
    pages.set(key, entry);
  }

  const issues = [];
  for (const [query, pageMap] of byQuery) {
    const all = [...pageMap.values()].map((entry) => ({
      page: entry.page,
      clicks: entry.clicks,
      impressions: entry.impressions,
      position: entry.impressions ? entry.weightedPosition / entry.impressions : NaN,
    }));
    const totalImpressions = all.reduce((sum, item) => sum + item.impressions, 0);
    const competing = all
      .filter((item) => item.impressions >= minImpressions && item.impressions / totalImpressions >= minShare)
      .sort((a, b) => a.position - b.position);
    if (competing.length < 2) continue;
    const best = competing[0].position;
    const inRange = competing.filter((item) => item.position - best <= maxPositionGap);
    if (inRange.length < 2) continue;

    const impressions = inRange.reduce((sum, item) => sum + item.impressions, 0);
    const clicks = inRange.reduce((sum, item) => sum + item.clicks, 0);
    const consolidatedClicks = expectedCtr(best) * impressions;
    const potentialClicksLost = Math.max(0, Math.round(consolidatedClicks - clicks));
    const topShare = Math.max(...inRange.map((item) => item.impressions)) / impressions;
    const gap = inRange[inRange.length - 1].position - best;
    const branded = isBranded(query, brandTerms);

    let action;
    if (branded) action = 'differentiate';
    else if (topShare < 0.65 && gap < 5) action = 'consolidate';
    else if (topShare >= 0.65) action = 'differentiate';
    else action = 'review';

    issues.push({
      query,
      pages: inRange,
      impressions,
      clicks,
      bestPosition: best,
      positionGap: gap,
      topShare,
      potentialClicksLost,
      branded,
      action,
    });
  }
  return issues.sort((a, b) => b.potentialClicksLost - a.potentialClicksLost || b.impressions - a.impressions);
}

export const CANNIBALIZATION_ADVICE = {
  consolidate: 'Impressions are split fairly evenly between these URLs, so they are probably answering the same intent. Pick the stronger page, merge the useful content from the others into it, 301-redirect the rest and point internal links at the survivor.',
  differentiate: 'One URL already takes most of the impressions. Check whether the others really need to target this query: retarget them at a different angle, adjust their titles and headings, or link to the main page with descriptive anchor text so they support it rather than compete.',
  review: 'The positions are fairly far apart, so this may be a legitimate mix of intents. Search the query yourself; if Google is showing both pages for different reasons, leave them, otherwise treat it as consolidate.',
};

/* -------------------------------------------------------------------- decay */

const rowKey = (row, dimension) => (dimension === 'page' ? normalizeUrl(row.page) : row.query.toLowerCase());

/**
 * Compares a current period with the previous one. `current` and `previous`
 * are page (or query) tables; alternatively rows may carry their own `prev`
 * metrics (a "compare dates" export), in which case `previous` can be omitted.
 */
export function findDecay(current, previous = null, {
  dimension = 'page', minPreviousClicks = 10, minDropPct = 0.2,
} = {}) {
  const prevMap = new Map();
  if (previous) previous.forEach((row) => prevMap.set(rowKey(row, dimension), row));
  const seen = new Set();
  const out = [];

  const compare = (label, now, before) => {
    const clicksDelta = (now?.clicks ?? 0) - before.clicks;
    const dropPct = before.clicks ? -clicksDelta / before.clicks : 0;
    if (before.clicks < minPreviousClicks || dropPct < minDropPct) return;
    const imprDelta = (now?.impressions ?? 0) - before.impressions;
    const imprDropPct = before.impressions ? -imprDelta / before.impressions : 0;
    const positionDelta = now && Number.isFinite(now.position) && Number.isFinite(before.position) ? now.position - before.position : NaN;

    let cause;
    if (!now || now.clicks === 0) cause = 'lost_all';
    else if (Number.isFinite(positionDelta) && positionDelta >= 1) cause = 'lost_rankings';
    else if (imprDropPct >= minDropPct) cause = 'fewer_searches';
    else cause = 'lost_ctr_stable_position';

    out.push({
      key: label,
      label: dimension === 'page' ? (now?.page || before.page) : (now?.query || before.query),
      previousClicks: before.clicks,
      currentClicks: now?.clicks ?? 0,
      clicksDelta,
      dropPct,
      previousImpressions: before.impressions,
      currentImpressions: now?.impressions ?? 0,
      imprDelta,
      previousPosition: before.position,
      currentPosition: now?.position ?? NaN,
      positionDelta,
      cause,
    });
  };

  for (const row of current) {
    const key = rowKey(row, dimension);
    seen.add(key);
    const before = row.prev || prevMap.get(key);
    if (before) compare(key, row, before);
  }
  // Present before, absent now.
  for (const [key, before] of prevMap) if (!seen.has(key)) compare(key, null, before);

  return out.sort((a, b) => a.clicksDelta - b.clicksDelta);
}

export const DECAY_CAUSES = {
  lost_rankings: { label: 'Lost rankings', advice: 'Average position got worse while the page kept some visibility. Refresh the content, check whether a competitor overtook it, and re-check internal links and any recent template or technical changes.' },
  lost_ctr_stable_position: { label: 'Lost clicks, stable position', advice: 'The page still ranks where it did but earns fewer clicks. Look at the live results for a new SERP feature, an AI answer above you, or a stronger competing title; rewrite the title and meta description.' },
  fewer_searches: { label: 'Fewer searches', advice: 'Impressions fell with the position unchanged, which points to less search demand rather than a ranking problem — often seasonal. Compare against the same months last year in Search Console or Google Trends before changing anything.' },
  lost_all: { label: 'Stopped getting clicks', advice: 'The page earned clicks before and earns none now. Check it still returns 200, is not blocked or noindexed, has not been redirected, and is still in your sitemap and internal links.' },
};

/* ---------------------------------------------------------- striking distance */

/**
 * Queries stuck on page two. Opportunity is the extra clicks if the query moved
 * to position 5: impressions × (expected CTR at 5 − current CTR).
 */
export function findStrikingDistance(rows, { minImpressions = 100, minPosition = 11, maxPosition = 20 } = {}) {
  const target = expectedCtr(5);
  return rows
    .filter((row) => row.query && row.impressions >= minImpressions && row.position >= minPosition && row.position <= maxPosition)
    .map((row) => ({
      query: row.query,
      page: row.page || '',
      impressions: row.impressions,
      clicks: row.clicks,
      ctr: row.ctr,
      position: row.position,
      opportunity: Math.max(0, Math.round(row.impressions * (target - row.ctr))),
    }))
    .sort((a, b) => b.opportunity - a.opportunity);
}

/* ------------------------------------------------------------------ zero CTR */

/**
 * Rows that are shown a lot but clicked far less than their position predicts.
 * Only positions up to `maxPosition` are considered: below page one, a low CTR is normal.
 */
export function findLowCtr(rows, { minImpressions = 200, maxPosition = 10, ratio = 0.5 } = {}) {
  return rows
    .filter((row) => (row.query || row.page) && row.impressions >= minImpressions && row.position <= maxPosition)
    .map((row) => {
      const expected = expectedCtr(row.position);
      return {
        label: row.page || row.query,
        query: row.query || '',
        impressions: row.impressions,
        clicks: row.clicks,
        ctr: row.ctr,
        position: row.position,
        expectedCtr: expected,
        missedClicks: Math.max(0, Math.round(row.impressions * (expected - row.ctr))),
        zero: row.clicks === 0,
      };
    })
    .filter((row) => row.zero || row.ctr < row.expectedCtr * ratio)
    .sort((a, b) => b.missedClicks - a.missedClicks);
}
