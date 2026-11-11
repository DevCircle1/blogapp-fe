import { BlogIndexPage, indexParams } from '../../_lib/localizedBlog.jsx';

const SEGMENT = 'ratgeber';

export const revalidate = 600;
export const dynamicParams = false;

export const generateStaticParams = () => indexParams(SEGMENT);

export default function Page({ params }) {
  return <BlogIndexPage params={params} />;
}
