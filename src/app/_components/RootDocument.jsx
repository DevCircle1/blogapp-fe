import '../../index.css';
import { LOCALES, DEFAULT_LANG } from '../../i18n/locales.js';
import { ADSENSE_CLIENT } from '../../seo/siteMeta.js';
import SiteShell from './SiteShell.jsx';

const GA_ID = 'G-PY1TRQG0PQ';
const CLARITY_ID = 'ykeu033jrf';

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
        {/* AdSense: must be a real tag in the served HTML so Google's verification crawler finds it. */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
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
