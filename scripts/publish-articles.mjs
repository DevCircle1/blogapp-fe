/**
 * Publishes the articles in scripts/content/articles to the Supabase `posts`
 * table, with their cover and infographic images uploaded to the blog-images
 * bucket.
 *
 *   npm run blog:publish                 publish or update every article
 *   npm run blog:publish -- --dry-run    validate and write the images locally only
 *   npm run blog:publish -- --only=slug  one article
 *
 * English articles sit directly in articles/; other languages in a folder named
 * after the language (articles/de, articles/es) and publish to that language's
 * blog. Articles that are versions of each other share a translationKey.
 *
 * Articles are matched on slug, so re-running updates posts in place rather than
 * duplicating them. Needs SUPABASE_SECRET_KEY in .env (never a VITE_ variable).
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { renderCoverSvg, renderInfographicSvg, toPng } from './content/images.mjs';
import { allRoutes } from './routes.mjs';
import { BLOG_SEGMENTS, DEFAULT_LANG, articlePath } from '../src/i18n/locales.js';

const root = dirname(fileURLToPath(import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).map((arg) => {
  const [key, value] = arg.replace(/^--/, '').split('=');
  return [key, value ?? true];
}));

const env = { ...process.env };
const envFile = join(root, '..', '.env');
if (existsSync(envFile)) {
  readFileSync(envFile, 'utf8').split(/\r?\n/).forEach((line) => {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (match && !env[match[1]]) env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  });
}

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const KEY = env.SUPABASE_SECRET_KEY;
const BUCKET = env.VITE_SUPABASE_BLOG_IMAGES_BUCKET || 'blog-images';
const dryRun = Boolean(args['dry-run']);

if (!dryRun && (!SUPABASE_URL || !KEY)) {
  console.error('VITE_SUPABASE_URL and SUPABASE_SECRET_KEY must be set in .env (or use --dry-run).');
  process.exit(1);
}

const headers = { apikey: KEY, Authorization: `Bearer ${KEY}` };
const rest = async (path, init = {}) => {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=representation', ...init.headers },
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`${init.method || 'GET'} ${path}: ${response.status} ${body}`);
  return body ? JSON.parse(body) : null;
};

const upload = async (path, png) => {
  const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${path}`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'image/png', 'x-upsert': 'true', 'Cache-Control': 'max-age=31536000' },
    body: png,
  });
  if (!response.ok) throw new Error(`upload ${path}: ${response.status} ${await response.text()}`);
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
};

/* ------------------------------------------------------------------ load */
const articleDir = join(root, 'content', 'articles');
const listFiles = (lang) => {
  const dir = lang === DEFAULT_LANG ? articleDir : join(articleDir, lang);
  return existsSync(dir) ? readdirSync(dir).filter((file) => file.endsWith('.mjs')).sort().map((file) => ({ lang, dir, file })) : [];
};
const files = [DEFAULT_LANG, ...Object.keys(BLOG_SEGMENTS)].flatMap(listFiles);
const slugOf = (file) => file.replace(/^\d+-/, '').replace(/\.mjs$/, '');
const articles = [];
for (const { lang, dir, file } of files) {
  const article = (await import(pathToFileURL(join(dir, file)).href)).default;
  const label = lang === DEFAULT_LANG ? file : `${lang}/${file}`;
  if (!args.only || args.only === article.slug) articles.push({ ...article, lang, file: label });
}
if (!articles.length) {
  console.error(args.only ? `No article with slug "${args.only}".` : 'No articles found.');
  process.exit(1);
}

/* -------------------------------------------------------------- validate */
const canRead = Boolean(SUPABASE_URL && KEY);
// The language columns come from supabase/blog_languages.sql; before that runs,
// every stored post is English.
const hasLanguageColumns = canRead && await rest('posts?select=language,translation_key&limit=1').then(() => true, () => false);
const existingPosts = !canRead ? []
  : await rest(`posts?select=id,slug,author_id,status${hasLanguageColumns ? ',language' : ''}`);
const knownPaths = new Set([
  ...allRoutes.map((route) => route.path),
  ...existingPosts.map((post) => articlePath(post.language || DEFAULT_LANG, post.slug)),
  ...files.map(({ lang, file }) => articlePath(lang, slugOf(file))),
]);

