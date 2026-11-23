/**
 * Pure engines for the "quick traffic" tools: VAT, time zones, typing speed,
 * click speed, reaction time, number words, GCF/LCM, week numbers, sleep cycles
 * and Unicode fancy text. No DOM and no React — exercised in Node by
 * scripts/checks/quick.mjs.
 */

/* ------------------------------------------------------------------ VAT */
export const VAT_PRESETS = [
  { label: 'UK 20%', rate: 20 }, { label: 'UK 5%', rate: 5 }, { label: 'Germany 19%', rate: 19 },
  { label: 'France 20%', rate: 20 }, { label: 'Ireland 23%', rate: 23 }, { label: 'Spain 21%', rate: 21 },
  { label: 'Italy 22%', rate: 22 }, { label: 'Netherlands 21%', rate: 21 }, { label: 'Pakistan GST 18%', rate: 18 },
  { label: 'India GST 18%', rate: 18 }, { label: 'Australia GST 10%', rate: 10 }, { label: 'Canada GST 5%', rate: 5 },
  { label: 'New Zealand GST 15%', rate: 15 }, { label: 'UAE VAT 5%', rate: 5 }, { label: 'Saudi VAT 15%', rate: 15 },
];

const r2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/** mode 'add': amount is net (ex-VAT). mode 'remove': amount is gross (VAT included). */
export const vat = (amount, rate, mode) => {
  if (!Number.isFinite(amount) || !Number.isFinite(rate) || rate < 0) return null;
  if (mode === 'add') {
    const tax = amount * rate / 100;
    return { net: r2(amount), vat: r2(tax), gross: r2(amount + tax) };
  }
  const net = amount / (1 + rate / 100);
  return { net: r2(net), vat: r2(amount - net), gross: r2(amount) };
};

/* ------------------------------------------------------------ time zones */
export const ZONES = [
  ['Pacific/Honolulu', 'Honolulu'], ['America/Anchorage', 'Anchorage'], ['America/Los_Angeles', 'Los Angeles (Pacific)'],
  ['America/Vancouver', 'Vancouver'], ['America/Denver', 'Denver (Mountain)'], ['America/Phoenix', 'Phoenix'],
  ['America/Chicago', 'Chicago (Central)'], ['America/Mexico_City', 'Mexico City'], ['America/New_York', 'New York (Eastern)'],
  ['America/Toronto', 'Toronto'], ['America/Bogota', 'Bogotá'], ['America/Sao_Paulo', 'São Paulo'],
  ['America/Argentina/Buenos_Aires', 'Buenos Aires'], ['UTC', 'UTC'], ['Europe/London', 'London'], ['Europe/Dublin', 'Dublin'],
  ['Europe/Lisbon', 'Lisbon'], ['Europe/Paris', 'Paris'], ['Europe/Berlin', 'Berlin'], ['Europe/Madrid', 'Madrid'],
  ['Europe/Rome', 'Rome'], ['Europe/Amsterdam', 'Amsterdam'], ['Europe/Warsaw', 'Warsaw'], ['Europe/Athens', 'Athens'],
  ['Europe/Istanbul', 'Istanbul'], ['Europe/Moscow', 'Moscow'], ['Africa/Cairo', 'Cairo'], ['Africa/Lagos', 'Lagos'],
  ['Africa/Nairobi', 'Nairobi'], ['Africa/Johannesburg', 'Johannesburg'], ['Asia/Dubai', 'Dubai'], ['Asia/Riyadh', 'Riyadh'],
  ['Asia/Tehran', 'Tehran'], ['Asia/Karachi', 'Karachi (Pakistan)'], ['Asia/Kolkata', 'India (Mumbai, Delhi)'],
  ['Asia/Dhaka', 'Dhaka'], ['Asia/Bangkok', 'Bangkok'], ['Asia/Jakarta', 'Jakarta'], ['Asia/Singapore', 'Singapore'],
  ['Asia/Hong_Kong', 'Hong Kong'], ['Asia/Shanghai', 'Beijing / Shanghai'], ['Asia/Manila', 'Manila'],
  ['Asia/Seoul', 'Seoul'], ['Asia/Tokyo', 'Tokyo'], ['Australia/Perth', 'Perth'], ['Australia/Sydney', 'Sydney'],
  ['Pacific/Auckland', 'Auckland'],
].map(([id, label]) => ({ id, label }));

