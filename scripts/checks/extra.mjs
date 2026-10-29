import assert from 'node:assert/strict';
import * as e from '../../src/lib/extra/engines.js';
import * as s from '../../src/lib/extra/seoText.js';

const near = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} !≈ ${b}`);

// grade
near(e.weightedGrade([{ grade: 90, weight: 20 }, { grade: 80, weight: 30 }]).average, 84);
near(e.neededOnFinal(85, 30, 90), 101.67);
near(e.neededOnFinal(80, 40, 70), 55);
assert.equal(e.letterGrade(91), 'A−');
// card payoff
const p = e.cardPayoff(5000, 22, 200);
assert.ok(p.months >= 31 && p.months <= 34, String(p.months));
near(p.total, 5000 + p.interest);
assert.equal(e.cardPayoff(5000, 24, 90), null);
near(e.paymentForMonths(1200, 0, 12), 100);
near(e.paymentForMonths(5000, 18, 24), 249.6, 0.5);
// height
const h = e.cmToFeetInches(180);
assert.equal(h.feet, 5);
assert.equal(h.inches, 10.9);
near(e.feetInchesToCm(5, 11), 180.34);
// binary
assert.equal(e.textToCodes('Hi'), '01001000 01101001');
assert.equal(e.codesToText('01001000 01101001').text, 'Hi');
assert.equal(e.codesToText('0100100001101001').text, 'Hi');
assert.equal(e.textToCodes('Hi', 'hex'), '48 69');
assert.equal(e.codesToText('48 69', 'hex').text, 'Hi');
assert.equal(e.codesToText('72 105', 'decimal').text, 'Hi');
assert.equal(e.codesToText(e.textToCodes('héllo €'), 'binary').text, 'héllo €');
assert.ok(e.codesToText('2 1', 'binary').error);
// morse
assert.equal(e.textToMorse('SOS').morse, '... --- ...');
assert.equal(e.textToMorse('Hi there').morse, '.... .. / - .... . .-. .');
assert.equal(e.morseToText('... --- ... / .... ..').text, 'SOS HI');
assert.deepEqual(e.textToMorse('a~').skipped, ['~']);
// timesheet
assert.equal(e.shiftMinutes('09:00', '17:30', 30), 480);
assert.equal(e.shiftMinutes('22:00', '06:00', 0), 480);
assert.equal(e.formatHours(495), '8h 15m');
// pace
assert.equal(e.formatClock(e.parseDuration(0, 25, 0) / 5), '5:00');
assert.equal(e.formatClock(3725), '1:02:05');
// ovulation
const o = e.ovulationCycle(e.parseISODate('2026-03-01'), 28);
const iso = (d) => d.toISOString().slice(0, 10);
assert.equal(iso(o.ovulation), '2026-03-15');
assert.equal(iso(o.fertileStart), '2026-03-10');
assert.equal(iso(o.fertileEnd), '2026-03-16');
assert.equal(iso(o.nextPeriod), '2026-03-29');
// scientific notation
assert.equal(e.toScientific('123456').e, '1.23456e+5');
assert.equal(e.toScientific('0.00045').e, '4.5e-4');
assert.equal(e.toScientific('12345', 2).e, '1.23e+4');
assert.equal(e.toScientific('12345').eng, '12.345e+3');
assert.equal(e.toPlain('1.5e3'), '1500');
assert.equal(e.toPlain('4.5e-4'), '0.00045');
assert.equal(e.toPlain('1.2345e2'), '123.45');
assert.equal(e.toPlain('-2e-2'), '−0.02');
assert.equal(e.toScientific('abc'), null);
// area
near(e.shapeArea('circle', { a: 2 }), 12.566, 0.001);
near(e.shapeArea('trapezoid', { a: 3, b: 5, c: 2 }), 8);
near(e.areaConversions(100)['square feet'], 1076.39, 0.01);
// readability
assert.equal(s.countSyllables('the'), 1);
assert.equal(s.countSyllables('simple'), 2);
assert.equal(s.countSyllables('readability'), 5);
assert.equal(s.countSyllables('make'), 1);
assert.equal(s.splitSentences('Version 3.5 is out. Is it good? Yes!').length, 3);
const easy = s.analyzeReadability('The cat sat on the mat. The dog ran to the park. We like to play.');
assert.ok(easy.fleschReadingEase > 90, String(easy.fleschReadingEase));
assert.equal(easy.sentences, 3);
assert.equal(easy.words, 16);
assert.equal(easy.band.label, 'Very easy');
const hard = s.analyzeReadability('Notwithstanding the aforementioned considerations, organisational transformation necessitates comprehensive institutional collaboration.');
assert.ok(hard.fleschReadingEase < 10 && hard.fleschKincaid > 15, JSON.stringify(hard));
assert.equal(hard.smog, null);
assert.equal(s.analyzeReadability(''), null);
assert.equal(s.analyzeReadability(`${'word '.repeat(30)}.`).longSentences.length, 1);
assert.equal(s.fleschBand(65).label, 'Plain English');
// hreflang
assert.equal(s.normalizeHreflang('en-gb').code, 'en-GB');
assert.equal(s.normalizeHreflang('EN_us').code, 'en-US');
assert.equal(s.normalizeHreflang('en-uk').code, 'en-GB');
assert.equal(s.normalizeHreflang('x-DEFAULT').code, 'x-default');
assert.ok(s.normalizeHreflang('jp').error.includes('ja'));
assert.ok(s.normalizeHreflang('english').error);
assert.ok(s.normalizeHreflang('en-GB-x').error);
assert.ok(s.normalizeHreflang('').error);
const hl = s.buildHreflang([
  { code: 'en', url: 'https://example.com/' },
  { code: 'de', url: 'https://example.com/de/' },
  { code: 'es-mx', url: 'https://example.com/es-mx/' },
], 'https://example.com/');
assert.ok(hl.ok, hl.problems.join('|'));
assert.equal(hl.entries.length, 4);
assert.ok(hl.html.includes('hreflang="es-MX"'));
assert.ok(hl.html.includes('hreflang="x-default" href="https://example.com/"'));
assert.ok(hl.header.startsWith('Link: <https://example.com/>; rel="alternate"; hreflang="en"'));
assert.equal((hl.sitemap.match(/<url>/g) || []).length, 3);
assert.equal((hl.sitemap.match(/<xhtml:link/g) || []).length, 12);
assert.ok(!s.buildHreflang([{ code: 'en', url: 'https://a.com/' }]).ok);
assert.ok(!s.buildHreflang([{ code: 'en', url: 'https://a.com/' }, { code: 'en', url: 'https://a.com/b' }]).ok);
assert.ok(!s.buildHreflang([{ code: 'en', url: '/relative' }, { code: 'de', url: 'https://a.com/de' }]).ok);
assert.ok(s.buildHreflang([{ code: 'en', url: 'https://a.com/' }, { code: 'de', url: 'https://a.com/de/' }]).warnings.some((w) => w.includes('x-default')));
console.log('extra engines: all checks passed');
