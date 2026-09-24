import { financeTools } from './data/finance.js';
import { calculatorTools } from './data/calculators.js';
import { datetimeTools } from './data/datetime.js';
import { healthTools } from './data/health.js';
import { textTools } from './data/text.js';
import { developerTools } from './data/developer.js';
import { seoTools } from './data/seo.js';
import { RELATED_TOOLS } from './data/relatedTools.js';
import { SITE_URL } from '../../seo/siteMeta.js';

export { SITE_URL };

/**
 * Every entry here becomes an indexable page at /tools/<slug>.
 * Slugs are permanent: renaming one breaks an indexed URL, so add a redirect
 * in netlify.toml instead of editing a slug in place.
 */
export const premiumTools = [
  ...developerTools,
  ...calculatorTools,
  ...financeTools,
  ...textTools,
  ...datetimeTools,
  ...healthTools,
  ...seoTools,
];

export const toolCategories = [...new Set(premiumTools.map((tool) => tool.category))].sort();

const bySlug = new Map(premiumTools.map((tool) => [tool.slug, tool]));

export const getToolBySlug = (slug) => bySlug.get(slug);

/**
 * Related tools power internal linking, which is how deep tool pages get
 * crawled. The curated list in data/relatedTools.js is the primary source —
 * it picks genuinely related tools rather than just same-category ones — and
 * same-category/shared-tag matching only fills in behind it, so a tool added
 * without a curated entry yet still gets a reasonable set instead of none.
 */
const MIN_RELATED = 4;

export const getRelatedTools = (slug, limit = 6) => {
  const tool = bySlug.get(slug);
  if (!tool) return [];

  const curated = (RELATED_TOOLS[slug] || [])
    .map((relatedSlug) => bySlug.get(relatedSlug))
    .filter(Boolean);
  // A curated list that already meets the minimum is used as-is, capped at
  // `limit` — it is never topped up with looser automatic matches, so a
  // deliberately-short, high-quality list (e.g. 4 tools) is never diluted
  // by a same-category pick just to reach a round number.
  if (curated.length >= MIN_RELATED) return curated.slice(0, limit);

  const seen = new Set([slug, ...curated.map((item) => item.slug)]);
  const sameCategory = premiumTools.filter((item) => !seen.has(item.slug) && item.category === tool.category);
  const sharedTag = premiumTools.filter((item) => (
    !seen.has(item.slug)
    && item.category !== tool.category
    && item.tags.some((tag) => tool.tags.includes(tag))
  ));
  return [...curated, ...sameCategory, ...sharedTag].slice(0, MIN_RELATED);
};

