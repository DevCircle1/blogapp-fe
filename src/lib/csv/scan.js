import { parseRecord } from './rfc4180.js';

/**
 * Byte-level CSV record scanning. Files are never decoded whole: a block of
 * bytes is scanned for record boundaries (a newline outside quotes), which is
 * safe on UTF-8 and single-byte encodings because the bytes for quote, comma
 * and newline never occur inside a multi-byte character. Only the few rows a
 * user looks at, or one record at a time during an operation, are decoded.
 */

export const BLOCK = 8 * 1024 * 1024;
const QUOTE = 34;
const LF = 10;
const CR = 13;

/**
 * Scans a block that starts at a record boundary. Calls emit(start, end, fields)
 * for every complete record, where [start, end) excludes the line ending.
 * Returns the number of bytes consumed (through the last line ending). At the
 * end of the file (`isLast`) an unterminated final record is emitted too.
 */
export function scanBlock(bytes, delimiter, isLast, emit) {
  const n = bytes.length;
  let recStart = 0;
  let fields = 1;
  let atStart = true;
  let inQuote = false;
  let quotePending = false; // saw a quote inside quotes: either "" or the closing quote
  for (let i = 0; i < n; i += 1) {
    const b = bytes[i];
    if (inQuote) {
      if (quotePending) {
        quotePending = false;
        if (b === QUOTE) continue; // "" is an escaped quote
        inQuote = false; // that quote closed the field; treat this byte normally
      } else {
        if (b === QUOTE) quotePending = true;
        continue;
      }
    }
    if (b === QUOTE && atStart) {
      inQuote = true; atStart = false;
    } else if (b === delimiter) {
      fields += 1; atStart = true;
    } else if (b === LF) {
      const end = i > recStart && bytes[i - 1] === CR ? i - 1 : i;
      if (end > recStart) emit(recStart, end, fields);
      recStart = i + 1; fields = 1; atStart = true;
    } else if (b !== CR) {
      atStart = false;
    }
  }
  if (isLast && recStart < n) {
    const end = bytes[n - 1] === CR ? n - 1 : n;
    if (end > recStart) emit(recStart, end, fields);
    return n;
  }
  return recStart;
}

const readBytes = async (file, from, to) => new Uint8Array(await file.slice(from, to).arrayBuffer());

/**
 * Walks every record of a file from byte offset `from`, calling
 * onRecord(bytes, start, fields) with a view into the current block — copy it if
 * you keep it. Return false from onRecord to stop. onBlock(fraction) runs between
 * blocks; if it returns false the walk is cancelled.
 */
export async function forEachRecord(file, delimiter, onRecord, { from = 0, onBlock } = {}) {
  const size = file.size;
  const delim = typeof delimiter === 'string' ? delimiter.charCodeAt(0) : delimiter;
  let pos = from;
  let block = BLOCK;
  let stop = false;
  while (pos < size && !stop) {
    const end = Math.min(size, pos + block);
    const bytes = await readBytes(file, pos, end);
    const isLast = end >= size;
    const base = pos;
    const consumed = scanBlock(bytes, delim, isLast, (start, stopAt, fields) => {
      if (stop) return;
      if (onRecord(bytes.subarray(start, stopAt), base + start, fields) === false) stop = true;
    });
    if (consumed === 0 && !isLast) { block *= 2; continue; } // a record larger than the block
    pos += consumed;
    block = BLOCK;
    if (onBlock && onBlock(pos / size) === false) return { cancelled: true };
  }
  return { cancelled: false };
}

/* --------------------------------------------------------------- sniffing */

const TEXT = new TextDecoder('utf-8');

export function detectBom(bytes) {
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) return { name: 'utf-8', length: 3 };
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return { name: 'utf-16le', length: 2 };
  if (bytes[0] === 0xfe && bytes[1] === 0xff) return { name: 'utf-16be', length: 2 };
  return { name: null, length: 0 };
}

/** Comma, semicolon, tab or pipe, chosen by how consistently it splits the first records. */
export function sniffDelimiter(bytes) {
  const sample = TEXT.decode(bytes.subarray(0, 65536));
  const cut = sample.lastIndexOf('\n');
  const text = cut > 0 ? sample.slice(0, cut) : sample;
  // Split into records once, with a quote-aware pass, so a newline inside quotes is not a boundary.
  const records = [];
  let inQuote = false;
  let start = 0;
  for (let i = 0; i < text.length && records.length < 30; i += 1) {
    const ch = text[i];
    if (ch === '"') inQuote = !inQuote;
    else if (ch === '\n' && !inQuote) { records.push(text.slice(start, i)); start = i + 1; }
  }
  if (records.length < 2) records.push(text.slice(start));
  let best = { delimiter: ',', score: -1 };
  for (const delimiter of [',', ';', '\t', '|']) {
    const counts = records.map((record) => parseRecord(record, delimiter).length);
    const first = counts[0];
    if (first < 2) continue;
    const consistent = counts.filter((count) => count === first).length / counts.length;
    const score = consistent * 10 + Math.min(first, 20) / 100;
    if (score > best.score) best = { delimiter, score };
  }
  return best.delimiter;
}

