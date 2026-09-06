/**
 * Generates public/og-cover.png — the 1200x630 social share image.
 *
 * Written by hand rather than pulled from a design tool so the image can be
 * regenerated whenever the wording changes, without adding an image library to
 * the dependency tree. Run with: npm run og:image
 */
import zlib from 'node:zlib';
import { readFileSync, writeFileSync } from 'node:fs';

const W = 1200;
const H = 630;

/* ---------------------------------------------------- minimal PNG decoding */
function decodePng(file) {
  const bytes = readFileSync(file);
  let cursor = 8;
  let width; let height; let depth; let colourType;
  const idat = [];
  while (cursor < bytes.length) {
    const length = bytes.readUInt32BE(cursor);
    const type = bytes.toString('ascii', cursor + 4, cursor + 8);
    const data = bytes.subarray(cursor + 8, cursor + 8 + length);
    if (type === 'IHDR') {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4);
      depth = data[8]; colourType = data[9];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
    cursor += 12 + length;
  }
  if (depth !== 8 || (colourType !== 2 && colourType !== 6)) {
    throw new Error(`Unsupported PNG (colour type ${colourType}, depth ${depth})`);
  }
  const channels = colourType === 6 ? 4 : 3;
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const out = Buffer.alloc(height * stride);
  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x += 1) {
      const a = x >= channels ? out[y * stride + x - channels] : 0;
      const b = y > 0 ? out[(y - 1) * stride + x] : 0;
      const c = (x >= channels && y > 0) ? out[(y - 1) * stride + x - channels] : 0;
      let value = line[x];
      if (filter === 1) value += a;
      else if (filter === 2) value += b;
      else if (filter === 3) value += (a + b) >> 1;
      else if (filter === 4) {
        const pa = Math.abs(b - c); const pb = Math.abs(a - c); const pc = Math.abs(a + b - 2 * c);
        value += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c);
      }
      out[y * stride + x] = value & 255;
    }
  }
  return { width, height, channels, data: out };
}

/* ------------------------------------------------------- 5x7 bitmap font */
const GLYPHS = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  '&': ['01100', '10010', '10010', '01100', '10101', '10010', '01101'],
  '+': ['00000', '00100', '00100', '11111', '00100', '00100', '00000'],
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
  '.': ['00000', '00000', '00000', '00000', '00000', '00000', '00100'],
};

const textWidth = (text, scale, spacing) => text.length * (5 * scale + spacing) - spacing;

function drawText(px, text, startX, startY, scale, colour, spacing) {
  let x = startX;
  for (const char of text.toUpperCase()) {
    const glyph = GLYPHS[char] || GLYPHS[' '];
    glyph.forEach((row, gy) => {
      [...row].forEach((bit, gx) => {
        if (bit !== '1') return;
        for (let dy = 0; dy < scale; dy += 1) {
          for (let dx = 0; dx < scale; dx += 1) {
            const py = startY + gy * scale + dy;
            const pxx = x + gx * scale + dx;
            if (py < 0 || py >= H || pxx < 0 || pxx >= W) continue;
            const i = (py * W + pxx) * 3;
            px[i] = colour[0]; px[i + 1] = colour[1]; px[i + 2] = colour[2];
          }
        }
      });
    });
    x += 5 * scale + spacing;
  }
}

/* ------------------------------------------------------------- background */
const px = Buffer.alloc(W * H * 3);
for (let y = 0; y < H; y += 1) {
  for (let x = 0; x < W; x += 1) {
    const t = y / H;
    const u = x / W;
    const glow = Math.max(0, 1 - Math.hypot((u - 0.5) * 1.3, (t - 0.5) * 1.9)) ** 2.2;
    const i = (y * W + x) * 3;
    px[i] = Math.round(2 + 8 * t + 92 * glow);
    px[i + 1] = Math.round(6 + 10 * t + 96 * glow);
    px[i + 2] = Math.round(23 + 26 * t + 200 * glow);
  }
}

/* ------------------------------------------------------------------ logo */
const logo = decodePng('public/2.png');
const LOGO_SIZE = 150;
const logoX = Math.round((W - LOGO_SIZE) / 2);
const logoY = 96;
for (let y = 0; y < LOGO_SIZE; y += 1) {
  for (let x = 0; x < LOGO_SIZE; x += 1) {
    const sx = Math.floor((x * logo.width) / LOGO_SIZE);
    const sy = Math.floor((y * logo.height) / LOGO_SIZE);
    const si = (sy * logo.width + sx) * logo.channels;
    // The source art is dark on a light ground; use luminance as an ink mask
    // and paint it white so it reads on the dark background.
    const luminance = (logo.data[si] * 0.299 + logo.data[si + 1] * 0.587 + logo.data[si + 2] * 0.114) / 255;
    const alpha = logo.channels === 4 ? logo.data[si + 3] / 255 : 1;
    const ink = (1 - luminance) * alpha;
    if (ink < 0.04) continue;
    const di = ((logoY + y) * W + (logoX + x)) * 3;
    for (let c = 0; c < 3; c += 1) px[di + c] = Math.round(255 * ink + px[di + c] * (1 - ink));
  }
}

/* ------------------------------------------------------------------ text */
const WHITE = [255, 255, 255];
const ACCENT = [165, 180, 252];

const title = 'TALK & TOOL';
const titleScale = 11;
const titleSpacing = 9;
drawText(px, title, Math.round((W - textWidth(title, titleScale, titleSpacing)) / 2), 300, titleScale, WHITE, titleSpacing);

const tagline = 'FREE ONLINE TOOLS';
const tagScale = 5;
const tagSpacing = 6;
drawText(px, tagline, Math.round((W - textWidth(tagline, tagScale, tagSpacing)) / 2), 420, tagScale, ACCENT, tagSpacing);

const sub = 'CALCULATORS . CONVERTERS . DEV TOOLS';
const subScale = 3;
const subSpacing = 4;
drawText(px, sub, Math.round((W - textWidth(sub, subScale, subSpacing)) / 2), 490, subScale, [148, 163, 184], subSpacing);

/* ---------------------------------------------------------------- encode */
const crcTable = [...Array(256)].map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc = (buffer) => {
  let c = 0xFFFFFFFF;
  for (const byte of buffer) c = crcTable[(c ^ byte) & 255] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
};
const chunk = (type, data) => {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const typed = Buffer.concat([Buffer.from(type), data]);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc(typed));
  return Buffer.concat([length, typed, checksum]);
};

const scanlines = Buffer.alloc(H * (1 + W * 3));
for (let y = 0; y < H; y += 1) {
  scanlines[y * (1 + W * 3)] = 0;
  px.copy(scanlines, y * (1 + W * 3) + 1, y * W * 3, (y + 1) * W * 3);
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8;
ihdr[9] = 2;

writeFileSync('public/og-cover.png', Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', ihdr),
  chunk('IDAT', zlib.deflateSync(scanlines, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
]));

console.log(`[og] Wrote public/og-cover.png (${W}x${H})`);
