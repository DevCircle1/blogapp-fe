export default {
  slug: 'how-to-check-seo-title-and-meta-description',
  title: 'How to Check Your SEO Title and Meta Description (Free)',
  category: 'seo',
  theme: 'seo',
  tags: ['seo title checker', 'meta description checker', 'check seo title', 'title tag length', 'meta description length', 'serp preview'],
  description: 'A step-by-step way to check an SEO title and meta description: pixel width, length, keyword placement, duplicates and how Google actually shows them in results.',
  cover: {
    kicker: 'Length, keywords and click appeal',
    visual: { type: 'serp', query: 'seo title check', url: 'talkandtool.com › tools', title: 'How to Check Your SEO Title and…', badge: '5 checks' },
  },
  infographic: {
    type: 'steps',
    title: 'Five checks before you publish a title and description',
    subtitle: 'Run them in this order. The first two stop truncation, the rest decide whether people click.',
    items: [
      ['Measure the width, not just the characters', 'Titles are cut at about 580 to 600 pixels on desktop, so wide capitals shorten the limit.'],
      ['Keep the description near 150 to 160 characters', 'Longer text is trimmed with an ellipsis, and the ending is often where the call to action sits.'],
      ['Put the main keyword in the first half', 'It shows in bold when it matches the search, and it survives truncation.'],
      ['Make every page different', 'Duplicate titles and descriptions make pages look interchangeable and compete with each other.'],
      ['Compare with what Google really shows', 'Google rewrites many titles and descriptions. Check Search Console and a live search.'],
    ],
    alt: 'Five-step checklist for checking an SEO title and meta description: width, description length, keyword placement, uniqueness and comparing with live results',
    caption: 'A title that fits but does not earn the click is still a failure.',
    footer: 'Check yours: talkandtool.com/tools/seo-title-meta-checker',
  },
  html: `
<p>To check an SEO title and meta description, paste them into a checker that shows the pixel width and a search preview, confirm the title stays within roughly 580 to 600 pixels and the description within about 150 to 160 characters, make sure the main keyword appears early, and compare the result with how Google actually displays the page. Here is the full process and what each check means.</p>

{{infographic}}

<h2>Check 1: the title's pixel width</h2>
<p>Google cuts a title when it runs out of space, not at a fixed character count. On desktop that is around 580 to 600 pixels. A title of 55 characters made of narrow letters can fit easily, while one of 52 characters with many capitals can be cut off. That is why a pixel-based tool is more reliable than a character counter. We explain the details in <a href="/blogs/article/seo-title-length-pixel-limit">SEO title length and the pixel limit</a>.</p>
<p>As a rule of thumb, aim for 50 to 60 characters and confirm the width with the <a href="/tools/seo-title-meta-checker">SEO title and meta description checker</a>.</p>

<h2>Check 2: the meta description's length</h2>
<p>Google has no official character limit for descriptions, but results typically show about 150 to 160 characters on desktop and a little less on mobile. Anything longer is cut off with an ellipsis. Two practical habits help:</p>
<ul>
<li>Put the most important point first, so the part that gets cut is the least valuable.</li>
<li>Do not stuff the description with keywords. It is not a ranking factor, but it does influence whether people click.</li>
</ul>

<h2>Check 3: keyword placement</h2>
<p>Look at whether the phrase people actually search appears near the start of the title. A title that opens with the brand name spends its best pixels on a word nobody searched for. Compare "Area of a Circle: Formula and Examples | Brand" with "Brand: Everything About Circles". The first shows the search phrase at once and survives being shortened.</p>
<p>Use your real queries, not guesses. In Search Console, open the Performance report, click the page, and look at the queries tab. If the top query is missing from the title, that is the first thing to fix. Our guide to <a href="/blogs/article/striking-distance-keywords">striking distance keywords</a> shows how to find the pages where a small title change is most likely to pay off.</p>

<h2>Check 4: uniqueness</h2>
<p>Every page needs its own title and description. Duplicates are common on templates, category pages and paginated lists, and they make different pages look identical in results. Export your titles from a crawler or from Search Console, sort them alphabetically and scan for repeats. If two pages share a title because they target the same query, the real problem may be overlap between the pages. Read <a href="/blogs/article/find-keyword-cannibalization-search-console">how to find keyword cannibalization</a> to tell the difference.</p>

<h2>Check 5: how Google really displays it</h2>
<p>Google rewrites a large share of titles and many descriptions when it thinks another version matches the query better. Typical triggers are titles that are too long, too short, stuffed with keywords or repeated across the site. To see what is happening:</p>
<ol>
<li>Search for <em>site:yourdomain.com/your-page</em> to see the version Google shows for that URL.</li>
<li>Check the page in Search Console's URL Inspection tool.</li>
<li>Compare the displayed title with the one in your HTML. If they differ often, shorten the title and put the main topic first.</li>
</ol>
<p>The description shown also depends on the query. Google may pull a sentence from the page body if it matches better than your meta description, so a good opening paragraph matters too.</p>

<h2>Check 6: does it earn the click?</h2>
<p>A title can pass every technical check and still be dull. After you publish, look at CTR in Search Console for pages that already rank on page one. A page in positions 1 to 3 with a very low click-through rate usually has a title or description that does not match the search intent. See <a href="/blogs/article/good-ctr-google-search-console">what a good CTR is in Google Search Console</a> for benchmarks by position.</p>
<p>Simple improvements that often help:</p>
<ul>
<li>Add the year only if the content is genuinely updated for it.</li>
<li>Use a number or a specific promise: "5 checks", "with examples".</li>
<li>Match the wording of the query. Searchers click what looks like their own words.</li>
<li>Avoid all caps and repeated punctuation, which tend to get rewritten.</li>
</ul>

<h2>Writing the tags once you have checked them</h2>
<p>If the page has no title or description tags at all, or you need to produce them for many pages, the <a href="/tools/meta-tag-generator">meta tag generator</a> outputs the HTML for you. For a wider look at which tags influence search results and which are ignored, see <a href="/blogs/article/meta-tags-that-matter-for-seo">the meta tags that matter for SEO</a>.</p>

<h2>A quick checklist</h2>
<ul>
<li>Title width under about 600 pixels, ideally 50 to 60 characters.</li>
<li>Description around 150 to 160 characters, strongest point first.</li>
<li>Main keyword in the first half of the title.</li>
<li>No two pages with the same title or description.</li>
<li>Displayed title in Google matches the one you wrote.</li>
<li>CTR reviewed after a few weeks.</li>
</ul>

<h2>Frequently asked questions</h2>
<h3>How long should an SEO title be?</h3>
<p>Between 50 and 60 characters is a safe range, but the real limit is about 600 pixels of width on desktop.</p>
<h3>How long should a meta description be?</h3>
<p>About 150 to 160 characters. There is no official limit, but longer text is usually truncated.</p>
<h3>Does the meta description affect rankings?</h3>
<p>Not directly. It influences click-through rate, which is why it is still worth writing carefully.</p>
<h3>Why does Google show a different title than mine?</h3>
<p>Google rewrites titles it considers too long, vague or repetitive, or ones that do not match the query. Shortening the title and making it descriptive reduces rewrites.</p>
<h3>Is it safe to paste my titles into an online checker?</h3>
<p>Titles and descriptions are public text, so there is nothing sensitive in them. Our checker runs in your browser and does not store what you paste.</p>
`,
};