const INT = /^-?\d{1,18}$/;
const FLOAT = /^-?\d*\.\d+(e[+-]?\d+)?$/i;
const DATE = /^(\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2}(:\d{2})?)?|\d{1,2}[/.-]\d{1,2}[/.-]\d{2,4})$/;
const BOOL = /^(true|false|yes|no)$/i;

/** Column types from sample rows: integer, decimal, date, boolean or text. */
export function sniffTypes(rows, columnCount) {
  return Array.from({ length: columnCount }, (_, c) => {
    let filled = 0;
    const hits = { integer: 0, decimal: 0, date: 0, boolean: 0 };
    for (const row of rows) {
      const value = (row[c] ?? '').trim();
      if (!value) continue;
      filled += 1;
      if (INT.test(value)) hits.integer += 1;
      else if (FLOAT.test(value)) hits.decimal += 1;
      else if (DATE.test(value)) hits.date += 1;
      else if (BOOL.test(value)) hits.boolean += 1;
    }
    if (!filled) return 'empty';
    for (const [type, count] of Object.entries(hits)) if (count / filled >= 0.95) return type;
    if ((hits.integer + hits.decimal) / filled >= 0.95) return 'decimal';
    return 'text';
  });
}

/* ------------------------------------------------------------------ index */

const grow = (array, needed) => {
  if (needed <= array.length) return array;
  const next = new Float64Array(Math.max(needed, array.length * 2));
  next.set(array);
  return next;
};

/**
 * Pass 1: one streaming pass that records the byte offset where every record
 * starts, counts fields to find ragged rows, and sniffs the delimiter, header
 * and column types. Nothing but the offsets is kept, so memory grows with the
 * number of rows (8 bytes each), not with the size of the file.
 */
export async function indexFile(file, { onProgress, delimiter: forced } = {}) {
  const head = await readBytes(file, 0, Math.min(file.size, 65536));
  const bom = detectBom(head);
  if (bom.name && bom.name.startsWith('utf-16')) return { error: 'UTF16' };
  const delimiter = forced || sniffDelimiter(head.subarray(bom.length));
  let offsets = new Float64Array(1 << 16);
  let rows = 0;
  let expected = 0;
  let ragged = 0;
  let maxFields = 0;
  let lastReport = 0;
  const walked = await forEachRecord(file, delimiter, (_bytes, start, fields) => {
    offsets = grow(offsets, rows + 2);
    offsets[rows] = start;
    if (rows === 0) expected = fields;
    else if (fields !== expected) ragged += 1;
    if (fields > maxFields) maxFields = fields;
    rows += 1;
  }, {
    from: bom.length,
    onBlock: (fraction) => {
      const now = Date.now();
      if (onProgress && now - lastReport > 150) { lastReport = now; return onProgress(fraction, rows) !== false; }
      return true;
    },
  });
  if (walked.cancelled) return { cancelled: true };
  offsets = grow(offsets, rows + 1);
  offsets[rows] = file.size;
  offsets = offsets.slice(0, rows + 1);

  const decoder = new TextDecoder('utf-8');
  /** Parses records [from, from + count) by reading just their bytes. */
  const read = async (from, count) => {
    const last = Math.min(rows, from + count);
    if (from >= last) return [];
    const bytes = await readBytes(file, offsets[from], offsets[last]);
    const out = [];
    for (let r = from; r < last; r += 1) {
      const a = offsets[r] - offsets[from];
      let b = offsets[r + 1] - offsets[from];
      while (b > a && (bytes[b - 1] === LF || bytes[b - 1] === CR)) b -= 1;
      out.push(parseRecord(decoder.decode(bytes.subarray(a, b)), delimiter));
    }
    return out;
  };
  const sample = await read(0, 1001);
  const header = sample[0] || [];
  const types = sniffTypes(sample.slice(1), Math.max(expected, header.length));
  // A row of text where nothing looks like a number is very likely a header.
  const hasHeader = header.length > 0 && header.every((cell) => cell && !INT.test(cell.trim()) && !FLOAT.test(cell.trim()));
  return {
    delimiter, bom: bom.name, offsets, rows, fields: expected, maxFields, ragged, types, hasHeader, header, read, size: file.size,
  };
}
