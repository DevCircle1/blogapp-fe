import { largestJpeg } from './jpegScan.js';
import {
  convertToSrgb, extractHeicIcc, extractJpegIcc, parseIcc,
} from './icc.js';
import { buildExif, readMeta, replaceExif } from './meta.js';

/**
 * One conversion, start to finish, inside a Worker: read the file, decode it
 * (HEIC via libheif, RAW via its embedded preview or a full LibRaw decode,
 * everything else via the browser), convert colours to sRGB, resize, encode
 * with the WASM ports of MozJPEG / OxiPNG / libwebp, and write the chosen EXIF.
 * Decoders are imported lazily, so a HEIC never downloads the RAW decoder.
 *
 * Nothing here touches the network with image data: it is bytes in, bytes out.
 */

const RAW_EXTENSIONS = new Set(['cr2', 'cr3', 'crw', 'nef', 'nrw', 'arw', 'srf', 'sr2', 'dng', 'raf', 'rw2', 'orf', 'pef', 'srw', '3fr', 'erf', 'kdc', 'mrw', 'x3f', 'iiq']);
const HEIC_EXTENSIONS = new Set(['heic', 'heif', 'hif']);

export const kindOf = (name, bytes) => {
  const ext = (name.split('.').pop() || '').toLowerCase();
  if (RAW_EXTENSIONS.has(ext)) return 'raw';
  if (HEIC_EXTENSIONS.has(ext)) return 'heic';
  const brand = String.fromCharCode(...bytes.subarray(4, 12));
  if (/^ftyp(heic|heix|hevc|hevx|mif1|msf1)/.test(brand)) return 'heic';
  return 'browser';
};

const isNode = typeof self === 'undefined';

async function decodeHeic(bytes) {
  const mod = await import('libheif-js/wasm-bundle');
  const libheif = mod.default || mod;
  const decoder = new libheif.HeifDecoder();
  const images = decoder.decode(bytes);
  if (!images || !images.length) throw Object.assign(new Error('no image'), { code: 'DECODE' });
  const image = images[0];
  const width = image.get_width();
  const height = image.get_height();
  const pixels = new Uint8ClampedArray(width * height * 4);
  await new Promise((resolve, reject) => image.display({ data: pixels, width, height }, (out) => (out ? resolve(out) : reject(Object.assign(new Error('heif'), { code: 'DECODE' })))));
  const icc = extractHeicIcc(bytes);
  const profile = icc ? parseIcc(icc) : null;
  const converted = convertToSrgb(pixels, profile);
  return { pixels, width, height, orientation: 1, colour: converted ? `${profile.description || 'wide-gamut profile'} → sRGB` : null };
}

async function decodeRawFull(bytes) {
  const { default: LibRaw } = await import('libraw-wasm');
  const raw = new LibRaw();
  await raw.open(bytes, {
    outputColor: 1, outputBps: 8, useCameraWb: true, useAutoWb: false, halfSize: false, noAutoBright: false, userQual: 3,
  });
  const image = await raw.imageData();
  const { width, height } = image;
  const channels = Math.round(image.data.length / (width * height));
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let i = 0, j = 0; i < width * height; i += 1, j += 4) {
    const s = i * channels;
    pixels[j] = image.data[s]; pixels[j + 1] = image.data[s + 1]; pixels[j + 2] = image.data[s + 2]; pixels[j + 3] = 255;
  }
  // LibRaw applies the camera's orientation itself.
  return { pixels, width, height, orientation: 1, colour: 'developed to sRGB by LibRaw' };
}

async function decodeJpegBytes(jpeg) {
  const { decode } = await import('@jsquash/jpeg');
  const image = await decode(jpeg.buffer.slice(jpeg.byteOffset, jpeg.byteOffset + jpeg.byteLength));
  const icc = extractJpegIcc(jpeg);
  const profile = icc ? parseIcc(icc) : null;
  const converted = convertToSrgb(image.data, profile);
  return { pixels: image.data, width: image.width, height: image.height, colour: converted ? `${profile.description || 'embedded profile'} → sRGB` : null };
}

async function decodeWithBrowser(bytes) {
  const bitmap = await createImageBitmap(new Blob([bytes]));
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(bitmap, 0, 0);
  const image = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  bitmap.close();
  return { pixels: image.data, width: image.width, height: image.height, orientation: 1, colour: null };
}

