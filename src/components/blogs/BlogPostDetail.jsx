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

/**
 * Post bodies come from the editor as HTML. Strip anything executable before it
 * reaches dangerouslySetInnerHTML — a stored script in a post body would run
 * with full access to the visitor's session.
 */
const sanitiseHtml = (html) => {
  if (typeof window === 'undefined' || !html) return html || '';
  const template = document.createElement('template');
  template.innerHTML = html;
  template.content.querySelectorAll('script, style, iframe, object, embed, link, meta, form').forEach((node) => node.remove());
  template.content.querySelectorAll('*').forEach((node) => {
    [...node.attributes].forEach((attribute) => {
      const name = attribute.name.toLowerCase();
      const value = attribute.value.trim().toLowerCase();
      if (name.startsWith('on') || value.startsWith('javascript:')) node.removeAttribute(attribute.name);
    });
    if (node.tagName === 'A') {
      const href = node.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      // Editorial links to this site should remain crawlable and pass context
      // between related pages. Only untrusted off-site links receive UGC and
      // nofollow attributes.
      try {
        const url = new URL(href, SITE_URL);
        if (url.origin === new URL(SITE_URL).origin) {
          node.removeAttribute('rel');
          node.removeAttribute('target');
        } else {
          node.setAttribute('rel', 'nofollow ugc noopener');
          node.setAttribute('target', '_blank');
        }
      } catch {
        node.removeAttribute('href');
      }
    }
    if (node.tagName === 'IMG') {
      node.setAttribute('loading', 'lazy');
      node.setAttribute('decoding', 'async');
    }
  });
  return template.innerHTML;
};

const plainText = (html) => (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const topicTags = (html) => {
  const match = (html || '').match(/data-topic-tags=["']([^"']+)["']/i);
  return match ? match[1].split(',').map((tag) => tag.trim()).filter(Boolean) : [];
};
const responseItems = (data) => (Array.isArray(data) ? data : data?.results || []);

/**
 * hreflang set for a post that has translations: every approved post sharing
 * its translation_key, plus x-default pointing at the English version.
 */
const translationAlternates = (post, allPosts) => {
  if (!post?.translation_key) return [];
  const versions = allPosts.filter((item) => item.translation_key === post.translation_key);
  if (versions.length < 2) return [];
  const english = versions.find((item) => postLang(item) === DEFAULT_LANG);
  return [
    ...versions.map((item) => ({ hreflang: LOCALES[postLang(item)].hreflang, path: articlePath(postLang(item), item.slug) })),
    ...(english ? [{ hreflang: 'x-default', path: articlePath(DEFAULT_LANG, english.slug) }] : []),
  ];
};

const BlogPostDetail = ({ lang = DEFAULT_LANG }) => {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [postCategory, setPostCategory] = useState(null);
  const [alternates, setAlternates] = useState([]);
  const chrome = blogChrome(lang);
  const { slug } = useParams();

  useEffect(() => {
    let cancelled = false;
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const [postResult, categoriesResult, postsResult] = await Promise.allSettled([
          publicRequest.get(`/posts/${slug}/`),
          publicRequest.get('/all-categories/'),
          publicRequest.get('/all-posts/'),
        ]);

        if (postResult.status === 'rejected') throw postResult.reason;
        if (cancelled) return;

        const currentPost = postResult.value.data;
        const allPosts = postsResult.status === 'fulfilled' ? responseItems(postsResult.value.data) : [];
        const categories = categoriesResult.status === 'fulfilled' ? responseItems(categoriesResult.value.data) : [];
        // Categories are English-language groupings, so only English posts sit in one.
        const matchingCategory = lang === DEFAULT_LANG ? categories.find((item) => (
          responseItems(item.articles).some((article) => article.slug === slug)
        )) : null;
        const categoryPosts = matchingCategory
          ? responseItems(matchingCategory.articles).filter((item) => item.status === 'approved' && item.slug !== slug)
          : [];
        const fallbackPosts = allPosts.filter((item) => (
          item.status !== 'draft' && item.slug !== slug && postLang(item) === postLang(currentPost)
        ));

        setPost(currentPost);
        setPostCategory(matchingCategory || null);
        setRelatedPosts((categoryPosts.length ? categoryPosts : fallbackPosts).slice(0, 3));
        setAlternates(translationAlternates(currentPost, allPosts));
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
  }, [slug, lang]);

  const safeContent = useMemo(() => sanitiseHtml(post?.content), [post?.content]);
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
              {post.created_at && <time dateTime={published}>{new Date(post.created_at).toLocaleDateString(LOCALES[lang].intl, { year: 'numeric', month: 'long', day: 'numeric' })}</time>}
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
