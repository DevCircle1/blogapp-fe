import {
  classify, cleanLine, detectDateOrder, detectFormat, isEdited, matchHeader, splitSender, stripEdited, toTimestamp,
} from './formats.js';
import { STOPWORDS } from './stopwords.js';

/**
 * Streaming parser + aggregator. Text arrives in chunks, lines are folded into
 * messages, and each message is added straight into per-day, per-person
 * counters — message objects are never kept, so a multi-million-line export
 * costs memory proportional to the number of active days, not the file size.
 *
 * `summarize()` derives every statistic from those counters for any date range,
 * which is what makes the range slider instant: nothing is re-parsed.
 */

const DAY = 86400000;
const HOUR = 3600000;
const STARTER_GAP = 4 * HOUR;
const RESPONSE_CAP = 12 * HOUR;
const EMOJI_RE = /(?:\p{Extended_Pictographic}|\p{Regional_Indicator}{2})(?:️|\p{Emoji_Modifier})?(?:‍\p{Extended_Pictographic}(?:️|\p{Emoji_Modifier})?)*/gu;
const NON_ASCII = new RegExp(`[^${String.fromCharCode(0)}-${String.fromCharCode(0xa8)}]`); // anything beyond basic Latin: worth running the emoji scan
const URL_RE = /(?:https?:\/\/|www\.)\S+/gi;
const WORD_RE = /[\p{L}\p{N}][\p{L}\p{N}'’]*/gu;

const bump = (map, key, by = 1) => map.set(key, (map.get(key) || 0) + by);
const median = (values) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

const newPerson = () => ({
  messages: 0, words: 0, chars: 0, media: 0, deleted: 0, edited: 0, hours: new Array(24).fill(0), emoji: new Map(), wordCounts: new Map(), bigrams: new Map(), longest: 0,
});

const newDay = () => ({
  persons: new Map(), starters: new Map(), responses: new Map(), first: Infinity, last: -Infinity, gap: null,
});

export class ChatParser {
  constructor({ dateOrder = null } = {}) {
    this.forcedOrder = dateOrder;
    this.buffer = '';
    this.head = [];
    this.format = null;
    this.order = dateOrder;
    this.pending = null;
    this.days = new Map();
    this.lastTs = null;
    this.lastSender = null;
    this.lines = 0;
    this.messages = 0;
    this.systemLines = 0;
    this.badDates = 0;
    this.headerLines = 0;
  }

  feed(text) {
    this.buffer += text;
    const parts = this.buffer.split(/\r?\n/);
    this.buffer = parts.pop();
    for (const line of parts) this.line(line);
  }

  finish() {
    if (this.buffer) this.line(this.buffer);
    this.buffer = '';
    if (!this.format) this.detect();
    this.flush();
    return this.result();
  }

  line(raw) {
    this.lines += 1;
    if (!this.format) {
      this.head.push(raw);
      if (this.head.length >= 200) this.detect();
      return;
    }
    this.handle(raw);
  }

  detect() {
    const cleaned = this.head.map(cleanLine).filter((line) => line.trim());
    const found = detectFormat(cleaned);
    // A format that matches nothing means this is not a WhatsApp export.
    this.format = found ? found.format : { id: 'none', re: /^\b$/ };
    this.formatRate = found ? found.rate : 0;
    if (found) {
      const headers = cleaned.map((line) => matchHeader(found.format, line)).filter(Boolean);
      this.order = this.forcedOrder || detectDateOrder(headers);
      // Day-first was assumed, not proven, when no number above 12 appears in the first slot.
      this.ambiguousOrder = !this.forcedOrder && this.order === 'dmy' && !headers.some((h) => Number(h.a) > 12);
    }
    const replay = this.head;
    this.head = [];
    replay.forEach((line) => this.handle(line));
  }

  handle(raw) {
    const line = cleanLine(raw);
    const header = matchHeader(this.format, line);
    if (!header) {
      if (this.pending) this.pending.text += `\n${line}`;
      return;
    }
    this.headerLines += 1;
    this.flush();
    const ts = toTimestamp(header, this.order);
    if (ts === null) {
      this.badDates += 1;
      if (this.pending) this.pending.text += `\n${line}`;
      return;
    }
    const { sender, text } = splitSender(header.rest);
    this.pending = { ts, sender, text };
  }

  flush() {
    const message = this.pending;
    this.pending = null;
    if (!message) return;
    if (!message.sender) { this.systemLines += 1; return; }
    this.record(message);
  }

  record({ ts, sender, text }) {
    const kind = classify(text);
    const edited = isEdited(text);
    const body = edited ? stripEdited(text) : text;
    const key = Math.floor(ts / DAY);
    let day = this.days.get(key);
    if (!day) { day = newDay(); this.days.set(key, day); }
    let person = day.persons.get(sender);
    if (!person) { person = newPerson(); day.persons.set(sender, person); }

    this.messages += 1;
    person.messages += 1;
    person.hours[Math.floor((ts % DAY) / HOUR)] += 1;
    if (edited) person.edited += 1;
    if (kind === 'media') person.media += 1;
    else if (kind === 'deleted') person.deleted += 1;
    else {
      const plain = body.replace(URL_RE, ' ');
      person.chars += body.length;
      if (body.length > person.longest) person.longest = body.length;
      if (NON_ASCII.test(plain)) for (const emoji of plain.match(EMOJI_RE) || []) bump(person.emoji, emoji);
      let previous = null;
      let count = 0;
      for (const token of plain.toLowerCase().match(WORD_RE) || []) {
        count += 1;
        const word = token.replace(/^['’]+|['’]+$/g, '');
        if (word.length < 2 || /^\d+$/.test(word) || STOPWORDS.has(word)) { previous = null; continue; }
        bump(person.wordCounts, word);
        if (previous) bump(person.bigrams, `${previous} ${word}`);
        previous = word;
      }
      person.words += count;
    }

    // Timing statistics come from the sequence of messages.
    const gap = this.lastTs === null ? Infinity : ts - this.lastTs;
    if (gap > STARTER_GAP) bump(day.starters, sender);
    if (this.lastSender && sender !== this.lastSender && gap <= RESPONSE_CAP) {
      if (!day.responses.has(sender)) day.responses.set(sender, []);
      day.responses.get(sender).push(Math.round(gap / 1000));
    }
    if (Number.isFinite(gap) && (!day.gap || gap > day.gap.ms)) day.gap = { ms: gap, from: this.lastTs, to: ts };
    if (ts < day.first) day.first = ts;
    if (ts > day.last) day.last = ts;
    this.lastTs = ts;
    this.lastSender = sender;
  }

  result() {
    return {
      formatId: this.format?.id || 'none',
      formatRate: this.formatRate || 0,
      dateOrder: this.order,
      ambiguousOrder: Boolean(this.ambiguousOrder),
      lines: this.lines,
      messages: this.messages,
      systemLines: this.systemLines,
      badDates: this.badDates,
      headerLines: this.headerLines,
    };
  }
}

/* ---------------------------------------------------------------- summarize */

export const dayLabel = (key) => new Date(key * DAY).toISOString().slice(0, 10);
const top = (map, n) => [...map.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]))).slice(0, n);

