import { useParams } from 'react-router-dom';
import FlagshipShell from '../FlagshipShell.jsx';
import ConverterClient from './ConverterClient.jsx';
import { BANK_PAGES, HUB_PATH } from './pages.js';
import NotFound from '../../../common/NotFound.jsx';

/** /tools/bank-statement-converter and /tools/bank-statement-converter/:bank */
export default function BankStatementPage() {
  const { bank } = useParams();
  const path = bank ? `${HUB_PATH}/${bank}` : HUB_PATH;
  const page = BANK_PAGES.find((item) => item.path === path);
  if (!page) return <NotFound />;
  return (
    <FlagshipShell page={page} privacy="Your statement never leaves this device. It is read in your browser and nothing is uploaded.">
      <ConverterClient />
    </FlagshipShell>
  );
}
