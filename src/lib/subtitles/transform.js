/**
 * Timing and merge operations on the cue model. All pure: they return new
 * cues (and a report where something was changed), and never fix a problem
 * without saying so.
 */

const reindex = (cues) => cues.map((cue, i) => ({ ...cue, index: i + 1 }));

/** Adds `ms` (negative allowed) to every cue. Times below zero clamp to 0 and are counted. */
export function shift(cues, ms) {
  let clamped = 0;
  const out = cues.map((cue) => {
    const start = cue.start + ms;
    const end = cue.end + ms;
    if (start < 0 || end < 0) clamped += 1;
    return { ...cue, start: Math.max(0, start), end: Math.max(0, end) };
  });
  return { cues: out, clamped };
}

/** Multiplies every time by `ratio`: the fix for a frame-rate mismatch. */
export const scale = (cues, ratio) => cues.map((cue) => ({ ...cue, start: Math.round(cue.start * ratio), end: Math.round(cue.end * ratio) }));

/** Frame-rate presets: [label, ratio]. Playing 23.976 material at 25 fps needs times multiplied by 23.976/25. */
export const FPS_PRESETS = [
  ['23.976 → 25 fps', 23.976 / 25],
  ['25 → 23.976 fps', 25 / 23.976],
  ['29.97 → 30 fps', 29.97 / 30],
  ['30 → 29.97 fps', 30 / 29.97],
  ['24 → 25 fps', 24 / 25],
  ['25 → 24 fps', 25 / 24],
];

/**
 * From the true start time of the first and last cue, solves actual = scale × current + offset
 * and applies it to every start and end. Returns the derived values so they can be shown.
 */
export function twoPointSync(cues, firstActual, lastActual) {
  if (cues.length < 2) return { error: 'Two-point sync needs at least two cues.' };
  const s1 = cues[0].start;
  const sN = cues[cues.length - 1].start;
  if (sN === s1) return { error: 'The first and last cues start at the same time.' };
  const factor = (lastActual - firstActual) / (sN - s1);
  const offset = firstActual - factor * s1;
  const out = cues.map((cue) => ({ ...cue, start: Math.max(0, Math.round(cue.start * factor + offset)), end: Math.max(0, Math.round(cue.end * factor + offset)) }));
  return { cues: out, scale: factor, offset };
}

/** Ends each cue at least `gap` ms before the next one starts, and repairs cues that end before they begin. */
export function fixOverlaps(cues, gap = 1) {
  let changed = 0;
  const out = cues.map((cue) => ({ ...cue }));
  out.forEach((cue, i) => {
    const next = out[i + 1];
    if (next && cue.end > next.start - gap && next.start - gap > cue.start) { cue.end = next.start - gap; changed += 1; }
    if (cue.end <= cue.start) { cue.end = cue.start + 500; changed += 1; }
  });
  return { cues: out, changed };
}

const overlap = (a, b) => Math.max(0, Math.min(a.end, b.end) - Math.max(a.start, b.start));

/**
 * Bilingual merge. `stacked`: each cue of A gets the best-overlapping cue of B on a second line,
 * shown smaller. `interleaved`: both lists keep their own timings, sorted together.
 */
export function merge(a, b, mode = 'stacked') {
  if (mode === 'interleaved') {
    return reindex([...a, ...b].sort((x, y) => x.start - y.start || x.end - y.end).map((cue) => { const copy = { ...cue }; delete copy.settings; return copy; }));
  }
  const used = new Set();
  const out = a.map((cue) => {
    let best = -1; let bestOverlap = 0;
    b.forEach((other, i) => { const o = overlap(cue, other); if (o > bestOverlap) { best = i; bestOverlap = o; } });
    if (best === -1) return { ...cue };
    used.add(best);
    return { ...cue, text: `${cue.text}\n<small>${b[best].text.replace(/\n/g, ' ')}</small>` };
  });
  // Cues of B that matched nothing are kept so no text is lost.
  b.forEach((cue, i) => { if (!used.has(i)) out.push({ ...cue, text: `<small>${cue.text.replace(/\n/g, ' ')}</small>` }); });
  return reindex(out.sort((x, y) => x.start - y.start));
}
