/**
 * Formatting and parsing helpers shared by the tool implementations.
 * Kept out of uiKit.jsx so that file exports components only.
 */
export const cx = (...parts) => parts.filter(Boolean).join(' ');

export const money = (value, currency = 'USD') => (
  Number.isFinite(value)
    ? value.toLocaleString(undefined, { style: 'currency', currency, maximumFractionDigits: 2 })
    : '—'
);

export const num = (value, digits = 2) => (
  Number.isFinite(value) ? value.toLocaleString(undefined, { maximumFractionDigits: digits }) : '—'
);

/** Tolerates thousands separators, so a pasted "1,250" is read as 1250. */
export const toNumber = (value, fallback = 0) => {
  const parsed = Number(String(value).replace(/,/g, ''));
  return Number.isFinite(parsed) ? parsed : fallback;
};
