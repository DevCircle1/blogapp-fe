/** Run: node scripts/checks/subtitles.mjs */
import { detectFormat, findProblems, parseSubtitles, parseTime } from '../../src/lib/subtitles/parse.js';
import { serialize, srtTime } from '../../src/lib/subtitles/serialize.js';
import {
  fixOverlaps, merge, scale, shift, twoPointSync,
} from '../../src/lib/subtitles/transform.js';
import { decode, detectEncoding } from '../../src/lib/subtitles/encoding.js';

let failed = 0;
const eq = (name, a, b) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) { failed += 1; console.error('FAIL', name, a, '!=', b); }
};

const SRT = '﻿1\r\n00:00:01,000 --> 00:00:03,500\r\nHello, <i>world</i>!\r\n\r\n2\r\n00:00:04,000 --> 00:00:06,250\r\nSecond line\r\nwraps here\r\n\r\n3\r\n00:00:07,000 --> 00:00:08,000\r\nLast cue with no trailing blank line';
const srt = parseSubtitles(SRT);
eq('srt format', srt.format, 'srt');
eq('srt cues', srt.cues.length, 3);
eq('srt times', [srt.cues[0].start, srt.cues[0].end], [1000, 3500]);
eq('srt multi-line', srt.cues[1].text, 'Second line\nwraps here');
eq('srt tag kept', srt.cues[0].text, 'Hello, <i>world</i>!');
eq('srt last cue kept', srt.cues[2].text, 'Last cue with no trailing blank line');

// Missing cue numbers and a malformed final cue must not lose the rest.
const noNumbers = parseSubtitles('00:00:01,000 --> 00:00:02,000\nA\n\n00:00:03,000 --> 00:00:04,000\nB\n\ngarbage block\n\n00:00:05,000 --> 00:00:0x,000\nbad');
eq('no numbers', noNumbers.cues.map((c) => c.text), ['A', 'B']);
eq('warnings reported', noNumbers.warnings.length >= 1, true);

// Conversions.
const vtt = serialize(srt.cues, 'vtt');
eq('vtt header', vtt.startsWith('WEBVTT\n'), true);
eq('vtt separator', vtt.includes('00:00:01.000 --> 00:00:03.500'), true);
const back = parseSubtitles(vtt);
eq('vtt detected', back.format, 'vtt');
eq('vtt round trip', back.cues.map((c) => [c.start, c.end, c.text]), srt.cues.map((c) => [c.start, c.end, c.text]));
eq('vtt to srt', serialize(back.cues, 'srt').includes('00:00:01,000 --> 00:00:03,500'), true);

const vttFull = 'WEBVTT - title\n\nNOTE a comment\n\nSTYLE\n::cue { color: red }\n\nintro\n00:01.000 --> 00:02.000 align:start position:10%\n<v Ali>Hi there\n\n1:00:00.500 --> 1:00:02.000\nAn hour in';
const v = parseSubtitles(vttFull);
eq('vtt cues', v.cues.length, 2);
eq('vtt mm:ss', v.cues[0].start, 1000);
eq('vtt hours', v.cues[1].start, 3600500);
eq('vtt settings kept', v.cues[0].settings, 'align:start position:10%');
eq('vtt drops settings in srt', serialize(v.cues, 'srt').includes('align'), false);
eq('vtt voice tag removed for srt', serialize(v.cues, 'srt').includes('<v'), false);

const ASS = '[Script Info]\nTitle: x\n\n[V4+ Styles]\nFormat: Name, Fontname\nStyle: Default,Arial\n\n[Events]\nFormat: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\nDialogue: 0,0:00:01.00,0:00:03.50,Default,,0,0,0,,{\\an8}{\\i1}Hello{\\i0}, world\\Nsecond line\nDialogue: 0,0:00:04.00,0:00:05.00,Default,,0,0,0,,Plain, with, commas';
const ass = parseSubtitles(ASS);
eq('ass format', ass.format, 'ass');
eq('ass cues', ass.cues.length, 2);
eq('ass text', ass.cues[0].text, '<i>Hello</i>, world\nsecond line');
eq('ass commas', ass.cues[1].text, 'Plain, with, commas');
eq('ass styling warning', ass.warnings.some((w) => w.code === 'styling-lost'), true);
eq('ass to srt', serialize(ass.cues, 'srt').includes('00:00:01,000 --> 00:00:03,500'), true);
eq('ass out', parseSubtitles(serialize(srt.cues, 'ass')).cues.length, 3);

const sbv = parseSubtitles('0:00:01.000,0:00:03.500\nHello\n\n0:00:04.000,0:00:06.000\nWorld');
eq('sbv format', sbv.format, 'sbv');
eq('sbv cues', sbv.cues.map((c) => c.text), ['Hello', 'World']);
eq('sbv out', serialize(sbv.cues, 'sbv').startsWith('0:00:01.000,0:00:03.500'), true);

eq('txt', serialize(srt.cues, 'txt'), 'Hello, world!\nSecond line wraps here\nLast cue with no trailing blank line\n');
eq('txt timestamps', serialize(srt.cues, 'txt', { timestamps: true }).split('\n')[0], '[00:00:01] Hello, world!');
eq('detect', [detectFormat('WEBVTT\n'), detectFormat('[Script Info]'), detectFormat('1\n00:00:01,000 --> 00:00:02,000\nx')], ['vtt', 'ass', 'srt']);

