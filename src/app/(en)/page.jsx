import HomePage from '../../components/common/Home/HomePage.jsx';
import Seeded from '../_components/Seeded.jsx';

export const revalidate = 600;

export default function Page() {
  return <Seeded path="/"><HomePage /></Seeded>;
}
