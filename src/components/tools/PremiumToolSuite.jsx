import { useMemo, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Check, Copy, RefreshCw, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { getToolBySlug, premiumTools, SITE_URL } from './toolCatalog.js';

const copyText = async (value, setCopied) => {
  await navigator.clipboard.writeText(value);
  setCopied(true);
  setTimeout(() => setCopied(false), 1500);
};

const ToolShell = ({ title, description, children, noindex = false }) => {
  const { pathname } = useLocation();
  const slug = pathname.split('/').filter(Boolean).at(-1);
  const tool = getToolBySlug(slug);
  const pageTitle = tool?.title || title;
  const pageDescription = tool?.description || description;
  const canonical = `${SITE_URL}${pathname}`;
  const related = premiumTools.filter((item) => item.slug !== slug && item.category === tool?.category).slice(0, 3);
  const faq = tool ? [
    { question: `Is the ${tool.shortTitle} free to use?`, answer: `Yes. The ${tool.shortTitle} is free to use and does not require an account or software installation.` },
    { question: `Is my information uploaded?`, answer: 'No. The calculation or text processing happens in your browser. Your input is not uploaded by this tool.' },
    { question: `Does it work on mobile devices?`, answer: 'Yes. The tool works in modern browsers on phones, tablets, laptops, and desktop computers.' },
  ] : [];
  const schemas = tool ? [
    { '@context': 'https://schema.org', '@type': 'WebApplication', name: pageTitle, url: canonical, description: pageDescription, applicationCategory: tool.category === 'Calculator' || tool.category === 'Finance' || tool.category === 'Health' ? 'FinanceApplication' : 'UtilitiesApplication', operatingSystem: 'Any', browserRequirements: 'Requires JavaScript', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, provider: { '@type': 'Organization', name: 'Talk & Tool', url: SITE_URL } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faq.map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
    { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL }, { '@type': 'ListItem', position: 2, name: 'Tools', item: `${SITE_URL}/tools` }, { '@type': 'ListItem', position: 3, name: tool.shortTitle, item: canonical }] },
  ] : [];
  return <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
    <Helmet>
      <title>{pageTitle} | Talk & Tool</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary" />
      {schemas.map((schema, index) => <script key={index} type="application/ld+json">{JSON.stringify(schema)}</script>)}
    </Helmet>
    <div className="max-w-6xl mx-auto">
      <Link to="/tools" className="inline-flex items-center text-sm text-indigo-300 hover:text-white mb-8">← All tools</Link>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-xs font-semibold text-indigo-200 mb-4">
          <Sparkles size={14} /> Premium browser tool
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight">{pageTitle}</h1>
        <p className="mt-3 max-w-2xl text-slate-400">{pageDescription}</p>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/[0.06] shadow-2xl shadow-indigo-950/50 p-5 md:p-8">{children}</div>
      <p className="text-center text-xs text-slate-500 mt-6">Your data stays in this browser and is never uploaded.</p>
      {tool && <section className="mt-12 grid gap-8 lg:grid-cols-[1.35fr_.65fr]">
        <div><h2 className="text-2xl font-bold">How to use the {tool.shortTitle}</h2><ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-slate-400"><li>Enter or paste the values you want to process in the fields above.</li><li>Choose any available settings for your result.</li><li>Review the result and copy it for your work.</li></ol><h2 className="mt-9 text-2xl font-bold">About this {tool.category.toLowerCase()} tool</h2><p className="mt-4 leading-7 text-slate-400">{pageDescription} It is designed for quick, repeatable tasks and works without an account. Results update locally, making it useful on both desktop and mobile devices.</p></div>
        <aside><h2 className="text-xl font-bold">Related tools</h2><div className="mt-4 space-y-3">{related.map((item) => <Link key={item.slug} to={`/tools/${item.slug}`} className="block rounded-xl border border-white/10 bg-white/5 p-4 hover:border-indigo-400"><strong>{item.shortTitle}</strong><span className="mt-1 block text-sm text-slate-500">{item.description}</span></Link>)}</div></aside>
        <div className="lg:col-span-2"><h2 className="text-2xl font-bold">Frequently asked questions</h2><div className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 px-5">{faq.map((item) => <details key={item.question} className="py-4"><summary className="cursor-pointer font-semibold">{item.question}</summary><p className="mt-3 leading-7 text-slate-400">{item.answer}</p></details>)}</div></div>
      </section>}
    </div>
  </div>
};

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

