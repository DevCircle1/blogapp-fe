import { Link } from 'react-router-dom';
import { Globe, ShieldCheck, Sparkles } from 'lucide-react';
import Seo from '../common/Seo.jsx';
import AdSlot from '../common/AdSlot.jsx';

/**
 * Layout for a catalogue tool page in any language. The English route and
 * the localized routes pass different copy, links, and structured data, but
 * share this markup so the language versions never drift apart structurally.
 */
export default function ToolPageView({ tool, Tool, seo, labels, related, languages = [] }) {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <Seo {...seo} />

      <div className="mx-auto max-w-6xl">
        <nav aria-label={labels.breadcrumb} className="mb-8 text-sm text-slate-400">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to="/" className="hover:text-white">{labels.home}</Link></li>
            <li aria-hidden="true">/</li>
            <li><Link to={labels.toolsPath} className="hover:text-white">{labels.tools}</Link></li>
            <li aria-hidden="true">/</li>
            <li className="text-slate-300" aria-current="page">{tool.shortTitle}</li>
          </ol>
        </nav>

        <header className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-xs font-semibold text-indigo-200">
            <Sparkles size={14} /> {labels.category}
          </div>
          <h1 className="text-3xl font-black tracking-tight md:text-5xl">{tool.title}</h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-400">{tool.description}</p>
          {languages.length > 0 && (
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-500">
              <Globe size={14} aria-hidden="true" />
              <span>{labels.alsoAvailable}</span>
              {languages.map((language) => (
                <Link key={language.lang} to={language.path} hrefLang={language.hreflang} lang={language.htmlLang} className="font-semibold text-indigo-300 hover:text-white">
                  {language.name}
                </Link>
              ))}
            </p>
          )}
        </header>

        <section aria-label={labels.toolRegion} className="rounded-3xl border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-indigo-950/50 md:p-8">
          <Tool />
        </section>

        <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
          <ShieldCheck size={14} /> {labels.privacy}
        </p>

        <AdSlot placement="toolInline" />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_.6fr]">
          <article className="max-w-none">
            <h2 className="text-2xl font-bold">{labels.about}</h2>
            <p className="mt-4 leading-7 text-slate-400">{tool.intro}</p>

            <h2 className="mt-10 text-2xl font-bold">{labels.howTo}</h2>
            <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-slate-400">
              {tool.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>

            {tool.formula && (
              <>
                <h2 className="mt-10 text-2xl font-bold">{labels.formula}</h2>
                <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-5 leading-7 text-slate-300">{tool.formula}</p>
              </>
            )}

            <h2 className="mt-10 text-2xl font-bold">{labels.faq}</h2>
            <div className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 px-5">
              {tool.faqs.map((item) => (
                <details key={item.q} className="py-4" open={item === tool.faqs[0]}>
                  <summary className="cursor-pointer font-semibold text-white">{item.q}</summary>
                  <p className="mt-3 leading-7 text-slate-400">{item.a}</p>
                </details>
              ))}
            </div>

            {tool.disclaimer && (
              <p className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm leading-6 text-amber-100">
                {tool.disclaimer}
              </p>
            )}
          </article>

          <aside>
            <h2 className="text-xl font-bold">{labels.related}</h2>
            <div className="mt-4 space-y-3">
              {related.map((item) => (
                <Link key={item.path} to={item.path} className="block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-indigo-400/60 hover:bg-white/10">
                  <strong className="text-white">{item.title}</strong>
                  <span className="mt-1 block text-sm leading-6 text-slate-500">{item.description}</span>
                </Link>
              ))}
            </div>
            <Link to={labels.toolsPath} className="mt-5 inline-block text-sm font-semibold text-indigo-300 hover:text-white">{labels.browseAll}</Link>
            <AdSlot placement="toolFooter" className="mt-8" />
          </aside>
        </div>
      </div>
    </div>
  );
}
