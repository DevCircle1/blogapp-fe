import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, Copy, RefreshCw, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const copyText = async (value, setCopied) => {
  await navigator.clipboard.writeText(value);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
};

const ToolShell = ({ title, description, children }) => (
  <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
    <Helmet>
      <title>{title} | Talk & Tool</title>
      <meta name="description" content={description} />
    </Helmet>
    <div className="max-w-6xl mx-auto">
      <Link to="/tools" className="inline-flex items-center text-sm text-indigo-300 hover:text-white mb-8">← All tools</Link>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-xs font-semibold text-indigo-200 mb-4">
          <Sparkles size={14} /> Premium browser tool
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">{title}</h1>
        <p className="mt-3 max-w-2xl text-slate-400">{description}</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] shadow-2xl shadow-indigo-950/50 p-5 md:p-8">{children}</div>
      <p className="text-center text-xs text-slate-500 mt-6">Your data stays in this browser and is never uploaded.</p>
    </div>
  </div>
);

const CopyButton = ({ value }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => copyText(value, setCopied)} disabled={!value} className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 font-semibold hover:bg-indigo-400 disabled:opacity-40">
      {copied ? <Check size={17} /> : <Copy size={17} />} {copied ? 'Copied' : 'Copy'}
    </button>
  );
};

const TextArea = (props) => <textarea {...props} className={`min-h-64 w-full rounded-2xl border border-white/10 bg-slate-950/70 p-4 font-mono text-sm outline-none focus:border-indigo-400 ${props.className || ''}`} />;
const Field = (props) => <input {...props} className={`w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 outline-none focus:border-indigo-400 ${props.className || ''}`} />;

function JsonStudio() {
  const [input, setInput] = useState('{"hello":"world","items":[1,2,3]}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const transform = (compact = false) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, compact ? 0 : 2));
      setError('');
    } catch (err) { setError(err.message); setOutput(''); }
  };
  return <ToolShell title="JSON Studio" description="Validate, format, and minify JSON with precise error feedback.">
    <div className="grid lg:grid-cols-2 gap-5"><TextArea value={input} onChange={(e) => setInput(e.target.value)} spellCheck="false" /><TextArea value={output} readOnly placeholder="Your valid JSON appears here…" /></div>
    {error && <p className="mt-3 rounded-xl bg-rose-500/10 p-3 text-sm text-rose-300">{error}</p>}
    <div className="flex flex-wrap gap-3 mt-5"><button onClick={() => transform(false)} className="rounded-xl bg-indigo-500 px-4 py-2 font-semibold">Format</button><button onClick={() => transform(true)} className="rounded-xl bg-white/10 px-4 py-2 font-semibold">Minify</button><CopyButton value={output} /></div>
  </ToolShell>;
}

function PasswordGenerator() {
  const [length, setLength] = useState(20);
  const [options, setOptions] = useState({ upper: true, lower: true, numbers: true, symbols: true });
  const [password, setPassword] = useState('');
  const generate = () => {
    const pools = { upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lower: 'abcdefghijklmnopqrstuvwxyz', numbers: '0123456789', symbols: '!@#$%^&*_-+=' };
    const enabled = Object.keys(options).filter((key) => options[key]);
    if (!enabled.length) return;
    const chars = enabled.map((key) => pools[key]).join('');
    const bytes = crypto.getRandomValues(new Uint32Array(length));
    const result = Array.from(bytes, (value) => chars[value % chars.length]);
    enabled.forEach((key, index) => { result[index] = pools[key][bytes[index] % pools[key].length]; });
    setPassword(result.sort(() => crypto.getRandomValues(new Uint8Array(1))[0] - 128).join(''));
  };
  return <ToolShell title="Password Lab" description="Generate cryptographically strong passwords with fine-grained controls.">
    <div className="rounded-2xl bg-slate-950/70 p-5"><div className="break-all font-mono text-xl text-emerald-300 min-h-8">{password || 'Click generate to create a password'}</div></div>
    <label className="block mt-6 text-sm text-slate-300">Length: <strong>{length}</strong></label><input type="range" min="8" max="64" value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-indigo-500 mt-2" />
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">{Object.keys(options).map((key) => <label key={key} className="rounded-xl bg-white/5 p-3 capitalize"><input type="checkbox" checked={options[key]} onChange={() => setOptions({ ...options, [key]: !options[key] })} className="mr-2 accent-indigo-500" />{key}</label>)}</div>
    <div className="flex gap-3 mt-6"><button onClick={generate} className="inline-flex items-center gap-2 rounded-xl bg-indigo-500 px-4 py-2 font-semibold"><RefreshCw size={17} /> Generate</button><CopyButton value={password} /></div>
  </ToolShell>;
}