/** Rotates or flips pixels to match an EXIF orientation (2–8); orientation 1 is left alone. */
async function orient(image, orientation) {
  if (!orientation || orientation === 1) return image;
  const swap = orientation >= 5;
  const w = swap ? image.height : image.width;
  const h = swap ? image.width : image.height;
  const source = new OffscreenCanvas(image.width, image.height);
  source.getContext('2d').putImageData(new ImageData(image.pixels, image.width, image.height), 0, 0);
  const target = new OffscreenCanvas(w, h);
  const ctx = target.getContext('2d', { willReadFrequently: true });
  const matrices = { 2: [-1, 0, 0, 1, w, 0], 3: [-1, 0, 0, -1, w, h], 4: [1, 0, 0, -1, 0, h], 5: [0, 1, 1, 0, 0, 0], 6: [0, 1, -1, 0, w, 0], 7: [0, -1, -1, 0, w, h], 8: [0, -1, 1, 0, 0, h] };
  ctx.setTransform(...matrices[orientation]);
  ctx.drawImage(source, 0, 0);
  const out = ctx.getImageData(0, 0, w, h);
  return { ...image, pixels: out.data, width: w, height: h };
}

async function resize(image, maxDim) {
  const longest = Math.max(image.width, image.height);
  if (!maxDim || longest <= maxDim) return image;
  const scale = maxDim / longest;
  const w = Math.max(1, Math.round(image.width * scale));
  const h = Math.max(1, Math.round(image.height * scale));
  const source = new OffscreenCanvas(image.width, image.height);
  source.getContext('2d').putImageData(new ImageData(image.pixels, image.width, image.height), 0, 0);
  const target = new OffscreenCanvas(w, h);
  const ctx = target.getContext('2d', { willReadFrequently: true });
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, w, h);
  const out = ctx.getImageData(0, 0, w, h);
  return { ...image, pixels: out.data, width: w, height: h };
}

async function encode(image, format, quality) {
  const data = new ImageData(image.pixels, image.width, image.height);
  if (format === 'png') { const { encode: png } = await import('@jsquash/png'); return new Uint8Array(await png(data)); }
  if (format === 'webp') { const { encode: webp } = await import('@jsquash/webp'); return new Uint8Array(await webp(data, { quality })); }
  const { encode: jpeg } = await import('@jsquash/jpeg');
  return new Uint8Array(await jpeg(data, { quality }));
}

const MIME = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

/**
 * options: { format: 'jpg'|'png'|'webp', quality (1–100), maxDim (0 = original),
 *            rawMode: 'quick'|'full', keepPreview (quick mode + JPEG: hand back the camera's own JPEG untouched),
 *            exif: 'keep'|'strip-gps'|'strip-all' }
 */
export async function convert(file, name, options) {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const kind = kindOf(name, bytes);
  const meta = await readMeta(bytes);
  const format = options.format;
  const keepGps = options.exif === 'keep';
  let note = '';
  let image;
  let passthrough = null;

  if (kind === 'raw' && options.rawMode !== 'full') {
    const preview = largestJpeg(bytes);
    if (!preview || preview.width * preview.height < 250000) throw Object.assign(new Error('no preview'), { code: 'NO_PREVIEW' });
    const jpeg = bytes.subarray(preview.start, preview.end);
    note = `embedded ${preview.width}×${preview.height} preview`;
    if (format === 'jpg' && !options.maxDim && options.keepPreview) passthrough = jpeg;
    else { image = await decodeJpegBytes(jpeg); image.orientation = meta.orientation; }
  } else if (kind === 'raw') {
    image = await decodeRawFull(bytes);
  } else if (kind === 'heic') {
    image = await decodeHeic(bytes);
  } else {
    image = await decodeWithBrowser(bytes);
  }

  let out;
  let width; let height;
  let orientationToWrite = 1;
  if (passthrough) {
    out = passthrough; width = 0; height = 0; orientationToWrite = meta.orientation;
    const embedded = largestJpeg(bytes);
    width = embedded.width; height = embedded.height;
  } else {
    image = await orient(image, image.orientation);
    image = await resize(image, options.maxDim);
    width = image.width; height = image.height;
    out = await encode(image, format, options.quality);
    if (image.colour) note = [note, image.colour].filter(Boolean).join('; ');
  }

  if (format === 'jpg') {
    const exif = options.exif === 'strip-all' ? null : buildExif(meta, { keepGps, orientation: orientationToWrite });
    out = replaceExif(out, exif);
  }
  return {
    bytes: out, mime: MIME[format], width, height, note, kind, meta: { hasGps: meta.hasGps },
  };
}

if (!isNode) {
  self.onmessage = async (event) => {
    const { id, file, name, options } = event.data;
    try {
      const result = await convert(file, name, options);
      self.postMessage({ id, type: 'done', ...result }, [result.bytes.buffer]);
    } catch (error) {
      self.postMessage({ id, type: 'error', code: error?.code || 'FAILED', message: String(error?.message || error) });
    }
  };
}
