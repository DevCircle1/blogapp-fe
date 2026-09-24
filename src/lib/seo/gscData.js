import Papa from 'papaparse';
import { strFromU8, unzipSync } from 'fflate';

/**
 * Reads Google Search Console Performance exports (CSV, or the ZIP of CSVs the
 * report downloads) into plain row objects. All client-side.
 *
 * The export contains one table per dimension, so what an upload can answer
 * depends on what it holds:
 *   queryPage — query + page columns   (needed for cannibalization)
 *   queries   — a query column only
 *   pages     — a page column only
 * A "compare dates" export carries a second set of metric columns for the
 * earlier period; those become `prev` on each row.
 */

const norm = (text) => String(text ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();

const PATTERNS = {
  query: /(quer|consult|requet|suchanfrag|zoekopdracht|zapytan|search term)/,
  page: /(^|\b)(page|pagina|seite|strona|url|landing)|(pagin)/,
  clicks: /(click|clic|klick|cliqu|klik|klikni)/,
  impressions: /(impression|impresion|impressi|weergave|wyswietl)/,
  ctr: /\bctr\b|ctr$/,
  position: /(position|posicion|posizion|posicao|positie|pozycj)/,
};
const PREVIOUS = /(previous|prior|precedent|anterior|vorher|vorig|poprzed|precedente|comparison|compare|compar)/;

/** Maps header names to roles. Returns null when nothing usable is found. */
export function detectColumns(headers) {
  const columns = { current: {}, prev: {} };
  headers.forEach((header, index) => {
    const name = norm(header);
    if (!name) return;
    const isPrev = PREVIOUS.test(name);
    for (const role of ['clicks', 'impressions', 'ctr', 'position']) {
      if (PATTERNS[role].test(name)) {
        // A page/query header never contains a metric word, so no ambiguity here.
        (isPrev ? columns.prev : columns.current)[role] ??= index;
        return;
      }
    }
    if (columns.current.query === undefined && PATTERNS.query.test(name)) columns.current.query = index;
    else if (columns.current.page === undefined && PATTERNS.page.test(name)) columns.current.page = index;
  });
  const c = columns.current;
  if (c.clicks === undefined && c.impressions === undefined) return null;
  return columns;
}

const toInt = (value) => {
  const n = Number(String(value ?? '').replace(/[.,\s]/g, ''));
  return Number.isFinite(n) ? n : 0;
};
const toFloat = (value) => {
  const n = Number(String(value ?? '').replace('%', '').replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(n) ? n : NaN;
};
const toCtr = (value, clicks, impressions) => {
  const text = String(value ?? '');
  const n = toFloat(text);
  if (Number.isFinite(n)) return text.includes('%') || n > 1 ? n / 100 : n;
  return impressions ? clicks / impressions : 0;
};

const metrics = (cells, cols) => {
  const clicks = toInt(cells[cols.clicks]);
  const impressions = toInt(cells[cols.impressions]);
  return { clicks, impressions, ctr: toCtr(cells[cols.ctr], clicks, impressions), position: toFloat(cells[cols.position]) };
};

/** One CSV text → { kind, rows, hasPrev, name } or null if it is not a query/page table. */
export function parseGscCsv(text, name = 'file.csv') {
  const parsed = Papa.parse((text.charCodeAt(0) === 0xfeff ? text.slice(1) : text), { skipEmptyLines: true });
  const data = parsed.data;
  if (!data.length) return null;
  const [headers, ...body] = data;
  const columns = detectColumns(headers);
  if (!columns) return null;
  const c = columns.current;
  const hasQuery = c.query !== undefined;
  const hasPage = c.page !== undefined;
  // The first column of a single-dimension export is the dimension itself.
  const kind = hasQuery && hasPage ? 'queryPage' : hasQuery ? 'queries' : hasPage ? 'pages' : null;
  if (!kind) return null;
  const hasPrev = columns.prev.clicks !== undefined || columns.prev.impressions !== undefined;
  const rows = body.map((cells) => {
    const row = { ...metrics(cells, c) };
    if (hasQuery) row.query = String(cells[c.query] ?? '').trim();
    if (hasPage) row.page = String(cells[c.page] ?? '').trim();
    if (hasPrev) row.prev = metrics(cells, columns.prev);
    return row;
  }).filter((row) => (row.query || row.page) && (row.impressions > 0 || row.clicks > 0 || row.prev));
  return { name, kind, rows, hasPrev };
}

/** Files → parsed tables. Accepts .csv and .zip (a GSC "Download CSV" bundle). */
export async function readGscFiles(fileList) {
  const tables = [];
  const skipped = [];
  const handle = (text, name) => {
    const table = parseGscCsv(text, name);
    if (table) tables.push(table); else skipped.push(name);
  };
  for (const file of fileList) {
    if (/\.zip$/i.test(file.name)) {
      try {
        const entries = unzipSync(new Uint8Array(await file.arrayBuffer()));
        Object.entries(entries).filter(([entry]) => /\.csv$/i.test(entry)).forEach(([entry, bytes]) => handle(strFromU8(bytes), entry));
      } catch { skipped.push(file.name); }
    } else if (/\.(csv|tsv|txt)$/i.test(file.name) || file.type.includes('csv')) {
      handle(await file.text(), file.name);
    } else {
      skipped.push(file.name);
    }
  }
  return { tables, skipped };
}

/** Merge tables of the same kind from several files. */
export const datasetFrom = (tables) => {
  const pick = (kind) => tables.filter((t) => t.kind === kind).flatMap((t) => t.rows);
  return { queryPage: pick('queryPage'), queries: pick('queries'), pages: pick('pages') };
};
