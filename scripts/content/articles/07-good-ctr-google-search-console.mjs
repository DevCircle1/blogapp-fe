export default {
  slug: 'good-ctr-google-search-console',
  title: 'What Is a Good CTR in Google Search Console? (By Position)',
  category: 'seo',
  theme: 'seo',
  tags: ['good ctr', 'click through rate', 'google search console', 'ctr by position', 'organic ctr benchmark', 'improve ctr'],
  description: 'A good CTR depends on position: roughly 25–30% at #1, 6% at #5 and 2–3% at #10. See the benchmarks, why site-wide CTR misleads, and how to raise low CTR pages.',
  cover: {
    kicker: 'Why your site-wide average is misleading',
    visual: { type: 'stat', value: '27.6%', label: 'typical CTR at position 1', note: 'falling to about 2.4% at position 10' },
  },
  infographic: {
    type: 'table',
    title: 'Expected organic CTR by average position',
    subtitle: 'Approximate industry averages. Real CTR varies with ads, featured snippets, brand and device.',
    columns: ['Average position', 'Expected CTR', 'Clicks per 1,000 impressions'],
    widths: [330, 330, 396],
    rows: [
      ['1', '≈ 27.6%', '≈ 276'],
      ['2', '≈ 15.8%', '≈ 158'],
      ['3', '≈ 11.0%', '≈ 110'],
      ['5', '≈ 6.3%', '≈ 63'],
      ['10', '≈ 2.4%', '≈ 24'],
      ['15', '≈ 1.7%', '≈ 17'],
      ['20', '≈ 1.0%', '≈ 10'],
      ['30+', '< 1%', 'Under 10'],
    ],
    alt: 'Table of expected organic click-through rate by Google average position, from about 27.6% at position 1 to under 1% beyond position 30',
    caption: 'Judge each page against the CTR expected at its own position, not against a site-wide average.',
    footer: 'Compare your pages: talkandtool.com/tools/gsc-ctr-analyzer',
  },
  html: `
<p>A good CTR in Google Search Console depends almost entirely on position. Roughly 25–30% is typical at position 1, about 6% at position 5, and 2–3% at position 10. So the useful question is not "is my CTR good?" but "is this page's CTR good for the position it holds?" Here are the benchmarks and how to use them.</p>

<h2>Why your site-wide CTR is misleading</h2>
<p>The CTR at the top of the Performance report averages every impression your site received, including all the queries where you rank on page five. For a new site that number can look alarming. In its first two weeks in Search Console, talkandtool.com recorded 7,555 impressions and 3 clicks, a CTR of 0.04%. Nothing was wrong with the titles. The average position was around 70, where almost nobody clicks.</p>
<p>As a site gains rankings, its average CTR rises without anyone touching a title. That is why a site-wide CTR trend mostly tracks rankings, not snippet quality. To judge the snippet, you have to control for position.</p>

<h2>CTR benchmarks by position</h2>

{{infographic}}

<p>These numbers follow the range published by large industry CTR studies. Treat them as a yardstick. Some search types consistently beat or miss them:</p>
<ul>
<li><strong>Branded queries</strong> often get CTRs far above the curve. People searching your name want you.</li>
<li><strong>Queries with a featured snippet, AI overview, ads or a map pack</strong> push the organic results down, so CTR at position 1 can be half the benchmark.</li>
<li><strong>Answer-style queries</strong> ("what is 15% of 80") can have very low CTR because the result page answers them directly.</li>
<li><strong>Mobile and desktop</strong> differ, so compare like with like using the Device filter.</li>
</ul>

<h2>How to find pages with below-par CTR</h2>
<ol>
<li>In Search Console, open Performance → Pages with clicks, impressions, CTR and position enabled, for the last three months.</li>
<li>Export the table, and for each page compare its CTR with the expected CTR for its average position.</li>
<li>Rank pages by the clicks you are missing: <em>impressions × (expected CTR − actual CTR)</em>. A small gap on a big page beats a big gap on a tiny one.</li>
<li>Focus on pages ranking in the top ten. Below that, position is the bottleneck, not the snippet.</li>
</ol>
<p>The <a href="/tools/gsc-ctr-analyzer">Search Console CTR analyzer</a> does this from an upload: it compares every page with the expected curve and lists the underperformers by estimated missed clicks.</p>

<h2>How to improve a low CTR</h2>
<h3>Rewrite the title for the query people actually use</h3>
<p>Open the page's Queries tab. If most impressions come from a phrasing your title does not use, put that phrasing in the title. Searchers scan for their own words, and Google bolds them.</p>
<p>Keep the title within the displayed width. See <a href="/blogs/article/seo-title-length-pixel-limit">SEO title length and pixel limits</a>, and check it with the <a href="/tools/seo-title-meta-checker">title and meta description checker</a>.</p>
<h3>Write a meta description that sells the click</h3>
<p>Google shows your description when it matches the query well. Lead with the answer or outcome, include a specific detail, and give a reason to click. Our guide to <a href="/blogs/article/how-to-write-meta-descriptions-that-get-clicks">meta descriptions that earn the click</a> has examples.</p>
<h3>Match the intent shown on page one</h3>
<p>If every other result is a calculator and yours is an article, or the reverse, people skip it. Sometimes the fix is adding a tool or a direct answer at the top, not rewording the snippet.</p>
<h3>Earn rich results where they are still available</h3>
<p>Product, recipe, video, event and review markup can add stars, prices, dates or thumbnails that pull the eye. Many older rich result types have been retired, so check which ones still work in <a href="/blogs/article/schema-markup-rich-results-2026">which schema markup still gets rich results</a>.</p>
<h3>Show freshness when it matters</h3>
<p>For topics that change (prices, rules, software), a visible, genuine "updated" date and the current year in the title can lift CTR. Do not fake it. Changing the date without changing the content is easy for users and Google to see through.</p>

<h2>Measuring the change</h2>
<p>After updating a snippet, wait until Google shows the new version (check with a search), then compare 28 days after with 28 days before. Compare at a similar average position, because a ranking shift will move CTR on its own. Filter to the page and, ideally, to its top query so seasonality in other queries does not muddy the result.</p>

<h2>Frequently asked questions</h2>
<h3>What is a good average CTR for a whole website?</h3>
<p>There is no meaningful benchmark, because it depends on your rankings mix. Sites that rank mostly in the top three can average 10%+. Newer sites with many low-position impressions can sit under 1% and still be healthy.</p>
<h3>Why do I have impressions but no clicks?</h3>
<p>Usually because the impressions come from low positions, often on pages three and beyond. Check the average position: below about 20, clicks are rare regardless of the snippet.</p>
<h3>Does CTR affect rankings?</h3>
<p>Google has not confirmed CTR as a direct ranking factor, and it is a noisy signal. But more clicks at the same position is more traffic either way, which is the point.</p>
`,
};
