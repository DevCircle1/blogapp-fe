/**
 * Subtitle parsers. Every format becomes the same model:
 *   Cue = { index, start, end, text, settings? }   (times in milliseconds)
 * so conversion, syncing and merging are independent of the file format.
 *
 * Parsers are forgiving: a BOM, CRLF or LF, missing cue numbers and a malformed
 * final cue do not discard the file. Problems are returned as `warnings` instead
 * of being fixed silently.
 */

const stripBom = (text) => (text.charCodeAt(0) === 0xfeff ? text.slice(1) : text);
const normaliseNewlines = (text) => text.replace(/\r\n?/g, '\n');

/** "hh:mm:ss,mmm", "mm:ss.mmm", "h:mm:ss.cc" … → milliseconds, or null. */
export function parseTime(raw) {
  const match = String(raw).trim().match(/^(?:(\d+):)?(\d{1,2}):(\d{1,2})(?:[.,:](\d{1,3}))?$/);
  if (!match) return null;
  const [, h = '0', m, s, frac = '0'] = match;
  const ms = Number(frac.padEnd(3, '0').slice(0, 3));
  return ((Number(h) * 60 + Number(m)) * 60 + Number(s)) * 1000 + ms;
}

const TIMING = /^\s*([\d:.,]+)\s*-->\s*([\d:.,]+)(?:\s+(.*))?\s*$/;

/* ---------------------------------------------------------------- SRT / VTT */

function parseBlocks(text, { vtt }) {
  const cues = [];
  const warnings = [];
  const blocks = normaliseNewlines(stripBom(text)).split(/\n{2,}/);
  blocks.forEach((block, blockIndex) => {
    const lines = block.split('\n').filter((line, i, all) => !(i === all.length - 1 && line === ''));
    if (!lines.length) return;
    if (vtt && (blockIndex === 0 && /^WEBVTT/.test(lines[0]))) {
      // The header block may also hold the first cue when the blank line is missing.
      const rest = lines.slice(1);
      const at = rest.findIndex((line) => TIMING.test(line));
      if (at === -1) return;
      lines.splice(0, lines.length, ...rest.slice(at));
    }
    if (vtt && /^(NOTE|STYLE|REGION)\b/.test(lines[0])) return;
    const timingAt = lines.findIndex((line) => TIMING.test(line));
    if (timingAt === -1) {
      if (lines.join('').trim()) warnings.push({ code: 'skipped', message: `A block near line ${blockIndex + 1} has no timing line and was skipped: “${lines[0].slice(0, 40)}”.` });
      return;
    }
    const match = lines[timingAt].match(TIMING);
    const start = parseTime(match[1]);
    const end = parseTime(match[2]);
    if (start === null || end === null) {
      warnings.push({ code: 'bad-time', message: `A cue has a time that could not be read: “${lines[timingAt].trim()}”.` });
      return;
    }
    const text2 = lines.slice(timingAt + 1).join('\n');
    if (!text2.trim() && cues.length === 0 && blockIndex === blocks.length - 1) return;
    cues.push({
      index: cues.length + 1, start, end, text: text2, ...(vtt && match[3] ? { settings: match[3].trim() } : {}),
    });
  });
  return { cues, warnings };
}

/* ---------------------------------------------------------------------- ASS */

const assText = (raw) => raw
  .replace(/\\N/g, '\n').replace(/\\n/g, '\n').replace(/\\h/g, ' ')
  .replace(/\{\\i1\}/g, '<i>').replace(/\{\\i0\}/g, '</i>')
  .replace(/\{\\b1\}/g, '<b>').replace(/\{\\b0\}/g, '</b>')
  .replace(/\{\\u1\}/g, '<u>').replace(/\{\\u0\}/g, '</u>')
  .replace(/\{[^}]*\}/g, '');

