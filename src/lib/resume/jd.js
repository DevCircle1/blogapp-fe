import { ALL_SKILLS, countTerm, hasTerm } from './skills.js';
import { allRows } from './model.js';
import { sectionRows } from './sections.js';

/**
 * Job-description matching: which of the description's skills and key phrases
 * appear in the resume, which do not, and which appear only once, deep in a bullet.
 * It is a literal term match — the same thing a recruiter's keyword search does —
 * and is meant for deciding what real experience to surface, never what to invent.
 */

const STOP = new Set(('a an and are as at be been by can do for from has have in into is it its of on or our per such that the their them these they this to using use used we will with you your who what when where which while within without across about over under more most other also able any all each etc including include includes new via than then there very well work working works team teams role roles job candidate candidates company position responsibilities requirements required preferred plus strong good great excellent ability abilities skills skill years year experience experienced knowledge understanding proven demonstrated looking join help helping ensure support supporting develop developing build building make making within must should would could may might not no yes both between per like their own high level day time part full').split(' '));

const tokenise = (text) => text.toLowerCase().replace(/[^a-z0-9+#.\-/\s]/g, ' ').split(/\s+/).map((t) => t.replace(/^[.\-/]+|[.\-/]+$/g, '')).filter(Boolean);

/** Terms worth matching from a job description: vocabulary skills first, then repeated phrases. */
export function extractJdTerms(jd, limit = 40) {
  const text = jd.replace(/\s+/g, ' ');
  const found = new Map();
  ALL_SKILLS.forEach((skill) => {
    const count = countTerm(text, skill);
    if (count) found.set(skill, { term: skill, count, skill: true });
  });
  const tokens = tokenise(text);
  const grams = new Map();
  for (let n = 1; n <= 3; n += 1) {
    for (let i = 0; i + n <= tokens.length; i += 1) {
      const slice = tokens.slice(i, i + n);
      if (STOP.has(slice[0]) || STOP.has(slice[n - 1]) || slice.some((t) => t.length < 3 && n === 1)) continue;
      if (slice.every((t) => STOP.has(t))) continue;
      if (slice.some((t) => /^\d+$/.test(t))) continue;
      const phrase = slice.join(' ');
      grams.set(phrase, (grams.get(phrase) || 0) + 1);
    }
  }
  [...grams.entries()]
    .filter(([phrase, count]) => count >= 2 && phrase.length >= 4)
    .sort((a, b) => b[1] - a[1] || b[0].split(' ').length - a[0].split(' ').length)
    .forEach(([phrase, count]) => {
      // Skip a phrase already covered by a longer or vocabulary term that contains it.
      if ([...found.keys()].some((known) => known.includes(phrase) || phrase.includes(known))) return;
      found.set(phrase, { term: phrase, count, skill: false });
    });
  return [...found.values()]
    .sort((a, b) => Number(b.skill) - Number(a.skill) || b.count - a.count)
    .slice(0, limit);
}

const variants = (term) => [term, term.endsWith('s') ? term.slice(0, -1) : `${term}s`];
const inText = (text, term) => variants(term).some((variant) => hasTerm(text, variant));
const occurrences = (text, term) => variants(term).reduce((n, variant) => n + countTerm(text, variant), 0);

export function matchTerms(terms, model, found) {
  const rows = allRows(model);
  const text = rows.map((row) => row.text).join('\n');
  const skillsText = sectionRows(found, 'skills').map((row) => row.text).join('\n');
  const headline = rows.slice(0, 12).map((row) => row.text).join('\n');
  const matched = [];
  const missing = [];
  const buried = [];
  terms.forEach((item) => {
    if (!inText(text, item.term)) { missing.push(item); return; }
    const prominent = inText(skillsText, item.term) || inText(headline, item.term);
    if (!prominent && occurrences(text, item.term) <= 1) buried.push(item); else matched.push(item);
  });
  return { matched, missing, buried };
}

export function analyseJobDescription(jd, model, found) {
  const terms = extractJdTerms(jd);
  return { terms, ...matchTerms(terms, model, found) };
}
