/**
 * Bank profiles. A profile does not replace the layout engine — columns are
 * always located from the statement's own header row — it only supplies the
 * things a header cannot say: how to recognise the bank, whether all-numeric
 * dates are day-first, the sign convention of a single Amount column, and the
 * copy shown on that bank's page.
 *
 * The `notes` are the unique content of each bank page, so they are written to
 * describe what the parser does with that bank's statements, and to say plainly
 * that layouts change. Every bank page also tells the visitor to trust the
 * "balance reconciles" check, not the profile.
 */

export const GENERIC_PROFILE = {
  slug: 'generic',
  name: 'Generic statement',
  country: '',
  dateOrder: 'dmy',
  // For a single signed Amount column: negative = money out (the usual bank convention).
  amountSign: 'outflow-negative',
  detect: () => false,
  skipPatterns: [],
};

export const BANKS = [
  {
    slug: 'hbl',
    name: 'HBL',
    fullName: 'Habib Bank Limited',
    country: 'Pakistan',
    currency: 'PKR',
    detect: (text) => /habib\s+bank\s+(limited|ltd)|\bHBL\b/i.test(text),
    dateOrder: 'dmy',
    amountSign: 'outflow-negative',
    skipPatterns: [/^system\s+generated/i, /does\s+not\s+require\s+(any\s+)?signature/i],
    dateFormat: 'DD/MM/YYYY or DD-MMM-YYYY',
    columnsDetected: 'date, description, reference, debit, credit, balance',
    metaDescription: 'Convert HBL PDF statements to Excel or CSV in your browser. Nothing is uploaded — your statement never leaves your device. Free, no sign-up.',
    notes: [
      'HBL account statements downloaded from internet banking or the mobile app are text-based PDFs, which is what makes them convertible without OCR. The table normally runs Date, Description or narration, a cheque or reference number, Debit, Credit and a running Balance, and the parser finds each of those columns from the header row rather than from fixed positions, so a slightly different export from a different HBL channel still lines up.',
      'Pakistani statements print dates day-first, so a value such as 03/04/2025 is read as 3 April, not 4 March. The parser only overrides that default when the statement itself proves otherwise — for example a date like 25/04/2025, where 25 can only be a day. Amounts are read with thousands separators and two decimals, and a value printed with a trailing DR or CR marker is assigned to the right side.',
      'The usual trouble spots are long narrations that wrap onto a second line and the header block that repeats at the top of every page. Wrapped narrations are merged back into the transaction above them, and repeated headers and page footers are dropped instead of appearing as bogus rows. If your HBL statement shows an opening balance line, it is used to check the very first transaction as well.',
      'Layouts differ between account types and change when the bank updates its statement template, so do not treat this profile as a guarantee. The green "balance reconciles" badge is the real test: it re-adds every credit and subtracts every debit and confirms each running balance. If a row is flagged, correct it in the table before you download.',
    ],
  },
  {
    slug: 'meezan-bank',
    name: 'Meezan Bank',
    fullName: 'Meezan Bank Limited',
    country: 'Pakistan',
    currency: 'PKR',
    detect: (text) => /meezan\s+bank/i.test(text),
    dateOrder: 'dmy',
    amountSign: 'outflow-negative',
    skipPatterns: [/^system\s+generated/i],
    dateFormat: 'DD/MM/YYYY or DD-MMM-YYYY',
    columnsDetected: 'date, description, reference, debit, credit, balance',
    metaDescription: 'Convert Meezan Bank PDF statements to Excel or CSV in your browser. Nothing is uploaded — your statement never leaves your device. Free, no sign-up.',
    notes: [
      'Meezan Bank statements are issued as text-based PDFs, so the transaction table can be read straight from the file with no image recognition. Expect a header row with a date, a transaction description, a reference or cheque number, debit and credit columns and a running balance. The converter looks for those header words and builds its columns from where they sit on the page, which also copes with a wider description column on business accounts.',
      'As with other Pakistani banks the date is day-first, so 05/06/2025 is 5 June. Rupee amounts use comma thousands separators and two decimals; a value can also appear with a DR or CR suffix, which the parser converts into the debit or credit column so that your spreadsheet only ever holds positive numbers in each.',
      'Islamic-banking narrations can be long — profit payments, Raast and inter-bank transfers and card purchases often carry a reference string that wraps to a second or third line. The parser attaches any wrapped line that has no date and no amount to the transaction above it, and discards page numbers, "continued" markers and generated-statement footers.',
      'A profile is only a starting point: statement templates differ between current, savings and business accounts and are revised from time to time. Check the reconcile badge before you rely on the file. If it reports rows that need review, the highlighted rows are editable in place and the badge recalculates as you fix them.',
    ],
  },
  {
    slug: 'chase',
    name: 'Chase',
    fullName: 'JPMorgan Chase Bank',
    country: 'United States',
    currency: 'USD',
    detect: (text) => /jpmorgan\s+chase|chase\.com|\bchase\s+(total\s+)?checking|\bchase\s+(savings|sapphire|freedom)/i.test(text),
    dateOrder: 'mdy',
    amountSign: 'outflow-negative',
    skipPatterns: [/^(this\s+page\s+intentionally|customer\s+service\s+information)/i, /^chase\.com/i],
    dateFormat: 'MM/DD (year taken from the statement period)',
    columnsDetected: 'date, description, amount (signed), balance',
    metaDescription: 'Convert Chase PDF statements to Excel or CSV in your browser. Nothing is uploaded — your statement never leaves your device. Free, no sign-up.',
    notes: [
      'Chase checking and savings statements list each transaction with a short MM/DD date, a description, a single signed Amount column and a running Balance, rather than separate debit and credit columns. The converter splits that one signed column into debit and credit for you: negative amounts and amounts in brackets become debits, positive amounts become credits, so the spreadsheet is ready for SUM formulas.',
      'Because the transaction lines carry no year, the year is taken from the statement period printed on the first page. When a statement crosses New Year, the year advances automatically when the month rolls from December back to January, so a 12/29 and a 01/02 transaction end up in the right years. If no period can be found the current year is used and you are warned.',
      'A Chase statement also contains sections that look like tables but are not transactions — the account summary, daily ending balances and the fee-avoidance panel. Rows that have no date in the date column are not treated as transactions; ones that carry an amount are listed as skipped so nothing disappears silently. Credit-card statements are different: they have no running balance, so the balance check cannot run and you should review the rows by eye.',
      'Statement layouts change, so treat this profile as a convenience and the balance check as the proof. Where a running balance is printed, every row is re-added from the one before it; any row that does not reconcile is highlighted and can be edited before you download the Excel or CSV file.',
    ],
  },
];

export const bankBySlug = (slug) => BANKS.find((bank) => bank.slug === slug);

export function detectBank(text) {
  return BANKS.find((bank) => bank.detect(text)) || null;
}
