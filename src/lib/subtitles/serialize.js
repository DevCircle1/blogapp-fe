/**
 * Serializers: the cue model back out to each format. Inline tags <i>, <b>, <u>
 * are kept where the target supports them and dropped where it does not; the
 * internal <small> marker (used by bilingual merge for the second language) is
 * turned into whatever the target uses for smaller text.
 */

const pad = (n, width) => String(Math.floor(n)).padStart(width, '0');

function parts(ms) {
  const total = Math.max(0, Math.round(ms));
  return {
    h: Math.floor(total / 3600000), m: Math.floor((total % 3600000) / 60000), s: Math.floor((total % 60000) / 1000), ms: total % 1000,
  };
}

export const srtTime = (ms) => { const t = parts(ms); return `${pad(t.h, 2)}:${pad(t.m, 2)}:${pad(t.s, 2)},${pad(t.ms, 3)}`; };
export const vttTime = (ms) => srtTime(ms).replace(',', '.');
export const sbvTime = (ms) => { const t = parts(ms); return `${t.h}:${pad(t.m, 2)}:${pad(t.s, 2)}.${pad(t.ms, 3)}`; };
export const assTime = (ms) => {
  const total = Math.max(0, Math.round(ms / 10) * 10);
  const t = parts(total);
  return `${t.h}:${pad(t.m, 2)}:${pad(t.s, 2)}.${pad(Math.floor(t.ms / 10), 2)}`;
};

const stripTags = (text) => text.replace(/<\/?(i|b|u|small|c|v|font|ruby|rt|lang)[^>]*>/gi, '');
const keepBasic = (text) => text.replace(/<(?!\/?(i|b|u|small)\b)[^>]*>/gi, '');

export const toSrt = (cues) => `${cues.map((cue, i) => `${i + 1}\n${srtTime(cue.start)} --> ${srtTime(cue.end)}\n${keepBasic(cue.text).replace(/<small>/gi, '<font size="14">').replace(/<\/small>/gi, '</font>')}`).join('\n\n')}\n`;

export function toVtt(cues) {
  const usesSmall = cues.some((cue) => /<small>/i.test(cue.text));
  const style = usesSmall ? '\nSTYLE\n::cue(.small) {\n  font-size: 80%;\n}\n' : '';
  const body = cues.map((cue, i) => {
    const text = keepBasic(cue.text).replace(/-->/g, '->').replace(/<small>/gi, '<c.small>').replace(/<\/small>/gi, '</c>');
    return `${i + 1}\n${vttTime(cue.start)} --> ${vttTime(cue.end)}${cue.settings ? ` ${cue.settings}` : ''}\n${text}`;
  }).join('\n\n');
  return `WEBVTT\n${style}\n${body}\n`;
}

export const toSbv = (cues) => `${cues.map((cue) => `${sbvTime(cue.start)},${sbvTime(cue.end)}\n${stripTags(cue.text)}`).join('\n\n')}\n`;

export function toAss(cues) {
  const lines = cues.map((cue) => {
    const text = keepBasic(cue.text)
      .replace(/<i>/gi, '{\\i1}').replace(/<\/i>/gi, '{\\i0}')
      .replace(/<b>/gi, '{\\b1}').replace(/<\/b>/gi, '{\\b0}')
      .replace(/<u>/gi, '{\\u1}').replace(/<\/u>/gi, '{\\u0}')
      .replace(/<small>/gi, '{\\fs16}').replace(/<\/small>/gi, '{\\fs20}')
      .replace(/\n/g, '\\N');
    return `Dialogue: 0,${assTime(cue.start)},${assTime(cue.end)},Default,,0,0,0,,${text}`;
  });
  return `[Script Info]
ScriptType: v4.00+
PlayResX: 1280
PlayResY: 720
WrapStyle: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Arial,20,&H00FFFFFF,&H000000FF,&H00000000,&H64000000,0,0,0,0,100,100,0,0,1,2,1,2,10,10,20,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
${lines.join('\n')}
`;
}

/** Plain-text transcript, one cue per paragraph, optionally with the start time. */
export const toTxt = (cues, { timestamps = false } = {}) => `${cues.map((cue) => {
  const text = stripTags(cue.text).replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
  return timestamps ? `[${srtTime(cue.start).slice(0, 8)}] ${text}` : text;
}).filter(Boolean).join('\n')}\n`;

export const FORMATS = {
  srt: { label: 'SRT (.srt)', ext: 'srt', mime: 'application/x-subrip', write: toSrt },
  vtt: { label: 'WebVTT (.vtt)', ext: 'vtt', mime: 'text/vtt', write: toVtt },
  ass: { label: 'ASS (.ass)', ext: 'ass', mime: 'text/x-ssa', write: toAss },
  sbv: { label: 'SBV (.sbv)', ext: 'sbv', mime: 'text/plain', write: toSbv },
  txt: { label: 'Plain text (.txt)', ext: 'txt', mime: 'text/plain', write: toTxt },
};

export const serialize = (cues, format, options) => FORMATS[format].write(cues, options);
