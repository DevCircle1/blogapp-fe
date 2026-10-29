/**
 * Pure engines for the readability checker and the hreflang generator. No DOM,
 * no React — exercised in Node by scripts/checks/extra.mjs.
 */

/* ------------------------------------------------------- readability */
/**
 * Rough English syllable count. Good enough for the readability formulas, which
 * were themselves built on averages; it can be off by one on words like
 * "created" or "poem".
 */
export const countSyllables = (word) => {
  let w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
  const groups = w.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
};

const WORD_RE = /\p{L}[\p{L}\p{N}'’-]*|\p{N}+/gu;

/** Sentences end at . ! or ? followed by a space, so "3.5" stays whole. */
export const splitSentences = (text) => String(text || '')
  .replace(/\s+/g, ' ')
  .split(/(?<=[.!?]["')\]]?)\s+(?=\S)/u)
  .map((s) => s.trim())
  .filter((s) => /[\p{L}\p{N}]/u.test(s));

export const fleschBand = (score) => {
  if (score >= 90) return { label: 'Very easy', grade: '5th grade' };
  if (score >= 80) return { label: 'Easy', grade: '6th grade' };
  if (score >= 70) return { label: 'Fairly easy', grade: '7th grade' };
  if (score >= 60) return { label: 'Plain English', grade: '8th–9th grade' };
  if (score >= 50) return { label: 'Fairly difficult', grade: '10th–12th grade' };
  if (score >= 30) return { label: 'Difficult', grade: 'College' };
  return { label: 'Very difficult', grade: 'College graduate' };
};

export const analyzeReadability = (text, longSentenceWords = 25) => {
  const sentences = splitSentences(text);
  const words = String(text || '').match(WORD_RE) || [];
  if (!words.length || !sentences.length) return null;

  const perSentence = sentences.map((s) => ({ text: s, words: (s.match(WORD_RE) || []).length }));
  const syllableCounts = words.map(countSyllables);
  const syllables = syllableCounts.reduce((a, b) => a + b, 0);
  const letters = words.reduce((n, w) => n + (w.match(/[\p{L}\p{N}]/gu) || []).length, 0);
  const complex = syllableCounts.filter((n) => n >= 3).length;
  const W = words.length;
  const S = sentences.length;
  const wps = W / S;
  const spw = syllables / W;
  const fre = 206.835 - 1.015 * wps - 84.6 * spw;

  return {
    words: W,
    sentences: S,
    syllables,
    letters,
    complexWords: complex,
    avgSentenceLength: wps,
    avgSyllables: spw,
    fleschReadingEase: fre,
    fleschKincaid: 0.39 * wps + 11.8 * spw - 15.59,
    gunningFog: 0.4 * (wps + 100 * (complex / W)),
    // SMOG is defined for samples of 30+ sentences.
    smog: S >= 30 ? 1.043 * Math.sqrt(complex * (30 / S)) + 3.1291 : null,
    colemanLiau: 0.0588 * ((letters / W) * 100) - 0.296 * ((S / W) * 100) - 15.8,
    ari: 4.71 * (letters / W) + 0.5 * wps - 21.43,
    band: fleschBand(fre),
    longSentences: perSentence.filter((s) => s.words > longSentenceWords).sort((a, b) => b.words - a.words),
    readingMinutes: W / 238,
    speakingMinutes: W / 150,
  };
};

/* ---------------------------------------------------------- hreflang */
const ISO_639_1 = new Set((
  'aa ab ae af ak am an ar as av ay az ba be bg bh bi bm bn bo br bs ca ce ch co cr cs cu cv cy da de dv dz ee el en eo es et eu '
  + 'fa ff fi fj fo fr fy ga gd gl gn gu gv ha he hi ho hr ht hu hy hz ia id ie ig ii ik io is it iu ja jv ka kg ki kj kk kl km kn '
  + 'ko kr ks ku kv kw ky la lb lg li ln lo lt lu lv mg mh mi mk ml mn mr ms mt my na nb nd ne ng nl nn no nr nv ny oc oj om or os '
  + 'pa pi pl ps pt qu rm rn ro ru rw sa sc sd se sg si sk sl sm sn so sq sr ss st su sv sw ta te tg th ti tk tl tn to tr ts tt tw '
  + 'ty ug uk ur uz ve vi vo wa wo xh yi yo za zh zu'
).split(' '));

/** Country codes people type where a language code belongs, mapped to what they meant. */
const LANGUAGE_FIXES = { gr: 'el', jp: 'ja', cn: 'zh', kp: 'ko', dk: 'da', iw: 'he' };
const REGION_FIXES = { UK: 'GB' };

/**
 * Normalise one hreflang value. Returns { code, notes[], error? }.
 * Valid: "x-default", a two-letter language, or language-REGION ("en-GB").
 */
export const normalizeHreflang = (raw) => {
  const input = String(raw || '').trim();
  const notes = [];
  if (!input) return { code: '', notes, error: 'Enter a language code.' };
  if (/^x-default$/i.test(input)) return { code: 'x-default', notes };

  const fixed = input.replace(/_/g, '-');
  if (fixed !== input) notes.push('Use a hyphen, not an underscore.');
  const parts = fixed.split('-');
  if (parts.length > 2) return { code: input, notes, error: 'Use a language or language-REGION only, such as “en” or “en-GB”.' };

  const language = parts[0].toLowerCase();
  if (!/^[a-z]{2}$/.test(language)) return { code: input, notes, error: `“${parts[0]}” is not a two-letter ISO 639-1 language code.` };
  if (!ISO_639_1.has(language)) {
    const better = LANGUAGE_FIXES[language];
    return { code: input, notes, error: better ? `“${language}” is a country code, not a language code. Did you mean “${better}”?` : `“${language}” is not an ISO 639-1 language code.` };
  }

  let region = parts[1];
  if (region !== undefined) {
    if (!/^[A-Za-z]{2}$/.test(region)) return { code: input, notes, error: `The region “${region}” must be a two-letter ISO 3166-1 code such as “GB”.` };
    const upper = region.toUpperCase();
    if (REGION_FIXES[upper]) {
      notes.push(`“${region}” is not a valid region code; the United Kingdom is “GB”.`);
      region = REGION_FIXES[upper];
    } else {
      if (region !== upper) notes.push('Regions are written in capitals, as in “en-GB”.');
      region = upper;
    }
  }
  if (language !== parts[0]) notes.push('Languages are written in lowercase.');
  return { code: region ? `${language}-${region}` : language, notes };
};

const xmlEscape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ABSOLUTE_URL = /^https?:\/\/[^\s/]+\.[^\s/]+/i;

/**
 * entries: [{ code, url }]. xDefault: a URL string or ''.
 * Returns the three output formats plus problems (blocking) and warnings.
 */
export const buildHreflang = (entries, xDefault = '') => {
  const problems = [];
  const warnings = [];
  const rows = [];
  const seenCodes = new Map();
  const seenUrls = new Map();

  entries.forEach((entry, index) => {
    const url = String(entry.url || '').trim();
    const rawCode = String(entry.code || '').trim();
    if (!url && !rawCode) return;
    const label = `Row ${index + 1}`;
    const norm = normalizeHreflang(rawCode);
    if (norm.error) problems.push(`${label}: ${norm.error}`);
    norm.notes.forEach((note) => warnings.push(`${label}: ${note}`));
    if (norm.code === 'x-default') problems.push(`${label}: set x-default in its own box below the rows.`);
    if (!ABSOLUTE_URL.test(url)) problems.push(`${label}: the URL must be absolute, starting with https://.`);
    if (!norm.error && seenCodes.has(norm.code)) problems.push(`${label}: “${norm.code}” is already used by row ${seenCodes.get(norm.code)}; each language-region may point to one URL.`);
    if (url && seenUrls.has(url)) warnings.push(`${label}: this URL is already listed in row ${seenUrls.get(url)}. One URL should not stand in for two languages.`);
    if (!norm.error) seenCodes.set(norm.code, index + 1);
    if (url) seenUrls.set(url, index + 1);
    if (!norm.error && norm.code !== 'x-default' && ABSOLUTE_URL.test(url)) rows.push({ code: norm.code, url });
  });

  const defaultUrl = String(xDefault || '').trim();
  const defaultOk = !defaultUrl || ABSOLUTE_URL.test(defaultUrl);
  if (!defaultOk) problems.push('x-default: the URL must be absolute, starting with https://.');
  if (rows.length < 2) problems.push('Add at least two language versions; a single page has nothing to point to.');
  if (!defaultUrl && rows.length >= 2) warnings.push('No x-default set. Add one pointing at your language selector or main version, for visitors whose language you do not list.');

  const all = [...rows];
  if (defaultUrl && defaultOk) all.push({ code: 'x-default', url: defaultUrl });

  const path = (u) => u.replace(/^https?:\/\/[^/]+/i, '');
  if (new Set(rows.map((r) => r.url.replace(/^(https?:\/\/[^/]+).*$/i, '$1').toLowerCase())).size > 1) {
    warnings.push('The URLs use different hosts or protocols. That is fine for separate domains, but each must be the canonical URL, with http/https and www consistent.');
  }
  if (new Set(rows.map((r) => path(r.url) === '' || path(r.url).endsWith('/'))).size > 1) {
    warnings.push('Some URLs end in a slash and some do not. Use exactly the URL each page canonicalises to.');
  }

  const html = all.map((e) => `<link rel="alternate" hreflang="${e.code}" href="${xmlEscape(e.url)}" />`).join('\n');
  const header = `Link: ${all.map((e) => `<${e.url}>; rel="alternate"; hreflang="${e.code}"`).join(', ')}`;
  const links = all.map((e) => `    <xhtml:link rel="alternate" hreflang="${e.code}" href="${xmlEscape(e.url)}" />`).join('\n');
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...rows.map((r) => `  <url>\n    <loc>${xmlEscape(r.url)}</loc>\n${links}\n  </url>`),
    '</urlset>',
  ].join('\n');

  return { ok: problems.length === 0, problems, warnings, entries: all, html, header, sitemap };
};
