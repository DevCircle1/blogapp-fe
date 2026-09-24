import { findSkills } from './skills.js';
import { fullText } from './model.js';
import { sectionRows } from './sections.js';

/**
 * A plain approximation of what a resume parser pulls out: contact details,
 * jobs, education and skills. It is a demonstration of failure modes, not a
 * copy of any vendor's parser — the UI says so.
 */

export const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
export const PHONE_RE = /(?:\+?\d{1,3}[\s.-]?)?(?:\(\d{2,4}\)|\d{2,4})[\s.-]?\d{3,4}[\s.-]?\d{3,5}/;
export const LINKEDIN_RE = /(?:https?:\/\/)?(?:[a-z]{2,3}\.)?linkedin\.com\/in\/[A-Z0-9_%-]+\/?/i;

const MONTH = '(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)';
const DATE = `(?:${MONTH}\\.?,?\\s+\\d{4}|\\d{1,2}[/-]\\d{4}|\\d{4})`;
export const DATE_RANGE_RE = new RegExp(`(${DATE})\\s*(?:-|–|—|to|until)\\s*(${DATE}|present|current|now|ongoing|today)`, 'i');

const TITLE_WORDS = /\b(engineer|developer|manager|analyst|accountant|nurse|director|consultant|intern|assistant|specialist|lead|designer|coordinator|officer|administrator|architect|scientist|technician|supervisor|executive|associate|representative|controller|auditor|clerk|programmer|owner|head|president|vp|advisor|teacher|therapist|pharmacist|practitioner)\b/i;
const DEGREE_RE = /\b(bachelors?|masters?|bba|bcom|b\.?com|m\.?com|llb|llm|bca|mca|b\.?tech|m\.?tech|ph\.?d|doctorate|mba|b\.?sc|m\.?sc|b\.?a\.?|m\.?a\.?|b\.?s\.?|m\.?s\.?|b\.?eng|m\.?eng|bsn|msn|associate|diploma|certificate|degree)\b/i;
const SCHOOL_RE = /\b(university|college|institute|school|academy|polytechnic)\b/i;

const phoneDigits = (text) => text.replace(/\D/g, '').length;

export function findPhone(text) {
  const match = text.match(PHONE_RE);
  return match && phoneDigits(match[0]) >= 9 && phoneDigits(match[0]) <= 15 ? match[0].trim() : null;
}

const cleanEntry = (text) => text.replace(DATE_RANGE_RE, '').replace(/[•·]+/g, ' ').replace(/\s+/g, ' ').replace(/^[\s,–—|-]+|[\s,–—|-]+$/g, '').trim();

function splitTitleCompany(text) {
  if (!text) return { title: '', company: '' };
  const at = text.match(/^(.*?)\s+(?:at|@)\s+(.*)$/i);
  const parts = at ? [at[1], at[2]] : text.split(/\s+[|–—-]\s+|,\s+|\s{2,}/).map((part) => part.trim()).filter(Boolean);
  if (parts.length === 1) return TITLE_WORDS.test(parts[0]) ? { title: parts[0], company: '' } : { title: '', company: parts[0] };
  const [first, second] = parts;
  if (TITLE_WORDS.test(first)) return { title: first, company: second };
  if (TITLE_WORDS.test(second)) return { title: second, company: first };
  return { title: first, company: second };
}

/** The part of a job-header row that is not the date range, keeping column breaks as " | ". */
const entryText = (row) => {
  const outside = row.segments.filter((seg) => !DATE_RANGE_RE.test(seg.text)).map((seg) => seg.text);
  return cleanEntry(outside.length === row.segments.length ? row.text : outside.join(' | '));
};

