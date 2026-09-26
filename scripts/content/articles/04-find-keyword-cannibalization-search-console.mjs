export default {
  slug: 'find-keyword-cannibalization-search-console',
  title: 'How to Find Keyword Cannibalization in Google Search Console',
  category: 'seo',
  theme: 'seo',
  tags: ['keyword cannibalization', 'keyword cannibalization checker', 'google search console', 'duplicate content seo', 'ranking fluctuations', 'seo audit'],
  description: 'Step-by-step: find keyword cannibalization in Google Search Console, tell real conflicts from harmless overlap, and decide which page should win each query.',
  cover: {
    kicker: 'Two pages, one query, neither winning',
    visual: {
      type: 'code',
      lines: [
        ['query: "margin vs markup"', 'accent'],
        '',
        ['/pricing-guide    pos 14', '#e2e8f0'],
        ['/margin-markup    pos 19', '#e2e8f0'],
        '',
        ['→ URLs swap weekly', '#fb7185'],
        ['→ neither reaches page 1', '#fb7185'],
      ],
    },
  },
  infographic: {
    type: 'steps',
    title: 'Finding cannibalization in Search Console',
    subtitle: 'Works on any property. Use at least three months of data so low-volume queries show up.',
    items: [
      ['Open Performance → Search results', 'Set the date range to the last 3 months and enable clicks, impressions and average position.'],
      ['Click a query you care about', 'This filters the whole report to that one query.'],
      ['Switch to the Pages tab', 'More than one URL listed with meaningful impressions means Google is splitting the query between pages.'],
      ['Check the date graph for swapping', 'Compare periods: if the ranking URL changes week to week, the pages are competing.'],
      ['Decide the winner', 'Keep the page that best matches the intent; merge, redirect, re-target or de-optimise the other.'],
    ],
    alt: 'Five steps for finding keyword cannibalization in Google Search Console, from the Performance report to choosing the winning page',
    caption: 'For more than a handful of queries, export the data and let a checker do the grouping.',
    footer: 'Automate it: talkandtool.com/tools/keyword-cannibalization-checker',
  },
  html: `
<p>Keyword cannibalization happens when two or more of your pages compete for the same query, so Google keeps swapping between them and neither ranks as well as one strong page would. Google Search Console shows it clearly once you know where to look. Here is the step-by-step check, and how to tell a real conflict from harmless overlap.</p>

<h2>What cannibalization looks like in the data</h2>
<p>Search Console gives three symptoms. You need at least two of them before calling it a problem:</p>
<ul>
<li><strong>Multiple URLs for one query.</strong> The Pages tab, filtered to a query, lists two or more of your URLs with a meaningful share of impressions.</li>
<li><strong>URL swapping.</strong> The URL that ranks changes from week to week, often with the position jumping as it swaps.</li>
<li><strong>A stuck position.</strong> The query hovers on page two for months despite a good page existing, because signals are split.</li>
</ul>

<h2>The manual check, step by step</h2>

{{infographic}}

<p>This works well for a handful of important queries. For a whole site it is slow: you would need to click through hundreds of queries one at a time.</p>

<h2>Checking the whole site at once</h2>
<p>Search Console's interface only shows query-to-page pairs one query at a time, but the underlying data has every pair. To audit everything:</p>
<ol>
<li>Export the Performance report with both Queries and Pages. The standard export gives them in separate tabs, which is not enough. You need the combined query-page rows, which the Search Console API, Looker Studio or the bulk data export provide.</li>
<li>Group rows by query and keep the queries where two or more pages each have a meaningful share of impressions. A reasonable threshold is 10% or more each.</li>
<li>Sort by total impressions, so the conflicts with the most at stake come first.</li>
</ol>
<p>The <a href="/tools/keyword-cannibalization-checker">keyword cannibalization checker</a> does this grouping for you. Upload the export and it lists every query shared between pages, the split of impressions and clicks, and which URL currently wins most often. Everything runs in your browser, so the data never leaves your machine.</p>

<h2>Overlap that is not a problem</h2>
<p>Seeing two URLs for one query is common and often fine. Rule these out before changing anything:</p>
<ul>
<li><strong>Brand queries.</strong> Your homepage, about page and product pages all appearing for your brand name is normal.</li>
<li><strong>Double listings.</strong> Sometimes Google shows two of your pages together, one indented under the other. That is extra visibility, not a conflict.</li>
<li><strong>Different intents on purpose.</strong> A calculator page and a guide explaining the calculation can both rank for a broad query. If each clearly wins its own specific queries, leave them alone.</li>
<li><strong>Tiny shares.</strong> A second URL with 3% of impressions at position 60 is noise.</li>
<li><strong>Technical duplicates.</strong> If the two URLs are the same page with and without a trailing slash, www, or a parameter, the fix is a canonical tag or redirect, not a content change.</li>
</ul>

<h2>Deciding which page should win</h2>
<p>For each real conflict, pick the page that best matches what the searcher wants. That is usually the one Google already prefers most often, has more links, or converts better. Then choose a fix for the other page:</p>
<ul>
<li><strong>Merge and redirect</strong> when the pages cover the same ground. Move the best parts of the weaker page into the stronger one and 301-redirect the old URL.</li>
<li><strong>Re-target</strong> when the weaker page has its own value. Rewrite its title, H1 and focus around a different, more specific query.</li>
<li><strong>De-optimise</strong> when the weaker page must stay as it is, for example a legal or product page. Remove the competing keyword from its title and headings, and link from it to the winner.</li>
<li><strong>Fix internal links</strong> in every case. Links using the query as anchor text should point to the winning page only.</li>
</ul>
<p>Our earlier guide, <a href="/blogs/article/how-to-fix-keyword-cannibalization">how to fix keyword cannibalization without deleting good pages</a>, goes through each fix in detail, including when deleting is the wrong move.</p>

<h2>How to prevent it on new content</h2>
<ul>
<li>Before writing, search your own site for the target keyword with <code>site:yourdomain.com keyword</code>. If a page already covers it, update that page instead.</li>
<li>Keep a simple keyword-to-URL map, one row per primary keyword, and check it before briefing new pages.</li>
<li>Cluster keyword lists before planning content. Queries that return the same results belong on one page. The <a href="/tools/keyword-clustering-tool">keyword clustering tool</a> groups them for you.</li>
<li>Give every page a unique title and H1. Templates that repeat a category name in every title are a common silent cause.</li>
</ul>

<h2>How long until fixes show up?</h2>
<p>After merging or re-targeting, the winning URL typically stabilises within a few weeks, once Google has recrawled both pages and processed the redirect. Track the specific query's position and ranking URL rather than site-wide averages. The first sign of success is the URL swapping stopping, and the position gain follows.</p>

<h2>Frequently asked questions</h2>
<h3>Is keyword cannibalization a Google penalty?</h3>
<p>No. It is not a penalty, just diluted signals. Google has to choose between your pages, and often ranks neither as well as it would rank one clear page.</p>
<h3>How many pages is too many for one keyword?</h3>
<p>One page per intent. Two pages can rank for a broad topic if each has its own specific focus. Two pages trying to be the answer to the same question is the problem.</p>
<h3>Can I check for cannibalization without Search Console?</h3>
<p>A <code>site:</code> search shows which pages Google associates with a keyword, but not impressions or position. Search Console data is far more reliable.</p>
`,
};
