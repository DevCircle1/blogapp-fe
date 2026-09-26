export default {
  slug: 'http-status-codes-cheat-sheet',
  title: 'HTTP Status Codes Cheat Sheet: Every Common Code Explained',
  category: 'programming',
  theme: 'dev',
  tags: ['http status codes', 'http status code list', '404 vs 410', '301 redirect', '5xx errors', 'technical seo'],
  description: 'A plain-English cheat sheet of HTTP status codes, from 200 to 504: what each one means, when to use it, and how Googlebot treats it when crawling your site.',
  cover: {
    kicker: 'What each code means, and what Google does with it',
    visual: {
      type: 'code',
      lines: [
        ['HTTP/1.1 200 OK', '#34d399'],
        ['HTTP/1.1 301 Moved', 'accent'],
        ['HTTP/1.1 304 Not Modified', 'accent'],
        ['HTTP/1.1 404 Not Found', '#fbbf24'],
        ['HTTP/1.1 429 Too Many', '#fbbf24'],
        ['HTTP/1.1 503 Unavailable', '#f87171'],
      ],
    },
  },
  infographic: {
    type: 'table',
    title: 'The five classes of HTTP status codes',
    subtitle: 'The first digit tells you the category. Here is how Google Search treats each class when it crawls a URL.',
    columns: ['Class', 'Meaning', 'How Googlebot treats it'],
    widths: [150, 360, 546],
    rows: [
      ['1xx', 'Informational, keep going', 'Handled by the connection, not indexed'],
      ['2xx', 'Success', 'Content considered for indexing'],
      ['3xx', 'Redirect, look elsewhere', 'Follows the redirect; 301/308 pass signals'],
      ['4xx', 'Client error, the request is wrong', 'Not indexed; URLs dropped over time'],
      ['429', 'Too many requests', 'Treated like 5xx: crawling slows down'],
      ['5xx', 'Server error, the server failed', 'Crawl slows; persistent errors drop URLs'],
    ],
    alt: 'Table of the five HTTP status code classes, what each means and how Googlebot treats URLs returning them',
    caption: 'A 429 is technically a client error, but Google treats it as a signal that the server is overloaded.',
    footer: 'Look up any code: talkandtool.com/tools/http-status-codes',
  },
  html: `
<p>HTTP status codes are three-digit numbers a server returns with every response. The first digit gives the category: 2xx means success, 3xx a redirect, 4xx a problem with the request, and 5xx a problem with the server. Here is what the codes you will actually meet mean, when to use each one, and how Google treats them.</p>

<h2>The five classes</h2>

{{infographic}}

<h2>2xx: success</h2>
<ul>
<li><strong>200 OK</strong>: the request worked and the body contains the result. This is what every indexable page should return.</li>
<li><strong>201 Created</strong>: a new resource was created, typically after a POST to an API. Usually paired with a <code>Location</code> header pointing at it.</li>
<li><strong>204 No Content</strong>: success with nothing to return, common for DELETE requests and some form submissions.</li>
</ul>
<p><strong>Soft 404 warning:</strong> a page that says "not found" but returns 200 is a <em>soft 404</em>. Google will usually detect and exclude it, but it wastes crawl budget and shows up as an error in Search Console. Missing pages should return a real 404 or 410.</p>

<h2>3xx: redirects</h2>
<ul>
<li><strong>301 Moved Permanently</strong>: the URL has moved for good. Google transfers ranking signals to the target and eventually shows the new URL. Use it for site migrations, changed slugs and merged pages.</li>
<li><strong>302 Found</strong>: a temporary move. Google keeps the original URL indexed at first, though a 302 left in place for a long time can be treated like a permanent redirect.</li>
<li><strong>303 See Other</strong>: redirect to a different resource, typically after a form POST so a refresh does not resubmit it.</li>
<li><strong>304 Not Modified</strong>: the cached copy is still valid. It saves bandwidth, and Googlebot uses conditional requests to crawl more efficiently.</li>
<li><strong>307 Temporary Redirect / 308 Permanent Redirect</strong>: like 302 and 301, but the request method and body must not change. That matters for APIs, while for SEO a 308 behaves like a 301.</li>
</ul>
<p>We compared 301 and 302 in more depth in <a href="/blogs/article/301-vs-302-redirects-status-codes-seo">301 vs 302 and the status codes that decide whether your pages rank</a>. Avoid chains: Googlebot follows up to 10 redirect hops, but every extra hop slows users down and delays processing.</p>

<h2>4xx: client errors</h2>
<ul>
<li><strong>400 Bad Request</strong>: the request is malformed, for example invalid JSON in an API body. See <a href="/blogs/article/why-json-is-invalid-common-errors">why your JSON is invalid</a> for the usual culprits.</li>
<li><strong>401 Unauthorized</strong>: authentication is required or failed. Despite the name, it means "not authenticated".</li>
<li><strong>403 Forbidden</strong>: authenticated or not, you may not access this. Accidentally returning 403 to Googlebot, often via a firewall or bot-protection rule, will get pages dropped.</li>
<li><strong>404 Not Found</strong>: nothing exists at this URL. It is perfectly normal for pages that never existed or were removed. 404s do not hurt the rest of your site.</li>
<li><strong>405 Method Not Allowed</strong>: the URL exists but not for this method, such as a POST to a read-only endpoint.</li>
<li><strong>408 Request Timeout</strong>: the client took too long to send the request.</li>
<li><strong>410 Gone</strong>: removed deliberately and permanently. Google treats it much like a 404, sometimes dropping the URL slightly faster. Use it when you want to be explicit.</li>
<li><strong>418 I'm a teapot</strong>: an April Fools' joke from 1998 that many frameworks still implement. Do not use it in production.</li>
<li><strong>422 Unprocessable Content</strong>: the request is well-formed but fails validation, such as a missing required field. It is common in REST APIs.</li>
<li><strong>429 Too Many Requests</strong>: rate limit exceeded. Include a <code>Retry-After</code> header. Googlebot treats 429 like a server error and slows its crawl.</li>
<li><strong>451 Unavailable For Legal Reasons</strong>: blocked for legal reasons, such as a court order or regional restriction.</li>
</ul>

<h2>5xx: server errors</h2>
<ul>
<li><strong>500 Internal Server Error</strong>: a generic failure, usually an unhandled exception. Check the server logs.</li>
<li><strong>502 Bad Gateway</strong>: a proxy or load balancer got an invalid response from the server behind it, which often means the application crashed or is restarting.</li>
<li><strong>503 Service Unavailable</strong>: temporarily down, for maintenance or overload. This is the correct code for planned downtime. Add <code>Retry-After</code>, and Google will keep your pages indexed for a short outage.</li>
<li><strong>504 Gateway Timeout</strong>: the upstream server did not respond in time, often a slow database query or external API.</li>
</ul>
<p>How Google handles them: 5xx and 429 responses make Googlebot slow down crawling. If the errors persist for days, URLs that keep failing are eventually dropped from the index. A brief outage returning 503 is harmless. A site returning 200 with an error message during an outage risks having error pages indexed.</p>

<h2>Checking which status a URL returns</h2>
<ul>
<li><strong>Browser DevTools:</strong> open the Network tab, reload, and look at the Status column for the document request.</li>
<li><strong>Command line:</strong> <code>curl -I https://example.com/page</code> prints the status line and headers. Add <code>-L</code> to follow redirects and see each hop.</li>
<li><strong>Search Console:</strong> URL Inspection shows the status Googlebot got. The Pages report groups URLs by the reason they are not indexed.</li>
</ul>
<p>For a searchable reference of every registered code with examples, use the <a href="/tools/http-status-codes">HTTP status codes lookup</a>.</p>

<h2>Frequently asked questions</h2>
<h3>Should I redirect all 404s to the homepage?</h3>
<p>No. Google treats mass redirects to the homepage as soft 404s, and users land somewhere irrelevant. Redirect only to a genuinely equivalent page, and let the rest return 404.</p>
<h3>Is 404 or 410 better for removed pages?</h3>
<p>Both work. 410 is more explicit and may be processed slightly faster, but the practical difference for SEO is small.</p>
<h3>Which status code should maintenance pages return?</h3>
<p>503 Service Unavailable, ideally with a Retry-After header. Never 200 or 404.</p>
`,
};
