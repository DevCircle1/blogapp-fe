import { BANK_PAGES } from './bank/pages.js';
import { LLM_PAGES } from './llm/pages.js';
import { GSC_PAGES } from './gsc/pages.js';
import { RESUME_PAGES } from './resume/pages.js';
import { TAX_PAGES } from './tax/pages.js';
import { WHATSAPP_PAGES } from './whatsapp/pages.js';
import { CSV_PAGES } from './csv/pages.js';
import { SCHEMA_PAGES } from './schema/pages.js';
import { SUBTITLE_PAGES } from './subtitles/pages.js';
import { IMAGE_PAGES } from './image/pages.js';

/**
 * Every flagship tool page (path, copy, FAQ). Plain data: consumed by the page
 * components at runtime and by scripts/routes.mjs for the sitemap and prerender.
 */
export const FLAGSHIP_PAGES = [
  ...BANK_PAGES,
  ...LLM_PAGES,
  ...GSC_PAGES,
  ...RESUME_PAGES,
  ...TAX_PAGES,
  ...WHATSAPP_PAGES,
  ...CSV_PAGES,
  ...SCHEMA_PAGES,
  ...SUBTITLE_PAGES,
  ...IMAGE_PAGES,
];
