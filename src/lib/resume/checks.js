import { allRows, fullText } from './model.js';
import { findSections } from './sections.js';
import {
  DATE_RANGE_RE, EMAIL_RE, extractEntities, findPhone, yearsOfExperience,
} from './extract.js';

/**
 * Structural checks. Each one is a pure function of the document model that
 * returns an issue or null. Issues carry their own point penalty, so the score
 * is exactly the sum shown to the user: nothing is hidden in a weighting.
 *
 * issue = { code, severity: 'critical'|'warning'|'info', title, explanation, howToFix, penalty, location? }
 */

const issue = (code, severity, title, explanation, howToFix, penalty, location) => ({
  code, severity, title, explanation, howToFix, penalty, ...(location ? { location } : {}),
});

/* ------------------------------------------------------------ file type */

export const SUPPORTED_EXTENSIONS = ['pdf', 'docx'];

export function checkFileType(fileName) {
  const ext = (fileName.split('.').pop() || '').toLowerCase();
  if (SUPPORTED_EXTENSIONS.includes(ext)) return null;
  const known = {
    doc: 'Legacy .doc files are binary and are rejected or badly parsed by many systems.',
    pages: 'Apple Pages files cannot be read by applicant tracking systems.',
    jpg: 'An image of a resume contains no text at all.', jpeg: 'An image of a resume contains no text at all.', png: 'An image of a resume contains no text at all.',
    odt: 'OpenDocument files are not accepted by most applicant tracking systems.', rtf: 'Rich Text files lose structure and are rarely accepted.',
  }[ext] || 'This file type is not one applicant tracking systems commonly accept.';
  return issue('file_type', 'critical', `.${ext} is not a resume format an ATS accepts`, known, 'Export the resume as a PDF (from Word, Google Docs or Pages) or save it as .docx, then check that file.', 0);
}

/* --------------------------------------------------------- image / text */

function checkImageOnly(model) {
  const scanned = model.pages.filter((page) => page.images > 0 && page.chars < 120);
  if (model.kind === 'pdf' && model.pages.every((page) => page.chars < 40)) {
    return issue('image_only', 'critical', 'No readable text in this file', 'The file contains almost no text a system could extract. It is probably a scan, a screenshot or text drawn as images, and an ATS will see a blank resume.', 'Export a text-based PDF from the original document (Word, Google Docs) instead of scanning or printing to an image.', 60);
  }
  if (scanned.length) {
    return issue('image_only', 'critical', `Page ${scanned.map((p) => p.number).join(', ')} is mostly an image`, 'These pages hold images and very little extractable text, so their content is invisible to an ATS.', 'Recreate the content as real text. Use images only for decoration.', 30, `page ${scanned[0].number}`);
  }
  return null;
}

function checkImagesPresent(model) {
  const withImages = model.pages.filter((page) => page.images > 0 && page.chars >= 120);
  if (!withImages.length) return null;
  return issue('images_present', 'info', 'Images or graphics found', 'Photos, icons and skill-rating graphics are ignored by an ATS. Any information carried only by them (for example a skill bar) is lost.', 'Write skills and levels as text. Photos are unnecessary and can trigger bias filters in some regions.', 0);
}

/* -------------------------------------------------------------- columns */

/**
 * Looks for a vertical gutter — a band of empty space that almost no line
 * crosses — with a substantial share of the text on both sides. A right-hand
 * date column does not count: it holds far too little text.
 */
function findGutter(page) {
  const rows = page.rows.filter((row) => row.text.trim());
  if (rows.length < 10 || !page.width) return null;
  const bins = 120;
  const binWidth = page.width / bins;
  const cover = new Array(bins).fill(0);
  rows.forEach((row) => {
    const touched = new Set();
    row.segments.forEach((seg) => {
      for (let b = Math.max(0, Math.floor(seg.x / binWidth)); b <= Math.min(bins - 1, Math.floor(seg.x2 / binWidth)); b += 1) touched.add(b);
    });
    touched.forEach((b) => { cover[b] += 1; });
  });
  const limit = rows.length * 0.08;
  let best = null;
  let start = null;
  for (let b = Math.floor(bins * 0.15); b <= Math.ceil(bins * 0.75); b += 1) {
    if (cover[b] <= limit) {
      if (start === null) start = b;
      if (!best || b - start > best.end - best.start) best = { start, end: b };
    } else start = null;
  }
  if (!best || (best.end - best.start + 1) * binWidth < 12) return null;
  const gutterX0 = best.start * binWidth;
  const gutterX1 = (best.end + 1) * binWidth;
  let left = 0; let right = 0; let leftRows = 0; let rightRows = 0;
  rows.forEach((row) => {
    let hasLeft = false; let hasRight = false;
    row.segments.forEach((seg) => {
      if (seg.x2 <= gutterX1) { left += seg.text.length; hasLeft = true; } else if (seg.x >= gutterX0) { right += seg.text.length; hasRight = true; }
    });
    if (hasLeft) leftRows += 1;
    if (hasRight) rightRows += 1;
  });
  const total = left + right || 1;
  // Both sides must carry real text on many lines. A right-aligned date column
  // has few characters and only a handful of lines, so it is not a column.
  const substantial = (chars, count) => chars / total >= 0.1 && count / rows.length >= 0.25;
  return substantial(left, leftRows) && substantial(right, rightRows) ? { x: (gutterX0 + gutterX1) / 2 } : null;
}

