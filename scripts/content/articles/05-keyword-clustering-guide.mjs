export default {
  slug: 'keyword-clustering-guide',
  title: 'Keyword Clustering: How to Group Keywords Into Pages',
  category: 'seo',
  theme: 'seo',
  tags: ['keyword clustering', 'keyword grouping', 'serp overlap', 'content planning', 'topic clusters', 'keyword mapping'],
  description: 'Keyword clustering groups searches that Google answers with the same results, so each group gets one page. Learn the SERP-overlap method with real examples.',
  cover: {
    kicker: 'One page per search intent, not per keyword',
    visual: {
      type: 'code',
      lines: [
        ['cluster: margin vs markup', 'accent'],
        '  markup vs margin',
        '  difference between markup',
        '    and margin',
        '  gross margin vs markup',
        '',
        ['cluster: markup calculator', 'accent'],
      ],
    },
  },
  infographic: {
    type: 'table',
    title: 'Example: one keyword list, three pages',
    subtitle: 'Queries based on this site’s own Search Console data, grouped by whether Google shows the same results for them.',
    columns: ['Page', 'Keywords in the cluster', 'Intent'],
    widths: [270, 560, 226],
    rows: [
      ['Margin vs markup guide', 'markup vs margin · margin v markup · gross margin vs markup', 'Understand'],
      ['', 'difference between markup and margin', ''],
      ['Margin calculator', 'margin calculator · markup calculator', 'Calculate'],
      ['APR vs interest rate', 'difference between rate and apr · interest rate vs apr', 'Understand'],
      ['', 'how can apr be lower than interest rate', ''],
      ['Flat rate vs APR', 'difference between apr and flat rate · flat rate vs apr', 'Compare'],
    ],
    alt: 'Table showing search queries grouped into clusters, each assigned to one page with its search intent',
    caption: 'Similar wording does not guarantee one cluster: “flat rate vs APR” is a different question from “interest rate vs APR”, so it gets its own page.',
    footer: 'Cluster your list: talkandtool.com/tools/keyword-clustering-tool',
  },
  html: `
<p>Keyword clustering is grouping keywords that Google answers with the same results, so each group gets one page instead of several competing ones. The most reliable way to do it is by SERP overlap: if two keywords share several of the same top-ranking URLs, they belong on the same page. Here is the method, with real examples.</p>

<h2>Why cluster keywords at all?</h2>
<p>A keyword list of 500 terms is not a plan for 500 pages. Most of those terms are the same need phrased differently: "markup vs margin", "margin vs markup", "difference between markup and margin". Writing a page for each creates thin, near-duplicate content and keyword cannibalization, where your own pages compete and none of them wins.</p>
<p>Clustering turns the list into a site map: one strong page per cluster, each targeting a primary keyword and naturally ranking for dozens of variants. A single good page commonly ranks for hundreds of queries, which is why a cluster's combined volume matters more than any one keyword's.</p>

<h2>The two ways to cluster</h2>
<h3>Semantic clustering</h3>
<p>Groups keywords by meaning, using shared words, synonyms or language models. It is fast and needs no search data, but it makes confident mistakes. "Apple pie recipe" and "apple pie calories" are semantically close and need different pages. "CV" and "resume" share no words and often do not need separate pages.</p>
<h3>SERP-overlap clustering</h3>
<p>Groups keywords by whether Google ranks the same URLs for them. If "keyword grouper" and "keyword clustering tool" return six of the same top ten results, Google treats them as one intent and so should you. This is slower, because it needs live results for every keyword, but it reflects how Google actually sees the queries.</p>
<p>The common rule of thumb: keywords sharing <strong>three or more of the top ten URLs</strong> go in one cluster. Use four or five for a stricter grouping on competitive topics.</p>

<h2>A worked example</h2>
<p>Here is how a set of real queries from this site's Search Console groups up:</p>

{{infographic}}

<p>Two things stand out. First, word order and phrasing barely matter. Every "margin vs markup" variant belongs on one guide. Second, adding "calculator" changes the intent completely: people searching "markup calculator" want a tool, and Google shows tools. That query belongs on the <a href="/tools/margin-markup-calculator">margin and markup calculator</a>, not in the guide. The guide itself is <a href="/blogs/article/margin-vs-markup-pricing-guide">margin vs markup: why the difference costs businesses money</a>.</p>

<h2>How to cluster a keyword list step by step</h2>
<ol>
<li><strong>Clean the list.</strong> Remove duplicates, obvious junk and anything you would never write about. The <a href="/tools/remove-duplicate-lines">remove duplicate lines</a> tool handles exact duplicates in a pasted list.</li>
<li><strong>Sort by volume.</strong> Start clusters from the highest-volume keywords. They usually become the primary keyword of their cluster.</li>
<li><strong>Compare results.</strong> For each keyword, check whether its top results overlap with an existing cluster's primary keyword. Join the cluster if they do; start a new one if not.</li>
<li><strong>Label the intent.</strong> Informational, commercial, transactional or navigational. A cluster should have one. If it looks mixed, it is probably two clusters. The <a href="/tools/search-intent-classifier">search intent classifier</a> gives a quick first pass.</li>
<li><strong>Map each cluster to a URL.</strong> Either an existing page, which you update, or a new one. Never two.</li>
<li><strong>Brief the page.</strong> The primary keyword goes in the title and H1. Secondary keywords become subheadings, FAQs or examples. The <a href="/tools/seo-content-brief-generator">content brief generator</a> turns a cluster into an outline.</li>
</ol>
<p>By hand this takes minutes per keyword. The <a href="/tools/keyword-clustering-tool">keyword clustering tool</a> groups a pasted list automatically, which is the practical choice once a list passes a few dozen terms.</p>

<h2>Clusters, pillars and internal links</h2>
<p>Once you have clusters, look at how they relate. Several clusters usually sit under a broader topic. "Margin vs markup", "break-even point" and "pricing for a target margin" all sit under "small business pricing". That broader topic can become a hub page linking to each cluster page, with each cluster page linking back.</p>
<p>That structure helps visitors and gives Google a clear map of which page is the authority on each subtopic. It also makes internal linking deliberate rather than accidental, which is one of the cheapest ways to lift rankings.</p>

<h2>Common clustering mistakes</h2>
<ul>
<li><strong>Clustering by shared words.</strong> "Loan calculator" and "loan calculator formula" share words but may want a tool and an explanation respectively. Check the results.</li>
<li><strong>Clusters that are too big.</strong> If a cluster needs 6,000 words to cover, it is probably several intents. Split it.</li>
<li><strong>Forgetting existing pages.</strong> Map clusters against what you already have before briefing anything new, or you will create the cannibalization you set out to avoid.</li>
<li><strong>Treating it as one-off.</strong> Search Console surfaces new queries every month. Re-cluster quarterly and slot new queries into existing pages where they fit.</li>
</ul>

<h2>Frequently asked questions</h2>
<h3>How many keywords should be in one cluster?</h3>
<p>There is no fixed number. Some clusters have two keywords, others fifty. The deciding factor is whether Google returns the same results, not the count.</p>
<h3>What SERP overlap threshold should I use?</h3>
<p>Three shared URLs in the top ten is the common default. Raise it to four or five for broad, competitive topics where you want tighter, more specific pages.</p>
<h3>Can I cluster keywords without paid tools?</h3>
<p>Yes. Manual SERP comparison works for small lists, and free tools can handle a pasted list. Paid platforms mainly add scale and volume data.</p>
`,
};
