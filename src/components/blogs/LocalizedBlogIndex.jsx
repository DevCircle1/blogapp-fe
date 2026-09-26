import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { publicRequest } from '../../services/api';
import Seo from '../common/Seo.jsx';
import { SITE_NAME, SITE_URL, breadcrumbSchema } from '../../seo/siteMeta.js';
import { LOCALES, articlePath, blogPath, hubPath } from '../../i18n/locales.js';
import { blogChrome } from '../../i18n/blogChrome.js';

const excerptOf = (html) => {
  const text = (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > 150 ? `${text.slice(0, 150).trimEnd()}…` : text;
};

/**
 * The article list for one localized blog (/de/ratgeber, /es/guias): every
 * approved post in that language, newest first. English keeps its category
 * pages at /blogs; localized blogs are small enough for a single list.
 */
export default function LocalizedBlogIndex({ lang }) {
  const chrome = blogChrome(lang);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    publicRequest.get(`/localized-posts/${lang}/`)
      .then((response) => { if (!cancelled) setPosts(response.data || []); })
      .catch((error) => console.error('Error fetching posts:', error))
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, [lang]);

  const path = blogPath(lang);
  const breadcrumbs = [
    { name: chrome.home, path: hubPath(lang) },
    { name: chrome.blog, path },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Seo
        title={chrome.indexTitle}
        description={chrome.indexDescription}
        path={path}
        lang={lang}
        noindex={!isLoading && posts.length === 0}
        schemas={[
          breadcrumbSchema(breadcrumbs),
          posts.length > 0 && {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            name: chrome.indexTitle,
            url: `${SITE_URL}${path}`,
            inLanguage: LOCALES[lang].htmlLang,
            mainEntity: {
              '@type': 'ItemList',
              itemListElement: posts.map((post, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                url: `${SITE_URL}${articlePath(lang, post.slug)}`,
                name: post.title,
              })),
            },
          },
        ]}
      />

      <div className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <nav aria-label="Breadcrumb" className="mb-4 text-sm text-gray-600">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link to={hubPath(lang)} className="hover:underline">{chrome.home}</Link></li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-800" aria-current="page">{chrome.blog}</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-gray-800">{chrome.indexHeading}</h1>
          <p className="mt-3 max-w-3xl leading-7 text-gray-600">{chrome.indexIntro}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {isLoading && (
          <div className="flex h-40 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500" />
          </div>
        )}
        {!isLoading && posts.length === 0 && <p className="py-16 text-center text-gray-500">{chrome.empty}</p>}
        {posts.length > 0 && (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                to={articlePath(lang, post.slug)}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 pb-[56.25%]">
                  <img
                    src={post.featured_image || '/og-cover.png'}
                    alt={post.featured_image ? post.title : `${SITE_NAME} — ${post.title}`}
                    className="absolute inset-0 h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-6">
                  <h2 className="mb-3 line-clamp-2 text-xl font-bold text-gray-800">{post.title}</h2>
                  <p className="line-clamp-3 text-sm leading-6 text-gray-600">{post.excerpt || excerptOf(post.content)}</p>
                  <span className="mt-4 block text-sm font-semibold text-blue-600">{chrome.readGuide}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
