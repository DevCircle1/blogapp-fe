/**
 * ICC colour handling. Photos are often not in sRGB: iPhones shoot Display P3,
 * some cameras write Adobe RGB. A file's numbers only mean the right colour in
 * the profile they were made for, so writing them out as if they were sRGB
 * makes colours look flat and desaturated. This reads a matrix/TRC RGB profile
 * and converts pixels to sRGB properly.
 */

const be32 = (b, o) => ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0;
const be16 = (b, o) => (b[o] << 8) | b[o + 1];
const s15 = (b, o) => ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) / 65536;
const sig = (b, o) => String.fromCharCode(b[o], b[o + 1], b[o + 2], b[o + 3]);

// sRGB colorants (D50-adapted, as in the sRGB ICC profile) and the D50 XYZ → linear sRGB matrix.
const SRGB_XYZ = [[0.4360747, 0.2225045, 0.0139322], [0.3850649, 0.7168786, 0.0971045], [0.1430804, 0.0606169, 0.7141733]];
const XYZ_TO_SRGB = [
  [3.1338561, -1.6168667, -0.4906146],
  [-0.9787684, 1.9161415, 0.0334540],
  [0.0719453, -0.2289914, 1.4052427],
];

function readCurve(bytes, offset, size) {
  const type = sig(bytes, offset);
  if (type === 'curv') {
    const count = be32(bytes, offset + 8);
    if (count === 0) return (x) => x;
    if (count === 1) { const gamma = be16(bytes, offset + 12) / 256; return (x) => x ** gamma; }
    const table = Array.from({ length: count }, (_, i) => be16(bytes, offset + 12 + i * 2) / 65535);
    return (x) => { const f = x * (count - 1); const i = Math.floor(f); return i >= count - 1 ? table[count - 1] : table[i] + (table[i + 1] - table[i]) * (f - i); };
  }
  if (type === 'para') {
    const kind = be16(bytes, offset + 8);
    const count = [1, 3, 4, 5, 7][kind];
    const [g, a = 1, b = 0, c = 0, d = 0, e = 0, f = 0] = Array.from({ length: count }, (_, i) => s15(bytes, offset + 12 + i * 4));
    if (kind === 0) return (x) => x ** g;
    if (kind === 1) return (x) => (x >= -b / a ? (a * x + b) ** g : 0);
    if (kind === 2) return (x) => (x >= -b / a ? (a * x + b) ** g + c : c);
    if (kind === 3) return (x) => (x >= d ? (a * x + b) ** g : c * x);
    return (x) => (x >= d ? (a * x + b) ** g + e : c * x + f);
  }
  void size;
  return null;
}

/** → { columns: [[X,Y,Z] ×3], curves: [fn ×3], description } for an RGB matrix/TRC profile, or null. */
export function parseIcc(bytes) {
  if (!bytes || bytes.length < 132 || sig(bytes, 36) !== 'acsp' || sig(bytes, 16) !== 'RGB ') return null;
  const count = be32(bytes, 128);
  const tags = {};
  for (let i = 0; i < count; i += 1) {
    const at = 132 + i * 12;
    tags[sig(bytes, at)] = { offset: be32(bytes, at + 4), size: be32(bytes, at + 8) };
  }
  const xyz = (name) => (tags[name] ? [s15(bytes, tags[name].offset + 8), s15(bytes, tags[name].offset + 12), s15(bytes, tags[name].offset + 16)] : null);
  const columns = [xyz('rXYZ'), xyz('gXYZ'), xyz('bXYZ')];
  const curves = ['rTRC', 'gTRC', 'bTRC'].map((name) => (tags[name] ? readCurve(bytes, tags[name].offset, tags[name].size) : null));
  if (columns.some((c) => !c) || curves.some((c) => !c)) return null; // LUT-based profiles are not supported
  let description = '';
  if (tags.desc) {
    const o = tags.desc.offset;
    if (sig(bytes, o) === 'desc') description = String.fromCharCode(...bytes.subarray(o + 12, o + 12 + Math.max(0, be32(bytes, o + 8) - 1)));
    else if (sig(bytes, o) === 'mluc') description = new TextDecoder('utf-16be').decode(bytes.subarray(o + be32(bytes, o + 24), o + be32(bytes, o + 24) + be32(bytes, o + 20)));
  }
  return { columns, curves, description };
}

