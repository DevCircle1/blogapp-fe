import { useEffect, useMemo, useState } from 'react';
import {
  Button, CopyButton, ErrorNote, Field, Grid, Label, LabelledField, LabelledSelect, Panel,
  Result, Segmented, Select, Stat, StatGrid, TextArea, Toggle,
} from './uiKit.jsx';
import { getFormatLocale, num } from './toolFormat.js';
import { msg, useT } from '../../../i18n/i18n.js';

/* ------------------------------------------------------------------ JSON */
export function JsonStudio() {
  const t = useT();
  const [input, setInput] = useState('{"name":"Talk & Tool","tools":69,"free":true,"tags":["json","formatter"]}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState('2');

  const sortKeys = (value) => {
    if (Array.isArray(value)) return value.map(sortKeys);
    if (value && typeof value === 'object') {
      return Object.keys(value).sort().reduce((acc, key) => ({ ...acc, [key]: sortKeys(value[key]) }), {});
    }
    return value;
  };

  const run = (mode) => {
    try {
      const parsed = JSON.parse(input);
      const value = mode === 'sort' ? sortKeys(parsed) : parsed;
      setOutput(JSON.stringify(value, null, mode === 'minify' ? 0 : Number(indent)));
      setError('');
    } catch (err) {
      setError(err.message);
      setOutput('');
    }
  };

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="json-input">{t('JSON input')}</Label>
          <TextArea id="json-input" className="mt-2" value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="json-output">{t('Result')}</Label>
          <TextArea id="json-output" className="mt-2" value={output} readOnly placeholder={t('Formatted JSON appears here…')} />
        </div>
      </div>
      <ErrorNote>{error}</ErrorNote>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button onClick={() => run('format')}>{t('Format')}</Button>
        <Button variant="ghost" onClick={() => run('minify')}>{t('Minify')}</Button>
        <Button variant="ghost" onClick={() => run('sort')}>{t('Sort keys')}</Button>
        <Select value={indent} onChange={(e) => setIndent(e.target.value)} className="w-auto" aria-label={t('Indentation')}>
          <option value="2">{t('2 spaces')}</option>
          <option value="4">{t('4 spaces')}</option>
        </Select>
        <CopyButton value={output} />
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- Base64 */
export function Base64Tool() {
  const t = useT();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [urlSafe, setUrlSafe] = useState(false);

  const encode = () => {
    try {
      const bytes = new TextEncoder().encode(input);
      let binary = '';
      bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
      let result = btoa(binary);
      if (urlSafe) result = result.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      setOutput(result);
      setError('');
    } catch (err) { setError(err.message); setOutput(''); }
  };

  const decode = () => {
    try {
      let value = input.trim().replace(/-/g, '+').replace(/_/g, '/');
      while (value.length % 4) value += '=';
      const binary = atob(value);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      setOutput(new TextDecoder().decode(bytes));
      setError('');
    } catch { setError(t('That input is not valid Base64.')); setOutput(''); }
  };

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="b64-in">{t('Input')}</Label>
          <TextArea id="b64-in" className="mt-2" value={input} onChange={(e) => setInput(e.target.value)} placeholder={t('Text to encode, or Base64 to decode…')} />
        </div>
        <div>
          <Label htmlFor="b64-out">{t('Output')}</Label>
          <TextArea id="b64-out" className="mt-2" value={output} readOnly />
        </div>
      </div>
      <ErrorNote>{error}</ErrorNote>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button onClick={encode}>{t('Encode')}</Button>
        <Button variant="ghost" onClick={decode}>{t('Decode')}</Button>
        <Toggle checked={urlSafe} onChange={() => setUrlSafe(!urlSafe)} label={t('URL-safe')} />
        <CopyButton value={output} />
      </div>
    </>
  );
}

/* ------------------------------------------------------------- URL codec */
export function UrlEncoder() {
  const t = useT();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState('component');

  const run = (direction) => {
    try {
      const encoder = mode === 'component' ? encodeURIComponent : encodeURI;
      const decoder = mode === 'component' ? decodeURIComponent : decodeURI;
      setOutput(direction === 'encode' ? encoder(input) : decoder(input));
      setError('');
    } catch { setOutput(''); setError(t('The input contains invalid or incomplete percent-encoding.')); }
  };

  return (
    <>
      <Segmented
        ariaLabel={t('Encoding mode')}
        value={mode}
        onChange={setMode}
        options={[{ value: 'component', label: t('Component (query values)') }, { value: 'uri', label: t('Full URI') }]}
      />
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="url-in">{t('Input')}</Label>
          <TextArea id="url-in" className="mt-2" value={input} onChange={(e) => setInput(e.target.value)} placeholder="https://example.com/search?q=hello world" />
        </div>
        <div>
          <Label htmlFor="url-out">{t('Output')}</Label>
          <TextArea id="url-out" className="mt-2" value={output} readOnly />
        </div>
      </div>
      <ErrorNote>{error}</ErrorNote>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button onClick={() => run('encode')}>{t('Encode')}</Button>
        <Button variant="ghost" onClick={() => run('decode')}>{t('Decode')}</Button>
        <CopyButton value={output} />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------- JWT */
const decodeSegment = (segment) => {
  let value = segment.replace(/-/g, '+').replace(/_/g, '/');
  while (value.length % 4) value += '=';
  const bytes = Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
};

export function JwtInspector() {
  const t = useT();
  const [token, setToken] = useState('');
  const decoded = useMemo(() => {
    if (!token.trim()) return null;
    try {
      const [header, payload] = token.trim().split('.');
      return { header: decodeSegment(header), payload: decodeSegment(payload) };
    } catch { return { error: msg('That does not look like a valid JWT. A token has three dot-separated Base64url segments.') }; }
  }, [token]);

  const claims = decoded?.payload || {};
  const asDate = (seconds) => (Number.isFinite(seconds) ? new Date(seconds * 1000).toLocaleString(getFormatLocale()) : null);
  const expired = Number.isFinite(claims.exp) ? claims.exp * 1000 < Date.now() : null;

  return (
    <>
      <Label htmlFor="jwt-input">JSON Web Token</Label>
      <TextArea id="jwt-input" className="mt-2 min-h-32" value={token} onChange={(e) => setToken(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9…" />
      <ErrorNote>{decoded?.error && t(decoded.error)}</ErrorNote>
      {decoded && !decoded.error && (
        <>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div>
              <Label>{t('Header')}</Label>
              <pre className="mt-2 overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-cyan-300">{JSON.stringify(decoded.header, null, 2)}</pre>
            </div>
            <div>
              <Label>{t('Payload')}</Label>
              <pre className="mt-2 overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-emerald-300">{JSON.stringify(decoded.payload, null, 2)}</pre>
            </div>
          </div>
          <StatGrid columns="md:grid-cols-4">
            <Stat label={t('Algorithm')} value={decoded.header?.alg || '—'} />
            <Stat label={t('Issued at')} value={asDate(claims.iat) || '—'} />
            <Stat label={t('Expires')} value={asDate(claims.exp) || '—'} />
            <Stat label={t('Status')} value={expired === null ? t('No expiry') : expired ? t('Expired') : t('Valid window')} accent={expired ? 'indigo' : 'emerald'} />
          </StatGrid>
        </>
      )}
      <p className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-sm text-amber-200">
        {t('This tool decodes only. It does not verify the signature — never trust a claim until your server has verified the token.')}
      </p>
    </>
  );
}

/* ------------------------------------------------------------------ UUID */
export function UuidGenerator() {
  const t = useT();
  const [count, setCount] = useState(5);
  const [format, setFormat] = useState('lower');
  const [values, setValues] = useState([]);

  const generate = () => {
    const list = Array.from({ length: count }, () => crypto.randomUUID());
    setValues(list.map((id) => {
      if (format === 'upper') return id.toUpperCase();
      if (format === 'nohyphen') return id.replace(/-/g, '');
      if (format === 'braces') return `{${id}}`;
      return id;
    }));
  };

  return (
    <>
      <Grid className="md:grid-cols-[1fr_1fr_auto]">
        <LabelledField label={t('How many')} id="uuid-count" type="number" min="1" max="500" value={count}
          onChange={(e) => setCount(Math.min(500, Math.max(1, Number(e.target.value) || 1)))} />
        <LabelledSelect label={t('Format')} id="uuid-format" value={format} onChange={(e) => setFormat(e.target.value)}>
          <option value="lower">{t('Standard lowercase')}</option>
          <option value="upper">{t('Uppercase')}</option>
          <option value="nohyphen">{t('No hyphens')}</option>
          <option value="braces">{t('Braced GUID')}</option>
        </LabelledSelect>
        <div className="flex items-end"><Button onClick={generate} className="w-full md:w-auto">{t('Generate')}</Button></div>
      </Grid>
      <pre className="mt-5 min-h-48 overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-emerald-300">{values.join('\n') || t('Your UUIDs will appear here.')}</pre>
      <div className="mt-4"><CopyButton value={values.join('\n')} label={values.length ? t('Copy {n} UUIDs', { n: values.length }) : t('Copy UUIDs')} /></div>
    </>
  );
}

/* ----------------------------------------------------------------- Regex */
export function RegexTester() {
  const t = useT();
  const [pattern, setPattern] = useState('\\b(\\w+)@(\\w+\\.\\w+)\\b');
  const [flags, setFlags] = useState('gi');
  const [text, setText] = useState(() => t('Contact hello@example.com or support@talkandtool.com for help.'));

  const result = useMemo(() => {
    if (!pattern) return { matches: [], error: '' };
    try {
      const regex = new RegExp(pattern, flags.includes('g') ? flags : `${flags}g`);
      const matches = Array.from(text.matchAll(regex)).slice(0, 500).map((match) => ({
        value: match[0], index: match.index, groups: match.slice(1),
      }));
      return { matches, error: '' };
    } catch (err) { return { matches: [], error: err.message }; }
  }, [pattern, flags, text]);

  const highlighted = useMemo(() => {
    if (result.error || !result.matches.length) return [{ text, match: false }];
    const parts = [];
    let cursor = 0;
    result.matches.forEach((match) => {
      if (match.index > cursor) parts.push({ text: text.slice(cursor, match.index), match: false });
      parts.push({ text: match.value, match: true });
      cursor = match.index + (match.value.length || 1);
    });
    parts.push({ text: text.slice(cursor), match: false });
    return parts;
  }, [result, text]);

  return (
    <>
      <Grid className="md:grid-cols-[1fr_140px]">
        <LabelledField label={t('Pattern')} hint={t('without slashes')} id="re-pattern" value={pattern} onChange={(e) => setPattern(e.target.value)} />
        <LabelledField label={t('Flags')} id="re-flags" value={flags} onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ''))} />
      </Grid>
      <div className="mt-4">
        <Label htmlFor="re-text">{t('Test string')}</Label>
        <TextArea id="re-text" className="mt-2 min-h-40" value={text} onChange={(e) => setText(e.target.value)} />
      </div>
      <ErrorNote>{result.error}</ErrorNote>
      {!result.error && (
        <>
          <div className="mt-4 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-sm font-semibold text-slate-300">{result.matches.length === 1 ? t('1 match') : t('{n} matches', { n: result.matches.length })}</p>
            <p className="mt-3 whitespace-pre-wrap break-words font-mono text-sm text-slate-400">
              {highlighted.map((part, index) => (
                <span key={index} className={part.match ? 'rounded bg-emerald-400/20 px-0.5 text-emerald-200' : undefined}>{part.text}</span>
              ))}
            </p>
          </div>
          {result.matches.length > 0 && (
            <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-slate-400">
                  <tr><th className="p-3">#</th><th className="p-3">{t('Match')}</th><th className="p-3">{t('Index')}</th><th className="p-3">{t('Groups')}</th></tr>
                </thead>
                <tbody>
                  {result.matches.slice(0, 50).map((match, index) => (
                    <tr key={`${match.index}-${index}`} className="border-t border-white/5">
                      <td className="p-3 text-slate-500">{index + 1}</td>
                      <td className="p-3 font-mono text-emerald-300">{match.value}</td>
                      <td className="p-3 text-slate-400">{match.index}</td>
                      <td className="p-3 font-mono text-cyan-300">{match.groups.length ? match.groups.join(' | ') : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ Hash */
export function HashGenerator() {
  const t = useT();
  const [text, setText] = useState('');
  const [hashes, setHashes] = useState({});

  useEffect(() => {
    let cancelled = false;
    const compute = async () => {
      if (!text) { setHashes({}); return; }
      const data = new TextEncoder().encode(text);
      const algorithms = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];
      const entries = await Promise.all(algorithms.map(async (algorithm) => {
        const buffer = await crypto.subtle.digest(algorithm, data);
        const hex = Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, '0')).join('');
        return [algorithm, hex];
      }));
      if (!cancelled) setHashes(Object.fromEntries(entries));
    };
    compute();
    return () => { cancelled = true; };
  }, [text]);

  return (
    <>
      <Label htmlFor="hash-input">{t('Text to hash')}</Label>
      <TextArea id="hash-input" className="mt-2 min-h-32" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('Type anything — all four digests update live.')} />
      <div className="mt-5 space-y-3">
        {['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].map((algorithm) => (
          <div key={algorithm} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-bold text-indigo-300">{algorithm}</span>
              <CopyButton value={hashes[algorithm] || ''} />
            </div>
            <p className="mt-2 break-all font-mono text-xs text-emerald-300">{hashes[algorithm] || '—'}</p>
          </div>
        ))}
      </div>
    </>
  );
}

/* --------------------------------------------------------- HTML entities */
export function HtmlEncoder() {
  const t = useT();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [allNonAscii, setAllNonAscii] = useState(false);

  const encode = () => {
    let result = input
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    if (allNonAscii) {
      result = Array.from(result).map((char) => (char.codePointAt(0) > 127 ? `&#${char.codePointAt(0)};` : char)).join('');
    }
    setOutput(result);
  };

  const decode = () => {
    const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
    setOutput(input.replace(/&(#x?[0-9a-f]+|\w+);/gi, (whole, entity) => {
      if (entity[0] === '#') {
        const code = entity[1]?.toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
      }
      return named[entity.toLowerCase()] ?? whole;
    }));
  };

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="ent-in">{t('Input')}</Label>
          <TextArea id="ent-in" className="mt-2" value={input} onChange={(e) => setInput(e.target.value)} placeholder='<p class="note">Tom & Jerry</p>' />
        </div>
        <div>
          <Label htmlFor="ent-out">{t('Output')}</Label>
          <TextArea id="ent-out" className="mt-2" value={output} readOnly />
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button onClick={encode}>{t('Encode')}</Button>
        <Button variant="ghost" onClick={decode}>{t('Decode')}</Button>
        <Toggle checked={allNonAscii} onChange={() => setAllNonAscii(!allNonAscii)} label={t('Escape non-ASCII too')} />
        <CopyButton value={output} />
      </div>
    </>
  );
}

/* ------------------------------------------------------------------- CSV */
const parseCsv = (text, delimiter) => {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
      else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === delimiter) { row.push(field); field = ''; }
    else if (char === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (char !== '\r') field += char;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((entry) => entry.some((cell) => cell !== ''));
};

const DelimiterSelect = ({ value, onChange, withPipe = false }) => {
  const t = useT();
  return (
    <Select value={value} onChange={onChange} className="w-auto" aria-label={t('Delimiter')}>
      <option value=",">{t('Comma')}</option>
      <option value=";">{t('Semicolon')}</option>
      <option value="tab">{t('Tab')}</option>
      {withPipe && <option value="|">{t('Pipe')}</option>}
    </Select>
  );
};

export function CsvToJson() {
  const t = useT();
  const [input, setInput] = useState('name,role,years\nAda Lovelace,Analyst,12\n"Grace Hopper, PhD",Engineer,40');
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeader, setHasHeader] = useState(true);

  const output = useMemo(() => {
    try {
      const rows = parseCsv(input, delimiter === 'tab' ? '\t' : delimiter);
      if (!rows.length) return '';
      const cast = (value) => {
        const trimmed = value.trim();
        if (trimmed === '') return '';
        if (/^-?\d+(\.\d+)?$/.test(trimmed) && !/^0\d/.test(trimmed)) return Number(trimmed);
        if (trimmed === 'true' || trimmed === 'false') return trimmed === 'true';
        return value;
      };
      const data = hasHeader
        ? rows.slice(1).map((row) => Object.fromEntries(rows[0].map((key, index) => [key.trim(), cast(row[index] ?? '')])))
        : rows.map((row) => row.map(cast));
      return JSON.stringify(data, null, 2);
    } catch (err) { return { error: err.message }; }
  }, [input, delimiter, hasHeader]);
  const text = typeof output === 'string' ? output : t('Error: {message}', { message: output.error });

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <DelimiterSelect value={delimiter} onChange={(e) => setDelimiter(e.target.value)} withPipe />
        <Toggle checked={hasHeader} onChange={() => setHasHeader(!hasHeader)} label={t('First row is a header')} />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="csv-in">CSV</Label>
          <TextArea id="csv-in" className="mt-2" value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="csv-out">JSON</Label>
          <TextArea id="csv-out" className="mt-2" value={text} readOnly />
        </div>
      </div>
      <div className="mt-4"><CopyButton value={text} /></div>
    </>
  );
}

export function JsonToCsv() {
  const t = useT();
  const [input, setInput] = useState('[{"name":"Ada","role":"Analyst"},{"name":"Grace","role":"Engineer","years":40}]');
  const [delimiter, setDelimiter] = useState(',');
  const [flatten, setFlatten] = useState(true);

  const output = useMemo(() => {
    try {
      const parsed = JSON.parse(input);
      const rows = Array.isArray(parsed) ? parsed : [parsed];
      const flat = rows.map((row) => {
        const target = {};
        const walk = (value, prefix) => {
          Object.entries(value || {}).forEach(([key, item]) => {
            const path = prefix ? `${prefix}.${key}` : key;
            if (flatten && item && typeof item === 'object' && !Array.isArray(item)) walk(item, path);
            else target[path] = item && typeof item === 'object' ? JSON.stringify(item) : item;
          });
        };
        walk(row, '');
        return target;
      });
      const headers = [...new Set(flat.flatMap((row) => Object.keys(row)))];
      const sep = delimiter === 'tab' ? '\t' : delimiter;
      const escape = (value) => {
        const cell = value === undefined || value === null ? '' : String(value);
        return /["\n\r]|^\s|\s$/.test(cell) || cell.includes(sep) ? `"${cell.replace(/"/g, '""')}"` : cell;
      };
      return [headers.join(sep), ...flat.map((row) => headers.map((key) => escape(row[key])).join(sep))].join('\n');
    } catch (err) { return { error: err.message }; }
  }, [input, delimiter, flatten]);
  const text = typeof output === 'string' ? output : t('Error: {message}', { message: output.error });

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <DelimiterSelect value={delimiter} onChange={(e) => setDelimiter(e.target.value)} />
        <Toggle checked={flatten} onChange={() => setFlatten(!flatten)} label={t('Flatten nested objects')} />
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="j2c-in">{t('JSON array')}</Label>
          <TextArea id="j2c-in" className="mt-2" value={input} onChange={(e) => setInput(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="j2c-out">CSV</Label>
          <TextArea id="j2c-out" className="mt-2" value={text} readOnly />
        </div>
      </div>
      <div className="mt-4"><CopyButton value={text} /></div>
    </>
  );
}

/* -------------------------------------------------------------- Markdown */
const escapeHtml = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const inlineMarkdown = (text) => escapeHtml(text)
  .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img src="$2" alt="$1">')
  .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>')
  .replace(/~~([^~]+)~~/g, '<del>$1</del>');

const markdownToHtml = (markdown) => {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const html = [];
  let listType = null;
  let inCode = false;
  let paragraph = [];

  const flushParagraph = () => {
    if (paragraph.length) { html.push(`<p>${inlineMarkdown(paragraph.join(' '))}</p>`); paragraph = []; }
  };
  const closeList = () => { if (listType) { html.push(`</${listType}>`); listType = null; } };

  lines.forEach((line) => {
    if (/^```/.test(line)) {
      flushParagraph(); closeList();
      html.push(inCode ? '</code></pre>' : '<pre><code>');
      inCode = !inCode;
      return;
    }
    if (inCode) { html.push(escapeHtml(line)); return; }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushParagraph(); closeList();
      html.push(`<h${heading[1].length}>${inlineMarkdown(heading[2])}</h${heading[1].length}>`);
      return;
    }
    if (/^\s*([-*_])\1{2,}\s*$/.test(line)) { flushParagraph(); closeList(); html.push('<hr>'); return; }
    if (/^>\s?/.test(line)) { flushParagraph(); closeList(); html.push(`<blockquote><p>${inlineMarkdown(line.replace(/^>\s?/, ''))}</p></blockquote>`); return; }

    const unordered = line.match(/^\s*[-*+]\s+(.*)$/);
    const ordered = line.match(/^\s*\d+\.\s+(.*)$/);
    if (unordered || ordered) {
      flushParagraph();
      const wanted = unordered ? 'ul' : 'ol';
      if (listType !== wanted) { closeList(); html.push(`<${wanted}>`); listType = wanted; }
      html.push(`<li>${inlineMarkdown((unordered || ordered)[1])}</li>`);
      return;
    }
    if (!line.trim()) { flushParagraph(); closeList(); return; }
    paragraph.push(line.trim());
  });
  flushParagraph(); closeList();
  if (inCode) html.push('</code></pre>');
  return html.join('\n');
};

export function MarkdownToHtml() {
  const t = useT();
  const [markdown, setMarkdown] = useState(() => t('# Hello\n\nSome **bold** text with a [link](https://talkandtool.com).\n\n- First item\n- Second item\n\n> A short quote.'));
  const [view, setView] = useState('preview');
  const html = useMemo(() => markdownToHtml(markdown), [markdown]);

  return (
    <>
      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <Label htmlFor="md-in">Markdown</Label>
          <TextArea id="md-in" className="mt-2 min-h-72" value={markdown} onChange={(e) => setMarkdown(e.target.value)} />
        </div>
        <div>
          <div className="flex items-center justify-between gap-3">
            <Label>{t('Output')}</Label>
            <Segmented ariaLabel={t('Output view')} value={view} onChange={setView} options={[{ value: 'preview', label: t('Preview') }, { value: 'html', label: 'HTML' }]} />
          </div>
          {view === 'preview'
            ? <div className="mt-2 min-h-72 overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-slate-200 [&_a]:text-indigo-300 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-indigo-400 [&_blockquote]:pl-4 [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-2 [&_h2]:mt-4 [&_h2]:text-xl [&_h2]:font-bold [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:mb-3 [&_pre]:overflow-auto [&_pre]:rounded-xl [&_pre]:bg-black/40 [&_pre]:p-3" dangerouslySetInnerHTML={{ __html: html }} />
            : <TextArea className="mt-2 min-h-72" value={html} readOnly />}
        </div>
      </div>
      <div className="mt-4"><CopyButton value={html} label={t('Copy HTML')} /></div>
    </>
  );
}

/* ----------------------------------------------------------------- Color */
const hexToRgb = (hex) => {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((char) => char + char).join('') : clean;
  if (!/^[0-9a-f]{6}$/i.test(full)) return null;
  return { r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16) };
};

const rgbToHsl = ({ r, g, b }) => {
  const rn = r / 255; const gn = g / 255; const bn = b / 255;
  const max = Math.max(rn, gn, bn); const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;
  if (delta) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
  }
  h = Math.round(h * 60); if (h < 0) h += 360;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
};

const relativeLuminance = ({ r, g, b }) => {
  const channel = (value) => {
    const scaled = value / 255;
    return scaled <= 0.03928 ? scaled / 12.92 : ((scaled + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

export function ColorConverter() {
  const t = useT();
  const [hex, setHex] = useState('#6366f1');
  const rgb = hexToRgb(hex);
  const hsl = rgb ? rgbToHsl(rgb) : null;
  const luminance = rgb ? relativeLuminance(rgb) : 0;
  const contrastWhite = (1.05) / (luminance + 0.05);
  const contrastBlack = (luminance + 0.05) / 0.05;

  return (
    <>
      <Grid className="md:grid-cols-[auto_1fr]">
        <div>
          <Label htmlFor="color-picker">{t('Pick')}</Label>
          <input id="color-picker" type="color" value={rgb ? hex : '#6366f1'} onChange={(e) => setHex(e.target.value)}
            className="mt-2 h-14 w-24 cursor-pointer rounded-xl border border-white/10 bg-transparent" />
        </div>
        <LabelledField label="HEX" id="color-hex" value={hex} onChange={(e) => setHex(e.target.value)} />
      </Grid>
      <ErrorNote>{rgb ? '' : t('Enter a valid 3 or 6 digit hex colour, for example #6366f1.')}</ErrorNote>
      {rgb && (
        <>
          <div className="mt-5 h-28 rounded-2xl border border-white/10" style={{ background: hex }} />
          <div className="mt-5 space-y-3">
            {[
              ['HEX', hex.toLowerCase()],
              ['RGB', `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`],
              ['HSL', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`],
              [t('RGB values'), `${rgb.r}, ${rgb.g}, ${rgb.b}`],
            ].map(([label, value]) => (
              <div key={value + label} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3">
                <span className="text-sm text-slate-400">{label}</span>
                <span className="font-mono text-sm text-emerald-300">{value}</span>
                <CopyButton value={value} />
              </div>
            ))}
          </div>
          <StatGrid columns="md:grid-cols-3">
            <Stat label={t('Contrast on white')} value={`${num(contrastWhite, 2)}:1`} accent={contrastWhite >= 4.5 ? 'emerald' : 'indigo'} />
            <Stat label={t('Contrast on black')} value={`${num(contrastBlack, 2)}:1`} accent={contrastBlack >= 4.5 ? 'emerald' : 'indigo'} />
            <Stat label={t('WCAG AA body text')} value={Math.max(contrastWhite, contrastBlack) >= 4.5 ? t('Passes') : t('Fails')} accent="cyan" />
          </StatGrid>
        </>
      )}
    </>
  );
}

/* -------------------------------------------------------------- Gradient */
export function GradientGenerator() {
  const t = useT();
  const [type, setType] = useState('linear');
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState([{ color: '#6366f1', position: 0 }, { color: '#22d3ee', position: 100 }]);

  const css = type === 'linear'
    ? `linear-gradient(${angle}deg, ${stops.map((stop) => `${stop.color} ${stop.position}%`).join(', ')})`
    : `radial-gradient(circle, ${stops.map((stop) => `${stop.color} ${stop.position}%`).join(', ')})`;

  const update = (index, key, value) => setStops(stops.map((stop, i) => (i === index ? { ...stop, [key]: value } : stop)));

  return (
    <>
      <div className="h-44 rounded-2xl border border-white/10" style={{ background: css }} />
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Segmented ariaLabel={t('Gradient type')} value={type} onChange={setType} options={[{ value: 'linear', label: t('Linear') }, { value: 'radial', label: t('Radial') }]} />
        {type === 'linear' && (
          <label className="flex flex-1 items-center gap-3 text-sm text-slate-300">
            {t('Angle {n}°', { n: angle })}
            <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(Number(e.target.value))} className="flex-1 accent-indigo-500" />
          </label>
        )}
      </div>
      <div className="mt-5 space-y-3">
        {stops.map((stop, index) => (
          <div key={index} className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-3">
            <input type="color" value={stop.color} onChange={(e) => update(index, 'color', e.target.value)} aria-label={t('Colour stop {n}', { n: index + 1 })} className="h-10 w-14 cursor-pointer rounded-lg border border-white/10 bg-transparent" />
            <input type="range" min="0" max="100" value={stop.position} onChange={(e) => update(index, 'position', Number(e.target.value))} aria-label={t('Position of stop {n}', { n: index + 1 })} className="flex-1 accent-indigo-500" />
            <span className="w-12 text-right text-sm text-slate-400">{stop.position}%</span>
            {stops.length > 2 && <Button variant="ghost" onClick={() => setStops(stops.filter((_, i) => i !== index))}>{t('Remove')}</Button>}
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button variant="ghost" onClick={() => setStops([...stops, { color: '#a855f7', position: 50 }])} disabled={stops.length >= 6}>{t('Add colour stop')}</Button>
        <CopyButton value={`background: ${css};`} label={t('Copy CSS')} />
      </div>
      <pre className="mt-4 overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-emerald-300">background: {css};</pre>
    </>
  );
}

/* ------------------------------------------------------------ Box shadow */
const SHADOW_SLIDERS = [
  ['x', msg('Horizontal offset'), -60, 60], ['y', msg('Vertical offset'), -60, 60],
  ['blur', msg('Blur radius'), 0, 120], ['spread', msg('Spread'), -60, 60], ['opacity', msg('Opacity'), 0, 100],
];

export function BoxShadowGenerator() {
  const t = useT();
  const [shadow, setShadow] = useState({ x: 0, y: 12, blur: 32, spread: -8, color: '#0f172a', opacity: 55, inset: false });
  const hex = hexToRgb(shadow.color) || { r: 15, g: 23, b: 42 };
  const css = `${shadow.inset ? 'inset ' : ''}${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px rgba(${hex.r}, ${hex.g}, ${hex.b}, ${(shadow.opacity / 100).toFixed(2)})`;
  const set = (key, value) => setShadow({ ...shadow, [key]: value });

  return (
    <>
      <div className="flex min-h-52 items-center justify-center rounded-2xl border border-white/10 bg-slate-200 p-10">
        <div className="h-28 w-44 rounded-2xl bg-white" style={{ boxShadow: css }} />
      </div>
      <div className="mt-5 space-y-3">
        {SHADOW_SLIDERS.map(([key, label, min, max]) => (
          <label key={key} className="flex items-center gap-3 text-sm text-slate-300">
            <span className="w-36 shrink-0">{t(label)}</span>
            <input type="range" min={min} max={max} value={shadow[key]} onChange={(e) => set(key, Number(e.target.value))} className="flex-1 accent-indigo-500" />
            <span className="w-14 text-right text-slate-400">{shadow[key]}{key === 'opacity' ? '%' : 'px'}</span>
          </label>
        ))}
        <div className="flex flex-wrap items-center gap-3">
          <input type="color" value={shadow.color} onChange={(e) => set('color', e.target.value)} aria-label={t('Shadow colour')} className="h-10 w-14 cursor-pointer rounded-lg border border-white/10 bg-transparent" />
          <Toggle checked={shadow.inset} onChange={() => set('inset', !shadow.inset)} label={t('Inset shadow')} />
          <CopyButton value={`box-shadow: ${css};`} label={t('Copy CSS')} />
        </div>
      </div>
      <pre className="mt-4 overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-emerald-300">box-shadow: {css};</pre>
    </>
  );
}

/* --------------------------------------------------------- Status codes */
// Reason phrases stay in English — they are what servers and logs print.
const statusCodes = [
  [100, 'Continue', msg('The server received the request headers and the client should send the body.')],
  [101, 'Switching Protocols', msg('The server is switching protocols as requested, most often to WebSocket.')],
  [200, 'OK', msg('The standard successful response. The body carries the requested resource.')],
  [201, 'Created', msg('The request succeeded and a new resource was created. Return its location in the Location header.')],
  [202, 'Accepted', msg('The request was accepted for processing but is not yet complete. Common for async jobs.')],
  [204, 'No Content', msg('Success with no body to return. Widely used for DELETE and for PUT updates.')],
  [206, 'Partial Content', msg('The server is returning part of the resource in response to a Range header, as used by video streaming.')],
  [301, 'Moved Permanently', msg('The resource has permanently moved. Passes ranking signals to the new URL — the correct redirect for a permanent change.')],
  [302, 'Found', msg('A temporary redirect. Search engines keep the original URL indexed, so never use it for a permanent move.')],
  [304, 'Not Modified', msg('The cached copy is still valid. Sent in response to a conditional request and saves bandwidth.')],
  [307, 'Temporary Redirect', msg('Like 302 but guarantees the HTTP method is not changed on redirect.')],
  [308, 'Permanent Redirect', msg('Like 301 but preserves the request method and body.')],
  [400, 'Bad Request', msg('The server could not parse the request. Usually malformed JSON or a missing required parameter.')],
  [401, 'Unauthorized', msg('Authentication is missing or invalid. Despite the name this is about authentication, not permissions.')],
  [403, 'Forbidden', msg('The identity is known but not allowed to do this. Retrying with the same credentials will not help.')],
  [404, 'Not Found', msg('No resource at this URL. Must return a real 404 status — a "not found" page returning 200 is a soft 404.')],
  [405, 'Method Not Allowed', msg('The URL exists but does not accept this HTTP method. Include an Allow header listing what it does accept.')],
  [409, 'Conflict', msg('The request conflicts with current state, such as a duplicate unique key or a stale version.')],
  [410, 'Gone', msg('Deliberately and permanently removed. Search engines drop a 410 from the index faster than a 404.')],
  [418, "I'm a teapot", msg('An April Fools joke from 1998 that browsers and servers have kept alive ever since.')],
  [422, 'Unprocessable Content', msg('The syntax is valid but the content fails validation rules. Common in JSON APIs.')],
  [429, 'Too Many Requests', msg('Rate limited. Include a Retry-After header so clients know when to try again.')],
  [500, 'Internal Server Error', msg('An unhandled exception on the server. The catch-all when nothing more specific applies.')],
  [502, 'Bad Gateway', msg('A proxy received an invalid response from upstream. Usually the application server is down or crashing.')],
  [503, 'Service Unavailable', msg('Temporarily overloaded or in maintenance. The right code for planned downtime, with Retry-After set.')],
  [504, 'Gateway Timeout', msg('A proxy waited too long for an upstream response. Points at a slow query or a hung dependency.')],
];

export function HttpStatusCodes() {
  const t = useT();
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('All');
  const filtered = statusCodes.filter(([code, name, description]) => {
    const groupMatch = group === 'All' || String(code)[0] === group[0];
    const term = query.toLowerCase().trim();
    const searchMatch = !term || `${code} ${name} ${t(description)}`.toLowerCase().includes(term);
    return groupMatch && searchMatch;
  });

  return (
    <>
      <Grid className="md:grid-cols-[1fr_auto]">
        <Field value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('Search by code or keyword, e.g. 404 or redirect')} aria-label={t('Search status codes')} />
        <Segmented ariaLabel={t('Status class')} value={group} onChange={setGroup} options={[{ value: 'All', label: t('All') }, '1xx', '2xx', '3xx', '4xx', '5xx']} />
      </Grid>
      <div className="mt-5 divide-y divide-white/5 overflow-hidden rounded-2xl border border-white/10">
        {filtered.map(([code, name, description]) => (
          <div key={code} className="flex gap-4 bg-slate-950/40 p-4">
            <span className={`w-14 shrink-0 text-lg font-black ${code < 300 ? 'text-emerald-300' : code < 400 ? 'text-cyan-300' : code < 500 ? 'text-amber-300' : 'text-rose-300'}`}>{code}</span>
            <div>
              <h3 className="font-bold text-white">{name}</h3>
              <p className="mt-1 text-sm leading-6 text-slate-400">{t(description)}</p>
            </div>
          </div>
        ))}
        {!filtered.length && <p className="p-6 text-center text-slate-500">{t('No status code matches that search.')}</p>}
      </div>
    </>
  );
}

/* ------------------------------------------------------------- Meta tags */
export function MetaTagGenerator() {
  const t = useT();
  const [meta, setMeta] = useState(() => ({
    title: t('Free Online Word Counter'),
    description: t('Count words, characters, sentences, and reading time instantly in your browser. No sign-up required.'),
    url: 'https://example.com/word-counter', image: 'https://example.com/cover.png', siteName: 'Example',
  }));
  const set = (key) => (event) => setMeta({ ...meta, [key]: event.target.value });

  const tags = [
    `<title>${meta.title}</title>`,
    `<meta name="description" content="${meta.description}">`,
    `<link rel="canonical" href="${meta.url}">`,
    `<meta name="robots" content="index, follow, max-image-preview:large">`,
    '',
    `<meta property="og:type" content="website">`,
    `<meta property="og:site_name" content="${meta.siteName}">`,
    `<meta property="og:title" content="${meta.title}">`,
    `<meta property="og:description" content="${meta.description}">`,
    `<meta property="og:url" content="${meta.url}">`,
    `<meta property="og:image" content="${meta.image}">`,
    '',
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${meta.title}">`,
    `<meta name="twitter:description" content="${meta.description}">`,
    `<meta name="twitter:image" content="${meta.image}">`,
  ].join('\n');

  const gauge = (value, ideal, max) => {
    const length = value.length;
    const tone = length === 0 ? 'text-slate-500' : length > max ? 'text-rose-300' : length < ideal ? 'text-amber-300' : 'text-emerald-300';
    const verdict = length > max ? t('— likely to be truncated') : length < ideal ? t('— could be longer') : t('— good length');
    return <span className={`text-xs ${tone}`}>{t('{n} characters', { n: length })} {verdict}</span>;
  };

  return (
    <>
      <div className="space-y-4">
        <div>
          <Label htmlFor="mt-title">{t('Page title')}</Label>
          <Field id="mt-title" className="mt-2" value={meta.title} onChange={set('title')} />
          <div className="mt-1">{gauge(meta.title, 30, 60)}</div>
        </div>
        <div>
          <Label htmlFor="mt-desc">{t('Meta description')}</Label>
          <TextArea id="mt-desc" className="mt-2 min-h-24" value={meta.description} onChange={set('description')} />
          <div className="mt-1">{gauge(meta.description, 110, 155)}</div>
        </div>
        <Grid>
          <LabelledField label={t('Canonical URL')} id="mt-url" value={meta.url} onChange={set('url')} />
          <LabelledField label={t('Site name')} id="mt-site" value={meta.siteName} onChange={set('siteName')} />
        </Grid>
        <LabelledField label={t('Social share image URL')} id="mt-image" value={meta.image} onChange={set('image')} />
      </div>

      <Panel title={t('Search result preview')}>
        <div className="rounded-xl bg-white p-4">
          <p className="text-xs text-slate-600">{meta.url}</p>
          <p className="mt-1 truncate text-lg text-blue-800">{meta.title || t('Your page title')}</p>
          <p className="mt-1 line-clamp-2 text-sm text-slate-700">{meta.description || t('Your meta description will appear here.')}</p>
        </div>
      </Panel>

      <div className="mt-5">
        <Label>{t('Generated tags')}</Label>
        <TextArea className="mt-2 min-h-64" value={tags} readOnly />
        <div className="mt-4"><CopyButton value={tags} label={t('Copy meta tags')} /></div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------ robots.txt */
export function RobotsTxtGenerator() {
  const t = useT();
  const [allowAll, setAllowAll] = useState(true);
  const [disallow, setDisallow] = useState('/admin/\n/login\n/search');
  const [sitemap, setSitemap] = useState('https://example.com/sitemap.xml');
  const [crawlDelay, setCrawlDelay] = useState('');
  const [blockAi, setBlockAi] = useState(false);

  const lines = ['User-agent: *'];
  if (allowAll) {
    disallow.split('\n').map((line) => line.trim()).filter(Boolean).forEach((path) => lines.push(`Disallow: ${path}`));
    if (!disallow.trim()) lines.push('Disallow:');
  } else {
    lines.push('Disallow: /');
  }
  if (crawlDelay) lines.push(`Crawl-delay: ${crawlDelay}`);
  if (blockAi) ['GPTBot', 'CCBot', 'Google-Extended', 'anthropic-ai'].forEach((bot) => lines.push('', `User-agent: ${bot}`, 'Disallow: /'));
  if (sitemap) lines.push('', `Sitemap: ${sitemap}`);
  const output = lines.join('\n');

  return (
    <>
      <div className="space-y-4">
        <Toggle checked={allowAll} onChange={() => setAllowAll(!allowAll)} label={t('Allow search engines to crawl the site')} />
        {allowAll && (
          <div>
            <Label htmlFor="rb-disallow" hint={t('one path per line')}>{t('Paths to block')}</Label>
            <TextArea id="rb-disallow" className="mt-2 min-h-32" value={disallow} onChange={(e) => setDisallow(e.target.value)} />
          </div>
        )}
        <Grid>
          <LabelledField label={t('Sitemap URL')} id="rb-sitemap" value={sitemap} onChange={(e) => setSitemap(e.target.value)} />
          <LabelledField label={t('Crawl delay (seconds, optional)')} id="rb-delay" type="number" min="0" value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} />
        </Grid>
        <Toggle checked={blockAi} onChange={() => setBlockAi(!blockAi)} label={t('Also block common AI training crawlers')} />
      </div>
      {!allowAll && (
        <p className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
          {t('This blocks every crawler from the entire site. Publishing it will remove your pages from search results over time.')}
        </p>
      )}
      <pre className="mt-5 overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-sm text-emerald-300">{output}</pre>
      <div className="mt-4"><CopyButton value={output} label={t('Copy robots.txt')} /></div>
    </>
  );
}

/* ------------------------------------------------------------ User agent */
const UNKNOWN = msg('Unknown');

const parseUserAgent = (ua) => {
  const test = (regex) => ua.match(regex);
  const browsers = [
    ['Edge', /Edg(?:e|A|iOS)?\/([\d.]+)/], ['Opera', /OPR\/([\d.]+)/], ['Samsung Internet', /SamsungBrowser\/([\d.]+)/],
    ['Firefox', /Firefox\/([\d.]+)/], ['Chrome', /Chrome\/([\d.]+)/], ['Safari', /Version\/([\d.]+).*Safari/],
  ];
  const systems = [
    ['Windows 11 or 10', /Windows NT 10\.0/], ['Windows 8.1', /Windows NT 6\.3/], ['macOS', /Mac OS X ([\d_.]+)/],
    ['Android', /Android ([\d.]+)/], ['iOS', /(?:iPhone|iPad).*OS ([\d_]+)/], ['Linux', /Linux/],
  ];
  const engines = [['Blink', /Chrome\//], ['Gecko', /Firefox\//], ['WebKit', /AppleWebKit/]];
  const found = (list) => list.find(([, regex]) => test(regex));
  const browser = found(browsers);
  const system = found(systems);
  const engine = found(engines);
  return {
    browser: browser ? `${browser[0]} ${test(browser[1])?.[1] || ''}`.trim() : UNKNOWN,
    os: system ? `${system[0]} ${(test(system[1])?.[1] || '').replace(/_/g, '.')}`.trim() : UNKNOWN,
    engine: engine ? engine[0] : UNKNOWN,
    device: /Mobi|Android|iPhone/.test(ua) ? msg('Mobile') : /iPad|Tablet/.test(ua) ? msg('Tablet') : msg('Desktop'),
    bot: /bot|crawl|spider|slurp/i.test(ua) ? msg('Yes') : msg('No'),
  };
};

export function UserAgentParser() {
  const t = useT();
  const [ua, setUa] = useState('');
  useEffect(() => { setUa(navigator.userAgent); }, []);
  const parsed = useMemo(() => parseUserAgent(ua), [ua]);

  return (
    <>
      <Label htmlFor="ua-input">{t('User agent string')}</Label>
      <TextArea id="ua-input" className="mt-2 min-h-28" value={ua} onChange={(e) => setUa(e.target.value)} placeholder={t('Paste a user agent string…')} />
      <StatGrid columns="md:grid-cols-5">
        <Stat label={t('Browser')} value={t(parsed.browser)} />
        <Stat label={t('Engine')} value={t(parsed.engine)} accent="cyan" />
        <Stat label={t('Operating system')} value={t(parsed.os)} accent="emerald" />
        <Stat label={t('Device type')} value={t(parsed.device)} />
        <Stat label={t('Looks like a bot')} value={t(parsed.bot)} accent="cyan" />
      </StatGrid>
      <div className="mt-4"><CopyButton value={ua} label={t('Copy user agent')} /></div>
    </>
  );
}
