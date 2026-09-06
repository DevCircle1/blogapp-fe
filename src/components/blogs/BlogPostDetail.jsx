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
      node.setAttribute('rel', 'nofollow ugc noopener');
      node.setAttribute('target', '_blank');
    }
    if (node.tagName === 'IMG') {
      node.setAttribute('loading', 'lazy');
      node.setAttribute('decoding', 'async');
    }
  });
  return template.innerHTML;
};

const plainText = (html) => (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const BlogPostDetail = () => {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await publicRequest.get(`/posts/${slug}/`);
        setPost(response.data);
      } catch (err) {
        setError('Failed to fetch blog post');
        console.error('Error fetching post:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
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
    },
    breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blogs' },
      { name: post.title, path },
    ]),
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
