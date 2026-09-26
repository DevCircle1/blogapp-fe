/**
 * Renders blog images from data: a 1200x630 cover (featured / og:image) and an
 * in-article infographic. Both are drawn as SVG and rasterised to PNG with
 * resvg, so every image is regenerated from the article file that describes it.
 */
import { Resvg } from '@resvg/resvg-js';

const FONT = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif";
const MONO = "Consolas, 'Courier New', monospace";

export const THEMES = {
  seo: { accent: '#a78bfa', deep: '#2e1065', label: 'SEO' },
  finance: { accent: '#34d399', deep: '#022c22', label: 'Money' },
  health: { accent: '#fb7185', deep: '#4c0519', label: 'Health' },
  math: { accent: '#fbbf24', deep: '#422006', label: 'Maths' },
  dev: { accent: '#22d3ee', deep: '#083344', label: 'Developers' },
  career: { accent: '#60a5fa', deep: '#172554', label: 'Careers' },
};

const esc = (value) => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Greedy word wrap on an approximate character budget. */
export const wrap = (text, maxChars) => {
  const lines = [];
  let line = '';
  String(text).split(/\s+/).forEach((word) => {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else line = next;
  });
  if (line) lines.push(line);
  return lines;
};

const textLines = (lines, { x, y, size, lineHeight, fill, weight = 400, family = FONT, anchor = 'start' }) => lines
  .map((line, index) => `<text x="${x}" y="${y + index * lineHeight}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${esc(line)}</text>`)
  .join('');

const brand = (x, y, accent) => `
  <rect x="${x}" y="${y - 30}" width="40" height="40" rx="10" fill="${accent}"/>
  <text x="${x + 20}" y="${y - 3}" font-family="${FONT}" font-size="18" font-weight="800" fill="#0f172a" text-anchor="middle">T&amp;T</text>
  <text x="${x + 54}" y="${y - 2}" font-family="${FONT}" font-size="24" font-weight="700" fill="#ffffff">Talk &amp; Tool</text>`;

/* ------------------------------------------------------------ cover visuals */
const PANEL = { x: 760, y: 118, w: 370, h: 394 };

