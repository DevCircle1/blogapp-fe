import '../../index.css';
import { LOCALES, DEFAULT_LANG } from '../../i18n/locales.js';
import { ADSENSE_CLIENT } from '../../seo/siteMeta.js';
import SiteShell from './SiteShell.jsx';

const GA_ID = 'G-PY1TRQG0PQ';
const CLARITY_ID = 'ykeu033jrf';

// GA4, Clarity, and AdSense are the biggest contributors to blocking time
// (measured ~1.2s combined main-thread work from AdSense alone on a tool page)
// but nothing they do is needed for first paint or LCP. The queue stubs let app
// code (gtag(), adsbygoogle.push()) call them immediately without erroring; the
// real scripts load once the browser is idle, or immediately on the visitor's
// first interaction or scroll, so nothing is lost if they engage before the idle
// callback fires. send_page_view is off because SiteShell fires page_view itself
// on every route change.
const THIRD_PARTY_LOADER = `
window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
gtag('js', new Date());
gtag('config', '${GA_ID}', { send_page_view: false });
window.adsbygoogle = window.adsbygoogle || [];

function loadDeferredThirdParties() {
  if (window.__thirdPartiesLoaded) return;
  window.__thirdPartiesLoaded = true;

  var ga = document.createElement('script');
  ga.async = true;
  ga.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_ID}';
  document.head.appendChild(ga);

  (function (c, l, a, r, i, t, y) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
    t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
    y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
  })(window, document, "clarity", "script", "${CLARITY_ID}");

  var ads = document.createElement('script');
  ads.async = true;
  ads.crossOrigin = 'anonymous';
  ads.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}';
  document.head.appendChild(ads);
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(loadDeferredThirdParties, { timeout: 4000 });
} else {
  setTimeout(loadDeferredThirdParties, 3000);
}
['pointerdown', 'keydown', 'touchstart', 'scroll'].forEach(function (evt) {
  window.addEventListener(evt, loadDeferredThirdParties, { once: true, passive: true });
});
`;

/**
 * The <html> document shared by both root layouts (English at the site root,
 * and the localized sections under /<lang>). The language comes from the layout
 * rather than a head tag so it is in the served HTML.
 *
 * Page titles, descriptions, canonicals and Open Graph tags are NOT set here:
 * each page's own <Seo> declares them (see src/components/common/Seo.jsx), so
 * there is exactly one of each per page.
 */
export default function RootDocument({ lang = DEFAULT_LANG, chromeLang, children }) {
  const htmlLang = (LOCALES[lang] || LOCALES[DEFAULT_LANG]).htmlLang;
  return (
    <html lang={htmlLang}>
      <head>
        <link rel="icon" type="image/png" href="/3.png" />
        <link rel="apple-touch-icon" href="/2.png" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <meta name="p:domain_verify" content="7c7cc7831109920c0b7d093120346203" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <script dangerouslySetInnerHTML={{ __html: THIRD_PARTY_LOADER }} />
      </head>
      <body>
        <SiteShell chromeLang={chromeLang}>{children}</SiteShell>
        <noscript>
          Talk &amp; Tool provides free online calculators, converters, writing tools, and developer utilities.
          JavaScript is required to use the interactive tools.
          <a href="/tools">Browse all tools</a> or <a href="/blogs">read the blog</a>.
        </noscript>
      </body>
    </html>
  );
}
