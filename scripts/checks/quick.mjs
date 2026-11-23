import assert from 'node:assert/strict';
import * as q from '../../src/lib/quick/engines.js';

const near = (a, b, eps = 0.01) => assert.ok(Math.abs(a - b) <= eps, `${a} vs ${b}`);

// VAT
assert.deepEqual(q.vat(100, 20, 'add'), { net: 100, vat: 20, gross: 120 });
assert.deepEqual(q.vat(120, 20, 'remove'), { net: 100, vat: 20, gross: 120 });
assert.deepEqual(q.vat(59.99, 18, 'remove'), { net: 50.84, vat: 9.15, gross: 59.99 });
assert.equal(q.vat(NaN, 20, 'add'), null);

// time zones (Node has full ICU)
const jan = new Date(Date.UTC(2026, 0, 15, 12, 0));
const jul = new Date(Date.UTC(2026, 6, 15, 12, 0));
assert.equal(q.zoneOffsetMinutes(jan, 'America/New_York'), -300);
assert.equal(q.zoneOffsetMinutes(jul, 'America/New_York'), -240);
assert.equal(q.zoneOffsetMinutes(jan, 'Asia/Kolkata'), 330);
assert.equal(q.zoneOffsetMinutes(jan, 'Asia/Karachi'), 300);
assert.equal(q.zoneOffsetMinutes(jul, 'Europe/London'), 60);
assert.equal(q.formatOffset(330), 'UTC+5:30');
assert.equal(q.formatOffset(-300), 'UTC−5');
// 9:00 in New York in January is 14:00 UTC
assert.equal(q.zonedToUtc({ year: 2026, month: 1, day: 15, hour: 9, minute: 0 }, 'America/New_York').toISOString(), '2026-01-15T14:00:00.000Z');
// 9:00 in New York in July is 13:00 UTC
assert.equal(q.zonedToUtc({ year: 2026, month: 7, day: 15, hour: 9, minute: 0 }, 'America/New_York').toISOString(), '2026-07-15T13:00:00.000Z');
// Tokyo is a day ahead of Los Angeles
const t = q.zonedToUtc({ year: 2026, month: 3, day: 1, hour: 18, minute: 0 }, 'America/Los_Angeles');
assert.equal(q.formatInZone(t, 'Asia/Tokyo').time, '11:00');
assert.match(q.formatInZone(t, 'Asia/Tokyo').date, /^Mon, 02\/03\/2026$/);
// US spring-forward 2026-03-08: 02:30 does not exist in New York, lands after the gap
assert.equal(q.zonedToUtc({ year: 2026, month: 3, day: 8, hour: 2, minute: 30 }, 'America/New_York').toISOString(), '2026-03-08T07:30:00.000Z');
for (const z of q.ZONES) q.zoneOffsetMinutes(jan, z.id);

// typing
const s = q.typingStats('hello world', 'hello wurld', 60);
assert.equal(s.correct, 10);
assert.equal(s.errors, 1);
near(s.wpm, 2);
near(s.accuracy, 90.909);
assert.equal(q.typingStats('abc', '', 30).accuracy, 100);

// cps
assert.equal(q.cps(50, 10), 5);
assert.match(q.cpsBand(5), /Average/);

// reaction
assert.equal(q.average([200, 300]), 250);
assert.equal(q.average([]), null);
assert.match(q.reactionBand(180), /Excellent/);

// number words
const w = (n, o) => q.numberToWords(n, o);
assert.equal(w('0').cardinal, 'zero');
assert.equal(w('13').cardinal, 'thirteen');
assert.equal(w('21').cardinal, 'twenty-one');
assert.equal(w('100').cardinal, 'one hundred');
assert.equal(w('105').cardinal, 'one hundred five');
assert.equal(w('105', { british: true }).cardinal, 'one hundred and five');
assert.equal(w('1,234').cardinal, 'one thousand two hundred thirty-four');
assert.equal(w('1000000').cardinal, 'one million');
assert.equal(w('1002003').cardinal, 'one million two thousand three');
assert.equal(w('-7').cardinal, 'minus seven');
assert.equal(w('3.14').cardinal, 'three point one four');
assert.equal(w('1234.5').cheque, 'One thousand two hundred thirty-four and 50/100');
assert.equal(w('21').ordinal, 'twenty-first');
assert.equal(w('12').ordinal, 'twelfth');
assert.equal(w('40').ordinal, 'fortieth');
assert.equal(w('5').ordinal, 'fifth');
assert.equal(w('100').ordinal, 'one hundredth');
assert.equal(w('abc'), null);
assert.equal(w('1' + '0'.repeat(30)), null);
assert.equal(w('-0').cardinal, 'zero');