const partsFormatter = new Map();
const getFormatter = (tz) => {
  if (!partsFormatter.has(tz)) {
    partsFormatter.set(tz, new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }));
  }
  return partsFormatter.get(tz);
};

/** Wall-clock fields of an instant in a zone. */
export const zonedParts = (date, tz) => {
  const out = {};
  for (const p of getFormatter(tz).formatToParts(date)) if (p.type !== 'literal') out[p.type] = Number(p.value);
  return { year: out.year, month: out.month, day: out.day, hour: out.hour % 24, minute: out.minute, second: out.second };
};

/** Offset from UTC in minutes (east positive) at the given instant. */
export const zoneOffsetMinutes = (date, tz) => {
  const p = zonedParts(date, tz);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
  return Math.round((asUtc - Math.floor(date.getTime() / 1000) * 1000) / 60000);
};

/**
 * The instant at which a zone's wall clock reads the given fields. Across a
 * spring-forward gap the clock time does not exist; the result is the instant
 * after the gap, which is how calendars treat it. When the clock falls back and a
 * time happens twice, the first occurrence is used.
 */
export const zonedToUtc = ({ year, month, day, hour, minute }, tz) => {
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const off1 = zoneOffsetMinutes(new Date(guess), tz);
  const c1 = guess - off1 * 60000;
  const off2 = zoneOffsetMinutes(new Date(c1), tz);
  if (off1 === off2) return new Date(c1);
  const c2 = guess - off2 * 60000;
  const wallMatches = (ms) => {
    const p = zonedParts(new Date(ms), tz);
    return p.hour === hour && p.minute === minute && p.day === day;
  };
  const valid = [c1, c2].filter(wallMatches);
  // One valid instant: use it. Two (clocks fall back): the first occurrence.
  // None (clocks spring forward): the instant after the gap.
  return new Date(valid.length ? Math.min(...valid) : Math.max(c1, c2));
};

