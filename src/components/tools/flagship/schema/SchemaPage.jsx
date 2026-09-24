import FlagshipShell from '../FlagshipShell.jsx';
import SchemaClient from './SchemaClient.jsx';
import { SCHEMA_PAGES } from './pages.js';
import NotFound from '../../../common/NotFound.jsx';

const PRIVACY = 'The markup is generated in your browser from what you type. Nothing is uploaded.';

/** The schema markup hub and one page per schema type. */
export default function SchemaPage({ path }) {
  const page = SCHEMA_PAGES.find((item) => item.path === path);
  if (!page) return <NotFound />;
  return (
    <FlagshipShell page={page} privacy={PRIVACY}>
      <SchemaClient typeSlug={page.typeSlug} picker={!page.typeSlug} />
    </FlagshipShell>
  );
}
