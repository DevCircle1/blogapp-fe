import CategoryBlogPosts from '../../../../../components/blogs/CategoryBlogPosts.jsx';
import Seeded from '../../../../_components/Seeded.jsx';
import { getBlogSite } from '../../../../_lib/blogSite.js';

// Every category with posts is generated at build and refreshed in the background;
// any other URL is an unmatched route and gets the global 404 (src/app/global-not-found.jsx).
export const revalidate = 600;
export const dynamicParams = false;

export async function generateStaticParams() {
  const { pages } = await getBlogSite();
  return pages.routes
    .filter((route) => route.path.startsWith('/blogs/category/'))
    .map((route) => ({ categorySlug: route.path.split('/').pop() }));
}

export default async function Page({ params }) {
  const { categorySlug } = await params;
  return <Seeded path={`/blogs/category/${categorySlug}`}><CategoryBlogPosts /></Seeded>;
}
