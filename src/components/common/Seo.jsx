import { Helmet } from 'react-helmet-async';
import { SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from '../../seo/siteMeta.js';
import { LOCALES } from '../../i18n/locales.js';

export default function Seo({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  schemas = [],
  // Page language code (en, es, pt, fr, de). The <html lang> attribute itself
  // is set once in App from the URL, so it is right even on pages without Seo.
  lang = 'en',
  // hreflang cluster: [{ hreflang, path }], including this page itself.
  alternates = [],
  children,
}) {
  const canonical = absoluteUrl(path);
  const fullTitle = title?.includes(SITE_NAME) || title?.includes('Talk and Tool')
    ? title
    : `${title} | ${SITE_NAME}`;
  const ogLocale = LOCALES[lang]?.ogLocale;

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonical} />
      {!noindex && alternates.map((alternate) => (
        <link key={alternate.hreflang} rel="alternate" hrefLang={alternate.hreflang} href={absoluteUrl(alternate.path)} />
      ))}
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
      />
      <meta property="og:site_name" content={SITE_NAME} />
      {ogLocale && <meta property="og:locale" content={ogLocale} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={absoluteUrl(image)} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={absoluteUrl(image)} />
      {schemas.filter(Boolean).map((schema, index) => (
        <script key={index} type="application/ld+json">{JSON.stringify(schema)}</script>
      ))}
      {children}
    </Helmet>
  );
}
