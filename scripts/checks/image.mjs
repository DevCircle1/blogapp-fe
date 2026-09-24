/** Run: node scripts/checks/image.mjs <folder-with-samples> — checks the image engine on real HEIC and RAW files. */
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { findJpegs, largestJpeg } from '../../src/lib/image/jpegScan.js';
import {
  convertToSrgb, extractHeicIcc, extractJpegIcc, isSrgbPrimaries, parseIcc,
} from '../../src/lib/image/icc.js';
import {
  buildExif, describeMeta, readMeta, replaceExif, toRational,
} from '../../src/lib/image/meta.js';

const dir = process.argv[2];
let failed = 0;
const check = (name, ok, extra = '') => { if (!ok) { failed += 1; console.error('FAIL', name, extra); } };

// Rational conversion.
check('rational int', JSON.stringify(toRational(200)) === '[200,1]');
check('rational 1/125', JSON.stringify(toRational(0.008)) === '[1,125]', JSON.stringify(toRational(0.008)));
check('rational 2.8', JSON.stringify(toRational(2.8, 100)) === '[14,5]', JSON.stringify(toRational(2.8, 100)));

// Colour conversion on synthetic Display P3 data. Build a matrix profile the way an ICC file stores one.
const p3 = {
  columns: [[0.5151, 0.2412, -0.0011], [0.2920, 0.6922, 0.0419], [0.1571, 0.0666, 0.7841]],
  curves: [0, 1, 2].map(() => (x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)),
};
check('p3 is not srgb', !isSrgbPrimaries(p3));
const px = new Uint8ClampedArray([128, 128, 128, 255, 255, 0, 0, 255, 0, 255, 0, 255, 200, 100, 50, 255]);
convertToSrgb(px, p3);
check('grey stays grey', Math.abs(px[0] - 128) <= 2 && Math.abs(px[1] - 128) <= 2 && Math.abs(px[2] - 128) <= 2, [...px.slice(0, 3)].join());
check('p3 red clips to srgb red', px[4] >= 254 && px[5] <= 2 && px[6] <= 2, [...px.slice(4, 7)].join());
check('p3 green clips', px[9] >= 254 && px[8] <= 2, [...px.slice(8, 11)].join());
check('mid colour shifts to more saturated srgb values', px[12] > 200 && px[14] < 50, [...px.slice(12, 15)].join());
console.log('P3 (200,100,50) → sRGB', [...px.slice(12, 15)]);

if (dir) {
  for (const name of (await readdir(dir)).sort()) {
    const bytes = new Uint8Array(await readFile(path.join(dir, name)));
    const ext = path.extname(name).toLowerCase();
    const t = Date.now();
    const meta = await readMeta(bytes);
    const readMs = Date.now() - t;
    if (['.heic'].includes(ext)) {
      const icc = extractHeicIcc(bytes);
      const profile = icc ? parseIcc(icc) : null;
      console.log(name, '| meta:', describeMeta(meta) || '(none)', '| gps:', meta.hasGps, '| icc:', icc ? `${icc.length} B "${profile?.description}" srgb=${profile ? isSrgbPrimaries(profile) : '?'}` : 'none', `| exif read ${readMs} ms`);
      const exif = buildExif(meta, { keepGps: false, orientation: 1 });
      check(`${name} exif builds`, typeof exif === 'string' && exif.startsWith('Exif'));
    } else if (['.cr2', '.nef', '.arw', '.dng'].includes(ext)) {
      const s = Date.now();
      const all = findJpegs(bytes);
      const best = largestJpeg(bytes);
      console.log(name, '| meta:', describeMeta(meta) || '(none)', '| gps:', meta.hasGps, '| orientation:', meta.orientation, `| ${all.length} embedded JPEGs`, all.map((j) => `${j.width}x${j.height}`).join(', '), `| scan ${Date.now() - s} ms`, `| exif read ${readMs} ms`);
      check(`${name} has a preview`, Boolean(best) && best.width >= 500, JSON.stringify(best));
      if (best) {
        const jpeg = bytes.subarray(best.start, best.end);
        const iccJpeg = extractJpegIcc(jpeg);
        console.log('   largest preview', `${best.width}x${best.height}`, `${(jpeg.length / 1e6).toFixed(2)} MB`, 'icc:', iccJpeg ? parseIcc(iccJpeg)?.description || 'unparsed' : 'none (sRGB assumed)');
        const withExif = replaceExif(jpeg, buildExif(meta, { keepGps: true, orientation: meta.orientation }));
        const stripped = replaceExif(jpeg, null);
        check(`${name} exif inserted`, withExif.length > jpeg.length - 20000 && withExif.some((b, i) => b === 0xff && withExif[i + 1] === 0xe1 && i < 30));
        const round = await readMeta(withExif);
        check(`${name} round-trip camera`, (round.model || '') === (meta.model || ''), `${round.model} vs ${meta.model}`);
        const gone = await readMeta(stripped);
        check(`${name} stripped has no camera`, !gone.model);
        console.log('   after replaceExif:', describeMeta(round), '| stripped:', describeMeta(gone) || '(none)');
      }
    }
  }
}
console.log(failed ? `${failed} FAILED` : 'all checks passed');
process.exit(failed ? 1 : 0);
