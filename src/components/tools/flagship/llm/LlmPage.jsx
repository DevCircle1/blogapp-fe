import { useParams } from 'react-router-dom';
import FlagshipShell from '../FlagshipShell.jsx';
import CounterClient from './CounterClient.jsx';
import PriceTable from './PriceTable.jsx';
import PriceHistory from './PriceHistory.jsx';
import { LLM_PAGES, COMPARE_PATH, COST_PATH, COUNTER_PATH } from './pages.js';
import NotFound from '../../../common/NotFound.jsx';

const PRIVACY = 'Your text is tokenized in this browser and never uploaded.';

/** Serves all four LLM URLs: hub, /:model, cost calculator and price comparison. */
export default function LlmPage({ view }) {
  const { model } = useParams();
  const path = view === 'cost' ? COST_PATH : view === 'compare' ? COMPARE_PATH : model ? `${COUNTER_PATH}/${model}` : COUNTER_PATH;
  const page = LLM_PAGES.find((item) => item.path === path);
  if (!page) return <NotFound />;

  if (view === 'compare') {
    return (
      <FlagshipShell page={page} afterTool={null}>
        <PriceTable />
        <PriceHistory />
      </FlagshipShell>
    );
  }
  return (
    <FlagshipShell page={page} privacy={PRIVACY}>
      <CounterClient mode={view === 'cost' ? 'cost' : 'counter'} focusSlug={page.modelSlug || null} />
    </FlagshipShell>
  );
}
