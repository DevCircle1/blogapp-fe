import { Zip, ZipDeflate } from 'fflate';
import { downloadZip } from 'client-zip';
import { BLOCK, forEachRecord, scanBlock, sniffDelimiter, detectBom } from './scan.js';
import { parseRecord, serializeRow } from './rfc4180.js';

/**
 * Operations over big CSV files. Every operation streams: records are read block
 * by block, handled one at a time, and written to an OutputBuilder whose pieces
 * are handed to the browser as a Blob (which it can keep on disk), so memory does
 * not grow with the size of the file. Results are Blobs the page can download or
 * open again in the viewer.
 *
 * ctx = { file, delimiter, hasHeader, start (byte offset after any BOM), tick(fraction, rows) → false to cancel }
 */

const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8');
const NL = encoder.encode('\n');
const STAGE = 4 * 1024 * 1024;

export class OutputBuilder {
  constructor() { this.parts = []; this.stage = new Uint8Array(STAGE); this.used = 0; this.size = 0; }

  write(bytes) {
    this.size += bytes.length;
    if (bytes.length >= STAGE) { this.flush(); this.parts.push(bytes.slice()); return; }
    if (this.used + bytes.length > STAGE) this.flush();
    this.stage.set(bytes, this.used);
    this.used += bytes.length;
  }

  writeLine(bytes) { this.write(bytes); this.write(NL); }

  writeText(text) { this.write(encoder.encode(text)); }

  flush() { if (this.used) { this.parts.push(this.stage.slice(0, this.used)); this.used = 0; } }

  blob(type = 'text/csv') { this.flush(); return new Blob(this.parts, { type }); }
}

const walk = (ctx, handler, options = {}) => forEachRecord(ctx.file, ctx.delimiter, handler, {
  from: options.from ?? ctx.start,
  onBlock: (fraction) => ctx.tick(fraction, options.rows?.()) !== false,
});

const fields = (bytes, ctx) => parseRecord(decoder.decode(bytes), ctx.delimiter);

/* ------------------------------------------------------------------ filter */

export const FILTER_OPS = ['contains', 'notContains', 'equals', 'notEquals', 'gt', 'lt', 'regex', 'empty', 'notEmpty'];

function compilePredicate({ col, op, value, ignoreCase = true }) {
  const needle = ignoreCase ? String(value ?? '').toLowerCase() : String(value ?? '');
  const num = Number(value);
  const regex = op === 'regex' ? new RegExp(value, ignoreCase ? 'i' : '') : null;
  const norm = (text) => (ignoreCase ? text.toLowerCase() : text);
  return (row) => {
    const cell = row[col] ?? '';
    switch (op) {
      case 'contains': return norm(cell).includes(needle);
      case 'notContains': return !norm(cell).includes(needle);
      case 'equals': return norm(cell) === needle;
      case 'notEquals': return norm(cell) !== needle;
      case 'gt': return cell.trim() !== '' && Number(cell) > num;
      case 'lt': return cell.trim() !== '' && Number(cell) < num;
      case 'regex': return regex.test(cell);
      case 'empty': return cell.trim() === '';
      case 'notEmpty': return cell.trim() !== '';
      default: return true;
    }
  };
}

/** Keeps the rows matching all (or any) of the column predicates. */
export async function filterRows(ctx, { predicates, matchAll = true }) {
  const tests = predicates.map(compilePredicate);
  const out = new OutputBuilder();
  let recNo = 0; let kept = 0;
  const result = await walk(ctx, (bytes) => {
    const isHeader = ctx.hasHeader && recNo === 0;
    recNo += 1;
    if (isHeader) { out.writeLine(bytes); return true; }
    const row = fields(bytes, ctx);
    const pass = matchAll ? tests.every((test) => test(row)) : tests.some((test) => test(row));
    if (pass) { out.writeLine(bytes); kept += 1; }
    return true;
  }, { rows: () => recNo });
  if (result.cancelled) return { cancelled: true };
  return { blob: out.blob(), rowsIn: recNo - (ctx.hasHeader ? 1 : 0), rowsOut: kept };
}

/* ------------------------------------------------------------------ dedupe */

