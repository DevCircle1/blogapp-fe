/** Run: node scripts/checks/whatsapp.mjs */
import { ChatParser, dayLabel, summarize } from '../../src/lib/whatsapp/stats.js';

let failed = 0;
const eq = (name, a, b) => {
  if (JSON.stringify(a) !== JSON.stringify(b)) { failed += 1; console.error('FAIL', name, a, '!=', b); }
};

const parse = (text, options) => {
  const parser = new ChatParser(options);
  // Feed in awkward chunks to exercise partial-line buffering.
  for (let i = 0; i < text.length; i += 37) parser.feed(text.slice(i, i + 37));
  const info = parser.finish();
  return { info, days: parser.days, summary: summarize(parser.days) };
};

// iOS bracket format, day first, with media, a deleted message, a multi-line message and a system line.
const ios = [
  '‎[12/03/2026, 14:22:01] Ali: Hello there 😀',
  '[12/03/2026, 14:23:10] Sara: hey! how are you?',
  '[12/03/2026, 14:23:50] Sara: pizza tonight? pizza tonight',
  'second line of the same message',
  '‎[12/03/2026, 14:25:00] Ali: ‎image omitted',
  '[13/03/2026, 09:00:00] Ali: Messages and calls are end-to-end encrypted. No one outside of this chat can read them.',
  '[13/03/2026, 09:01:00] Ali: You deleted this message',
  '[13/03/2026, 23:59:59] Sara: good night 😴😴',
  '[15/03/2026, 08:00:00] Ali: morning',
].join('\n');
const a = parse(ios);
eq('ios format', a.info.formatId, 'bracket');
eq('ios order', a.info.dateOrder, 'dmy');
eq('ios messages', a.summary.totals.messages, 7);
eq('ios media', a.summary.totals.media, 1);
eq('ios deleted', a.summary.totals.deleted, 1);
eq('ios continuation', a.summary.participants.find((p) => p.name === 'Sara').chars, 'hey! how are you?'.length + 'pizza tonight? pizza tonight\nsecond line of the same message'.length + 'good night 😴😴'.length);
eq('ios emoji', a.summary.topEmoji[0], ['😴', 2]);
eq('ios starters', a.summary.participants.map((p) => [p.name, p.starters]).sort(), [['Ali', 3], ['Sara', 1]].sort());
eq('ios silence', Math.round(a.summary.longestSilence.hours), 32);
eq('ios weekday heat', a.summary.heatmap[3][14], 4); // 12 March 2026 was a Thursday
eq('ios first day', dayLabel(a.summary.bounds.first), '2026-03-12');

// Android dash format, 12-hour clock, month-first proven by a 25.
const android = [
  '3/25/26, 2:22 PM - Ali: hi',
  '3/25/26, 2:23 PM - Sara: hello',
  '3/26/26, 12:05 AM - Ali: late one',
  '3/26/26, 12:06 AM - Bob added Sara',
].join('\n');
const b = parse(android);
eq('android format', b.info.formatId, 'dash');
eq('android order', b.info.dateOrder, 'mdy');
eq('android messages', b.summary.totals.messages, 3);
eq('android hour', b.summary.heatmap[(Math.floor(Date.UTC(2026, 2, 26) / 86400000) + 3) % 7][0], 1);

// ISO format and 24-hour clock.
const iso = '[2026-03-12, 14:22:01] Ali: a\n[2026-03-12, 14:22:31] Sara: b\n';
const c = parse(iso);
eq('iso order', c.info.dateOrder, 'ymd');
eq('iso messages', c.summary.totals.messages, 2);

// Median response time: Sara replies to Ali after 60s and 120s.
const timing = '[01/01/2026, 10:00:00] Ali: q1\n[01/01/2026, 10:01:00] Sara: a1\n[01/01/2026, 10:05:00] Ali: q2\n[01/01/2026, 10:07:00] Sara: a2\n';
const t = parse(timing);
eq('median response', t.summary.participants.find((p) => p.name === 'Sara').medianResponseSeconds, 90);

// Streak and range restriction.
const streak = ['01', '02', '03', '05'].map((d) => `[${d}/01/2026, 10:00:00] Ali: hi`).join('\n');
const s = parse(streak);
eq('streak', s.summary.streak.days, 3);
const ranged = summarize(s.days, { from: Math.floor(Date.UTC(2026, 0, 2) / 86400000), to: Math.floor(Date.UTC(2026, 0, 3) / 86400000) });
eq('range messages', ranged.totals.messages, 2);
eq('people filter', summarize(a.days, { people: ['Sara'] }).participants.map((p) => p.name), ['Sara']);

// Not a chat.
eq('not a chat', parse('just some text\nnot a chat\n').info.formatId, 'none');

// Words and bigrams skip stopwords and URLs.
const words = '[01/01/2026, 10:00:00] Ali: the pizza pizza pizza https://example.com/a?b=c fantastic evening\n';
const w = parse(words);
eq('top word', w.summary.topWords[0], ['pizza', 3]);
eq('bigram', w.summary.topBigrams.some(([b2]) => b2 === 'fantastic evening'), true);

// Performance: 1M messages. Lines are generated first so only parsing is timed.
const names = ['Ali', 'Sara', 'Bob'];
const pad = (n) => String(n).padStart(2, '0');
const chunks = [];
let ts = Date.UTC(2020, 0, 1);
for (let block = 0; block < 1000; block += 1) {
  let text = '';
  for (let i = 0; i < 1000; i += 1) {
    ts += 45000 + (i % 7) * 20000;
    const d = new Date(ts);
    text += `[${pad(d.getUTCDate())}/${pad(d.getUTCMonth() + 1)}/${d.getUTCFullYear()}, ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}] ${names[i % 3]}: message number ${block * 1000 + i} about pizza and coffee 😀\n`;
  }
  chunks.push(text);
}
const start = Date.now();
const big = new ChatParser();
chunks.forEach((chunk) => big.feed(chunk));
const bigInfo = big.finish();
const parsedMs = Date.now() - start;
const summary = summarize(big.days);
console.log(`1M messages: parse ${parsedMs} ms, summarize ${Date.now() - start - parsedMs} ms; days ${big.days.size}; rss ${Math.round(process.memoryUsage().rss / 1e6)} MB`);
eq('big messages', bigInfo.messages, 1000000);
eq('big participants', summary.participants.length, 3);

console.log(failed ? `${failed} FAILED` : 'all checks passed');
process.exit(failed ? 1 : 0);
