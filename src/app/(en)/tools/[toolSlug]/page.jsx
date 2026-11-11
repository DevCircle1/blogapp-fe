import PremiumToolSuite from '../../../../components/tools/PremiumToolSuite.jsx';
import { premiumTools } from '../../../../components/tools/toolCatalog.js';
import Seeded from '../../../_components/Seeded.jsx';
import { FLAGSHIP_ROUTES, FLAGSHIP_SLUGS } from '../../../_lib/flagship.js';

export const revalidate = 3600;
// Only the slugs in the catalogue and the flagship registry exist; anything else is a real 404.
export const dynamicParams = false;

export const generateStaticParams = () => (
  [...new Set([...premiumTools.map((tool) => tool.slug), ...FLAGSHIP_SLUGS])].map((toolSlug) => ({ toolSlug }))
);

/** /tools/<slug>: a flagship tool with its own page component, otherwise a catalogue tool. */
export default async function ToolPage({ params }) {
  const { toolSlug } = await params;
  const path = `/tools/${toolSlug}`;

  const flagship = FLAGSHIP_ROUTES.get(path);
  if (flagship) {
    const { Component, props } = flagship;
    return <Seeded path={path}><Component {...props} /></Seeded>;
  }
  return <Seeded path={path}><PremiumToolSuite /></Seeded>;
}