const problems = [];
const plain = (html) => html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
for (const article of articles) {
  const where = `${article.file}:`;
  if (!article.file.endsWith(`${article.slug}.mjs`)) problems.push(`${where} file name must end with the slug`);
  if (article.title.length > 65) problems.push(`${where} title is ${article.title.length} chars (keep ≤ 65)`);
  if (!/^<p>/.test(article.html.trim())) problems.push(`${where} body must open with a <p> intro (it becomes the meta description)`);
  if (!article.html.includes('{{infographic}}')) problems.push(`${where} missing {{infographic}} placeholder`);
  if (article.tags.length < 4) problems.push(`${where} needs at least 4 tags`);
  for (const [, href] of article.html.matchAll(/href="([^"]+)"/g)) {
    if (href.startsWith('/') && !knownPaths.has(href.split('#')[0])) problems.push(`${where} broken internal link ${href}`);
    // A German reader sent to an English page is a dead end, and the link
    // does nothing for the German page it should be supporting.
    const inSection = href === `/${article.lang}` || href.startsWith(`/${article.lang}/`);
    if (article.lang !== DEFAULT_LANG && href.startsWith('/') && !inSection) {
      problems.push(`${where} links to ${href}, outside the ${article.lang} section`);
    }
  }
  const words = plain(article.html).split(' ').length;
  // A stub check, not a length target. German compounds and Spanish clitics
  // carry the same content in fewer words than English.
  const minWords = article.lang === DEFAULT_LANG ? 700 : 600;
  if (words < minWords) problems.push(`${where} only ${words} words`);
}
if (problems.length) {
  console.error(`Validation failed:\n  ${problems.join('\n  ')}`);
  process.exit(1);
}
const needsLanguageColumns = articles.some((article) => article.lang !== DEFAULT_LANG || article.translationKey);
if (!dryRun && needsLanguageColumns && !hasLanguageColumns) {
  console.error('These articles need the posts.language and posts.translation_key columns.\nRun supabase/blog_languages.sql in the Supabase SQL editor, then publish again.');
  process.exit(1);
}

/* --------------------------------------------------------------- publish */
const outDir = args.out || join(tmpdir(), 'talkandtool-blog-images');
mkdirSync(outDir, { recursive: true });

const categories = dryRun ? [] : await rest('categories?select=id,slug');
const authorId = env.BLOG_AUTHOR_ID || existingPosts.find((post) => post.author_id)?.author_id;
if (!dryRun && !authorId) {
  console.error('No author found: set BLOG_AUTHOR_ID in .env to a profiles.id.');
  process.exit(1);
}

const hash = (buffer) => createHash('sha256').update(buffer).digest('hex').slice(0, 10);

for (const article of articles) {
  const cover = toPng(renderCoverSvg({ title: article.coverTitle || article.title, kicker: article.cover.kicker, theme: article.theme, visual: article.cover.visual, lang: article.lang }));
  const info = renderInfographicSvg(article.infographic, article.theme, article.lang);
  const infoPng = toPng(info.svg);

  const coverName = `${article.slug}-${hash(cover)}.png`;
  const infoName = `${article.slug}-infographic-${hash(infoPng)}.png`;
  writeFileSync(join(outDir, coverName), cover);
  writeFileSync(join(outDir, infoName), infoPng);

  const coverUrl = dryRun ? `/${coverName}` : await upload(`articles/${article.slug}/${coverName}`, cover);
  const infoUrl = dryRun ? `/${infoName}` : await upload(`articles/${article.slug}/${infoName}`, infoPng);

  const figure = `<figure><img src="${infoUrl}" alt="${article.infographic.alt}" width="1200" height="${info.height}" /><figcaption>${article.infographic.caption}</figcaption></figure>`;
  const content = article.html.trim()
    .replace(/^<p>/, `<p data-topic-tags="${article.tags.join(', ')}">`)
    .replace('{{infographic}}', figure);

  const record = {
    title: article.title,
    slug: article.slug,
    content,
    excerpt: article.description,
    featured_image: coverUrl,
    status: 'approved',
    ...(hasLanguageColumns ? { language: article.lang, translation_key: article.translationKey || null } : {}),
  };
  const url = articlePath(article.lang, article.slug);

  if (dryRun) {
    const description = plain(content).slice(0, 157);
    console.log(`✓ ${url}\n    title (${article.title.length}): ${article.title}\n    description: ${description}…\n    words: ${plain(content).split(' ').length}`);
    continue;
  }

  const categoryId = categories.find((category) => category.slug === article.category)?.id;
  if (!categoryId) throw new Error(`${article.slug}: unknown category "${article.category}"`);
  const existing = existingPosts.find((post) => post.slug === article.slug);
  if (existing) {
    await rest(`posts?id=eq.${existing.id}`, { method: 'PATCH', body: JSON.stringify({ ...record, category_id: categoryId, updated_at: new Date().toISOString() }) });
    console.log(`↻ updated  ${url}`);
  } else {
    await rest('posts', { method: 'POST', body: JSON.stringify({ ...record, category_id: categoryId, author_id: authorId }) });
    console.log(`+ created  ${url}`);
  }
}

console.log(`\nImages written to ${outDir}`);
if (!dryRun) console.log('Redeploy the site so the new URLs are added to sitemap.xml.');
