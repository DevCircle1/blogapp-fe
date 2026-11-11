import BlogCategories from '../../../components/blogs/BlogCategories.jsx';
import Seeded from '../../_components/Seeded.jsx';

export const revalidate = 600;

export default function Page() {
  return <Seeded path="/blogs"><BlogCategories /></Seeded>;
}
