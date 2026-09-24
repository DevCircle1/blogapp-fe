import exifr from 'exifr';
import piexif from 'piexifjs';

/**
 * Photo metadata. Read with exifr (HEIC, JPEG and the TIFF-based RAW formats),
 * written back into the output JPEG with piexifjs. The choice of what to keep is
 * explicit: everything useful (camera, lens, date, exposure, orientation), with
 * GPS as a separate switch, or nothing at all.
 */

const READ = {
  tiff: true, exif: true, gps: true, ifd0: true, ifd1: false, interop: false, xmp: false, icc: false, iptc: false, jfif: false, mergeOutput: true, translateKeys: true, translateValues: false, reviveValues: false, sanitize: true,
};

/** → plain object of the fields we care about, plus `hasGps`. Never throws: unreadable metadata is just empty. */
export async function readMeta(source) {
  try {
    const raw = (await exifr.parse(source, READ)) || {};
    const gps = typeof raw.latitude === 'number' && typeof raw.longitude === 'number';
    return {
      make: raw.Make, model: raw.Model, lens: raw.LensModel, lensMake: raw.LensMake,
      dateOriginal: typeof raw.DateTimeOriginal === 'string' ? raw.DateTimeOriginal : undefined,
      dateDigitized: typeof raw.CreateDate === 'string' ? raw.CreateDate : undefined,
      offsetOriginal: raw.OffsetTimeOriginal,
      exposureTime: raw.ExposureTime, fNumber: raw.FNumber, iso: raw.ISO, focalLength: raw.FocalLength, focal35: raw.FocalLengthIn35mmFormat,
      orientation: typeof raw.Orientation === 'number' ? raw.Orientation : 1,
      width: raw.ExifImageWidth || raw.ImageWidth, height: raw.ExifImageHeight || raw.ImageHeight,
      hasGps: gps,
      latitude: gps ? raw.latitude : undefined,
      longitude: gps ? raw.longitude : undefined,
      altitude: typeof raw.GPSAltitude === 'number' ? raw.GPSAltitude : undefined,
      altitudeBelow: raw.GPSAltitudeRef === 1,
    };
  } catch {
    return { orientation: 1, hasGps: false };
  }
}

/** A short "Camera · lens · date" line for the file card. */
export function describeMeta(meta) {
  const camera = [meta.make, meta.model].filter(Boolean).join(' ').replace(/(\b\w+\b) \1/i, '$1');
  const date = meta.dateOriginal ? meta.dateOriginal.slice(0, 10).replace(/:/g, '-') : '';
  return [camera, meta.lens, date].filter(Boolean).join(' · ');
}

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
/** A float as an EXIF rational [numerator, denominator]. */
export function toRational(value, maxDen = 1000000) {
  if (!Number.isFinite(value)) return [0, 1];
  if (Number.isInteger(value)) return [value, 1];
  let den = 1;
  while (den < maxDen && Math.abs(value * den - Math.round(value * den)) > 1e-9) den *= 10;
  const num = Math.round(value * den);
  const g = gcd(Math.abs(num), den) || 1;
  return [num / g, den / g];
}

const dms = (decimal) => {
  const abs = Math.abs(decimal);
  const degrees = Math.floor(abs);
  const minutesFloat = (abs - degrees) * 60;
  const minutes = Math.floor(minutesFloat);
  const seconds = (minutesFloat - minutes) * 60;
  return [[degrees, 1], [minutes, 1], [Math.round(seconds * 10000), 10000]];
};

const str = (v) => (v === undefined || v === null ? undefined : String(v));

/**
 * → binary string of an EXIF payload ("Exif NUL  NUL " + TIFF), which replaceExif wraps in an APP1 segment.
 * `orientation` is the value to write (1 when the pixels were already rotated).
 */
