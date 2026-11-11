import IPAddressChecker from '../../../components/tools/ip.jsx';
import Seeded from '../../_components/Seeded.jsx';

export const revalidate = 3600;

export default function Page() {
  return <Seeded path="/check-ip"><IPAddressChecker /></Seeded>;
}