/** True when the profile's primaries are those of sRGB, so no conversion is needed. */
export function isSrgbPrimaries(profile) {
  return profile.columns.every((column, i) => column.every((v, j) => Math.abs(v - SRGB_XYZ[i][j]) < 0.006));
}

const OETF_STEPS = 4095;
const oetf = (() => {
  const lut = new Uint8ClampedArray(OETF_STEPS + 1);
  for (let i = 0; i <= OETF_STEPS; i += 1) {
    const v = i / OETF_STEPS;
    lut[i] = Math.round((v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055) * 255);
  }
  return lut;
})();

/**
 * Converts RGBA pixels from the profile's colour space to sRGB, in place.
 * Out-of-gamut colours are clipped. Returns false (and does nothing) if the
 * profile is already sRGB or cannot be used.
 */
export function convertToSrgb(rgba, profile) {
  if (!profile || isSrgbPrimaries(profile)) return false;
  const lut = profile.curves.map((curve) => Float32Array.from({ length: 256 }, (_, i) => Math.min(1, Math.max(0, curve(i / 255)))));
  // Combined matrix: profile RGB (linear) → XYZ D50 → linear sRGB.
  const cols = profile.columns;
  const m = XYZ_TO_SRGB.map((row) => cols.map((_, c) => row[0] * cols[c][0] + row[1] * cols[c][1] + row[2] * cols[c][2]));
  const clamp = (v) => (v <= 0 ? 0 : v >= 1 ? OETF_STEPS : (v * OETF_STEPS + 0.5) | 0);
  for (let i = 0; i < rgba.length; i += 4) {
    const r = lut[0][rgba[i]]; const g = lut[1][rgba[i + 1]]; const b = lut[2][rgba[i + 2]];
    rgba[i] = oetf[clamp(m[0][0] * r + m[0][1] * g + m[0][2] * b)];
    rgba[i + 1] = oetf[clamp(m[1][0] * r + m[1][1] * g + m[1][2] * b)];
    rgba[i + 2] = oetf[clamp(m[2][0] * r + m[2][1] * g + m[2][2] * b)];
  }
  return true;
}

/** The ICC profile inside a HEIC/HEIF file (the `colr` box of type `prof`), or null. */
export function extractHeicIcc(bytes) {
  for (let i = 4; i + 12 < bytes.length; i += 1) {
    if (bytes[i] === 0x63 && bytes[i + 1] === 0x6f && bytes[i + 2] === 0x6c && bytes[i + 3] === 0x72) { // "colr"
      const type = sig(bytes, i + 4);
      if (type === 'prof' || type === 'rICC') {
        const size = be32(bytes, i - 4);
        const icc = bytes.subarray(i + 8, i - 4 + size);
        if (icc.length > 132 && sig(icc, 36) === 'acsp') return icc;
      }
    }
  }
  return null;
}

/** The ICC profile in a JPEG's APP2 segments (possibly split across several), or null. */
export function extractJpegIcc(bytes) {
  const chunks = [];
  let p = 2;
  while (p + 4 < bytes.length && bytes[p] === 0xff) {
    const marker = bytes[p + 1];
    if (marker === 0xda || marker === 0xd9) break;
    const length = (bytes[p + 2] << 8) | bytes[p + 3];
    if (marker === 0xe2 && String.fromCharCode(...bytes.subarray(p + 4, p + 15)) === 'ICC_PROFILE') chunks.push({ seq: bytes[p + 16], data: bytes.subarray(p + 18, p + 2 + length) });
    p += 2 + length;
  }
  if (!chunks.length) return null;
  chunks.sort((a, b) => a.seq - b.seq);
  const out = new Uint8Array(chunks.reduce((n, c) => n + c.data.length, 0));
  let at = 0;
  chunks.forEach((c) => { out.set(c.data, at); at += c.data.length; });
  return out;
}
