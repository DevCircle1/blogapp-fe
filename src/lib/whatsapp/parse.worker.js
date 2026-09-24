import { unzipSync } from 'fflate';
import { ChatParser, messageBucket, summarize } from './stats.js';

/**
 * Streams the chat file through the parser in this worker. The text never leaves
 * the browser; only aggregate statistics go back to the page.
 */
let days = null;

async function* chunks(file) {
  if (/\.zip$/i.test(file.name)) {
    // iOS exports a zip holding _chat.txt.
    const files = unzipSync(new Uint8Array(await file.arrayBuffer()), { filter: (entry) => /\.txt$/i.test(entry.name) });
    const entries = Object.entries(files).sort((a, b) => (/_chat\.txt$/i.test(b[0]) ? 1 : 0) - (/_chat\.txt$/i.test(a[0]) ? 1 : 0) || b[1].length - a[1].length);
    if (!entries.length) throw Object.assign(new Error('no txt in zip'), { code: 'NO_TXT' });
    const bytes = entries[0][1];
    const decoder = new TextDecoder('utf-8');
    const step = 1 << 20;
    for (let i = 0; i < bytes.length; i += step) yield { text: decoder.decode(bytes.subarray(i, i + step), { stream: true }), bytes: Math.min(step, bytes.length - i), total: bytes.length };
    return;
  }
  const reader = file.stream().pipeThrough(new TextDecoderStream('utf-8')).getReader();
  let read = 0;
  for (;;) {
    const { value, done } = await reader.read();
    if (done) return;
    // Characters, not bytes, but close enough for a progress bar.
    read += value.length;
    yield { text: value, bytes: value.length, total: file.size, read };
  }
}

async function parseOnce(file, order, id) {
  const parser = new ChatParser({ dateOrder: order });
  let done = 0;
  let lastPost = 0;
  let lastLines = 0;
  for await (const chunk of chunks(file)) {
    parser.feed(chunk.text);
    done += chunk.bytes;
    const now = Date.now();
    // Progress about every 50,000 lines, and at most ~5 times a second.
    if (parser.lines - lastLines >= 50000 && now - lastPost > 200) {
      lastPost = now; lastLines = parser.lines;
      self.postMessage({ id, type: 'progress', fraction: Math.min(0.99, done / chunk.total), lines: parser.lines });
    }
  }
  return { parser, info: parser.finish() };
}

self.onmessage = async (event) => {
  const message = event.data;
  try {
    if (message.type === 'parse') {
      const { id, file, order } = message;
      let { parser, info } = await parseOnce(file, order || null, id);
      // Impossible dates in the first-choice order mean it was guessed wrong: retry the other way once.
      if (info.formatId !== 'none' && !order && info.badDates > 3 && info.dateOrder !== 'ymd') {
        const flipped = info.dateOrder === 'dmy' ? 'mdy' : 'dmy';
        const retry = await parseOnce(file, flipped, id);
        if (retry.info.badDates < info.badDates) { parser = retry.parser; info = retry.info; }
      }
      if (info.formatId === 'none' || info.messages === 0) {
        self.postMessage({ id, type: 'error', code: 'NOT_WHATSAPP' });
        return;
      }
      days = parser.days;
      self.postMessage({
        id, type: 'done', info: { ...info, bucket: messageBucket(info.messages) }, summary: summarize(days),
      });
    } else if (message.type === 'range' && days) {
      self.postMessage({ id: message.id, type: 'summary', summary: summarize(days, { from: message.from, to: message.to, people: message.people }) });
    }
  } catch (error) {
    self.postMessage({ id: message.id, type: 'error', code: error?.code || 'FAILED', message: String(error?.message || error) });
  }
};
