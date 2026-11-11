export default {
  slug: 'how-to-fix-keyword-cannibalization',
  title: 'Fix Keyword Cannibalization: Merge, Redirect or Differentiate',
  category: 'seo',
  theme: 'seo',
  tags: ['keyword cannibalization', 'fix keyword cannibalization', 'keyword cannibalization checker', 'merge pages seo', '301 redirect seo', 'search intent'],
  description: 'Found two pages competing for one query? Here is how to decide which page wins and whether to merge, redirect, re-target or leave them alone, with a decision table and a 6-week check.',
  cover: {
    kicker: 'Merge, redirect, re-target or leave alone',
    visual: { type: 'checklist', items: ['Same query, two URLs', 'Same search intent?', 'Pick the winning page', 'Merge and 301 the loser', 'Update internal links'] },
  },
  infographic: {
    type: 'table',
    title: 'Which fix for which situation',
    subtitle: 'Decide on search intent first, then on which page already has the stronger signals.',
    columns: ['Situation', 'Best fix', 'What to do'],
    widths: [320, 220, 516],
    rows: [
      ['Two pages, same intent, both thin', 'Merge + 301', 'Combine into the stronger URL, redirect the other'],
      ['Same intent, both strong', 'Merge + 301', 'Keep the URL with more links and clicks'],
      ['Different intent, similar wording', 'Re-target', 'Rewrite titles and intros so each page owns one intent'],
      ['Near-duplicate you must keep', 'Canonical', 'Point rel=canonical at the preferred page'],
      ['Query only matters on one page', 'Re-link', 'Change internal anchors so they all point to the winner'],
      ['Old or off-topic page', 'Delete or noindex', 'Remove it from the index if it earns nothing'],
    ],
    alt: 'Table matching keyword cannibalization situations to fixes: merge and redirect, re-target, canonical, re-link, or delete',
    caption: 'Most real cases end up as a merge or a re-target.',
    footer: 'Find the conflicts first: talkandtool.com/tools/keyword-cannibalization-checker',
  },
  html: `
<p>To fix keyword cannibalization, first confirm that two of your pages really compete for the same search intent, then keep the stronger page and either merge the weaker one into it with a 301 redirect, or rewrite it so it targets a different intent. If the pages serve different intents, leave them alone. Merging is the most common cure, but it is the wrong one more often than people think.</p>

<h2>Step 1: confirm it is real cannibalization</h2>
<p>Two pages ranking for similar words is not automatically a problem. It becomes one when Google swaps them in and out for the same query, so neither builds stable rankings. In Search Console, open Performance, click the query, and switch to the Pages tab. Two or more URLs with meaningful impressions, and a ranking URL that changes from week to week, is the pattern to look for. Our guide to <a href="/blogs/article/find-keyword-cannibalization-search-console">finding keyword cannibalization in Search Console</a> shows the steps, and the <a href="/tools/keyword-cannibalization-checker">keyword cannibalization checker</a> does the grouping automatically when you have an export with hundreds of queries.</p>
<p>Ignore branded queries, and ignore pages that rank together at positions 1 and 2. Two results from your site on one results page is usually a good outcome, not a bug.</p>

{{infographic}}

<h2>Step 2: compare the search intent</h2>
<p>This is the step most guides skip. Open the results page for the query and ask what each result is. If your two URLs are a calculator and a how-to article, they may satisfy different intents even though the wording overlaps, and Google may be right to show both. Compare the pages on what the searcher wants to do: learn, compare, buy or use a tool. The <a href="/tools/search-intent-classifier">search intent classifier</a> labels queries in bulk if you want a quick first pass.</p>
<ul>
<li><strong>Same intent:</strong> the pages are duplicates in Google's eyes. Merge them.</li>
<li><strong>Different intent:</strong> the pages are not competing, only sounding alike. Re-target the copy so the difference is obvious.</li>
</ul>

<h2>Step 3: pick the winning page</h2>
<p>Choose the page that already has the strongest signals, not the one you prefer. Compare four things:</p>
<ol>
<li>Clicks and impressions for the query over the last three months.</li>
<li>Referring links, from other sites and from your own internal links.</li>
<li>Age and indexing history. A URL that has been indexed for a year carries more trust than one from last month.</li>
<li>How well the content answers the query today.</li>
</ol>
<p>If the signals disagree, the URL with external links usually wins, because redirects pass most of that value forward but you cannot recreate links you lose.</p>

<h2>Fix A: merge and redirect</h2>
<p>Use this when both pages target the same intent.</p>
<ol>
<li>Copy anything useful from the losing page into the winner: a missing section, a better example, an FAQ.</li>
<li>Do not paste the whole text. A longer page is only better if the extra material answers more of the query.</li>
<li>Set a permanent 301 redirect from the losing URL to the winner.</li>
<li>Update every internal link that pointed to the old URL, so visitors and crawlers do not go through a redirect.</li>
<li>Remove the old URL from the sitemap and keep the redirect in place for at least a year.</li>
</ol>

<h2>Fix B: re-target the weaker page</h2>
<p>If the pages serve different intents, make that obvious. Rewrite the title tag, H1 and first paragraph of the weaker page around its own intent, and remove repeated use of the shared keyword in headings. A tool page should lead with the action ("Check your title length"), while the guide should lead with the explanation ("Why title length is measured in pixels"). Our <a href="/blogs/article/keyword-clustering-guide">keyword clustering guide</a> explains how to assign one intent to one URL across a whole site, and the <a href="/tools/keyword-clustering-tool">keyword clustering tool</a> can do the assignment for a keyword list.</p>

<h2>Fix C: canonical, links and last resorts</h2>
<ul>
<li><strong>Canonical tag:</strong> for near-duplicates that must stay live, such as a print version or a filtered list, point rel=canonical at the preferred page. It is a hint, not a command.</li>
<li><strong>Internal links:</strong> change anchor text on weaker pages so they link to the winner for the shared query. This is the lightest fix and often enough.</li>
<li><strong>Noindex or delete:</strong> for pages that earn nothing and add nothing. Do not noindex a page you are also redirecting.</li>
</ul>

<h2>Step 4: wait, then measure</h2>
<p>Google needs to recrawl both URLs and reprocess the signals, which usually takes two to six weeks. Do not judge the result after three days. Record the date of the change, then compare clicks, impressions and average position for the target query for the six weeks before and after. A single stable URL appearing for the query is the sign that it worked. If rankings dipped after a merge, check that the redirect is a 301 and that the merged page really covers what the old one did.</p>

<h2>Mistakes to avoid</h2>
<ul>
<li><strong>Merging pages with different intent.</strong> You lose a ranking for one of them.</li>
<li><strong>Redirecting everything to the homepage.</strong> Google treats it as a soft 404.</li>
<li><strong>Fixing a problem that is not there.</strong> Two URLs at positions 1 and 2 are a win.</li>
<li><strong>Leaving internal links pointing at the old URL.</strong> It slows the consolidation.</li>
</ul>

<h2>Frequently asked questions</h2>
<h3>Does keyword cannibalization always hurt rankings?</h3>
<p>No. It hurts when the competition splits clicks, links and relevance between two pages so that neither ranks well. If both pages rank in the top results for different intents, it is harmless.</p>
<h3>Should I use a canonical tag or a 301 redirect?</h3>
<p>Use a 301 when the old page should disappear. Use a canonical when both URLs must stay accessible but one should get the credit.</p>
<h3>How long until I see the effect of a fix?</h3>
<p>Typically two to six weeks, longer on large sites that are crawled less often.</p>
<h3>Can I fix it just by changing internal links?</h3>
<p>Sometimes. If the winner is clear and the other page only ranks because your internal links point at it, re-linking alone can settle the query.</p>
`,
};
