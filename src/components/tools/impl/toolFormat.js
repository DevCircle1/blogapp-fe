/**
 * Formatting and parsing helpers shared by the tool implementations.
 * Kept out of uiKit.jsx so that file exports components only.
 */
export const cx = (...parts) => parts.filter(Boolean).join(' ');

/**
 * Locale used by every number, currency, and date formatter below. Undefined
 * means "the visitor's browser locale", which is what the English pages have
 * always used; the language versions set it through I18nProvider.
 */
let formatLocale;
export const setFormatLocale = (locale) => { formatLocale = locale; };
export const getFormatLocale = () => formatLocale;

export const money = (value, currency = 'USD') => (
  Number.isFinite(value)
    ? value.toLocaleString(formatLocale, { style: 'currency', currency, maximumFractionDigits: 2 })
    : '—'
);

export const num = (value, digits = 2) => (
  Number.isFinite(value) ? value.toLocaleString(formatLocale, { maximumFractionDigits: digits }) : '—'
);

/** Tolerates thousands separators, so a pasted "1,250" is read as 1250. */
export const toNumber = (value, fallback = 0) => {
  const parsed = Number(String(value).replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : fallback;
};
