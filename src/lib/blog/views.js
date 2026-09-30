/**
 * What each blog page derives from the raw posts and categories.
 *
 * Pure functions, shared by the pages (after a fetch in the browser) and by the
 * build (scripts/blog-pages.mjs, which prerenders every page and embeds this
 * same data in it). Both sides computing the page's first render with the same
 * code is what lets the prerendered HTML hydrate without a mismatch.
 */
import {
  DEFAULT_LANG, LOCALES, articlePath, postLang,
} from '../../i18n/locales.js';

export const responseItems = (data) => (Array.isArray(data) ? data : data?.results || []);

/** Posts in one language, in the order given (newest first from the API). */
export const postsIn = (posts, lang) => posts.filter((post) => postLang(post) === lang);

/** Each category with its (English) posts attached, as /all-categories returns it. */
export const categoriesWithPosts = (categories, posts) => categories.map((category) => {
  const articles = posts.filter((post) => String(post.category_id) === String(category.id));
  return { ...category, articles, total_articles: articles.length };
});

/* ------------------------------------------------------------ text helpers */

// The entities the editor and the HTML serialiser actually produce. Decoded
// without the DOM so the result is identical on the server and in the browser.
const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
  ndash: '–', mdash: '—', hellip: '…',
};
export const decodeEntities = (text) => text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code) => {
  if (code[0] === '#') {
    const point = code[1] === 'x' || code[1] === 'X' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
    return Number.isFinite(point) ? String.fromCodePoint(point) : match;
  }
  return ENTITIES[code.toLowerCase()] ?? match;
});

/**
 * Dates are formatted in UTC and a fixed locale: the prerender runs in the
 * build's time zone and locale, the visitor's browser in theirs, and the two
 * must print the same text for the page to hydrate.
 */
export const formatDate = (value, locale = 'en-US', options = {}) => (
  new Date(value).toLocaleDateString(locale, { ...options, timeZone: 'UTC' })
);

/* ---------------------------------------------------------------- homepage */

const stripHtmlTags = (html) => {
  if (!html) return 'No description available...';
  return decodeEntities(html.replace(/<[^>]*>/g, '')) || 'No description available...';
};

const readMinutes = (content) => {
  const plainText = stripHtmlTags(content);
  const words = plainText ? plainText.split(/\s+/).length : 0;
  return Math.ceil(words / 200);
};

const excerpt = (content, maxLength = 120) => {
  if (!content) return 'No excerpt available...';
  const plainText = stripHtmlTags(content);
  if (plainText.length <= maxLength) return plainText;
  return `${plainText.substring(0, maxLength)}...`;
};

// Stock photos for posts without an image, picked by slug so a post always
// gets the same one (a random pick would differ between server and browser).
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&fm=webp&q=70',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&fm=webp&q=70',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&fm=webp&q=70',
];
const fallbackImage = (slug = '') => {
  const sum = [...slug].reduce((total, char) => total + char.charCodeAt(0), 0);
  return FALLBACK_IMAGES[sum % FALLBACK_IMAGES.length];
};

/** One "Featured Blogs" card: everything it shows, and nothing else. */
export const homeCard = (post) => ({
  slug: post.slug,
  title: post.title,
  image: post.featured_image || fallbackImage(post.slug),
  excerpt: excerpt(post.content || post.excerpt),
  readMinutes: readMinutes(post.content),
  date: formatDate(post.created_at),
});

/** The homepage's blog sections, from /posts (English) and /top-categories. */
export const homeView = (englishPosts, topCategories) => ({
  postCount: englishPosts.length,
  featured: [...englishPosts]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 3)
    .map(homeCard),
  categories: topCategories.map((category) => ({
    id: category.id, name: category.name, total_articles: category.total_articles,
  })),
});

/* --------------------------------------------------------- blog index pages */

/**
 * /blogs: categories that have at least one published article, with what the
 * cards show. An empty category has no page (it answers 404), so it is not
 * listed either.
 */
export const blogCategoriesView = (categories) => categories
  .map((category) => ({
    ...category,
    articles: responseItems(category.articles).filter((article) => article.status === 'approved'),
  }))
  .filter((category) => category.articles.length > 0)
  .map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    total_articles: category.total_articles,
    published: category.articles.length,
    preview: category.articles.slice(0, 2).map((article) => ({
      slug: article.slug, title: article.title, featured_image: article.featured_image || null,
    })),
  }));

/** /blogs/category/<slug>: the category and its published posts. */
export const categoryView = (category) => ({
  category: { id: category.id, slug: category.slug, name: category.name, description: category.description || null },
  posts: responseItems(category.articles)
    .filter((post) => post.status === 'approved')
    .map((post) => ({
      id: post.id, slug: post.slug, title: post.title, featured_image: post.featured_image || null, date: formatDate(post.created_at),
    })),
});

const localizedExcerpt = (html) => {
  const text = (html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > 150 ? `${text.slice(0, 150).trimEnd()}…` : text;
};

/** /de/ratgeber, /es/guias: every published post in that language. */
export const localizedIndexView = (posts) => posts.map((post) => ({
  id: post.id,
  slug: post.slug,
  title: post.title,
  featured_image: post.featured_image || null,
  excerpt: post.excerpt || localizedExcerpt(post.content),
}));

/* ---------------------------------------------------------------- post page */

/**
 * hreflang set for a post that has translations: every approved post sharing
 * its translation_key, plus x-default pointing at the English version.
 */
export const translationAlternates = (post, allPosts) => {
  if (!post?.translation_key) return [];
  const versions = allPosts.filter((item) => item.translation_key === post.translation_key);
  if (versions.length < 2) return [];
  const english = versions.find((item) => postLang(item) === DEFAULT_LANG);
  return [
    ...versions.map((item) => ({ hreflang: LOCALES[postLang(item)].hreflang, path: articlePath(postLang(item), item.slug) })),
    ...(english ? [{ hreflang: 'x-default', path: articlePath(DEFAULT_LANG, english.slug) }] : []),
  ];
};

/**
 * A post page: the post, its category (English posts only sit in one), up to
 * three related posts, and its translations.
 */
export const postView = ({ post, lang, categories, allPosts }) => {
  const matchingCategory = lang === DEFAULT_LANG ? categories.find((item) => (
    responseItems(item.articles).some((article) => article.slug === post.slug)
  )) : null;
  const categoryPosts = matchingCategory
    ? responseItems(matchingCategory.articles).filter((item) => item.status === 'approved' && item.slug !== post.slug)
    : [];
  const fallbackPosts = allPosts.filter((item) => (
    item.status !== 'draft' && item.slug !== post.slug && postLang(item) === postLang(post)
  ));
  return {
    post,
    postCategory: matchingCategory ? { slug: matchingCategory.slug, name: matchingCategory.name } : null,
    relatedPosts: (categoryPosts.length ? categoryPosts : fallbackPosts).slice(0, 3)
      .map((item) => ({ slug: item.slug, title: item.title })),
    alternates: translationAlternates(post, allPosts),
  };
};
