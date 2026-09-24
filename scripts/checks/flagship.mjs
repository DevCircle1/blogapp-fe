/**
 * Sanity checks over every flagship page: title/description lengths, unique
 * paths, and that every internal link points at a page that exists.
 * Run: node scripts/checks/flagship.mjs
 */
import { FLAGSHIP_PAGES } from '../../src/components/tools/flagship/registry.js';
import { premiumTools, standaloneTools } from '../../src/components/tools/toolCatalog.js';

const known = new Set([
  '/', '/tools', '/blogs', '/job-alert',
  ...premiumTools.map((tool) => `/tools/${tool.slug}`),
  ...standaloneTools.map((tool) => tool.link),
  ...FLAGSHIP_PAGES.map((page) => page.path),
]);

const problems = [];
const seen = new Set();
const words = (text) => text.split(/\s+/).filter(Boolean).length;

for (const page of FLAGSHIP_PAGES) {
  const at = (message) => problems.push(`${page.path}: ${message}`);
  if (seen.has(page.path)) at('duplicate path');
  seen.add(page.path);
  if (page.title.length > 60) at(`title is ${page.title.length} chars (max 60): ${page.title}`);
  if (page.description.length > 155) at(`description is ${page.description.length} chars (max 155)`);
  if (!page.h1) at('no h1');
  const body = [page.lead, ...page.sections.flatMap((s) => [...(s.paragraphs || []), ...(s.list || [])])].join(' ');
  const first100 = body.split(/\s+/).slice(0, 100).join(' ').toLowerCase();
  const keyword = (page.primaryKeyword || page.h1).toLowerCase().replace(/\s*[:—-].*$/, '').replace(/\{.*?\}/g, '').replace(/^(free|convert)\s+/, '').replace(/\?$/, '');
  if (!first100.includes(keyword.split(' ').slice(0, 3).join(' '))) at(`primary keyword "${keyword}" not in the first 100 words`);
  if (!page.sections.some((s) => s.heading.toLowerCase().includes(keyword.split(' ').slice(0, 2).join(' ')))) at(`no H2 contains "${keyword.split(' ').slice(0, 2).join(' ')}"`);
  [...(page.related || []), ...(page.siblings || [])].forEach((link) => { if (!known.has(link.to)) at(`links to ${link.to}, which does not exist`); });
  const total = words(body);
  if (total < 150) at(`only ${total} words of body copy`);
  if (!page.faqs?.length) at('no FAQ');
}

console.log(`${FLAGSHIP_PAGES.length} flagship pages checked.`);
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log('all good');
