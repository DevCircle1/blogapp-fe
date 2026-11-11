import WordleGame from '../../../components/tools/WordleGame.jsx';
import Seeded from '../../_components/Seeded.jsx';

export const revalidate = 3600;

export default function Page() {
  return <Seeded path="/word-game"><WordleGame /></Seeded>;
}
