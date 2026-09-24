export const CANNIBAL_PATH = '/tools/keyword-cannibalization-checker';
export const DECAY_PATH = '/tools/content-decay-checker';
export const STRIKING_PATH = '/tools/striking-distance-keywords';
export const CTR_PATH = '/tools/gsc-ctr-analyzer';

const PRIVACY_FAQ = {
  q: 'Is my Search Console data uploaded anywhere?',
  a: 'No. The file is read and analysed entirely in your browser and is never sent to a server. There is no login, and the only thing the site records is an anonymous count that a file was analysed.',
};

const EXPORT_SECTION = {
  heading: 'How to get your Search Console export',
  paragraphs: [
    'Open the Performance report for your property, pick the date range you want, then use Export at the top right and choose Download CSV. Search Console gives you a ZIP that holds one CSV per table — Queries, Pages, Countries, Devices and so on — and you can drop the ZIP straight onto the tool; it finds the tables it needs and ignores the rest.',
    'Exports follow the language of your Search Console interface. The tool recognises the column names in English, German, Spanish, French, Italian, Portuguese, Dutch and Polish exports, and tells you if it cannot find the columns it needs.',
  ],
};

const RELATED = [
  { to: CANNIBAL_PATH, label: 'Keyword Cannibalization Checker', description: 'Find queries where several of your URLs compete.' },
  { to: '/tools/seo-title-meta-checker', label: 'SEO Title & Meta Checker', description: 'Check title length and preview the snippet before you rewrite it.' },
  { to: '/tools/keyword-clustering-tool', label: 'Keyword Clustering Tool', description: 'Group related queries into one page each.' },
];

const SIBLINGS = [
  { to: CANNIBAL_PATH, label: 'Keyword cannibalization checker' },
  { to: DECAY_PATH, label: 'Content decay checker' },
  { to: STRIKING_PATH, label: 'Striking distance keywords finder' },
  { to: CTR_PATH, label: 'Search Console CTR analyzer' },
];

const common = {
  category: 'SEO · Search Console',
  applicationCategory: 'BusinessApplication',
  parent: { name: 'Tools', path: '/tools' },
  related: RELATED,
  siblingsHeading: 'Search Console tools',
};

const decay = {
  ...common,
  path: DECAY_PATH,
  toolId: 'content-decay-checker',
  slug: 'content-decay-checker',
  title: 'Content Decay Checker — Find Pages Losing Traffic',
  description: 'Upload your Google Search Console export to find pages losing clicks using your real data. Free, no subscription, no login — it runs in your browser.',
  h1: 'Content Decay Checker',
  crumb: 'Content Decay Checker',
  parent: undefined,
  appName: 'Content Decay Checker',
  lead: 'This content decay checker compares two periods of your Google Search Console data and lists the pages that are losing clicks, with a likely cause for each. Everything runs in your browser; your data is never uploaded.',
  sections: [
    {
      heading: 'What content decay is and how this checker finds it',
      paragraphs: [
        'Content decay is the slow loss of search traffic that most pages suffer as they age: competitors publish fresher answers, search results change, or interest in a topic fades. Because it happens gradually, it rarely triggers an alarm — you notice it months later as a flat traffic chart. This content decay checker finds it early by comparing a recent period against the one before it, page by page.',
        'For each page that lost at least the drop you set (20% by default) and had a meaningful number of clicks before (10 by default), it shows clicks, impressions and average position for both periods and classifies the most likely cause. That classification is what makes the list actionable, because the fix for a page that slipped from position 4 to 9 is different from the fix for a page that still ranks 4 but is being clicked less.',
      ],
    },
    {
      heading: 'The four causes the checker distinguishes',
      list: [
        'Lost rankings — average position worsened by a full place or more. Refresh and expand the content, and check what now ranks above you.',
        'Lost clicks at a stable position — you rank where you did but are clicked less, usually because of a new SERP feature or a weaker title next to competitors. Rewrite the title and meta description.',
        'Fewer searches — impressions fell while position held, which points to lower demand or seasonality rather than a page problem. Check the same months a year earlier before acting.',
        'Stopped getting clicks — a page that had clicks now has none. Check status codes, redirects, noindex tags and your sitemap.',
      ],
    },
    EXPORT_SECTION,
    {
      heading: 'Limits of a two-period comparison',
      paragraphs: [
        'Comparing two periods cannot tell a genuine decline from seasonality on its own, so read “Fewer searches” results together with last year’s figures. Averages also hide detail: a page ranking for hundreds of queries can lose its top query while the average position barely moves. Treat the list as a prioritised set of pages to look at, not a verdict.',
      ],
    },
  ],
  steps: [
    'Export the Pages table for the recent period (for example the last 3 months) and again for the period before it — or use one “compare dates” export that contains both.',
    'Drop the current-period file on the left box and the previous-period file on the right.',
    'Adjust the minimum previous clicks and the minimum drop if the list is too long or too short.',
    'Open a row for the likely cause and what to do, then export the list to CSV.',
  ],
  faqs: [
    { q: 'How do I find content decay in Search Console?', a: 'Compare the same length of time before and after in the Performance report and look at clicks per page. This tool automates that: upload both periods and it lists the pages that lost clicks, biggest loss first, with the likely cause.' },
    { q: 'What period should I compare?', a: 'Three months against the three months before is a good default: long enough to smooth out weekly noise, short enough to catch a decline while it is fixable. For seasonal topics compare against the same months a year earlier instead.' },
    { q: 'What is a normal amount of decay?', a: 'Most pages lose some clicks over time, so small drops are noise. That is why the default only flags pages that lost at least 20% of a meaningful click count.' },
    { q: 'Can it tell me why a page lost traffic?', a: 'It gives the most likely category from the position, impressions and click data, not a certainty. Confirm by searching the query yourself and checking the page for technical changes.' },
    PRIVACY_FAQ,
  ],
  siblings: SIBLINGS.filter((item) => item.to !== DECAY_PATH),
  disclaimer: 'Causes are inferred from Search Console averages and are suggestions to investigate, not diagnoses.',
};

