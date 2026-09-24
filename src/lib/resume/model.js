import { groupRows, toSegments } from '../statement/layout.js';

/**
 * Normalised document model shared by PDF and DOCX resumes, so every check and
 * extractor runs identically on both:
 *
 * {
 *   kind: 'pdf' | 'docx',
 *   pageCount, pageCountEstimated,
 *   pages: [{ number, width, height, images, chars, rows: [Row] }],
 *   headerFooter: [string],   // DOCX header/footer text (PDFs have no separate region)
 *   tableCount,               // DOCX only; PDF tables are detected geometrically
 * }
 * Row = { y, text, segments: [{text,x,x2}], fontSize, bold, heading, page }
 */

const median = (values) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

/** pdf.js pages ([{ number, width, height, items:[{str,x,y,w,h,font}], images }]) → model. */
export function modelFromPdf(pages) {
  const model = {
    kind: 'pdf', pageCount: pages.length, pageCountEstimated: false, headerFooter: [], tableCount: 0, pages: [],
  };
  for (const page of pages) {
    const rows = groupRows(page.items).map((row) => {
      const segments = toSegments(row);
      const sizes = row.items.map((item) => item.h).filter(Boolean);
      const fonts = row.items.map((item) => item.font || '').join(' ');
      return {
        y: row.y,
        text: segments.map((s) => s.text).join(' '),
        segments,
        fontSize: sizes.length ? median(sizes) : 0,
        bold: /bold|black|heavy|semibold|demi/i.test(fonts),
        heading: false,
        page: page.number,
      };
    });
    model.pages.push({
      number: page.number,
      width: page.width,
      height: page.height,
      images: page.images || 0,
      chars: rows.reduce((n, row) => n + row.text.length, 0),
      rows,
    });
  }
  return model;
}

const decode = (text) => text
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
const stripTags = (html) => decode(html.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

/**
 * mammoth's HTML (headings, paragraphs, lists, tables) → model. The HTML is
 * read with a small tag scanner because Web Workers have no DOMParser.
 */
export function modelFromDocx({ html, headerFooter = [], hasImages = 0 }) {
  const rows = [];
  const tableCount = (html.match(/<table\b/gi) || []).length;
  const blockRe = /<(h[1-6]|p|li|tr)\b[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  let y = 0;
  while ((match = blockRe.exec(html))) {
    const tag = match[1].toLowerCase();
    const inner = match[2];
    if (tag === 'tr') {
      const cells = [...inner.matchAll(/<t[dh]\b[^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((cell) => stripTags(cell[1])).filter(Boolean);
      if (!cells.length) continue;
      rows.push({
        y: (y += 12), text: cells.join(' '), segments: cells.map((text, i) => ({ text, x: i * 100, x2: i * 100 + 90 })), fontSize: 0, bold: false, heading: false, page: 1, table: true,
      });
      continue;
    }
    const text = stripTags(inner);
    if (!text) continue;
    const boldWhole = /^\s*<(strong|b)>[\s\S]*<\/\1>\s*$/i.test(inner);
    rows.push({
      y: (y += 12), text, segments: [{ text, x: 0, x2: 100 }], fontSize: 0, bold: boldWhole || /^h[1-6]$/.test(tag), heading: /^h[1-6]$/.test(tag), page: 1,
    });
  }
  const words = rows.reduce((n, row) => n + row.text.split(/\s+/).length, 0);
  return {
    kind: 'docx',
    pageCount: Math.max(1, Math.round(words / 500)),
    pageCountEstimated: true,
    headerFooter,
    tableCount,
    pages: [{
      number: 1, width: 612, height: 792, images: hasImages, chars: rows.reduce((n, row) => n + row.text.length, 0), rows,
    }],
  };
}

export const allRows = (model) => model.pages.flatMap((page) => page.rows);
export const fullText = (model) => allRows(model).map((row) => row.text).join('\n');
