import { BANKS } from '../../../../lib/statement/banks.js';

export const HUB_PATH = '/tools/bank-statement-converter';
const TOOL_ID = 'bank-statement-converter';

const RELATED = [
  { to: '/tools/csv-to-json', label: 'CSV to JSON Converter', description: 'Turn the CSV you just exported into JSON for scripts and APIs.' },
  { to: '/tools/json-to-csv', label: 'JSON to CSV Converter', description: 'Flatten JSON into a spreadsheet-friendly CSV.' },
  { to: '/tools/loan-calculator', label: 'Loan Calculator', description: 'Check a repayment against what your statement shows leaving the account.' },
];

const HUB_FAQS = [
  {
    q: 'Is my bank statement uploaded anywhere?',
    a: 'No. The PDF is opened and read inside your own browser, in a background thread, and the file is never sent to a server. The only network request the tool makes is an anonymous counter that records a number such as how many rows were converted — never a name, an amount or any text from the statement. You can confirm this in your browser’s network tab while converting.',
  },
  {
    q: 'Which banks does this bank statement converter support?',
    a: 'It works on any bank whose PDF statement is text-based and has a table with a header row, because columns are located from the header itself. Profiles for HBL, Meezan Bank and Chase add day-first or month-first date handling and sign conventions for those banks. If your bank is not listed, try it anyway and use the request form so it can be added.',
  },
  {
    q: 'Can it read a scanned statement or a photo of one?',
    a: 'Not at the moment. A scanned PDF is a picture of a page with no text inside it, so there is nothing to extract without optical character recognition, and OCR of financial figures is error-prone. The tool tells you when a file has no readable text. Downloading the statement again from online banking usually gives you a text-based PDF.',
  },
  {
    q: 'What does “balance reconciles” mean, and what if it says rows need review?',
    a: 'For every row with a printed balance, the tool checks that the previous balance plus credits minus debits equals it. If every row agrees, the extraction is internally consistent. If some do not, those rows are highlighted in red — usually a misplaced digit, a merged column or a wrapped line — and you can edit them in the table; the check recalculates as you type.',
  },
  {
    q: 'Can I convert a password-protected statement?',
    a: 'Yes. When a PDF is encrypted the tool asks for its password and unlocks it locally. Many banks protect statements with something like your date of birth or the last digits of your account number. The password is used only to open the file in your browser and is not stored or sent anywhere.',
  },
  {
    q: 'Is it really free?',
    a: 'Yes. There is no account, no page limit and no watermark. The site is funded by advertising. Because the work happens on your device, there is no per-page server cost to pass on to you.',
  },
];

const STEPS = [
  'Drop one or more PDF statements onto the box, or choose “Try a sample statement” to watch it work on a fictional one first.',
  'Wait a moment while each page is read. A progress bar shows how far along it is.',
  'Check the summary bar. A green “balance reconciles” badge means every running balance agrees with the transactions; a red count means that many rows need a look.',
  'Fix any highlighted row directly in the table — the check recalculates as you edit. Delete junk rows or flip debit and credit if a bank uses the opposite convention.',
  'Download the result as an Excel .xlsx file with a formatted header row, or as a CSV.',
];

