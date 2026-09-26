export default {
  slug: 'striking-distance-keywords',
  title: 'Striking Distance Keywords: Turn Page-2 Rankings Into Clicks',
  category: 'seo',
  theme: 'seo',
  tags: ['striking distance keywords', 'page 2 rankings', 'google search console', 'quick seo wins', 'keyword optimization', 'ctr by position'],
  description: 'Striking distance keywords rank on page two, positions 11–20. Learn how to find them in Search Console, pick the ones worth pushing, and move them to page one.',
  cover: {
    kicker: 'The quickest SEO wins are already in your data',
    visual: {
      type: 'bars',
      title: 'Expected CTR by position',
      items: [
        { label: '#1', value: 27.6, display: '28%' },
        { label: '#3', value: 11, display: '11%' },
        { label: '#5', value: 6.3, display: '6%' },
        { label: '#10', value: 2.4, display: '2.4%' },
        { label: '#15', value: 1.7, display: '1.7%', highlight: true },
        { label: '#20', value: 1.0, display: '1%', highlight: true },
      ],
    },
  },
  infographic: {
    type: 'bars',
    title: 'What moving from page 2 to page 1 is worth',
    subtitle: 'Estimated clicks per month for a query with 5,000 monthly impressions, using an industry-average CTR curve.',
    items: [
      { label: 'Position 18', value: 64, display: '≈ 64 clicks' },
      { label: 'Position 14', value: 92, display: '≈ 92 clicks' },
      { label: 'Position 10', value: 120, display: '≈ 120 clicks' },
      { label: 'Position 7', value: 195, display: '≈ 195 clicks', highlight: true },
      { label: 'Position 5', value: 315, display: '≈ 315 clicks', highlight: true },
      { label: 'Position 3', value: 550, display: '≈ 550 clicks', highlight: true },
    ],
    alt: 'Bar chart of estimated monthly clicks for a 5,000-impression query at positions 18, 14, 10, 7, 5 and 3',
    caption: 'The same query sends about three times the clicks at position 5 as at position 14.',
    footer: 'Find yours: talkandtool.com/tools/striking-distance-keywords',
  },
  html: `
<p>Striking distance keywords are queries where you already rank on page two, positions 11 to 20. Google already considers the page relevant, so a focused update often moves it onto page one within weeks. Here is how to find them, choose the right ones, and push them over.</p>

<h2>Why page two is the best place to look</h2>
<p>New content is a slow bet: you do not know whether Google will rank it or for what. A page sitting at position 14 is a known quantity. It is indexed, it is judged relevant to the query, and it is being shown to searchers, just not to many of them.</p>
<p>The payoff for moving it is steep because click-through rate collapses after the first few results. Using a typical industry CTR curve, a result in position 3 gets around 11% of clicks, position 10 about 2.4%, and position 15 under 2%. The chart below shows what that means for a query with 5,000 impressions a month.</p>

{{infographic}}

<p>These figures are averages. Real CTR depends on ads, featured snippets, brand strength and device. But the shape of the curve is consistent enough to prioritise with.</p>

<h2>How to find striking distance keywords in Search Console</h2>
<ol>
<li><strong>Open Performance → Search results</strong> and set the date range to the last three months. Anything shorter is too noisy for low-volume queries.</li>
<li><strong>Enable Average position</strong> alongside clicks and impressions, then open the Queries tab.</li>
<li><strong>Filter position.</strong> Search Console has no position filter in the table itself, so export to Sheets or CSV and filter for an average position between 11 and 20.</li>
<li><strong>Set an impressions floor.</strong> A query with 12 impressions at position 13 is not worth an afternoon. Start with 100+ impressions over the period and lower it for small sites.</li>
<li><strong>Add the page.</strong> For each query, check the Pages tab to see which URL ranks. If two URLs share the impressions, you have a cannibalization problem to fix first.</li>
</ol>
<p>The <a href="/tools/striking-distance-keywords">striking distance keywords tool</a> does steps 3–5 in one pass. Upload the Search Console export and it lists the page-two queries, estimates the extra clicks each would earn at position 5, and sorts them so the biggest opportunities come first.</p>

<h2>Which ones to push first</h2>
<p>Not every page-two query is a quick win. Sort your list by these three questions:</p>
<ul>
<li><strong>Does the page actually answer the query?</strong> If a query about "flat rate vs APR" is ranking a general loan page, the page is borderline relevant, and the right move may be a dedicated section or a new article.</li>
<li><strong>How many impressions?</strong> The estimated click gain scales with impressions. Rank by estimated extra clicks, not by position.</li>
<li><strong>What is on page one?</strong> Search the query. If page one is all big brands with exact-match pages, position 14 may be your ceiling for now. If it is forums, outdated posts or thin pages, you have a real shot.</li>
</ul>

<h2>How to move a page from page two to page one</h2>
<p>Most striking distance improvements come from making the page more clearly about the query, not from making it longer.</p>
<h3>1. Put the query where Google looks first</h3>
<p>Check the title, H1 and first paragraph. If the query, or a close variant of it, is missing from all three, add it naturally. That is often the entire fix. Keep the title within the width Google displays, as covered in <a href="/blogs/article/seo-title-length-pixel-limit">SEO title length and pixel limits</a>.</p>
<h3>2. Add a section that answers the query directly</h3>
<p>If the query is a question ("how can apr be lower than interest rate"), add an H2 with that question and a direct two- or three-sentence answer under it. That is also the format Google pulls featured snippets from.</p>
<h3>3. Point internal links at the page with descriptive anchors</h3>
<p>Internal links are the lever you fully control. Find three to five relevant pages on your site and link to the target page using anchor text close to the query. A link from a page that already gets traffic is worth more than one from a page nobody visits.</p>
<h3>4. Refresh what has gone stale</h3>
<p>Update outdated figures, screenshots, prices and years. If the page's traffic has been falling rather than stuck, it may be a decay problem rather than a relevance problem. The <a href="/tools/content-decay-checker">content decay checker</a> compares two periods and separates the two.</p>
<h3>5. Improve the snippet once you reach page one</h3>
<p>When the page lands in the top ten, CTR becomes the constraint. Compare its CTR with the expected rate for its position using the <a href="/tools/gsc-ctr-analyzer">CTR analyzer</a>, and rewrite the title and description if it is underperforming.</p>

<h2>How long before you see results?</h2>
<p>Google needs to recrawl the page and re-evaluate it, which for most sites takes days to a few weeks. Request indexing in Search Console after a meaningful update, then compare the four weeks after the change with the four weeks before. Look at average position for the specific query, not the page's overall average, which mixes in hundreds of unrelated queries.</p>
<p>If nothing moves after six to eight weeks, the page is probably missing something page one has: depth, a tool, better examples, or stronger links. That is when a larger rewrite is justified.</p>

<h2>Common mistakes</h2>
<ul>
<li><strong>Chasing position 11 on a 20-impression query.</strong> Rank by potential clicks, not closeness to page one.</li>
<li><strong>Stuffing the query into every paragraph.</strong> One clear mention in the title, heading and intro does more than ten forced repetitions. Check with a <a href="/tools/word-frequency-counter">keyword density checker</a> if you are unsure.</li>
<li><strong>Changing the URL.</strong> A new URL resets the signals the page has built. Update the content in place.</li>
<li><strong>Editing many things at once on many pages.</strong> Change one batch of pages at a time so you can tell what worked.</li>
</ul>

<h2>Frequently asked questions</h2>
<h3>What positions count as striking distance?</h3>
<p>Most SEOs use positions 11–20, the second page of results. Some extend it to positions 4–20 because moving from 8 to 3 is also a large CTR gain.</p>
<h3>Is average position in Search Console accurate?</h3>
<p>It is an average across every impression, so a page shown at position 5 on some searches and 25 on others will report 15. Use it to shortlist queries, then check the live results before investing effort.</p>
<h3>Do I need paid tools to find them?</h3>
<p>No. Search Console has all the data you need. Paid tools add estimates for keywords you do not rank for yet, which is a different job.</p>
`,
};
