export default {
  slug: 'how-to-find-low-competition-keywords',
  title: 'How to Find Low Competition Keywords (Free Method for New Sites)',
  category: 'seo',
  theme: 'seo',
  tags: ['low competition keywords', 'keyword research', 'long tail keywords', 'keyword difficulty', 'seo for new websites', 'free keyword tool'],
  description: 'A free, repeatable way to find low competition keywords a new website can actually rank for: read the results page, mine long-tail modifiers, and use Search Console.',
  cover: {
    kicker: 'Read the results page, not a difficulty score',
    visual: { type: 'checklist', items: ['Forums on page one', 'Outdated results', 'Titles miss the query', 'Thin, generic pages', 'Small sites ranking'] },
  },
  infographic: {
    type: 'table',
    title: 'Signs a keyword is winnable for a new site',
    subtitle: 'Search the keyword in a private window and look at the top ten results for these signals.',
    columns: ['Signal on page one', 'What it looks like', 'Why it is an opening'],
    widths: [290, 380, 386],
    rows: [
      ['Forums and Q&A', 'Reddit, Quora, forum threads', 'No dedicated page exists yet'],
      ['Outdated content', 'Dates 3+ years old, old prices', 'A current page is more useful'],
      ['Title mismatch', 'Query words missing from titles', 'Nobody targets it directly'],
      ['Thin pages', 'Short answers, no examples', 'Depth wins with little effort'],
      ['Small sites', 'Unknown domains in the top 5', 'Authority is not the barrier'],
      ['Wrong format', 'Articles where a tool fits better', 'Matching intent beats length'],
    ],
    alt: 'Table of six signs on Google’s first page that a keyword has low competition, with what each looks like and why it is an opportunity',
    caption: 'Two or three of these signals on one results page usually means the keyword is winnable.',
    footer: 'Generate ideas: talkandtool.com/tools/low-competition-keyword-finder',
  },
  html: `
<p>Low competition keywords are searches where the current top results are weak: forums, outdated posts, or pages that do not target the query directly. You find them by reading the results page, not by trusting a difficulty score. Here is a free, repeatable method that works for new websites.</p>

<h2>What "low competition" really means</h2>
<p>Every keyword tool has a difficulty score, and they rarely agree, because most estimate difficulty from the backlinks pointing at the top-ranking pages. That is part of the picture, but it misses the part a new site can exploit: how well those pages actually answer the query.</p>
<p>A keyword is winnable when the searcher's need is not being met well by what ranks today. A page with strong links but the wrong format, or a correct answer buried under 2,000 words of preamble, is beatable. A dedicated, current, well-organised page from a strong brand usually is not, whatever the difficulty score says.</p>

<h2>Step 1: Start from what you can genuinely answer</h2>
<p>List the topics where you, your product or your tools have something specific to offer. For a site of calculators and converters, that is every calculation people get wrong. For a SaaS product, it is every workflow the product touches. Low competition keywords are useless if your page cannot be the best answer.</p>

<h2>Step 2: Expand into long-tail variations</h2>
<p>Head terms like "loan calculator" are fought over by banks and comparison sites. The long tail around them is often wide open. Useful modifiers:</p>
<ul>
<li><strong>Question forms:</strong> how to, what is, why does, can I, should I</li>
<li><strong>Comparisons:</strong> X vs Y, X or Y, difference between X and Y</li>
<li><strong>Context:</strong> for beginners, for small business, for students, in Excel, by hand</li>
<li><strong>Constraints:</strong> without, free, offline, no signup, for Windows</li>
<li><strong>Specifics:</strong> numbers, years, locations, job titles, file formats</li>
</ul>
<p>The <a href="/tools/long-tail-keyword-generator">long-tail keyword generator</a> combines a seed term with these modifiers. The <a href="/tools/low-competition-keyword-finder">low competition keyword finder</a> goes a step further and scores the ideas for how likely they are to be under-served.</p>

<h2>Step 3: Read the results page for each candidate</h2>
<p>This is the step that matters. Search each candidate in a private window and look at the top ten. You are looking for the signals in the table below.</p>

{{infographic}}

<p>Also note the intent. If page one is all calculators, you need a calculator, not an essay. If it is all how-to guides, a bare tool page will struggle. The <a href="/tools/search-intent-classifier">search intent classifier</a> helps when the results are mixed. For a fuller walk-through of this manual check, see <a href="/blogs/article/how-to-check-keyword-difficulty-manually-serp">how to judge keyword difficulty by reading the search results</a>.</p>

<h2>Step 4: Use Search Console once you have any traffic</h2>
<p>Once a site is indexed, Google Search Console becomes the best low competition keyword tool you have, because it shows queries Google already associates with your pages. Sort the Queries report by impressions and look for:</p>
<ul>
<li><strong>Queries with a good position and few impressions.</strong> These are low-volume but uncontested, and a dedicated page can own them.</li>
<li><strong>Queries you rank for by accident.</strong> If a general page appears for a specific question, a page built for that question will usually outrank it.</li>
<li><strong>Page-two positions.</strong> These are covered in our guide to <a href="/blogs/article/striking-distance-keywords">striking distance keywords</a>.</li>
</ul>
<p>A real example from this site: in its first weeks, broad queries like "seo title check" sat around position 70, while specific long-tail queries such as "keyword generator deutsch" and "best keyword cannibalization checker" appeared at positions 6–7. The long tail is where a new domain gets its first clicks.</p>

<h2>Step 5: Sanity-check the volume</h2>
<p>Low competition and zero demand look the same in a difficulty score. Before writing, confirm people search for the topic at all:</p>
<ul>
<li>Google's autocomplete and "People also ask" boxes show the query exists.</li>
<li>Related searches at the bottom of the results page confirm there is a cluster, not a one-off.</li>
<li>Free volume ranges from Google Keyword Planner are rough but good enough to separate "tens" from "thousands".</li>
</ul>
<p>A keyword with 50 searches a month that you can rank first for is worth more than one with 5,000 where you will sit on page five. And a good page picks up dozens of related long-tail variants, so its real traffic is usually several times the headline volume.</p>

<h2>Step 6: Group before you write</h2>
<p>Several of your candidates will turn out to be the same search in different words. Writing one page per variant splits your signals and creates keyword cannibalization. Cluster them first with the <a href="/tools/keyword-clustering-tool">keyword clustering tool</a> and write one strong page per cluster.</p>

<h2>Mistakes that waste the effort</h2>
<ul>
<li><strong>Trusting difficulty scores alone.</strong> Always look at the live results.</li>
<li><strong>Chasing zero-volume keywords.</strong> Check demand exists before investing a day in a page.</li>
<li><strong>Ignoring intent.</strong> A beautifully written article cannot rank for a query where Google only shows tools.</li>
<li><strong>Going too broad too early.</strong> A new site earns authority from many small wins, then moves up to harder terms.</li>
</ul>

<h2>Frequently asked questions</h2>
<h3>What is a good keyword difficulty for a new website?</h3>
<p>Most tools suggest under 10–20 on a 100-point scale, but treat that as a first filter only. A low score with a strong, dedicated page in position one is still hard; a higher score with forums ranking can be easy.</p>
<h3>Can I find low competition keywords for free?</h3>
<p>Yes. Google autocomplete, the results page itself, Search Console and Keyword Planner cover everything you need. Paid tools save time, not insight.</p>
<h3>How many low competition keywords should one page target?</h3>
<p>One primary keyword plus its close variants, meaning every query that returns mostly the same results. Different intents deserve different pages.</p>
`,
};