const striking = {
  ...common,
  path: STRIKING_PATH,
  toolId: 'striking-distance-keywords',
  slug: 'striking-distance-keywords',
  title: 'Striking Distance Keywords — Find Page 2 Wins',
  description: 'Upload your Google Search Console export to find page-two keywords using your real data. Free, no subscription, no login — it runs in your browser.',
  h1: 'Striking Distance Keywords Finder',
  crumb: 'Striking Distance Keywords',
  parent: undefined,
  appName: 'Striking Distance Keywords Finder',
  lead: 'Striking distance keywords are queries where you already rank on the second page of Google — positions 11 to 20 — with plenty of impressions. This finder lists them from your own Search Console data, ranked by the extra clicks you would win by moving up.',
  sections: [
    {
      heading: 'Why striking distance keywords are the fastest SEO wins',
      paragraphs: [
        'A query in positions 11–20 is one where Google already thinks your page is relevant. Moving from page two to the bottom of page one usually takes an edit, not a new article, and page one attracts far more clicks: the second page gets only a sliver of them. That makes striking distance keywords the cheapest ranking improvement most sites have, and they are almost always hiding in Search Console.',
        'The finder takes every query in your range with at least the impressions you set (100 by default) and estimates the opportunity as impressions multiplied by the difference between the click-through rate expected at position 5 and the one you have now. That puts a high-impression query at position 12 above a small one at position 11, which is the order in which the work pays off.',
      ],
    },
    {
      heading: 'What to do with a striking distance keyword',
      list: [
        'Find the page that ranks (a Query + Page export shows it) and check it answers the query directly and completely.',
        'Put the query, or a close variant, in a heading and near the top of the page.',
        'Add internal links to the page from relevant pages, using the query as anchor text.',
        'Improve the title and meta description so the result earns the click once you move up.',
        'Add what page-one competitors have that you lack: depth, examples, data, media.',
      ],
    },
    EXPORT_SECTION,
    {
      heading: 'Reading the numbers with care',
      paragraphs: [
        'Average position in Search Console blends every impression in the period, so a query averaging 14 may really be 8 for some searchers and 30 for others. The opportunity figure uses a generic click-through curve and is best used to order the list, not to forecast traffic.',
      ],
    },
  ],
  steps: [
    'Export the Queries table (or a Query + Page table, which also shows the ranking page) from the Performance report.',
    'Drop the CSV or ZIP onto the box, or try the sample data.',
    'Adjust the impression threshold and position range if you want a wider or narrower list.',
    'Work down the list from the largest estimated opportunity and export it as CSV.',
  ],
  faqs: [
    { q: 'What are striking distance keywords?', a: 'Queries for which your site ranks just outside the top ten — typically positions 11 to 20 — so a modest improvement can move them onto page one.' },
    { q: 'How do I find keywords ranking on page 2?', a: 'In Search Console’s Performance report, sort queries by impressions and filter for positions above 10. This tool does that for you, adds an estimate of the extra clicks at position 5, and sorts by it.' },
    { q: 'Why position 5 as the target?', a: 'It is a realistic goal for a page that is optimised and internally linked, and a click-through rate near the middle of page one. You can widen or narrow the range of positions to suit your site.' },
    { q: 'Do I need a Query + Page export?', a: 'No. A plain Queries export works. A Query + Page export additionally shows which of your pages ranks for each query, which saves a lookup.' },
    PRIVACY_FAQ,
  ],
  siblings: SIBLINGS.filter((item) => item.to !== STRIKING_PATH),
  disclaimer: 'Opportunity figures are estimates from a generic click-through curve, intended for ordering work rather than forecasting traffic.',
};

