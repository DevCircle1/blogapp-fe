import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useModels } from '../../../../lib/llm/useModels.js';
import { compactTokens, priceLabel } from '../../../../lib/llm/cost.js';
import { MODEL_PAGE_SLUGS, providerOrder } from '../../../../data/llmModels.js';
import { Link } from 'react-router-dom';
import { cx } from '../../impl/toolFormat.js';

const COLUMNS = [
  { key: 'name', label: 'Model' },
  { key: 'input', label: 'Input / 1M', numeric: true },
  { key: 'cached', label: 'Cached input / 1M', numeric: true },
  { key: 'output', label: 'Output / 1M', numeric: true },
  { key: 'context', label: 'Context', numeric: true },
];

const formatDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

/**
 * The pricing table. Rendered on the server with the bundled prices so it is
 * in the static HTML, then re-sorted client-side on request.
 */
export default function PriceTable({ caption = true }) {
  const { models, verifiedOn } = useModels();
  const [sort, setSort] = useState({ key: 'provider', dir: 1 });

  const rows = useMemo(() => {
    const list = [...models];
    const { key, dir } = sort;
    list.sort((a, b) => {
      if (key === 'provider') {
        return (providerOrder.indexOf(a.provider) - providerOrder.indexOf(b.provider)) || a.input - b.input;
      }
      const av = a[key] ?? (dir > 0 ? Infinity : -Infinity);
      const bv = b[key] ?? (dir > 0 ? Infinity : -Infinity);
      if (typeof av === 'string') return av.localeCompare(bv) * dir;
      return (av - bv) * dir;
    });
    return list;
  }, [models, sort]);

  const toggle = (key) => setSort((current) => (current.key === key ? { key, dir: -current.dir } : { key, dir: 1 }));

  return (
    <div className="mt-8">
      {caption && (
        <p className="mb-3 text-sm text-slate-400">
          Prices in US dollars per million tokens, standard tier, prompts up to 200k tokens. <strong className="text-slate-200">Prices last verified {formatDate(verifiedOn)}</strong> against each provider’s own pricing page.
        </p>
      )}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-white/5 text-left text-xs uppercase tracking-wider text-slate-400">
              {COLUMNS.map((column) => (
                <th key={column.key} scope="col" className={cx('px-3 py-2.5', column.numeric && 'text-right')} aria-sort={sort.key === column.key ? (sort.dir > 0 ? 'ascending' : 'descending') : 'none'}>
                  <button type="button" onClick={() => toggle(column.key)} className="inline-flex items-center gap-1 uppercase tracking-wider hover:text-white">
                    {column.label}
                    {sort.key === column.key && (sort.dir > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((model) => (
              <tr key={model.slug} className="border-t border-white/5 hover:bg-white/[0.03]">
                <th scope="row" className="px-3 py-2 text-left font-semibold text-white">
                  {MODEL_PAGE_SLUGS.includes(model.slug)
                    ? <Link to={`/tools/llm-token-counter/${model.slug}`} className="hover:text-indigo-300">{model.name}</Link>
                    : model.name}
                  <span className="ml-2 text-xs font-normal text-slate-500">{model.provider}</span>
                  {model.promo && <span className="ml-2 rounded bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-200" title={model.promo}>promo</span>}
                </th>
                <td className="px-3 py-2 text-right tabular-nums text-slate-200">{priceLabel(model.input)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-400">{priceLabel(model.cached)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-200">{priceLabel(model.output)}</td>
                <td className="px-3 py-2 text-right tabular-nums text-slate-400">{compactTokens(model.context)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Cache-read prices apply to prompt text served from the provider’s cache. “—” means the provider did not list a value on its pricing page.
      </p>
    </div>
  );
}
