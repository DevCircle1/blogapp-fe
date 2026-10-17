import assert from 'node:assert/strict';
import * as e from '../../src/lib/extra/engines.js';

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
console.log('extra engines: all checks passed');
