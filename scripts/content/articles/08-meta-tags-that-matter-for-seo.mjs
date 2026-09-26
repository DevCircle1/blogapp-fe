export default {
  slug: 'meta-tags-that-matter-for-seo',
  title: 'Which Meta Tags Matter for SEO in 2026 (and Which to Delete)',
  category: 'seo',
  theme: 'seo',
  tags: ['meta tags', 'meta tag generator', 'meta keywords', 'meta robots', 'open graph tags', 'technical seo'],
  description: 'Only a handful of meta tags affect how Google indexes and shows your pages. Here is which to keep, which Google ignores (including meta keywords), and correct examples.',
  cover: {
    kicker: 'Keep six, delete the rest',
    visual: {
      type: 'code',
      lines: [
        ['<title>…</title>', 'accent'],
        ['<meta name="description">', 'accent'],
        ['<meta name="robots">', 'accent'],
        ['<meta name="viewport">', 'accent'],
        ['<meta name="keywords">', '#64748b'],
        ['<meta name="revisit-after">', '#64748b'],
        ['<meta name="author">', '#94a3b8'],
      ],
    },
  },
  infographic: {
    type: 'table',
    title: 'Meta tags: what Google uses and what to delete',
    subtitle: 'Based on Google Search Central documentation for supported meta tags and attributes.',
    columns: ['Tag', 'Used by Google?', 'Verdict'],
    widths: [380, 330, 346],
    rows: [
      ['<title>', 'Yes: title link in results', 'Essential, unique per page'],
      ['meta description', 'Yes: often the snippet', 'Keep, write for clicks'],
      ['meta robots / googlebot', 'Yes: indexing and snippets', 'Keep where needed'],
      ['meta viewport', 'Yes: mobile-friendly rendering', 'Essential'],
      ['meta charset', 'Yes: reading the page correctly', 'Essential'],
      ['og: and twitter: tags', 'No, used by social platforms', 'Keep for shares'],
      ['meta keywords', 'No: ignored since 2009', 'Delete'],
      ['revisit-after, distribution', 'No', 'Delete'],
    ],
    alt: 'Table listing common HTML meta tags, whether Google uses each one, and whether to keep or delete it',
    caption: 'Canonical and hreflang are link elements, not meta tags, but belong in the same head audit.',
    footer: 'Generate correct tags: talkandtool.com/tools/meta-tag-generator',
  },
  html: `
<p>Only a handful of meta tags affect how Google indexes and displays your pages: the title, the meta description, meta robots, viewport and charset. Social tags such as Open Graph matter for shares, not rankings. The meta keywords tag has been ignored by Google since 2009 and can simply be deleted. Here is what each tag does and how to write it correctly.</p>

<h2>The quick verdict</h2>

{{infographic}}

<h2>The tags that matter</h2>
<h3>Title</h3>
<p>Technically an element, not a meta tag, but it is the most important line in the head. It usually becomes the clickable headline in search results and is a strong relevance signal. One unique, descriptive title per page, roughly 50–60 characters. More in <a href="/blogs/article/seo-title-length-pixel-limit">SEO title length and pixel limits</a>.</p>
<pre><code>&lt;title&gt;Loan Calculator: Monthly Payment and Total Interest&lt;/title&gt;</code></pre>

<h3>Meta description</h3>
<p>Not a ranking factor, but Google often uses it as the snippet under your title, and the snippet decides the click. About 150–160 characters, specific to the page, leading with the answer or benefit.</p>
<pre><code>&lt;meta name="description" content="Work out your monthly loan payment, total interest and payoff date. Free, instant, and it shows the full amortization schedule."&gt;</code></pre>

<h3>Meta robots</h3>
<p>Controls indexing and snippet behaviour. You only need it when you want something other than the default (index, follow):</p>
<ul>
<li><code>noindex</code> keeps a page out of search results. Use it for thank-you pages, internal search results and thin tag archives.</li>
<li><code>nofollow</code> tells Google not to follow links on the page. It is rarely needed at page level.</li>
<li><code>max-snippet</code>, <code>max-image-preview</code> and <code>max-video-preview</code> control snippet length and preview size. <code>max-image-preview:large</code> lets Google use large images in Discover and results.</li>
<li><code>nosnippet</code> hides the text snippet entirely. It is rarely a good idea.</li>
</ul>
<pre><code>&lt;meta name="robots" content="index, follow, max-image-preview:large"&gt;</code></pre>
<p>Important: a <code>noindex</code> only works if Google can crawl the page. Blocking the URL in robots.txt as well means Google never sees the noindex. The <a href="/tools/robots-txt-generator">robots.txt generator</a> helps keep the two consistent, and <a href="/blogs/article/how-to-remove-a-page-from-google-search">how to remove a page from Google search</a> explains the order to do things in.</p>

<h3>Viewport and charset</h3>
<p>Neither is glamorous, and both are essential. Without a viewport tag, mobile browsers render the page at desktop width, and Google indexes the mobile version. Without a declared charset, special characters can turn into garbage.</p>
<pre><code>&lt;meta charset="utf-8"&gt;
&lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;</code></pre>

<h3>Open Graph and Twitter tags</h3>
<p>These control the title, description and image when a link is shared on social platforms and messaging apps. They do not affect Google rankings, but a shared link with a proper image gets far more clicks than a bare URL. At minimum: <code>og:title</code>, <code>og:description</code>, <code>og:image</code> (1200×630 works everywhere), <code>og:url</code> and <code>twitter:card</code>.</p>

<h2>Head elements that are not meta tags but belong in the audit</h2>
<ul>
<li><strong>Canonical</strong> (<code>&lt;link rel="canonical"&gt;</code>) tells Google which URL is the main version when the same content is reachable at several addresses. Every indexable page should have a self-referencing canonical.</li>
<li><strong>Hreflang</strong> (<code>&lt;link rel="alternate" hreflang="…"&gt;</code>) connects language versions of a page. It is essential for multilingual sites, and every version must link to all the others, including itself.</li>
<li><strong>Structured data</strong> (JSON-LD scripts) is not a meta tag, but it is often the most valuable thing in the head. See <a href="/blogs/article/schema-markup-rich-results-2026">which schema markup still gets rich results</a>.</li>
</ul>

<h2>The tags to delete</h2>
<h3>Meta keywords</h3>
<p>Google announced in 2009 that it does not use the keywords meta tag in web ranking, and that is still true. Worse, the tag publishes your target keyword list for competitors to read. Some search engines have described keyword-stuffed meta keywords as a spam signal. Delete it.</p>
<h3>Other leftovers</h3>
<p><code>revisit-after</code>, <code>distribution</code>, <code>rating</code> (unless you need to mark adult content), <code>copyright</code>, <code>language</code> and <code>generator</code> do nothing for Google Search. <code>language</code> in particular is ignored. Google detects language from the content, and you declare it properly with the <code>lang</code> attribute on the <code>&lt;html&gt;</code> element plus hreflang.</p>
<p>They are harmless but add clutter and, in the case of <code>generator</code>, advertise your CMS version to anyone scanning for vulnerable installs.</p>

<h2>Generate the full set in one go</h2>
<p>The <a href="/tools/meta-tag-generator">meta tag generator</a> produces the title, description, robots, canonical, Open Graph and Twitter tags together from one form, so the social and search versions never drift apart. Then check the result with the <a href="/tools/seo-title-meta-checker">title and description checker</a> to confirm nothing will be truncated.</p>

<h2>Frequently asked questions</h2>
<h3>Do meta tags still matter for SEO?</h3>
<p>A few do. The title and robots directives directly affect ranking and indexing, and the description affects clicks. Most other meta tags do not affect Google Search at all.</p>
<h3>Should I add a meta keywords tag?</h3>
<p>No. Google ignores it, and it reveals your keyword targets to competitors.</p>
<h3>Where do meta tags go?</h3>
<p>Inside the <code>&lt;head&gt;</code> of the HTML. Google reads meta tags only from the head, and tags placed in the body may be ignored.</p>
`,
};
