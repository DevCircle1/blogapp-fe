export const VIEWER_PATH = '/tools/csv-viewer';
export const MERGE_PATH = '/tools/merge-csv-files';
export const SPLIT_PATH = '/tools/split-csv';
export const DEDUPE_PATH = '/tools/csv-deduplicate';
export const EXCEL_PATH = '/tools/csv-to-excel';
export const EXPLAINER_PATH = '/tools/excel-cant-open-large-csv';

/**
 * The largest file this toolkit has actually been run on, measured in a real
 * browser (see scripts/checks/csv-scale.md). Only claim what is tested: change
 * these together, and the "1GB+" in the title tags only when TESTED_GB >= 1.
 */
export const TESTED_GB = 1;
export const TESTED_LABEL = '1 GB';
const SIZE_TITLE = TESTED_GB >= 1 ? '1GB+, ' : '';

const META = (action) => `${action} CSV files over 500MB in your browser. No upload, no row limit, no sign-up. Handles files Excel and other online tools can’t.`;

const RELATED = [
  { to: '/tools/csv-to-json', label: 'CSV to JSON Converter', description: 'Convert smaller CSV files to JSON in one click.' },
  { to: '/tools/json-to-csv', label: 'JSON to CSV Converter', description: 'Flatten JSON back into a spreadsheet-ready CSV.' },
  { to: '/tools/json-studio', label: 'JSON Studio', description: 'Validate and format JSON exported from your data.' },
];

const SIBLINGS = [
  { to: VIEWER_PATH, label: 'Large CSV viewer' },
  { to: MERGE_PATH, label: 'Merge CSV files' },
  { to: SPLIT_PATH, label: 'Split CSV files' },
  { to: DEDUPE_PATH, label: 'Remove duplicates from CSV' },
  { to: EXCEL_PATH, label: 'CSV to Excel converter' },
  { to: EXPLAINER_PATH, label: 'Excel can’t open a large CSV' },
];

const PRIVACY_FAQ = {
  q: 'Is my file uploaded anywhere?',
  a: 'No. The file is read in pieces by code running in your browser and is never sent to a server. The site records only an anonymous counter with the operation and rough size buckets, such as “100–500 MB” and “1M–10M rows” — never file names, column names or any data.',
};

const SIZE_FAQ = {
  q: 'How large a CSV file can it handle?',
  a: `The largest file it has been run on is ${TESTED_LABEL}, opened and scrolled in a real browser. It streams the file instead of loading it, so memory grows with the number of rows (about 8 bytes each for the index), not with the size of the file. Very large row counts, roughly above a hundred million, may exhaust a browser tab’s memory.`,
};

const common = {
  category: 'Data · CSV',
  applicationCategory: 'DeveloperApplication',
  related: RELATED,
  siblingsHeading: 'CSV tools',
};

const MESSY = {
  heading: 'Messy files, handled',
  list: [
    'Quoted fields that contain commas, doubled quotes and line breaks are read correctly, so a note with a newline in it does not split into two rows.',
    'Comma, semicolon, tab and pipe delimiters are detected from the start of the file, including the semicolons European exports use.',
    'A byte-order mark, and Windows (CRLF) or Unix (LF) line endings, are handled.',
    'Rows with more or fewer fields than the header are counted and shown, not silently dropped.',
    'Files with no header row are supported with one checkbox.',
    'UTF-8 files are supported. A UTF-16 file needs saving as UTF-8 first, and the tool tells you so.',
  ],
};

const STREAMING = {
  heading: 'How it opens a huge file without loading it',
  paragraphs: [
    'A browser tab has a limited amount of memory, so anything that reads a whole large file into it — the way most online CSV tools work — fails or freezes past a few tens of megabytes. This toolkit never loads the file. It reads it in eight-megabyte blocks, scans each block for where every row begins, and keeps only that list of positions.',
    'When you scroll to a row, it reads just the bytes of the rows on screen and parses those. The table is virtualised, so only a screenful of rows exists at any moment, whether the file has a thousand rows or a hundred million.',
  ],
};

