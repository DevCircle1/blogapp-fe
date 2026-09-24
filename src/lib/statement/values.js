/**
 * Parsing of the two value types a statement contains: dates and money.
 * Pure functions, no DOM — shared by the worker, the UI and the Node checks.
 */

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const monthIndex = (name) => MONTHS.indexOf(name.slice(0, 3).toLowerCase()) + 1;

const CURRENCY = /(?:PKR|USD|GBP|EUR|AED|INR|CAD|AUD|SAR|Rs\.?|₨|[$£€¥])/gi;

/** Money amount only: optionally signed, bracketed, currency-prefixed or CR/DR tagged. */
const AMOUNT_RE = /^(?:\(\s*)?[-+]?\s*(?:PKR|USD|GBP|EUR|AED|INR|CAD|AUD|SAR|Rs\.?|₨|[$£€¥])?\s*[-+]?\d[\d.,\s]*\d?(?:\s*\))?\s*(?:-|CR|DR)?$/i;

export const looksLikeAmount = (text) => {
  const trimmed = String(text).trim();
  if (!trimmed || !/\d/.test(trimmed)) return false;
  if (!AMOUNT_RE.test(trimmed)) return false;
  // A bare short integer ("12", "2024") is far more likely a day, year or
  // reference than an amount; real amounts carry a decimal part or a separator.
  const digits = trimmed.replace(CURRENCY, '').replace(/[^\d.,]/g, '');
  return /[.,]\d{1,2}$/.test(digits) || /\d[.,]\d{3}/.test(digits);
};

/**
 * "1,234.50", "1.234,50", "(1,234.50)", "1,234.50 DR", "-1234.5", "1234.50-", "PKR 1,234"
 * → { value: number (unsigned), dir: 'dr' | 'cr' | null }.
 * `dir` is only set when the text itself says which side the amount is on.
 */