/**
 * days: Map<dayKey, DayAgg> from a ChatParser. Options restrict the date range
 * (inclusive day keys) and the participants included.
 */
export function summarize(days, { from = -Infinity, to = Infinity, people = null } = {}) {
  const keys = [...days.keys()].sort((a, b) => a - b);
  const bounds = keys.length ? { first: keys[0], last: keys[keys.length - 1] } : null;
  const inRange = keys.filter((key) => key >= from && key <= to);
  const wanted = (name) => !people || people.includes(name);

  const persons = new Map();
  const totals = { messages: 0, words: 0, chars: 0, media: 0, deleted: 0, edited: 0 };
  const heatmap = Array.from({ length: 7 }, () => new Array(24).fill(0));
  const timeline = [];
  const allWords = new Map();
  const allBigrams = new Map();
  const allEmoji = new Map();
  const responses = new Map();
  const starters = new Map();
  let silence = null;
  let longest = { name: null, chars: 0 };
  let busiest = null;

  for (const key of inRange) {
    const day = days.get(key);
    const weekday = (key + 3) % 7; // 1970-01-01 was a Thursday; Monday = 0
    let dayCount = 0;
    for (const [name, p] of day.persons) {
      if (!wanted(name)) continue;
      let agg = persons.get(name);
      if (!agg) {
        agg = {
          name, messages: 0, words: 0, chars: 0, media: 0, deleted: 0, edited: 0, emoji: new Map(), wordCounts: new Map(), longest: 0, starters: 0,
        };
        persons.set(name, agg);
      }
      for (const field of ['messages', 'words', 'chars', 'media', 'deleted', 'edited']) { agg[field] += p[field]; totals[field] += p[field]; }
      dayCount += p.messages;
      p.hours.forEach((count, hour) => { heatmap[weekday][hour] += count; });
      p.emoji.forEach((n, e) => { bump(agg.emoji, e, n); bump(allEmoji, e, n); });
      p.wordCounts.forEach((n, w) => { bump(agg.wordCounts, w, n); bump(allWords, w, n); });
      p.bigrams.forEach((n, b) => bump(allBigrams, b, n));
      if (p.longest > agg.longest) agg.longest = p.longest;
      if (p.longest > longest.chars) longest = { name, chars: p.longest };
    }
    day.starters.forEach((n, name) => { if (wanted(name)) bump(starters, name, n); });
    day.responses.forEach((list, name) => {
      if (!wanted(name)) return;
      if (!responses.has(name)) responses.set(name, []);
      responses.get(name).push(...list);
    });
    if (day.gap && day.gap.from >= from * DAY && day.gap.to < (Number.isFinite(to) ? (to + 1) * DAY : Infinity) && (!silence || day.gap.ms > silence.ms)) silence = day.gap;
    if (dayCount) {
      timeline.push([key, dayCount]);
      if (!busiest || dayCount > busiest.count) busiest = { day: key, count: dayCount };
    }
  }

  // Longest run of consecutive days with at least one message.
  let streak = { days: 0, start: null, end: null };
  let runStart = null;
  let previous = null;
  for (const [key] of timeline) {
    if (previous !== null && key === previous + 1) { /* run continues */ } else runStart = key;
    previous = key;
    if (key - runStart + 1 > streak.days) streak = { days: key - runStart + 1, start: runStart, end: key };
  }

  const participants = [...persons.values()].map((p) => ({
    name: p.name,
    messages: p.messages,
    words: p.words,
    chars: p.chars,
    media: p.media,
    deleted: p.deleted,
    edited: p.edited,
    avgWords: p.messages ? p.words / p.messages : 0,
    longest: p.longest,
    starters: starters.get(p.name) || 0,
    medianResponseSeconds: median(responses.get(p.name) || []),
    emoji: top(p.emoji, 5),
    topWords: top(p.wordCounts, 8),
  })).sort((a, b) => b.messages - a.messages);

  return {
    bounds,
    range: { from: inRange[0] ?? null, to: inRange[inRange.length - 1] ?? null },
    totals: { ...totals, activeDays: timeline.length },
    participants,
    heatmap,
    heatmapMax: Math.max(0, ...heatmap.flat()),
    timeline,
    topWords: top(allWords, 20),
    topBigrams: top(allBigrams, 20),
    topEmoji: top(allEmoji, 20),
    longestSilence: silence ? { hours: silence.ms / HOUR, from: silence.from, to: silence.to } : null,
    streak,
    longestMessage: longest,
    busiestDay: busiest,
  };
}

/** Coarse size of a chat, for anonymous analytics: never the exact count. */
export const messageBucket = (count) => (count < 1000 ? '<1k' : count < 10000 ? '1k-10k' : count < 100000 ? '10k-100k' : '100k+');
