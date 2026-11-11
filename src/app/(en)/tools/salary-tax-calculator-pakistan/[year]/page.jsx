import TaxPage from '../../../../../components/tools/flagship/tax/TaxPage.jsx';
import Seeded from '../../../../_components/Seeded.jsx';
import { itemSlugs } from '../../../../_lib/flagship.js';

const PARENT = '/tools/salary-tax-calculator-pakistan';

export const revalidate = 3600;
export const dynamicParams = false;

export const generateStaticParams = () => itemSlugs(PARENT).map((year) => ({ year }));

export default async function Page({ params }) {
  const { year } = await params;
  return <Seeded path={`${PARENT}/${year}`}><TaxPage view="salary" /></Seeded>;
}
