export default {
  slug: 'open-graph-tags-complete-list',
  title: 'Open Graph Tags: The Complete List and Image Size Guide',
  category: 'seo',
  theme: 'seo',
  tags: ['open graph tags', 'og:image size', 'og:title', 'twitter card', 'social share preview', 'link preview'],
  description: 'Every Open Graph tag worth setting, the best og:image size, how Twitter/X cards fall back to them, and how to fix a link preview that will not update.',
  cover: {
    kicker: 'What a shared link looks like',
    visual: { type: 'serp', query: 'link preview', url: 'example.com › post', title: 'Your page title here…', badge: '1200 × 630' },
  },
  infographic: {
    type: 'table',
    title: 'Open Graph tags to set',
    subtitle: 'Place in the <head> of each page. Use absolute URLs.',
    columns: ['Tag', 'Status', 'Example value'],
    widths: [250, 220, 586],
    rows: [
      ['og:title', 'Required', 'Open Graph Tags: The Complete List'],
      ['og:type', 'Required', 'article (or website)'],
      ['og:image', 'Required', 'https://example.com/img/cover.png'],
      ['og:url', 'Required', 'The canonical URL of the page'],
      ['og:description', 'Recommended', 'One or two sentences, around 150 characters'],
      ['og:site_name', 'Optional', 'Your brand or site name'],
      ['twitter:card', 'Recommended', 'summary_large_image'],
    ],
    alt: 'Table of Open Graph tags with status and example value: og:title, og:type, og:image, og:url, og:description, og:site_name and twitter:card',
    caption: 'Facebook, LinkedIn, Slack, WhatsApp and most messengers all read these same tags.',
    footer: 'Generate them: talkandtool.com/tools/meta-tag-generator',
  },
  html: `
<p>Open Graph tags are meta tags in a page's head that control how it looks when someone shares the link on Facebook, LinkedIn, Slack, WhatsApp, iMessage and most other apps: the title, description and preview image. Without them, each platform guesses, often badly. Four tags are required, a few more are recommended, and getting the image right matters most. This guide lists them all, gives the image size to use, and explains why previews sometimes show stale information.</p>

<h2>The four required tags</h2>
<p>The Open Graph protocol requires these four on every page:</p>
<ul>
<li><code>og:title</code>: the title as it should appear in the preview, which can be shorter or punchier than the HTML title.</li>
<li><code>og:type</code>: the kind of object, usually <code>website</code> for a home page and <code>article</code> for a post.</li>
<li><code>og:image</code>: the image URL. It must be absolute and publicly reachable.</li>
<li><code>og:url</code>: the canonical URL for the page, so shares of different URL variants count together.</li>
</ul>

<h2>Recommended and optional tags</h2>
<ul>
<li><code>og:description</code>: a sentence or two. Keep it near 150 characters, since platforms truncate it.</li>
<li><code>og:site_name</code>: your brand, shown above or below the title on some platforms.</li>
<li><code>og:locale</code>: for example <code>en_US</code>. For translated pages, <code>og:locale:alternate</code> lists the others.</li>
<li><code>og:image:alt</code>: alternative text for the image, which helps screen-reader users.</li>
<li><code>og:image:width</code> and <code>og:image:height</code>: letting a platform render the preview on the first share, without downloading the image first.</li>
<li><code>article:published_time</code>, <code>article:author</code>: extra metadata for posts.</li>
</ul>

{{infographic}}

<h2>A complete example</h2>
<p><code>&lt;meta property="og:title" content="Open Graph Tags: The Complete List" /&gt;<br />
&lt;meta property="og:type" content="article" /&gt;<br />
&lt;meta property="og:url" content="https://example.com/open-graph-tags" /&gt;<br />
&lt;meta property="og:image" content="https://example.com/img/og-tags.png" /&gt;<br />
&lt;meta property="og:image:width" content="1200" /&gt;<br />
&lt;meta property="og:image:height" content="630" /&gt;<br />
&lt;meta property="og:image:alt" content="Diagram of a link preview card" /&gt;<br />
&lt;meta property="og:description" content="Every tag worth setting, and the right image size." /&gt;<br />
&lt;meta property="og:site_name" content="Example" /&gt;</code></p>
<p>Note that Open Graph uses <code>property</code> rather than <code>name</code> in the tag. Some parsers accept either, but <code>property</code> is the specified form. The <a href="/tools/meta-tag-generator">meta tag generator</a> writes the full block, including the Twitter tags below.</p>

<h2>The best og:image size</h2>
<p>Use <strong>1200 × 630 pixels</strong>, an aspect ratio of about 1.91:1. This fills the large-image card on Facebook and LinkedIn and displays well on most other platforms. Practical rules:</p>
<ul>
<li>Use PNG or JPG. Some platforms do not display WebP or SVG previews, so avoid them for this tag.</li>
<li>Keep important content, such as text and faces, away from the edges. Some apps crop to a square or a different ratio.</li>
<li>Keep the file size modest, ideally well under a megabyte. Heavy images load slowly and some crawlers give up.</li>
<li>Put readable text on the image, but keep it large; it will often be shown small.</li>
<li>Use a unique image per page where you can. A single generic logo on every share looks like spam.</li>
</ul>

<h2>Twitter/X cards</h2>
<p>X reads its own <code>twitter:</code> tags first and falls back to Open Graph for anything missing. In practice you only need one extra tag:</p>
<p><code>&lt;meta name="twitter:card" content="summary_large_image" /&gt;</code></p>
<p>Without it, X shows a small square "summary" card. The common values are <code>summary</code> and <code>summary_large_image</code>. If you set the title, description and image through Open Graph, X will use them. Add <code>twitter:title</code>, <code>twitter:description</code> or <code>twitter:image</code> only if you want them to differ.</p>

<h2>Why my preview shows old or missing information</h2>
<ol>
<li><strong>It is cached.</strong> Platforms store the first preview they fetch. After you change tags, ask them to refresh: Facebook has a Sharing Debugger, and LinkedIn has a Post Inspector. Slack and messaging apps cache for a while and may need a different URL, such as one with a query string, to refetch.</li>
<li><strong>The crawler cannot reach the page.</strong> Pages behind a login, blocked by robots.txt or rendered only by JavaScript may show nothing. The tags must be in the HTML the server returns, not added later by script.</li>
<li><strong>The image URL is relative or broken.</strong> Use a full https URL that loads without cookies.</li>
<li><strong>The tags are in the wrong place.</strong> They belong inside the head. A tag in the body can be ignored.</li>
<li><strong>Two sets of tags conflict.</strong> A plugin and a theme can each add their own; the crawler may read the wrong one. View the page source and check for duplicates.</li>
</ol>

<h2>How it relates to your other meta tags</h2>
<p>Open Graph controls the social preview, while the title tag and meta description control the search result. They can be the same text or different. Keep the search title within its display limit (see <a href="/blogs/article/seo-title-length-pixel-limit">SEO title length</a>), and check the <a href="/blogs/article/meta-tags-that-matter-for-seo">meta tags that matter for SEO</a> for the rest. Social shares do not directly affect rankings, but a clear preview earns more clicks on the link, which is what you want from a share. If you run a multilingual site, <a href="/blogs/article/hreflang-tags-guide">hreflang tags</a> handle the language targeting for search.</p>

<h2>Frequently asked questions</h2>
<h3>Is og:description needed if I have a meta description?</h3>
<p>Platforms fall back to the meta description if there is no og:description, but setting it lets you write copy that suits a feed, not a search result.</p>
<h3>Can I use a different og:image for each page?</h3>
<p>Yes, and you should. A distinct image per page makes each share stand out.</p>
<h3>Do Open Graph tags help SEO?</h3>
<p>Not directly. They improve how shared links look, which can increase clicks and visibility, but Google does not use them as a ranking signal.</p>
<h3>How do I test my tags?</h3>
<p>View the page source to confirm they are present, then paste the URL into the Facebook Sharing Debugger or LinkedIn Post Inspector to see exactly what each platform reads.</p>
`,
};
