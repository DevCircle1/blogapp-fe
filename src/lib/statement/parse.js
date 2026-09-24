import {
  assignCells, detectHeader, groupRows, rowText, toSegments,
} from './layout.js';
import { GENERIC_PROFILE, detectBank } from './banks.js';
import { detectOrder, validateBalances } from './validate.js';
import {
  detectDateOrder, hasYear, isDateLike, looksLikeAmount, monthOfRaw, parseAmount, parseDate,
} from './values.js';

/**
 * Pure statement parser: page text items in, transaction rows out. No DOM and no
 * pdf.js import, so the same code runs in the Web Worker, in the UI (after an
 * edit) and in the Node checks.
 *
 * pages: [{ number, items: [{ str, x, y, w, h }] }]   (y grows downwards)
 */

const OPENING = /\b(opening|beginning|previous|brought\s*forward|b\/f|bal(ance)?\s*b\/?f)\b/i;
const CLOSING = /\b(closing|ending|carried\s*forward|c\/f|total|balance\s*c\/?f)\b/i;
const NOISE = [
  /^page\s*\d+(\s*(of|\/)\s*\d+)?$/i,
  /^\d+\s*(of|\/)\s*\d+$/,
  /^\(?continued\)?$/i,
  /^(this\s+is\s+a\s+)?(computer|system)[-\s]generated/i,
];

const median = (values) => {
  if (!values.length) return 12;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)];
};

const TIME_TAIL = /\s+\d{1,2}:\d{2}(:\d{2})?(\s?[AP]M)?$/i;

/** Years printed on the first pages, used to complete dates that carry no year. */
function statementYears(pagesText, now) {
  const found = new Set();
  for (const match of pagesText.matchAll(/\b(19[89]\d|20\d{2})\b/g)) {
    const year = Number(match[1]);
    if (year <= now.getFullYear() + 1) found.add(year);
  }
  const years = [...found].sort((a, b) => a - b);
  return years.length ? { start: years[0], end: years[years.length - 1], known: true } : { start: now.getFullYear(), end: now.getFullYear(), known: false };
}

const cellAmount = (text) => (text === undefined || text === '' || /^[-–—]+$/.test(text.trim()) ? null : parseAmount(text));

/* -------------------------------------------------------- draft rows */

function draftFromHeaders(pageRows) {
  const drafts = [];
  const skipped = [];
  const gaps = [];
  let opening = null;
  let closing = null;
  let layout = null;
  let headerFound = false;
  let columnsSeen = [];
  let prev = null;

  for (const page of pageRows) {
    for (let i = 0; i < page.rows.length; i += 1) {
      const row = page.rows[i];
      const next = page.rows[i + 1];
      const header = detectHeader(row.segments, next?.segments, next ? next.y - row.y : Infinity);
      if (header) {
        layout = header.columns;
        headerFound = true;
        columnsSeen = [...new Set([...columnsSeen, ...layout.map((c) => c.role)])];
        i += header.consumed - 1;
        continue;
      }
      if (!layout) continue;

      const text = rowText(row.segments);
      if (NOISE.some((re) => re.test(text.trim()))) continue;
      const { cells, leftovers } = assignCells(row.segments, layout);
      const dateCell = cells.date ? cells.date.replace(TIME_TAIL, '').trim() : '';
      const desc = (cells.desc || '').trim();
      const hasMoney = ['debit', 'credit', 'amount', 'balance'].some((r) => cells[r] !== undefined);

      if (dateCell && isDateLike(dateCell)) {
        // Some banks date their opening/closing balance line; it is not a transaction.
        const movement = cells.debit !== undefined || cells.credit !== undefined || cells.amount !== undefined;
        if (!movement && cells.balance !== undefined && (OPENING.test(desc) || CLOSING.test(desc))) {
          const value = cellAmount(cells.balance);
          if (value && OPENING.test(desc) && !drafts.length) opening = value.dir === 'dr' ? -value.value : value.value;
          else if (value && !OPENING.test(desc)) closing = value.value;
          continue;
        }
        if (prev && prev.page === page.number) gaps.push(row.y - prev.y);
        const draft = {
          page: page.number, y: row.y, date: dateCell, desc, ref: cells.ref || '',
          debit: cells.debit, credit: cells.credit, amount: cells.amount, balance: cells.balance,
          extra: leftovers,
        };
        drafts.push(draft);
        prev = { page: page.number, y: row.y, draft };
        continue;
      }

      const label = `${desc} ${cells.ref || ''}`.trim() || text;
      if (hasMoney && OPENING.test(label)) {
        const value = cellAmount(cells.balance ?? cells.amount ?? cells.credit ?? cells.debit);
        if (value && !drafts.length) opening = value.dir === 'dr' ? -value.value : value.value;
        continue;
      }
      if (hasMoney && CLOSING.test(label)) {
        const value = cellAmount(cells.balance);
        if (value) closing = value.value;
        continue;
      }
      if (hasMoney) {
        skipped.push({ page: page.number, text, reason: 'has an amount but no date' });
        continue;
      }
      // Wrapped description: no date, no amount, close under the previous row.
      const pitch = median(gaps);
      if (prev && prev.page === page.number && desc && row.y - prev.y <= Math.max(18, pitch * 2.2)
        && !dateCell) {
        prev.draft.desc = `${prev.draft.desc} ${desc}`.trim();
        if (cells.ref) prev.draft.ref = `${prev.draft.ref} ${cells.ref}`.trim();
        prev.y = row.y;
      }
    }
  }
  return {
    drafts, skipped, opening, closing, headerFound, columns: columnsSeen,
  };
}