const hubPage = () => ({
  path: HUB_PATH,
  toolId: TOOL_ID,
  slug: TOOL_ID,
  title: 'Bank Statement Converter — PDF to Excel, Free',
  description: 'Convert bank statement PDFs to Excel or CSV in your browser. Nothing is uploaded — your statement never leaves your device. Free, no sign-up.',
  h1: 'Bank Statement Converter: PDF to Excel',
  crumb: 'Bank Statement Converter',
  appName: 'Bank Statement PDF to Excel Converter',
  category: 'Finance · Converters',
  applicationCategory: 'FinanceApplication',
  lead: 'This bank statement converter turns a PDF statement into a clean Excel or CSV table of dates, descriptions, debits, credits and balances. It runs entirely in your browser, so the statement never leaves your device — and it re-adds every running balance to prove the extraction is right.',
  sections: [
    {
      heading: 'How this bank statement converter reads a PDF',
      paragraphs: [
        'A PDF does not contain a table. It contains pieces of text, each placed at an x and y position on the page, and the “table” you see is only the way those pieces line up. To rebuild it, the converter reads every piece of text with its coordinates, groups pieces that share a baseline into rows, and joins neighbours into cells wherever the horizontal gap is small.',
        'It then looks for the header row — the line that says Date, Description, Debit, Credit and Balance, or Paid in and Paid out, or a single Amount column — and uses the position of each header word to decide which column every later value belongs to. Amounts are matched to the nearest numeric column by their right edge, because figures are right-aligned, while text is matched by its left edge.',
        'The details that make real statements messy are handled explicitly: descriptions that wrap onto a second line are merged back into the transaction above, headers and page numbers repeated on every page are dropped, opening and closing balance lines are recognised rather than counted as transactions, and dates without a year borrow it from the statement period.',
      ],
    },
    {
      heading: 'Why the balance check matters more than the extraction',
      paragraphs: [
        'Almost any tool can produce a spreadsheet. What matters is whether the numbers in it are right, and a wrong figure in a tax return or a reconciliation is worse than a failed conversion. So the converter never asks you to take the output on trust: for every row that carries a running balance, it checks that the previous balance plus the credit minus the debit equals the printed balance.',
        'When every row agrees, you get a green “balance reconciles” badge. When one does not, the row is highlighted and you can correct it inline; the check recalculates immediately. Statements that list the newest transaction first are detected automatically, and statements that print a balance only at the end of each day are checked against the running total in between.',
      ],
    },
    {
      heading: 'A worked example',
      paragraphs: [
        'The “Try a sample statement” button builds a fictional two-page statement and runs it through exactly the same parser as your own file. It has twelve transactions, an opening balance of 250,000.00, a description that wraps onto two lines, and a header repeated on the second page. The converter returns twelve rows, folds the wrapped line into its transaction, ignores the repeated header and the page footer, and reports that all twelve balances reconcile.',
      ],
    },
    {
      heading: 'What it cannot do',
      list: [
        'Scanned or photographed statements. They contain no text to read, and the tool will say so rather than guess.',
        'Statements without a table header row can only be read by guessing the columns; the tool warns you when it has to.',
        'Credit card statements usually have no running balance, so there is nothing to reconcile against. The rows are extracted but you must review them by eye.',
        'Layouts change. A bank can redesign its statement at any time, which is why the balance check, not the bank name, is the thing to trust.',
      ],
    },
    {
      heading: 'Your statement stays on your device',
      paragraphs: [
        'Bank statements are among the most sensitive files most people own, and most online converters work by uploading them to a server you know nothing about. This one does the opposite. The PDF is read in a background thread in your browser, the rows are held in memory on your device, and the Excel and CSV files are generated locally. The site keeps only anonymous counts, such as the number of rows converted, and never any text from a statement.',
      ],
    },
  ],
  steps: STEPS,
  faqs: HUB_FAQS,
  related: RELATED,
  siblingsHeading: 'Bank-specific converters',
  siblings: BANKS.map((bank) => ({ to: `${HUB_PATH}/${bank.slug}`, label: `${bank.name} statement to Excel` })),
  disclaimer: 'Converted figures come from your own statement and are checked against its running balances, but you remain responsible for verifying them before using them in accounts, tax filings or legal documents.',
});

const bankPage = (bank) => ({
  path: `${HUB_PATH}/${bank.slug}`,
  toolId: TOOL_ID,
  slug: `${TOOL_ID}/${bank.slug}`,
  bankSlug: bank.slug,
  primaryKeyword: `${bank.name} statement to excel`,
  title: `${bank.name} Statement to Excel — Free PDF Converter`,
  description: bank.metaDescription,
  h1: `Convert ${bank.name} Statements to Excel`,
  crumb: `${bank.name} statement to Excel`,
  parent: { name: 'Bank Statement Converter', path: HUB_PATH },
  appName: `${bank.name} Statement to Excel Converter`,
  category: `Finance · ${bank.country}`,
  applicationCategory: 'FinanceApplication',
  lead: `Convert your ${bank.name} statement to Excel or CSV without uploading it. This ${bank.name} statement converter reads the PDF in your browser, rebuilds the transaction table and checks every running balance so you can trust the numbers.`,
  sections: [
    {
      heading: `How ${bank.name} statement to Excel conversion works`,
      paragraphs: bank.notes,
    },
    {
      heading: `${bank.name} statement layout the parser expects`,
      list: [
        `Bank: ${bank.fullName}, ${bank.country}`,
        `Date format: ${bank.dateFormat}`,
        `Columns detected: ${bank.columnsDetected}`,
        `Typical currency: ${bank.currency}`,
        'Checked against: the printed running balance, row by row',
      ],
    },
  ],
  steps: STEPS,
  faqs: [
    {
      q: `Is my ${bank.name} statement uploaded when I convert it?`,
      a: `No. The ${bank.name} PDF is read inside your browser and never sent to a server. Only an anonymous count, such as the number of rows converted, is recorded.`,
    },
    {
      q: `Does this work on every ${bank.name} statement?`,
      a: `It works on text-based ${bank.name} PDFs that contain a transaction table. Scanned copies have no text to read, and a redesigned statement can occasionally need a correction, which is why the tool shows a balance check and lets you edit any row.`,
    },
    ...HUB_FAQS.filter((item) => item.q.startsWith('What does')),
    HUB_FAQS.find((item) => item.q.startsWith('Can I convert a password')),
  ],
  related: [
    { to: HUB_PATH, label: 'Bank Statement Converter', description: 'Convert a statement from any bank to Excel or CSV.' },
    ...RELATED.slice(0, 2),
  ],
  siblingsHeading: 'Other bank converters',
  siblings: BANKS.filter((other) => other.slug !== bank.slug).map((other) => ({ to: `${HUB_PATH}/${other.slug}`, label: `${other.name} statement to Excel` })),
  disclaimer: 'Statement layouts are set by the bank and change without notice. Always confirm the “balance reconciles” badge and review flagged rows before relying on the converted figures.',
});

export const BANK_PAGES = [hubPage(), ...BANKS.map(bankPage)];
