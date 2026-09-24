/**
 * A fictional two-person chat, generated deterministically in the exact format
 * an iPhone export uses, so "try a sample" exercises the real parser end to end.
 */
const pad = (n) => String(n).padStart(2, '0');

const OPENERS = ['good morning', 'hey', 'are you free later', 'did you see the match', 'what are we eating tonight', 'call me when you can', 'running late sorry', 'can you send me the address', 'happy friday', 'guess what happened today'];
const REPLIES = ['haha yes', 'sounds good', 'on my way', 'let me check and tell you', 'that is hilarious', 'coffee first', 'see you at eight', 'no way', 'really? tell me more', 'sending it now', 'thanks a lot', 'perfect see you soon'];
const EMOJI = ['😂', '😊', '🙏', '❤️', '🔥', '😴', '👍', '🎉'];

export function buildSampleChat() {
  let seed = 12345;
  const rand = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; };
  const pick = (list) => list[Math.floor(rand() * list.length)];
  const lines = [];
  const start = Date.UTC(2026, 0, 1);
  for (let dayIndex = 0; dayIndex < 90; dayIndex += 1) {
    if (rand() < 0.08) continue; // a quiet day now and then
    const date = new Date(start + dayIndex * 86400000);
    const count = 6 + Math.floor(rand() * 26);
    let minutes = 7 * 60 + Math.floor(rand() * 90);
    let speaker = rand() < 0.55 ? 0 : 1;
    for (let i = 0; i < count; i += 1) {
      // Evening-heavy: later messages come in quicker bursts.
      minutes += 1 + Math.floor(rand() * (i < count / 3 ? 120 : 40));
      if (minutes >= 24 * 60) break;
      if (rand() < 0.4) speaker = 1 - speaker;
      const name = speaker === 0 ? 'Alex' : 'Sam';
      const stamp = `[${pad(date.getUTCDate())}/${pad(date.getUTCMonth() + 1)}/${date.getUTCFullYear()}, ${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}:${pad(Math.floor(rand() * 60))}]`;
      const roll = rand();
      let text;
      if (roll < 0.05) text = '‎image omitted';
      else if (roll < 0.07) text = 'You deleted this message';
      else text = `${rand() < 0.35 ? pick(OPENERS) : pick(REPLIES)}${rand() < 0.3 ? ` ${pick(EMOJI)}` : ''}`;
      lines.push(`${stamp} ${name}: ${text}`);
    }
  }
  return `${lines.join('\n')}\n`;
}
