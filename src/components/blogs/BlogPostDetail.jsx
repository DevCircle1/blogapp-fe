import { useState, useEffect, useMemo } from 'react';
import { publicRequest } from '../../services/api';
import { useParams, Link } from 'react-router-dom';
import Seo from '../common/Seo.jsx';
import AdSlot from '../common/AdSlot.jsx';
import { SITE_URL, SITE_NAME, breadcrumbSchema } from '../../seo/siteMeta.js';

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

const BlogPostDetail = () => {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [postCategory, setPostCategory] = useState(null);
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
          publicRequest.get('/posts/'),
        ]);

        if (postResult.status === 'rejected') throw postResult.reason;
        if (cancelled) return;

        const currentPost = postResult.value.data;
        const categories = categoriesResult.status === 'fulfilled' ? responseItems(categoriesResult.value.data) : [];
        const matchingCategory = categories.find((item) => (
          responseItems(item.articles).some((article) => article.slug === slug)
        ));
        const categoryPosts = matchingCategory
          ? responseItems(matchingCategory.articles).filter((item) => item.status === 'approved' && item.slug !== slug)
          : [];
        const fallbackPosts = postsResult.status === 'fulfilled'
          ? responseItems(postsResult.value.data).filter((item) => item.status !== 'draft' && item.slug !== slug)
          : [];

        setPost(currentPost);
        setPostCategory(matchingCategory || null);
        setRelatedPosts((categoryPosts.length ? categoryPosts : fallbackPosts).slice(0, 3));
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
  }, [slug]);

  const safeContent = useMemo(() => sanitiseHtml(post?.content), [post?.content]);
  const excerpt = useMemo(() => {
    const text = plainText(post?.content);
    return text.length > 157 ? `${text.slice(0, 157).trimEnd()}…` : text;
  }, [post?.content]);
  const readingMinutes = useMemo(() => Math.max(1, Math.ceil(plainText(post?.content).split(/\s+/).filter(Boolean).length / 225)), [post?.content]);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Seo title="Loading article" description="Loading article" path={`/blogs/article/${slug}`} noindex />
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Seo title="Article not found" description="This article is not available." path={`/blogs/article/${slug}`} noindex />
        <h1 className="text-2xl font-bold text-gray-800">Article not available</h1>
        <p className="mt-3 text-gray-600">{error || 'This post may have been moved or removed.'}</p>
        <Link to="/blogs" className="mt-6 inline-block text-blue-600 hover:underline">Back to all articles</Link>
      </div>
    );
  }

  const path = `/blogs/article/${slug}`;
  const published = post.created_at ? new Date(post.created_at).toISOString() : undefined;
  const modified = post.updated_at ? new Date(post.updated_at).toISOString() : published;
  const keywords = topicTags(post.content);

  const categoryPath = postCategory?.slug ? `/blogs/category/${postCategory.slug}` : null;
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blogs' },
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
      />

      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-gray-600">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link to="/" className="hover:underline">Home</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to="/blogs" className="hover:underline">Blog</Link></li>
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
              <span>By {post.author_name || SITE_NAME}</span>
              {post.created_at && <time dateTime={published}>{new Date(post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</time>}
              <span>{readingMinutes} min read</span>
            </div>
          </header>

          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: safeContent }} />

          <AdSlot placement="articleInline" />

          {relatedPosts.length > 0 && (
            <aside className="mt-10 border-t border-gray-200 pt-8" aria-labelledby="related-articles-heading">
              <h2 id="related-articles-heading" className="text-2xl font-bold text-gray-800">
                More {postCategory?.name ? `${postCategory.name} ` : ''}guides
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {relatedPosts.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/blogs/article/${item.slug}`}
                    className="rounded-xl border border-gray-200 p-4 transition hover:border-blue-400 hover:shadow-sm"
                  >
                    <strong className="line-clamp-2 text-gray-800">{item.title}</strong>
                    <span className="mt-2 block text-sm font-semibold text-blue-600">Read this guide →</span>
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
            <Link to="/blogs" className="text-blue-600 hover:underline">← Read more articles</Link>
            <span className="mx-3 text-gray-300">|</span>
            <Link to="/tools" className="text-blue-600 hover:underline">Browse free online tools</Link>
          </footer>
        </div>
      </article>
    </div>
  );
};

export default BlogPostDetail;