// Time helpers.
eq('parseTime', [parseTime('00:00:01,500'), parseTime('1:02.5'), parseTime('nonsense')], [1500, 62500, null]);
eq('srtTime', srtTime(3661001), '01:01:01,001');

// Transforms.
const base = [{ index: 1, start: 1000, end: 2000, text: 'a' }, { index: 2, start: 10000, end: 12000, text: 'b' }];
eq('shift', shift(base, 500).cues.map((c) => c.start), [1500, 10500]);
const neg = shift(base, -1500);
eq('shift clamps', [neg.cues[0].start, neg.cues[0].end, neg.clamped], [0, 500, 1]);
eq('scale', scale(base, 1.001).map((c) => c.start), [1001, 10010]);
const tp = twoPointSync(base, 2000, 20000);
eq('two point scale', tp.scale, 2);
eq('two point offset', tp.offset, 0);
eq('two point applied', tp.cues.map((c) => c.start), [2000, 20000]);
const tp2 = twoPointSync(base, 1500, 10500);
eq('two point pure shift', [Math.round(tp2.scale * 1000) / 1000, tp2.offset], [1, 500]);
eq('needs two cues', Boolean(twoPointSync([base[0]], 0, 1).error), true);

const overlapping = [{ index: 1, start: 0, end: 3000, text: 'a' }, { index: 2, start: 2000, end: 4000, text: 'b' }, { index: 3, start: 5000, end: 5000, text: 'c' }];
const problems = findProblems(overlapping);
eq('overlap found', [problems.overlaps, problems.inverted], [[1], [2]]);
const fixed = fixOverlaps(overlapping);
eq('overlap fixed', [fixed.cues[0].end, fixed.changed], [1999, 2]);
eq('original untouched', overlapping[0].end, 3000);

// Merge.
const en = [{ index: 1, start: 1000, end: 3000, text: 'Hello' }, { index: 2, start: 4000, end: 6000, text: 'Bye' }];
const es = [{ index: 1, start: 1100, end: 2900, text: 'Hola' }, { index: 2, start: 4100, end: 6100, text: 'Adiós' }, { index: 3, start: 9000, end: 9500, text: 'Extra' }];
const stacked = merge(en, es, 'stacked');
eq('stacked text', stacked[0].text, 'Hello\n<small>Hola</small>');
eq('stacked keeps unmatched', stacked.length, 3);
eq('stacked small srt', serialize(stacked, 'srt').includes('<font size="14">Hola</font>'), true);
eq('stacked small vtt', serialize(stacked, 'vtt').includes('<c.small>Hola</c>') && serialize(stacked, 'vtt').includes('::cue(.small)'), true);
eq('stacked small ass', serialize(stacked, 'ass').includes('{\\fs16}Hola{\\fs20}'), true);
eq('interleaved', merge(en, es, 'interleaved').map((c) => c.text), ['Hello', 'Hola', 'Bye', 'Adiós', 'Extra']);

// Encoding.
const utf8 = new TextEncoder().encode('1\n00:00:01,000 --> 00:00:02,000\nCafé — naïve\n');
eq('utf8 detected', (await detectEncoding(utf8)).encoding, 'utf-8');
const latin = Uint8Array.from(Buffer.from('1\n00:00:01,000 --> 00:00:02,000\nCaf\xe9 na\xefve r\xe9sum\xe9 fa\xe7ade et tr\xe8s bien \xe0 la fin\n', 'latin1'));
const detected = await detectEncoding(latin);
eq('latin1 not utf-8', detected.encoding !== 'utf-8', true);
eq('latin1 decodes', decode(latin, detected.encoding).includes('Café naïve résumé façade'), true);
const utf16 = Uint8Array.from(Buffer.concat([Buffer.from([0xff, 0xfe]), Buffer.from('1\n00:00:01,000 --> 00:00:02,000\nHi\n', 'utf16le')]));
const d16 = await detectEncoding(utf16);
eq('utf16 bom', d16.encoding, 'utf-16le');
eq('utf16 decodes', parseSubtitles(decode(utf16, d16.encoding)).cues.length, 1);
const sjis = Uint8Array.from([...Buffer.from('1\n00:00:01,000 --> 00:00:02,000\n', 'ascii'), 0x82, 0xb1, 0x82, 0xf1, 0x82, 0xc9, 0x82, 0xbf, 0x82, 0xcd, 0x0a, 0x0a, ...Buffer.from('2\n00:00:03,000 --> 00:00:04,000\n', 'ascii'), 0x82, 0xa0, 0x82, 0xe8, 0x82, 0xaa, 0x82, 0xc6, 0x82, 0xa4, 0x0a]);
const dj = await detectEncoding(sjis);
console.log('shift-jis detected as', dj.encoding, dj.confidence);
eq('sjis decodes', decode(sjis, 'shift_jis').includes('こんにちは'), true);

console.log(failed ? `${failed} FAILED` : 'all checks passed');
process.exit(failed ? 1 : 0);