/** Two 32-bit hashes folded into one 53-bit number. */
function hashBytes(bytes) {
  let h1 = 0x811c9dc5;
  let h2 = 0x9747b28c;
  for (let i = 0; i < bytes.length; i += 1) {
    const b = bytes[i];
    h1 = Math.imul(h1 ^ b, 0x01000193);
    h2 = Math.imul(h2 ^ b, 0x5bd1e995);
    h2 ^= h2 >>> 15;
  }
  return (h1 >>> 0) * 2097152 + (h2 >>> 11);
}

/**
 * Removes duplicate rows, keeping the first occurrence. Rows are compared by a
 * 53-bit hash of the whole row (or of the chosen columns) so no row content is
 * held in memory; the chance of two different rows colliding is roughly n²/2⁵⁴,
 * which is negligible below a few million distinct rows.
 */
export async function dedupe(ctx, { columns = null, trim = false }) {
  const seen = new Set();
  const out = new OutputBuilder();
  let recNo = 0; let removed = 0;
  const result = await walk(ctx, (bytes) => {
    const isHeader = ctx.hasHeader && recNo === 0;
    recNo += 1;
    if (isHeader) { out.writeLine(bytes); return true; }
    let key;
    if (columns && columns.length) {
      const row = fields(bytes, ctx);
      key = hashBytes(encoder.encode(columns.map((c) => (trim ? (row[c] ?? '').trim() : row[c] ?? '')).join('\u0001')));
    } else {
      key = hashBytes(bytes);
    }
    if (seen.has(key)) { removed += 1; return true; }
    seen.add(key);
    out.writeLine(bytes);
    return true;
  }, { rows: () => recNo });
  if (result.cancelled) return { cancelled: true };
  const rowsIn = recNo - (ctx.hasHeader ? 1 : 0);
  return { blob: out.blob(), rowsIn, rowsOut: rowsIn - removed, removed };
}

/* -------------------------------------------------------------------- sort */

const RUN_ROWS = 400000;
const RUN_BYTES = 96 * 1024 * 1024;

const keyOf = (bytes, ctx, { col, numeric, caseSensitive }) => {
  const value = fields(bytes, ctx)[col] ?? '';
  if (numeric) { const n = Number(value.replace(/,/g, '')); return value.trim() === '' || Number.isNaN(n) ? null : n; }
  return caseSensitive ? value : value.toLowerCase();
};

// Blank and non-numeric keys always sort last, in either direction.
const compareKeys = (a, b, desc) => {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;
  if (a === b) return 0;
  return (a < b ? -1 : 1) * (desc ? -1 : 1);
};

class RunReader {
  constructor(blob) { this.blob = blob; this.pos = 0; this.queue = []; this.qi = 0; this.block = BLOCK; }

  async next() {
    while (this.qi >= this.queue.length) {
      if (this.pos >= this.blob.size) return null;
      const end = Math.min(this.blob.size, this.pos + this.block);
      const bytes = new Uint8Array(await this.blob.slice(this.pos, end).arrayBuffer());
      const isLast = end >= this.blob.size;
      const found = [];
      // 0xFF never occurs in UTF-8, so no byte is mistaken for a delimiter: only quotes and newlines matter here.
      const consumed = scanBlock(bytes, 0xff, isLast, (a, b) => found.push(bytes.subarray(a, b)));
      if (consumed === 0 && !isLast) { this.block *= 2; continue; }
      this.block = BLOCK;
      this.pos += consumed;
      this.queue = found; this.qi = 0;
    }
    return this.queue[this.qi++];
  }
}

/**
 * External merge sort: rows are read in runs that fit in memory, each run is
 * sorted and stored as a Blob (kept out of the JS heap by the browser), then the
 * runs are merged with a k-way heap. Stable, and works on files far larger than
 * memory.
 */
