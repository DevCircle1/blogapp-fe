export default {
  slug: 'search-console-regex-filters',
  title: 'Search Console Regex: 12 Filters to Copy and Paste',
  category: 'seo',
  theme: 'seo',
  tags: ['search console regex', 'gsc regex filter', 'brand vs non-brand', 'question queries', 're2 regex', 'long tail keywords'],
  description: 'Copy-ready regex patterns for the Google Search Console Performance filter: question queries, brand vs non-brand, long-tail, folders. Plus why some patterns return no data.',
  cover: {
    kicker: 'Performance → Query → Custom (regex)',
    visual: {
      type: 'code',
      title: 'Question queries',
      lines: ['(?i)^(who|what|when', '|where|why|how)\\b'],
    },
  },
  infographic: {
    type: 'table',
    title: 'Regex filters worth saving',
    subtitle: 'Paste into Performance → + Add filter → Query (or Page) → Custom (regex).',
    columns: ['Goal', 'Filter', 'Pattern'],
    widths: [360, 260, 436],
    rows: [
      ['Question queries', 'Query · matches', '(?i)^(what|why|how)\\b'],
      ['Brand queries', 'Query · matches', '(?i)(acme|acmé|akme)'],
      ['Non-brand queries', "Query · doesn't match", 'same as brand'],
      ['5+ word queries', 'Query · matches', '^(\\S+\\s+){4,}\\S+$'],
      ['One site section', 'Page · matches', '/(blog|guides)/'],
      ['Comparison queries', 'Query · matches', '(?i)\\b(vs|versus|or)\\b'],
    ],
    alt: 'Table of six Search Console regex filters: question queries, brand, non-brand, long-tail, site section and comparison queries',
    caption: 'Matching is case-sensitive unless the pattern starts with (?i).',
    footer: 'Build and test yours: talkandtool.com/tools/search-console-regex-generator',
  },
  html: `
<p>The regex filter in Google Search Console turns the Performance report from a long list of queries into answers: which questions people ask, how much traffic is brand versus non-brand, which long-tail searches you already rank for. Below are twelve patterns you can paste in as they are, and the rules that make a pattern silently return nothing.</p>

<h2>Where the regex filter is</h2>
<ol>
<li>Open <strong>Performance → Search results</strong>.</li>
<li>Click <strong>+ Add filter</strong> and choose <strong>Query</strong> or <strong>Page</strong>.</li>
<li>Change the dropdown from "Queries containing" to <strong>Custom (regex)</strong>.</li>
<li>Choose <strong>Matches regex</strong> or <strong>Doesn't match regex</strong>, paste the pattern and apply.</li>
</ol>
<p>The filter applies to every tab in the report, so a Query filter also narrows the Pages, Countries and Dates views. That is what makes it useful: filter to question queries, then switch to Pages to see which URLs answer them.</p>

{{infographic}}

<h2>Three rules that save an afternoon</h2>
<h3>1. It is case-sensitive unless you say otherwise</h3>
<p>Search Console matches case-sensitively by default. Most queries are lowercase, but URLs and some queries are not, so start patterns with <code>(?i)</code> to ignore case. It must come first; in the middle of a pattern it does not do what you expect.</p>
<h3>2. It matches anywhere in the text</h3>
<p>A pattern does not need to match the whole query. <code>calculator</code> keeps "loan calculator" and "calculator for gpa". Use <code>^</code> for "starts with" and <code>$</code> for "ends with", and both for an exact match.</p>
<h3>3. It is RE2, not the regex you know</h3>
<p>Search Console uses Google's RE2 engine, which leaves out features that can make regex slow. Lookaheads like <code>(?!brand)</code>, lookbehinds and backreferences like <code>\\1</code> are not supported, and a pattern that uses them does not show an error: the report just comes back empty. For exclusions, use <strong>Doesn't match regex</strong> instead of a negative lookahead. The <a href="/tools/search-console-regex-generator">Search Console regex generator</a> flags these features before you paste a pattern, and lets you test it against a list of your own queries.</p>

<h2>Twelve patterns to copy</h2>
<h3>Queries people phrase as questions</h3>
<p><code>(?i)^(who|what|when|where|why|how|which|can|does|is|are|should)\\b</code></p>
<p>These are the queries a FAQ section or an H2 with a direct answer can win. Sort the result by impressions and look for questions with impressions but no clicks. Each is a heading your page is missing.</p>
<h3>Brand and non-brand traffic</h3>
<p><code>(?i)(acme|acmé|akme|acme tools)</code></p>
<p>Include the misspellings and spacing variants people actually type: check the query list for them. Use the same pattern with <strong>Doesn't match regex</strong> for non-brand traffic. Non-brand clicks are the number that tells you whether content and rankings are growing, since brand clicks mostly follow your marketing.</p>
<h3>Long-tail queries</h3>
<p><code>^(\\S+\\s+){4,}\\S+$</code> keeps queries of five words or more. Change the 4 to adjust. New sites usually rank for long, specific queries first, so this is where to look for early traction and for groups of queries that deserve their own page. The <a href="/tools/keyword-clustering-tool">keyword clustering tool</a> groups an export of them into page-sized topics.</p>
<h3>Comparison and alternative queries</h3>
<p><code>(?i)\\b(vs|versus|alternative|alternatives|compared|comparison)\\b</code></p>
<p>Comparison queries signal someone close to a decision. If you rank for them on page two, a dedicated comparison section is often enough to move up.</p>
<h3>Price and "free" intent</h3>
<p><code>(?i)\\b(free|cheap|price|pricing|cost|best)\\b</code></p>
<h3>"How to" and tutorial intent</h3>
<p><code>(?i)^how (to|do|can)\\b</code></p>
<h3>Queries containing a number or year</h3>
<p><code>\\b20[0-9]{2}\\b</code> finds queries with a year. If your page title still says last year, these are the clicks you are losing.</p>
<h3>Two words in any order</h3>
<p><code>(?i)(keyword.*density|density.*keyword)</code></p>
<p>RE2 cannot say "contains both words" with lookaheads, so list both orders. With three words that is six orders; the generator writes them for you.</p>
<h3>One section of the site (Page filter)</h3>
<p><code>/(blog|guides)/</code> on the Page filter. On a multilingual site, <code>^https://example\\.com/de/</code> isolates the German pages so you can compare languages without exporting.</p>
<h3>Several specific pages</h3>
<p><code>(/pricing$|/features$|/compare/)</code> tracks a handful of money pages together.</p>
<h3>Exact queries only</h3>
<p><code>(?i)^(word counter|word count|count words)$</code> keeps those queries and nothing that merely contains them.</p>
<h3>Queries with a typo of your brand</h3>
<p><code>(?i)ac+m+e</code> catches doubled letters. Keep it narrow, or you will match unrelated words.</p>

<h2>Turning a filtered list into work</h2>
<p>A filter is only useful if it ends in a change to a page. Three workflows that do:</p>
<ul>
<li><strong>Question queries → FAQ entries.</strong> Filter to questions, open the Pages tab, and for the top page add the unanswered questions as headings with a two-sentence answer under each.</li>
<li><strong>Long-tail queries on page two → quick wins.</strong> Export the filtered Queries table and drop it into the <a href="/tools/striking-distance-keywords">striking distance keywords finder</a>, which sorts positions 11–20 by the clicks you would gain. The method is covered in <a href="/blogs/article/striking-distance-keywords">turning page-2 rankings into clicks</a>.</li>
<li><strong>Non-brand pages with low CTR → title rewrites.</strong> Export the non-brand Pages table and run it through the <a href="/tools/gsc-ctr-analyzer">CTR analyzer</a>, which compares each page's click-through rate with what its position should earn.</li>
</ul>

<h2>Frequently asked questions</h2>
<h3>Why does my regex return no data in Search Console?</h3>
<p>Usually because it uses syntax RE2 does not support, such as a lookahead or a backreference, or because it is case-sensitive and does not match the case of the queries. Add <code>(?i)</code> at the start and remove lookarounds.</p>
<h3>Is there a length limit?</h3>
<p>Yes, 4,096 characters. Long brand lists rarely get close, but generated keyword lists can.</p>
<h3>Can I save a regex filter?</h3>
<p>Search Console keeps filters in the URL, so bookmarking the filtered report saves it. Keep your patterns in a document too, because they are easy to lose.</p>
<h3>Does the filter work in the Search Console API and Looker Studio?</h3>
<p>The Search Analytics API supports regex filters with the same RE2 syntax through the <code>includingRegex</code> and <code>excludingRegex</code> operators. Looker Studio has its own regex functions, also based on RE2.</p>
`,
};
