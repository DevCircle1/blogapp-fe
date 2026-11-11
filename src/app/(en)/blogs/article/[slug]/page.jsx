import { permanentRedirect } from 'next/navigation';
import BlogPostDetail from '../../../../../components/blogs/BlogPostDetail.jsx';
import Seeded from '../../../../_components/Seeded.jsx';
import { findPost, getBlogSite } from '../../../../_lib/blogSite.js';
import { DEFAULT_LANG, articlePath, postLang } from '../../../../../i18n/locales.js';

export const revalidate = 600;
export const dynamicParams = false;

// Every post, whatever its language: German and Spanish articles once lived at
// /blogs/article/<slug>, so those old URLs must keep resolving (to a redirect).
export async function generateStaticParams() {
  const { posts } = await getBlogSite();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function Page({ params }) {
  const { slug } = await params;
  const post = await findPost(slug);
  // A post opened under another language's URL moves to its own, so each
  // article has exactly one address and one html lang.
  if (post && postLang(post) !== DEFAULT_LANG) permanentRedirect(articlePath(postLang(post), slug));
  return <Seeded path={articlePath(DEFAULT_LANG, slug)}><BlogPostDetail /></Seeded>;
}
