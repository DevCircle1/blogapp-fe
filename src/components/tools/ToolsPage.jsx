import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import Seo from '../common/Seo.jsx';
import AdSlot from '../common/AdSlot.jsx';
import { allToolLinks } from './toolCatalog.js';
import { SITE_URL, SITE_NAME, breadcrumbSchema, faqSchema } from '../../seo/siteMeta.js';

const CATEGORY_BLURB = {
  Calculator: 'Everyday maths: percentages, averages, ratios, fractions, ages, and unit conversions.',
  Finance: 'Loans, mortgages, interest, tax, margins, and the pricing maths behind a small business.',
  Health: 'BMI, calories, macros, body composition, hydration, and pregnancy dates, with the limits of each method stated plainly.',
  Developer: 'JSON, Base64, JWT, regex, hashing, colour, CSS, and the reference tables you keep re-searching.',
  Security: 'Password generation and strength testing, plus card and email validation that never leaves your browser.',
  Text: 'Counting, casing, sorting, deduplicating, diffing, and cleaning up text before it goes anywhere.',
  'Date & Time': 'Date differences, deadlines, business days, durations, countdowns, and Unix timestamps.',
  Games: 'A short daily puzzle for when the work is done.',
  SEO: 'Keyword discovery, long-tail research, content planning, and topic clustering with transparent browser-based methods.',
};

const PAGE_FAQS = [
  { q: 'Are these online tools really free?', a: 'Yes. Every tool is free to use with no account, no trial, and no usage cap. The site is funded by advertising rather than by charging for the tools.' },
  { q: 'Is my data uploaded when I use a tool?', a: 'No. The calculators, converters, and text utilities run entirely in your browser using JavaScript. Text you paste and numbers you enter are never sent to a server.' },
  { q: 'Do the tools work on a phone?', a: 'Yes. Every tool is responsive and works in any modern mobile or desktop browser. Nothing needs to be installed.' },
  { q: 'Can I use these tools for commercial work?', a: 'Yes. You are free to use the results in commercial, academic, and personal work. The calculators are provided for general information and should not replace professional financial, medical, or legal advice.' },
];