function checkColumns(model) {
  if (model.kind !== 'pdf') return null;
  const page = model.pages.find((p) => findGutter(p));
  if (!page) return null;
  return issue('multi_column', 'critical', 'Multi-column layout', 'Text sits in two or more columns. Many parsers read straight across the page, left to right, so a sidebar and the main column get interleaved line by line and jobs, skills and dates end up scrambled together.', 'Use a single-column layout. If you want a sidebar, move its content (skills, contact) into normal sections above or below the experience.', 15, `page ${page.number}`);
}

/* --------------------------------------------------------------- tables */

function checkTables(model) {
  if (model.kind === 'docx') {
    return model.tableCount > 0
      ? issue('table_layout', 'warning', `${model.tableCount} table${model.tableCount === 1 ? '' : 's'} found`, 'Tables are frequently flattened or dropped by parsers, so anything inside them can vanish or come out in the wrong order.', 'Replace layout tables with plain paragraphs, tab stops and bullet lists.', 8)
      : null;
  }
  for (const page of model.pages) {
    const rows = page.rows.filter((row) => row.segments.length >= 3);
    let run = 0;
    for (let i = 1; i < rows.length; i += 1) {
      const a = rows[i - 1].segments.slice(0, 3).map((s) => s.x);
      const b = rows[i].segments.slice(0, 3).map((s) => s.x);
      const aligned = a.every((x, k) => Math.abs(x - b[k]) <= 6) && rows[i].y - rows[i - 1].y < 40;
      run = aligned ? run + 1 : 0;
      if (run >= 3) {
        return issue('table_layout', 'warning', 'Grid or table layout', 'Several lines are laid out in aligned columns, which is how a table looks to a parser. Table cells are often flattened, reordered or dropped.', 'Turn the grid into a simple list or a comma-separated line, especially for skills.', 8, `page ${page.number}`);
      }
    }
  }
  return null;
}

/* ------------------------------------------------------ contact location */

function checkContactLocation(model) {
  const contact = (text) => EMAIL_RE.test(text) || findPhone(text.replace(EMAIL_RE, ' '));
  if (model.kind === 'docx') {
    const inHeader = model.headerFooter.some((text) => contact(text));
    const inBody = contact(fullText(model));
    if (inHeader && !inBody) {
      return issue('contact_in_header', 'warning', 'Contact details are only in the Word header or footer', 'Many parsers skip the header and footer regions of a Word document, so your email and phone may never be read.', 'Also put your contact details at the top of the main page body.', 8);
    }
    return null;
  }
  // A PDF has no header region as such, so only a footer, or a running header
  // repeated on every page, counts; a name-and-contact line at the very top of page 1 is normal.
  const footerHit = model.pages.find((page) => page.rows.some((row) => row.y > page.height * 0.92 && contact(row.text)));
  const bodyHit = model.pages.some((page) => page.rows.some((row) => row.y <= page.height * 0.92 && contact(row.text)));
  if (footerHit && !bodyHit) {
    return issue('contact_in_header', 'warning', 'Contact details are only in the footer', 'Parsers that treat the top and bottom of each page as repeating header or footer text may discard it, so your email and phone may not be found.', 'Put your contact details near the top of the first page, in the main body.', 8, `page ${footerHit.number}`);
  }
  if (model.pageCount > 1) {
    const top = model.pages.map((page) => page.rows.find((row) => row.y < page.height * 0.06 && contact(row.text))?.text.trim());
    if (top.every(Boolean) && new Set(top).size === 1) {
      return issue('contact_in_header', 'warning', 'Contact details repeat as a page header', 'The same contact line at the top of every page looks like a running header, which many parsers strip.', 'Keep contact details once, in the body of the first page.', 8);
    }
  }
  return null;
}

/* ------------------------------------------------------------- sections */

function checkHeadings(found) {
  const issues = [];
  const unknown = found.unknownHeadings.slice(0, 4);
  if (unknown.length) {
    issues.push(issue('nonstandard_heading', 'warning', `Unrecognised section heading${unknown.length === 1 ? '' : 's'}: ${unknown.map((h) => `“${h}”`).join(', ')}`, 'An ATS decides which text is your experience, education or skills from the heading. A creative name may not match, and the content under it can be filed under the wrong section or ignored.', 'Use the standard names: Summary, Experience (or Work Experience), Education, Skills, Certifications, Projects.', Math.min(12, unknown.length * 4)));
  }
  const keys = new Set(found.sections.map((s) => s.key));
  [['experience', 'Experience', 12], ['education', 'Education', 6], ['skills', 'Skills', 6]].forEach(([key, label, penalty]) => {
    if (!keys.has(key)) {
      issues.push(issue(`missing_${key}`, key === 'experience' ? 'critical' : 'warning', `No “${label}” section found`, `No heading was recognised as ${label}. An ATS may not identify that part of your resume at all.`, `Add a clearly labelled “${key === 'experience' ? 'Work Experience' : label}” heading using standard wording.`, penalty));
    }
  });
  return issues;
}

