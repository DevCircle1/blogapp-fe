/**
 * A CSV field/record parser that follows RFC 4180: quoted fields may contain the
 * delimiter, doubled quotes ("") and line breaks. Used for small pieces of text
 * (the rows on screen, one record at a time during an operation). The whole file
 * is never parsed with this — see scan.js for the byte-level record scanner.
 */

/** Parses text holding any number of records → string[][]. Blank lines are skipped. */
export function parseRecords(text, delimiter = ',') {
  const rows = [];
  let row = [];
  let field = '';
  let inQuote = false;
  let atStart = true;
  const n = text.length;
  for (let i = 0; i < n; i += 1) {
    const ch = text[i];
    if (inQuote) {
      if (ch === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 1; } else { inQuote = false; }
      } else field += ch;
    } else if (ch === '"' && atStart) {
      inQuote = true; atStart = false;
    } else if (ch === delimiter) {
      row.push(field); field = ''; atStart = true;
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      if (row.length || field !== '' || !atStart) { row.push(field); rows.push(row); }
      row = []; field = ''; atStart = true;
    } else {
      field += ch; atStart = false;
    }
  }
  if (row.length || field !== '' || !atStart) { row.push(field); rows.push(row); }
  return rows;
}

/** One record (which may span several lines inside quotes) → string[]. */
export function parseRecord(text, delimiter = ',') {
  const [first] = parseRecords(text.replace(/\r?\n$/, ''), delimiter);
  return first || [''];
}

const NEEDS_QUOTES = /[",\r\n]/;
export function serializeField(value, delimiter = ',') {
  const text = value == null ? '' : String(value);
  return text.includes(delimiter) || NEEDS_QUOTES.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
export const serializeRow = (fields, delimiter = ',') => fields.map((field) => serializeField(field, delimiter)).join(delimiter);
