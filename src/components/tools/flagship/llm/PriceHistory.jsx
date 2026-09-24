import { useMemo } from 'react';
import { usePriceHistory } from '../../../../lib/llm/useModels.js';
import { LLM_MODELS } from '../../../../data/llmModels.js';

const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f472b6', '#38bdf8', '#a78bfa'];
const W = 640;
const H = 220;
const PAD = { l: 44, r: 12, t: 12, b: 24 };

/**
 * Input-price history from Supabase `llm_price_history`, drawn as step lines.
 * Renders nothing until at least one model has two recorded prices — an empty
 * chart would only be noise.
 */
export default function PriceHistory() {
  const rows = usePriceHistory();
  const series = useMemo(() => {
    const map = new Map();
    rows.forEach((row) => {
      if (!map.has(row.slug)) map.set(row.slug, []);
      map.get(row.slug).push({ t: new Date(row.changed_at).getTime(), v: Number(row.input_per_1m) });
    });
    return [...map.entries()].filter(([, points]) => points.length >= 2).slice(0, 6);
  }, [rows]);

  if (!series.length) return null;
  const all = series.flatMap(([, points]) => points);
  const t0 = Math.min(...all.map((p) => p.t));
  const t1 = Math.max(...all.map((p) => p.t)) || t0 + 1;
  const vmax = Math.max(...all.map((p) => p.v));
  const x = (t) => PAD.l + ((t - t0) / (t1 - t0 || 1)) * (W - PAD.l - PAD.r);
  const y = (v) => H - PAD.b - (v / vmax) * (H - PAD.t - PAD.b);

  return (
    <section className="mt-10" aria-label="Price history">
      <h2 className="text-2xl font-bold">Price history</h2>
      <p className="mt-2 text-sm text-slate-400">Input price per million tokens each time we recorded a change.</p>
      <svg viewBox={`0 0 ${W} ${H}`} className="mt-4 w-full rounded-2xl border border-white/10 bg-slate-950/60" role="img" aria-label="Line chart of input price changes over time">
        <text x={PAD.l - 6} y={y(vmax) + 4} textAnchor="end" className="fill-slate-500 text-[10px]">${vmax}</text>
        <text x={PAD.l - 6} y={y(0) + 4} textAnchor="end" className="fill-slate-500 text-[10px]">$0</text>
        {series.map(([slug, points], index) => {
          const d = points.map((p, i) => (i ? `H${x(p.t)} V${y(p.v)}` : `M${x(p.t)} ${y(p.v)}`)).join(' ');
          return <path key={slug} d={d} fill="none" stroke={COLORS[index % COLORS.length]} strokeWidth="2" />;
        })}
      </svg>
      <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-400">
        {series.map(([slug], index) => (
          <li key={slug} className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
            {LLM_MODELS.find((model) => model.slug === slug)?.name || slug}
          </li>
        ))}
      </ul>
    </section>
  );
}
