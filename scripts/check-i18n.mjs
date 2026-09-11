/**
 * Verifies that every language version of the tool catalogue is complete.
 *
 *  - Every t('…') / msg('…') key in the tool implementations has a
 *    translation in each src/i18n/ui/<lang>.js, and every translation keeps
 *    the same {placeholders} as its English key.
 *  - Every catalogue tool has page copy in each src/i18n/content/<lang>.js,
 *    with the same shape as the English entry.
 *  - Every localized slug exists, is URL-safe, and is unique in its language.
 *
 * A missing UI string only falls back to English at runtime, so the site
 * still works — but a half-English page is exactly what this project is
 * trying to avoid. Run with: node scripts/check-i18n.mjs
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { premiumTools } from '../src/components/tools/toolCatalog.js';
import { TOOL_SLUGS } from '../src/i18n/slugs.js';
import { LOCALIZED_LANGS } from '../src/i18n/locales.js';

const IMPL_DIR = 'src/components/tools/impl';
const KEY_PATTERN = /\b(?:t|msg)\(\s*('(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*")/g;
const placeholders = (value) => [...String(value).matchAll(/\{(\w+)\}/g)].map((match) => match[1]).sort().join(',');

const errors = [];
const warnings = [];

/* ------------------------------------------------------------ UI strings */
const keys = new Map();
for (const file of await readdir(IMPL_DIR)) {
  if (!file.endsWith('.jsx')) continue;
  const source = await readFile(path.join(IMPL_DIR, file), 'utf8');
  for (const match of source.matchAll(KEY_PATTERN)) {
    // The literal is our own source code, so evaluating it is safe and
    // resolves escapes such as \n exactly as the runtime will.
    const key = new Function(`return ${match[1]};`)();
    if (!keys.has(key)) keys.set(key, file);
  }
}

const CHROME_KEYS = ['home', 'tools', 'breadcrumb', 'toolRegion', 'privacy', 'about', 'howTo', 'formula', 'faq', 'related', 'browseAll', 'alsoAvailable', 'openTool', 'notFoundTitle', 'notFoundBody'];
const HUB_KEYS = ['title', 'description', 'heading', 'body', 'badge', 'searchLabel', 'searchPlaceholder', 'shown', 'empty', 'paragraphs', 'faqs'];
const CATEGORIES = [...new Set(premiumTools.map((tool) => tool.category))];

for (const lang of LOCALIZED_LANGS) {
  const ui = await import(pathToFileURL(path.resolve(`src/i18n/ui/${lang}.js`)).href);
  const dict = ui.default;
  for (const [key, file] of keys) {
    if (!(key in dict)) errors.push(`[${lang}] missing UI string (${file}): ${JSON.stringify(key)}`);
    else if (placeholders(key) !== placeholders(dict[key])) errors.push(`[${lang}] placeholder mismatch: ${JSON.stringify(key)} → ${JSON.stringify(dict[key])}`);
  }
  for (const key of Object.keys(dict)) {
    if (!keys.has(key)) warnings.push(`[${lang}] unused UI string: ${JSON.stringify(key)}`);
  }

  /* --------------------------------------------------------- page copy */
  const content = (await import(pathToFileURL(path.resolve(`src/i18n/content/${lang}.js`)).href)).default;
  CHROME_KEYS.forEach((key) => { if (!content.chrome?.[key]) errors.push(`[${lang}] chrome.${key} is missing`); });
  HUB_KEYS.forEach((key) => { if (!content.hub?.[key]) errors.push(`[${lang}] hub.${key} is missing`); });
  CATEGORIES.forEach((category) => { if (!content.categories?.[category]?.name) errors.push(`[${lang}] categories.${category}.name is missing`); });

  const seenSlugs = new Map();
  for (const tool of premiumTools) {
    const slug = TOOL_SLUGS[tool.slug]?.[lang];
    if (!slug) errors.push(`[${lang}] no localized slug for ${tool.slug}`);
    else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.push(`[${lang}] slug is not URL-safe: ${slug}`);
    else if (seenSlugs.has(slug)) errors.push(`[${lang}] slug ${slug} used by both ${seenSlugs.get(slug)} and ${tool.slug}`);
    else seenSlugs.set(slug, tool.slug);

    const copy = content.tools?.[tool.slug];
    if (!copy) { errors.push(`[${lang}] no page copy for ${tool.slug}`); continue; }
    ['title', 'shortTitle', 'description', 'intro'].forEach((field) => {
      if (!copy[field]) errors.push(`[${lang}] ${tool.slug}.${field} is missing`);
    });
    if (!Array.isArray(copy.steps) || copy.steps.length < 3) errors.push(`[${lang}] ${tool.slug}.steps needs at least 3 entries`);
    if (!Array.isArray(copy.faqs) || copy.faqs.length < 3 || copy.faqs.some((faq) => !faq.q || !faq.a)) errors.push(`[${lang}] ${tool.slug}.faqs needs at least 3 complete entries`);
    if (tool.formula && !copy.formula) errors.push(`[${lang}] ${tool.slug}.formula is missing (English has one)`);
    if (tool.disclaimer && !copy.disclaimer) errors.push(`[${lang}] ${tool.slug}.disclaimer is missing (English has one)`);
    if (copy.title && `${copy.title} | Talk & Tool`.length > 75) warnings.push(`[${lang}] ${tool.slug} title may truncate in results (${copy.title.length} chars)`);
    if (copy.description && copy.description.length > 170) warnings.push(`[${lang}] ${tool.slug} description may truncate (${copy.description.length} chars)`);
  }
}

warnings.forEach((line) => console.warn(`warn  ${line}`));
errors.forEach((line) => console.error(`error ${line}`));
console.log(`${keys.size} UI strings × ${LOCALIZED_LANGS.length} languages, ${premiumTools.length} tools checked: ${errors.length} errors, ${warnings.length} warnings.`);
process.exitCode = errors.length ? 1 : 0;