function parseAss(text) {
  const cues = [];
  const warnings = [];
  const lines = normaliseNewlines(stripBom(text)).split('\n');
  let inEvents = false;
  let columns = null;
  let stripped = false;
  for (const line of lines) {
    if (/^\[.*\]\s*$/.test(line)) { inEvents = /^\[events\]/i.test(line.trim()); continue; }
    if (!inEvents) continue;
    if (/^format:/i.test(line)) { columns = line.slice(7).split(',').map((c) => c.trim().toLowerCase()); continue; }
    if (!/^dialogue:/i.test(line)) continue;
    const fields = columns || ['layer', 'start', 'end', 'style', 'name', 'marginl', 'marginr', 'marginv', 'effect', 'text'];
    // Text is the last column and may itself contain commas.
    const parts = line.slice(9).split(',');
    const values = {};
    fields.slice(0, -1).forEach((name, i) => { values[name] = (parts[i] || '').trim(); });
    values.text = parts.slice(fields.length - 1).join(',');
    const start = parseTime(values.start);
    const end = parseTime(values.end);
    if (start === null || end === null) { warnings.push({ code: 'bad-time', message: `A Dialogue line has a time that could not be read: “${line.slice(0, 60)}”.` }); continue; }
    if (/\{\\(?!i[01]\}|b[01]\}|u[01]\})/.test(values.text) || /\\p\d/.test(values.text)) stripped = true;
    cues.push({ index: cues.length + 1, start, end, text: assText(values.text), ...(values.style ? { style: values.style } : {}) });
  }
  cues.sort((a, b) => a.start - b.start);
  cues.forEach((cue, i) => { cue.index = i + 1; });
  if (stripped) warnings.push({ code: 'styling-lost', message: 'ASS styling such as colours, positioning and effects cannot be kept in this format and was removed. The text and timings are unchanged.' });
  return { cues, warnings };
}

/* ---------------------------------------------------------------------- SBV */

function parseSbv(text) {
  const cues = [];
  const warnings = [];
  normaliseNewlines(stripBom(text)).split(/\n{2,}/).forEach((block) => {
    const lines = block.split('\n').filter(Boolean);
    if (!lines.length) return;
    const match = lines[0].match(/^\s*([\d:.]+)\s*,\s*([\d:.]+)\s*$/);
    if (!match) { warnings.push({ code: 'skipped', message: `A block was skipped because its first line is not a timing line: “${lines[0].slice(0, 40)}”.` }); return; }
    const start = parseTime(match[1]);
    const end = parseTime(match[2]);
    if (start === null || end === null) return;
    cues.push({ index: cues.length + 1, start, end, text: lines.slice(1).join('\n') });
  });
  return { cues, warnings };
}

/* -------------------------------------------------------------------- entry */

export function detectFormat(text, fileName = '') {
  const head = stripBom(text).slice(0, 4000);
  if (/^\s*WEBVTT/.test(head)) return 'vtt';
  if (/\[Script Info\]|\[Events\]|^Dialogue:/im.test(head)) return 'ass';
  if (/^\s*\d+:\d{2}:\d{2}\.\d{3}\s*,\s*\d+:\d{2}:\d{2}\.\d{3}\s*$/m.test(head)) return 'sbv';
  if (/-->/.test(head)) return /\d{2}\.\d{3}\s*-->/.test(head) && !/\d{2},\d{3}\s*-->/.test(head) ? 'vtt' : 'srt';
  const ext = (fileName.split('.').pop() || '').toLowerCase();
  return ['srt', 'vtt', 'ass', 'ssa', 'sbv'].includes(ext) ? (ext === 'ssa' ? 'ass' : ext) : 'srt';
}

/** → { format, cues, warnings }. `format` is detected unless given. */
export function parseSubtitles(text, { format, fileName } = {}) {
  const chosen = format || detectFormat(text, fileName);
  const result = chosen === 'vtt' ? parseBlocks(text, { vtt: true })
    : chosen === 'ass' ? parseAss(text)
      : chosen === 'sbv' ? parseSbv(text)
        : parseBlocks(text, { vtt: false });
  return { format: chosen, ...result };
}

/** Cues whose time range overlaps the next one, and cues that end before they start. */
export function findProblems(cues) {
  const overlaps = [];
  const inverted = [];
  cues.forEach((cue, i) => {
    if (cue.end <= cue.start) inverted.push(i);
    if (i > 0 && cue.start < cues[i - 1].end) overlaps.push(i);
  });
  return { overlaps, inverted };
}
