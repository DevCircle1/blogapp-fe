import { useMemo, useState } from 'react';
import {
  AlertTriangle, ArrowDown, ArrowUp, ChevronDown, ChevronRight, Download, Upload,
} from 'lucide-react';
import { datasetFrom, readGscFiles } from '../../../../lib/seo/gscData.js';
import {
  CANNIBALIZATION_ADVICE, DECAY_CAUSES, findCannibalization, findDecay, findLowCtr, findStrikingDistance, guessBrandTerms, pathOf,
} from '../../../../lib/seo/analysis.js';
import {
  SAMPLE_PAGES_CURRENT, SAMPLE_PAGES_PREVIOUS, SAMPLE_QUERIES, SAMPLE_QUERY_PAGE,
} from '../../../../lib/seo/sampleData.js';
import { trackToolEvent } from '../../../../lib/toolAnalytics.js';
import { cx } from '../../impl/toolFormat.js';

const int = (n) => (Number.isFinite(n) ? Math.round(n).toLocaleString('en-US') : '—');
const pos = (n) => (Number.isFinite(n) ? n.toFixed(1) : '—');
const pct = (n) => (Number.isFinite(n) ? `${(n * 100).toFixed(1)}%` : '—');
const signed = (n) => (n > 0 ? `+${int(n)}` : int(n));