// gcf / lcm
const list = q.parseIntegerList('12, 18 24');
assert.deepEqual(q.gcfLcm(list), { gcf: 6n, lcm: 72n });
assert.deepEqual(q.gcfLcm(q.parseIntegerList('7 13')), { gcf: 1n, lcm: 91n });
assert.equal(q.parseIntegerList('0 4'), null);
assert.deepEqual(q.gcfLcm(q.parseIntegerList('4')), { gcf: 4n, lcm: 4n });
assert.equal(q.parseIntegerList('a b'), null);
assert.equal(q.factorString(q.primeFactors(360n)), '2^3 × 3^2 × 5');
assert.equal(q.factorString(q.primeFactors(97n)), '97');
assert.equal(q.factorString(q.primeFactors(1n)), '1');
assert.deepEqual(q.euclidSteps(48n, 18n), ['48 = 2 × 18 + 12', '18 = 1 × 12 + 6', '12 = 2 × 6 + 0']);

// weeks
assert.deepEqual(q.isoWeek(2026, 1, 1), { year: 2026, week: 1, weekday: 4 });
assert.deepEqual(q.isoWeek(2024, 12, 30), { year: 2025, week: 1, weekday: 1 });
assert.deepEqual(q.isoWeek(2021, 1, 1), { year: 2020, week: 53, weekday: 5 });
assert.equal(q.isoWeek(2026, 12, 31).week, 53);
assert.equal(q.isoWeeksInYear(2026), 53);
assert.equal(q.isoWeeksInYear(2025), 52);
assert.equal(q.isoWeek(2026, 6, 15).week, 25);
const r = q.isoWeekRange(2026, 1);
assert.equal(q.isoDate(r.start), '2025-12-29');
assert.equal(q.isoDate(r.end), '2026-01-04');
assert.equal(q.isoDate(q.isoWeekRange(2026, 53).end), '2027-01-03');
assert.equal(q.usWeek(2026, 1, 1).week, 1);
assert.equal(q.usWeek(2026, 1, 4).week, 2); // Sunday starts week 2
assert.equal(q.dayOfYear(2024, 3, 1), 61);
assert.equal(q.dayOfYear(2026, 12, 31), 365);

// sleep
assert.equal(q.toClock(7 * 60), '7:00 AM');
assert.equal(q.toClock(-30), '11:30 PM');
assert.equal(q.toClock(12 * 60), '12:00 PM');
assert.equal(q.toClock(0), '12:00 AM');
assert.deepEqual(q.bedtimesFor(7 * 60).map((b) => b.clock), ['9:45 PM', '11:15 PM', '12:45 AM', '2:15 AM']);
assert.deepEqual(q.wakeTimesFrom(23 * 60).map((b) => b.clock), ['3:45 AM', '5:15 AM', '6:45 AM', '8:15 AM']);

// fancy text
const f = Object.fromEntries(q.fancyText('Hello 123').map((x) => [x.id, x.text]));
assert.equal(f.bold, '𝐇𝐞𝐥𝐥𝐨 𝟏𝟐𝟑');
assert.equal(f.italic, '𝐻𝑒𝑙𝑙𝑜 123');
assert.equal(q.FANCY_STYLES.find((x) => x.id === 'italic').fn('h'), 'ℎ');
assert.equal(q.FANCY_STYLES.find((x) => x.id === 'script').fn('Be'), 'ℬℯ');
assert.equal(q.FANCY_STYLES.find((x) => x.id === 'double-struck').fn('NR'), 'ℕℝ');
assert.equal(f['monospace'], '𝙷𝚎𝚕𝚕𝚘 𝟷𝟸𝟹');
assert.equal(f.circled, 'Ⓗⓔⓛⓛⓞ ①②③');
assert.equal(f.fullwidth, 'Ｈｅｌｌｏ　１２３');
assert.equal(q.FANCY_STYLES.find((x) => x.id === 'upside-down').fn('hello'), 'ollǝɥ');
assert.equal(q.FANCY_STYLES.find((x) => x.id === 'small-caps').fn('Hi'), 'ʜɪ');
assert.equal(q.FANCY_STYLES.find((x) => x.id === 'strike').fn('ab'), 'a̶b̶');
for (const style of q.FANCY_STYLES) assert.ok(style.fn('The quick brown fox 0123456789').length > 0, style.id);

console.log('quick engines: all checks passed');
