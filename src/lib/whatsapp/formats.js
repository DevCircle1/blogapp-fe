/**
 * WhatsApp export line formats. The export text depends on the phone's OS and
 * locale, so the header of a message line is matched by a small registry of
 * patterns; the one that matches the most of the first 200 lines wins. Lines
 * that match none are continuations of the previous message.
 */

// LTR/RTL marks and embedding controls that iOS puts at the start of lines, and
// the narrow no-break space newer versions put before AM/PM.
// Built from code points so the source holds no invisible characters.
const INVISIBLE = new RegExp(`[${[0x200e, 0x200f, 0x202a, 0x202b, 0x202c, 0x202d, 0x202e, 0x2066, 0x2067, 0x2068, 0x2069, 0xfeff].map((c) => String.fromCharCode(c)).join('')}]`, 'g');
export const cleanLine = (line) => line.replace(INVISIBLE, '').replace(/\s/g, ' ');

const DATE = String.raw`(\d{1,4})[/.\-](\d{1,2})[/.\-](\d{1,4})`;
const TIME = String.raw`(\d{1,2})[:.](\d{2})(?:[:.](\d{2}))?(?:\s?([AaPp]\.?\s?[Mm]\.?))?`;

export const FORMATS = [
  // [12/03/2026, 14:22:01] Ali: text        (iOS)
  { id: 'bracket', re: new RegExp(String.raw`^\[${DATE},?\s+${TIME}\]\s+(.*)$`) },
  // 12/03/2026, 2:22 pm - Ali: text         (Android)
  { id: 'dash', re: new RegExp(String.raw`^${DATE},?\s+${TIME}\s+[-–—]\s+(.*)$`) },
];

const SYSTEM_PATTERNS = [
  /messages and calls are end-to-end encrypted/i,
  /end-to-end encrypted/i,
  /joined using this (group's|group’s) invite link/i,
  /(created|changed|added|removed|left|joined|deleted) (this )?(group|the group)/i,
  /changed the (subject|group description|group icon|this group's icon)/i,
  /(security code|phone number) (with|changed)/i,
  /you('| a)?re now an admin/i,
  /^(you were added|you left|you removed)/i,
  /missed (voice|video) call/i,
];

const MEDIA_PATTERNS = [
  /^<?(media|multimedia|medien|médias?|arquivo de mídia)[^>]*(omitted|omitido|ausgeschlossen|omis|excluído)>?$/i,
  /^<?(image|video|audio|sticker|gif|document|contact card|voice message|photo)\s+omitted>?$/i,
  /<attached:\s*[^>]+>/i,
  /^<?(image|video|audio|sticker|gif|document)\s+(omitted|absent)>?$/i,
];
const DELETED_PATTERNS = [/^(you )?deleted this message\.?$/i, /^this message was deleted\.?$/i, /^<?message deleted>?$/i];
const EDITED_SUFFIX = /<this message was edited>\s*$/i;

/** "Ali: hello" → { sender, text }; null sender means a system line. */
const SYSTEM_RE = new RegExp(SYSTEM_PATTERNS.map((re) => re.source).join('|'), 'i');

export function splitSender(rest) {
  const index = rest.indexOf(': ');
  if (index > 0 && index <= 60) {
    const sender = rest.slice(0, index).trim();
    const text = rest.slice(index + 2);
    if (rest.length < 30 || !SYSTEM_RE.test(rest)) return { sender, text };
  }
  return { sender: null, text: rest };
}

export function classify(text) {
  // Media placeholders and deleted-message notices are short; everything else is text.
  if (text.length > 60) return 'text';
  const trimmed = text.trim();
  if (MEDIA_PATTERNS.some((re) => re.test(trimmed))) return 'media';
  if (DELETED_PATTERNS.some((re) => re.test(trimmed))) return 'deleted';
  return 'text';
}

export const isEdited = (text) => EDITED_SUFFIX.test(text);
export const stripEdited = (text) => text.replace(EDITED_SUFFIX, '').trim();

/** Header of a message line, or null. `parts` are raw strings; dates are resolved later. */
export function matchHeader(format, line) {
  const m = line.match(format.re);
  if (!m) return null;
  return {
    a: m[1], b: m[2], c: m[3], h: m[4], mi: m[5], s: m[6], meridiem: m[7] || '', rest: m[8],
  };
}

/** Which format matches the most of the given lines. */
export function detectFormat(lines) {
  let best = null;
  for (const format of FORMATS) {
    const hits = lines.filter((line) => matchHeader(format, line)).length;
    if (!best || hits > best.hits) best = { format, hits };
  }
  return best && best.hits > 0 ? { ...best, rate: best.hits / Math.max(1, lines.length) } : null;
}

/**
 * Day-first, month-first or year-first. A number above 12 in a slot proves it is
 * the day; with no proof, `fallback` decides.
 */
export function detectDateOrder(headers, fallback = 'dmy') {
  let firstIsDay = false;
  let secondIsDay = false;
  for (const header of headers) {
    if (header.a.length === 4) return 'ymd';
    if (Number(header.a) > 12) firstIsDay = true;
    if (Number(header.b) > 12) secondIsDay = true;
  }
  if (firstIsDay && !secondIsDay) return 'dmy';
  if (secondIsDay && !firstIsDay) return 'mdy';
  return fallback;
}

/** → epoch ms treating the printed wall-clock time as UTC (calendar semantics do not depend on the viewer's time zone), or null. */
export function toTimestamp(header, order) {
  let y; let m; let d;
  if (order === 'ymd') { y = +header.a; m = +header.b; d = +header.c; } else if (order === 'mdy') { m = +header.a; d = +header.b; y = +header.c; } else { d = +header.a; m = +header.b; y = +header.c; }
  if (y < 100) y += 2000;
  let hours = +header.h;
  const minutes = +header.mi;
  const seconds = header.s ? +header.s : 0;
  if (header.meridiem) {
    const pm = header.meridiem.charAt(0).toLowerCase() === 'p';
    if (pm && hours < 12) hours += 12;
    if (!pm && hours === 12) hours = 0;
  }
  if (m < 1 || m > 12 || d < 1 || d > 31 || hours > 23 || minutes > 59) return null;
  const ts = Date.UTC(y, m - 1, d, hours, minutes, seconds);
  // Reject impossible dates such as 31 February, which Date.UTC would roll over.
  return new Date(ts).getUTCDate() === d ? ts : null;
}
