import { allRows } from './model.js';
import { ALL_SKILLS } from './skills.js';

/**
 * Section detection: which lines are headings, which are ones an ATS will
 * recognise, and which are custom names ("Career Journey") that it will not.
 */

export const SECTION_SYNONYMS = {
  summary: ['summary', 'professional summary', 'career summary', 'executive summary', 'profile', 'professional profile', 'personal profile', 'career objective', 'objective', 'about me', 'about', 'personal statement', 'overview', 'summary of qualifications'],
  experience: ['experience', 'work experience', 'professional experience', 'employment', 'employment history', 'work history', 'career history', 'relevant experience', 'professional background', 'clinical experience', 'internships', 'experience and achievements'],
  education: ['education', 'education and training', 'academic background', 'academic qualifications', 'qualifications', 'education and qualifications', 'academic history', 'training and education'],
  skills: ['skills', 'technical skills', 'core competencies', 'key skills', 'skills and tools', 'areas of expertise', 'competencies', 'technologies', 'skills and abilities', 'core skills', 'tools and technologies', 'professional skills', 'technical proficiencies'],
  projects: ['projects', 'selected projects', 'personal projects', 'key projects', 'academic projects', 'side projects'],
  certifications: ['certifications', 'certificates', 'licenses', 'licenses and certifications', 'licences and certifications', 'certifications and licenses', 'professional certifications', 'training', 'courses'],
  extras: ['languages', 'awards', 'honors', 'honours', 'awards and honors', 'volunteer', 'volunteering', 'volunteer experience', 'publications', 'interests', 'hobbies', 'references', 'affiliations', 'memberships', 'professional affiliations', 'achievements', 'leadership'],
};

const normalise = (text) => text.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ').trim();

export const sectionKeyFor = (text) => {
  const clean = normalise(text);
  if (!clean || clean.split(' ').length > 5) return null;
  for (const [key, names] of Object.entries(SECTION_SYNONYMS)) if (names.includes(clean)) return key;
  return null;
};

const wordCount = (text) => text.trim().split(/\s+/).length;
const isAllCaps = (text) => /[A-Z]{3}/.test(text) && text === text.toUpperCase();

const medianOf = (values) => {
  const sorted = values.filter(Boolean).sort((a, b) => a - b);
  return sorted.length ? sorted[Math.floor(sorted.length / 2)] : 0;
};

/**
 * → {
 *   rows,                       // flat rows
 *   sections: [{ key, heading, start, end }],   // known sections, row ranges [start, end)
 *   unknownHeadings: [string],  // heading-styled lines an ATS will not map to a section
 * }
 */
export function findSections(model) {
  const rows = allRows(model);
  const body = medianOf(rows.map((row) => row.fontSize));

  const isStyled = (row) => {
    const text = row.text.trim();
    if (!text || wordCount(text) > 6 || text.length > 50) return false;
    if (/[@:/]|\d/.test(text.replace(/:$/, '')) || /[.,;]$/.test(text)) return false;
    return row.heading || isAllCaps(text) || (body && row.fontSize >= body * 1.15) || row.bold;
  };

  const known = rows.map((row, index) => ({ index, key: sectionKeyFor(row.text) })).filter((item) => item.key && wordCount(rows[item.index].text) <= 5);

  // The style the known headings share tells us what a heading looks like in this document.
  const styleOf = (row) => `${Math.round(row.fontSize)}|${row.bold ? 'b' : ''}${isAllCaps(row.text) ? 'c' : ''}${row.heading ? 'h' : ''}`;
  const knownStyles = new Set(known.filter((item) => isStyled(rows[item.index])).map((item) => styleOf(rows[item.index])));

  const knownIndexes = new Set(known.map((item) => item.index));
  const unknown = [];
  rows.forEach((row, index) => {
    if (index < 3 || knownIndexes.has(index) || !isStyled(row) || ALL_SKILLS.includes(row.text.trim().toLowerCase())) return;
    if (knownStyles.size && !knownStyles.has(styleOf(row))) return;
    if (!knownStyles.size && !(row.heading || isAllCaps(row.text))) return;
    unknown.push({ index, text: row.text.trim() });
  });

  const boundaries = [...known.map((item) => item.index), ...unknown.map((item) => item.index)].sort((a, b) => a - b);
  const sections = known.map((item) => {
    const next = boundaries.find((b) => b > item.index);
    return { key: item.key, heading: rows[item.index].text.trim(), start: item.index + 1, end: next ?? rows.length };
  });
  return { rows, sections, unknownHeadings: unknown.map((item) => item.text) };
}

export const sectionRows = (found, key) => found.sections.filter((s) => s.key === key).flatMap((s) => found.rows.slice(s.start, s.end));