/* ---------------------------------------------------------------- dates */

const YEAR = /\b(19|20)\d{2}\b/;
const LOOSE_DATE = /\b(summer|winter|spring|fall|autumn|q[1-4])\s+'?\d{2,4}\b|'\d{2}\s*[-–—]|\b\d{4}\s*[-–—]\s*'?\d{2}\b(?!\d)/i;

function checkDates(found) {
  const fromSections = found.sections.filter((s) => s.key === 'experience').flatMap((s) => found.rows.slice(s.start, s.end));
  const experience = fromSections.length ? fromSections : found.rows;
  const bad = experience.filter((row) => {
    const text = row.text.trim();
    if (text.length > 100 || /^[•\-*·]/.test(text) || !YEAR.test(text)) return false;
    if (DATE_RANGE_RE.test(text)) return LOOSE_DATE.test(text) && !/\b(19|20)\d{2}\s*[-–—]\s*(19|20)\d{2}\b/.test(text);
    return /[-–—]|\bto\b|\bpresent\b|\bcurrent\b|\bsummer\b|\bwinter\b|\bspring\b|\bfall\b|\bq[1-4]\b/i.test(text);
  });
  if (!bad.length) return null;
  return issue('unparseable_dates', 'warning', 'Dates an ATS may not read', `Some employment dates are not in a standard format (for example “${bad[0].text.trim().slice(0, 60)}”). Parsers use dates to work out job order and years of experience, and a date they cannot read can leave a role with no duration.`, 'Write each range as “Jan 2021 – Mar 2023” or “2021 – 2023”, and use “Present” for a current role.', 8);
}

/* ------------------------------------------------------------- encoding */

function checkEncoding(model) {
  const text = fullText(model);
  const bad = (text.match(/[�-]|\(cid:\d+\)/g) || []).length;
  if (bad >= 3 || (text.length && bad / text.length > 0.005)) {
    return issue('encoding', 'critical', 'Some text is garbled (font encoding problem)', `${bad} characters could not be decoded — they come out as replacement or private-use symbols. This happens with custom or symbol fonts, and it means the text an ATS reads is not the text you see.`, 'Use a standard font (Arial, Calibri, Times New Roman, Georgia, Helvetica), and re-export the PDF with fonts embedded as text, not outlines.', 25);
  }
  return null;
}

/* ---------------------------------------------------------- length etc. */

function checkLength(model, entities) {
  const words = fullText(model).split(/\s+/).filter(Boolean).length;
  const issues = [];
  if (words < 150) issues.push(issue('too_short', 'warning', `Very little text (${words} words)`, 'There is too little text for a parser or a recruiter’s keyword search to work with.', 'Add measurable achievements under each role and a skills section.', 10));
  const years = yearsOfExperience(entities.jobs);
  if (model.pageCount > 2 && years !== null && years < 10) {
    issues.push(issue('page_count', 'info', `${model.pageCount}${model.pageCountEstimated ? ' (estimated)' : ''} pages for about ${years} years of experience`, 'A resume for under ten years of experience is normally one or two pages. This is a readability guideline for recruiters rather than a parsing failure.', 'Trim older or less relevant roles and keep the strongest bullets.', 5));
  }
  return issues;
}

function checkContactPresence(entities) {
  const issues = [];
  if (!entities.email) issues.push(issue('missing_email', 'critical', 'No email address found', 'An ATS uses your email as the identity of your application. Without one it cannot create or match a candidate record.', 'Add your email address as plain text near the top, not as an image or an icon-only link.', 20));
  if (!entities.phone) issues.push(issue('missing_phone', 'warning', 'No phone number found', 'Recruiters often look for a phone number in the parsed profile, and many forms pre-fill it from the resume.', 'Add a phone number in a standard format, for example +1 555 123 4567.', 8));
  return issues;
}

/* ------------------------------------------------------------- pipeline */

export function runChecks(model) {
  const found = findSections(model);
  const entities = extractEntities(model, found);
  const list = [
    checkImageOnly(model),
    checkColumns(model),
    checkTables(model),
    checkContactLocation(model),
    ...checkHeadings(found),
    checkDates(found),
    checkEncoding(model),
    ...checkLength(model, entities),
    ...checkContactPresence(entities),
    checkImagesPresent(model),
  ].filter(Boolean);
  const order = { critical: 0, warning: 1, info: 2 };
  list.sort((a, b) => order[a.severity] - order[b.severity] || b.penalty - a.penalty);
  return { issues: list, entities, found, ...computeScore(list) };
}

/** 100 minus the listed penalties, floored at 0. The breakdown is what the UI shows as "how this score is made". */
export function computeScore(issues) {
  const breakdown = issues.filter((item) => item.penalty > 0).map((item) => ({ code: item.code, title: item.title, penalty: item.penalty }));
  const total = breakdown.reduce((sum, item) => sum + item.penalty, 0);
  return { score: Math.max(0, 100 - total), breakdown };
}

export { allRows };
