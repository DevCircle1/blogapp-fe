import LocalizedToolPage from '../../../components/tools/localized/LocalizedToolPage.jsx';
import Seeded from '../../_components/Seeded.jsx';
import { allRoutes } from '../../../../scripts/routes.mjs';

export const revalidate = 3600;
// Only the tool and category-hub URLs the site publishes exist (the same list the sitemap uses).
export const dynamicParams = false;

const localizedPaths = () => allRoutes
  .filter((route) => route.lang && route.lang !== 'en' && /^\/[a-z]{2}\/[^/]+$/.test(route.path))
  .map((route) => route.path);

export const generateStaticParams = () => localizedPaths().map((path) => {
  const [, lang, toolSlug] = path.split('/');
  return { lang, toolSlug };
});

/** /es/<slug>: a catalogue tool (or a category hub) in that language. */
export default async function Page({ params }) {
  const { lang, toolSlug } = await params;
  const path = `/${lang}/${toolSlug}`;
  return <Seeded path={path}><LocalizedToolPage lang={lang} /></Seeded>;
}
