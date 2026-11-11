import LlmPage from '../../../../../components/tools/flagship/llm/LlmPage.jsx';
import Seeded from '../../../../_components/Seeded.jsx';
import { itemSlugs } from '../../../../_lib/flagship.js';

const PARENT = '/tools/llm-token-counter';

export const revalidate = 3600;
export const dynamicParams = false;

export const generateStaticParams = () => itemSlugs(PARENT).map((model) => ({ model }));

export default async function Page({ params }) {
  const { model } = await params;
  return <Seeded path={`${PARENT}/${model}`}><LlmPage view="counter" /></Seeded>;
}