const viewer = {
  ...common,
  path: VIEWER_PATH,
  toolId: 'csv-viewer',
  slug: 'csv-viewer',
  title: `Open Large CSV Files Online — ${SIZE_TITLE}No Upload`,
  description: META('Open, filter, sort and convert'),
  h1: 'Large CSV Viewer',
  primaryKeyword: 'open large csv',
  crumb: 'Large CSV Viewer',
  appName: 'Large CSV Viewer',
  lead: `Open large CSV files online, right in your browser: scroll, filter, sort, remove duplicates, split or convert a file that Excel cannot open. It has been tested on files up to ${TESTED_LABEL}, streams them instead of loading them, and nothing is uploaded.`,
  sections: [
    { heading: 'How to open large CSV files online without uploading them', paragraphs: ['Drop the file onto the box. The viewer indexes it in one pass, showing progress and a cancel button, then displays the table. Everything after that — scrolling, jumping to a row, filtering, sorting — works on the file in place.'] },
    STREAMING,
    {
      heading: 'What you can do with the file',
      list: [
        'Scroll and jump to any row, with column types shown and column widths you can drag.',
        'Filter rows with conditions such as contains, equals, greater than, regex or is empty, and download the matching rows.',
        'Sort by any column with an external merge sort that does not need the file to fit in memory.',
        'Remove duplicate rows, split the file, or convert it to Excel or JSON Lines.',
      ],
    },
    MESSY,
    {
      heading: 'Honest limits',
      paragraphs: [`The largest file tested is ${TESTED_LABEL}. Duplicate detection compares 53-bit hashes of rows rather than storing them, so it is exact for practical purposes below a few million distinct rows and has a very small chance of a false match above that. Filtered, sorted and deduplicated results are written to a new file you can download or open again in the viewer.`],
    },
  ],
  steps: ['Drop your CSV file onto the box.', 'Wait for the index to finish — the row count appears in the status bar.', 'Scroll, jump to a row, or use the tools below the table to filter, sort or dedupe.', 'Download the result, or open it again in the viewer.'],
  faqs: [
    { q: 'How do I open a CSV file that is too big for Excel?', a: 'Open it here. The file is read in pieces instead of loaded whole, so its size does not matter to the page. You can then filter it down to what you need and download that as a smaller file, or split it into parts Excel can open.' },
    SIZE_FAQ,
    PRIVACY_FAQ,
    { q: 'Why is the first row treated as a header?', a: 'Most CSV files start with column names, so it is assumed by default when that row contains no numbers. Untick “First row is a header” if yours has none.' },
    { q: 'Can I edit the data?', a: 'Not in place. This is a viewer and a set of file operations: filter, sort, dedupe, split, merge and convert each produce a new file and leave the original untouched.' },
  ],
  siblings: SIBLINGS.filter((s) => s.to !== VIEWER_PATH),
  disclaimer: `Tested on files up to ${TESTED_LABEL}. Results depend on your browser and available memory.`,
};

const merge = {
  ...common,
  path: MERGE_PATH,
  toolId: 'merge-csv-files',
  slug: 'merge-csv-files',
  title: 'Merge CSV Files Online — Free, Any Size',
  description: META('Merge'),
  h1: 'Merge CSV Files',
  primaryKeyword: 'merge csv files',
  crumb: 'Merge CSV Files',
  appName: 'Merge CSV Files',
  lead: 'Merge CSV files online: combine any number of files, of any size, into one, in your browser. Files with identical columns are joined directly; files with different columns can be lined up by column name. Nothing is uploaded.',
  sections: [
    {
      heading: 'How to merge CSV files online',
      paragraphs: [
        'Add two or more CSV files, choose how to combine them, and merge. If every file has the same columns and delimiter, the rows are copied byte for byte and the header is written once, which is fast even for very large files. The files are streamed one after another, so the total size is limited by your disk, not by memory.',
        'If the columns differ, choose Union: the merged file gets every column that appears in any file, in the order they first appear, and cells for columns a file does not have are left blank. Strict refuses to merge files whose headers differ, which is useful when a different header means something has gone wrong.',
      ],
    },
    {
      heading: 'Merge CSV files with different columns',
      list: [
        'Columns are matched by header name, not by position, so a file with the same columns in a different order still lines up.',
        'A column that exists in only one file appears in the merged file, blank for the rows from the others.',
        'Rows with more fields than their header have the extra values kept at the end of the row, and the count is reported.',
        'Files using different delimiters are combined into one file that uses the delimiter of the first.',
      ],
    },
    MESSY,
    { heading: 'Tips for a clean merge', paragraphs: ['Check that every file has a header row and that the column names are spelled the same way; “Email” and “email address” are different columns to a merge. If you have hundreds of files, add them all at once — the order they are listed is the order the rows appear.'] },
  ],
  steps: ['Drop two or more CSV files onto the box.', 'Choose Union or Strict.', 'Click Merge and wait for the progress bar.', 'Download the merged file.'],
  faqs: [
    { q: 'Can I merge CSV files without uploading them?', a: 'Yes. The files are read and combined in your browser; nothing leaves your device.' },
    { q: 'What if the files have different columns?', a: 'Use Union to combine them by column name, leaving blanks where a file lacks a column. Use Strict if you want the merge to stop when the headers do not match.' },
    { q: 'How many files can I merge?', a: 'As many as you like. They are streamed one at a time, so memory does not grow with the number or size of the files.' },
    SIZE_FAQ,
    PRIVACY_FAQ,
  ],
  siblings: SIBLINGS.filter((s) => s.to !== MERGE_PATH),
};

