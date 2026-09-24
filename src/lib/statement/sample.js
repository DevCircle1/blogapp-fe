/**
 * Builds a small, fictional two-page bank statement as real PDF bytes, so the
 * "try a sample" button exercises exactly the same parser a visitor's own file
 * would. No file is fetched and nothing here is a real account.
 */

const HELV_WIDTH = (ch) => {
  if (/[0-9]/.test(ch)) return 556;
  if (ch === ',' || ch === '.') return 278;
  if (ch === '-') return 333;
  return 556;
};
const textWidth = (text, size) => ([...text].reduce((sum, ch) => sum + HELV_WIDTH(ch), 0) * size) / 1000;
const esc = (text) => text.replace(/[\\()]/g, (c) => `\\${c}`);

const COLS = { date: 40, desc: 110, debit: 400, credit: 470, balance: 550 };

const ROWS = [
  ['03/01/2025', 'Salary - ACME PVT LTD', null, 185000.0, 435000.0],
  ['04/01/2025', 'ATM withdrawal Gulberg Lahore', 20000.0, null, 415000.0],
  ['06/01/2025', 'IBFT transfer to Ahmed Khan', 45000.0, null, 370000.0],
  ['06/01/2025', 'Utility bill payment - electricity|ref 4411 2231 8890', 18430.5, null, 351569.5],
  ['09/01/2025', 'POS purchase Al-Fatah Superstore', 7212.75, null, 344356.75],
  ['12/01/2025', 'Raast incoming - Sara Malik', null, 12000.0, 356356.75],
  ['15/01/2025', 'Mobile top-up', 1500.0, null, 354856.75],
  ['18/01/2025', 'Online purchase - daraz.pk', 9999.0, null, 344857.75],
  ['21/01/2025', 'Profit credit', null, 2814.2, 347671.95],
  ['25/01/2025', 'Cheque deposit 004417', null, 60000.0, 407671.95],
  ['27/01/2025', 'Rent - January', 75000.0, null, 332671.95],
  ['30/01/2025', 'Service charges', 250.0, null, 332421.95],
];
const OPENING_BALANCE = 250000.0;

const money = (n) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function pageContent(rows, { first }) {
  const ops = [];
  const text = (x, y, str, size = 9, font = 'F1') => ops.push(`BT /${font} ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${esc(str)}) Tj ET`);
  const right = (xr, y, str, size = 9) => text(xr - textWidth(str, size), y, str, size);
  let y = 800;
  if (first) {
    text(40, y, 'Sample Bank Limited', 16, 'F2'); y -= 20;
    text(40, y, 'Statement of Account - fictional data for demonstration only', 9); y -= 14;
    text(40, y, 'Statement period: 01/01/2025 to 31/01/2025', 9); y -= 30;
  } else {
    y -= 20;
  }
  text(COLS.date, y, 'Date', 9, 'F2');
  text(COLS.desc, y, 'Description', 9, 'F2');
  right(COLS.debit + 45, y, 'Debit', 9);
  right(COLS.credit + 45, y, 'Credit', 9);
  right(COLS.balance + 45, y, 'Balance', 9);
  y -= 16;
  if (first) {
    text(COLS.date, y, '01/01/2025');
    text(COLS.desc, y, 'Opening balance');
    right(COLS.balance + 45, y, money(OPENING_BALANCE));
    y -= 16;
  }
  rows.forEach(([date, desc, debit, credit, balance]) => {
    const [line1, line2] = desc.split('|');
    text(COLS.date, y, date);
    text(COLS.desc, y, line1);
    if (debit !== null) right(COLS.debit + 45, y, money(debit));
    if (credit !== null) right(COLS.credit + 45, y, money(credit));
    right(COLS.balance + 45, y, money(balance));
    if (line2) {
      y -= 11;
      text(COLS.desc, y, line2);
    }
    y -= 16;
  });
  text(40, 40, 'This is a computer generated statement.', 8);
  return ops.join('\n');
}

export function buildSamplePdf() {
  const streams = [pageContent(ROWS.slice(0, 6), { first: true }), pageContent(ROWS.slice(6), { first: false })];
  const objects = [];
  const add = (body) => { objects.push(body); return objects.length; };
  add('<< /Type /Catalog /Pages 2 0 R >>');
  add('<< /Type /Pages /Kids [5 0 R 7 0 R] /Count 2 >>');
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
  add('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>');
  streams.forEach((stream, index) => {
    const pageId = 5 + index * 2;
    add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> /Contents ${pageId + 1} 0 R >>`);
    add(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
  });
  let pdf = '%PDF-1.4\n';
  const offsets = [];
  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.forEach((o) => { pdf += `${String(o).padStart(10, '0')} 00000 n \n`; });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  const bytes = new Uint8Array(pdf.length);
  for (let i = 0; i < pdf.length; i += 1) bytes[i] = pdf.charCodeAt(i) & 0xff;
  return bytes;
}
