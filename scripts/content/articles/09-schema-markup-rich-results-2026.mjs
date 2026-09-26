export default {
  slug: 'schema-markup-rich-results-2026',
  title: 'Which Schema Markup Still Gets Rich Results in 2026?',
  category: 'seo',
  theme: 'seo',
  tags: ['schema markup', 'rich results', 'structured data', 'faq schema', 'json-ld', 'schema markup generator'],
  description: 'Google has retired or restricted many rich results, including FAQ and HowTo. Here is which schema types still earn rich results in 2026 and which are worth adding.',
  cover: {
    kicker: 'FAQ is limited, HowTo is gone. Here is what still works',
    visual: {
      type: 'code',
      lines: [
        ['<script type=', '#94a3b8'],
        ['  "application/ld+json">', '#94a3b8'],
        ['{ "@type": "Product",', 'accent'],
        ['  "offers": { … },', '#e2e8f0'],
        ['  "aggregateRating":', '#e2e8f0'],
        ['    { … } }', '#e2e8f0'],
        ['</script>', '#94a3b8'],
      ],
    },
  },
  infographic: {
    type: 'table',
    title: 'Schema types and their rich result status',
    subtitle: 'Status of common types in Google Search, checked against Google’s structured data documentation in September 2026.',
    columns: ['Schema type', 'Status', 'What it can get you'],
    widths: [260, 220, 576],
    rows: [
      ['Product', 'Eligible', 'Price, availability and rating in the snippet'],
      ['Recipe', 'Eligible', 'Image, rating, time, calories, recipe carousel'],
      ['Video', 'Eligible', 'Video thumbnail, key moments, LIVE badge'],
      ['Event', 'Eligible', 'Dates and venue in event listings'],
      ['JobPosting', 'Eligible', 'Listing in Google’s job search experience'],
      ['Breadcrumb', 'Eligible', 'Site path shown in place of the URL'],
      ['Article / Organization', 'Eligible', 'Better title, image, date and logo handling'],
      ['FAQPage', 'Limited', 'Only for authoritative government and health sites'],
      ['HowTo', 'Retired', 'No rich result since September 2023'],
    ],
    alt: 'Table of schema markup types showing which are eligible for Google rich results in 2026, which are limited, and which are retired',
    caption: 'Retired and limited types are still valid schema.org. They just no longer change how your result looks in Google.',
    footer: 'Generate valid JSON-LD: talkandtool.com/tools/schema-markup-generator',
  },
  html: `
<p>Product, Recipe, Video, Event, JobPosting and Breadcrumb markup still earn rich results in Google in 2026. FAQ rich results are limited to authoritative government and health sites, and HowTo rich results were removed in 2023. Here is the current status of each common type, and which ones are worth adding to your pages.</p>

<h2>The current status at a glance</h2>

{{infographic}}

<h2>What changed, and when</h2>
<p>Google has been trimming the rich results page for several years, with a stated goal of simpler, less cluttered results:</p>
<ul>
<li><strong>August–September 2023:</strong> FAQ rich results were restricted to well-known, authoritative government and health websites, and HowTo rich results were removed from desktop and mobile.</li>
<li><strong>November 2024:</strong> the sitelinks search box was retired, so WebSite SearchAction markup no longer triggers anything visible.</li>
<li><strong>2025:</strong> Google announced it was phasing out several less-used result types, including Course Info, Claim Review, Estimated Salary, Learning Video, Special Announcement, Vehicle Listing and Book Actions.</li>
</ul>
<p>None of this makes the markup invalid. Google simply stopped showing the enhanced display. That distinction matters: removing old FAQ markup is optional, but you should stop expecting it to change your result.</p>

<h2>The types worth adding</h2>
<h3>Product</h3>
<p>The most valuable type for anyone selling anything. Product markup can show price, availability, and review stars under your result through product snippets, and makes pages eligible for merchant listing experiences. Merchant listings need stricter fields and a page where the product can actually be bought. Use the <a href="/tools/product-schema-generator">product schema generator</a> to get required and recommended fields right.</p>
<h3>Recipe</h3>
<p>Recipe results still carry images, ratings, cooking time and calories, and can appear in the recipe carousel. Google requires a name and an image, and the more recommended fields you complete, the richer the result.</p>
<h3>Video</h3>
<p>VideoObject markup makes a video eligible for video results with thumbnails, key moments and a LIVE badge for livestreams. It needs a name, thumbnail and upload date. If your page's main content is a video, this is one of the highest-impact types available. See the <a href="/tools/video-schema-generator">video schema generator</a>.</p>
<h3>Event and JobPosting</h3>
<p>These power dedicated Google experiences rather than just decorating a snippet. Event markup lists your event with dates and venue. JobPosting puts a vacancy into Google's job search, which can drive applications directly. Both have strict required fields and are policed for accuracy, so expired jobs and past events should be removed or marked. The <a href="/tools/job-posting-schema-generator">job posting schema generator</a> covers the required set.</p>
<h3>Breadcrumb</h3>
<p>Breadcrumb markup lets Google show your site's hierarchy instead of a raw URL. It is cheap to add sitewide and makes results easier to scan. Use the <a href="/tools/breadcrumb-schema-generator">breadcrumb schema generator</a> for individual pages, or generate it in your templates.</p>
<h3>Article and Organization</h3>
<p>These rarely create a dramatic visual change, but they help Google pick the right headline, image, dates, author and logo. Article markup is worth adding to every blog post, and Organization markup belongs on your homepage. See the <a href="/tools/article-schema-generator">article schema generator</a> and the <a href="/tools/organization-schema-generator">organization schema generator</a>.</p>
<h3>LocalBusiness</h3>
<p>LocalBusiness markup feeds business details into the knowledge panel alongside your Google Business Profile. It is not a standalone rich result and does not replace the Business Profile, but it helps Google connect your site with your listing. Try the <a href="/tools/local-business-schema-generator">local business schema generator</a>.</p>

<h2>Should you still add FAQ schema?</h2>
<p>For most sites it will not produce a rich result. It is still valid structured data, and some other systems read it. If you already have it, there is no need to remove it. If you are deciding where to spend time, spend it on the types above. The FAQ content itself is still worth having on the page as normal headings and paragraphs. Question-style headings are a natural fit for featured snippets and "People also ask". The <a href="/tools/faq-schema-generator">FAQ schema generator</a> shows the current eligibility notice before you generate anything.</p>

<h2>How to implement structured data correctly</h2>
<ol>
<li><strong>Use JSON-LD.</strong> Google recommends it, and it keeps markup separate from your HTML. One script block per entity is easiest to maintain.</li>
<li><strong>Mark up only what is visible.</strong> Ratings, prices and FAQs in the markup must appear on the page. Hidden or inflated data breaks Google's guidelines and can lead to a manual action.</li>
<li><strong>Complete required fields first,</strong> then recommended ones. Missing required fields make the page ineligible. Missing recommended ones just make the result less rich.</li>
<li><strong>Validate before publishing.</strong> Google's Rich Results Test shows eligibility, and the Schema Markup Validator checks general schema.org syntax.</li>
<li><strong>Monitor in Search Console.</strong> The Enhancements reports list errors and valid items for each supported type.</li>
</ol>
<p>The <a href="/tools/schema-markup-generator">schema markup generator</a> builds JSON-LD for each of these types with a live preview and shows each type's current Google status, so you do not spend effort on markup that no longer changes anything.</p>

<h2>Frequently asked questions</h2>
<h3>Does schema markup improve rankings?</h3>
<p>Google says structured data is not a general ranking factor. It helps Google understand the page and makes it eligible for rich results, which can raise click-through rate.</p>
<h3>Why is my valid markup not showing a rich result?</h3>
<p>Eligibility is not a guarantee. Google decides whether to show a rich result per query and per site, based on quality and relevance. Also check the type has not been retired or limited.</p>
<h3>Can schema markup hurt my site?</h3>
<p>Only if it misrepresents the page, for example fake reviews or prices that differ from the visible ones. That can lead to a manual action that removes rich results.</p>
`,
};
