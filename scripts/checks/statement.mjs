/** Node check of the statement parser against the generated sample PDF. Run: node scripts/checks/statement.mjs [out.pdf] */
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { writeFileSync } from 'node:fs';
import { extractPages } from '../../src/lib/statement/pdfText.js';
import { parseStatement } from '../../src/lib/statement/parse.js';
import { buildSamplePdf } from '../../src/lib/statement/sample.js';
import { validateBalances } from '../../src/lib/statement/validate.js';
import { parseAmount, parseDate } from '../../src/lib/statement/values.js';

const bytes = buildSamplePdf();
if (process.argv[2]) writeFileSync(process.argv[2], bytes);
const { pages, characters } = await extractPages(pdfjs, bytes);
const result = parseStatement(pages);
console.log('pages', pages.length, 'chars', characters, 'bank', result.bank, 'mode', result.mode, 'cols', result.columns.join(','));
console.log('opening', result.opening, 'order', result.order, 'dateOrder', result.dateOrder);
console.table(result.rows.map(({ date, description, debit, credit, balance }) => ({ date, description, debit, credit, balance })));
console.log('warnings', result.warnings, 'skipped', result.skipped);
const check = validateBalances(result.rows, { opening: result.opening });
console.log('reconciles', check.reconciles, 'checked', check.checked, 'bad', check.bad);

let failed = 0;
const eq = (name, a, b) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) { failed += 1; console.error('FAIL', name, a, '!=', b); }
};
eq('rows', result.rows.length, 12);
eq('reconciles', check.reconciles, true);
eq('wrapped', result.rows[3].description.includes('4411'), true);
eq('opening', result.opening, 250000);
eq('amount eu', parseAmount('1.234,50').value, 1234.5);
eq('amount paren', parseAmount('(1,234.50)'), { value: 1234.5, dir: 'dr' });
eq('amount dr', parseAmount('500.00 DR'), { value: 500, dir: 'dr' });
eq('amount trailing minus', parseAmount('75.10-'), { value: 75.1, dir: 'dr' });
eq('date dmy', parseDate('03/04/2025', { order: 'dmy' }), '2025-04-03');
eq('date mdy', parseDate('03/04/2025', { order: 'mdy' }), '2025-03-04');
eq('date mon', parseDate('15-Mar-24'), '2024-03-15');
eq('date noyear', parseDate('12/29', { order: 'mdy', yearHint: 2024 }), '2024-12-29');
// A corrupted balance is flagged on exactly one row.
const broken = result.rows.map((r) => ({ ...r }));
broken[5].debit += 10;
const bad = validateBalances(broken, { opening: result.opening });
eq('bad count', bad.bad, 1);
eq('bad row', bad.status[5], 'bad');

/* ---- synthetic layouts: items at coordinates, no PDF needed ---- */
const line = (y, cells) => cells.map(([x, str, w]) => ({ str, x, y, w: w ?? str.length * 5, h: 9 }));
const page = (number, lines) => ({ number, items: lines.flat() });

// Chase-style: yearless MM/DD, one signed Amount column, statement crosses New Year.
const chase = parseStatement([page(1, [
  line(60, [[40, 'JPMorgan Chase Bank, N.A.']]),
  line(80, [[40, 'December 15, 2024 through January 14, 2025']]),
  line(120, [[40, 'DATE'], [110, 'DESCRIPTION'], [420, 'AMOUNT', 30], [500, 'BALANCE', 35]]),
  line(140, [[40, '12/29'], [110, 'Payroll Deposit Acme Inc'], [400, '2,500.00', 40], [480, '3,700.00', 40]]),
  line(155, [[40, '12/31'], [110, 'Card Purchase Grocery'], [405, '-84.10', 35], [480, '3,615.90', 40]]),
  line(170, [[40, '01/02'], [110, 'Zelle Payment To Sam'], [405, '-200.00', 40], [480, '3,415.90', 40]]),
])]);
eq('chase bank', chase.bank, 'chase');
eq('chase rows', chase.rows.length, 3);
eq('chase years', chase.rows.map((r) => r.date), ['2024-12-29', '2024-12-31', '2025-01-02']);
eq('chase sides', chase.rows.map((r) => [r.debit, r.credit]), [[null, 2500], [84.1, null], [200, null]]);
eq('chase reconciles', validateBalances(chase.rows, { opening: chase.opening }).reconciles, true);

// Newest first, separate debit/credit columns, no opening balance.
const newest = parseStatement([page(1, [
  line(100, [[40, 'Date'], [110, 'Details'], [330, 'Money out', 45], [420, 'Money in', 40], [500, 'Balance', 35]]),
  line(120, [[40, '20 Mar 2025'], [110, 'Coffee shop'], [335, '4.50', 25], [505, '995.50', 30]]),
  line(135, [[40, '18 Mar 2025'], [110, 'Refund'], [425, '30.00', 30], [505, '1,000.00', 40]]),
  line(150, [[40, '15 Mar 2025'], [110, 'Rent'], [330, '30.00', 30], [505, '970.00', 35]]),
])]);
eq('newest order', newest.order, 'desc');
eq('newest rows', newest.rows.length, 3);
eq('newest reconciles', validateBalances(newest.rows, { opening: newest.opening }).reconciles, true);
console.log(failed ? `${failed} FAILED` : 'all checks passed');
process.exit(failed ? 1 : 0);
