import { BlogPostPage, postParams } from '../../../_lib/localizedBlog.jsx';

const SEGMENT = 'guias';

export const revalidate = 600;
export const dynamicParams = false;

export const generateStaticParams = () => postParams(SEGMENT);

export default function Page({ params }) {
  return <BlogPostPage params={params} />;
}
