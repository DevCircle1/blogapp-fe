import ScreenResolutionTool from '../../../components/tools/ScreenResolutionTool.jsx';
import Seeded from '../../_components/Seeded.jsx';

export const revalidate = 3600;

export default function Page() {
  return <Seeded path="/screen-resolution"><ScreenResolutionTool /></Seeded>;
}