const ctr = {
  ...common,
  path: CTR_PATH,
  toolId: 'gsc-ctr-analyzer',
  slug: 'gsc-ctr-analyzer',
  title: 'GSC CTR Analyzer — Find Low Click-Through Pages',
  description: 'Upload your Google Search Console export to find low click-through pages using your real data. Free, no subscription, no login — it runs in your browser.',
  h1: 'Search Console CTR Analyzer',
  crumb: 'GSC CTR Analyzer',
  parent: undefined,
  appName: 'Search Console CTR Analyzer',
  lead: 'This Search Console CTR analysis compares the click-through rate of each page or query with what its average position normally earns, and lists the ones being shown a lot but clicked far too little — the titles and snippets that are failing.',
  sections: [
    {
      heading: 'How this Search Console CTR analysis works',
      paragraphs: [
        'Click-through rate depends heavily on position: a result at position 2 is clicked several times more often than one at position 8. A CTR that looks poor in isolation may be perfectly normal for its rank, so this analyzer does not just sort by lowest CTR. For every row with enough impressions it looks up the CTR expected at its average position and flags the rows that earn less than half of it, plus any that got impressions but no clicks at all.',
        'The result is the set of pages where your snippet, not your ranking, is the problem. For each one it estimates the clicks missed — impressions multiplied by the gap between expected and actual CTR — so you can fix the biggest gaps first. Rows beyond position 10 are left out by default, because a low CTR on page two is expected.',
      ],
    },
    {
      heading: 'Why a page can rank well and still get few clicks',
      list: [
        'The title does not match what the searcher typed, or is truncated so the useful part is cut off.',
        'The meta description gives no reason to click, or Google has rewritten it into something unhelpful.',
        'A featured snippet, AI overview, ad block, video or People Also Ask box sits above the result and answers the question.',
        'The query is informational and the answer is visible in the results without clicking.',
        'A competing result has stronger signals such as ratings, price or a recognisable brand.',
      ],
    },
    EXPORT_SECTION,
    {
      heading: 'What the expected-CTR figures mean',
      paragraphs: [
        'The expected click-through rate comes from a generic curve in line with published industry studies, where position 1 earns roughly a quarter of clicks and the rate falls steeply down page one. Your own site, query types and search features will differ, so the analyzer uses the curve to find outliers and rank them, not to judge any single number.',
      ],
    },
  ],
  steps: [
    'Export the Pages table (or the Queries table) from the Performance report.',
    'Drop the CSV or ZIP onto the box, or try the sample data.',
    'Set the minimum impressions and how far below expectation a row must be to be flagged.',
    'Rewrite the titles and descriptions of the biggest gaps first, and export the list to CSV.',
  ],
  faqs: [
    { q: 'What is a good CTR in Search Console?', a: 'It depends almost entirely on position and query type. Position 1 typically earns a quarter or more of clicks, position 5 around six percent, and position 10 a couple of percent, with brand queries far higher. Compare against your position, not a single number.' },
    { q: 'How do I improve CTR?', a: 'Make the title match the query and lead with the benefit, keep it short enough not to be truncated, write a description that gives a reason to click, and use structured data where it earns rich results such as ratings.' },
    { q: 'Why does a page have impressions but no clicks?', a: 'Usually the snippet is not persuading, a SERP feature is answering the question above it, or its average position is worse than it looks because a few good rankings are averaged with many poor ones.' },
    { q: 'Does CTR affect rankings?', a: 'Google says it does not use Search Console click data as a direct ranking signal, but a better snippet gets more clicks from the position you already have, which is worth having regardless.' },
    PRIVACY_FAQ,
  ],
  siblings: SIBLINGS.filter((item) => item.to !== CTR_PATH),
  disclaimer: 'Expected CTRs come from a generic curve; use the list to find outliers, then check each result in the live search page.',
};

export const GSC_PAGES = [decay, striking, ctr].map((page) => ({ ...page, parent: undefined }));
export const GSC_MODE_BY_PATH = { [DECAY_PATH]: 'decay', [STRIKING_PATH]: 'striking', [CTR_PATH]: 'ctr' };