export function buildExif(meta, { keepGps, orientation }) {
  const zeroth = {};
  const exif = {};
  const gps = {};
  if (meta.make) zeroth[piexif.ImageIFD.Make] = str(meta.make);
  if (meta.model) zeroth[piexif.ImageIFD.Model] = str(meta.model);
  zeroth[piexif.ImageIFD.Orientation] = orientation || 1;
  if (meta.dateOriginal) exif[piexif.ExifIFD.DateTimeOriginal] = meta.dateOriginal;
  if (meta.dateDigitized) exif[piexif.ExifIFD.DateTimeDigitized] = meta.dateDigitized;
  if (typeof meta.exposureTime === 'number') exif[piexif.ExifIFD.ExposureTime] = toRational(meta.exposureTime);
  if (typeof meta.fNumber === 'number') exif[piexif.ExifIFD.FNumber] = toRational(meta.fNumber, 100);
  if (typeof meta.iso === 'number') exif[piexif.ExifIFD.ISOSpeedRatings] = Math.round(meta.iso);
  if (typeof meta.focalLength === 'number') exif[piexif.ExifIFD.FocalLength] = toRational(meta.focalLength, 100);
  if (typeof meta.focal35 === 'number') exif[piexif.ExifIFD.FocalLengthIn35mmFilm] = Math.round(meta.focal35);
  if (meta.lens) exif[piexif.ExifIFD.LensModel] = str(meta.lens);
  if (meta.lensMake) exif[piexif.ExifIFD.LensMake] = str(meta.lensMake);
  exif[piexif.ExifIFD.ColorSpace] = 1; // sRGB: the output is always converted to it
  if (keepGps && meta.hasGps) {
    gps[piexif.GPSIFD.GPSVersionID] = [2, 3, 0, 0];
    gps[piexif.GPSIFD.GPSLatitudeRef] = meta.latitude >= 0 ? 'N' : 'S';
    gps[piexif.GPSIFD.GPSLatitude] = dms(meta.latitude);
    gps[piexif.GPSIFD.GPSLongitudeRef] = meta.longitude >= 0 ? 'E' : 'W';
    gps[piexif.GPSIFD.GPSLongitude] = dms(meta.longitude);
    if (typeof meta.altitude === 'number') {
      gps[piexif.GPSIFD.GPSAltitudeRef] = meta.altitudeBelow ? 1 : 0;
      gps[piexif.GPSIFD.GPSAltitude] = toRational(Math.abs(meta.altitude), 100);
    }
  }
  return piexif.dump({ '0th': zeroth, Exif: exif, GPS: gps, '1st': {}, thumbnail: null });
}

const binaryToBytes = (binary) => Uint8Array.from(binary, (ch) => ch.charCodeAt(0) & 0xff);

/** Returns `jpeg` with its EXIF replaced by `exifBinary` (from buildExif), or with none when null. */
export function replaceExif(jpeg, exifBinary) {
  if (jpeg[0] !== 0xff || jpeg[1] !== 0xd8) return jpeg;
  // Copy the segments before the image data, dropping any existing EXIF (APP1 "Exif").
  const kept = [];
  let p = 2;
  while (p + 4 < jpeg.length && jpeg[p] === 0xff) {
    const marker = jpeg[p + 1];
    if (marker === 0xda) break;
    const length = (jpeg[p + 2] << 8) | jpeg[p + 3];
    const isExif = marker === 0xe1 && jpeg[p + 4] === 0x45 && jpeg[p + 5] === 0x78 && jpeg[p + 6] === 0x69 && jpeg[p + 7] === 0x66;
    if (!isExif) kept.push({ marker, bytes: jpeg.subarray(p, p + 2 + length) });
    p += 2 + length;
  }
  const payload = exifBinary ? binaryToBytes(exifBinary) : null;
  // APP1 marker + big-endian length (which counts its own two bytes) + payload.
  const exifBytes = payload ? Uint8Array.from([0xff, 0xe1, (payload.length + 2) >> 8, (payload.length + 2) & 0xff, ...payload]) : null;
  const parts = [jpeg.subarray(0, 2)];
  // APP0 (JFIF), if present, stays first; EXIF goes right after it.
  const app0 = kept.filter((s) => s.marker === 0xe0);
  app0.forEach((s) => parts.push(s.bytes));
  if (exifBytes) parts.push(exifBytes);
  kept.filter((s) => s.marker !== 0xe0).forEach((s) => parts.push(s.bytes));
  parts.push(jpeg.subarray(p));
  const out = new Uint8Array(parts.reduce((n, part) => n + part.length, 0));
  let at = 0;
  parts.forEach((part) => { out.set(part, at); at += part.length; });
  return out;
}
