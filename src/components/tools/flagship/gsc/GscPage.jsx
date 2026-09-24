import FlagshipShell from '../FlagshipShell.jsx';
import GscClient from './GscClient.jsx';
import { GSC_MODE_BY_PATH, GSC_PAGES } from './pages.js';
import NotFound from '../../../common/NotFound.jsx';

/** /tools/content-decay-checker, /tools/striking-distance-keywords, /tools/gsc-ctr-analyzer */
export default function GscPage({ path }) {
  const page = GSC_PAGES.find((item) => item.path === path);
  if (!page) return <NotFound />;
  return (
    <FlagshipShell page={page} privacy="Your Search Console data is analysed in this browser and never uploaded.">
      <GscClient mode={GSC_MODE_BY_PATH[path]} />
    </FlagshipShell>
  );
}
