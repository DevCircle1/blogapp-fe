/**
 * Pure calculation engines for the quick-win tools. No DOM, no React — they are
 * exercised in Node by scripts/checks/extra.mjs.
 */

/* ----------------------------------------------------------- grade */
/** rows: [{ grade, weight }] with grade 0-100 and weight in any positive unit. */
export const weightedGrade = (rows) => {
  const valid = rows.filter((r) => Number.isFinite(r.grade) && Number.isFinite(r.weight) && r.weight > 0);
  const weight = valid.reduce((s, r) => s + r.weight, 0);
  if (!weight) return { average: null, weight: 0 };
  return { average: valid.reduce((s, r) => s + r.grade * r.weight, 0) / weight, weight };
};

/** Grade needed on the final to finish on `target`, given the current grade over (100 - finalWeight)% of the course. */
export const neededOnFinal = (current, finalWeight, target) => {
  if (!(finalWeight > 0 && finalWeight <= 100)) return null;
  return (target - current * (1 - finalWeight / 100)) / (finalWeight / 100);
};

export const letterGrade = (pct) => {
  if (pct >= 93) return 'A';
  if (pct >= 90) return 'A−';
  if (pct >= 87) return 'B+';
  if (pct >= 83) return 'B';
  if (pct >= 80) return 'B−';
  if (pct >= 77) return 'C+';
  if (pct >= 73) return 'C';
  if (pct >= 70) return 'C−';
  if (pct >= 67) return 'D+';
  if (pct >= 63) return 'D';
  if (pct >= 60) return 'D−';
  return 'F';
};

/* ------------------------------------------------ credit card payoff */
/** Month-by-month payoff. Returns null when the payment never clears the interest. */
export const cardPayoff = (balance, apr, payment) => {
  const r = apr / 100 / 12;
  if (!(balance > 0) || !(payment > 0)) return null;
  if (payment <= balance * r) return null;
  let left = balance;
  let months = 0;
  let interest = 0;
  while (left > 0.005 && months < 1200) {
    const i = left * r;
    interest += i;
    left = left + i - Math.min(payment, left + i);
    months += 1;
  }
  return { months, interest, total: balance + interest };
};

/** Payment needed to clear the balance in exactly `months` months. */
export const paymentForMonths = (balance, apr, months) => {
  const r = apr / 100 / 12;
  if (!(balance > 0) || !(months > 0)) return null;
  if (r === 0) return balance / months;
  return (balance * r) / (1 - (1 + r) ** -months);
};

/* ------------------------------------------------------------ height */
export const cmToFeetInches = (cm) => {
  const totalIn = cm / 2.54;
  let feet = Math.floor(totalIn / 12);
  let inches = Math.round((totalIn - feet * 12) * 10) / 10;
  if (inches >= 12) { feet += 1; inches = 0; }
  return { feet, inches, totalIn };
};
export const feetInchesToCm = (feet, inches) => ((feet || 0) * 12 + (inches || 0)) * 2.54;

/* ------------------------------------------------------ text <-> binary */
const encoder = new TextEncoder();
const decoder = new TextDecoder('utf-8', { fatal: true });
const BASES = { binary: [2, 8], hex: [16, 2], decimal: [10, 3], octal: [8, 3] };

export const textToCodes = (text, base = 'binary', separator = ' ') => {
  const [radix, pad] = BASES[base];
  return [...encoder.encode(text)].map((b) => b.toString(radix).toUpperCase().padStart(pad, '0')).join(separator);
};

export const codesToText = (input, base = 'binary') => {
  const [radix] = BASES[base];
  const clean = input.trim();
  if (!clean) return { text: '' };
  let tokens = clean.split(/[\s,]+/).filter(Boolean);
  // Binary pasted with no spaces: split into bytes.
  if (base === 'binary' && tokens.length === 1 && tokens[0].length > 8) {
    if (tokens[0].length % 8) return { error: 'A run of binary digits must be a multiple of 8 long.' };
    tokens = tokens[0].match(/.{8}/g);
  }
  const digits = '0123456789abcdef'.slice(0, radix);
  const bytes = [];
  for (const token of tokens) {
    const body = token.replace(/^0x/i, '');
    const value = parseInt(body, radix);
    if (!new RegExp(`^[${digits}]+$`, 'i').test(body) || !Number.isInteger(value) || value > 255) {
      return { error: `"${token}" is not a valid ${base} byte (0–255).` };
    }
    bytes.push(value);
  }
  try { return { text: decoder.decode(Uint8Array.from(bytes)) }; } catch { return { error: 'Those bytes are not valid UTF-8 text.' }; }
};

/* ------------------------------------------------------------- morse */
export const MORSE = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---',
  K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-',
  U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
  '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', _: '..--.-', '"': '.-..-.', $: '...-..-', '@': '.--.-.',
};
const REVERSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

export const textToMorse = (text) => {
  const skipped = new Set();
  const words = text.toUpperCase().split(/\s+/).filter(Boolean).map((word) => [...word]
    .map((ch) => { if (MORSE[ch]) return MORSE[ch]; skipped.add(ch); return null; })
    .filter(Boolean).join(' '));
  return { morse: words.join(' / '), skipped: [...skipped] };
};