function WordCounter() {
  const [text, setText] = useState('');
  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/u).length : 0;
    const sentences = trimmed ? (trimmed.match(/[^.!?]+[.!?]+|[^.!?]+$/gu) || []).length : 0;
    const paragraphs = trimmed ? trimmed.split(/\n\s*\n/u).filter(Boolean).length : 0;
    return { words, characters: text.length, noSpaces: text.replace(/\s/gu, '').length, sentences, paragraphs, reading: Math.max(words ? 1 : 0, Math.ceil(words / 225)) };
  }, [text]);
  return <ToolShell title="Word Counter" description="Count words and characters instantly."><TextArea value={text} onChange={(event) => setText(event.target.value)} placeholder="Type or paste your text here…" /><div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">{[['Words', stats.words], ['Characters', stats.characters], ['No spaces', stats.noSpaces], ['Sentences', stats.sentences], ['Paragraphs', stats.paragraphs], ['Reading time', `${stats.reading} min`]].map(([label, value]) => <div key={label} className="rounded-2xl bg-white/5 p-4 text-center"><strong className="block text-2xl text-indigo-300">{value}</strong><span className="mt-1 block text-xs text-slate-500">{label}</span></div>)}</div></ToolShell>;
}

function PercentageCalculator() {
  const [percent, setPercent] = useState('20');
  const [value, setValue] = useState('150');
  const [from, setFrom] = useState('100');
  const [to, setTo] = useState('125');
  const ofResult = Number(value) * Number(percent) / 100;
  const change = Number(from) === 0 ? null : ((Number(to) - Number(from)) / Math.abs(Number(from))) * 100;
  return <ToolShell title="Percentage Calculator" description="Calculate percentages and percentage change."><div className="grid gap-6 md:grid-cols-2"><div className="rounded-2xl bg-slate-950/50 p-5"><h2 className="font-bold">What is X% of Y?</h2><div className="mt-4 flex items-center gap-2"><Field aria-label="Percentage" type="number" value={percent} onChange={(event) => setPercent(event.target.value)} /><span>% of</span><Field aria-label="Number" type="number" value={value} onChange={(event) => setValue(event.target.value)} /></div><p className="mt-5 text-2xl font-bold text-emerald-300">{Number.isFinite(ofResult) ? ofResult.toLocaleString(undefined, { maximumFractionDigits: 8 }) : '—'}</p><p className="mt-2 text-sm text-slate-500">Formula: ({percent} ÷ 100) × {value}</p></div><div className="rounded-2xl bg-slate-950/50 p-5"><h2 className="font-bold">Percentage change</h2><div className="mt-4 flex items-center gap-2"><Field aria-label="Starting value" type="number" value={from} onChange={(event) => setFrom(event.target.value)} /><span>to</span><Field aria-label="New value" type="number" value={to} onChange={(event) => setTo(event.target.value)} /></div><p className="mt-5 text-2xl font-bold text-cyan-300">{change === null || !Number.isFinite(change) ? 'Starting value cannot be zero' : `${change.toLocaleString(undefined, { maximumFractionDigits: 4 })}%`}</p><p className="mt-2 text-sm text-slate-500">Formula: (new − original) ÷ |original| × 100</p></div></div></ToolShell>;
}

function AgeCalculator() {
  const [birthDate, setBirthDate] = useState('');
  const result = useMemo(() => {
    if (!birthDate) return null;
    const birth = new Date(`${birthDate}T00:00:00`); const today = new Date();
    if (Number.isNaN(birth.getTime()) || birth > today) return null;
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();
    if (days < 0) { months -= 1; days += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
    if (months < 0) { years -= 1; months += 12; }
    const totalDays = Math.floor((new Date(today.getFullYear(), today.getMonth(), today.getDate()) - birth) / 86400000);
    return { years, months, days, totalDays };
  }, [birthDate]);
  const maxDate = new Date().toISOString().slice(0, 10);
  return <ToolShell title="Age Calculator" description="Calculate your exact age from your date of birth."><label htmlFor="birth-date" className="block text-sm text-slate-300">Date of birth</label><Field id="birth-date" type="date" max={maxDate} value={birthDate} onChange={(event) => setBirthDate(event.target.value)} className="mt-2 max-w-md" />{result ? <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">{[['Years', result.years], ['Months', result.months], ['Days', result.days], ['Total days', result.totalDays.toLocaleString()]].map(([label, value]) => <div key={label} className="rounded-2xl bg-white/5 p-5 text-center"><strong className="text-3xl text-emerald-300">{value}</strong><span className="mt-1 block text-sm text-slate-500">{label}</span></div>)}</div> : <p className="mt-5 text-slate-500">Choose a valid past date to calculate age.</p>}</ToolShell>;
}

function LoanCalculator() {
  const [amount, setAmount] = useState('10000'); const [rate, setRate] = useState('7'); const [years, setYears] = useState('3');
  const result = useMemo(() => { const principal = Number(amount); const count = Number(years) * 12; const monthlyRate = Number(rate) / 1200; if (principal <= 0 || count <= 0 || monthlyRate < 0) return null; const payment = monthlyRate === 0 ? principal / count : principal * monthlyRate * (1 + monthlyRate) ** count / ((1 + monthlyRate) ** count - 1); return { payment, total: payment * count, interest: payment * count - principal }; }, [amount, rate, years]);
  return <ToolShell title="Loan Calculator" description="Estimate monthly loan or EMI payments and total interest."><div className="grid gap-4 md:grid-cols-3"><label className="text-sm text-slate-400">Loan amount<Field type="number" min="0" value={amount} onChange={(event) => setAmount(event.target.value)} className="mt-2" /></label><label className="text-sm text-slate-400">Annual interest rate (%)<Field type="number" min="0" step="0.01" value={rate} onChange={(event) => setRate(event.target.value)} className="mt-2" /></label><label className="text-sm text-slate-400">Loan term (years)<Field type="number" min="0.1" step="0.5" value={years} onChange={(event) => setYears(event.target.value)} className="mt-2" /></label></div>{result && <div className="mt-6 grid gap-3 md:grid-cols-3">{[['Monthly payment', result.payment], ['Total interest', result.interest], ['Total repayment', result.total]].map(([label, value]) => <div key={label} className="rounded-2xl bg-white/5 p-5"><span className="text-sm text-slate-500">{label}</span><strong className="mt-2 block text-2xl text-emerald-300">{value.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })}</strong></div>)}</div>}<p className="mt-5 text-xs leading-5 text-slate-500">This is an estimate for a fixed-rate amortizing loan and excludes fees, taxes, and insurance. Confirm actual terms with your lender.</p></ToolShell>;
}

