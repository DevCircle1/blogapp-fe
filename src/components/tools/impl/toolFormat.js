/**
 * Formatting and parsing helpers shared by the tool implementations.
 * Kept out of uiKit.jsx so that file exports components only.
 */
export const cx = (...parts) => parts.filter(Boolean).join(' ');

/**
 * Number and currency formatters bound to an explicit locale. Components get
 * them from useFormat() (i18n.js), so the locale is a property of one render
 * rather than module state that one page could leave behind for the next.
 * An undefined locale means "the runtime's default".
 */
export const makeFormatters = (locale) => ({
  money: (value, currency = 'USD') => (
    Number.isFinite(value)
      ? value.toLocaleString(locale, { style: 'currency', currency, maximumFractionDigits: 2 })
      : '—'
  ),
  num: (value, digits = 2) => (
    Number.isFinite(value) ? value.toLocaleString(locale, { maximumFractionDigits: digits }) : '—'
  ),
});

/** Tolerates thousands separators, so a pasted "1,250" is read as 1250. */
export const toNumber = (value, fallback = 0) => {
  const parsed = Number(String(value).replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : fallback;
};
