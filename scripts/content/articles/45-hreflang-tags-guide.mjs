export default {
  slug: 'hreflang-tags-guide',
  title: 'Hreflang Tags: How to Add Them Correctly (HTML, Header, Sitemap)',
  category: 'seo',
  theme: 'seo',
  tags: ['hreflang', 'hreflang tags', 'multilingual seo', 'international seo', 'language targeting', 'alternate links'],
  description: 'What hreflang does, the syntax, and the three ways to add it: HTML link tags, HTTP headers and XML sitemaps, with copy-ready examples for a three-language site.',
  cover: {
    kicker: 'Right language, right searcher',
    visual: {
      type: 'code',
      title: 'In the head of every version',
      lines: [
        ['<link rel="alternate"', 'accent'],
        '  hreflang="de"',
        '  href="https://example.com/de/" />',
        '',
        '<!-- one per language, on every page -->',
      ],
    },
  },
  infographic: {
    type: 'table',
    title: 'Three ways to add hreflang',
    subtitle: 'Pick one method per page and keep it consistent.',
    columns: ['Method', 'Where it goes', 'Best for', 'Watch out for'],
    widths: [200, 280, 280, 296],
    rows: [
      ['HTML link tags', '<head> of each page', 'Most sites; small to medium page counts', 'Adds weight to every page'],
      ['HTTP header', 'Server response header', 'PDFs and other non-HTML files', 'Needs server or CDN config'],
      ['XML sitemap', 'Sitemap with xhtml:link', 'Large sites; no template access', 'Every URL repeats the full set'],
    ],
    alt: 'Table comparing the three ways to add hreflang: HTML link tags, HTTP headers and XML sitemaps',
    caption: 'All three are equally valid to Google. The failure is in the content of the tags, not the method.',
    footer: 'Generate the tags: talkandtool.com/tools/hreflang-tag-generator',
  },
  html: `
<p>Hreflang tags tell search engines which language and region each version of a page is meant for, so a searcher in Germany is shown your German page and a searcher in Spain your Spanish one. They do not boost rankings by themselves; they help Google pick the right version among pages that already exist. This guide covers the syntax, the three ways to add the tags, and the rules that decide whether they work.</p>

<h2>What hreflang does and does not do</h2>
<p>If you have the same page in several languages (or in one language for several regions, such as English for the US and the UK), Google can treat them as duplicates or show the wrong one. Hreflang links the versions into a group and tells Google to swap in the best match for each searcher's language and location.</p>
<p>It does not translate anything, it does not consolidate ranking signals the way a canonical tag does, and it only works between pages that are genuine alternates of each other. It is also a hint rather than a command: Google may still show a different version if it judges that better. If you have only one version of each page, you do not need it.</p>

<h2>The syntax</h2>
<p>Each annotation has a language code, an optional region code and a URL:</p>
<p><code>&lt;link rel="alternate" hreflang="en-GB" href="https://example.com/uk/" /&gt;</code></p>
<ul>
<li><strong>Language:</strong> a two-letter ISO 639-1 code in lowercase, such as <code>en</code>, <code>de</code>, <code>es</code>.</li>
<li><strong>Region (optional):</strong> a two-letter ISO 3166-1 code in capitals after a hyphen, such as <code>en-GB</code> or <code>es-MX</code>. You cannot use a region on its own.</li>
<li><strong>x-default (optional):</strong> the page to show when no listed language fits, normally a language selector or your main version.</li>
<li><strong>URL:</strong> absolute, with the protocol, exactly as the page's canonical URL.</li>
</ul>

{{infographic}}

<h2>Method 1: HTML link tags</h2>
<p>Place one tag per version in the <code>&lt;head&gt;</code> of every version, including a tag that points to the page itself. For a site in English, German and Spanish, every one of the three pages carries all of these:</p>
<p><code>&lt;link rel="alternate" hreflang="en" href="https://example.com/" /&gt;</code><br />
<code>&lt;link rel="alternate" hreflang="de" href="https://example.com/de/" /&gt;</code><br />
<code>&lt;link rel="alternate" hreflang="es" href="https://example.com/es/" /&gt;</code><br />
<code>&lt;link rel="alternate" hreflang="x-default" href="https://example.com/" /&gt;</code></p>
<p>The <a href="/tools/hreflang-tag-generator">hreflang tag generator</a> writes this set from a list of languages and URLs, and flags invalid codes.</p>

<h2>Method 2: HTTP headers</h2>
<p>For files that have no <code>&lt;head&gt;</code>, such as PDFs, send the annotations in the response header:</p>
<p><code>Link: &lt;https://example.com/guide.pdf&gt;; rel="alternate"; hreflang="en", &lt;https://example.com/de/guide.pdf&gt;; rel="alternate"; hreflang="de"</code></p>
<p>This needs a server or CDN rule to set the header, so it is usually used only where HTML tags are not possible.</p>

<h2>Method 3: XML sitemap</h2>
<p>You can place the annotations in your sitemap instead of the pages. Each <code>&lt;url&gt;</code> entry lists itself and every alternate as <code>xhtml:link</code> elements, and the <code>urlset</code> must declare the <code>xhtml</code> namespace. It is easier to maintain on a large site, because you change one file instead of every template. The same generator produces this format.</p>

<h2>The four rules that matter</h2>
<ol>
<li><strong>Return links.</strong> If page A points to page B, page B must point back to A. A one-way annotation is ignored. This is the most common failure.</li>
<li><strong>Self-reference.</strong> Every page lists itself among its alternates.</li>
<li><strong>Canonical URLs.</strong> The URLs in the tags must be the canonical, indexable version of each page: no redirects, no noindex, no parameters that canonicalise elsewhere.</li>
<li><strong>Valid codes.</strong> "en-UK" and "jp" are not valid; use <code>en-GB</code> and <code>ja</code>. Underscores such as <code>en_US</code> are wrong as well.</li>
</ol>
<p>Mistakes in any of these can cause Google to disregard the whole group, which is why a generator that validates is safer than typing the tags by hand. See also the <a href="/blogs/article/hreflang-x-default-and-common-errors">x-default tag and common hreflang errors</a>.</p>

<h2>Which method should you choose?</h2>
<p>Use HTML tags unless you have a reason not to. Choose the sitemap if you have thousands of pages or cannot edit the templates, and the HTTP header for non-HTML files. Do not mix methods for the same page unless the sets are identical, because conflicting annotations are harder to debug. After you ship, check your coverage in the pages report in Search Console and make sure each version is still being indexed. Related tooling: the <a href="/tools/meta-tag-generator">meta tag generator</a> covers the rest of the head.</p>

<h2>Frequently asked questions</h2>
<h3>Do I need hreflang for a site with several countries but one language?</h3>
<p>Only if the pages differ by region, for example prices or spelling for the US and UK. If the content is identical, hreflang adds little and the pages may be treated as duplicates.</p>
<h3>Does Bing use hreflang?</h3>
<p>Bing says it relies mainly on the HTML <code>lang</code> attribute and the <code>content-language</code> header rather than hreflang, so set those correctly as well.</p>
<h3>Can I use hreflang across different domains?</h3>
<p>Yes. The URLs can be on different domains or subdomains, as long as each page links back to the others.</p>
<h3>How long until it takes effect?</h3>
<p>Google needs to recrawl every page in the group, so expect days to weeks. Errors do not always raise a visible warning, so test with a validator.</p>
`,
};