export const morseToText = (morse) => {
  const unknown = [];
  const text = morse.trim().split(/\s*(?:\/|\s{3,}|\|)\s*/).map((word) => word.split(/\s+/).filter(Boolean)
    .map((code) => {
      const normal = code.replace(/[·•]/g, '.').replace(/[–—−_]/g, '-');
      if (REVERSE[normal]) return REVERSE[normal];
      unknown.push(code);
      return '?';
    }).join('')).join(' ');
  return { text, unknown };
};

/* --------------------------------------------------------- timesheet */
const toMinutes = (hhmm) => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(hhmm || '');
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};
/** An end time earlier than the start means the shift ran past midnight. */
export const shiftMinutes = (start, end, breakMin = 0) => {
  const s = toMinutes(start);
  const e = toMinutes(end);
  if (s === null || e === null) return null;
  let span = e - s;
  if (span <= 0) span += 24 * 60;
  return Math.max(0, span - (Number(breakMin) || 0));
};
export const formatHours = (minutes) => `${Math.floor(minutes / 60)}h ${String(Math.round(minutes % 60)).padStart(2, '0')}m`;

/* -------------------------------------------------------------- pace */
export const parseDuration = (h, m, s) => (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0);
export const formatClock = (seconds) => {
  const t = Math.round(seconds);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  return h ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${m}:${String(s).padStart(2, '0')}`;
};
export const KM_PER_MILE = 1.609344;
export const RACES = [['1 mile', 1.609344], ['5K', 5], ['10K', 10], ['Half marathon', 21.0975], ['Marathon', 42.195]];

/* --------------------------------------------------------- ovulation */
const addDays = (d, n) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + n));
export const parseISODate = (iso) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
  return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : null;
};
export const ovulationCycle = (lmp, cycleLength = 28, lutealLength = 14) => {
  const ovulation = addDays(lmp, cycleLength - lutealLength);
  return {
    ovulation,
    fertileStart: addDays(ovulation, -5),
    fertileEnd: addDays(ovulation, 1),
    nextPeriod: addDays(lmp, cycleLength),
  };
};

/* ------------------------------------------------ scientific notation */
export const toScientific = (input, digits) => {
  const clean = String(input).trim().replace(/,/g, '').replace(/\s/g, '');
  if (!/^[-+]?(\d+\.?\d*|\.\d+)([eE][-+]?\d+)?$/.test(clean)) return null;
  const n = Number(clean);
  if (!Number.isFinite(n)) return null;
  if (n === 0) return { sign: '', mantissa: '0', exponent: 0, e: '0e+0', eng: '0e+0', n };
  const exp = digits === '' || digits === undefined ? n.toExponential() : n.toExponential(digits);
  const [mantissa, ex] = exp.split('e');
  const exponent = Number(ex);
  const engExp = Math.floor(exponent / 3) * 3;
  const engMant = Number(mantissa) * 10 ** (exponent - engExp);
  const sign = (v) => (v >= 0 ? '+' : '');
  return {
    sign: n < 0 ? '−' : '', mantissa, exponent, n,
    e: `${mantissa}e${sign(exponent)}${exponent}`,
    eng: `${Number(engMant.toPrecision(12))}e${sign(engExp)}${engExp}`,
  };
};
/** Expands e-notation into plain digits without floating-point noise. */
export const toPlain = (input) => {
  const m = /^([-+]?)(\d*)\.?(\d*)[eE]([-+]?\d+)$/.exec(String(input).trim());
  if (!m) return null;
  const [, sign, int, frac, ex] = m;
  const digits = int + frac;
  const point = int.length + Number(ex);
  let out;
  if (point <= 0) out = `0.${'0'.repeat(-point)}${digits}`;
  else if (point >= digits.length) out = digits + '0'.repeat(point - digits.length);
  else out = `${digits.slice(0, point)}.${digits.slice(point)}`;
  out = out.replace(/^0+(?=\d)/, '').replace(/(\.\d*?)0+$/, '$1').replace(/\.$/, '');
  return (sign === '-' ? '−' : '') + out;
};

/* -------------------------------------------------------------- area */
export const SQ_M_PER = { m: 1, cm: 0.0001, mm: 0.000001, km: 1e6, ft: 0.09290304, in: 0.00064516, yd: 0.83612736, mi: 2589988.110336 };
export const shapeArea = (shape, v) => {
  switch (shape) {
    case 'rectangle': return v.a * v.b;
    case 'triangle': return 0.5 * v.a * v.b;
    case 'circle': return Math.PI * v.a * v.a;
    case 'trapezoid': return ((v.a + v.b) / 2) * v.c;
    case 'ellipse': return Math.PI * v.a * v.b;
    case 'parallelogram': return v.a * v.b;
    default: return NaN;
  }
};
export const areaConversions = (sqm) => ({
  'square feet': sqm / 0.09290304,
  'square metres': sqm,
  'square yards': sqm / 0.83612736,
  'square inches': sqm / 0.00064516,
  'square centimetres': sqm / 0.0001,
  acres: sqm / 4046.8564224,
  hectares: sqm / 10000,
});