/** No header row found: read each line that starts with a date and ends in amounts. */
function draftByGuessing(pageRows) {
  const drafts = [];
  const gaps = [];
  let prev = null;
  for (const page of pageRows) {
    for (const row of page.rows) {
      const segs = row.segments;
      const first = segs[0];
      const text = rowText(segs);
      if (NOISE.some((re) => re.test(text.trim()))) continue;
      if (first && isDateLike(first.text.replace(TIME_TAIL, '').trim())) {
        const amounts = segs.slice(1).filter((s) => !isDateLike(s.text) && looksLikeAmount(s.text));
        if (!amounts.length) continue;
        const descSegs = segs.slice(1).filter((s) => !amounts.includes(s));
        const draft = { page: page.number, y: row.y, date: first.text.replace(TIME_TAIL, '').trim(), desc: descSegs.map((s) => s.text).join(' '), ref: '', extra: [] };
        if (amounts.length === 1) draft.amount = amounts[0].text;
        else { draft.amount = amounts[amounts.length - 2].text; draft.balance = amounts[amounts.length - 1].text; }
        if (amounts.length > 2) draft.desc = `${draft.desc} ${amounts.slice(0, -2).map((s) => s.text).join(' ')}`.trim();
        if (prev && prev.page === page.number) gaps.push(row.y - prev.y);
        drafts.push(draft);
        prev = { page: page.number, y: row.y, draft };
      } else if (prev && prev.page === page.number && !segs.some((s) => looksLikeAmount(s.text))
        && row.y - prev.y <= Math.max(18, median(gaps) * 2.2)) {
        prev.draft.desc = `${prev.draft.desc} ${text}`.trim();
        prev.y = row.y;
      }
    }
  }
  return { drafts, skipped: [], opening: null, closing: null, headerFound: false, columns: ['date', 'desc', 'amount', 'balance'] };
}

/* ------------------------------------------------------- main entry */