const unitGroups = {
  Length: { Meter: 1, Kilometer: 1000, Centimeter: 0.01, Mile: 1609.344, Foot: 0.3048, Inch: 0.0254 },
  Weight: { Kilogram: 1, Gram: 0.001, Pound: 0.45359237, Ounce: 0.0283495231 },
  Data: { Byte: 1, Kilobyte: 1024, Megabyte: 1048576, Gigabyte: 1073741824 },
};
function UnitConverter() {
  const [group, setGroup] = useState('Length'); const [from, setFrom] = useState('Meter'); const [to, setTo] = useState('Kilometer'); const [value, setValue] = useState('1');
  const units = Object.keys(unitGroups[group]);
  const result = value === '' ? '' : (Number(value) * unitGroups[group][from] / unitGroups[group][to]).toLocaleString(undefined, { maximumFractionDigits: 10 });
  const changeGroup = (next) => { const keys = Object.keys(unitGroups[next]); setGroup(next); setFrom(keys[0]); setTo(keys[1]); };
  return <ToolShell title="Unit Converter Pro" description="Convert length, weight, and digital storage units instantly.">
    <div className="flex flex-wrap gap-2 mb-6">{Object.keys(unitGroups).map((name) => <button key={name} onClick={() => changeGroup(name)} className={`rounded-full px-4 py-2 ${group === name ? 'bg-indigo-500' : 'bg-white/10'}`}>{name}</button>)}</div>
    <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 items-end"><div><label className="text-sm text-slate-400">From</label><Field type="number" value={value} onChange={(e) => setValue(e.target.value)} /><select value={from} onChange={(e) => setFrom(e.target.value)} className="mt-2 w-full rounded-xl bg-slate-900 p-3">{units.map((unit) => <option key={unit}>{unit}</option>)}</select></div><button onClick={() => { setFrom(to); setTo(from); }} className="rounded-xl bg-white/10 p-3">⇄</button><div><label className="text-sm text-slate-400">To</label><div className="rounded-xl bg-emerald-400/10 px-4 py-3 text-xl font-bold text-emerald-300 min-h-12">{result}</div><select value={to} onChange={(e) => setTo(e.target.value)} className="mt-2 w-full rounded-xl bg-slate-900 p-3">{units.map((unit) => <option key={unit}>{unit}</option>)}</select></div></div>
  </ToolShell>;
}

function Base64Tool() {
  const [input, setInput] = useState(''); const [output, setOutput] = useState(''); const [error, setError] = useState('');
  const encode = () => { try { setOutput(btoa(String.fromCharCode(...new TextEncoder().encode(input)))); setError(''); } catch (err) { setError(err.message); } };
  const decode = () => { try { setOutput(new TextDecoder().decode(Uint8Array.from(atob(input.trim()), (char) => char.charCodeAt(0)))); setError(''); } catch { setError('That is not valid Base64.'); setOutput(''); } };
  return <ToolShell title="Base64 Encoder & Decoder" description="Encode Unicode text to Base64 or safely decode Base64 back to text."><div className="grid lg:grid-cols-2 gap-5"><TextArea value={input} onChange={(e) => setInput(e.target.value)} /><TextArea value={output} readOnly /></div>{error && <p className="text-rose-300 mt-3">{error}</p>}<div className="flex gap-3 mt-5"><button onClick={encode} className="rounded-xl bg-indigo-500 px-4 py-2">Encode</button><button onClick={decode} className="rounded-xl bg-white/10 px-4 py-2">Decode</button><CopyButton value={output} /></div></ToolShell>;
}

function JwtInspector() {
  const [token, setToken] = useState('');
  const decoded = useMemo(() => { try { const [header, payload] = token.split('.'); const parse = (part) => JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(part.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0)))); return { header: parse(header), payload: parse(payload) }; } catch { return null; } }, [token]);
  return <ToolShell title="JWT Inspector" description="Inspect JWT headers, claims, and expiry locally. This tool does not verify signatures."><TextArea value={token} onChange={(e) => setToken(e.target.value.trim())} placeholder="Paste a JWT…" className="min-h-32" /><div className="grid lg:grid-cols-2 gap-5 mt-5"><pre className="overflow-auto rounded-2xl bg-slate-950/70 p-4 text-sm text-cyan-300">{decoded ? JSON.stringify(decoded.header, null, 2) : 'Header'}</pre><pre className="overflow-auto rounded-2xl bg-slate-950/70 p-4 text-sm text-emerald-300">{decoded ? JSON.stringify(decoded.payload, null, 2) : 'Payload'}</pre></div><p className="mt-4 text-sm text-amber-300">Never treat decoded claims as trusted until the signature is verified by your server.</p></ToolShell>;
}