function BmiCalculator() {
  const [height, setHeight] = useState('170'); const [weight, setWeight] = useState('70');
  const bmi = Number(height) > 0 ? Number(weight) / (Number(height) / 100) ** 2 : 0;
  const category = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Healthy range' : bmi < 30 ? 'Overweight' : 'Obesity range';
  return <ToolShell title="BMI Calculator" description="Calculate body mass index for adults using metric measurements."><div className="grid gap-4 md:grid-cols-2"><label className="text-sm text-slate-400">Height (cm)<Field type="number" min="1" value={height} onChange={(event) => setHeight(event.target.value)} className="mt-2" /></label><label className="text-sm text-slate-400">Weight (kg)<Field type="number" min="1" value={weight} onChange={(event) => setWeight(event.target.value)} className="mt-2" /></label></div><div className="mt-6 rounded-2xl bg-emerald-400/10 p-6 text-center"><span className="text-sm text-slate-400">Your BMI</span><strong className="mt-2 block text-4xl text-emerald-300">{Number.isFinite(bmi) ? bmi.toFixed(1) : '—'}</strong><span className="mt-2 block">{category}</span></div><p className="mt-5 text-xs leading-5 text-slate-500">For adults age 20 and older. BMI is a screening measure, not a diagnosis, and does not account for individual body composition. Consult a qualified health professional for medical advice.</p></ToolShell>;
}

function UrlEncoder() {
  const [input, setInput] = useState(''); const [output, setOutput] = useState(''); const [error, setError] = useState('');
  const transform = (mode) => { try { setOutput(mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input)); setError(''); } catch { setOutput(''); setError('The input contains invalid or incomplete percent-encoding.'); } };
  return <ToolShell title="URL Encoder & Decoder" description="Encode or decode URL components and percent-encoded text."><div className="grid gap-5 lg:grid-cols-2"><TextArea value={input} onChange={(event) => setInput(event.target.value)} placeholder="Enter text or an encoded URL component…" /><TextArea value={output} readOnly placeholder="Result…" /></div>{error && <p className="mt-3 text-rose-300">{error}</p>}<div className="mt-5 flex flex-wrap gap-3"><button onClick={() => transform('encode')} className="rounded-xl bg-indigo-500 px-4 py-2 font-semibold">Encode</button><button onClick={() => transform('decode')} className="rounded-xl bg-white/10 px-4 py-2 font-semibold">Decode</button><CopyButton value={output} /></div></ToolShell>;
}

const tools = { 'json-studio': JsonStudio, 'password-generator': PasswordGenerator, 'unit-converter': UnitConverter, 'base64-tool': Base64Tool, 'jwt-inspector': JwtInspector, 'timestamp-converter': TimestampConverter, 'case-converter': CaseConverter, 'uuid-generator': UuidGenerator, 'regex-tester': RegexTester, 'word-counter': WordCounter, 'percentage-calculator': PercentageCalculator, 'age-calculator': AgeCalculator, 'loan-calculator': LoanCalculator, 'bmi-calculator': BmiCalculator, 'url-encoder': UrlEncoder };

export default function PremiumToolSuite() {
  const { toolSlug } = useParams();
  const Tool = tools[toolSlug];
  if (!Tool) return <ToolShell title="Tool not found" description="This tool does not exist." noindex><Link to="/tools" className="text-indigo-300">Return to all tools</Link></ToolShell>;
  return <Tool />;
}