function extractJobs(rows) {
  const jobs = [];
  rows.forEach((row, index) => {
    const range = row.text.match(DATE_RANGE_RE);
    if (!range) return;
    // Bullets that mention a range in passing are not job headers.
    if (/^[•\-*·]/.test(row.text.trim()) || row.text.length > 140) return;
    let { title, company } = splitTitleCompany(entryText(row));
    if (!title || !company) {
      // The date sits on its own line, or beside only half the header: the rest is on the line(s) above.
      const above = rows.slice(Math.max(0, index - 2), index).map((r) => r.text.trim()).filter((t) => t && !DATE_RANGE_RE.test(t) && !/^[•\-*·]/.test(t));
      if (!title && !company && above.length) {
        const last = splitTitleCompany(above[above.length - 1]);
        if (last.title && last.company) ({ title, company } = last);
        else if (above.length >= 2) ({ title, company } = TITLE_WORDS.test(above[above.length - 1]) ? { title: above[above.length - 1], company: above[above.length - 2] } : { title: above[above.length - 2], company: above[above.length - 1] });
        else ({ title, company } = last);
      }
    }
    jobs.push({ title, company, start: range[1], end: range[2], raw: row.text.trim() });
  });
  return jobs;
}

function extractEducation(rows) {
  const entries = [];
  rows.forEach((row) => {
    const text = row.text.trim();
    if (!DEGREE_RE.test(text) && !SCHOOL_RE.test(text)) return;
    const year = text.match(/\b(19|20)\d{2}\b/g);
    const last = entries[entries.length - 1];
    const stripYear = (t) => cleanEntry(t).replace(/\b(19|20)\d{2}\b/g, '').replace(/[,\s]+$/, '').trim();
    if (SCHOOL_RE.test(text) && !DEGREE_RE.test(text) && last && !last.school) {
      last.school = stripYear(text);
      if (!last.year && year) last.year = year[year.length - 1];
    } else if (DEGREE_RE.test(text) && SCHOOL_RE.test(text)) {
      const parts = stripYear(text).split(/,\s+|\s+[|–—-]\s+/);
      entries.push({
        degree: parts.filter((part) => !SCHOOL_RE.test(part)).join(', ') || parts[0],
        school: parts.filter((part) => SCHOOL_RE.test(part)).join(', '),
        year: year ? year[year.length - 1] : '',
      });
    } else {
      entries.push({
        degree: DEGREE_RE.test(text) ? stripYear(text) : '',
        school: SCHOOL_RE.test(text) ? stripYear(text) : '',
        year: year ? year[year.length - 1] : '',
      });
    }
  });
  return entries;
}

function guessName(rows) {
  for (const row of rows.slice(0, 6)) {
    const text = row.text.trim();
    if (!text || EMAIL_RE.test(text) || LINKEDIN_RE.test(text) || /\d/.test(text) || /https?:|www\./i.test(text)) continue;
    const words = text.split(/\s+/);
    if (words.length < 2 || words.length > 5) continue;
    if (!/^[\p{L}][\p{L}'’.-]*$/u.test(words[0]) || !words.every((w) => /^[\p{L}][\p{L}'’.-]*$/u.test(w))) continue;
    if (TITLE_WORDS.test(text) && words.length > 3) continue;
    return text;
  }
  return null;
}

export function extractEntities(model, found) {
  const text = fullText(model);
  const rows = found.rows;
  const expRows = sectionRows(found, 'experience');
  const eduRows = sectionRows(found, 'education');
  const skillsRows = sectionRows(found, 'skills');
  const email = text.match(EMAIL_RE);
  const linkedin = text.match(LINKEDIN_RE);
  const listed = skillsRows.flatMap((row) => row.text.split(/[,•·|;]|\s{2,}/)).map((s) => s.replace(/^[-–—*\s]+/, '').trim()).filter((s) => s && s.length <= 40 && s.split(/\s+/).length <= 4);
  return {
    name: guessName(rows),
    email: email ? email[0] : null,
    phone: findPhone(text.replace(EMAIL_RE, ' ')),
    linkedin: linkedin ? linkedin[0] : null,
    jobs: extractJobs(expRows.length ? expRows : rows),
    education: extractEducation(eduRows.length ? eduRows : rows.filter((r) => DEGREE_RE.test(r.text) || SCHOOL_RE.test(r.text))),
    skills: [...new Set([...findSkills(text)])],
    listedSkills: [...new Set(listed)],
    hasSummary: found.sections.some((section) => section.key === 'summary'),
  };
}

/** Years between the earliest job start and now, for the page-count guideline. */
export function yearsOfExperience(jobs, now = new Date()) {
  const years = jobs.map((job) => Number((job.start.match(/\d{4}/) || [])[0])).filter((y) => y >= 1970 && y <= now.getFullYear());
  return years.length ? now.getFullYear() - Math.min(...years) : null;
}
