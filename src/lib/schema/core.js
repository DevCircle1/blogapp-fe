/**
 * The schema markup engine: field helpers, formatting validators, JSON-LD
 * pruning and the validation pass that turns a type definition plus the values
 * a user entered into errors and warnings. Type definitions live in ./types/.
 */

/* ------------------------------------------------------------- field helpers */

const field = (type) => (key, label, options = {}) => ({ key, label, type, ...options });

export const text = field('text');
export const textarea = field('textarea');
export const url = field('url');
export const date = field('date');
export const datetime = field('datetime');
export const duration = field('duration');
export const number = field('number');
export const select = field('select');
export const checkbox = field('checkbox');
export const multiselect = field('multiselect');
export const currency = field('currency');
export const country = field('country');
export const phone = field('phone');
export const email = field('email');
/** An ordered list of plain values (URLs, ingredients…). */
export const list = field('list');
/** A repeatable group of sub-fields (FAQ entries, steps…). */
export const repeater = (key, label, fields, options = {}) => ({
  key, label, type: 'repeater', fields, ...options,
});
/** A fixed group of sub-fields that becomes a nested object. */
export const group = (key, label, fields, options = {}) => ({
  key, label, type: 'group', fields, ...options,
});

/* ----------------------------------------------------------------- pruning */

const isEmpty = (value) => value === '' || value === null || value === undefined
  || (Array.isArray(value) && value.length === 0)
  || (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0);

/** Drops empty strings, empty arrays and empty objects, recursively, so output has no noise. */
export function prune(value) {
  if (Array.isArray(value)) return value.map(prune).filter((item) => !isEmpty(item));
  if (value && typeof value === 'object') {
    const out = {};
    Object.entries(value).forEach(([key, item]) => {
      const cleaned = prune(item);
      // A nested object holding only @type (or a bare context) carries no information.
      const meaningful = cleaned && typeof cleaned === 'object' && !Array.isArray(cleaned) ? Object.keys(cleaned).some((k) => k !== '@type') : true;
      if (!isEmpty(cleaned) && meaningful) out[key] = cleaned;
    });
    return out;
  }
  return value;
}

export const numeric = (value) => (value === '' || value === undefined || value === null || Number.isNaN(Number(value)) ? undefined : Number(value));
export const asList = (value) => (Array.isArray(value) ? value.map((item) => String(item).trim()).filter(Boolean) : []);
/** One item stays a string, several become an array — the form schema.org and Google both accept. */
export const oneOrMany = (items) => (items.length === 1 ? items[0] : items);

/* --------------------------------------------------------------- validators */

const CURRENCIES = new Set('AED AUD BDT BRL CAD CHF CNY CZK DKK EGP EUR GBP HKD HUF IDR ILS INR JPY KES KRW LKR MXN MYR NGN NOK NPR NZD PHP PKR PLN QAR RON RUB SAR SEK SGD THB TRY TWD UAH USD VND ZAR'.split(' '));
export const CURRENCY_LIST = [...CURRENCIES];

const validDate = (y, m, d) => {
  const probe = new Date(Date.UTC(y, m - 1, d));
  return probe.getUTCFullYear() === y && probe.getUTCMonth() === m - 1 && probe.getUTCDate() === d;
};

export const FORMATS = {
  url: (v) => {
    try { const parsed = new URL(v); return (parsed.protocol === 'http:' || parsed.protocol === 'https:') && parsed.hostname.includes('.'); } catch { return false; }
  },
  date: (v) => { const m = v.match(/^(\d{4})-(\d{2})-(\d{2})$/); return Boolean(m) && validDate(+m[1], +m[2], +m[3]); },
  datetime: (v) => {
    const m = v.match(/^(\d{4})-(\d{2})-(\d{2})(?:T([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)?)?$/);
    return Boolean(m) && validDate(+m[1], +m[2], +m[3]);
  },
  duration: (v) => /^P(?!$)(\d+Y)?(\d+M)?(\d+W)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+(\.\d+)?S)?)?$/.test(v),
  number: (v) => v !== '' && !Number.isNaN(Number(v)),
  currency: (v) => CURRENCIES.has(v),
  country: (v) => /^[A-Z]{2}$/.test(v),
  phone: (v) => /^\+?[\d\s().-]{7,25}$/.test(v) && v.replace(/\D/g, '').length >= 7,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
};

export const FORMAT_HELP = {
  url: 'a full URL starting with https://',
  date: 'a date such as 2026-03-18',
  datetime: 'an ISO 8601 date and time such as 2026-03-18T19:30:00+05:00',
  duration: 'an ISO 8601 duration such as PT1H30M',
  number: 'a number',
  currency: 'a three-letter ISO 4217 code such as USD',
  country: 'a two-letter ISO 3166-1 country code such as PK',
  phone: 'a phone number with country code such as +92 42 1234567',
  email: 'an email address',
};

export const hasTimezone = (v) => /(Z|[+-]\d{2}:\d{2})$/.test(v);

/* ------------------------------------------------------------- validation */

const isBlank = (value) => value === undefined || value === null || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0);

