import TextToHtmlTool from '../../../components/tools/TextToHtmlTool.jsx';
import Seeded from '../../_components/Seeded.jsx';

export const revalidate = 3600;

export default function Page() {
  return <Seeded path="/text-to-html"><TextToHtmlTool /></Seeded>;
}
