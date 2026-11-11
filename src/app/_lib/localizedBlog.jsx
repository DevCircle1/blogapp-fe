import LocalizedBlogIndex from '../../components/blogs/LocalizedBlogIndex.jsx';
import BlogPostDetail from '../../components/blogs/BlogPostDetail.jsx';
import Seeded from '../_components/Seeded.jsx';
import { getBlogSite } from './blogSite.js';
import { BLOG_SEGMENTS, articlePath, blogPath, postLang } from '../../i18n/locales.js';

/**
 * The localized blog sections (/de/ratgeber, /es/guias). The URL segment names
 * the section, so each one has its own folder under app/[lang]; the logic is
 * shared here, parameterised by that segment. Only languages with published
 * posts get pages; every other URL is unmatched and gets the global 404.
 */
const langsFor = (segment) => Object.keys(BLOG_SEGMENTS).filter((lang) => BLOG_SEGMENTS[lang] === segment);

export async function indexParams(segment) {
  const { pages } = await getBlogSite();
  return langsFor(segment)
    .filter((lang) => pages.routes.some((route) => route.path === blogPath(lang)))
    .map((lang) => ({ lang }));
}

export async function BlogIndexPage({ params }) {
  const { lang } = await params;
  return <Seeded path={blogPath(lang)}><LocalizedBlogIndex lang={lang} /></Seeded>;
}

export async function postParams(segment) {
  const { posts } = await getBlogSite();
  return posts
    .filter((post) => langsFor(segment).includes(postLang(post)))
    .map((post) => ({ lang: postLang(post), slug: post.slug }));
}

export async function BlogPostPage({ params }) {
  const { lang, slug } = await params;
  return <Seeded path={articlePath(lang, slug)}><BlogPostDetail lang={lang} /></Seeded>;
}
