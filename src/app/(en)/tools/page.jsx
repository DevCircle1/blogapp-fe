import ToolsPage from '../../../components/tools/ToolsPage.jsx';
import Seeded from '../../_components/Seeded.jsx';

export const revalidate = 3600;

export default function Page() {
  return <Seeded path="/tools"><ToolsPage /></Seeded>;
}
