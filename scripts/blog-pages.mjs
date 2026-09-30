/**
 * Turns the build-time blog snapshot (scripts/blog-data.mjs) into pages:
 *
 *   routes    every page that exists only because of blog data — each
 *             non-empty category, each published post, each localized guide
 *             index that has posts — with sitemap fields and fallback <head>
 *             values (the real ones come from the page's <Seo> via Helmet).
 *   seeds     per path, the data a page renders with (src/context/seed.js),
 *             derived with the same functions the pages use after a fetch.
 *   expect    per path, what the generated HTML must contain, for the verify
 *             step: titles, links and, for posts, the full article body.
 *   notFound  Netlify rules answering unknown blog URLs with a real 404.
 *
 * Categories and guide indexes without posts get no page and answer 404.
 */
import {
  BLOG_SEGMENTS, DEFAULT_LANG, LOCALES, articlePath, blogPath, postLang,
} from '../src/i18n/locales.js';
import { blogChrome } from '../src/i18n/blogChrome.js';
import {
  blogCategoriesView, categoriesWithPosts, categoryView, homeView, localizedIndexView, postView,
  postsIn, translationAlternates,
} from '../src/lib/blog/views.js';

const SITE_NAME = 'Talk & Tool';
const day = (value) => String(value).slice(0, 10);
const newest = (posts) => day(posts.map((post) => post.updated_at || post.created_at).sort().at(-1));
const summary = (html, length = 155) => {
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > length ? `${text.slice(0, length - 1).trimEnd()}…` : text;
};

// What a post page is seeded with: the sanitised body in place of the stored one.
const seededPost = ({ html, ...post }) => ({ ...post, content: html, sanitised: true });

export const blogPages = ({ posts, categories }) => {
  const english = postsIn(posts, DEFAULT_LANG);
  // As /all-categories returns them: English posts attached to each.
  const allCategories = categoriesWithPosts(categories, english);
  const routes = [];
  const seeds = new Map();
  const expect = new Map();

  /* ------------------------------------------------ pages that already exist */
  const home = homeView(english, allCategories.filter((category) => category.is_featured));
  seeds.set('/', { home });
  expect.set('/', {
    texts: home.featured.map((card) => card.title),
    links: home.featured.map((card) => articlePath(DEFAULT_LANG, card.slug)),
  });

  const listed = blogCategoriesView(allCategories);
  seeds.set('/blogs', { blogs: listed });
  expect.set('/blogs', {
    texts: listed.flatMap((category) => [category.name, ...category.preview.map((article) => article.title)]),
    links: listed.map((category) => `/blogs/category/${category.slug}`),
  });

  /* ---------------------------------------------------------- category pages */
  for (const category of allCategories.filter((item) => item.articles.length > 0)) {
    const path = `/blogs/category/${category.slug}`;
    const view = categoryView(category);
    routes.push({
      path,
      title: `${category.name} Articles | ${SITE_NAME}`,
      description: category.description || `Read ${view.posts.length} articles about ${category.name.toLowerCase()} on ${SITE_NAME}.`,
      lastmod: newest(category.articles),
      changefreq: 'weekly',
      priority: '0.6',
    });
    seeds.set(path, { [`category:${category.slug}`]: view });
    expect.set(path, {
      texts: view.posts.map((post) => post.title),
      links: view.posts.map((post) => articlePath(DEFAULT_LANG, post.slug)),
    });
  }

  /* -------------------------------------------------------------- post pages */
  for (const post of posts) {
    const lang = postLang(post);
    if (!LOCALES[lang] || (lang !== DEFAULT_LANG && !BLOG_SEGMENTS[lang])) {
      throw new Error(`Post "${post.slug}" is in "${lang}", which has no blog section (src/i18n/locales.js BLOG_SEGMENTS).`);
    }
    const path = articlePath(lang, post.slug);
    const view = postView({ post: seededPost(post), lang, categories: allCategories, allPosts: posts });
    routes.push({
      path,
      lang,
      title: `${post.title} | ${SITE_NAME}`,
      description: summary(post.html),
      lastmod: day(post.updated_at || post.created_at),
      changefreq: 'monthly',
      priority: '0.7',
      alternates: translationAlternates(post, posts),
    });
    seeds.set(path, { [`post:${lang}:${post.slug}`]: view });
    expect.set(path, {
      texts: [post.title],
      body: post.html,
      links: view.relatedPosts.map((item) => articlePath(lang, item.slug)),
      article: true,
    });
  }

  /* -------------------------------------------------- localized guide indexes */
  const notFound = ['/blogs/article', '/blogs/article/*', '/blogs/category', '/blogs/category/*'];
  for (const lang of Object.keys(BLOG_SEGMENTS)) {
    const path = blogPath(lang);
    const list = postsIn(posts, lang);
    notFound.push(`${path}/*`);
    if (!list.length) {
      notFound.push(path);
      continue;
    }
    const view = localizedIndexView(list);
    routes.push({
      path,
      lang,
      title: `${blogChrome(lang).indexTitle} | ${SITE_NAME}`,
      description: blogChrome(lang).indexDescription,
      lastmod: newest(list),
      changefreq: 'weekly',
      priority: '0.8',
    });
    seeds.set(path, { [`blogIndex:${lang}`]: view });
    expect.set(path, {
      texts: view.map((post) => post.title),
      links: view.map((post) => articlePath(lang, post.slug)),
    });
  }

  return { routes, seeds, expect, notFound };
};
