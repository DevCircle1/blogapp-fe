import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const tools = [
  { title: 'JSON Studio', description: 'Format, validate, and minify JSON with precise errors.', icon: '{}', link: '/tools/json-studio', category: 'Developer', tags: ['json', 'formatter', 'validator'], premium: true },
  { title: 'Password Lab', description: 'Generate strong cryptographic passwords with custom controls.', icon: '✦', link: '/tools/password-generator', category: 'Security', tags: ['password', 'security', 'generator'], premium: true },
  { title: 'Unit Converter Pro', description: 'Convert length, weight, and digital storage units.', icon: '⇄', link: '/tools/unit-converter', category: 'Calculator', tags: ['unit', 'measurement', 'convert'], premium: true },
  { title: 'Base64 Encoder', description: 'Encode and decode Unicode-safe Base64 entirely locally.', icon: '64', link: '/tools/base64-tool', category: 'Developer', tags: ['base64', 'encode', 'decode'], premium: true },
  { title: 'JWT Inspector', description: 'Inspect JWT headers and claims without uploading tokens.', icon: 'JWT', link: '/tools/jwt-inspector', category: 'Security', tags: ['jwt', 'token', 'decoder'], premium: true },
  { title: 'Timestamp Converter', description: 'Translate Unix timestamps into local and UTC dates.', icon: '◷', link: '/tools/timestamp-converter', category: 'Developer', tags: ['unix', 'date', 'time'], premium: true },
  { title: 'Text Case Studio', description: 'Create title, camel, snake, kebab, upper, and lower case.', icon: 'Aa', link: '/tools/case-converter', category: 'Text', tags: ['case', 'text', 'camel'], premium: true },
  { title: 'UUID Generator', description: 'Generate secure RFC 4122 UUIDs individually or in bulk.', icon: '#', link: '/tools/uuid-generator', category: 'Developer', tags: ['uuid', 'guid', 'generator'], premium: true },
  { title: 'Regex Tester', description: 'Test JavaScript patterns with live matches and indexes.', icon: '.*', link: '/tools/regex-tester', category: 'Developer', tags: ['regex', 'pattern', 'tester'], premium: true },
  { title: 'IP Address Checker', description: 'See your public IP and network location information.', icon: '◎', link: '/check-ip', category: 'Network', tags: ['ip', 'network', 'privacy'] },
  { title: 'Profit Margin Calculator', description: 'Calculate profit, margin, and business performance.', icon: '%', link: '/profit-margin-calculator', category: 'Calculator', tags: ['finance', 'business', 'profit'] },
  { title: 'Screen Resolution', description: 'Inspect your live viewport and display dimensions.', icon: '▣', link: '/screen-resolution', category: 'Developer', tags: ['screen', 'resolution', 'design'] },
  { title: 'Rich Text to HTML', description: 'Create formatted content and export clean HTML.', icon: '</>', link: '/text-to-html', category: 'Text', tags: ['html', 'editor', 'converter'] },
  { title: 'CodeShare', description: 'Share and collaborate on code using Supabase Realtime.', icon: '</', link: '/codes', category: 'Developer', tags: ['code', 'realtime', 'share'] },
];

export default function ToolsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const categories = ['All', ...new Set(tools.map((tool) => tool.category))];
  const filtered = useMemo(() => tools.filter((tool) => {
    const term = search.toLowerCase().trim();
    const categoryMatch = category === 'All' || tool.category === category;
    const searchMatch = !term || `${tool.title} ${tool.description} ${tool.tags.join(' ')}`.toLowerCase().includes(term);
    return categoryMatch && searchMatch;
  }), [search, category]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Helmet><title>Premium Online Tools | Talk & Tool</title><meta name="description" content="Fast, private, premium-quality online tools for developers, creators, and businesses." /></Helmet>
      <section className="relative overflow-hidden border-b border-white/10 px-4 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,.25),transparent_38%),radial-gradient(circle_at_top_right,rgba(16,185,129,.14),transparent_32%)]" />
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-200"><Sparkles size={16} /> Premium quality. Free to use.</div>
          <h1 className="mt-6 text-4xl md:text-7xl font-black tracking-tight">Your browser’s<br /><span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">power toolkit.</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">Fourteen polished tools for coding, security, writing, calculations, and daily work. No installation and no data uploads.</p>
          <div className="mx-auto mt-10 max-w-2xl relative"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={21} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search JSON, password, converter…" className="w-full rounded-2xl border border-white/10 bg-white/10 py-4 pl-14 pr-5 outline-none backdrop-blur focus:border-indigo-400" /></div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-2 mb-8">{categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${category === item ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}>{item}</button>)}</div>
        <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold">{category === 'All' ? 'All tools' : category}</h2><span className="text-sm text-slate-500">{filtered.length} tools</span></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((tool) => <Link key={tool.title} to={tool.link} className="group relative rounded-3xl border border-white/10 bg-white/[0.05] p-6 transition hover:-translate-y-1 hover:border-indigo-400/50 hover:bg-white/[0.08]">
            {tool.premium && <span className="absolute right-5 top-5 rounded-full bg-amber-300/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">Pro</span>}
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-cyan-400/10 font-black text-indigo-200">{tool.icon}</div>
            <h3 className="mt-5 text-xl font-bold group-hover:text-indigo-300">{tool.title}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-slate-400">{tool.description}</p>
            <div className="mt-5 flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{tool.category}</span><ArrowRight size={18} className="text-indigo-300 transition group-hover:translate-x-1" /></div>
          </Link>)}
        </div>
        {!filtered.length && <div className="rounded-3xl border border-dashed border-white/15 p-16 text-center text-slate-400">No tools match that search.</div>}
        <div className="mt-14 grid md:grid-cols-3 gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6">
          <div className="p-4"><ShieldCheck className="text-indigo-300" /><h3 className="mt-3 font-bold">Private by design</h3><p className="mt-1 text-sm text-slate-500">Processing stays inside your browser.</p></div>
          <div className="p-4"><Zap className="text-indigo-300" /><h3 className="mt-3 font-bold">Instant results</h3><p className="mt-1 text-sm text-slate-500">No queues, uploads, or waiting.</p></div>
          <div className="p-4"><Sparkles className="text-indigo-300" /><h3 className="mt-3 font-bold">Premium experience</h3><p className="mt-1 text-sm text-slate-500">Responsive, polished, and easy to use.</p></div>
        </div>
      </main>
    </div>
  );
}
