/**
 * The quality signal for a parse: does the running balance reconcile?
 * For every row with a printed balance, previous balance + credit − debit must
 * equal it. Money is compared in whole cents to avoid float noise.
 */

const cents = (n) => Math.round((n ?? 0) * 100);
const magnitude = (row) => Math.abs(row.debit ?? 0) + Math.abs(row.credit ?? 0);

/**
 * Statements list oldest-first or newest-first. Scores both readings against
 * the printed balances and returns the one that agrees more often.
 */
export function detectOrder(rows) {
  let asc = 0;
  let desc = 0;
  for (let i = 1; i < rows.length; i += 1) {
    const a = rows[i - 1];
    const b = rows[i];
    if (a.balance == null || b.balance == null) continue;
    const delta = Math.abs(cents(b.balance) - cents(a.balance));
    if (delta === cents(magnitude(b))) asc += 1;
    if (delta === cents(magnitude(a))) desc += 1;
  }
  return desc > asc ? 'desc' : 'asc';
}

/**
 * → { order, status: ('ok' | 'bad' | 'unchecked')[], checked, bad, reconciles }
 * A row whose balance is missing accumulates into the running total, so
 * statements that print a balance only at day-end still get checked. After a
 * bad row the running total is resynchronised to the printed balance, so one
 * wrong number flags one row instead of every row after it.
 */
export function validateBalances(rows, { opening = null, order = null } = {}) {
  const resolved = order || detectOrder(rows);
  const indices = rows.map((_, i) => i);
  if (resolved === 'desc') indices.reverse();

  const status = new Array(rows.length).fill('unchecked');
  let running = opening == null ? null : cents(opening);
  let checked = 0;
  let bad = 0;

  for (const index of indices) {
    const row = rows[index];
    if (running !== null) running += cents(row.credit) - cents(row.debit);
    if (row.balance == null) continue;
    const printed = cents(row.balance);
    if (running === null) {
      running = printed;
      continue;
    }
    checked += 1;
    if (running === printed) {
      status[index] = 'ok';
    } else {
      status[index] = 'bad';
      bad += 1;
      running = printed;
    }
  }
  return { order: resolved, status, checked, bad, reconciles: checked > 0 && bad === 0 };
}
