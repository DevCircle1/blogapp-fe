import { Link } from 'react-router-dom';
import Seo from '../common/Seo.jsx';
import AdSlot from '../common/AdSlot.jsx';
import { SITE_URL, SITE_NAME, breadcrumbSchema, faqSchema } from '../../seo/siteMeta.js';

/**
 * Head tags + supporting content for the tool pages that live on their own
 * route rather than under /tools/<slug>. Keeps them at the same depth of
 * content and structured data as the catalogue tools, so they are not thin
 * pages sitting next to rich ones.
 */
export function StandaloneToolSeo({ title, description, path, category = 'Utilities', intro, steps, faqs }) {
  const canonical = `${SITE_URL}${path}`;
  return (
    <Seo
      title={title}
      description={description}
      path={path}
      schemas={[
        {
          '@context': 'https://schema.org',
          '@type': 'WebApplication',
          name: title,
          url: canonical,
          description,
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Any',
          browserRequirements: 'Requires JavaScript',
          isAccessibleForFree: true,
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
        },
        faqs?.length ? faqSchema(faqs) : null,
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Tools', path: '/tools' },
          { name: category, path },
        ]),
        steps?.length ? {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: `How to use the ${category}`,
          description: intro,
          step: steps.map((step, index) => ({ '@type': 'HowToStep', position: index + 1, text: step })),
        } : null,
      ]}
    />
  );
}

export function ToolContentSections({ heading, intro, extraParagraphs = [], steps = [], faqs = [], related = [], light = false }) {
  const base = light ? 'text-gray-600' : 'text-slate-400';
  const strong = light ? 'text-gray-900' : 'text-white';
  const border = light ? 'border-gray-200' : 'border-white/10';

  return (
    <section className={`mx-auto mt-14 max-w-4xl px-4 pb-12 ${light ? '' : 'text-white'}`}>
      <AdSlot placement="toolInline" />

      <h2 className={`text-2xl font-bold ${strong}`}>{heading}</h2>
      <p className={`mt-4 leading-7 ${base}`}>{intro}</p>
      {extraParagraphs.map((paragraph) => <p key={paragraph} className={`mt-4 leading-7 ${base}`}>{paragraph}</p>)}

      {steps.length > 0 && (
        <>
          <h2 className={`mt-10 text-2xl font-bold ${strong}`}>How to use it</h2>
          <ol className={`mt-4 list-decimal space-y-3 pl-5 leading-7 ${base}`}>
            {steps.map((step) => <li key={step}>{step}</li>)}
          </ol>
        </>
      )}

      {faqs.length > 0 && (
        <>
          <h2 className={`mt-10 text-2xl font-bold ${strong}`}>Frequently asked questions</h2>
          <div className={`mt-4 divide-y rounded-2xl border px-5 ${border} ${light ? 'divide-gray-200 bg-white' : 'divide-white/10'}`}>
            {faqs.map((item) => (
              <details key={item.q} className="py-4">
                <summary className={`cursor-pointer font-semibold ${strong}`}>{item.q}</summary>
                <p className={`mt-3 leading-7 ${base}`}>{item.a}</p>
              </details>
            ))}
          </div>
        </>
      )}

      {related.length > 0 && (
        <>
          <h2 className={`mt-10 text-2xl font-bold ${strong}`}>Related tools</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-xl border p-4 transition ${border} ${light ? 'bg-white hover:border-blue-400' : 'bg-white/5 hover:border-indigo-400/60'}`}
              >
                <strong className={strong}>{item.label}</strong>
                <span className={`mt-1 block text-sm leading-6 ${base}`}>{item.description}</span>
              </Link>
            ))}
          </div>
        </>
      )}

      <p className={`mt-8 text-sm ${base}`}>
        <Link to="/tools" className="font-semibold text-indigo-500 hover:underline">Browse all free tools →</Link>
      </p>
    </section>
  );
}
