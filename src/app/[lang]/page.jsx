import LocalizedToolsHub from '../../components/tools/localized/LocalizedToolsHub.jsx';
import Seeded from '../_components/Seeded.jsx';
import { LOCALIZED_LANGS, hubPath } from '../../i18n/locales.js';

export const revalidate = 3600;
export const dynamicParams = false;

export const generateStaticParams = () => LOCALIZED_LANGS.map((lang) => ({ lang }));

/** /es, /de, … : the tool directory in that language. */
export default async function Page({ params }) {
  const { lang } = await params;
  return <Seeded path={hubPath(lang)}><LocalizedToolsHub lang={lang} /></Seeded>;
}
