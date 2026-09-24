import FlagshipShell from '../FlagshipShell.jsx';
import CsvClient from './CsvClient.jsx';
import { CSV_PAGES, CSV_MODE_BY_PATH } from './pages.js';
import NotFound from '../../../common/NotFound.jsx';

const PRIVACY = 'Your file never leaves your browser. It is read in pieces on your device and nothing is uploaded.';

/** The CSV toolkit pages: viewer, merge, split, deduplicate and CSV to Excel. */
export default function CsvPage({ path }) {
  const page = CSV_PAGES.find((item) => item.path === path);
  if (!page) return <NotFound />;
  return (
    <FlagshipShell page={page} privacy={PRIVACY}>
      <CsvClient mode={CSV_MODE_BY_PATH[path] || 'viewer'} />
    </FlagshipShell>
  );
}
