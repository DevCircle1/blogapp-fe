import { pkr } from '../../../../lib/tax/compute.js';

const longDate = (iso) => new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

const slabLabel = (slab, index) => {
  if (index === 0) return `Up to ${pkr(slab.max)}`;
  return slab.max == null ? `Above ${pkr(slab.min)}` : `${pkr(slab.min)} to ${pkr(slab.max)}`;
};

const rateText = (slab) => {
  if (slab.rate === 0) return '0%';
  const pct = `${Math.round(slab.rate * 1000) / 10}% of the amount over ${pkr(slab.min)}`;
  return slab.fixed ? `${pkr(slab.fixed)} + ${pct}` : pct;
};

/** Verified-on line: the date and the official source, stated where the numbers are. */
export function VerifiedLine({ year }) {
  return (
    <p className="text-sm text-slate-400">
      Slabs verified on <strong className="text-slate-200">{longDate(year.verifiedOn)}</strong>. Source:{' '}
      <a href={year.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-300 underline decoration-dotted underline-offset-4 hover:text-white">{year.sourceName}</a>.
    </p>
  );
}

/** Slab table for one tax year. Rendered into the static HTML, so it is what gets indexed and cited. */
export default function SlabTable({ year, heading, headingLevel = 'h2' }) {
  const Heading = headingLevel;
  return (
    <section aria-label={`${year.label} income tax slabs`} className="mt-8">
      {heading && <Heading className="text-2xl font-bold text-white">{heading}</Heading>}
      <p className="mt-2 text-sm text-slate-400">
        Salaried individuals, {year.label} ({year.taxYearName}), 1 July {year.effectiveFrom.slice(0, 4)} to 30 June {year.effectiveTo.slice(0, 4)}.
      </p>
      <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <caption className="sr-only">Income tax slabs for salaried individuals, {year.label}</caption>
          <thead>
            <tr className="bg-white/5 text-left text-xs uppercase tracking-wider text-slate-400">
              <th scope="col" className="px-3 py-2.5">Annual taxable income</th>
              <th scope="col" className="px-3 py-2.5">Tax</th>
            </tr>
          </thead>
          <tbody>
            {year.slabs.map((slab, index) => (
              <tr key={slab.min} className="border-t border-white/5">
                <th scope="row" className="px-3 py-2 text-left font-semibold text-white">{slabLabel(slab, index)}</th>
                <td className="px-3 py-2 text-slate-300">{rateText(slab)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {year.rules?.notes && <p className="mt-3 text-sm text-slate-400">{year.rules.notes}</p>}
      <div className="mt-2"><VerifiedLine year={year} /></div>
    </section>
  );
}