export const formatOffset = (minutes) => {
  const sign = minutes < 0 ? '−' : '+';
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? `:${String(m).padStart(2, '0')}` : ''}`;
};

export const formatInZone = (date, tz) => {
  const p = zonedParts(date, tz);
  const pad = (n) => String(n).padStart(2, '0');
  const weekday = new Intl.DateTimeFormat('en-US', { timeZone: tz, weekday: 'short' }).format(date);
  return {
    time: `${pad(p.hour)}:${pad(p.minute)}`,
    date: `${weekday}, ${pad(p.day)}/${pad(p.month)}/${p.year}`,
    offset: formatOffset(zoneOffsetMinutes(date, tz)),
    dayKey: p.year * 10000 + p.month * 100 + p.day,
    hour: p.hour,
  };
};

/* --------------------------------------------------------- typing speed */
export const TYPING_PASSAGES = [
  'The quick brown fox jumps over the lazy dog while the sun sets slowly behind the quiet hills and the evening air grows cool.',
  'Good typing is not about speed alone. It is about rhythm, accuracy and keeping your eyes on the words instead of the keys.',
  'A small habit practised every day will beat a big effort made once. Ten minutes of careful typing each morning adds up quickly.',
  'Search engines reward pages that answer a question clearly, load fast and are written for people first, so write for the reader.',
  'When the train finally pulled into the station, the platform filled with travellers carrying bags, coffee cups and tired smiles.',
  'Learning to touch type means placing each finger on its home row and letting your hands remember where every letter lives.',
];

/** WPM uses the standard five characters per word. */
export const typingStats = (target, typed, seconds) => {
  let correct = 0;
  for (let i = 0; i < typed.length; i += 1) if (typed[i] === target[i]) correct += 1;
  const minutes = seconds > 0 ? seconds / 60 : 0;
  const wpm = minutes ? correct / 5 / minutes : 0;
  const raw = minutes ? typed.length / 5 / minutes : 0;
  const accuracy = typed.length ? (correct / typed.length) * 100 : 100;
  return { wpm, raw, accuracy, correct, errors: typed.length - correct, typed: typed.length };
};

export const typingBand = (wpm) => {
  if (wpm >= 100) return 'Elite: top 1% of typists';
  if (wpm >= 70) return 'Fast: well above average';
  if (wpm >= 50) return 'Good: faster than most office workers';
  if (wpm >= 38) return 'Average: the typical adult speed';
  if (wpm >= 20) return 'Beginner: keep practising';
  return 'Just starting out';
};

/* ----------------------------------------------------------- click speed */
export const cps = (clicks, seconds) => (seconds > 0 ? clicks / seconds : 0);

export const cpsBand = (value) => {
  if (value >= 12) return 'Exceptional: butterfly or drag clicking territory';
  if (value >= 9) return 'Very fast: a competitive gamer';
  if (value >= 7) return 'Fast: above the usual 6 to 7 range';
  if (value >= 5) return 'Average: most people land here';
  if (value >= 3) return 'Slow: warm up and try again';
  return 'Very slow';
};

/* --------------------------------------------------------- reaction time */
export const reactionBand = (ms) => {
  if (ms < 150) return 'Suspiciously quick: possibly anticipating';
  if (ms < 200) return 'Excellent: top-tier reflexes';
  if (ms < 250) return 'Great: faster than the typical person';
  if (ms < 300) return 'Average: normal for adults';
  if (ms < 400) return 'A little slow: tiredness and screens add lag';
  return 'Slow: try again when rested';
};

export const average = (list) => (list.length ? list.reduce((s, v) => s + v, 0) / list.length : null);

/* ------------------------------------------------------- number to words */
const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const SCALES = ['', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 'quintillion', 'sextillion', 'septillion'];

const underThousand = (n) => {
  const parts = [];
  const h = Math.floor(n / 100);
  const rest = n % 100;
  if (h) parts.push(`${ONES[h]} hundred`);
  if (rest) {
    if (rest < 20) parts.push(ONES[rest]);
    else parts.push(TENS[Math.floor(rest / 10)] + (rest % 10 ? `-${ONES[rest % 10]}` : ''));
  }
  return parts.join(' and ');
};

/** Whole numbers only, up to 10^27 - 1. Accepts a digit string so nothing is lost to float rounding. */
export const integerToWords = (digits, { british = false } = {}) => {
  if (!/^\d+$/.test(digits)) return null;
  const s = digits.replace(/^0+(?=\d)/, '');
  if (s.length > 27) return null;
  if (s === '0') return 'zero';
  const groups = [];
  for (let end = s.length; end > 0; end -= 3) groups.unshift(Number(s.slice(Math.max(0, end - 3), end)));
  const words = [];
  groups.forEach((g, i) => {
    if (!g) return;
    const scale = SCALES[groups.length - 1 - i];
    words.push(underThousand(g) + (scale ? ` ${scale}` : ''));
  });
  let out = words.join(' ');
  // American style drops the "and" inside hundreds; British keeps it.
  if (!british) out = out.replace(/ hundred and /g, ' hundred ');
  return out;
};

const ORDINAL_END = { one: 'first', two: 'second', three: 'third', five: 'fifth', eight: 'eighth', nine: 'ninth', twelve: 'twelfth' };
export const toOrdinalWords = (cardinal) => {
  const m = cardinal.match(/^(.*?)([a-z]+)$/);
  if (!m) return cardinal;
  const [, head, last] = m;
  if (ORDINAL_END[last]) return head + ORDINAL_END[last];
  if (last.endsWith('y')) return `${head}${last.slice(0, -1)}ieth`;
  return `${head}${last}th`;
};

/** value is a decimal string like "1234.56" or "-7". Returns several renderings. */
export const numberToWords = (input, { british = false } = {}) => {
  const trimmed = String(input).trim().replace(/,/g, '');
  const m = trimmed.match(/^(-)?(\d+)(?:\.(\d+))?$/);
  if (!m) return null;
  const [, neg, whole, frac] = m;
  const intWords = integerToWords(whole, { british });
  if (intWords === null) return null;
  const sign = neg && /[1-9]/.test(whole + (frac || '')) ? 'minus ' : '';
  const cardinal = frac
    ? `${sign}${intWords} point ${[...frac].map((d) => ONES[Number(d)]).join(' ')}`
    : `${sign}${intWords}`;
  const ordinal = !frac && !neg ? toOrdinalWords(intWords) : null;
  const cents = (frac || '').padEnd(2, '0').slice(0, 2);
  const cheque = `${sign}${intWords.charAt(0).toUpperCase()}${intWords.slice(1)} and ${cents}/100`;
  return { cardinal, ordinal, cheque };
};

/* --------------------------------------------------------------- GCF/LCM */
export const gcd = (a, b) => {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y) [x, y] = [y, x % y];
  return x;
};

export const parseIntegerList = (text) => {
  const tokens = String(text).split(/[\s,;]+/).filter(Boolean);
  if (!tokens.length || tokens.length > 10) return null;
  if (!tokens.every((t) => /^\d{1,15}$/.test(t))) return null;
  const values = tokens.map((t) => BigInt(t));
  return values.every((v) => v > 0n) ? values : null;
};

export const gcfLcm = (values) => {
  let g = values[0];
  let l = values[0];
  for (const v of values.slice(1)) {
    g = gcd(g, v);
    l = (l / gcd(l, v)) * v;
  }
  return { gcf: g, lcm: l };
};

/** Trial division — fast enough for the 15-digit inputs allowed above. */
export const primeFactors = (value) => {
  let n = Number(value);
  const out = [];
  for (let p = 2; p * p <= n; p += p === 2 ? 1 : 2) {
    while (n % p === 0) { out.push(p); n /= p; }
  }
  if (n > 1) out.push(n);
  return out;
};

export const factorString = (factors) => {
  if (!factors.length) return '1';
  const counts = new Map();
  factors.forEach((f) => counts.set(f, (counts.get(f) || 0) + 1));
  return [...counts].map(([p, c]) => (c > 1 ? `${p}^${c}` : String(p))).join(' × ');
};

/** The Euclidean algorithm shown line by line. */
export const euclidSteps = (a, b) => {
  let x = a >= b ? a : b;
  let y = a >= b ? b : a;
  const steps = [];
  while (y) {
    steps.push(`${x} = ${x / y} × ${y} + ${x % y}`);
    [x, y] = [y, x % y];
  }
  return steps;
};

/* ----------------------------------------------------------- week numbers */
const DAY = 86400000;
const utc = (y, m, d) => new Date(Date.UTC(y, m - 1, d));

/** ISO 8601: weeks start Monday, week 1 contains the year's first Thursday. */
export const isoWeek = (year, month, day) => {
  const date = utc(year, month, day);
  const dow = (date.getUTCDay() + 6) % 7; // Monday = 0
  const thursday = new Date(date.getTime() + (3 - dow) * DAY);
  const isoYear = thursday.getUTCFullYear();
  const jan1 = utc(isoYear, 1, 1);
  const week = Math.floor((thursday - jan1) / DAY / 7) + 1;
  return { year: isoYear, week, weekday: dow + 1 };
};

/** US convention: weeks start Sunday, week 1 is the week containing 1 January. */
export const usWeek = (year, month, day) => {
  const date = utc(year, month, day);
  const jan1 = utc(year, 1, 1);
  const offset = jan1.getUTCDay();
  const dayOfYear = Math.floor((date - jan1) / DAY);
  return { year, week: Math.floor((dayOfYear + offset) / 7) + 1 };
};

export const isoWeeksInYear = (year) => isoWeek(year, 12, 28).week;

/** Monday and Sunday of an ISO week. */
export const isoWeekRange = (year, week) => {
  const jan4 = utc(year, 1, 4);
  const dow = (jan4.getUTCDay() + 6) % 7;
  const monday = new Date(jan4.getTime() - dow * DAY + (week - 1) * 7 * DAY);
  return { start: monday, end: new Date(monday.getTime() + 6 * DAY) };
};

export const dayOfYear = (year, month, day) => Math.floor((utc(year, month, day) - utc(year, 1, 1)) / DAY) + 1;
export const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
export const isoDate = (d) => d.toISOString().slice(0, 10);

/* ----------------------------------------------------------- sleep cycles */
export const CYCLE = 90;
export const FALL_ASLEEP = 15;

export const toClock = (minutes) => {
  const m = ((minutes % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const h12 = h24 % 12 || 12;
  return `${h12}:${String(m % 60).padStart(2, '0')} ${h24 < 12 ? 'AM' : 'PM'}`;
};

/** Bedtimes that let you wake at `wakeMinutes` (minutes after midnight) at the end of a cycle. */
export const bedtimesFor = (wakeMinutes, fallAsleep = FALL_ASLEEP) => [6, 5, 4, 3].map((cycles) => ({
  cycles,
  hours: (cycles * CYCLE) / 60,
  clock: toClock(wakeMinutes - cycles * CYCLE - fallAsleep),
}));

/** Wake times if you fall asleep `fromMinutes` (minutes after midnight) now. */
export const wakeTimesFrom = (fromMinutes, fallAsleep = FALL_ASLEEP) => [3, 4, 5, 6].map((cycles) => ({
  cycles,
  hours: (cycles * CYCLE) / 60,
  clock: toClock(fromMinutes + fallAsleep + cycles * CYCLE),
}));

/* -------------------------------------------------------------- fancy text */
const A = 65;
const a = 97;
const range = (text, start, startLower, startDigit, exceptions = {}) => [...text].map((ch) => {
  if (exceptions[ch]) return exceptions[ch];
  const c = ch.codePointAt(0);
  if (c >= A && c <= A + 25) return String.fromCodePoint(start + c - A);
  if (c >= a && c <= a + 25) return String.fromCodePoint(startLower + c - a);
  if (startDigit && c >= 48 && c <= 57) return String.fromCodePoint(startDigit + c - 48);
  return ch;
}).join('');

const ch = (...codes) => Object.fromEntries(codes.map(([letter, code]) => [letter, String.fromCodePoint(code)]));
const SCRIPT_EX = ch(['B', 0x212C], ['E', 0x2130], ['F', 0x2131], ['H', 0x210B], ['I', 0x2110], ['L', 0x2112], ['M', 0x2133], ['R', 0x211B], ['e', 0x212F], ['g', 0x210A], ['o', 0x2134]);
const FRAKTUR_EX = ch(['C', 0x212D], ['H', 0x210C], ['I', 0x2111], ['R', 0x211C], ['Z', 0x2128]);
const DOUBLE_EX = ch(['C', 0x2102], ['H', 0x210D], ['N', 0x2115], ['P', 0x2119], ['Q', 0x211A], ['R', 0x211D], ['Z', 0x2124]);
const ITALIC_EX = ch(['h', 0x210E]);

const mapChars = (text, map) => [...text].map((c) => map[c] ?? map[c.toLowerCase()] ?? c).join('');
const SMALL_CAPS = { a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 'ꜱ', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ' };
const FLIP = { a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z', 1: 'Ɩ', 2: 'ᄅ', 3: 'Ɛ', 4: 'ㄣ', 5: 'ϛ', 6: '9', 7: 'ㄥ', 8: '8', 9: '6', 0: '0', '.': '˙', ',': '\'', '?': '¿', '!': '¡', '\'': ',', '"': '„', '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '&': '⅋', _: '‾' };

export const FANCY_STYLES = [
  { id: 'bold', name: 'Bold', fn: (t) => range(t, 0x1D400, 0x1D41A, 0x1D7CE) },
  { id: 'italic', name: 'Italic', fn: (t) => range(t, 0x1D434, 0x1D44E, 0, ITALIC_EX) },
  { id: 'bold-italic', name: 'Bold italic', fn: (t) => range(t, 0x1D468, 0x1D482, 0x1D7CE) },
  { id: 'script', name: 'Cursive script', fn: (t) => range(t, 0x1D49C, 0x1D4B6, 0, SCRIPT_EX) },
  { id: 'bold-script', name: 'Bold cursive', fn: (t) => range(t, 0x1D4D0, 0x1D4EA, 0x1D7CE) },
  { id: 'fraktur', name: 'Gothic (fraktur)', fn: (t) => range(t, 0x1D504, 0x1D51E, 0, FRAKTUR_EX) },
  { id: 'bold-fraktur', name: 'Bold gothic', fn: (t) => range(t, 0x1D56C, 0x1D586, 0x1D7CE) },
  { id: 'double-struck', name: 'Double-struck', fn: (t) => range(t, 0x1D538, 0x1D552, 0x1D7D8, DOUBLE_EX) },
  { id: 'sans', name: 'Sans-serif', fn: (t) => range(t, 0x1D5A0, 0x1D5BA, 0x1D7E2) },
  { id: 'sans-bold', name: 'Sans bold', fn: (t) => range(t, 0x1D5D4, 0x1D5EE, 0x1D7EC) },
  { id: 'sans-italic', name: 'Sans italic', fn: (t) => range(t, 0x1D608, 0x1D622, 0) },
  { id: 'monospace', name: 'Monospace', fn: (t) => range(t, 0x1D670, 0x1D68A, 0x1D7F6) },
  { id: 'circled', name: 'Bubble (circled)', fn: (t) => [...t].map((c) => {
    const code = c.codePointAt(0);
    if (code >= A && code <= A + 25) return String.fromCodePoint(0x24B6 + code - A);
    if (code >= a && code <= a + 25) return String.fromCodePoint(0x24D0 + code - a);
    if (code >= 49 && code <= 57) return String.fromCodePoint(0x2460 + code - 49);
    if (code === 48) return '⓪';
    return c;
  }).join('') },
  { id: 'squared', name: 'Squared', fn: (t) => [...t].map((c) => {
    const code = c.toUpperCase().codePointAt(0);
    return code >= A && code <= A + 25 && /[a-z]/i.test(c) ? String.fromCodePoint(0x1F130 + code - A) : c;
  }).join('') },
  { id: 'fullwidth', name: 'Fullwidth (vaporwave)', fn: (t) => [...t].map((c) => {
    const code = c.codePointAt(0);
    if (code === 32) return '　';
    return code >= 33 && code <= 126 ? String.fromCodePoint(code + 0xFEE0) : c;
  }).join('') },
  { id: 'small-caps', name: 'Small caps', fn: (t) => mapChars(t, SMALL_CAPS) },
  { id: 'upside-down', name: 'Upside down', fn: (t) => [...mapChars(t, FLIP)].reverse().join('') },
  { id: 'strike', name: 'Strikethrough', fn: (t) => [...t].map((c) => (c === ' ' ? c : `${c}̶`)).join('') },
  { id: 'underline', name: 'Underline', fn: (t) => [...t].map((c) => (c === ' ' ? c : `${c}̲`)).join('') },
];

export const fancyText = (text) => FANCY_STYLES.map((style) => ({ id: style.id, name: style.name, text: style.fn(text) }));
