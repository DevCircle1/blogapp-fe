import { dayLabel } from './stats.js';

/**
 * Renders the shareable summary image onto a canvas: 1080×1920 for stories or
 * 1080×1080 square. This is the piece people actually post, so it carries the
 * headline numbers and the activity heatmap, and a small watermark.
 * Client-only (needs a canvas).
 */
const ACCENT = '#34d399';
const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const compact = (n) => (n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 10000 ? `${Math.round(n / 1000)}k` : n.toLocaleString('en-US'));

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fit(ctx, text, maxWidth) {
  if (ctx.measureText(text).width <= maxWidth) return text;
  let cut = text;
  while (cut.length > 1 && ctx.measureText(`${cut}…`).width > maxWidth) cut = cut.slice(0, -1);
  return `${cut}…`;
}

export function drawShareCard(canvas, summary, { format = 'story', showNames = true, title = 'Our chat in numbers' } = {}) {
  const W = 1080;
  const H = format === 'story' ? 1920 : 1080;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createLinearGradient(0, 0, W, H);
  gradient.addColorStop(0, '#020617'); gradient.addColorStop(0.6, '#0f172a'); gradient.addColorStop(1, '#064e3b');
  ctx.fillStyle = gradient; ctx.fillRect(0, 0, W, H);

  const pad = 72;
  let y = format === 'story' ? 150 : 96;
  ctx.fillStyle = ACCENT; ctx.font = `700 34px ${FONT}`; ctx.fillText('CHAT WRAPPED', pad, y);
  y += format === 'story' ? 80 : 64;
  ctx.fillStyle = '#ffffff'; ctx.font = `800 ${format === 'story' ? 76 : 64}px ${FONT}`; ctx.fillText(fit(ctx, title, W - pad * 2), pad, y);
  const range = summary.range?.from != null ? `${dayLabel(summary.range.from)} → ${dayLabel(summary.range.to)}` : '';
  y += 52; ctx.fillStyle = '#94a3b8'; ctx.font = `500 30px ${FONT}`; ctx.fillText(range, pad, y);

  // Headline number
  y += format === 'story' ? 200 : 150;
  ctx.fillStyle = '#ffffff'; ctx.font = `900 ${format === 'story' ? 200 : 150}px ${FONT}`; ctx.fillText(compact(summary.totals.messages), pad, y);
  y += 56; ctx.fillStyle = '#94a3b8'; ctx.font = `500 38px ${FONT}`; ctx.fillText('messages', pad, y);

  // Participants
  y += format === 'story' ? 90 : 64;
  const people = summary.participants.slice(0, format === 'story' ? 4 : 3);
  const max = Math.max(1, ...people.map((p) => p.messages));
  people.forEach((person, i) => {
    const label = showNames ? person.name : `Person ${i + 1}`;
    ctx.fillStyle = '#e2e8f0'; ctx.font = `600 34px ${FONT}`; ctx.fillText(fit(ctx, label, 520), pad, y);
    ctx.textAlign = 'right'; ctx.fillStyle = '#ffffff'; ctx.fillText(person.messages.toLocaleString('en-US'), W - pad, y); ctx.textAlign = 'left';
    y += 20;
    ctx.fillStyle = 'rgba(255,255,255,0.08)'; roundRect(ctx, pad, y, W - pad * 2, 22, 11); ctx.fill();
    ctx.fillStyle = ACCENT; roundRect(ctx, pad, y, Math.max(22, ((W - pad * 2) * person.messages) / max), 22, 11); ctx.fill();
    y += format === 'story' ? 76 : 62;
  });

  // Heatmap
  const gridTop = y + 10;
  const gap = 4;
  const gridX = pad + 44;
  const cell = Math.floor((W - pad - gridX - 23 * gap) / 24);
  ctx.fillStyle = '#94a3b8'; ctx.font = `600 28px ${FONT}`; ctx.fillText('When you chat', pad, gridTop);
  summary.heatmap.forEach((row, d) => {
    ctx.fillStyle = '#64748b'; ctx.font = `500 22px ${FONT}`; ctx.fillText(DAYS[d], pad + 6, gridTop + 44 + d * (cell + gap) + cell * 0.72);
    row.forEach((count, h) => {
      const t = summary.heatmapMax ? count / summary.heatmapMax : 0;
      ctx.fillStyle = t === 0 ? 'rgba(255,255,255,0.05)' : `rgba(52, 211, 153, ${0.18 + t * 0.82})`;
      roundRect(ctx, gridX + h * (cell + gap), gridTop + 44 + d * (cell + gap), cell, cell, 6); ctx.fill();
    });
  });
  ctx.fillStyle = '#64748b'; ctx.font = `500 22px ${FONT}`;
  [0, 6, 12, 18].forEach((h) => ctx.fillText(`${h}:00`, gridX + h * (cell + gap), gridTop + 44 + 7 * (cell + gap) + 26));
  y = gridTop + 44 + 7 * (cell + gap) + 80;

  // Key stats
  const stats = [
    ['Active days', summary.totals.activeDays.toLocaleString('en-US')],
    ['Longest streak', `${summary.streak.days} days`],
    ['Busiest day', summary.busiestDay ? `${summary.busiestDay.count} msgs` : '—'],
  ];
  if (format === 'story') stats.push(['Top emoji', summary.topEmoji[0]?.[0] || '—']);
  const columns = stats.length;
  const colW = (W - pad * 2) / columns;
  stats.forEach(([label, value], i) => {
    const x = pad + i * colW;
    ctx.fillStyle = '#64748b'; ctx.font = `500 24px ${FONT}`; ctx.fillText(label, x, y);
    ctx.fillStyle = '#f1f5f9'; ctx.font = `800 ${format === 'story' ? 44 : 38}px ${FONT}`; ctx.fillText(fit(ctx, String(value), colW - 12), x, y + 56);
  });

  if (format === 'story') {
    // The tall card has room for the words that define the chat.
    y += 150;
    ctx.fillStyle = '#94a3b8'; ctx.font = `600 28px ${FONT}`; ctx.fillText('Most used words', pad, y);
    const words = summary.topWords.slice(0, 5);
    const maxWord = Math.max(1, ...words.map((w) => w[1]));
    words.forEach(([word, count], i) => {
      const rowY = y + 70 + i * 84;
      ctx.fillStyle = '#f1f5f9'; ctx.font = `700 44px ${FONT}`; ctx.fillText(fit(ctx, word, 420), pad, rowY);
      ctx.fillStyle = 'rgba(255,255,255,0.08)'; roundRect(ctx, 520, rowY - 32, W - pad - 520 - 110, 24, 12); ctx.fill();
      ctx.fillStyle = ACCENT; roundRect(ctx, 520, rowY - 32, Math.max(24, ((W - pad - 520 - 110) * count) / maxWord), 24, 12); ctx.fill();
      ctx.textAlign = 'right'; ctx.fillStyle = '#94a3b8'; ctx.font = `600 30px ${FONT}`; ctx.fillText(count.toLocaleString('en-US'), W - pad, rowY); ctx.textAlign = 'left';
    });
  }

  ctx.fillStyle = ACCENT; ctx.font = `700 32px ${FONT}`; ctx.textAlign = 'right';
  ctx.fillText('talkandtool.com/tools/whatsapp-chat-analyzer', W - pad, H - 64);
  ctx.textAlign = 'left';
}