const csvEscape = (value) => {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};
const downloadCsv = (name, headers, rows) => {
  const body = [headers, ...rows].map((row) => row.map(csvEscape).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([String.fromCharCode(0xfeff), body, '\r\n'], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const MODES = {
  cannibalization: {
    needs: ['queryPage'],
    needsText: 'a Query + Page export (one row per query and URL pair)',
    sampleKey: 'cannibalization',
  },
  decay: { needs: ['pages', 'queries'], needsText: 'a Pages export for the current period and one for the previous period (or a single "compare dates" export)' },
  striking: { needs: ['queries', 'queryPage'], needsText: 'a Queries export (or a Query + Page export)' },
  ctr: { needs: ['pages', 'queries', 'queryPage'], needsText: 'a Pages or Queries export' },
};

function Dropzone({ label, hint, onFiles, loaded, busy }) {
  const [over, setOver] = useState(false);
  return (
    <label
      onDragOver={(event) => { event.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => { event.preventDefault(); setOver(false); onFiles(event.dataTransfer.files); }}
      className={cx('flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-5 py-7 text-center transition', over ? 'border-indigo-400 bg-indigo-400/10' : 'border-white/15 bg-slate-950/40 hover:border-indigo-400/60')}
    >
      <Upload size={26} className="text-indigo-300" aria-hidden="true" />
      <span className="font-semibold text-white">{label}</span>
      <span className="text-xs text-slate-400">{hint}</span>
      {busy && <span className="text-xs text-indigo-200">Reading…</span>}
      {loaded && <span className="text-xs text-emerald-300">{loaded}</span>}
      <input type="file" accept=".csv,.zip,.tsv,text/csv,application/zip" multiple className="sr-only" onChange={(event) => { onFiles(event.target.files); event.target.value = ''; }} />
    </label>
  );
}

function Num({ label, value, onChange, step = 1, min = 0, suffix }) {
  return (
    <label className="block text-xs font-medium text-slate-400">
      {label}
      <span className="mt-1 flex items-center gap-2">
        <input type="number" min={min} step={step} value={value} onChange={(event) => onChange(event.target.value === '' ? 0 : Number(event.target.value))} className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400" />
        {suffix && <span className="text-slate-500">{suffix}</span>}
      </span>
    </label>
  );
}

function SortHead({ label, k, sort, onSort, right }) {
  return (
    <th scope="col" className={cx('px-3 py-2.5', right && 'text-right')} aria-sort={sort.key === k ? (sort.dir > 0 ? 'ascending' : 'descending') : 'none'}>
      <button type="button" onClick={() => onSort(k)} className="inline-flex items-center gap-1 uppercase tracking-wider hover:text-white">
        {label}{sort.key === k && (sort.dir > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
      </button>
    </th>
  );
}

const useSort = (defaultKey, defaultDir = -1) => {
  const [sort, setSort] = useState({ key: defaultKey, dir: defaultDir });
  const onSort = (key) => setSort((current) => (current.key === key ? { key, dir: -current.dir } : { key, dir: -1 }));
  const apply = (rows) => [...rows].sort((a, b) => {
    const av = a[sort.key]; const bv = b[sort.key];
    if (typeof av === 'string') return av.localeCompare(bv) * sort.dir;
    return ((Number.isFinite(av) ? av : -Infinity) - (Number.isFinite(bv) ? bv : -Infinity)) * sort.dir;
  });
  return { sort, onSort, apply };
};

function Empty({ children }) {
  return <p className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-sm text-emerald-100">{children}</p>;
}

/* ------------------------------------------------------------------ results */

function CannibalizationResults({ rows, dataset }) {
  const [minImpressions, setMin] = useState(50);
  const [minShare, setShare] = useState(10);
  const [gap, setGap] = useState(10);
  const [brand, setBrand] = useState(() => guessBrandTerms(dataset.queryPage).join(', '));
  const [showBrand, setShowBrand] = useState(false);
  const [open, setOpen] = useState(() => new Set());
  const { sort, onSort, apply } = useSort('potentialClicksLost');

  const issues = useMemo(() => findCannibalization(rows, {
    minImpressions, minShare: minShare / 100, maxPositionGap: gap, brandTerms: brand.split(',').map((term) => term.trim()).filter(Boolean),
  }), [rows, minImpressions, minShare, gap, brand]);
  const shown = apply(issues.filter((issue) => showBrand || !issue.branded));
  const brandCount = issues.filter((issue) => issue.branded).length;
  const totalLost = shown.reduce((sum, issue) => sum + issue.potentialClicksLost, 0);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Num label="Min impressions per URL" value={minImpressions} onChange={setMin} />
        <Num label="Min share of the query’s impressions" value={minShare} onChange={setShare} suffix="%" />
        <Num label="Max position gap" value={gap} onChange={setGap} />
        <label className="block text-xs font-medium text-slate-400">
          Brand terms (excluded, comma-separated)
          <input value={brand} onChange={(event) => setBrand(event.target.value)} className="mt-1 w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400" />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
        <span><strong className="text-white">{shown.length}</strong> cannibalized quer{shown.length === 1 ? 'y' : 'ies'} · about <strong className="text-white">{int(totalLost)}</strong> clicks potentially lost (estimate)</span>
        <span className="flex items-center gap-4">
          {brandCount > 0 && (
            <label className="flex items-center gap-2 text-xs text-slate-400"><input type="checkbox" checked={showBrand} onChange={(event) => setShowBrand(event.target.checked)} className="accent-indigo-500" /> Show {brandCount} brand quer{brandCount === 1 ? 'y' : 'ies'}</label>
          )}
          {shown.length > 0 && (
            <button type="button" onClick={() => downloadCsv('cannibalization.csv', ['Query', 'URL', 'Clicks', 'Impressions', 'Position', 'Query est. clicks lost', 'Suggested action'], shown.flatMap((issue) => issue.pages.map((page) => [issue.query, page.page, page.clicks, page.impressions, pos(page.position), issue.potentialClicksLost, issue.action])))} className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-white/20"><Download size={14} /> Export CSV</button>
          )}
        </span>
      </div>
      {shown.length === 0 ? (
        <Empty>No cannibalization found at these settings. That is a good result: each query is being answered by one URL. Lower the impression or share thresholds to look for weaker overlaps.</Empty>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-white/5 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="w-8 px-2 py-2.5"><span className="sr-only">Expand</span></th>
                <SortHead label="Query" k="query" sort={sort} onSort={onSort} />
                <th className="px-3 py-2.5 text-right">URLs</th>
                <SortHead label="Impressions" k="impressions" sort={sort} onSort={onSort} right />
                <SortHead label="Clicks" k="clicks" sort={sort} onSort={onSort} right />
                <SortHead label="Best pos." k="bestPosition" sort={sort} onSort={onSort} right />
                <SortHead label="Est. clicks lost" k="potentialClicksLost" sort={sort} onSort={onSort} right />
              </tr>
            </thead>
            <tbody>
              {shown.map((issue) => {
                const isOpen = open.has(issue.query);
                return (
                  <FragmentRow key={issue.query}>
                    <tr className="cursor-pointer border-t border-white/5 hover:bg-white/[0.03]" onClick={() => setOpen((current) => { const next = new Set(current); if (next.has(issue.query)) next.delete(issue.query); else next.add(issue.query); return next; })}>
                      <td className="px-2 py-2 text-slate-500">{isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</td>
                      <th scope="row" className="px-3 py-2 text-left font-semibold text-white">{issue.query}{issue.branded && <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300">brand</span>}</th>
                      <td className="px-3 py-2 text-right tabular-nums text-slate-300">{issue.pages.length}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-slate-300">{int(issue.impressions)}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-slate-300">{int(issue.clicks)}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-slate-300">{pos(issue.bestPosition)}</td>
                      <td className="px-3 py-2 text-right font-semibold tabular-nums text-amber-200">{int(issue.potentialClicksLost)}</td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-slate-950/60">
                        <td />
                        <td colSpan={6} className="px-3 py-4">
                          <table className="w-full text-xs">
                            <thead><tr className="text-left text-slate-500"><th className="py-1 font-medium">URL</th><th className="py-1 text-right font-medium">Clicks</th><th className="py-1 text-right font-medium">Impressions</th><th className="py-1 text-right font-medium">Position</th></tr></thead>
                            <tbody>
                              {issue.pages.map((page) => (
                                <tr key={page.page} className="border-t border-white/5 text-slate-300">
                                  <td className="break-all py-1.5 pr-3">{pathOf(page.page)}</td>
                                  <td className="py-1.5 text-right tabular-nums">{int(page.clicks)}</td>
                                  <td className="py-1.5 text-right tabular-nums">{int(page.impressions)}</td>
                                  <td className="py-1.5 text-right tabular-nums">{pos(page.position)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <p className="mt-3 text-sm leading-6 text-slate-400"><strong className="text-slate-200">What to do: </strong>{CANNIBALIZATION_ADVICE[issue.action]}</p>
                        </td>
                      </tr>
                    )}
                  </FragmentRow>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// Fragment with a key inside a <tbody>.
const FragmentRow = ({ children }) => <>{children}</>;

function DecayResults({ current, previous, dimension }) {
  const [minPrev, setMinPrev] = useState(10);
  const [minDrop, setMinDrop] = useState(20);
  const [open, setOpen] = useState(() => new Set());
  const { sort, onSort, apply } = useSort('clicksDelta', 1);
  const rows = useMemo(() => findDecay(current, previous, { dimension, minPreviousClicks: minPrev, minDropPct: minDrop / 100 }), [current, previous, dimension, minPrev, minDrop]);
  const shown = apply(rows);
  const lost = rows.reduce((sum, row) => sum + Math.abs(row.clicksDelta), 0);
  const byCause = rows.reduce((acc, row) => ({ ...acc, [row.cause]: (acc[row.cause] || 0) + 1 }), {});

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Num label="Min clicks in the previous period" value={minPrev} onChange={setMinPrev} />
        <Num label="Min drop in clicks" value={minDrop} onChange={setMinDrop} suffix="%" />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
        <span><strong className="text-white">{rows.length}</strong> {dimension === 'page' ? 'pages' : 'queries'} lost clicks · <strong className="text-white">{int(lost)}</strong> clicks in total
          {Object.entries(byCause).map(([cause, count]) => <span key={cause} className="ml-3 text-xs text-slate-400">{DECAY_CAUSES[cause].label}: {count}</span>)}
        </span>
        {rows.length > 0 && (
          <button type="button" onClick={() => downloadCsv('content-decay.csv', [dimension === 'page' ? 'Page' : 'Query', 'Previous clicks', 'Current clicks', 'Change', 'Previous position', 'Current position', 'Likely cause'], rows.map((row) => [row.label, row.previousClicks, row.currentClicks, row.clicksDelta, pos(row.previousPosition), pos(row.currentPosition), DECAY_CAUSES[row.cause].label]))} className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-white/20"><Download size={14} /> Export CSV</button>
        )}
      </div>
      {shown.length === 0 ? <Empty>No {dimension === 'page' ? 'pages' : 'queries'} dropped by that much between the two periods.</Empty> : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <thead>
              <tr className="bg-white/5 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="w-8 px-2 py-2.5"><span className="sr-only">Expand</span></th>
                <SortHead label={dimension === 'page' ? 'Page' : 'Query'} k="label" sort={sort} onSort={onSort} />
                <SortHead label="Clicks before" k="previousClicks" sort={sort} onSort={onSort} right />
                <SortHead label="Clicks now" k="currentClicks" sort={sort} onSort={onSort} right />
                <SortHead label="Change" k="clicksDelta" sort={sort} onSort={onSort} right />
                <SortHead label="Pos. change" k="positionDelta" sort={sort} onSort={onSort} right />
                <th className="px-3 py-2.5">Likely cause</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => {
                const isOpen = open.has(row.key);
                return (
                  <FragmentRow key={row.key}>
                    <tr className="cursor-pointer border-t border-white/5 hover:bg-white/[0.03]" onClick={() => setOpen((c) => { const n = new Set(c); if (n.has(row.key)) n.delete(row.key); else n.add(row.key); return n; })}>
                      <td className="px-2 py-2 text-slate-500">{isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}</td>
                      <th scope="row" className="max-w-xs break-all px-3 py-2 text-left font-semibold text-white">{dimension === 'page' ? pathOf(row.label) : row.label}</th>
                      <td className="px-3 py-2 text-right tabular-nums text-slate-300">{int(row.previousClicks)}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-slate-300">{int(row.currentClicks)}</td>
                      <td className="px-3 py-2 text-right font-semibold tabular-nums text-rose-300">{signed(row.clicksDelta)} <span className="text-xs font-normal text-slate-500">({Math.round(row.dropPct * 100)}%)</span></td>
                      <td className="px-3 py-2 text-right tabular-nums text-slate-300">{Number.isFinite(row.positionDelta) ? `${row.positionDelta > 0 ? '+' : ''}${row.positionDelta.toFixed(1)}` : '—'}</td>
                      <td className="px-3 py-2 text-slate-300">{DECAY_CAUSES[row.cause].label}</td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-slate-950/60"><td /><td colSpan={6} className="px-3 py-4 text-sm leading-6 text-slate-400">
                        <p>Impressions {int(row.previousImpressions)} → {int(row.currentImpressions)} · average position {pos(row.previousPosition)} → {pos(row.currentPosition)}</p>
                        <p className="mt-2"><strong className="text-slate-200">What to do: </strong>{DECAY_CAUSES[row.cause].advice}</p>
                      </td></tr>
                    )}
                  </FragmentRow>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StrikingResults({ rows }) {
  const [minImpr, setMinImpr] = useState(100);
  const [from, setFrom] = useState(11);
  const [to, setTo] = useState(20);
  const { sort, onSort, apply } = useSort('opportunity');
  const found = useMemo(() => findStrikingDistance(rows, { minImpressions: minImpr, minPosition: from, maxPosition: to }), [rows, minImpr, from, to]);
  const shown = apply(found);
  const hasPage = found.some((row) => row.page);
  const total = found.reduce((sum, row) => sum + row.opportunity, 0);
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Num label="Min impressions" value={minImpr} onChange={setMinImpr} />
        <Num label="From position" value={from} onChange={setFrom} step={0.5} min={1} />
        <Num label="To position" value={to} onChange={setTo} step={0.5} min={1} />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
        <span><strong className="text-white">{found.length}</strong> queries · up to about <strong className="text-white">{int(total)}</strong> extra clicks if they reached position 5 (estimate)</span>
        {found.length > 0 && <button type="button" onClick={() => downloadCsv('striking-distance.csv', ['Query', ...(hasPage ? ['Page'] : []), 'Impressions', 'Clicks', 'CTR', 'Position', 'Est. extra clicks at #5'], found.map((row) => [row.query, ...(hasPage ? [row.page] : []), row.impressions, row.clicks, pct(row.ctr), pos(row.position), row.opportunity]))} className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-white/20"><Download size={14} /> Export CSV</button>}
      </div>
      {shown.length === 0 ? <Empty>No queries match. Lower the impression threshold or widen the position range.</Empty> : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-white/5 text-left text-xs uppercase tracking-wider text-slate-400">
                <SortHead label="Query" k="query" sort={sort} onSort={onSort} />
                {hasPage && <th className="px-3 py-2.5">Page</th>}
                <SortHead label="Impressions" k="impressions" sort={sort} onSort={onSort} right />
                <SortHead label="Clicks" k="clicks" sort={sort} onSort={onSort} right />
                <SortHead label="CTR" k="ctr" sort={sort} onSort={onSort} right />
                <SortHead label="Position" k="position" sort={sort} onSort={onSort} right />
                <SortHead label="Est. extra clicks" k="opportunity" sort={sort} onSort={onSort} right />
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => (
                <tr key={`${row.query}|${row.page}`} className="border-t border-white/5 hover:bg-white/[0.03]">
                  <th scope="row" className="px-3 py-2 text-left font-semibold text-white">{row.query}</th>
                  {hasPage && <td className="max-w-[14rem] break-all px-3 py-2 text-xs text-slate-400">{row.page && pathOf(row.page)}</td>}
                  <td className="px-3 py-2 text-right tabular-nums text-slate-300">{int(row.impressions)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-300">{int(row.clicks)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-300">{pct(row.ctr)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-300">{pos(row.position)}</td>
                  <td className="px-3 py-2 text-right font-semibold tabular-nums text-emerald-300">{int(row.opportunity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-4 text-sm leading-6 text-slate-400"><strong className="text-slate-200">What to do: </strong>these already rank on page two, so Google considers them relevant. Improve the matching page — cover the query in a heading, answer it more completely, add internal links with the query as anchor text — before writing anything new.</p>
    </div>
  );
}

function CtrResults({ rows, label }) {
  const [minImpr, setMinImpr] = useState(200);
  const [maxPos, setMaxPos] = useState(10);
  const [ratio, setRatio] = useState(50);
  const { sort, onSort, apply } = useSort('missedClicks');
  const found = useMemo(() => findLowCtr(rows, { minImpressions: minImpr, maxPosition: maxPos, ratio: ratio / 100 }), [rows, minImpr, maxPos, ratio]);
  const shown = apply(found);
  const total = found.reduce((sum, row) => sum + row.missedClicks, 0);
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Num label="Min impressions" value={minImpr} onChange={setMinImpr} />
        <Num label="Only up to position" value={maxPos} onChange={setMaxPos} step={0.5} min={1} />
        <Num label="Flag CTR below this share of expected" value={ratio} onChange={setRatio} suffix="%" />
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
        <span><strong className="text-white">{found.length}</strong> {label} · about <strong className="text-white">{int(total)}</strong> clicks below expectation (estimate) · <strong className="text-white">{found.filter((row) => row.zero).length}</strong> with zero clicks</span>
        {found.length > 0 && <button type="button" onClick={() => downloadCsv('low-ctr.csv', [label, 'Impressions', 'Clicks', 'CTR', 'Position', 'Expected CTR', 'Est. missed clicks'], found.map((row) => [row.label, row.impressions, row.clicks, pct(row.ctr), pos(row.position), pct(row.expectedCtr), row.missedClicks]))} className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-white/20"><Download size={14} /> Export CSV</button>}
      </div>
      {shown.length === 0 ? <Empty>Nothing is clicking well below what its position predicts at these settings.</Empty> : (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="bg-white/5 text-left text-xs uppercase tracking-wider text-slate-400">
                <SortHead label={label === 'pages' ? 'Page' : 'Query'} k="label" sort={sort} onSort={onSort} />
                <SortHead label="Impressions" k="impressions" sort={sort} onSort={onSort} right />
                <SortHead label="Clicks" k="clicks" sort={sort} onSort={onSort} right />
                <SortHead label="CTR" k="ctr" sort={sort} onSort={onSort} right />
                <SortHead label="Expected" k="expectedCtr" sort={sort} onSort={onSort} right />
                <SortHead label="Position" k="position" sort={sort} onSort={onSort} right />
                <SortHead label="Est. missed clicks" k="missedClicks" sort={sort} onSort={onSort} right />
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => (
                <tr key={row.label} className="border-t border-white/5 hover:bg-white/[0.03]">
                  <th scope="row" className="max-w-xs break-all px-3 py-2 text-left font-semibold text-white">{label === 'pages' ? pathOf(row.label) : row.label}{row.zero && <span className="ml-2 rounded bg-rose-400/20 px-1.5 py-0.5 text-[10px] text-rose-200">0 clicks</span>}</th>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-300">{int(row.impressions)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-300">{int(row.clicks)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-300">{pct(row.ctr)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-500">{pct(row.expectedCtr)}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-slate-300">{pos(row.position)}</td>
                  <td className="px-3 py-2 text-right font-semibold tabular-nums text-amber-200">{int(row.missedClicks)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="mt-4 text-sm leading-6 text-slate-400"><strong className="text-slate-200">What to do: </strong>search the query and look at how your result reads next to the others. Rewrite a title that does not match the query, lead with the benefit, and give the meta description a reason to click. Also check for a featured snippet, AI answer or ad block above you, which lowers CTR whatever your snippet says.</p>
    </div>
  );
}

/* -------------------------------------------------------------------- shell */

export default function GscClient({ mode }) {
  const config = MODES[mode];
  const [current, setCurrent] = useState(null);
  const [previous, setPrevious] = useState(null);
  const [loaded, setLoaded] = useState({ current: '', previous: '' });
  const [busy, setBusy] = useState('');
  const [problem, setProblem] = useState('');

  const load = async (slot, fileList) => {
    setBusy(slot);
    setProblem('');
    try {
      const { tables, skipped } = await readGscFiles([...fileList]);
      const dataset = datasetFrom(tables);
      const usable = config.needs.some((kind) => dataset[kind].length);
      if (!usable) {
        setProblem(tables.length
          ? `That file does not contain what this tool needs. It needs ${config.needsText}. It contained ${tables.map((t) => t.kind === 'queryPage' ? 'query + page rows' : `${t.kind} rows`).join(', ')}.`
          : `No Search Console table was recognised${skipped.length ? ` in ${skipped.join(', ')}` : ''}. Upload the CSV files (or the ZIP) from the Performance report’s Export menu.`);
        return;
      }
      const summary = tables.map((t) => `${t.name.split('/').pop()}: ${t.rows.length.toLocaleString('en-US')} ${t.kind === 'queryPage' ? 'query+page rows' : t.kind}`).join(' · ');
      if (slot === 'previous') setPrevious(dataset); else setCurrent(dataset);
      setLoaded((state) => ({ ...state, [slot]: summary }));
      trackToolEvent(`gsc-${mode}`, 'upload', { tables: tables.length, rows: tables.reduce((n, t) => n + t.rows.length, 0) });
    } finally {
      setBusy('');
    }
  };

  const useSample = () => {
    setProblem('');
    if (mode === 'cannibalization') setCurrent({ queryPage: SAMPLE_QUERY_PAGE, queries: [], pages: [] });
    else if (mode === 'decay') { setCurrent({ queryPage: [], queries: [], pages: SAMPLE_PAGES_CURRENT }); setPrevious({ queryPage: [], queries: [], pages: SAMPLE_PAGES_PREVIOUS }); }
    else setCurrent({ queryPage: SAMPLE_QUERY_PAGE, queries: SAMPLE_QUERIES, pages: SAMPLE_PAGES_CURRENT });
    setLoaded({ current: 'Sample data for example.com (fictional)', previous: mode === 'decay' ? 'Sample data, previous period (fictional)' : '' });
    trackToolEvent(`gsc-${mode}`, 'sample', {});
  };

  const reset = () => { setCurrent(null); setPrevious(null); setLoaded({ current: '', previous: '' }); setProblem(''); };

  let results = null;
  if (current) {
    if (mode === 'cannibalization') {
      results = current.queryPage.length ? <CannibalizationResults rows={current.queryPage} dataset={current} /> : null;
    } else if (mode === 'decay') {
      const dimension = current.pages.length ? 'page' : 'query';
      const rows = dimension === 'page' ? current.pages : current.queries;
      const prevRows = previous ? (dimension === 'page' ? previous.pages : previous.queries) : null;
      const compareExport = rows.some((row) => row.prev);
      results = compareExport || prevRows?.length
        ? <DecayResults current={rows} previous={prevRows} dimension={dimension} />
        : <p className="mt-6 rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4 text-sm text-amber-100">Now add the same export for the <strong>previous period</strong> — or upload a single “compare dates” export that contains both.</p>;
    } else if (mode === 'striking') {
      results = <StrikingResults rows={current.queryPage.length ? current.queryPage : current.queries} />;
    } else {
      const label = current.pages.length ? 'pages' : 'queries';
      results = <CtrResults rows={current.pages.length ? current.pages : current.queries.length ? current.queries : current.queryPage} label={label} />;
    }
  }

  const hint = mode === 'cannibalization'
    ? 'Query + Page CSV (Looker Studio, Search Analytics for Sheets)'
    : mode === 'decay' ? 'Pages CSV/ZIP for the current period' : 'Queries or Pages CSV/ZIP from the Performance report';

  return (
    <div data-clarity-mask="true">
      <div className={cx('grid gap-4', mode === 'decay' && 'md:grid-cols-2')}>
        <Dropzone label={mode === 'decay' ? 'Current period (e.g. last 3 months)' : 'Drop your Search Console export here'} hint={hint} onFiles={(files) => load('current', files)} loaded={loaded.current} busy={busy === 'current'} />
        {mode === 'decay' && <Dropzone label="Previous period (the 3 months before)" hint="Same export, earlier dates — skip this if you upload a compare-dates export" onFiles={(files) => load('previous', files)} loaded={loaded.previous} busy={busy === 'previous'} />}
      </div>
      <p className="mt-3 text-center text-sm text-slate-400">
        No export handy? <button type="button" onClick={useSample} className="font-semibold text-indigo-300 underline decoration-dotted underline-offset-4 hover:text-white">Try sample data</button>
        {current && <> · <button type="button" onClick={reset} className="text-slate-400 underline decoration-dotted underline-offset-4 hover:text-white">Clear</button></>}
      </p>
      {problem && <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-100"><AlertTriangle size={16} className="mt-0.5 shrink-0" />{problem}</p>}
      {current && mode === 'cannibalization' && !current.queryPage.length && (
        <p className="mt-4 rounded-xl border border-amber-400/25 bg-amber-400/10 p-3 text-sm text-amber-100">Cannibalization needs to know which URL ranks for which query. The file you uploaded has only {current.queries.length ? 'queries' : 'pages'}. See “How to get a Query + Page export” below.</p>
      )}
      <div className="mt-6">{results}</div>
      <p className="mt-6 text-xs leading-5 text-slate-500">Everything is calculated in your browser; your Search Console data is never uploaded. “Estimated” click figures use a generic CTR-by-position curve, so treat them as a way to rank issues, not as a forecast.</p>
    </div>
  );
}
