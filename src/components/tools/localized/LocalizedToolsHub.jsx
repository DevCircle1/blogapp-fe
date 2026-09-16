import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Globe, Search, Sparkles } from 'lucide-react';
import Seo from '../../common/Seo.jsx';
import AdSlot from '../../common/AdSlot.jsx';
import { premiumTools } from '../toolCatalog.js';
import { toolHubSchemas } from '../../../seo/toolSchema.js';
import { interpolate } from '../../../i18n/i18n.js';
import { useLocaleBundle } from '../../../i18n/loadBundle.js';
import {
  ALL_LANGS, LOCALES, hubAlternates, hubPath, toolPath,
} from '../../../i18n/locales.js';

/** Search ignores accents, so "calculo" finds "cálculo" and "grosse" finds "Größe". */
const fold = (value) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Directory of every tool in one language — the /es, /pt, /fr and /de
 * equivalents of /tools. It is the hub each language's tool pages link back
 * to, which is what lets crawlers find all of them from a single entry point.
 */
export default function LocalizedToolsHub({ lang }) {
  const bundle = useLocaleBundle(lang);
  const { hub, chrome, categories, tools } = bundle.content;
  const [search, setSearch] = useState('');
  const locale = LOCALES[lang];
  const path = hubPath(lang);

  const items = useMemo(() => premiumTools.filter((tool) => tools[tool.slug]).map((tool) => ({
    slug: tool.slug,
    icon: tool.icon,
    category: tool.category,
    title: tools[tool.slug].shortTitle,
    description: tools[tool.slug].description,
    path: toolPath(lang, tool.slug),
    haystack: fold(`${tools[tool.slug].title} ${tools[tool.slug].shortTitle} ${tools[tool.slug].description}`),
  })), [lang, tools]);

  const grouped = useMemo(() => {
    const term = fold(search.trim());
    const map = new Map();
    items.filter((item) => !term || item.haystack.includes(term)).forEach((item) => {
      if (!map.has(item.category)) map.set(item.category, []);
      map.get(item.category).push(item);
    });
    const label = (category) => categories[category]?.name || category;
    return [...map.entries()].sort((a, b) => label(a[0]).localeCompare(label(b[0]), locale.intl));
  }, [items, search, categories, locale.intl]);

  const shownCount = grouped.reduce((total, [, list]) => total + list.length, 0);

  const schemas = toolHubSchemas({
    name: hub.title,
    path,
    description: hub.description,
    lang: locale.htmlLang,
    items: items.map((item) => ({ name: item.title, path: item.path })),
    faqs: hub.faqs,
    breadcrumb: [{ name: chrome.home, path: '/' }, { name: chrome.tools, path }],
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Seo title={hub.title} description={hub.description} path={path} lang={lang} schemas={schemas} alternates={hubAlternates()} />

      <section className="relative overflow-hidden border-b border-white/10 px-4 py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,.25),transparent_38%),radial-gradient(circle_at_top_right,rgba(16,185,129,.14),transparent_32%)]" />
        <div className="relative mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-200">
            <Sparkles size={16} /> {interpolate(hub.badge, { n: items.length })}
          </div>
          <h1 className="mt-6 text-4xl font-black tracking-tight md:text-6xl">{hub.heading}</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">{hub.body}</p>
          <div className="relative mx-auto mt-10 max-w-2xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={21} aria-hidden="true" />
            <label htmlFor="tool-search" className="sr-only">{hub.searchLabel}</label>
            <input
              id="tool-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={hub.searchPlaceholder}
              className="w-full rounded-2xl border border-white/10 bg-white/10 py-4 pl-14 pr-5 outline-none backdrop-blur focus:border-indigo-400"
            />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-12">
        <p className="mb-6 text-sm text-slate-500">{interpolate(hub.shown, { shown: shownCount, total: items.length })}</p>

        {grouped.map(([category, list], groupIndex) => (
          <section key={category} className="mb-12">
            <h2 className="text-2xl font-bold">{categories[category]?.name || category}</h2>
            {categories[category]?.blurb && <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">{categories[category].blurb}</p>}
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((item) => (
                <Link
                  key={item.slug}
                  to={item.path}
                  className="group relative rounded-3xl border border-white/10 bg-white/[0.05] p-6 transition hover:-translate-y-1 hover:border-indigo-400/50 hover:bg-white/[0.08]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/30 to-cyan-400/10 text-lg font-black text-indigo-200">{item.icon}</div>
                  <h3 className="mt-5 text-xl font-bold group-hover:text-indigo-300">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{item.description}</p>
                  <span className="mt-5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {chrome.openTool}
                    <ArrowRight size={18} className="text-indigo-300 transition group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
            {groupIndex === 0 && <AdSlot placement="listing" />}
          </section>
        ))}

        {!shownCount && (
          <div className="rounded-3xl border border-dashed border-white/15 p-16 text-center text-slate-400">
            {interpolate(hub.empty, { q: search })}
          </div>
        )}

        <section className="mt-14 max-w-4xl">
          {hub.paragraphs.map(([heading, text]) => (
            <div key={heading}>
              <h2 className="mt-10 text-2xl font-bold first:mt-0">{heading}</h2>
              <p className="mt-4 leading-7 text-slate-400">{text}</p>
            </div>
          ))}

          <h2 className="mt-10 text-2xl font-bold">{chrome.faq}</h2>
          <div className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 px-5">
            {hub.faqs.map((item) => (
              <details key={item.q} className="py-4">
                <summary className="cursor-pointer font-semibold text-white">{item.q}</summary>
                <p className="mt-3 leading-7 text-slate-400">{item.a}</p>
              </details>
            ))}
          </div>

          <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
            <Globe size={14} aria-hidden="true" />
            <span>{chrome.alsoAvailable}</span>
            {ALL_LANGS.filter((other) => other !== lang).map((other) => (
              <Link key={other} to={hubPath(other)} hrefLang={LOCALES[other].hreflang} lang={LOCALES[other].htmlLang} className="font-semibold text-indigo-300 hover:text-white">
                {LOCALES[other].name}
              </Link>
            ))}
          </p>
        </section>
      </main>
    </div>
  );
}
