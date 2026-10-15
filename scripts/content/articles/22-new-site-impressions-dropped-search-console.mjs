export default {
  slug: 'new-site-impressions-dropped-search-console',
  title: 'Why a New Site’s Impressions Drop After the First Month',
  category: 'seo',
  theme: 'seo',
  tags: ['impressions dropped search console', 'new website impressions drop', 'google honeymoon period', 'average position', 'search console', 'new site seo'],
  description: 'A new site’s Search Console impressions often spike, then fall by half within weeks. Here is how to tell a normal reassessment from a real problem, and what moves the numbers.',
  cover: {
    kicker: 'Impressions fell. Average position improved. Both are the same story.',
    visual: {
      type: 'bars',
      title: 'A typical new-site first 6 weeks',
      items: [
        { label: 'Wk 1', value: 150, display: '150/day' },
        { label: 'Wk 2', value: 800, display: '800/day', highlight: true },
        { label: 'Wk 3', value: 520, display: '520/day' },
        { label: 'Wk 4', value: 600, display: '600/day' },
        { label: 'Wk 5', value: 330, display: '330/day' },
        { label: 'Wk 6', value: 90, display: '90/day' },
      ],
    },
  },
  infographic: {
    type: 'steps',
    title: 'Diagnose an impressions drop in 15 minutes',
    subtitle: 'Use Performance → Search results with the last 3 months and average position switched on.',
    items: [
      ['Look at average position, not just impressions', 'If position got better while impressions fell, Google stopped testing you on queries where you ranked on page 5–8.'],
      ['Check Pages → Indexing for a matching drop', 'Indexed pages falling at the same time points to a technical or quality issue, not a reassessment.'],
      ['Compare languages and sections with a Page regex filter', 'Find which part of the site lost the impressions before changing anything.'],
      ['Sort queries by position, not impressions', 'Queries in positions 1–20 are what you actually have. Everything beyond 50 was never traffic.'],
      ['Work on the pages that already rank on page 1–2', 'Improve them, link to them internally, and earn links from outside the site.'],
    ],
    alt: 'Five diagnostic steps for a Search Console impressions drop, from checking average position to focusing on pages ranking on page one and two',
    caption: 'Most first-month drops are Google narrowing the queries it shows you for, not a penalty.',
    footer: 'Compare two periods page by page: talkandtool.com/tools/content-decay-checker',
  },
  html: `
<p>A common pattern for a new website: a week or two after launch, Search Console impressions jump to hundreds a day. A few weeks later they halve, then halve again, even though more pages are now indexed. It feels like a penalty. Usually it is not. Here is what is going on, how to check, and what actually brings the impressions back.</p>

<h2>Read average position before you panic</h2>
<p>Open the Performance report and switch on <strong>Average position</strong> next to impressions. If impressions peaked while average position sat around 60–80, those impressions came from pages five to eight of the results. Search Console counts an impression whenever your result was on a page the searcher loaded, and almost nobody scrolls that far, so those impressions were never going to turn into clicks.</p>
<p>If the drop came with a <em>better</em> average position, say from 75 to 25, the picture is this: Google showed your new pages for a wide range of loosely related, highly competitive queries while it worked out where they belonged, then stopped showing them for most of those. What is left is smaller but real.</p>

{{infographic}}

<h2>Why Google tests a new site widely, then narrows</h2>
<p>When a site publishes many pages at once, Google has content but no history: no links pointing to it, no record of how searchers react to it, no evidence the site is an authority on anything. It can rank the pages for queries they match on text alone, and it does, low down and for a while. As it gathers signals, pages that drew no clicks on broad queries stop appearing for them.</p>
<p>That reassessment hits hardest when the pages target crowded queries. A new word counter, BMI calculator or loan calculator competes with sites that have held page one for a decade and have thousands of linking domains. Matching the query is not enough to stay on page one there, so the broad impressions fade and only the specific, less contested queries remain.</p>

<h2>When a drop is a real problem</h2>
<p>Rule these out before calling it a reassessment:</p>
<ul>
<li><strong>Indexing fell too.</strong> In <strong>Pages</strong> (Indexing), a drop in indexed pages at the same time, or a rise in "Crawled – currently not indexed", means Google is choosing not to keep pages. That is a quality or duplication signal: thin or near-identical pages, many translated templates with little unique text, or pages that compete with each other. The <a href="/tools/keyword-cannibalization-checker">keyword cannibalization checker</a> finds queries split between several of your URLs.</li>
<li><strong>Something changed on the site.</strong> A deploy that added <code>noindex</code>, changed canonicals, broke redirects or removed internal links shows up as a cliff on one date. Use the URL Inspection tool on a page that lost impressions and check the live test.</li>
<li><strong>A manual action.</strong> Check <strong>Security &amp; Manual actions</strong>. It is rare, but it settles the question.</li>
<li><strong>One section collapsed.</strong> Filter the Page dimension with a regex such as <code>/de/</code> or <code>/blog/</code> to see which part of the site lost the impressions. The patterns are in <a href="/blogs/article/search-console-regex-filters">Search Console regex filters</a>.</li>
</ul>

<h2>What brings impressions back</h2>
<h3>Narrow the focus to where you already rank</h3>
<p>Sort your queries by position and keep only those in positions 1–20. That short list is your real foothold: the topics Google already trusts you on. For a young site it is usually specific, long-tail and niche queries. Put your effort there instead of publishing another hundred pages for queries where you sit at position 70.</p>
<h3>Push page-two queries onto page one</h3>
<p>Queries in positions 11–20 are the fastest gains, because a page-one result earns several times the clicks. The <a href="/tools/striking-distance-keywords">striking distance keywords finder</a> lists them from your export with an estimate of the clicks each would add.</p>
<h3>Make each page clearly better than a template</h3>
<p>If many of your pages share one layout with only the tool or the language changed, add what only that page can offer: a worked example, a table of common values, answers to the questions people search for, a short explanation of the formula. Pages that earn clicks keep their rankings; pages that only match text get dropped in the next reassessment.</p>
<h3>Link your pages to each other deliberately</h3>
<p>Every guide should link to the tool it explains with a descriptive anchor, and every tool should link back to its guides. Internal links are the one ranking lever you fully control, and they tell Google which pages belong together.</p>
<h3>Earn links from outside</h3>
<p>No amount of on-page work replaces the trust signal of other sites linking to yours. For a tool site, the realistic sources are niche directories, communities where the tools solve a real problem, and guides that cite your data. One relevant link to a page that already ranks on page two often does more than ten new pages.</p>
<h3>Fix the snippets of pages that do rank</h3>
<p>Once a page reaches page one, CTR becomes the limit. A page with impressions at position 6 and no clicks has a title problem. The <a href="/tools/gsc-ctr-analyzer">CTR analyzer</a> flags pages earning far less than their position should.</p>

<h2>How long until it recovers?</h2>
<p>For a new domain, three to six months is a realistic window before rankings settle, and it is longer in competitive niches. Track three numbers weekly rather than daily impressions: clicks, the number of queries in positions 1–10, and the number in positions 11–20. If those are rising, the site is growing even while total impressions look flat, because impressions from position 70 are being replaced by impressions people actually see.</p>
<p>To compare two periods page by page and see which pages lost clicks and why, use the <a href="/tools/content-decay-checker">content decay checker</a>.</p>

<h2>Frequently asked questions</h2>
<h3>Is this the "Google sandbox"?</h3>
<p>Google has said there is no deliberate sandbox. The effect people describe is real, though: a new site has no history or links, so it ranks cautiously at first and its rankings move a lot while Google gathers signals.</p>
<h3>Should I delete pages that get no impressions?</h3>
<p>Not straight away. Give new pages at least two to three months. After that, improve, merge or noindex pages that remain thin and get nothing. Removing low-value near-duplicates can help the rest of the site.</p>
<h3>Why do impressions fall when more pages get indexed?</h3>
<p>Because indexing and ranking are separate. A page can be indexed and still rank at position 90 for everything, which produces almost no impressions. More indexed pages only means more impressions if those pages rank.</p>
`,
};