/** Standalone pages that live outside /tools/<slug> but belong in the directory and sitemap. */
export const standaloneTools = [
  { slug: 'image-converter', title: 'Image Converter', shortTitle: 'Image Converter', link: '/tools/image-converter', description: 'Convert HEIC, camera RAW, PNG, WebP and JPG in your browser, with batch conversion and optional GPS removal.', icon: 'IMG', category: 'Developer', tags: ['image converter', 'heic', 'raw', 'webp'] },
  { slug: 'heic-to-jpg', title: 'HEIC to JPG Converter', shortTitle: 'HEIC to JPG', link: '/tools/heic-to-jpg', description: 'Convert iPhone HEIC photos to JPG in your browser without uploading them.', icon: 'HEI', category: 'Developer', tags: ['heic to jpg', 'iphone photos'] },
  { slug: 'heic-to-jpg-without-uploading', title: 'HEIC to JPG Without Uploading', shortTitle: 'Private HEIC Converter', link: '/tools/heic-to-jpg-without-uploading', description: 'A private HEIC to JPG converter that never uploads your photos.', icon: 'PRV', category: 'Developer', tags: ['heic converter offline', 'private'] },
  { slug: 'heic-to-png', title: 'HEIC to PNG Converter', shortTitle: 'HEIC to PNG', link: '/tools/heic-to-png', description: 'Convert HEIC photos to lossless PNG in your browser.', icon: 'PNG', category: 'Developer', tags: ['heic to png'] },
  { slug: 'raw-to-jpg', title: 'RAW to JPG Converter', shortTitle: 'RAW to JPG', link: '/tools/raw-to-jpg', description: 'Batch-convert camera RAW files to JPG in your browser, quick preview or full decode.', icon: 'RAW', category: 'Developer', tags: ['raw to jpg', 'camera raw'] },
  { slug: 'cr2-to-jpg', title: 'CR2 to JPG Converter', shortTitle: 'CR2 to JPG', link: '/tools/cr2-to-jpg', description: 'Convert Canon CR2 RAW photos to JPG in your browser.', icon: 'CR2', category: 'Developer', tags: ['cr2 to jpg', 'canon raw'] },
  { slug: 'nef-to-jpg', title: 'NEF to JPG Converter', shortTitle: 'NEF to JPG', link: '/tools/nef-to-jpg', description: 'Convert Nikon NEF RAW photos to JPG in your browser.', icon: 'NEF', category: 'Developer', tags: ['nef to jpg', 'nikon raw'] },
  { slug: 'arw-to-jpg', title: 'ARW to JPG Converter', shortTitle: 'ARW to JPG', link: '/tools/arw-to-jpg', description: 'Convert Sony ARW RAW photos to JPG in your browser.', icon: 'ARW', category: 'Developer', tags: ['arw to jpg', 'sony raw'] },
  { slug: 'dng-to-jpg', title: 'DNG to JPG Converter', shortTitle: 'DNG to JPG', link: '/tools/dng-to-jpg', description: 'Convert Adobe DNG files to JPG in your browser.', icon: 'DNG', category: 'Developer', tags: ['dng to jpg'] },
  { slug: 'subtitle-converter', title: 'Subtitle Converter', shortTitle: 'Subtitle Converter', link: '/tools/subtitle-converter', description: 'Convert subtitles between SRT, VTT, ASS and SBV, fix encodings and timing, in your browser.', icon: 'SUB', category: 'Text', tags: ['subtitles', 'srt', 'vtt', 'ass'] },
  { slug: 'subtitle-sync', title: 'Subtitle Sync & Timing Fixer', shortTitle: 'Subtitle Sync', link: '/tools/subtitle-sync', description: 'Shift, stretch or two-point sync subtitle timings and preview against your video.', icon: 'SNC', category: 'Text', tags: ['subtitle sync', 'srt timing', 'out of sync subtitles'] },
  { slug: 'subtitle-merge', title: 'Merge Subtitles (Bilingual)', shortTitle: 'Merge Subtitles', link: '/tools/subtitle-merge', description: 'Merge two subtitle files into one bilingual subtitle track.', icon: 'MGS', category: 'Text', tags: ['merge subtitles', 'bilingual subtitles'] },
  { slug: 'srt-to-vtt', title: 'SRT to VTT Converter', shortTitle: 'SRT to VTT', link: '/tools/srt-to-vtt', description: 'Convert SRT subtitles to WebVTT in your browser.', icon: 'S2V', category: 'Text', tags: ['srt to vtt', 'webvtt'] },
  { slug: 'vtt-to-srt', title: 'VTT to SRT Converter', shortTitle: 'VTT to SRT', link: '/tools/vtt-to-srt', description: 'Convert WebVTT captions to SRT in your browser.', icon: 'V2S', category: 'Text', tags: ['vtt to srt'] },
  { slug: 'srt-to-txt', title: 'SRT to Text Converter', shortTitle: 'SRT to TXT', link: '/tools/srt-to-txt', description: 'Extract the text of a subtitle file as a clean transcript.', icon: 'S2T', category: 'Text', tags: ['srt to txt', 'transcript'] },
  { slug: 'ass-to-srt', title: 'ASS to SRT Converter', shortTitle: 'ASS to SRT', link: '/tools/ass-to-srt', description: 'Convert ASS and SSA subtitles to SRT in your browser.', icon: 'A2S', category: 'Text', tags: ['ass to srt', 'ssa'] },
  { slug: 'schema-markup-generator', title: 'Schema Markup Generator', shortTitle: 'Schema Markup Generator', link: '/tools/schema-markup-generator', description: 'Generate valid JSON-LD structured data for FAQ, Product, Article, Event, Recipe and more, with live validation.', icon: 'LD', category: 'SEO', tags: ['schema markup', 'json-ld', 'structured data', 'rich results'] },
  { slug: 'csv-viewer', title: 'Large CSV Viewer', shortTitle: 'Large CSV Viewer', link: '/tools/csv-viewer', description: 'Open, scroll, filter and sort CSV files too big for Excel, in your browser without uploading.', icon: 'CSV', category: 'Developer', tags: ['csv viewer', 'large csv', 'open csv'] },
  { slug: 'merge-csv-files', title: 'Merge CSV Files', shortTitle: 'Merge CSV Files', link: '/tools/merge-csv-files', description: 'Combine many CSV files into one, matching columns by name, in your browser.', icon: 'MRG', category: 'Developer', tags: ['merge csv', 'combine csv'] },
  { slug: 'split-csv', title: 'Split CSV Files', shortTitle: 'Split CSV', link: '/tools/split-csv', description: 'Split a big CSV by rows, size or column value into a zip of parts.', icon: 'SPL', category: 'Developer', tags: ['split csv', 'divide csv'] },
  { slug: 'csv-deduplicate', title: 'Remove Duplicates from CSV', shortTitle: 'CSV Deduplicate', link: '/tools/csv-deduplicate', description: 'Remove duplicate rows from a CSV by whole row or chosen columns.', icon: 'DUP', category: 'Developer', tags: ['csv duplicates', 'dedupe'] },
  { slug: 'csv-to-excel', title: 'CSV to Excel Converter', shortTitle: 'CSV to Excel', link: '/tools/csv-to-excel', description: 'Convert large CSV files to .xlsx, continuing past Excel’s row limit on extra sheets.', icon: 'XLS', category: 'Developer', tags: ['csv to excel', 'xlsx'] },
  { slug: 'whatsapp-chat-analyzer', title: 'WhatsApp Chat Analyzer', shortTitle: 'WhatsApp Chat Analyzer', link: '/tools/whatsapp-chat-analyzer', description: 'Turn an exported WhatsApp chat into statistics, a heatmap and a share card, entirely in your browser.', icon: 'WA', category: 'Text', tags: ['whatsapp', 'chat analyzer', 'statistics', 'wrapped'] },
  { slug: 'whatsapp-chat-statistics', title: 'WhatsApp Chat Statistics', shortTitle: 'WhatsApp Statistics', link: '/tools/whatsapp-chat-statistics', description: 'Who texts more? Message counts, reply times and conversation starters from your exported chat.', icon: 'WAS', category: 'Text', tags: ['whatsapp', 'statistics', 'message count'] },
  { slug: 'whatsapp-wrapped', title: 'WhatsApp Wrapped', shortTitle: 'WhatsApp Wrapped', link: '/tools/whatsapp-wrapped', description: 'Your year in chats: busiest day, streaks, top emoji and a downloadable share card.', icon: 'WAW', category: 'Text', tags: ['whatsapp wrapped', 'year in review', 'share card'] },
  { slug: 'salary-tax-calculator-pakistan', title: 'Pakistan Salary Tax Calculator', shortTitle: 'Pakistan Salary Tax', link: '/tools/salary-tax-calculator-pakistan', description: 'Monthly take-home pay and income tax for salaried individuals in Pakistan, slab by slab, with a year-on-year comparison.', icon: 'PKR', category: 'Finance', tags: ['pakistan', 'salary tax', 'income tax', 'take home', 'fbr'] },
  { slug: 'income-tax-slabs-pakistan', title: 'Income Tax Slabs Pakistan', shortTitle: 'Pakistan Tax Slabs', link: '/tools/income-tax-slabs-pakistan', description: 'Salaried-individual income tax slabs for Pakistan, several tax years side by side, with sources.', icon: 'SLB', category: 'Finance', tags: ['pakistan', 'tax slabs', 'fbr'] },
  { slug: 'gross-to-net-salary-pakistan', title: 'Gross to Net Salary Calculator Pakistan', shortTitle: 'Gross to Net Pakistan', link: '/tools/gross-to-net-salary-pakistan', description: 'Convert gross salary to take-home pay in Pakistan, or find the gross salary needed for a target net.', icon: 'NET', category: 'Finance', tags: ['pakistan', 'gross to net', 'in hand salary'] },
  { slug: 'ats-resume-checker', title: 'Free ATS Resume Checker', shortTitle: 'ATS Resume Checker', link: '/tools/ats-resume-checker', description: 'See what an applicant tracking system extracts from your resume and every structural problem that could break it.', icon: 'ATS', category: 'Career', tags: ['ats', 'resume', 'cv', 'resume checker', 'parser'] },
  { slug: 'resume-keyword-scanner', title: 'Resume Keyword Scanner', shortTitle: 'Resume Keyword Scanner', link: '/tools/resume-keyword-scanner', description: 'Compare your resume with a job description: matched, buried and missing keywords.', icon: 'KWS', category: 'Career', tags: ['resume keywords', 'job description', 'ats'] },
  { slug: 'resume-parser-test', title: 'Resume Parser Test', shortTitle: 'Resume Parser Test', link: '/tools/resume-parser-test', description: 'See the fields a parser extracts from your resume, next to the resume itself.', icon: 'PRS', category: 'Career', tags: ['resume parser', 'ats', 'cv'] },
  { slug: 'is-my-resume-ats-friendly', title: 'Is My Resume ATS Friendly?', shortTitle: 'ATS Friendly Check', link: '/tools/is-my-resume-ats-friendly', description: 'A plain yes or no on whether your resume is ATS friendly, with the reasons and fixes.', icon: 'ATF', category: 'Career', tags: ['ats friendly', 'resume', 'cv'] },
  { slug: 'content-decay-checker', title: 'Content Decay Checker', shortTitle: 'Content Decay Checker', link: '/tools/content-decay-checker', description: 'Compare two Search Console periods to find pages losing clicks, with a likely cause for each.', icon: 'CDC', category: 'SEO', tags: ['content decay', 'search console', 'traffic drop', 'seo audit'] },
  { slug: 'striking-distance-keywords', title: 'Striking Distance Keywords Finder', shortTitle: 'Striking Distance Keywords', link: '/tools/striking-distance-keywords', description: 'Find page-two queries from your Search Console data, ranked by the clicks they could add.', icon: 'SDK', category: 'SEO', tags: ['striking distance', 'page 2 keywords', 'search console', 'quick wins'] },
  { slug: 'gsc-ctr-analyzer', title: 'Search Console CTR Analyzer', shortTitle: 'GSC CTR Analyzer', link: '/tools/gsc-ctr-analyzer', description: 'Find pages and queries whose click-through rate is far below what their position predicts.', icon: 'CTR', category: 'SEO', tags: ['ctr', 'search console', 'low ctr pages', 'title optimisation'] },
  { slug: 'llm-token-counter', title: 'LLM Token Counter', shortTitle: 'LLM Token Counter', link: '/tools/llm-token-counter', description: 'Count tokens for a prompt and compare API cost across Claude, GPT and Gemini models.', icon: 'TOK', category: 'Developer', tags: ['llm', 'tokens', 'tokenizer', 'openai', 'claude', 'gemini'] },
  { slug: 'llm-api-cost-calculator', title: 'LLM API Cost Calculator', shortTitle: 'LLM API Cost Calculator', link: '/tools/llm-api-cost-calculator', description: 'Estimate per-call and monthly LLM API spend from tokens and daily volume.', icon: 'API', category: 'Developer', tags: ['llm', 'api cost', 'pricing', 'budget'] },
  { slug: 'llm-price-comparison', title: 'LLM Pricing Comparison', shortTitle: 'LLM Pricing Comparison', link: '/tools/llm-price-comparison', description: 'Sortable per-million-token prices for current Claude, GPT and Gemini models.', icon: 'PRC', category: 'Developer', tags: ['llm', 'pricing', 'comparison'] },
  { slug: 'bank-statement-converter', title: 'Bank Statement Converter', shortTitle: 'Bank Statement Converter', link: '/tools/bank-statement-converter', description: 'Convert a bank statement PDF to Excel or CSV in your browser, with a running-balance check.', icon: 'XLS', category: 'Finance', tags: ['bank statement', 'pdf to excel', 'csv', 'converter'] },
  { slug: 'check-ip', title: 'IP Address Checker', shortTitle: 'IP Address Checker', link: '/check-ip', description: 'See your public IP address, approximate location, and network details.', icon: 'IP', category: 'Developer', tags: ['ip address', 'network', 'location'] },
  { slug: 'screen-resolution', title: 'Screen Resolution Checker', shortTitle: 'Screen Resolution', link: '/screen-resolution', description: 'Check your screen resolution, viewport size, pixel ratio, and colour depth.', icon: 'RES', category: 'Developer', tags: ['screen resolution', 'viewport', 'display'] },
  { slug: 'text-to-html', title: 'Rich Text to HTML Editor', shortTitle: 'Rich Text to HTML', link: '/text-to-html', description: 'Write formatted content in a visual editor and export clean HTML markup.', icon: 'RTE', category: 'Text', tags: ['rich text', 'html', 'editor', 'wysiwyg'] },
  { slug: 'word-game', title: 'Daily Word Game', shortTitle: 'Word Game', link: '/word-game', description: 'Guess the five-letter word of the day in six tries.', icon: 'WRD', category: 'Games', tags: ['word game', 'puzzle', 'daily'] },
  { slug: 'codes', title: 'CodeShare', shortTitle: 'CodeShare', link: '/codes', description: 'Share and collaborate on code snippets in real time.', icon: '</>', category: 'Developer', tags: ['code', 'share', 'snippet'] },
];

/** Single list used by the /tools directory page and the sitemap generator. */
export const allToolLinks = [
  ...premiumTools.map((tool) => ({ ...tool, link: `/tools/${tool.slug}`, premium: true })),
  ...standaloneTools,
];