export function parseAmount(raw) {
  if (raw === null || raw === undefined) return null;
  let text = String(raw).trim();
  if (!text) return null;

  let dir = null;
  const tag = text.match(/\s*(CR|DR)\.?\s*$/i);
  if (tag) {
    dir = tag[1].toLowerCase();
    text = text.slice(0, tag.index).trim();
  }
  if (/^\(.*\)$/.test(text)) {
    dir = 'dr';
    text = text.slice(1, -1);
  }
  if (/-\s*$/.test(text)) {
    dir = 'dr';
    text = text.replace(/-\s*$/, '');
  }
  if (/^\s*-/.test(text)) {
    dir = 'dr';
    text = text.replace(/^\s*-/, '');
  }
  text = text.replace(CURRENCY, '').replace(/^\s*\+/, '').replace(/[\s']/g, '');
  if (!/^\d[\d.,]*$/.test(text)) return null;

  const lastDot = text.lastIndexOf('.');
  const lastComma = text.lastIndexOf(',');
  let normalised;
  if (lastDot >= 0 && lastComma >= 0) {
    // Both present: whichever comes last is the decimal mark.
    normalised = lastDot > lastComma
      ? text.replace(/,/g, '')
      : text.replace(/\./g, '').replace(',', '.');
  } else if (lastComma >= 0) {
    // Only commas: "1,234" is thousands, "12,50" is a decimal comma.
    const after = text.length - lastComma - 1;
    const many = (text.match(/,/g) || []).length > 1;
    normalised = after === 3 || many ? text.replace(/,/g, '') : text.replace(',', '.');
  } else if ((text.match(/\./g) || []).length > 1) {
    normalised = text.replace(/\./g, '');
  } else {
    normalised = text;
  }
  const value = Number(normalised);
  return Number.isFinite(value) ? { value: Math.round(value * 100) / 100, dir } : null;
}

/* ---------------------------------------------------------------- dates */

const MON = '(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)';

const DATE_PATTERNS = [
  // 2024-03-15, 2024/03/15
  { re: /^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/, kind: 'ymd' },
  // 15 Mar 2024, 15-Mar-24, 15/Mar/2024
  { re: new RegExp(`^(\\d{1,2})[\\s\\-/.]+${MON}[\\s\\-/.,]+(\\d{2,4})$`, 'i'), kind: 'd-mon-y' },
  // Mar 15, 2024 / Mar 15 2024
  { re: new RegExp(`^${MON}\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?,?\\s+(\\d{2,4})$`, 'i'), kind: 'mon-d-y' },
  // 15 Mar (no year)
  { re: new RegExp(`^(\\d{1,2})[\\s\\-/.]+${MON}$`, 'i'), kind: 'd-mon' },
  // Mar 15 (no year)
  { re: new RegExp(`^${MON}\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?$`, 'i'), kind: 'mon-d' },
  // 15/03/2024, 03-15-24, 15.03.2024
  { re: /^(\d{1,2})[-/.](\d{1,2})[-/.](\d{2,4})$/, kind: 'nn-nn-y' },
  // 03/15 (no year)
  { re: /^(\d{1,2})[/](\d{1,2})$/, kind: 'nn-nn' },
];

/** Splits a raw date string into parts without deciding day-vs-month yet. */
export function readDateParts(raw) {
  const text = String(raw).trim().replace(/\s+/g, ' ');
  for (const { re, kind } of DATE_PATTERNS) {
    const match = text.match(re);
    if (!match) continue;
    if (kind === 'ymd') return { kind, y: +match[1], a: +match[2], b: +match[3] };
    if (kind === 'd-mon-y') return { kind, d: +match[1], m: monthIndex(match[2]), y: match[3] };
    if (kind === 'mon-d-y') return { kind, m: monthIndex(match[1]), d: +match[2], y: match[3] };
    if (kind === 'd-mon') return { kind, d: +match[1], m: monthIndex(match[2]), y: null };
    if (kind === 'mon-d') return { kind, m: monthIndex(match[1]), d: +match[2], y: null };
    if (kind === 'nn-nn-y') return { kind, a: +match[1], b: +match[2], y: match[3] };
    if (kind === 'nn-nn') return { kind, a: +match[1], b: +match[2], y: null };
  }
  return null;
}

export const isDateLike = (raw) => readDateParts(raw) !== null;

const fullYear = (y) => {
  const n = Number(y);
  if (String(y).length >= 4) return n;
  return n >= 70 ? 1900 + n : 2000 + n;
};

const validDate = (y, m, d) => {
  if (!(m >= 1 && m <= 12 && d >= 1 && d <= 31)) return false;
  const probe = new Date(Date.UTC(y, m - 1, d));
  return probe.getUTCMonth() === m - 1 && probe.getUTCDate() === d;
};

export const iso = (y, m, d) => `${String(y).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

/**
 * Decides whether all-numeric dates in a statement are day-first or month-first.
 * A value above 12 in a slot proves that slot is the day. With no proof either
 * way the bank profile's preference wins.
 */
export function detectDateOrder(rawDates, preferred = 'dmy') {
  let firstIsDay = false;
  let secondIsDay = false;
  for (const raw of rawDates) {
    const parts = readDateParts(raw);
    if (!parts || (parts.kind !== 'nn-nn-y' && parts.kind !== 'nn-nn')) continue;
    if (parts.a > 12) firstIsDay = true;
    if (parts.b > 12) secondIsDay = true;
  }
  if (firstIsDay && !secondIsDay) return 'dmy';
  if (secondIsDay && !firstIsDay) return 'mdy';
  return preferred;
}

/**
 * → ISO 'yyyy-mm-dd', or null. `yearHint` fills in dates printed without a year;
 * the caller advances it when the months roll over.
 */
export function parseDate(raw, { order = 'dmy', yearHint = null } = {}) {
  const parts = readDateParts(raw);
  if (!parts) return null;
  let y; let m; let d;
  switch (parts.kind) {
    case 'ymd': y = parts.y; m = parts.a; d = parts.b; break;
    case 'd-mon-y': case 'mon-d-y': y = fullYear(parts.y); m = parts.m; d = parts.d; break;
    case 'd-mon': case 'mon-d': y = yearHint; m = parts.m; d = parts.d; break;
    case 'nn-nn-y':
      y = fullYear(parts.y);
      if (order === 'dmy') { d = parts.a; m = parts.b; } else { m = parts.a; d = parts.b; }
      break;
    case 'nn-nn':
      y = yearHint;
      if (order === 'dmy') { d = parts.a; m = parts.b; } else { m = parts.a; d = parts.b; }
      break;
    default: return null;
  }
  if (y === null || y === undefined) return null;
  return validDate(y, m, d) ? iso(y, m, d) : null;
}

/** Whether a raw date string carries its own year. */
export const hasYear = (raw) => {
  const parts = readDateParts(raw);
  return Boolean(parts && parts.y !== null && parts.y !== undefined);
};

/** Month number of a raw date (needed to detect a Dec → Jan rollover when the year is absent). */
export const monthOfRaw = (raw, order) => {
  const parts = readDateParts(raw);
  if (!parts) return null;
  if (parts.m) return parts.m;
  if (parts.kind === 'ymd') return parts.a;
  return order === 'dmy' ? parts.b : parts.a;
};