export default function ToolsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = ['All', ...new Set(allToolLinks.map((tool) => tool.category))].sort((a, b) => (a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b)));

  const filtered = useMemo(() => allToolLinks.filter((tool) => {
    const term = search.toLowerCase().trim();
    const categoryMatch = category === 'All' || tool.category === category;
    const searchMatch = !term || `${tool.title} ${tool.shortTitle} ${tool.description} ${tool.tags.join(' ')}`.toLowerCase().includes(term);
    return categoryMatch && searchMatch;
  }), [search, category]);

  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((tool) => {
      if (!map.has(tool.category)) map.set(tool.category, []);
      map.get(tool.category).push(tool);
    });
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [filtered]);

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Free Online Tools and Calculators | ${SITE_NAME}`,
      url: `${SITE_URL}/tools`,
      description: `A directory of ${allToolLinks.length} free browser-based calculators, converters, text utilities, and developer tools.`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: allToolLinks.length,
        itemListElement: allToolLinks.map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: tool.shortTitle || tool.title,
          url: `${SITE_URL}${tool.link}`,
        })),
      },
    },
    faqSchema(PAGE_FAQS),
    breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Tools', path: '/tools' }]),
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Seo
        title={`${allToolLinks.length} Free Online Tools, Calculators & Converters`}
        description={`Browse ${allToolLinks.length} free online tools: calculators, unit converters, text utilities, and developer tools. Fast, mobile-friendly, and private — everything runs in your browser.`}
        path="/tools"
        schemas={schemas}
      />

      <section className="relative overflow-hidden border-b border-white/10 px-4 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,.25),transparent_38%),radial-gradient(circle_at_top_right,rgba(16,185,129,.14),transparent_32%)]" />
        <div className="relative mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-200">
            <Sparkles size={16} /> {allToolLinks.length} tools. All free.
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-tight md:text-7xl">
            Free online tools<br />
            <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">that work instantly.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Calculators, converters, text utilities, and developer tools. No installation, no sign-up, and your data never leaves your browser.
          </p>
          <div className="relative mx-auto mt-10 max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={21} aria-hidden="true" />
            <label htmlFor="tool-search" className="sr-only">Search online tools</label>
            <input
              id="tool-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search word counter, mortgage, JSON, BMI…"
              className="w-full rounded-2xl border border-white/10 bg-white/10 py-4 pl-14 pr-5 outline-none backdrop-blur focus:border-indigo-400"
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              aria-pressed={category === item}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${category === item ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'}`}
            >
              {item}
            </button>
          ))}
        </div>

        <p className="mb-6 text-sm text-slate-500">{filtered.length} of {allToolLinks.length} tools shown</p>

        {grouped.map(([groupName, tools], groupIndex) => (
          <section key={groupName} className="mb-12">
            <h2 className="text-2xl font-bold">{groupName}</h2>
            {CATEGORY_BLURB[groupName] && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{CATEGORY_BLURB[groupName]}</p>}
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((tool) => (
                <Link
                  key={tool.link}
                  to={tool.link}
                  className="group relative rounded-3xl border border-white/10 bg-white/[0.05] p-6 transition hover:-translate-y-1 hover:border-indigo-400/50 hover:bg-white/[0.08]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-cyan-400/10 text-lg font-black text-indigo-200">{tool.icon}</div>
                  <h3 className="mt-5 text-xl font-bold group-hover:text-indigo-300">{tool.shortTitle || tool.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{tool.description}</p>
                  <span className="mt-5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Open tool
                    <ArrowRight size={18} className="text-indigo-300 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
            {groupIndex === 0 && <AdSlot placement="listing" />}
          </section>
        ))}

        {!filtered.length && (
          <div className="rounded-3xl border border-dashed border-white/15 p-16 text-center text-slate-400">
            No tools match “{search}”. Try a broader term, or clear the category filter.
          </div>
        )}

        <div className="mt-6 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6 md:grid-cols-3">
          <div className="p-4">
            <ShieldCheck className="text-indigo-300" aria-hidden="true" />
            <h3 className="mt-3 font-bold">Private by design</h3>
            <p className="mt-1 text-sm text-slate-500">Calculations and text processing happen in your browser, not on a server.</p>
          </div>
          <div className="p-4">
            <Zap className="text-indigo-300" aria-hidden="true" />
            <h3 className="mt-3 font-bold">Instant results</h3>
            <p className="mt-1 text-sm text-slate-500">No uploads, no queues, no waiting for a job to finish.</p>
          </div>
          <div className="p-4">
            <Sparkles className="text-indigo-300" aria-hidden="true" />
            <h3 className="mt-3 font-bold">No sign-up</h3>
            <p className="mt-1 text-sm text-slate-500">Every tool is free and works without an account.</p>
          </div>
        </div>

        <section className="mt-14 max-w-4xl">
          <h2 className="text-2xl font-bold">Useful tools without downloads or sign-ups</h2>
          <p className="mt-4 leading-7 text-slate-400">
            {SITE_NAME} collects the small utilities people search for constantly — a percentage, a loan repayment, a word count, a JSON document that will not parse — and puts them in one place with a consistent interface.
            Each tool opens instantly, works on a phone, and explains the method behind the result rather than just printing a number.
          </p>
          <p className="mt-4 leading-7 text-slate-400">
            Nothing you type is transmitted. The calculators and converters run as JavaScript inside your own browser, which means a pasted JSON payload, a document you are counting, or a password you are testing all stay on your device.
          </p>

          <h2 className="mt-10 text-2xl font-bold">Frequently asked questions</h2>
          <div className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 px-5">
            {PAGE_FAQS.map((item) => (
              <details key={item.q} className="py-4">
                <summary className="cursor-pointer font-semibold text-white">{item.q}</summary>
                <p className="mt-3 leading-7 text-slate-400">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