const visuals = {
  stat: (v, t) => `
    ${textLines([v.value], { x: PANEL.x + PANEL.w / 2, y: PANEL.y + 190, size: v.value.length > 5 ? 84 : 104, lineHeight: 0, fill: t.accent, weight: 800, anchor: 'middle' })}
    ${textLines(wrap(v.label, 22), { x: PANEL.x + PANEL.w / 2, y: PANEL.y + 250, size: 26, lineHeight: 34, fill: '#e2e8f0', weight: 600, anchor: 'middle' })}
    ${v.note ? textLines(wrap(v.note, 30), { x: PANEL.x + PANEL.w / 2, y: PANEL.y + 340, size: 18, lineHeight: 24, fill: '#94a3b8', anchor: 'middle' }) : ''}`,

  bars: (v, t) => {
    const max = Math.max(...v.items.map((item) => item.value));
    const slot = (PANEL.w - 60) / v.items.length;
    const barW = Math.min(64, slot * 0.72);
    const gap = slot - barW;
    const base = PANEL.y + PANEL.h - 70;
    const bars = v.items.map((item, index) => {
      const h = Math.max(6, (item.value / max) * 230);
      const x = PANEL.x + 30 + gap / 2 + index * slot;
      const fill = item.highlight ? t.accent : '#475569';
      return `<rect x="${x}" y="${base - h}" width="${barW}" height="${h}" rx="8" fill="${fill}"/>
        <text x="${x + barW / 2}" y="${base - h - 12}" font-family="${FONT}" font-size="17" font-weight="700" fill="#f1f5f9" text-anchor="middle">${esc(item.display ?? item.value)}</text>
        <text x="${x + barW / 2}" y="${base + 28}" font-family="${FONT}" font-size="16" fill="#94a3b8" text-anchor="middle">${esc(item.label)}</text>`;
    }).join('');
    return `${textLines([v.title], { x: PANEL.x + 30, y: PANEL.y + 50, size: 20, lineHeight: 0, fill: '#e2e8f0', weight: 700 })}${bars}`;
  },

  formula: (v, t) => `
    ${textLines([v.title], { x: PANEL.x + 30, y: PANEL.y + 56, size: 20, lineHeight: 0, fill: '#94a3b8', weight: 700 })}
    ${v.lines.map((line, index) => `<text x="${PANEL.x + 30}" y="${PANEL.y + 120 + index * 58}" font-family="${MONO}" font-size="${line.length > 18 ? 22 : 28}" font-weight="700" fill="${index === v.lines.length - 1 ? t.accent : '#f8fafc'}">${esc(line)}</text>`).join('')}`,

  serp: (v, t) => `
    <rect x="${PANEL.x + 24}" y="${PANEL.y + 34}" width="${PANEL.w - 48}" height="44" rx="22" fill="#ffffff"/>
    <circle cx="${PANEL.x + 50}" cy="${PANEL.y + 56}" r="8" fill="none" stroke="#64748b" stroke-width="3"/>
    <text x="${PANEL.x + 68}" y="${PANEL.y + 63}" font-family="${FONT}" font-size="17" fill="#334155">${esc(v.query)}</text>
    ${[0, 1].map((row) => {
      const y = PANEL.y + 120 + row * 130;
      const on = row === 0;
      return `<rect x="${PANEL.x + 24}" y="${y - 22}" width="${PANEL.w - 48}" height="112" rx="14" fill="${on ? '#ffffff' : 'rgba(255,255,255,0.10)'}"/>
        <text x="${PANEL.x + 40}" y="${y + 2}" font-family="${FONT}" font-size="14" fill="${on ? '#15803d' : '#64748b'}">${esc(on ? v.url : 'example.com › page')}</text>
        <text x="${PANEL.x + 40}" y="${y + 30}" font-family="${FONT}" font-size="19" font-weight="600" fill="${on ? '#1a0dab' : '#94a3b8'}">${esc(on ? v.title : 'Another result title…')}</text>
        <rect x="${PANEL.x + 40}" y="${y + 46}" width="${PANEL.w - 90}" height="8" rx="4" fill="${on ? '#cbd5e1' : '#475569'}"/>
        <rect x="${PANEL.x + 40}" y="${y + 62}" width="${PANEL.w - 150}" height="8" rx="4" fill="${on ? '#cbd5e1' : '#475569'}"/>`;
    }).join('')}
    ${v.badge ? `<rect x="${PANEL.x + PANEL.w - 150}" y="${PANEL.y + PANEL.h - 62}" width="126" height="36" rx="18" fill="${t.accent}"/><text x="${PANEL.x + PANEL.w - 87}" y="${PANEL.y + PANEL.h - 38}" font-family="${FONT}" font-size="16" font-weight="800" fill="#0f172a" text-anchor="middle">${esc(v.badge)}</text>` : ''}`,

  checklist: (v, t) => v.items.map((item, index) => {
    const y = PANEL.y + 70 + index * 64;
    return `<circle cx="${PANEL.x + 50}" cy="${y - 7}" r="16" fill="${t.accent}"/>
      <path d="M${PANEL.x + 42} ${y - 7} l6 6 l11 -12" stroke="#0f172a" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="${PANEL.x + 80}" y="${y}" font-family="${FONT}" font-size="21" font-weight="600" fill="#f1f5f9">${esc(item)}</text>`;
  }).join(''),

  calendar: (v, t) => {
    const cell = 44;
    const startX = PANEL.x + (PANEL.w - cell * 7) / 2;
    const startY = PANEL.y + 110;
    const heads = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => `<text x="${startX + i * cell + cell / 2}" y="${startY - 16}" font-family="${FONT}" font-size="15" font-weight="700" fill="#94a3b8" text-anchor="middle">${d}</text>`).join('');
    const cells = Array.from({ length: 35 }, (_, i) => {
      const day = i - (v.offset || 0) + 1;
      if (day < 1 || day > (v.days || 30)) return '';
      const x = startX + (i % 7) * cell;
      const y = startY + Math.floor(i / 7) * cell;
      const hi = (v.highlight || []).includes(day);
      const range = v.range && day >= v.range[0] && day <= v.range[1];
      return `<rect x="${x + 3}" y="${y + 3}" width="${cell - 6}" height="${cell - 6}" rx="9" fill="${hi ? t.accent : range ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.05)'}"/>
        <text x="${x + cell / 2}" y="${y + cell / 2 + 6}" font-family="${FONT}" font-size="16" font-weight="${hi ? 800 : 500}" fill="${hi ? '#0f172a' : '#e2e8f0'}" text-anchor="middle">${day}</text>`;
    }).join('');
    return `${textLines([v.title], { x: PANEL.x + PANEL.w / 2, y: PANEL.y + 52, size: 22, lineHeight: 0, fill: '#f1f5f9', weight: 700, anchor: 'middle' })}${heads}${cells}`;
  },

  code: (v, t) => `
    <circle cx="${PANEL.x + 34}" cy="${PANEL.y + 32}" r="7" fill="#f87171"/><circle cx="${PANEL.x + 56}" cy="${PANEL.y + 32}" r="7" fill="#fbbf24"/><circle cx="${PANEL.x + 78}" cy="${PANEL.y + 32}" r="7" fill="#34d399"/>
    ${v.lines.map((line, index) => {
      const [code, color] = Array.isArray(line) ? line : [line, '#e2e8f0'];
      return `<text x="${PANEL.x + 30}" y="${PANEL.y + 84 + index * 40}" font-family="${MONO}" font-size="19" fill="${color === 'accent' ? t.accent : color}">${esc(code)}</text>`;
    }).join('')}`,
};