const split = {
  ...common,
  path: SPLIT_PATH,
  toolId: 'split-csv',
  slug: 'split-csv',
  title: 'Split CSV File Online — By Rows, Size or Column',
  description: META('Split'),
  h1: 'Split CSV Files',
  primaryKeyword: 'split csv file',
  crumb: 'Split CSV Files',
  appName: 'Split CSV Files',
  lead: 'Split CSV file online: divide a CSV file by number of rows, by file size or by the values in a column, and download the parts as one zip. It works on files too large for Excel and runs entirely in your browser.',
  sections: [
    {
      heading: 'How to split CSV files by rows, size or column',
      paragraphs: ['Drop the file, choose how to split it, and download a zip of the parts. The header row is repeated at the top of every part, so each one opens as a complete CSV on its own.'],
      list: [
        'By number of rows — for example 100,000 rows per file, so each part fits comfortably in Excel.',
        'By file size — for example 50 MB per part, useful for upload limits and email.',
        'By column value — one file per distinct value in a column, such as a country, a team or a year. Up to 500 distinct values.',
      ],
    },
    {
      heading: 'Split a large CSV so Excel can open it',
      paragraphs: ['Excel can hold at most 1,048,576 rows on a sheet, and it becomes slow well before that. Splitting a large CSV into parts of a few hundred thousand rows each gives you files Excel opens quickly, with the header on every one. For very large files, filtering to just the rows you need is often better than splitting; the viewer can do both.'],
    },
    STREAMING,
    MESSY,
  ],
  steps: ['Drop the CSV file onto the box.', 'Pick rows, size or column, and set the value.', 'Click Split file.', 'Download the zip of parts.'],
  faqs: [
    { q: 'Is the header repeated in every file?', a: 'Yes, if the first row is a header. Untick “First row is a header” if your file has none and the rows are split as they are.' },
    { q: 'Can I split by a column value?', a: 'Yes. Choose Column value and a column, and you get one file per distinct value, named after the value. If a column has more than 500 distinct values, choose another column or split by rows.' },
    { q: 'Are rows ever cut in half?', a: 'No. A row that contains line breaks inside quotes is kept whole, and every part boundary falls between rows.' },
    SIZE_FAQ,
    PRIVACY_FAQ,
  ],
  siblings: SIBLINGS.filter((s) => s.to !== SPLIT_PATH),
};

const dedupe = {
  ...common,
  path: DEDUPE_PATH,
  toolId: 'csv-deduplicate',
  slug: 'csv-deduplicate',
  title: 'Remove Duplicate Rows from CSV — Free Online',
  description: META('Remove duplicate rows from'),
  h1: 'Remove Duplicates from CSV',
  primaryKeyword: 'remove duplicate rows',
  crumb: 'Remove Duplicates from CSV',
  appName: 'Remove Duplicates from CSV',
  lead: 'Remove duplicate rows from a CSV file, comparing the whole row or just the columns you choose, and keep the first occurrence of each. It works on files too big for Excel, in your browser, with nothing uploaded.',
  sections: [
    {
      heading: 'How to remove duplicate rows from a CSV',
      paragraphs: [
        'Drop the file and choose what makes a row a duplicate: the whole row, or one or more columns. To find repeated customers by email address, select only the email column; to find fully identical rows, select nothing. The first row with each value is kept and later ones are dropped, and the result reports how many were removed.',
        'Removing duplicate rows in Excel is limited by its million-row ceiling and by memory. Here, rows are streamed and compared by a compact hash, so the rows themselves are never held in memory and the file can be far larger than Excel would open.',
      ],
    },
    {
      heading: 'Comparing by column',
      list: [
        'Select the columns that define a duplicate; the others are ignored in the comparison but kept in the output.',
        'Ignoring leading and trailing spaces catches “a@example.com” and “a@example.com ” as the same.',
        'Comparison is exact and case-sensitive, so “Ali” and “ali” are different; normalise case first if you want them treated as the same.',
        'The header row is never treated as a duplicate.',
      ],
    },
    {
      heading: 'How exact is it?',
      paragraphs: ['Rows are compared by a 53-bit hash rather than stored, which keeps memory flat. The chance that two different rows are mistaken for duplicates is roughly n squared divided by 2 to the 54th power, which is negligible below a few million distinct rows and still very small at ten million. For tax or legal data, spot-check the removal count against a second method.'],
    },
    MESSY,
  ],
  steps: ['Drop the CSV file onto the box.', 'Choose the columns that define a duplicate, or leave none selected for the whole row.', 'Click Remove duplicate rows.', 'Download the deduplicated file.'],
  faqs: [
    { q: 'Which duplicate is kept?', a: 'The first one in the file. Later rows with the same key are removed.' },
    { q: 'Can I remove duplicates based on one column?', a: 'Yes. Select that column, and rows are compared on it alone. Everything else in the row is kept for the first occurrence.' },
    { q: 'Is the comparison case-sensitive?', a: 'Yes. Values must match exactly, apart from optional trimming of leading and trailing spaces when comparing by column.' },
    SIZE_FAQ,
    PRIVACY_FAQ,
  ],
  siblings: SIBLINGS.filter((s) => s.to !== DEDUPE_PATH),
};

