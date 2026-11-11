import ResumePage from '../../../../../components/tools/flagship/resume/ResumePage.jsx';
import Seeded from '../../../../_components/Seeded.jsx';
import { itemSlugs } from '../../../../_lib/flagship.js';

const PARENT = '/tools/ats-resume-checker';

export const revalidate = 3600;
export const dynamicParams = false;

export const generateStaticParams = () => itemSlugs(PARENT).map((role) => ({ role }));

export default async function Page({ params }) {
  const { role } = await params;
  return <Seeded path={`${PARENT}/${role}`}><ResumePage /></Seeded>;
}
