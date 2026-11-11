import RootDocument from '../_components/RootDocument.jsx';
import { LOCALIZED_LANGS } from '../../i18n/locales.js';

export const viewport = { themeColor: '#020617' };

export const generateStaticParams = () => LOCALIZED_LANGS.map((lang) => ({ lang }));

/**
 * Root layout for the localized sections (/es, /de/ratgeber, …). It is a root
 * layout of its own so <html lang> carries the page language in the served HTML.
 * Only the languages in generateStaticParams exist; anything else is unmatched
 * and answered by src/app/global-not-found.jsx.
 */
export default async function LocalizedLayout({ children, params }) {
  const { lang } = await params;
  return <RootDocument lang={lang}>{children}</RootDocument>;
}
