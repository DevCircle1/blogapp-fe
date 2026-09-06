import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { premiumTools, SITE_URL } from './toolCatalog.js';

const tools = [
  ...premiumTools.map((tool) => ({ ...tool, title: tool.shortTitle, link: `/tools/${tool.slug}`, premium: true })),
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
      <Helmet>
        <title>Free Online Tools, Calculators & Converters | Talk & Tool</title>
        <meta name="description" content="Free online calculators, converters, text tools, and developer utilities. Fast, mobile-friendly, and private with no sign-up required." />
        <link rel="canonical" href={`${SITE_URL}/tools`} />
        <meta property="og:title" content="Free Online Tools, Calculators & Converters" />
        <meta property="og:description" content="Useful free browser tools for calculations, writing, security, and development." />
        <meta property="og:url" content={`${SITE_URL}/tools`} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary" />
        <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'Free Online Tools, Calculators & Converters', url: `${SITE_URL}/tools`, mainEntity: { '@type': 'ItemList', itemListElement: tools.map((tool, index) => ({ '@type': 'ListItem', position: index + 1, name: tool.title, url: `${SITE_URL}${tool.link}` })) } })}</script>
      </Helmet>
      <section className="relative overflow-hidden border-b border-white/10 px-4 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,.25),transparent_38%),radial-gradient(circle_at_top_right,rgba(16,185,129,.14),transparent_32%)]" />
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-200"><Sparkles size={16} /> Premium quality. Free to use.</div>
          <h1 className="mt-6 text-4xl md:text-7xl font-black tracking-tight">Free online tools<br /><span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">that work instantly.</span></h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">Fast calculators, converters, text utilities, and developer tools. No installation or sign-up. Most processing stays on your device.</p>
          <div className="mx-auto mt-10 max-w-2xl relative"><Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={21} /><label htmlFor="tool-search" className="sr-only">Search online tools</label><input id="tool-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search word counter, calculator, JSON…" className="w-full rounded-2xl border border-white/10 bg-white/10 py-4 pl-14 pr-5 outline-none backdrop-blur focus:border-indigo-400" /></div>
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
        <section className="mt-14 max-w-4xl">
          <h2 className="text-2xl font-bold">Useful tools without downloads or sign-ups</h2>
          <p className="mt-4 leading-7 text-slate-400">Talk & Tool brings everyday calculators, writing helpers, security utilities, and developer tools into one fast collection. Open any tool, enter your values, and get an immediate result. Tools that handle pasted text or calculations run in your browser, so your input does not need to be sent to our servers.</p>
          <h2 className="mt-8 text-2xl font-bold">How to use these online tools</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-400"><li>Choose a category or search for the task you need.</li><li>Open the tool and enter your text, date, or numbers.</li><li>Review the instant result, then copy it when needed.</li></ol>
        </section>
      </main>
    </div>
  );
}
