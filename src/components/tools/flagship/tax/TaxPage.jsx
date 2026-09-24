import { Link, useParams } from 'react-router-dom';
import FlagshipShell from '../FlagshipShell.jsx';
import PkTaxClient from './PkTaxClient.jsx';
import SlabTable from './SlabTable.jsx';
import { NET_PATH, SLABS_PATH, TAX_PAGES, TAX_PATH } from './pages.js';
import { TAX_YEARS, currentYear, yearBySlug } from '../../../../data/pkTaxYears.js';
import NotFound from '../../../common/NotFound.jsx';

const PRIVACY = 'Your salary is calculated in this browser and never sent anywhere.';

/** /tools/salary-tax-calculator-pakistan[/:year], /tools/income-tax-slabs-pakistan, /tools/gross-to-net-salary-pakistan */
export default function TaxPage({ view }) {
  const { year: yearParam } = useParams();
  const path = view === 'slabs' ? SLABS_PATH : view === 'net' ? NET_PATH : yearParam ? `${TAX_PATH}/${yearParam}` : TAX_PATH;
  const page = TAX_PAGES.find((item) => item.path === path);
  if (!page) return <NotFound />;
  const current = currentYear(TAX_YEARS);
  const year = page.yearSlug ? yearBySlug(TAX_YEARS, page.yearSlug) : current;

  if (view === 'slabs') {
    return (
      <FlagshipShell page={page}>
        {TAX_YEARS.map((item, index) => (
          <SlabTable key={item.slug} year={item} heading={`Income tax slabs Pakistan ${item.slug}`} headingLevel={index === 0 ? 'h2' : 'h3'} />
        ))}
        <p className="mt-8 text-sm"><Link to={TAX_PATH} className="font-semibold text-indigo-300 hover:text-white">Calculate your own tax with these slabs →</Link></p>
      </FlagshipShell>
    );
  }
  return (
    <FlagshipShell
      page={page}
      privacy={PRIVACY}
      afterTool={<SlabTable year={year} heading={`Income tax slabs Pakistan ${year.slug}`} />}
    >
      {page.pastYear && (
        <p className="mb-5 rounded-xl border border-amber-400/25 bg-amber-400/10 p-3 text-sm text-amber-100">
          You are viewing {year.label}. For today’s figures use the <Link to={TAX_PATH} className="font-semibold underline">{current.label} calculator</Link>.
        </p>
      )}
      <PkTaxClient yearSlug={year.slug} mode={view === 'net' ? 'gross-to-net' : 'salary'} />
    </FlagshipShell>
  );
}
