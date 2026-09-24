/**
 * Finds JPEG streams inside another file. Every camera RAW format (CR2, NEF,
 * ARW, DNG…) embeds one or more JPEG previews, including one at or near full
 * size, so "quick" conversion is a matter of cutting the biggest JPEG out of the
 * container, which takes milliseconds instead of a full decode.
 *
 * A candidate is found by its start-of-image marker and validated by walking its
 * marker segments to the end-of-image marker, so random matches in raw sensor
 * data are rejected.
 */

// Baseline (C0), extended sequential (C1) and progressive (C2) only. Lossless JPEG (C3) is how DNG and
// some RAW formats store the sensor data itself, which is not a picture anyone can view.
const isSof = (marker) => marker === 0xc0 || marker === 0xc1 || marker === 0xc2;
const isOtherSof = (marker) => marker >= 0xc3 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;

/** → { end, width, height } for a JPEG starting at `start`, or null if the bytes are not a whole JPEG. */
function walkJpeg(bytes, start) {
  let p = start + 2;
  let width = 0;
  let height = 0;
  const n = bytes.length;
  while (p + 3 < n) {
    if (bytes[p] !== 0xff) return null;
    const marker = bytes[p + 1];
    if (marker === 0xff) { p += 1; continue; }
    if (marker === 0xd9) return width ? { end: p + 2, width, height } : null;
    if ((marker >= 0xd0 && marker <= 0xd7) || marker === 0x01 || marker === 0x00) { p += 2; continue; }
    const length = (bytes[p + 2] << 8) | bytes[p + 3];
    if (length < 2) return null;
    if (isOtherSof(marker)) return null;
    if (isSof(marker)) { height = (bytes[p + 5] << 8) | bytes[p + 6]; width = (bytes[p + 7] << 8) | bytes[p + 8]; }
    p += 2 + length;
    if (marker === 0xda) {
      // Entropy-coded data: runs until a marker that is not a stuffed 0xFF00 or a restart.
      while (p + 1 < n) {
        if (bytes[p] === 0xff) {
          const next = bytes[p + 1];
          if (next === 0x00 || (next >= 0xd0 && next <= 0xd7)) { p += 2; continue; }
          if (next === 0xff) { p += 1; continue; }
          break;
        }
        p += 1;
      }
    }
  }
  return null;
}

/** Every complete JPEG inside `bytes`: [{ start, end, width, height }]. */
export function findJpegs(bytes) {
  const found = [];
  const n = bytes.length;
  for (let i = 0; i + 3 < n; i += 1) {
    if (bytes[i] === 0xff && bytes[i + 1] === 0xd8 && bytes[i + 2] === 0xff) {
      const walked = walkJpeg(bytes, i);
      if (walked) {
        found.push({ start: i, ...walked });
        i = walked.end - 1;
      }
    }
  }
  return found;
}

/** The embedded JPEG with the most pixels (the full-size preview), or null. */
export function largestJpeg(bytes) {
  const all = findJpegs(bytes);
  if (!all.length) return null;
  return all.reduce((best, item) => (item.width * item.height > best.width * best.height ? item : best));
}