const excel = {
  ...common,
  path: EXCEL_PATH,
  toolId: 'csv-to-excel',
  slug: 'csv-to-excel',
  title: 'CSV to Excel Converter — Large Files Supported',
  description: META('Convert'),
  h1: 'CSV to Excel Converter',
  primaryKeyword: 'csv to excel',
  crumb: 'CSV to Excel Converter',
  appName: 'CSV to Excel Converter',
  lead: 'This CSV to Excel converter turns a CSV file into a real .xlsx workbook in your browser, including files with millions of rows: data past Excel’s row limit continues on further sheets instead of being cut off. Nothing is uploaded.',
  sections: [
    {
      heading: 'How to convert CSV to Excel',
      paragraphs: ['Drop the CSV, look at the preview to check the columns are right, and click Convert to Excel. The workbook is written as the file is read, so large files do not need to fit in memory. The header row becomes a bold first row.'],
    },
    {
      heading: 'The Excel row limit, and what this converter does about it',
      paragraphs: ['A sheet in Excel holds at most 1,048,576 rows and 16,384 columns. Opening a longer CSV in Excel silently drops everything past that limit. This converter never drops rows: when a file is longer, it writes the remainder onto Sheet2, Sheet3 and so on, repeating the header on each. A workbook that large will still be slow to open, so consider filtering or splitting the file first.'],
    },
    {
      heading: 'What is preserved',
      list: [
        'Numbers become numeric cells, so they can be summed and sorted.',
        'Values with leading zeros, such as postcodes and IDs, stay text, so 00123 is not turned into 123.',
        'Numbers of more than 15 digits stay text, because Excel would round them.',
        'Dates stay as text exactly as they appear, so Excel does not reinterpret 03/04 as March or April for you.',
        'Cells over Excel’s 32,767-character limit are cut to that length and counted in the result.',
      ],
    },
    MESSY,
  ],
  steps: ['Drop the CSV file onto the box.', 'Check the preview and the row count.', 'Click Convert to Excel (.xlsx).', 'Download the workbook.'],
  faqs: [
    { q: 'Can I convert a CSV with more than a million rows to Excel?', a: 'Yes. The rows past 1,048,576 are written to additional sheets in the same workbook. Excel will be slow with a workbook that large, so filtering or splitting first is often better.' },
    { q: 'Will leading zeros be kept?', a: 'Yes. Values like 00123 are written as text, not numbers, so they are not changed.' },
    { q: 'Why not just open the CSV in Excel?', a: 'Excel drops rows beyond its limit, converts values it thinks are dates or numbers, and can mangle long numbers and leading zeros. Converting first gives you the data as it is in the file.' },
    SIZE_FAQ,
    PRIVACY_FAQ,
  ],
  siblings: SIBLINGS.filter((s) => s.to !== EXCEL_PATH),
};