export async function sortRows(ctx, { col, numeric = false, desc = false, caseSensitive = false }) {
  const spec = { col, numeric, caseSensitive };
  let header = null;
  const runs = [];
  let batch = []; let batchBytes = 0; let recNo = 0;
  const finishRun = () => {
    if (!batch.length) return;
    batch.sort((a, b) => compareKeys(a.key, b.key, desc) || a.seq - b.seq);
    const out = new OutputBuilder();
    batch.forEach((item) => out.writeLine(item.bytes));
    runs.push(out.blob());
    batch = []; batchBytes = 0;
  };
  const result = await walk(ctx, (bytes) => {
    if (ctx.hasHeader && recNo === 0) { header = bytes.slice(); recNo += 1; return true; }
    batch.push({ key: keyOf(bytes, ctx, spec), bytes: bytes.slice(), seq: recNo });
    recNo += 1;
    batchBytes += bytes.length;
    if (batch.length >= RUN_ROWS || batchBytes >= RUN_BYTES) finishRun();
    return true;
  }, { rows: () => recNo });
  if (result.cancelled) return { cancelled: true };
  finishRun();

  const out = new OutputBuilder();
  if (header) out.writeLine(header);
  if (runs.length === 1) {
    return { blob: new Blob([out.blob(), runs[0]], { type: 'text/csv' }), rowsIn: recNo - (ctx.hasHeader ? 1 : 0), runs: 1 };
  }
  // k-way merge
  const readers = runs.map((blob) => new RunReader(blob));
  const heap = [];
  const less = (a, b) => (compareKeys(a.key, b.key, desc) || a.run - b.run) < 0;
  const up = (i) => { for (let p = (i - 1) >> 1; i > 0 && less(heap[i], heap[p]); i = p, p = (i - 1) >> 1) [heap[i], heap[p]] = [heap[p], heap[i]]; };
  const down = (i) => {
    for (;;) {
      let m = i; const l = 2 * i + 1; const r = l + 1;
      if (l < heap.length && less(heap[l], heap[m])) m = l;
      if (r < heap.length && less(heap[r], heap[m])) m = r;
      if (m === i) return;
      [heap[i], heap[m]] = [heap[m], heap[i]]; i = m;
    }
  };
  const pull = async (run) => {
    const bytes = await readers[run].next();
    if (bytes) { heap.push({ bytes, key: keyOf(bytes, ctx, spec), run }); up(heap.length - 1); }
  };
  for (let run = 0; run < readers.length; run += 1) await pull(run);
  let written = 0;
  while (heap.length) {
    const top = heap[0];
    out.writeLine(top.bytes);
    written += 1;
    const last = heap.pop();
    if (heap.length) { heap[0] = last; down(0); }
    await pull(top.run);
    if (written % 100000 === 0 && ctx.tick(0.5 + 0.5 * (written / Math.max(1, recNo)), written) === false) return { cancelled: true };
  }
  return { blob: out.blob(), rowsIn: recNo - (ctx.hasHeader ? 1 : 0), runs: runs.length };
}

/* ------------------------------------------------------------------- merge */

/** Header and delimiter of a file, read from its first block. */
export async function peekFile(file) {
  const bytes = new Uint8Array(await file.slice(0, Math.min(file.size, 1 << 20)).arrayBuffer());
  const bom = detectBom(bytes);
  const delimiter = sniffDelimiter(bytes.subarray(bom.length));
  let header = [];
  scanBlock(bytes.subarray(bom.length), delimiter.charCodeAt(0), true, (a, b) => { if (!header.length) header = parseRecord(decoder.decode(bytes.subarray(bom.length + a, bom.length + b)), delimiter); });
  return { delimiter, header, start: bom.length };
}

/**
 * Merges files into one. Identical headers and delimiters take a fast path that
 * copies bytes; otherwise `union` lines columns up by name (missing cells left
 * blank), while `strict` refuses to merge files whose headers differ.
 */
export async function mergeFiles(files, { mode = 'union', tick }) {
  const peeks = [];
  for (const file of files) peeks.push({ file, ...(await peekFile(file)) });
  const same = peeks.every((p) => p.delimiter === peeks[0].delimiter && p.header.length === peeks[0].header.length && p.header.every((h, i) => h === peeks[0].header[i]));
  if (!same && mode === 'strict') return { error: 'HEADERS_DIFFER', headers: peeks.map((p) => ({ name: p.file.name, header: p.header })) };

  const out = new OutputBuilder();
  const delimiter = peeks[0].delimiter;
  const union = [];
  peeks.forEach((p) => p.header.forEach((h) => { if (!union.includes(h)) union.push(h); }));
  let rows = 0; let widened = 0;
  if (!same) out.writeText(`${serializeRow(union, delimiter)}\n`);

  for (let f = 0; f < peeks.length; f += 1) {
    const peek = peeks[f];
    const map = peek.header.map((h) => union.indexOf(h));
    let recNo = 0;
    const result = await forEachRecord(peek.file, peek.delimiter, (bytes) => {
      const isHeader = recNo === 0;
      recNo += 1;
      if (isHeader) { if (same && f === 0) out.writeLine(bytes); return true; }
      rows += 1;
      if (same) { out.writeLine(bytes); return true; }
      const row = parseRecord(decoder.decode(bytes), peek.delimiter);
      const merged = new Array(union.length).fill('');
      row.forEach((cell, i) => { if (i < map.length) merged[map[i]] = cell; else { merged.push(cell); widened += 1; } });
      out.writeText(`${serializeRow(merged, delimiter)}\n`);
      return true;
    }, { from: peek.start, onBlock: (fraction) => tick((f + fraction) / peeks.length, rows) !== false });
    if (result.cancelled) return { cancelled: true };
  }
  return { blob: out.blob(), rows, columns: same ? peeks[0].header.length : union.length, sameHeaders: same, widened };
}

