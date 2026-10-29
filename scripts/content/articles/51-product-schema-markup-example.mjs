export default {
  slug: 'product-schema-markup-example',
  title: 'Product Schema Markup: Required Properties and a JSON-LD Example',
  category: 'seo',
  theme: 'seo',
  tags: ['product schema', 'product structured data', 'json-ld product', 'product rich results', 'offers schema', 'merchant listings'],
  description: 'Which Product schema properties Google needs, a complete JSON-LD example with price, availability and rating, and the mistakes that stop rich results appearing.',
  cover: {
    kicker: 'schema.org/Product',
    visual: {
      type: 'code',
      title: 'JSON-LD',
      lines: [
        ['"@type": "Product",', 'accent'],
        '"name": "Trail Runner 2",',
        '"offers": {',
        '  "price": "89.00",',
        '  "priceCurrency": "USD" }',
      ],
    },
  },
  infographic: {
    type: 'table',
    title: 'Product properties by priority',
    subtitle: 'Based on Google’s product structured data guidelines. Check the documentation for changes.',
    columns: ['Property', 'Status', 'Notes'],
    widths: [260, 220, 576],
    rows: [
      ['name', 'Required', 'The product name, matching the page heading'],
      ['offers (price, priceCurrency)', 'Required for merchant listings', 'Price as a number string, currency as ISO 4217'],
      ['image', 'Required for merchant listings', 'Crawlable image URLs; several angles help'],
      ['review or aggregateRating', 'Required for snippets without offers', 'Must reflect reviews visible on the page'],
      ['availability', 'Recommended', 'schema.org URL such as InStock'],
      ['sku, gtin, brand', 'Recommended', 'Identifiers help match the product'],
      ['description', 'Recommended', 'Plain text matching the page'],
    ],
    alt: 'Table of Product schema properties by priority: name, offers, image, review or aggregateRating, availability, identifiers and description',
    caption: 'Eligibility rules change; confirm against the current Google documentation before you ship.',
    footer: 'Build the markup: talkandtool.com/tools/schema-markup-generator',
  },
  html: `
<p>Product schema is structured data that tells search engines the name, price, availability and reviews of something you sell, so the listing can appear in results with rich details such as a price, a star rating or a stock label. Google needs a small set of properties to consider a page, and a larger recommended set improves how well the product is matched. This guide gives the properties that matter, a complete JSON-LD example and the mistakes that most often block rich results.</p>

<h2>Which properties does Google need?</h2>
<p>Google supports two product experiences, and they have different requirements:</p>
<ul>
<li><strong>Product snippets</strong> are rich details on a regular search result. A page needs <code>name</code> plus at least one of <code>review</code>, <code>aggregateRating</code> or <code>offers</code>.</li>
<li><strong>Merchant listings</strong> are the richer shopping experiences, such as product knowledge panels and listings. They need <code>name</code>, <code>image</code> and <code>offers</code> with <code>price</code> and <code>priceCurrency</code>.</li>
</ul>
<p>Beyond the minimum, recommended properties such as <code>description</code>, <code>sku</code>, <code>gtin</code>, <code>brand</code> and <code>availability</code> give Google more to work with. Requirements change over time, so verify them against Google's current product structured data documentation.</p>

{{infographic}}

<h2>A complete JSON-LD example</h2>
<p>Place this in a <code>&lt;script type="application/ld+json"&gt;</code> tag in the page's head or body. JSON-LD is Google's recommended format because it stays separate from the visible HTML.</p>
<p><code>{<br />
&nbsp;&nbsp;"@context": "https://schema.org",<br />
&nbsp;&nbsp;"@type": "Product",<br />
&nbsp;&nbsp;"name": "Trail Runner 2 Running Shoes",<br />
&nbsp;&nbsp;"image": ["https://example.com/img/trail-runner-2-front.jpg", "https://example.com/img/trail-runner-2-side.jpg"],<br />
&nbsp;&nbsp;"description": "Lightweight trail running shoes with a grippy outsole.",<br />
&nbsp;&nbsp;"sku": "TR2-BLU-42",<br />
&nbsp;&nbsp;"brand": { "@type": "Brand", "name": "Example Outdoors" },<br />
&nbsp;&nbsp;"offers": {<br />
&nbsp;&nbsp;&nbsp;&nbsp;"@type": "Offer",<br />
&nbsp;&nbsp;&nbsp;&nbsp;"url": "https://example.com/shoes/trail-runner-2",<br />
&nbsp;&nbsp;&nbsp;&nbsp;"price": "89.00",<br />
&nbsp;&nbsp;&nbsp;&nbsp;"priceCurrency": "USD",<br />
&nbsp;&nbsp;&nbsp;&nbsp;"availability": "https://schema.org/InStock"<br />
&nbsp;&nbsp;},<br />
&nbsp;&nbsp;"aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.6", "reviewCount": "128" }<br />
}</code></p>
<p>The <a href="/tools/schema-markup-generator">schema markup generator</a> builds this from a form and validates it as you go, so you do not have to hand-edit the brackets.</p>

<h2>The properties, one by one</h2>
<h3>name and description</h3>
<p>Use the same name shown on the page. Keep the description to plain text that matches the visible description.</p>
<h3>image</h3>
<p>Give crawlable, indexable image URLs. Multiple images in different aspect ratios help Google choose the best one for each surface.</p>
<h3>offers</h3>
<p>The price must be a plain number in a string, with a dot as the decimal separator and no currency symbol or thousands separator: <code>"89.00"</code>, not <code>"$89"</code>. The currency goes in <code>priceCurrency</code> as a three-letter ISO 4217 code. <code>availability</code> takes a schema.org URL such as <code>https://schema.org/InStock</code>, <code>OutOfStock</code> or <code>PreOrder</code>.</p>
<h3>aggregateRating and review</h3>
<p>Mark up ratings only if the reviews are visible to users on the same page and come from real customers. Do not invent ratings, mark up a rating you wrote about your own product, or copy ratings from another site. Misleading markup can lead to a manual action and removal of rich results.</p>
<h3>sku, gtin and brand</h3>
<p>Identifiers let Google match your product to the same item sold elsewhere. Use the real GTIN (barcode) if you have one.</p>

<h2>Common mistakes</h2>
<ol>
<li><strong>Markup that does not match the page.</strong> The price, availability and rating in the markup must match what visitors see. A mismatch is the most common reason rich results are withheld.</li>
<li><strong>Currency symbols in price.</strong> <code>"$89"</code> and <code>"89,00"</code> fail validation. Use <code>"89.00"</code>.</li>
<li><strong>Marking up a category page as one product.</strong> Product markup is for a page about one product, not a list of many.</li>
<li><strong>Blocked images or pages.</strong> If robots.txt or noindex blocks the page or its images, Google cannot use them.</li>
<li><strong>Stale data.</strong> A price or stock status that is out of date can lead to disapprovals. If the page is generated, make the markup generated from the same data.</li>
<li><strong>Treating markup as a ranking boost.</strong> It makes a page eligible for rich results; it does not by itself raise rankings.</li>
</ol>

<h2>Testing and monitoring</h2>
<p>Test with Google's Rich Results Test, which shows which features your markup qualifies for, and the Schema Markup Validator for syntax. After you deploy, watch the enhancement reports in Search Console for errors and warnings. For the bigger picture of which types still earn rich results, see <a href="/blogs/article/schema-markup-rich-results-2026">schema markup and rich results in 2026</a>, and for the other tags in your head see the <a href="/blogs/article/meta-tags-that-matter-for-seo">meta tags that matter</a>.</p>

<h2>Frequently asked questions</h2>
<h3>Do I need Product schema on every product page?</h3>
<p>It is worth having on any page where you want a price, rating or stock status to be eligible for display. Generate it from the same data as the page so it stays correct.</p>
<h3>Can I use microdata instead of JSON-LD?</h3>
<p>Yes, Google supports microdata and RDFa, but JSON-LD is recommended and easier to maintain.</p>
<h3>Why are my stars not showing?</h3>
<p>Eligibility is not a guarantee. Check that the markup is valid, matches the page, the reviews are visible and genuine, and that Google has recrawled the page. Even then, Google decides whether to show them.</p>
<h3>What if a product has several variants?</h3>
<p>Mark up each variant that has its own URL on its own page. For variants on one page, follow Google's guidance on product variants so the right offer is selected.</p>
`,
};
