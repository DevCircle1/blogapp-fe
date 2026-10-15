import FlagshipShell from '../FlagshipShell.jsx';
import GscClient from './GscClient.jsx';
import RegexClient from './RegexClient.jsx';
import { GSC_MODE_BY_PATH, GSC_PAGES } from './pages.js';
import NotFound from '../../../common/NotFound.jsx';

/** /tools/content-decay-checker, /tools/striking-distance-keywords, /tools/gsc-ctr-analyzer, /tools/search-console-regex-generator */
export default function GscPage({ path }) {
  const page = GSC_PAGES.find((item) => item.path === path);
  if (!page) return <NotFound />;
  const mode = GSC_MODE_BY_PATH[path];
  if (mode === 'regex') {
    return (
      <FlagshipShell page={page} privacy="Patterns and test queries stay in this browser.">
        <RegexClient />
      </FlagshipShell>
    );
  }
  return (
    <FlagshipShell page={page} privacy="Your Search Console data is analysed in this browser and never uploaded.">
      <GscClient mode={mode} />
    </FlagshipShell>
  );
}
