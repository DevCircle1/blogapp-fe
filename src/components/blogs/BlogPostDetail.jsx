import { useState, useEffect, useMemo } from 'react';
import { publicRequest } from '../../services/api';
import { useParams, Link, Navigate } from 'react-router-dom';
import Seo from '../common/Seo.jsx';
import AdSlot from '../common/AdSlot.jsx';
import { SITE_URL, SITE_NAME, breadcrumbSchema } from '../../seo/siteMeta.js';
import {
  DEFAULT_LANG, LOCALES, articlePath, blogPath, hubPath, postLang,
} from '../../i18n/locales.js';
import { blogChrome } from '../../i18n/blogChrome.js';
import { useSeed } from '../../context/seed.js';
import { sanitiseHtml } from '../../lib/blog/sanitize.js';
import { formatDate, postView, responseItems } from '../../lib/blog/views.js';

const plainText = (html) => (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const topicTags = (html) => {
  const match = (html || '').match(/data-topic-tags=["']([^"']+)["']/i);
  return match ? match[1].split(',').map((tag) => tag.trim()).filter(Boolean) : [];
};

/**
 * The body to render. A seeded post (src/context/seed.js) was sanitised at
 * build time (scripts/blog-data.mjs) and is used as is, so the first client
 * render matches the prerendered HTML. A fetched one is sanitised here. The
 * server never renders a body that has not been sanitised.
 */
const bodyOf = (post) => {
  if (!post?.content) return '';
  if (post.sanitised) return post.content;
  return typeof document === 'undefined' ? '' : sanitiseHtml(post.content, document);
};

// Same markup once parsed? The build's serialiser and the browser's order
// attributes differently, so the strings can differ for an identical body.
// Parsed into (inert) templates and compared as DOM trees instead.
const sameBody = (a, b) => {
  const [left, right] = [a, b].map((html) => {
    const template = document.createElement('template');
    template.innerHTML = html;
    return template.content;
  });
  return left.isEqualNode(right);
};

const BlogPostDetail = ({ lang = DEFAULT_LANG }) => {
  const { slug } = useParams();
  const seed = useSeed(`post:${lang}:${slug}`);
  const [post, setPost] = useState(seed?.post ?? null);
  const [isLoading, setIsLoading] = useState(!seed);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState(seed?.relatedPosts ?? []);
  const [postCategory, setPostCategory] = useState(seed?.postCategory ?? null);
  const [alternates, setAlternates] = useState(seed?.alternates ?? []);
  const chrome = blogChrome(lang);

  useEffect(() => {
    let cancelled = false;
    // Moving to another post: show its seed at once, or the loading state.
    if (seed) {
      setPost(seed.post);
      setRelatedPosts(seed.relatedPosts);
      setPostCategory(seed.postCategory);
      setAlternates(seed.alternates);
    } else {
      setIsLoading(true);
    }
    const fetchPost = async () => {
      try {
        setError(null);
        const [postResult, categoriesResult, postsResult] = await Promise.allSettled([
          publicRequest.get(`/posts/${slug}/`),
          publicRequest.get('/all-categories/'),
          publicRequest.get('/all-posts/'),
        ]);

        if (postResult.status === 'rejected') throw postResult.reason;
        if (cancelled) return;

        const fetched = postResult.value.data;
        const allPosts = postsResult.status === 'fulfilled' ? responseItems(postsResult.value.data) : [];
        const categories = categoriesResult.status === 'fulfilled' ? responseItems(categoriesResult.value.data) : [];
        const view = postView({ post: fetched, lang, categories, allPosts });

        // Keep the prerendered body when the post has not changed since the
        // build, rather than replacing identical markup (and its images).
        const unchanged = seed && seed.post.title === fetched.title
          && sameBody(seed.post.content, sanitiseHtml(fetched.content, document));
        setPost(unchanged ? seed.post : fetched);
        setPostCategory(view.postCategory);
        setRelatedPosts(view.relatedPosts);
        setAlternates(view.alternates);
      } catch (err) {
        if (cancelled) return;
        setError('Failed to fetch blog post');
        console.error('Error fetching post:', err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };
    fetchPost();
    return () => { cancelled = true; };
    // seed is looked up from slug and lang, so it changes only with them.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, lang]);

  const safeContent = useMemo(() => bodyOf(post), [post]);
  const excerpt = useMemo(() => {
    const text = plainText(post?.content);
    return text.length > 157 ? `${text.slice(0, 157).trimEnd()}…` : text;
  }, [post?.content]);
  const readingMinutes = useMemo(() => Math.max(1, Math.ceil(plainText(post?.content).split(/\s+/).filter(Boolean).length / 225)), [post?.content]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Seo title="Loading article" description="Loading article" path={articlePath(lang, slug)} lang={lang} noindex />
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Seo title={chrome.notFoundTitle} description={chrome.notFoundBody} path={articlePath(lang, slug)} lang={lang} noindex />
        <h1 className="text-2xl font-bold text-gray-800">{chrome.notFoundTitle}</h1>
        <p className="mt-3 text-gray-600">{chrome.notFoundBody}</p>
        <Link to={blogPath(lang)} className="mt-6 inline-block text-blue-600 hover:underline">{chrome.backToAll}</Link>
      </div>
    );
  }

  // A post opened under another language's URL moves to its own, so each
  // article has exactly one address and one html lang.
  if (postLang(post) !== lang) return <Navigate to={articlePath(postLang(post), slug)} replace />;

  const path = articlePath(lang, slug);
  const published = post.created_at ? new Date(post.created_at).toISOString() : undefined;
  const modified = post.updated_at ? new Date(post.updated_at).toISOString() : published;
  const keywords = topicTags(post.content);

  const categoryPath = postCategory?.slug ? `/blogs/category/${postCategory.slug}` : null;
  const breadcrumbs = [
    { name: chrome.home, path: lang === DEFAULT_LANG ? '/' : hubPath(lang) },
    { name: chrome.blog, path: blogPath(lang) },
    ...(categoryPath ? [{ name: postCategory.name, path: categoryPath }] : []),
    { name: post.title, path },
  ];
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: excerpt,
      image: post.featured_image ? [post.featured_image] : undefined,
      datePublished: published,
      dateModified: modified,
      author: { '@type': 'Person', name: post.author_name || SITE_NAME },
      publisher: { '@type': 'Organization', name: SITE_NAME, logo: { '@type': 'ImageObject', url: `${SITE_URL}/3.png` } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${path}` },
      wordCount: plainText(post.content).split(/\s+/).filter(Boolean).length,
      keywords: keywords.length ? keywords : undefined,
      inLanguage: LOCALES[lang].htmlLang,
    },
    breadcrumbSchema(breadcrumbs),
  ];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Seo
        title={post.title}
        description={excerpt || `Read ${post.title} on ${SITE_NAME}.`}
        path={path}
        image={post.featured_image || undefined}
        type="article"
        schemas={schemas}
        lang={lang}
        alternates={alternates}
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link to={breadcrumbs[0].path} className="hover:underline">{chrome.home}</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to={blogPath(lang)} className="hover:underline">{chrome.blog}</Link></li>
          <li aria-hidden="true">/</li>
          {categoryPath && (
            <>
              <li><Link to={categoryPath} className="hover:underline">{postCategory.name}</Link></li>
              <li aria-hidden="true">/</li>
            </>
          )}
          <li className="text-gray-800" aria-current="page">{post.title}</li>
        </ol>
      </nav>

      <article className="overflow-hidden rounded-xl bg-white shadow-lg">
        {post.featured_image && (
          <div className="h-96 overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              width="1200"
              height="630"
              fetchpriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          <header className="mb-6">
            <h1 className="mb-2 text-3xl font-bold text-gray-800">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span>{chrome.by} {post.author_name || SITE_NAME}</span>
              {post.created_at && <time dateTime={published}>{formatDate(post.created_at, LOCALES[lang].intl, { year: 'numeric', month: 'long', day: 'numeric' })}</time>}
              <span>{readingMinutes} {chrome.minRead}</span>
            </div>
          </header>

          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: safeContent }} />

          <AdSlot placement="articleInline" />

          {relatedPosts.length > 0 && (
            <aside className="mt-10 border-t border-gray-200 pt-8" aria-labelledby="related-articles-heading">
              <h2 id="related-articles-heading" className="text-2xl font-bold text-gray-800">
                {postCategory?.name ? `More ${postCategory.name} guides` : chrome.moreGuides}
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {relatedPosts.map((item) => (
                  <Link
                    key={item.slug}
                    to={articlePath(lang, item.slug)}
                    className="rounded-xl border border-gray-200 p-4 transition hover:border-blue-400 hover:shadow-sm"
                  >
                    <strong className="line-clamp-2 text-gray-800">{item.title}</strong>
                    <span className="mt-2 block text-sm font-semibold text-blue-600">{chrome.readGuide}</span>
                  </Link>
                ))}
              </div>
              {categoryPath && (
                <Link to={categoryPath} className="mt-5 inline-block font-semibold text-blue-600 hover:underline">
                  View all {postCategory.name} articles →
                </Link>
              )}
            </aside>
          )}

          <footer className="mt-10 border-t border-gray-200 pt-6">
            <Link to={blogPath(lang)} className="text-blue-600 hover:underline">{chrome.backToAll}</Link>
            <span className="mx-3 text-gray-300">|</span>
            <Link to={lang === DEFAULT_LANG ? '/tools' : hubPath(lang)} className="text-blue-600 hover:underline">{chrome.browseTools}</Link>
          </footer>
        </div>
      </article>
    </div>
  );
};

export default BlogPostDetail;
