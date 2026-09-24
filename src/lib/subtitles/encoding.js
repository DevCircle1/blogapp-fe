/**
 * Text encoding for subtitle files. A large share of broken-looking subtitle
 * files are simply not UTF-8 (Windows-1252, Windows-1251, Shift-JIS, GBK…), and
 * decoding them as UTF-8 produces mojibake. So: detect, decode with
 * TextDecoder, and let the person override the guess.
 */

export const ENCODINGS = [
  ['utf-8', 'UTF-8'],
  ['windows-1252', 'Western European (Windows-1252)'],
  ['iso-8859-1', 'Latin-1 (ISO-8859-1)'],
  ['iso-8859-2', 'Central European (ISO-8859-2)'],
  ['windows-1250', 'Central European (Windows-1250)'],
  ['windows-1251', 'Cyrillic (Windows-1251)'],
  ['windows-1253', 'Greek (Windows-1253)'],
  ['windows-1254', 'Turkish (Windows-1254)'],
  ['windows-1256', 'Arabic (Windows-1256)'],
  ['windows-1255', 'Hebrew (Windows-1255)'],
  ['shift_jis', 'Japanese (Shift-JIS)'],
  ['euc-jp', 'Japanese (EUC-JP)'],
  ['gbk', 'Simplified Chinese (GBK)'],
  ['big5', 'Traditional Chinese (Big5)'],
  ['euc-kr', 'Korean (EUC-KR)'],
  ['utf-16le', 'UTF-16 LE'],
  ['utf-16be', 'UTF-16 BE'],
];

// jschardet's names → TextDecoder labels.
const LABELS = {
  ascii: 'utf-8', 'utf-8': 'utf-8', 'utf-16le': 'utf-16le', 'utf-16be': 'utf-16be',
  'windows-1252': 'windows-1252', 'iso-8859-1': 'windows-1252', 'iso-8859-2': 'iso-8859-2', 'windows-1250': 'windows-1250',
  'windows-1251': 'windows-1251', 'iso-8859-5': 'iso-8859-5', 'koi8-r': 'koi8-r', 'windows-1253': 'windows-1253', 'iso-8859-7': 'iso-8859-7',
  'windows-1254': 'windows-1254', 'windows-1255': 'windows-1255', 'windows-1256': 'windows-1256',
  shift_jis: 'shift_jis', 'euc-jp': 'euc-jp', 'iso-2022-jp': 'iso-2022-jp', gb2312: 'gbk', gb18030: 'gb18030', big5: 'big5', 'euc-kr': 'euc-kr', 'euc-tw': 'big5', 'x-mac-cyrillic': 'x-mac-cyrillic', ibm866: 'ibm866',
};

const toBinaryString = (bytes) => {
  let out = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) out += String.fromCharCode(...bytes.subarray(i, i + chunk));
  return out;
};

const isValidUtf8 = (bytes) => { try { new TextDecoder('utf-8', { fatal: true }).decode(bytes); return true; } catch { return false; } };

/** → { encoding, confidence, reason } for the given bytes. `jschardet` is loaded lazily, only when it is needed. */
export async function detectEncoding(bytes) {
  if (bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf) return { encoding: 'utf-8', confidence: 1, reason: 'byte-order mark' };
  if (bytes[0] === 0xff && bytes[1] === 0xfe) return { encoding: 'utf-16le', confidence: 1, reason: 'byte-order mark' };
  if (bytes[0] === 0xfe && bytes[1] === 0xff) return { encoding: 'utf-16be', confidence: 1, reason: 'byte-order mark' };
  if (isValidUtf8(bytes)) return { encoding: 'utf-8', confidence: 1, reason: 'valid UTF-8' };
  const mod = await import('jschardet');
  const jschardet = mod.default || mod;
  const guess = jschardet.detect(toBinaryString(bytes.subarray(0, 200000)));
  const label = guess?.encoding ? LABELS[guess.encoding.toLowerCase()] : null;
  return { encoding: label || 'windows-1252', confidence: guess?.confidence ?? 0, reason: label ? 'statistical detection' : 'fallback' };
}

export function decode(bytes, encoding) {
  let text = new TextDecoder(encoding).decode(bytes);
  // TextDecoder for utf-8 strips the BOM; other decoders may leave U+FEFF behind.
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  return text;
}
