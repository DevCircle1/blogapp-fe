import { Link } from 'react-router-dom';
import FlagshipShell from '../FlagshipShell.jsx';
import AnalyzerClient from './AnalyzerClient.jsx';
import { ANALYZER_PATH, GUIDE_PATH, WHATSAPP_PAGES } from './pages.js';
import NotFound from '../../../common/NotFound.jsx';

const PRIVACY = 'Your chat is analysed in this browser. No message is uploaded or stored.';

/** The three analyzer pages and the export guide, by path. */
export default function WhatsAppPage({ path }) {
  const page = WHATSAPP_PAGES.find((item) => item.path === path);
  if (!page) return <NotFound />;

  if (path === GUIDE_PATH) {
    return (
      <FlagshipShell page={page}>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
            <h2 className="text-lg font-bold text-white">iPhone</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Chat → contact name → Export Chat → Without Media → Save to Files. You get a .zip with _chat.txt inside.</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-5">
            <h2 className="text-lg font-bold text-white">Android</h2>
            <p className="mt-2 text-sm leading-6 text-slate-400">Chat → ⋮ menu → More → Export chat → Without media → choose where to save. You get a .txt file.</p>
          </div>
        </div>
        <p className="mt-6 text-center"><Link to={ANALYZER_PATH} className="inline-block rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 hover:bg-emerald-400">Analyze your exported chat →</Link></p>
      </FlagshipShell>
    );
  }
  return (
    <FlagshipShell page={page} privacy={PRIVACY}>
      <AnalyzerClient />
    </FlagshipShell>
  );
}