/* ------------------------------------------------------------------- split */

// eslint-disable-next-line no-control-regex
const safeName = (text) => (text || '(blank)').replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_').slice(0, 60);
const stem = (name) => name.replace(/\.[^.]+$/, '');

/**
 * Splits by a number of rows, by a target part size in bytes, or by the distinct
 * values of a column. The header is repeated in every part. Returns a zip.
 */
export async function splitFile(ctx, { mode, rows = 100000, bytes: targetBytes = 50 * 1024 * 1024, col = 0 }) {
  let header = null;
  const parts = new Map();
  let current = null; let currentRows = 0; let recNo = 0; let total = 0;
  const open = (name) => {
    const builder = new OutputBuilder();
    if (header) builder.writeLine(header);
    parts.set(name, builder);
    return builder;
  };
  const base = stem(ctx.file.name);
  const result = await walk(ctx, (record) => {
    if (ctx.hasHeader && recNo === 0) { header = record.slice(); recNo += 1; return true; }
    recNo += 1; total += 1;
    if (mode === 'column') {
      const value = safeName(fields(record, ctx)[col]);
      let builder = parts.get(value);
      if (!builder) {
        if (parts.size >= 500) throw Object.assign(new Error('too many distinct values'), { code: 'TOO_MANY_VALUES' });
        builder = open(value);
      }
      builder.writeLine(record);
      return true;
    }
    const needNew = !current
      || (mode === 'rows' && currentRows >= rows)
      || (mode === 'size' && currentRows > 0 && current.size + record.length + 1 > targetBytes);
    if (needNew) { current = open(`part_${String(parts.size + 1).padStart(3, '0')}`); currentRows = 0; }
    current.writeLine(record);
    currentRows += 1;
    return true;
  }, { rows: () => recNo });
  if (result.cancelled) return { cancelled: true };
  const files = [...parts.entries()].map(([name, builder]) => ({
    name: mode === 'column' ? `${base}_${name}.csv` : `${base}_${name}.csv`,
    input: builder.blob(),
  }));
  if (!files.length) return { error: 'EMPTY' };
  const zip = await downloadZip(files).blob();
  return { blob: zip, parts: files.length, rowsIn: total, single: files.length === 1 ? files[0].input : null };
}

/* ---------------------------------------------------------- JSON Lines / XLSX */

export async function toJsonLines(ctx, header) {
  const out = new OutputBuilder();
  let names = header; let recNo = 0; let count = 0;
  const result = await walk(ctx, (bytes) => {
    const row = fields(bytes, ctx);
    if (recNo === 0 && ctx.hasHeader) { names = row; recNo += 1; return true; }
    if (!names) names = row.map((_, i) => `column_${i + 1}`);
    recNo += 1; count += 1;
    const object = {};
    row.forEach((cell, i) => { object[names[i] ?? `column_${i + 1}`] = cell; });
    out.writeText(`${JSON.stringify(object)}\n`);
    return true;
  }, { rows: () => recNo });
  if (result.cancelled) return { cancelled: true };
  return { blob: out.blob('application/x-ndjson'), rows: count };
}

export const XLSX_MAX_ROWS = 1048576;
export const XLSX_MAX_COLUMNS = 16384;
const XLSX_MAX_CELL = 32767;

