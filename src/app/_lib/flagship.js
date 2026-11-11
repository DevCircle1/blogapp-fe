import BankStatementPage from '../../components/tools/flagship/bank/BankStatementPage.jsx';
import LlmPage from '../../components/tools/flagship/llm/LlmPage.jsx';
import GscPage from '../../components/tools/flagship/gsc/GscPage.jsx';
import ResumePage from '../../components/tools/flagship/resume/ResumePage.jsx';
import TaxPage from '../../components/tools/flagship/tax/TaxPage.jsx';
import WhatsAppPage from '../../components/tools/flagship/whatsapp/WhatsAppPage.jsx';
import CsvPage from '../../components/tools/flagship/csv/CsvPage.jsx';
import SchemaPage from '../../components/tools/flagship/schema/SchemaPage.jsx';
import SubtitlePage from '../../components/tools/flagship/subtitles/SubtitlePage.jsx';
import ImagePage from '../../components/tools/flagship/image/ImagePage.jsx';
import { FLAGSHIP_PAGES } from '../../components/tools/flagship/registry.js';

/**
 * Which component serves each flagship tool URL. The page copy itself lives in
 * the registry (components/tools/flagship/registry.js); this maps a URL to the
 * component that renders it and the props that component takes: `path` for
 * families that look their page up by URL, `view` for those that switch between
 * a few tools.
 *
 * Single-segment URLs (/tools/<slug>) are served by app/(en)/tools/[toolSlug];
 * the per-item URLs below them (/tools/llm-token-counter/<model>) each have a
 * folder of their own under app/(en)/tools. scripts/check-routes.mjs fails if
 * this table and the registry disagree.
 */
const byPath = (Component, slugs) => slugs.map((slug) => [`/tools/${slug}`, Component, { path: `/tools/${slug}` }]);
const byView = (Component, views) => Object.entries(views).map(([slug, view]) => [`/tools/${slug}`, Component, { view }]);

const ENTRIES = [
  ['/tools/bank-statement-converter', BankStatementPage, {}],
  ...byView(LlmPage, {
    'llm-token-counter': 'counter',
    'llm-api-cost-calculator': 'cost',
    'llm-price-comparison': 'compare',
  }),
  ...byPath(GscPage, ['content-decay-checker', 'striking-distance-keywords', 'gsc-ctr-analyzer', 'search-console-regex-generator']),
  ...byPath(ResumePage, ['ats-resume-checker', 'resume-keyword-scanner', 'resume-parser-test', 'is-my-resume-ats-friendly']),
  ...byView(TaxPage, {
    'salary-tax-calculator-pakistan': 'salary',
    'income-tax-slabs-pakistan': 'slabs',
    'gross-to-net-salary-pakistan': 'net',
  }),
  ...byPath(WhatsAppPage, ['whatsapp-chat-analyzer', 'whatsapp-chat-statistics', 'whatsapp-wrapped']),
  ...byPath(CsvPage, ['csv-viewer', 'merge-csv-files', 'split-csv', 'csv-deduplicate', 'csv-to-excel', 'excel-cant-open-large-csv']),
  ...byPath(SchemaPage, [
    'schema-markup-generator', 'faq-schema-generator', 'local-business-schema-generator', 'product-schema-generator',
    'article-schema-generator', 'event-schema-generator', 'recipe-schema-generator', 'howto-schema-generator',
    'breadcrumb-schema-generator', 'organization-schema-generator', 'video-schema-generator', 'job-posting-schema-generator',
  ]),
  ...byPath(SubtitlePage, [
    'subtitle-converter', 'srt-to-vtt', 'vtt-to-srt', 'srt-to-txt', 'ass-to-srt', 'subtitle-sync', 'subtitle-merge',
  ]),
  ...byPath(ImagePage, [
    'image-converter', 'heic-to-jpg', 'heic-to-jpg-without-uploading', 'heic-to-png', 'raw-to-jpg', 'cr2-to-jpg',
    'nef-to-jpg', 'arw-to-jpg', 'dng-to-jpg',
  ]),
];

/** path -> { Component, props } for every single-segment flagship URL. */
export const FLAGSHIP_ROUTES = new Map(ENTRIES.map(([path, Component, props]) => [path, { Component, props }]));

/** The slugs behind those URLs, for generateStaticParams. */
export const FLAGSHIP_SLUGS = [...FLAGSHIP_ROUTES.keys()].map((path) => path.replace('/tools/', ''));

/** Item slugs of one family's nested URLs: itemSlugs('/tools/llm-token-counter') -> ['claude-opus-5-5', …]. */
export const itemSlugs = (parentPath) => FLAGSHIP_PAGES
  .filter((page) => page.path.startsWith(`${parentPath}/`))
  .map((page) => page.path.slice(parentPath.length + 1));