function TimestampConverter() {
  const [timestamp, setTimestamp] = useState(() => Math.floor(Date.now() / 1000).toString());
  const milliseconds = timestamp.length > 10 ? Number(timestamp) : Number(timestamp) * 1000;
  const date = new Date(milliseconds); const valid = !Number.isNaN(date.getTime());
  return <ToolShell title="Unix Timestamp Converter" description="Convert Unix seconds or milliseconds into local and UTC dates."><Field value={timestamp} onChange={(e) => setTimestamp(e.target.value.replace(/\D/g, ''))} /><div className="grid md:grid-cols-2 gap-4 mt-5"><div className="rounded-2xl bg-white/5 p-5"><span className="text-slate-400 text-sm">Local time</span><p className="mt-2 font-semibold">{valid ? date.toLocaleString() : 'Invalid timestamp'}</p></div><div className="rounded-2xl bg-white/5 p-5"><span className="text-slate-400 text-sm">UTC / ISO</span><p className="mt-2 font-semibold break-all">{valid ? date.toISOString() : 'Invalid timestamp'}</p></div></div><button onClick={() => setTimestamp(Math.floor(Date.now() / 1000).toString())} className="rounded-xl bg-indigo-500 px-4 py-2 mt-5">Use current time</button></ToolShell>;
}

function CaseConverter() {
  const [text, setText] = useState(''); const [result, setResult] = useState('');
  const words = () => text.trim().split(/\s+/).filter(Boolean);
  const actions = { UPPERCASE: () => text.toUpperCase(), lowercase: () => text.toLowerCase(), 'Title Case': () => text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()), camelCase: () => words().map((w, i) => i ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w.toLowerCase()).join(''), snake_case: () => words().join('_').toLowerCase(), 'kebab-case': () => words().join('-').toLowerCase() };
  return <ToolShell title="Text Case Studio" description="Transform text into developer and editorial casing formats."><TextArea value={text} onChange={(e) => setText(e.target.value)} /><div className="flex flex-wrap gap-2 my-5">{Object.entries(actions).map(([name, action]) => <button key={name} onClick={() => setResult(action())} className="rounded-xl bg-white/10 px-4 py-2 hover:bg-indigo-500">{name}</button>)}</div><TextArea value={result} readOnly className="min-h-32" /><div className="mt-4"><CopyButton value={result} /></div></ToolShell>;
}

function UuidGenerator() {
  const [count, setCount] = useState(5); const [values, setValues] = useState([]);
  const generate = () => setValues(Array.from({ length: count }, () => crypto.randomUUID()));
  return <ToolShell title="UUID Generator" description="Generate secure RFC 4122 version 4 UUIDs in bulk."><div className="flex gap-3"><Field type="number" min="1" max="100" value={count} onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))} /><button onClick={generate} className="rounded-xl bg-indigo-500 px-5 font-semibold">Generate</button></div><pre className="mt-5 min-h-48 overflow-auto rounded-2xl bg-slate-950/70 p-4 text-emerald-300">{values.join('\n') || 'Your UUIDs will appear here.'}</pre><div className="mt-4"><CopyButton value={values.join('\n')} /></div></ToolShell>;
}

function RegexTester() {
  const [pattern, setPattern] = useState('\\b[A-Z]\\w+'); const [flags, setFlags] = useState('g'); const [text, setText] = useState('Hello world from Talk and Tool');
  const result = useMemo(() => { try { const regex = new RegExp(pattern, flags); return { matches: Array.from(text.matchAll(regex)).map((match) => ({ value: match[0], index: match.index })), error: '' }; } catch (err) { return { matches: [], error: err.message }; } }, [pattern, flags, text]);
  return <ToolShell title="Regex Tester" description="Test JavaScript regular expressions with live matches and indexes."><div className="grid md:grid-cols-[1fr_120px] gap-3"><Field value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="Pattern" /><Field value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="Flags" /></div><TextArea value={text} onChange={(e) => setText(e.target.value)} className="mt-4 min-h-40" />{result.error ? <p className="text-rose-300 mt-4">{result.error}</p> : <div className="mt-4 rounded-2xl bg-white/5 p-4"><p className="font-semibold">{result.matches.length} matches</p><div className="flex flex-wrap gap-2 mt-3">{result.matches.map((match, index) => <span key={`${match.index}-${index}`} className="rounded-lg bg-emerald-400/10 px-3 py-1 text-emerald-300">{match.value} <small>@{match.index}</small></span>)}</div></div>}</ToolShell>;
}

const tools = { 'json-studio': JsonStudio, 'password-generator': PasswordGenerator, 'unit-converter': UnitConverter, 'base64-tool': Base64Tool, 'jwt-inspector': JwtInspector, 'timestamp-converter': TimestampConverter, 'case-converter': CaseConverter, 'uuid-generator': UuidGenerator, 'regex-tester': RegexTester };

export default function PremiumToolSuite() {
  const { toolSlug } = useParams();
  const Tool = tools[toolSlug];
  if (!Tool) return <ToolShell title="Tool not found" description="This tool does not exist."><Link to="/tools" className="text-indigo-300">Return to all tools</Link></ToolShell>;
  return <Tool />;
}
