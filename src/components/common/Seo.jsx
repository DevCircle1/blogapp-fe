import { SITE_NAME, DEFAULT_OG_IMAGE, absoluteUrl } from '../../seo/siteMeta.js';
import { LOCALES } from '../../i18n/locales.js';

/**
 * The only place a page's head tags are declared. Every indexable route renders
 * exactly one <Seo>, so title, description, canonical, Open Graph and robots
 * directives cannot drift apart. Private pages pass `noindex`.
 *
 * <title>, <meta> and <link> are rendered as plain elements: React 19 hoists
 * them into <head> — on the server render as well as in the browser — so this
 * works in server and client components alike and needs no head-management
 * library. JSON-LD stays in the body, where search engines read it equally well.
 */
export default function Seo({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  noindex = false,
  schemas = [],
  lang = 'en',
  suffix = true,
  alternates = [],
  children,
}) {
  const canonical = absoluteUrl(path);
  const fullTitle = !suffix || title?.includes(SITE_NAME) || title?.includes('Talk and Tool')
    ? title
    : `${title} | ${SITE_NAME}`;
  const ogLocale = LOCALES[lang]?.ogLocale;

  return (
    <>
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
        // "<" is escaped so no string in the data can close the script element early.
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
        />
      ))}
      {children}
    </>
  );
}
