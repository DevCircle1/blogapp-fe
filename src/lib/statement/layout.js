import { looksLikeAmount, isDateLike } from './values.js';

/**
 * Turns the loose text items pdf.js returns for a page into rows of segments.
 * A PDF has no table structure — only glyph runs at coordinates — so the table
 * is rebuilt geometrically: items on the same baseline form a row, and items in
 * a row separated by a real gap form separate cells ("segments").
 */

export const ROW_TOLERANCE = 3;

export function groupRows(items, tolerance = ROW_TOLERANCE) {
  const sorted = items
    .filter((item) => item.str.trim() !== '')
    .sort((a, b) => a.y - b.y || a.x - b.x);
  const rows = [];
  for (const item of sorted) {
    const current = rows[rows.length - 1];
    if (current && Math.abs(item.y - current.y) <= tolerance) {
      current.items.push(item);
      current.y = (current.y * (current.items.length - 1) + item.y) / current.items.length;
    } else {
      rows.push({ y: item.y, items: [item] });
    }
  }
  return rows.map((row) => ({ y: row.y, items: row.items.sort((a, b) => a.x - b.x) }));
}

/** Joins the items of one row into cell-sized segments by horizontal gap. */
export function toSegments(row) {
  const segments = [];
  for (const item of row.items) {
    const text = item.str.trim();
    const last = segments[segments.length - 1];
    const h = Math.max(item.h || 0, 6);
    if (!last) {
      segments.push({ text, x: item.x, x2: item.x + item.w, h });
      continue;
    }
    const gap = item.x - last.x2;
    // CR / DR belongs to the amount before it, however far the font puts it.
    const tag = /^(CR|DR)\.?$/i.test(text) && looksLikeAmount(last.text);
    // A new number right after text (or vice versa) is a column boundary at a
    // smaller gap than words within a phrase, otherwise "DEBIT CARD 1,200.00"
    // would swallow the amount into the description.
    const amountBoundary = (looksLikeAmount(text) !== looksLikeAmount(last.text)) && !tag && gap > 0.35 * h;
    const joinNoSpace = gap <= 0.15 * h;
    const joinSpace = gap <= 0.6 * h;
    if (tag || (!amountBoundary && (joinNoSpace || joinSpace))) {
      last.text += (joinNoSpace && !tag ? '' : ' ') + text;
      last.x2 = Math.max(last.x2, item.x + item.w);
    } else {
      segments.push({ text, x: item.x, x2: item.x + item.w, h });
    }
  }
  return segments.map((s) => ({ ...s, cx: (s.x + s.x2) / 2 }));
}

export const rowText = (segments) => segments.map((s) => s.text).join(' ');

/* ------------------------------------------------------------- headers */

