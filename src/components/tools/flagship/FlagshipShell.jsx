import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles } from 'lucide-react';
import Seo from '../../common/Seo.jsx';
import AdSlot from '../../common/AdSlot.jsx';
import { flagshipBreadcrumb, flagshipSchemas } from './schemas.js';

/**
 * Page chrome shared by the flagship tools: head tags, breadcrumb, H1, the tool
 * itself directly under the heading, then the written explanation, FAQ and
 * internal links. The copy comes from a `page` object (see registry.js) so the
 * prerender step and this component can never disagree about it.
 *
 * The tool goes in `children`; it must be safe to render on the server (no
 * window/document access during render) — anything heavy loads on interaction.
 */
export default function FlagshipShell({ page, children, privacy, afterTool }) {
  const trail = flagshipBreadcrumb(page);
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <Seo
        title={page.title}
        description={page.description}
        path={page.path}
        schemas={flagshipSchemas(page)}
        suffix={false}
      />

      <div className="mx-auto max-w-6xl">
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-slate-400">
          <ol className="flex flex-wrap items-center gap-2">
            {trail.map((crumb, index) => (
              <li key={crumb.path} className="flex items-center gap-2">
                {index > 0 && <span aria-hidden="true">/</span>}
                {index === trail.length - 1
                  ? <span className="text-slate-300" aria-current="page">{crumb.name}</span>
                  : <Link to={crumb.path} className="hover:text-white">{crumb.name}</Link>}
              </li>
            ))}
          </ol>
        </nav>

        <header className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-400/10 px-3 py-1 text-xs font-semibold text-indigo-200">
            <Sparkles size={14} /> {page.category}
          </div>
          <h1 className="text-3xl font-black tracking-tight md:text-5xl">{page.h1}</h1>
          <p className="mt-3 max-w-3xl leading-7 text-slate-400">{page.lead}</p>
        </header>

        <section
          aria-label={`${page.appName || page.h1} tool`}
          data-tool-root={page.toolId}
          className="rounded-3xl border border-white/10 bg-white/[0.06] p-4 shadow-2xl shadow-indigo-950/50 md:p-8"
        >
          {children}
        </section>

        {privacy && (
          <p className="mt-6 flex items-center justify-center gap-2 text-center text-xs text-slate-500">
            <ShieldCheck size={14} /> {privacy}
          </p>
        )}

        {afterTool}

        <AdSlot placement="toolInline" />

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_.6fr]">
          <article className="min-w-0 max-w-none break-words">
            {page.sections.map((section, index) => (
              <div key={section.heading} className={index ? 'mt-10' : ''}>
                <h2 className="text-2xl font-bold">{section.heading}</h2>
                {(section.paragraphs || []).map((paragraph) => (
                  <p key={paragraph} className="mt-4 leading-7 text-slate-400">{paragraph}</p>
                ))}
                {section.list && (
                  <ul className="mt-4 list-disc space-y-2 pl-5 leading-7 text-slate-400">
                    {section.list.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                )}
                {section.table && (
                  <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10">
                    <table className="w-full min-w-[520px] border-collapse text-sm">
                      <thead>
                        <tr className="bg-white/5 text-left text-xs uppercase tracking-wider text-slate-400">
                          {section.table.headers.map((header) => <th key={header} scope="col" className="px-3 py-2.5">{header}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        {section.table.rows.map((row) => (
                          <tr key={row[0]} className="border-t border-white/5 align-top">
                            {row.map((cell, i) => (i === 0
                              ? <th key={i} scope="row" className="px-3 py-2 text-left font-semibold text-white">{cell}</th>
                              : <td key={i} className="px-3 py-2 text-slate-300">{cell}</td>))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                {section.code && (
                  <pre className="mt-4 max-h-96 overflow-auto rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-xs leading-5 text-slate-200"><code>{section.code}</code></pre>
                )}
                {section.after && (section.after || []).map((paragraph) => (
                  <p key={paragraph} className="mt-4 leading-7 text-slate-400">{paragraph}</p>
                ))}
              </div>
            ))}

            {page.steps?.length > 0 && (
              <>
                <h2 className="mt-10 text-2xl font-bold">How to use it</h2>
                <ol className="mt-4 list-decimal space-y-3 pl-5 leading-7 text-slate-400">
                  {page.steps.map((step) => <li key={step}>{step}</li>)}
                </ol>
              </>
            )}

            {page.faqs?.length > 0 && (
              <>
                <h2 className="mt-10 text-2xl font-bold">Frequently asked questions</h2>
                <div className="mt-4 divide-y divide-white/10 rounded-2xl border border-white/10 px-5">
                  {page.faqs.map((item, index) => (
                    <details key={item.q} className="py-4" open={index === 0}>
                      <summary className="cursor-pointer font-semibold text-white">{item.q}</summary>
                      <p className="mt-3 leading-7 text-slate-400">{item.a}</p>
                    </details>
                  ))}
                </div>
              </>
            )}

            {page.disclaimer && (
              <p className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/10 p-5 text-sm leading-6 text-amber-100">
                {page.disclaimer}
              </p>
            )}
          </article>

          <aside className="min-w-0">
            {page.siblings?.length > 0 && (
              <>
                <h2 className="text-xl font-bold">{page.siblingsHeading || 'More like this'}</h2>
                <ul className="mt-4 space-y-2">
                  {page.siblings.map((item) => (
                    <li key={item.to}>
                      <Link to={item.to} className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-indigo-200 transition hover:border-indigo-400/60 hover:text-white">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}

            <h2 className={`${page.siblings?.length ? 'mt-8 ' : ''}text-xl font-bold`}>Related tools</h2>
            <div className="mt-4 space-y-3">
              {page.related.map((item) => (
                <Link key={item.to} to={item.to} className="block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-indigo-400/60 hover:bg-white/10">
                  <strong className="text-white">{item.label}</strong>
                  <span className="mt-1 block text-sm leading-6 text-slate-500">{item.description}</span>
                </Link>
              ))}
            </div>
            <Link to="/tools" className="mt-5 inline-block text-sm font-semibold text-indigo-300 hover:text-white">Browse all tools →</Link>
            <AdSlot placement="toolFooter" className="mt-8" />
          </aside>
        </div>
      </div>
    </div>
  );
}
