import BankStatementPage from '../../../../../components/tools/flagship/bank/BankStatementPage.jsx';
import Seeded from '../../../../_components/Seeded.jsx';
import { itemSlugs } from '../../../../_lib/flagship.js';

const PARENT = '/tools/bank-statement-converter';

export const revalidate = 3600;
export const dynamicParams = false;

export const generateStaticParams = () => itemSlugs(PARENT).map((bank) => ({ bank }));

export default async function Page({ params }) {
  const { bank } = await params;
  return <Seeded path={`${PARENT}/${bank}`}><BankStatementPage /></Seeded>;
}