export function renderCoverSvg({ title, kicker, theme: themeKey, visual }) {
  const t = THEMES[themeKey];
  // Bold Segoe UI averages ~0.62em per character; keep the title clear of the
  // right-hand panel (x = 760) with some breathing room.
  const budget = (fontSize) => Math.floor(620 / (fontSize * 0.62));
  let size = 40;
  let lines = wrap(title, budget(40));
  for (const candidate of [54, 48, 44]) {
    const attempt = wrap(title, budget(candidate));
    if (attempt.length <= 3) { size = candidate; lines = attempt; break; }
  }
  const lineHeight = Math.round(size * 1.16);
  const titleTop = 238;
  const kickerY = titleTop + (lines.length - 1) * lineHeight + 58;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f172a"/><stop offset="1" stop-color="${t.deep}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${t.accent}" stop-opacity="0.38"/><stop offset="1" stop-color="${t.accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.6" fill="#ffffff" fill-opacity="0.07"/></pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#dots)"/>
  <circle cx="960" cy="300" r="420" fill="url(#glow)"/>
  ${brand(72, 120, t.accent)}
  <rect x="72" y="146" width="${t.label.length * 13 + 36}" height="34" rx="17" fill="none" stroke="${t.accent}" stroke-width="2"/>
  <text x="${72 + (t.label.length * 13 + 36) / 2}" y="169" font-family="${FONT}" font-size="16" font-weight="700" fill="${t.accent}" text-anchor="middle" letter-spacing="1.5">${esc(t.label.toUpperCase())}</text>
  ${textLines(lines, { x: 72, y: titleTop, size, lineHeight, fill: '#ffffff', weight: 800 })}
  ${textLines(wrap(kicker, 44), { x: 72, y: kickerY, size: 24, lineHeight: 32, fill: t.accent, weight: 600 })}
  <text x="72" y="548" font-family="${FONT}" font-size="20" fill="#94a3b8">talkandtool.com</text>
  <rect x="${PANEL.x}" y="${PANEL.y}" width="${PANEL.w}" height="${PANEL.h}" rx="28" fill="#ffffff" fill-opacity="0.07" stroke="#ffffff" stroke-opacity="0.16"/>
  ${visuals[visual.type](visual, t)}
</svg>`;
}

/* ------------------------------------------------------------ infographics */
const INK = '#0f172a';
const MUTED = '#475569';

function infoTable(g, t, top) {
  const colW = g.widths || g.columns.map(() => 1056 / g.columns.length);
  const xs = colW.reduce((acc, w, i) => [...acc, acc[i] + w], [72]);
  const rowH = 58;
  const head = `<rect x="72" y="${top}" width="1056" height="${rowH}" rx="12" fill="${INK}"/>${g.columns.map((c, i) => `<text x="${xs[i] + 22}" y="${top + 37}" font-family="${FONT}" font-size="20" font-weight="700" fill="#ffffff">${esc(c)}</text>`).join('')}`;
  const rows = g.rows.map((row, r) => {
    const y = top + rowH * (r + 1);
    return `<rect x="72" y="${y}" width="1056" height="${rowH}" fill="${r % 2 ? '#f1f5f9' : '#ffffff'}"/>${row.map((cell, i) => `<text x="${xs[i] + 22}" y="${y + 37}" font-family="${FONT}" font-size="19" font-weight="${i === 0 ? 700 : 400}" fill="${i === 0 ? INK : MUTED}">${esc(cell)}</text>`).join('')}`;
  }).join('');
  const bottom = top + rowH * (g.rows.length + 1);
  return { svg: `${head}${rows}<rect x="72" y="${top}" width="1056" height="${bottom - top}" rx="12" fill="none" stroke="#cbd5e1"/>`, bottom };
}

function infoSteps(g, t, top) {
  let y = top;
  const svg = g.items.map((item, index) => {
    const [head, body] = Array.isArray(item) ? item : [item, ''];
    const bodyLines = body ? wrap(body, 82) : [];
    const block = `<circle cx="100" cy="${y + 20}" r="24" fill="${t.ink}"/>
      <text x="100" y="${y + 28}" font-family="${FONT}" font-size="22" font-weight="800" fill="#ffffff" text-anchor="middle">${index + 1}</text>
      <text x="144" y="${y + 28}" font-family="${FONT}" font-size="23" font-weight="700" fill="${INK}">${esc(head)}</text>
      ${textLines(bodyLines, { x: 144, y: y + 60, size: 19, lineHeight: 27, fill: MUTED })}`;
    y += 62 + bodyLines.length * 27;
    return block;
  }).join('');
  return { svg, bottom: y };
}

function infoBars(g, t, top) {
  const max = Math.max(...g.items.map((i) => i.value));
  const svg = g.items.map((item, index) => {
    const y = top + index * 60;
    const w = Math.max(8, (item.value / max) * 620);
    return `<text x="72" y="${y + 29}" font-family="${FONT}" font-size="20" font-weight="600" fill="${INK}">${esc(item.label)}</text>
      <rect x="360" y="${y + 6}" width="640" height="34" rx="10" fill="#e2e8f0"/>
      <rect x="360" y="${y + 6}" width="${w}" height="34" rx="10" fill="${item.highlight ? t.ink : '#94a3b8'}"/>
      <text x="1128" y="${y + 30}" font-family="${FONT}" font-size="20" font-weight="700" fill="${INK}" text-anchor="end">${esc(item.display ?? item.value)}</text>`;
  }).join('');
  return { svg, bottom: top + g.items.length * 60 };
}

// Darker accents for text and fills on the light infographic background.
const INK_ACCENT = { seo: '#6d28d9', finance: '#047857', health: '#be123c', math: '#b45309', dev: '#0e7490', career: '#1d4ed8' };

export function renderInfographicSvg(g, themeKey) {
  const t = { ...THEMES[themeKey], ink: INK_ACCENT[themeKey] };
  const titleLines = wrap(g.title, 52);
  let top = 118 + titleLines.length * 46;
  const subtitleLines = g.subtitle ? wrap(g.subtitle, 90) : [];
  const subtitle = textLines(subtitleLines, { x: 72, y: top + 6, size: 20, lineHeight: 28, fill: MUTED });
  top += subtitleLines.length * 28 + 36;
  const body = { table: infoTable, steps: infoSteps, bars: infoBars }[g.type](g, t, top);
  const height = body.bottom + 110;
  return {
    height,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="${height}" viewBox="0 0 1200 ${height}">
  <rect width="1200" height="${height}" fill="#f8fafc"/>
  <rect width="1200" height="10" fill="${t.ink}"/>
  <text x="72" y="74" font-family="${FONT}" font-size="16" font-weight="800" fill="${t.ink}" letter-spacing="2">TALK &amp; TOOL · ${esc(t.label.toUpperCase())}</text>
  ${textLines(titleLines, { x: 72, y: 124, size: 38, lineHeight: 46, fill: INK, weight: 800 })}
  ${subtitle}
  ${body.svg}
  <line x1="72" y1="${height - 64}" x2="1128" y2="${height - 64}" stroke="#e2e8f0" stroke-width="2"/>
  <text x="72" y="${height - 30}" font-family="${FONT}" font-size="18" fill="${MUTED}">${esc(g.footer || 'talkandtool.com')}</text>
</svg>`,
  };
}

export const toPng = (svg) => new Resvg(svg, {
  font: { loadSystemFonts: true, defaultFontFamily: 'Segoe UI' },
  fitTo: { mode: 'original' },
}).render().asPng();