export function parseStatement(pages, { now = new Date() } = {}) {
  const pageRows = pages.map((page) => ({
    number: page.number,
    rows: groupRows(page.items).map((row) => ({ y: row.y, segments: toSegments(row) })),
  }));

  const firstPagesText = pageRows.slice(0, 2).flatMap((p) => p.rows.map((r) => rowText(r.segments))).join('\n');
  const bank = detectBank(firstPagesText);
  const profile = bank || GENERIC_PROFILE;
  const warnings = [];

  let result = draftFromHeaders(pageRows);
  let mode = 'header';
  if (!result.drafts.length) {
    result = draftByGuessing(pageRows);
    mode = 'guess';
    if (result.drafts.length) warnings.push('No table header was found, so the columns were guessed from the layout. Check every row before using the file.');
  }

  const skipPatterns = profile.skipPatterns || [];
  const drafts = result.drafts.filter((d) => !skipPatterns.some((re) => re.test(d.desc)));

  const order = detectDateOrder(drafts.map((d) => d.date), profile.dateOrder);
  const years = statementYears(firstPagesText, now);
  const needsYear = drafts.some((d) => !hasYear(d.date));
  if (needsYear && !years.known) warnings.push(`Dates on this statement have no year and none could be found on the first page, so ${years.end} was assumed.`);

  // Year rollover for year-less dates: months usually climb; a big drop means a new year.
  const months = drafts.map((d) => monthOfRaw(d.date, order)).filter(Boolean);
  let falls = 0;
  let rises = 0;
  for (let i = 1; i < months.length; i += 1) {
    if (months[i] < months[i - 1]) falls += 1;
    if (months[i] > months[i - 1]) rises += 1;
  }
  const direction = falls > rises && !(falls === 1 && rises === 0 && months.length > 2) ? -1 : 1;
  let yearHint = direction === 1 ? years.start : years.end;
  let lastMonth = null;

  const rows = [];
  let unreadable = 0;
  for (const d of drafts) {
    const month = monthOfRaw(d.date, order);
    if (!hasYear(d.date) && month && lastMonth !== null) {
      if (direction === 1 && lastMonth - month >= 6) yearHint += 1;
      if (direction === -1 && month - lastMonth >= 6) yearHint -= 1;
    }
    if (month) lastMonth = month;
    const date = parseDate(d.date, { order, yearHint });
    if (!date) { unreadable += 1; continue; }

    const debit = cellAmount(d.debit);
    const credit = cellAmount(d.credit);
    const amount = cellAmount(d.amount);
    const balance = cellAmount(d.balance);
    rows.push({
      date,
      description: d.desc,
      ref: d.ref || '',
      debit: debit ? debit.value : null,
      credit: credit ? credit.value : null,
      balance: balance ? (balance.dir === 'dr' ? -balance.value : balance.value) : null,
      page: d.page,
      _amount: amount, // resolved to debit/credit below
      _y: d.y,
    });
  }
  if (unreadable) warnings.push(`${unreadable} line${unreadable === 1 ? '' : 's'} started with something date-like that could not be read as a date and were left out.`);

  // Direction of a single signed Amount column.
  const hasAmountColumn = rows.some((r) => r._amount);
  if (hasAmountColumn) {
    const magnitudeRows = rows.map((r) => ({ debit: r._amount ? r._amount.value : (r.debit ?? r.credit ?? 0), credit: 0, balance: r.balance }));
    const chron = detectOrder(magnitudeRows);
    const idx = rows.map((_, i) => i);
    if (chron === 'desc') idx.reverse();
    let prevBalance = result.opening;
    let guessed = 0;
    for (const i of idx) {
      const row = rows[i];
      if (row._amount) {
        const { value, dir } = row._amount;
        let side = dir;
        if (!side && prevBalance != null && row.balance != null) {
          const delta = Math.round((row.balance - prevBalance) * 100);
          if (delta === Math.round(value * 100)) side = 'cr';
          else if (delta === -Math.round(value * 100)) side = 'dr';
        }
        if (!side) {
          guessed += 1;
          side = 'cr';
        }
        if (side === 'dr') row.debit = value; else row.credit = value;
      }
      if (row.balance != null) prevBalance = row.balance;
    }
    if (guessed && !rows.some((r) => r.balance != null)) {
      warnings.push('This statement has one signed Amount column and no running balance, so money in/out was taken from the sign. Positive amounts are shown as credits; use "Flip debit/credit" if your bank does the opposite (credit cards usually do).');
    }
  }
  rows.forEach((r) => { delete r._amount; delete r._y; });

  const check = validateBalances(rows, { opening: result.opening });
  if (!rows.some((r) => r.balance != null)) warnings.push('No running balance was found, so the rows could not be checked against a balance. Review them by eye.');

  return {
    bank: bank ? bank.slug : null,
    bankName: bank ? bank.name : null,
    mode,
    columns: result.columns,
    hasRef: rows.some((r) => r.ref),
    dateOrder: order,
    opening: result.opening,
    closing: result.closing,
    order: check.order,
    rows,
    skipped: result.skipped,
    warnings,
    stats: { pages: pages.length, lines: pageRows.reduce((n, p) => n + p.rows.length, 0) },
  };
}