const columnLetters = (index) => {
  let n = index + 1; let letters = '';
  while (n > 0) { const rem = (n - 1) % 26; letters = String.fromCharCode(65 + rem) + letters; n = Math.floor((n - 1) / 26); }
  return letters;
};
const NUMBER = /^-?(0|[1-9]\d{0,14})(\.\d+)?$/;
// eslint-disable-next-line no-control-regex
const XML_BAD = /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g;
const escapeXml = (text) => text.replace(XML_BAD, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Streams the CSV into an .xlsx file. Data past Excel's 1,048,576-row limit
 * continues on further sheets rather than being cut off.
 */
export async function toXlsx(ctx, { dataRows, columns }) {
  if (columns > XLSX_MAX_COLUMNS) return { error: 'TOO_MANY_COLUMNS', columns };
  const perSheet = XLSX_MAX_ROWS - (ctx.hasHeader ? 1 : 0);
  const sheets = Math.max(1, Math.ceil(dataRows / perSheet));
  const out = new OutputBuilder();
  const zip = new Zip((err, chunk) => { if (err) throw err; out.write(chunk); });
  const addText = (name, text) => { const entry = new ZipDeflate(name, { level: 6 }); zip.add(entry); entry.push(encoder.encode(text), true); };

  addText('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${Array.from({ length: sheets }, (_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`);
  addText('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
  addText('xl/workbook.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${Array.from({ length: sheets }, (_, i) => `<sheet name="Sheet${i + 1}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets></workbook>`);
  addText('xl/_rels/workbook.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${Array.from({ length: sheets }, (_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}<Relationship Id="rId${sheets + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`);
  addText('xl/styles.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs></styleSheet>');

  let sheetNo = 0; let sheetEntry = null; let rowInSheet = 0; let buffer = ''; let header = null;
  let recNo = 0; let truncated = 0;
  const push = (final = false) => { if (sheetEntry) { sheetEntry.push(encoder.encode(buffer), final); buffer = ''; } };
  const rowXml = (rowNumber, cells, isHeader) => {
    let xml = `<row r="${rowNumber}">`;
    cells.forEach((cell, c) => {
      const ref = `${columnLetters(c)}${rowNumber}`;
      let text = cell;
      if (text.length > XLSX_MAX_CELL) { text = text.slice(0, XLSX_MAX_CELL); truncated += 1; }
      if (!text) return;
      if (!isHeader && NUMBER.test(text)) xml += `<c r="${ref}"><v>${text}</v></c>`;
      else xml += `<c r="${ref}" t="inlineStr"${isHeader ? ' s="1"' : ''}><is><t${/^\s|\s$/.test(text) ? ' xml:space="preserve"' : ''}>${escapeXml(text)}</t></is></c>`;
    });
    return `${xml}</row>`;
  };
  const startSheet = () => {
    if (sheetEntry) { buffer += '</sheetData></worksheet>'; push(true); }
    sheetNo += 1;
    sheetEntry = new ZipDeflate(`xl/worksheets/sheet${sheetNo}.xml`, { level: 6 });
    zip.add(sheetEntry);
    buffer = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>';
    rowInSheet = 0;
    if (header) { rowInSheet = 1; buffer += rowXml(1, header, true); }
  };

  const result = await walk(ctx, (bytes) => {
    const row = fields(bytes, ctx);
    if (ctx.hasHeader && recNo === 0) { header = row; recNo += 1; return true; }
    if (!sheetEntry || rowInSheet >= XLSX_MAX_ROWS) startSheet();
    recNo += 1; rowInSheet += 1;
    buffer += rowXml(rowInSheet, row, false);
    if (buffer.length > 1 << 20) push();
    return true;
  }, { rows: () => recNo });
  if (result.cancelled) return { cancelled: true };
  if (!sheetEntry) startSheet();
  buffer += '</sheetData></worksheet>';
  push(true);
  // Sheets promised in the workbook but never written (a header-only file reserves one).
  for (let s = sheetNo; s < sheets; s += 1) {
    const empty = new ZipDeflate(`xl/worksheets/sheet${s + 1}.xml`, { level: 1 });
    zip.add(empty);
    empty.push(encoder.encode('<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData/></worksheet>'), true);
  }
  zip.end();
  return { blob: out.blob('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'), sheets: Math.max(sheetNo, sheets), rows: recNo - (ctx.hasHeader ? 1 : 0), truncated };
}
