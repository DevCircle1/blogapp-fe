export default {
  slug: 'hreflang-x-default-and-common-errors',
  title: 'Hreflang x-default and the 8 Errors That Break It',
  category: 'seo',
  theme: 'seo',
  tags: ['hreflang x-default', 'hreflang errors', 'hreflang return tags', 'en-uk hreflang', 'international seo', 'hreflang validation'],
  description: 'What the x-default hreflang value does, when to use it, and the eight mistakes that make Google ignore your hreflang tags, with the fix for each.',
  cover: {
    kicker: 'Why Google ignores your hreflang',
    visual: { type: 'checklist', items: ['Return tag on every page', 'Absolute canonical URLs', 'en-GB, not en-UK', 'No redirects or noindex', 'x-default for the rest'] },
  },
  infographic: {
    type: 'table',
    title: 'Eight hreflang errors and their fixes',
    subtitle: 'Check these first when annotations are not being picked up.',
    columns: ['Error', 'Wrong', 'Right'],
    widths: [370, 320, 366],
    rows: [
      ['Wrong region code', 'hreflang="en-UK"', 'hreflang="en-GB"'],
      ['Underscore separator', 'hreflang="en_US"', 'hreflang="en-US"'],
      ['Region without language', 'hreflang="GB"', 'hreflang="en-GB"'],
      ['Country code as language', 'hreflang="jp"', 'hreflang="ja"'],
      ['Relative URL', 'Path only: /de/', 'Full URL: https://example.com/de/'],
      ['No return link', 'A → B only', 'A → B and B → A'],
      ['Missing self-reference', 'Page omits itself', 'Page lists itself'],
      ['Points to a redirect', 'href to a 301 URL', 'href to the final 200 URL'],
    ],
    alt: 'Table of eight common hreflang errors, each with the wrong form and the correct form',
    caption: 'The first four are typos a validator catches instantly; the last four need a crawl.',
    footer: 'Validate your codes: talkandtool.com/tools/hreflang-tag-generator',
  },
  html: `
<p>The x-default value tells search engines which page to show when none of your listed languages matches the searcher. It is one of several details in hreflang that are easy to get wrong, and a single error in a set can lead Google to ignore the group. This guide explains x-default, when to use it, and the eight most common mistakes with their fixes.</p>

<h2>What x-default means</h2>
<p><code>hreflang="x-default"</code> marks the fallback version of a page. Suppose you publish in English, German and Spanish. A visitor from France searches, and none of your tags matches French. With x-default, Google has a designated page to show, rather than guessing from the other three.</p>
<p>Use it in one of two ways:</p>
<ul>
<li><strong>A language selector page</strong>, where visitors pick their language. This is the case Google describes explicitly.</li>
<li><strong>Your main version</strong>, usually the English or global page, when you have no selector.</li>
</ul>
<p>The tag is optional. It never replaces the regular language tags, and the same URL can appear both under its own language code and as x-default. Like any alternate, the x-default page must link back to every other version. For the basics, start with the <a href="/blogs/article/hreflang-tags-guide">hreflang tags guide</a>.</p>

{{infographic}}

<h2>The eight errors</h2>
<h3>1. Using en-UK instead of en-GB</h3>
<p>The region is an ISO 3166-1 code, and the United Kingdom's code is GB. "UK" is a reserved or exceptional code that browsers and search engines do not accept in this attribute. Always write <code>en-GB</code>.</p>
<h3>2. Underscores instead of hyphens</h3>
<p>Locale strings in programming languages use <code>en_US</code>. Hreflang uses <code>en-US</code>. Template systems often leak the underscore form into the tag.</p>
<h3>3. A region with no language</h3>
<p>You cannot target a country alone. <code>hreflang="GB"</code> is invalid. Google targets by language first, with an optional region, so the minimum is a language such as <code>en</code>.</p>
<h3>4. A country code where a language code belongs</h3>
<p>Japan is <code>JP</code> as a country but Japanese is <code>ja</code> as a language. The same trap applies to Greek (<code>el</code>, not <code>gr</code>), Chinese (<code>zh</code>, not <code>cn</code>), and Korean (<code>ko</code>, not <code>kr</code>). The <a href="/tools/hreflang-tag-generator">hreflang tag generator</a> catches each of these and tells you the fix.</p>
<h3>5. Relative URLs</h3>
<p>Hreflang requires fully qualified URLs, including the protocol. A bare path such as <code>/de/</code> will not work. Use <code>https://example.com/de/</code>.</p>
<h3>6. Missing return links</h3>
<p>If your English page points to the German page but the German page does not point back, Google ignores the pair. This is the most common real-world failure, and it usually appears when a new language is added to some templates but not others. Crawl your site and check that each annotation has a partner.</p>
<h3>7. No self-reference</h3>
<p>Each page should list itself in its own set. A page that lists the other versions but not itself leaves the group incomplete. It is an easy omission when you hand-write the tags for "the other languages".</p>
<h3>8. Pointing to URLs that redirect, 404 or are noindexed</h3>
<p>Hreflang must point to final, indexable pages that return a 200 status. A URL that redirects, errors or carries a noindex directive cannot be shown in results, and the annotation is discarded. The URL in the tag should also match the page's canonical. Look up unfamiliar responses in the <a href="/blogs/article/http-status-codes-cheat-sheet">HTTP status codes cheat sheet</a>.</p>

<h2>How to check your tags</h2>
<ol>
<li>Validate codes before you publish. A typo takes seconds to catch in a generator and weeks to notice in search results.</li>
<li>Crawl a sample of pages and confirm each page lists every alternate, including itself, with absolute canonical URLs.</li>
<li>Spot-check the return links in both directions for a few pairs.</li>
<li>In Search Console, check the indexing of each language version. A version that is not indexed cannot be served, whatever its tags say.</li>
</ol>

<h2>Frequently asked questions</h2>
<h3>Do I have to add x-default?</h3>
<p>No, but it is recommended when you have a selector page or a clear global default, because it handles every searcher your other tags do not.</p>
<h3>Can two languages share one URL?</h3>
<p>Not in the same hreflang set. Each language-region value should point to its own URL, and a URL should belong to one language.</p>
<h3>Is it a problem to have both en and en-GB?</h3>
<p>No. A common pattern is <code>en</code> as the general English page and <code>en-GB</code> or <code>en-AU</code> as regional variants. The regional page is shown to those users, and the plain <code>en</code> page to every other English speaker.</p>
<h3>Why do I see "no return tags" in tools?</h3>
<p>Because a page in the set does not link back to another. Fix it by adding the full, identical set to every version, which is also the easiest way to keep the set in sync.</p>
`,
};
