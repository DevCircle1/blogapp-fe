/**
 * Turns reviewed statement rows into a CSV string or an .xlsx file. Everything
 * is built in memory in the browser.
 *
 * `files` is [{ name, rows: [{ date, description, ref, debit, credit, balance }] }].
 * A "Source file" column is added only when more than one statement is exported.
 */

const layoutFor = (files) => ({
  hasRef: files.some((file) => file.rows.some((row) => row.ref)),
  multi: files.length > 1,
});

export const headersFor = (files) => {
  const { hasRef, multi } = layoutFor(files);
  return ['Date', 'Description', ...(hasRef ? ['Reference'] : []), 'Debit', 'Credit', 'Balance', ...(multi ? ['Source file'] : [])];
};

const fixed = (value) => (value == null ? '' : value.toFixed(2));

/** A cell that starts with = + - @ would be run as a formula by a spreadsheet opening the CSV. */
const safeText = (text) => (/^[=+\-@]/.test(text) && !/^[-+]?\d/.test(text) ? `'${text}` : text);

const csvCell = (value) => {
  const text = String(value ?? '');
  return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

export function toCsv(files) {
  const { hasRef, multi } = layoutFor(files);
  const lines = [headersFor(files).map(csvCell).join(',')];
  for (const file of files) {
    for (const row of file.rows) {
      lines.push([
        row.date,
        safeText(row.description),
        ...(hasRef ? [safeText(row.ref || '')] : []),
        fixed(row.debit),
        fixed(row.credit),
        fixed(row.balance),
        ...(multi ? [file.name] : []),
      ].map(csvCell).join(','));
    }
  }
  // BOM so Excel opens the file as UTF-8 rather than guessing a legacy code page.
  return `${String.fromCharCode(0xfeff)}${lines.join('\r\n')}\r\n`;
}

const asDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

export async function toXlsxBuffer(files) {
  const module = await import('exceljs');
  const ExcelJS = module.default || module;
  const { hasRef, multi } = layoutFor(files);
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Transactions', { views: [{ state: 'frozen', ySplit: 1 }] });

  const columns = [
    { header: 'Date', key: 'date', width: 13, style: { numFmt: 'yyyy-mm-dd' } },
    { header: 'Description', key: 'description', width: 52 },
    ...(hasRef ? [{ header: 'Reference', key: 'ref', width: 18 }] : []),
    { header: 'Debit', key: 'debit', width: 15, style: { numFmt: '#,##0.00' } },
    { header: 'Credit', key: 'credit', width: 15, style: { numFmt: '#,##0.00' } },
    { header: 'Balance', key: 'balance', width: 16, style: { numFmt: '#,##0.00' } },
    ...(multi ? [{ header: 'Source file', key: 'source', width: 28 }] : []),
  ];
  sheet.columns = columns;

  const header = sheet.getRow(1);
  header.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  header.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF3730A3' } };
  header.alignment = { vertical: 'middle' };
  ['Debit', 'Credit', 'Balance'].forEach((name) => {
    const index = columns.findIndex((c) => c.header === name) + 1;
    sheet.getColumn(index).alignment = { horizontal: 'right' };
    header.getCell(index).alignment = { horizontal: 'right', vertical: 'middle' };
  });

  for (const file of files) {
    for (const row of file.rows) {
      sheet.addRow({
        date: asDate(row.date),
        description: row.description,
        ref: row.ref || undefined,
        debit: row.debit ?? undefined,
        credit: row.credit ?? undefined,
        balance: row.balance ?? undefined,
        source: multi ? file.name : undefined,
      });
    }
  }
  sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: columns.length } };
  return workbook.xlsx.writeBuffer();
}