const explainer = {
  ...common,
  path: EXPLAINER_PATH,
  toolId: 'excel-cant-open-large-csv',
  slug: 'excel-cant-open-large-csv',
  title: 'Excel Can’t Open Your CSV? Here’s the Fix',
  description: 'Excel cannot open a large CSV file, or drops rows past 1,048,576. Why the limit exists and four ways to fix it, including opening it free in your browser.',
  h1: 'Excel Can’t Open Large CSV Files — What to Do',
  primaryKeyword: 'excel cannot open large csv',
  crumb: 'Excel can’t open large CSV',
  category: 'Guide · CSV',
  appName: 'Excel Can’t Open Large CSV Files',
  lead: 'If Excel cannot open your large CSV, or opens it and quietly shows fewer rows than the file holds, you have hit its row limit. Here is why Excel cannot open large CSV files, what actually happens to your data, and four ways to work with the file anyway.',
  sections: [
    {
      heading: 'Why Excel cannot open large CSV files',
      paragraphs: [
        'An Excel worksheet has a hard limit of 1,048,576 rows and 16,384 columns. That comes from how the file format numbers rows, and it has not changed since Excel 2007. A CSV file has no such limit, so a large export from a database, an analytics tool or a bank can easily hold more rows than a sheet can.',
        'Long before that limit, Excel may struggle: it loads the whole file into memory, so a file of a few hundred megabytes can freeze it or make it run out of memory, even when it has fewer than a million rows.',
      ],
    },
    {
      heading: 'What actually happens to your data',
      paragraphs: ['When a CSV has more rows than fit, Excel loads the first 1,048,576 and shows a message that the data set is too large for the Excel grid. The rest is simply not loaded, and if you then save the workbook, the missing rows are gone from that copy. The original CSV is untouched, but it is easy to save over it by accident.', 'Excel also changes values on the way in: it turns numbers with leading zeros into plain numbers, reads text that looks like a date as a date, and rounds numbers of more than 15 digits.'],
    },
    {
      heading: 'Four ways to fix it',
      list: [
        'Open it in the large CSV viewer, which reads the file in pieces and needs no Excel at all. You can scroll it, filter it and download just the rows you need.',
        'Filter or split the file into smaller ones — for example 500,000 rows each — and open the parts in Excel.',
        'Use Excel’s own Power Query: Data, then Get Data from Text/CSV, then Load To with “Only Create Connection” or “Add this data to the Data Model”, which can hold more rows than a sheet.',
        'Use a tool built for large data, such as a database or a scripting language, if you need to analyse the whole file.',
      ],
    },
    { heading: 'Open your large CSV file now', paragraphs: ['The quickest fix is to open the file in your browser with the large CSV viewer, which is free, reads files in pieces so their size does not matter, and never uploads them. From there you can filter the rows you need, remove duplicates, split the file or convert it to Excel across several sheets.'] },
  ],
  steps: ['Open your file in the large CSV viewer.', 'Filter or split it down to the rows you need.', 'Download the result and open that in Excel.'],
  faqs: [
    { q: 'What is the maximum number of rows in Excel?', a: 'A worksheet holds 1,048,576 rows and 16,384 columns. Data past that is not loaded when you open a CSV.' },
    { q: 'Why does Excel say my file is not loaded completely?', a: 'Because the CSV has more rows than a worksheet can hold. Excel loaded the first 1,048,576 and stopped. Saving the workbook would lose the rest, so do not overwrite your original.' },
    { q: 'Can Google Sheets open a bigger CSV?', a: 'Google Sheets has its own limit of 10 million cells in a spreadsheet, so a wide file reaches it with far fewer than a million rows.' },
    { q: 'How do I open a CSV with millions of rows?', a: 'Use a tool that reads the file in pieces, like the large CSV viewer, or load it through Power Query into the Excel data model. Do not try to open it as a normal worksheet.' },
    PRIVACY_FAQ,
  ],
  related: [{ to: VIEWER_PATH, label: 'Large CSV Viewer', description: 'Open the file in your browser, whatever its size.' }, { to: SPLIT_PATH, label: 'Split CSV Files', description: 'Cut it into parts Excel can open.' }, { to: EXCEL_PATH, label: 'CSV to Excel Converter', description: 'Convert to .xlsx across several sheets.' }],
  siblings: SIBLINGS.filter((s) => s.to !== EXPLAINER_PATH),
};

export const CSV_PAGES = [viewer, merge, split, dedupe, excel, explainer];
export const CSV_MODE_BY_PATH = {
  [VIEWER_PATH]: 'viewer', [MERGE_PATH]: 'merge', [SPLIT_PATH]: 'split', [DEDUPE_PATH]: 'dedupe', [EXCEL_PATH]: 'excel',
};