const norm = (text) => text
  .replace(/\(.*?\)/g, ' ')
  .replace(/[$£€*:]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

const ROLE_PATTERNS = [
  ['valueDate', /^value\s*date$/i],
  ['date', /^((txn|transaction|trans|posting|post|booking|posted)\.?\s*)?date(\s*of\s*transaction)?$/i],
  ['desc', /^(description|details|particulars|narration|narrative|transaction\s*(details|description)|merchant.*|remarks|memo|payee|transactions?)$/i],
  ['debit', /^(debits?|withdrawals?|paid\s*out|money\s*out|outgoing|dr\.?|debit\s*amount|amount\s*debited|withdrawal\s*amt\.?)$/i],
  ['credit', /^(credits?|deposits?|paid\s*in|money\s*in|incoming|cr\.?|credit\s*amount|amount\s*credited|deposit\s*amt\.?)$/i],
  ['balance', /^((running|closing|available|ledger)\s*)?balance$/i],
  ['amount', /^(amount|amt\.?|transaction\s*amount|amount\s*\(.*\))$/i],
  ['ref', /^(ref(erence)?(\s*(no|number|#))?\.?|cheque(\s*(no|number|#))?\.?|check(\s*(no|number|#))?|instrument(\s*(no|number))?|chq\.?(\s*no\.?)?|txn\s*id|transaction\s*id|serial(\s*no\.?)?)$/i],
];

export const NUMERIC_ROLES = new Set(['debit', 'credit', 'balance', 'amount']);

export const roleOf = (text) => {
  const cleaned = norm(text);
  if (!cleaned) return null;
  const hit = ROLE_PATTERNS.find(([, re]) => re.test(cleaned));
  return hit ? hit[0] : null;
};

const rolesOf = (segments) => segments.map((s) => ({ ...s, role: roleOf(s.text) })).filter((s) => s.role);

const headerScore = (cols) => {
  const roles = new Set(cols.map((c) => c.role));
  const hasMoney = ['debit', 'credit', 'amount', 'balance'].some((r) => roles.has(r));
  const hasAnchor = roles.has('date') || roles.has('desc');
  return hasMoney && hasAnchor ? roles.size : 0;
};

/** Stacks two wrapped header lines ("Paid" over "out") into one line of cells. */
const mergeHeaderLines = (a, b) => {
  const merged = a.map((s) => ({ ...s }));
  for (const s of b) {
    const target = merged.find((m) => Math.min(m.x2, s.x2) - Math.max(m.x, s.x) > -6);
    if (target) {
      target.text = `${target.text} ${s.text}`;
      target.x = Math.min(target.x, s.x);
      target.x2 = Math.max(target.x2, s.x2);
      target.cx = (target.x + target.x2) / 2;
    } else {
      merged.push({ ...s });
    }
  }
  return merged.sort((p, q) => p.x - q.x);
};

/**
 * Returns { columns, consumed } if `segments` (optionally with the next line)
 * is a table header row: at least three distinct column roles including a date
 * or description and a money column.
 */
export function detectHeader(segments, nextSegments, nextGap) {
  const single = rolesOf(segments);
  if (headerScore(single) >= 3) return { columns: single, consumed: 1 };
  if (nextSegments && nextGap <= 16) {
    const merged = rolesOf(mergeHeaderLines(segments, nextSegments));
    if (headerScore(merged) >= 3) return { columns: merged, consumed: 2 };
  }
  return null;
}

/* --------------------------------------------------------- cell mapping */

const NUMERIC_MATCH_DISTANCE = 60;

/** Assigns each segment of a row to a header column. */
export function assignCells(segments, columns) {
  const numeric = columns.filter((c) => NUMERIC_ROLES.has(c.role));
  const textual = columns.filter((c) => !NUMERIC_ROLES.has(c.role)).sort((a, b) => a.x - b.x);
  const cells = {};
  const leftovers = [];
  const put = (role, text) => { cells[role] = cells[role] ? `${cells[role]} ${text}` : text; };

  for (const seg of segments) {
    const amountLike = !isDateLike(seg.text) && (looksLikeAmount(seg.text) || /^\d{1,12}$/.test(seg.text));
    if (amountLike && numeric.length) {
      let best = null;
      for (const col of numeric) {
        const d = Math.min(Math.abs(seg.x2 - col.x2), Math.abs(seg.cx - col.cx), Math.abs(seg.x - col.x));
        if (!best || d < best.d) best = { col, d };
      }
      const strict = !looksLikeAmount(seg.text);
      if (best.d <= (strict ? 8 : NUMERIC_MATCH_DISTANCE)) {
        // Two values landing in one numeric cell: keep the first, surface the second.
        if (cells[best.col.role] !== undefined) leftovers.push(seg.text);
        else cells[best.col.role] = seg.text;
        continue;
      }
    }
    if (!textual.length) { leftovers.push(seg.text); continue; }
    let target = textual[0];
    for (const col of textual) if (col.x - 4 <= seg.x) target = col;
    put(target.role, seg.text);
  }
  return { cells, leftovers };
}
