import { Link } from 'react-router-dom';

/**
 * Bottom-of-page related-tools block, shared by every tool page in every
 * language. It only renders links it is given — the curation lives in
 * data/relatedTools.js, not here — so this component never needs to change
 * when a tool is added or its relations are retuned.
 */
export default function RelatedTools({ heading, items, browseAllLabel, browseAllPath }) {
  if (!items.length) return null;

  return (
    <>
      <h2 className="text-xl font-bold">{heading}</h2>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <Link key={item.path} to={item.path} className="block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-indigo-400/60 hover:bg-white/10">
            <strong className="text-white">{item.title}</strong>
            <span className="mt-1 block text-sm leading-6 text-slate-500">{item.description}</span>
          </Link>
        ))}
      </div>
      <Link to={browseAllPath} className="mt-5 inline-block text-sm font-semibold text-indigo-300 hover:text-white">{browseAllLabel}</Link>
    </>
  );
}