function checkValue(def, value, path, out) {
  if (isBlank(value)) return;
  if (def.type === 'list') {
    asList(value).forEach((item, i) => {
      const format = def.itemType;
      if (format && FORMATS[format] && !FORMATS[format](item)) out.push({ level: 'error', path: `${path}[${i}]`, message: `${def.label} (item ${i + 1}) should be ${FORMAT_HELP[format]}.` });
    });
    return;
  }
  const format = ['url', 'date', 'datetime', 'duration', 'number', 'currency', 'country', 'phone', 'email'].includes(def.type) ? def.type : null;
  if (format && !FORMATS[format](String(value).trim())) {
    out.push({ level: 'error', path, message: `${def.label} should be ${FORMAT_HELP[format]}.` });
  } else if (def.type === 'datetime' && def.tzRecommended && !hasTimezone(String(value).trim())) {
    out.push({ level: 'warning', path, message: `${def.label} has no time zone offset. Google recommends one, for example +05:00 or Z.` });
  }
  if (def.maxLength && String(value).length > def.maxLength) out.push({ level: 'warning', path, message: `${def.label} is ${String(value).length} characters; keep it under ${def.maxLength} so it is not truncated.` });
  if (def.type === 'select' && def.options && !def.options.some((option) => (option.value ?? option) === value)) out.push({ level: 'error', path, message: `${def.label} is not one of the allowed values.` });
}

function walk(fields, values, prefix, out, context) {
  for (const def of fields) {
    const path = prefix ? `${prefix}.${def.key}` : def.key;
    const value = values?.[def.key];
    if (def.showIf && !def.showIf(context)) continue;
    if (def.type === 'group') {
      const sub = values?.[def.key] || {};
      const anyFilled = Object.values(sub).some((v) => !isBlank(v));
      if (def.required && !anyFilled) out.push({ level: 'error', path, message: `${def.label} is required.` });
      else if (def.recommended && !anyFilled) out.push({ level: 'warning', path, message: `${def.label} is recommended by Google.` });
      if (anyFilled || def.required) walk(def.fields, sub, path, out, context);
      continue;
    }
    if (def.type === 'repeater') {
      const items = Array.isArray(value) ? value.filter((item) => Object.values(item).some((v) => !isBlank(v))) : [];
      if (def.required && items.length < (def.min || 1)) out.push({ level: 'error', path, message: `${def.label}: add at least ${def.min || 1}.` });
      else if (def.recommended && items.length === 0) out.push({ level: 'warning', path, message: `${def.label} is recommended by Google.` });
      else if (def.recommendedMin && items.length < def.recommendedMin) out.push({ level: 'warning', path, message: `${def.label}: ${def.recommendedMin} or more is typical.` });
      items.forEach((item, i) => walk(def.fields, item, `${path}[${i}]`, out, context));
      continue;
    }
    if (def.required && isBlank(value)) { out.push({ level: 'error', path, message: `${def.label} is required.` }); continue; }
    if (def.recommended && isBlank(value)) { out.push({ level: 'warning', path, message: `${def.label} is recommended by Google.` }); continue; }
    checkValue(def, value, path, out);
  }
}

/**
 * → { errors, warnings, notes } for a type definition and entered values.
 * `status` carries the rich-result eligibility (bundled, or fresher from Supabase).
 */
export function validate(def, values, status) {
  const out = [];
  walk(def.fields, values, '', out, values);
  (def.check?.(values) || []).forEach((issue) => out.push(issue));
  if (status && status.richResult !== 'eligible') {
    out.push({
      level: 'warning',
      path: '',
      eligibility: true,
      message: status.richResult === 'deprecated'
        ? `Google no longer shows a rich result for ${def.name}. ${status.googleNotes}`
        : status.richResult === 'limited'
          ? `Google limits this rich result. ${status.googleNotes}`
          : status.googleNotes,
    });
  }
  return {
    errors: out.filter((issue) => issue.level === 'error'),
    warnings: out.filter((issue) => issue.level === 'warning'),
  };
}

/* ------------------------------------------------------------------ output */

export const toJson = (jsonLd) => JSON.stringify(jsonLd, null, 2);

export const toScriptBlock = (jsonLd) => `<script type="application/ld+json">\n${toJson(jsonLd).replace(/</g, '\\u003c')}\n</script>`;

export const toNextSnippet = (jsonLd, componentName = 'Page') => {
  const literal = toJson(jsonLd).replace(/</g, '\\u003c').split('\n').map((line, i) => (i === 0 ? line : `  ${line}`)).join('\n');
  return `// app/your-route/page.tsx
export default function ${componentName}() {
  const jsonLd = ${literal};

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\\\u003c') }}
      />
      {/* your page content */}
    </>
  );
}
`;
};

/** Tokenises pretty-printed JSON for colouring: [{ text, kind }] with kind key | string | number | literal | punct. */
export function highlight(json) {
  const tokens = [];
  const re = /("(?:\\.|[^"\\])*")(\s*:)?|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)|\b(true|false|null)\b|([{}[\],])|(\s+)/g;
  let last = 0;
  let match;
  while ((match = re.exec(json))) {
    if (match.index > last) tokens.push({ text: json.slice(last, match.index), kind: 'punct' });
    if (match[1]) { tokens.push({ text: match[1], kind: match[2] ? 'key' : 'string' }); if (match[2]) tokens.push({ text: match[2], kind: 'punct' }); }
    else if (match[3] !== undefined) tokens.push({ text: match[3], kind: 'number' });
    else if (match[4]) tokens.push({ text: match[4], kind: 'literal' });
    else tokens.push({ text: match[5] || match[6], kind: 'punct' });
    last = re.lastIndex;
  }
  if (last < json.length) tokens.push({ text: json.slice(last), kind: 'punct' });
  return tokens;
}
