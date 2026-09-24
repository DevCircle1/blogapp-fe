import { useMemo, useState } from 'react';
import {
  ArrowDownRight, ArrowUpRight, ChevronDown, Download, Minus,
} from 'lucide-react';
import { useTaxYears } from '../../../../lib/tax/useTaxYears.js';
import {
  compareYears, computeTax, groupLakh, grossForNet, pctText, pkr,
} from '../../../../lib/tax/compute.js';
import { previousYear, yearBySlug } from '../../../../data/pkTaxYears.js';
import { trackToolEvent } from '../../../../lib/toolAnalytics.js';
import { cx } from '../../impl/toolFormat.js';

const WATERMARK = 'talkandtool.com';

function Toggle({ value, onChange, options, label }) {
  return (
    <div role="group" aria-label={label} className="inline-flex rounded-xl bg-white/5 p-1">
      {options.map(([key, text]) => (
        <button key={key} type="button" aria-pressed={value === key} onClick={() => onChange(key)} className={cx('rounded-lg px-4 py-2 text-sm font-semibold transition', value === key ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white')}>{text}</button>
      ))}
    </div>
  );
}

function Delta({ value, unit }) {
  const rounded = Math.round(value);
  if (rounded === 0) return <span className="inline-flex items-center gap-1 text-slate-300"><Minus size={14} /> no change</span>;
  const up = rounded > 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={cx('inline-flex items-center gap-1 font-semibold', up ? 'text-emerald-300' : 'text-rose-300')}>
      <Icon size={16} aria-hidden="true" /> {up ? '+' : '−'}{pkr(Math.abs(rounded))} {unit} {up ? 'more take-home' : 'less take-home'}
    </span>
  );
}

/** Draws the shareable summary card onto a canvas: headline numbers plus the site watermark. */
function drawCard(canvas, { year, result, comparison, previous }) {
  const ctx = canvas.getContext('2d');
  const W = 1200; const H = 630;
  canvas.width = W; canvas.height = H;
  const gradient = ctx.createLinearGradient(0, 0, W, H);
  gradient.addColorStop(0, '#0f172a'); gradient.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#a5b4fc'; ctx.font = '600 30px system-ui, sans-serif';
  ctx.fillText(`Pakistan salary tax · ${year.label}`, 64, 92);
  ctx.fillStyle = '#94a3b8'; ctx.font = '400 28px system-ui, sans-serif';
  ctx.fillText(`Gross salary ${pkr(result.income / 12)} / month`, 64, 140);
  ctx.fillStyle = '#ffffff'; ctx.font = '800 96px system-ui, sans-serif';
  ctx.fillText(pkr(result.monthlyTakeHome), 64, 270);
  ctx.fillStyle = '#94a3b8'; ctx.font = '400 30px system-ui, sans-serif';
  ctx.fillText('monthly take-home pay', 64, 316);
  const stats = [['Monthly tax', pkr(result.monthlyTax)], ['Annual tax', pkr(result.totalTax)], ['Effective rate', pctText(result.effectiveRate)]];
  stats.forEach(([label, value], i) => {
    const x = 64 + i * 370;
    ctx.fillStyle = '#64748b'; ctx.font = '400 24px system-ui, sans-serif'; ctx.fillText(label, x, 400);
    ctx.fillStyle = '#e2e8f0'; ctx.font = '700 40px system-ui, sans-serif'; ctx.fillText(value, x, 448);
  });
  if (comparison && previous) {
    const diff = Math.round(comparison.monthlyDifference);
    ctx.fillStyle = diff >= 0 ? '#6ee7b7' : '#fda4af'; ctx.font = '700 34px system-ui, sans-serif';
    ctx.fillText(`${diff === 0 ? 'Same as' : diff > 0 ? `${pkr(diff)} more per month than` : `${pkr(-diff)} less per month than`} ${previous.label.replace('Tax Year ', '')}`, 64, 528);
  }
  ctx.fillStyle = '#818cf8'; ctx.font = '600 28px system-ui, sans-serif';
  ctx.textAlign = 'right'; ctx.fillText(WATERMARK, W - 64, H - 48); ctx.textAlign = 'left';
}

export default function PkTaxClient({ yearSlug, mode = 'salary' }) {
  const years = useTaxYears();
  const year = yearBySlug(years, yearSlug) || years[0];
  const previous = previousYear(years, year);

  const [period, setPeriod] = useState('monthly');
  const [direction, setDirection] = useState('gross'); // gross → net, or net → gross (gross-to-net page)
  const [amount, setAmount] = useState('250000');
  const [open, setOpen] = useState(false);

  const value = Number(String(amount).replace(/,/g, '')) || 0;
  const annualInput = period === 'monthly' ? value * 12 : value;
  const annualGross = direction === 'net' ? grossForNet(annualInput, year) : annualInput;

  const result = useMemo(() => computeTax(annualGross, year), [annualGross, year]);
  const comparison = useMemo(() => (previous ? compareYears(annualGross, year, previous) : null), [annualGross, year, previous]);

  const downloadCard = () => {
    const canvas = document.createElement('canvas');
    drawCard(canvas, { year, result, comparison, previous });
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pakistan-salary-tax-${year.slug}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      trackToolEvent('salary-tax-calculator-pakistan', 'download', { year: year.slug });
    }, 'image/png');
  };

  return (
    <div>
      <div className="flex flex-wrap items-end gap-4">
        {mode === 'gross-to-net' && (
          <Toggle label="Direction" value={direction} onChange={setDirection} options={[['gross', 'Gross → net'], ['net', 'Net → gross']]} />
        )}
        <Toggle label="Salary period" value={period} onChange={setPeriod} options={[['monthly', 'Monthly'], ['annual', 'Annual']]} />
        <label className="min-w-[14rem] grow text-sm font-medium text-slate-300">
          {direction === 'net' ? 'Take-home' : 'Gross'} salary per {period === 'monthly' ? 'month' : 'year'} (PKR)
          <input
            inputMode="numeric"
            value={amount}
            onChange={(event) => setAmount(event.target.value.replace(/[^\d,]/g, ''))}
            onBlur={() => setAmount(value ? groupLakh(value) : '')}
            className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-lg text-slate-100 outline-none transition focus:border-indigo-400"
          />
        </label>
      </div>

      {direction === 'net' && annualGross > 0 && (
        <p className="mt-3 text-sm text-slate-300">To take home {pkr(annualInput / (period === 'monthly' ? 12 : 1))} per {period === 'monthly' ? 'month' : 'year'}, you need a gross salary of about <strong className="text-white">{pkr(period === 'monthly' ? annualGross / 12 : annualGross)}</strong> per {period === 'monthly' ? 'month' : 'year'}.</p>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-live="polite">
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-5 sm:col-span-2 lg:col-span-1">
          <span className="text-xs uppercase tracking-wider text-emerald-200/80">Monthly take-home</span>
          <strong className="mt-1 block text-3xl font-black text-emerald-300">{pkr(result.monthlyTakeHome)}</strong>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><span className="text-xs uppercase tracking-wider text-slate-500">Monthly tax</span><strong className="mt-1 block text-2xl font-bold text-white">{pkr(result.monthlyTax)}</strong></div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><span className="text-xs uppercase tracking-wider text-slate-500">Annual tax</span><strong className="mt-1 block text-2xl font-bold text-white">{pkr(result.totalTax)}</strong></div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><span className="text-xs uppercase tracking-wider text-slate-500">Effective rate</span><strong className="mt-1 block text-2xl font-bold text-white">{pctText(result.effectiveRate)}</strong><span className="text-xs text-slate-500">marginal {pctText(result.marginalRate, 0)}</span></div>
      </div>

      <div className="mt-6">
        <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-300 hover:text-white">
          <ChevronDown size={16} className={cx('transition', open && 'rotate-180')} aria-hidden="true" /> {open ? 'Hide' : 'Show'} the slab-by-slab breakdown
        </button>
        {open && (
          <div className="mt-3 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="bg-white/5 text-left text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-3 py-2.5">Slab</th><th className="px-3 py-2.5 text-right">Income in slab</th><th className="px-3 py-2.5 text-right">Rate</th><th className="px-3 py-2.5 text-right">Tax from slab</th>
                </tr>
              </thead>
              <tbody>
                {result.breakdown.map(({ slab, taxableInSlab, contribution }) => (
                  <tr key={slab.min} className="border-t border-white/5">
                    <td className="px-3 py-2 text-slate-200">{pkr(slab.min)} – {slab.max == null ? 'no limit' : pkr(slab.max)}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-slate-300">{pkr(taxableInSlab)}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-slate-300">{pctText(slab.rate, 0)}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-white">{pkr(contribution)}</td>
                  </tr>
                ))}
                {result.surcharge > 0 && (
                  <tr className="border-t border-white/5"><td className="px-3 py-2 text-slate-200" colSpan={3}>Surcharge ({pctText(year.rules.surcharge.rate, 0)} of the tax, income above {pkr(year.rules.surcharge.threshold)})</td><td className="px-3 py-2 text-right tabular-nums text-white">{pkr(result.surcharge)}</td></tr>
                )}
                <tr className="border-t border-white/10 font-semibold"><td className="px-3 py-2 text-white" colSpan={3}>Total annual tax</td><td className="px-3 py-2 text-right tabular-nums text-white">{pkr(result.totalTax)}</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {comparison && previous && annualGross > 0 && (
        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/50 p-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">{year.label} vs {previous.label}</h3>
          <p className="mt-3 text-base"><Delta value={comparison.monthlyDifference} unit="per month" /></p>
          <p className="mt-1 text-sm text-slate-400">Annual difference: <Delta value={comparison.annualDifference} unit="per year" /></p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div><dt className="text-slate-500">{year.label} take-home</dt><dd className="font-semibold text-white">{pkr(comparison.now.monthlyTakeHome)}/mo</dd></div>
            <div><dt className="text-slate-500">{previous.label} take-home</dt><dd className="font-semibold text-white">{pkr(comparison.before.monthlyTakeHome)}/mo</dd></div>
            <div><dt className="text-slate-500">{year.label} tax</dt><dd className="font-semibold text-white">{pkr(comparison.now.totalTax)}</dd></div>
            <div><dt className="text-slate-500">{previous.label} tax</dt><dd className="font-semibold text-white">{pkr(comparison.before.totalTax)}</dd></div>
          </dl>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-2xl text-xs leading-5 text-slate-500">Covers salaried income only. Excludes other income, allowances and exemptions, tax credits and rebates, provident fund, EOBI and social security. Not tax advice.</p>
        <button type="button" onClick={downloadCard} disabled={!annualGross} className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-slate-100 transition hover:bg-white/20 disabled:opacity-40"><Download size={16} /> Download summary card (PNG)</button>
      </div>
    </div>
  );
}
