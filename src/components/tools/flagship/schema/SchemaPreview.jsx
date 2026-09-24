import { Star } from 'lucide-react';

/**
 * Illustrative SERP-style renderings of what the markup could produce. They are
 * approximations: Google decides whether and how to show a rich result, and the
 * panel says so.
 */
const host = (value) => { try { return new URL(value).hostname; } catch { return 'example.com'; } };
const Stars = ({ value = 0 }) => (
  <span className="inline-flex items-center gap-0.5 text-amber-300" aria-label={`${value} out of 5`}>
    {Array.from({ length: 5 }, (_, i) => <Star key={i} size={12} fill={i < Math.round(value) ? 'currentColor' : 'none'} />)}
  </span>
);
const asArray = (x) => (Array.isArray(x) ? x : x ? [x] : []);
const money = (offer) => (offer && offer.price !== undefined ? `${offer.priceCurrency ? `${offer.priceCurrency} ` : ''}${offer.price}` : '');

function Frame({ site, title, children, url }) {
  return (
    <div className="rounded-xl bg-white p-4 text-left text-slate-800">
      <div className="text-xs text-slate-500">{site}{url && <span className="text-slate-400"> › {url}</span>}</div>
      <div className="mt-0.5 text-lg leading-snug text-blue-700">{title || 'Your page title'}</div>
      {children}
    </div>
  );
}

export default function SchemaPreview({ kind, json, status }) {
  if (!json || kind === 'none') {
    return <p className="text-sm text-slate-400">Google no longer shows a rich result for this type, so there is no preview to show.</p>;
  }
  const site = host(json.url || json.mainEntityOfPage?.['@id'] || json.offers?.url || json.hiringOrganization?.sameAs || json.contentUrl || '');
  let body = null;
  if (kind === 'faq') {
    const questions = asArray(json.mainEntity);
    body = (
      <Frame site={site} title="Frequently asked questions">
        <div className="mt-2 divide-y divide-slate-200 text-sm">
          {questions.slice(0, 3).map((q) => <div key={q.name} className="py-1.5 text-slate-700">{q.name}<span className="float-right text-slate-400">⌄</span></div>)}
        </div>
      </Frame>
    );
  } else if (kind === 'product') {
    const offer = asArray(json.offers)[0];
    body = (
      <Frame site={site} title={json.name}>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          {json.aggregateRating && <><Stars value={json.aggregateRating.ratingValue} /><span>{json.aggregateRating.ratingValue} ({json.aggregateRating.reviewCount})</span></>}
          {offer && <span>· {money(offer)}</span>}
          {offer?.availability && <span>· {String(offer.availability).replace('https://schema.org/', '').replace(/([a-z])([A-Z])/g, '$1 $2')}</span>}
        </div>
        {json.description && <p className="mt-1 line-clamp-2 text-sm text-slate-600">{json.description}</p>}
      </Frame>
    );
  } else if (kind === 'recipe') {
    body = (
      <Frame site={site} title={json.name}>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
          {json.aggregateRating && <><Stars value={json.aggregateRating.ratingValue} /><span>{json.aggregateRating.ratingValue} ({json.aggregateRating.ratingCount})</span></>}
          {json.totalTime || json.cookTime ? <span>· {(json.totalTime || json.cookTime).replace('PT', '').replace('H', ' h ').replace('M', ' min')}</span> : null}
          {json.nutrition?.calories && <span>· {json.nutrition.calories}</span>}
        </div>
        {json.recipeIngredient && <p className="mt-1 line-clamp-2 text-sm text-slate-600">Ingredients: {json.recipeIngredient.slice(0, 5).join(', ')}…</p>}
      </Frame>
    );
  } else if (kind === 'event') {
    const place = Array.isArray(json.location) ? json.location[0] : json.location;
    body = (
      <div className="rounded-xl bg-white p-4 text-left text-slate-800">
        <div className="flex gap-4">
          <div className="w-16 shrink-0 rounded-lg bg-blue-50 p-2 text-center text-blue-700"><div className="text-xs uppercase">{json.startDate ? new Date(json.startDate).toLocaleString('en-US', { month: 'short' }) : '—'}</div><div className="text-2xl font-bold">{json.startDate ? new Date(json.startDate).getDate() : '—'}</div></div>
          <div className="min-w-0"><div className="text-lg leading-snug text-blue-700">{json.name}</div><div className="text-sm text-slate-600">{place?.name || place?.url || 'Online'}{place?.address?.addressLocality ? `, ${place.address.addressLocality}` : ''}</div>{json.offers?.price !== undefined && <div className="text-xs text-slate-500">From {money(json.offers)}</div>}</div>
        </div>
      </div>
    );
  } else if (kind === 'job') {
    body = (
      <div className="rounded-xl bg-white p-4 text-left text-slate-800">
        <div className="text-lg font-semibold text-slate-900">{json.title}</div>
        <div className="text-sm text-slate-600">{json.hiringOrganization?.name}{json.jobLocation?.address?.addressLocality ? ` · ${json.jobLocation.address.addressLocality}` : json.jobLocationType ? ' · Remote' : ''}</div>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
          {json.employmentType && <span className="rounded bg-slate-100 px-2 py-0.5">{String(json.employmentType).replace('_', ' ').toLowerCase()}</span>}
          {json.baseSalary && <span className="rounded bg-slate-100 px-2 py-0.5">{json.baseSalary.currency} {json.baseSalary.value.minValue ?? json.baseSalary.value.value}{json.baseSalary.value.maxValue ? `–${json.baseSalary.value.maxValue}` : ''} / {String(json.baseSalary.value.unitText || '').toLowerCase()}</span>}
        </div>
      </div>
    );
  } else if (kind === 'video') {
    body = (
      <div className="rounded-xl bg-white p-4 text-left text-slate-800">
        <div className="flex gap-3">
          <div className="relative h-20 w-36 shrink-0 rounded-md bg-slate-300"><span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 text-[10px] text-white">{json.duration ? json.duration.replace('PT', '').replace('M', ':').replace('S', '') : ''}</span></div>
          <div className="min-w-0"><div className="text-base leading-snug text-blue-700">{json.name}</div><div className="text-xs text-slate-500">{site}{json.uploadDate ? ` · ${json.uploadDate.slice(0, 10)}` : ''}</div>{json.publication && <span className="mt-1 inline-block rounded bg-red-600 px-1.5 text-[10px] font-bold text-white">LIVE</span>}</div>
        </div>
        {json.hasPart && <div className="mt-2 text-xs text-slate-600">Key moments: {json.hasPart.map((c) => c.name).join(' · ')}</div>}
      </div>
    );
  } else if (kind === 'breadcrumb') {
    const names = asArray(json.itemListElement).map((entry) => entry.name);
    const first = asArray(json.itemListElement)[0]?.item;
    body = <Frame site={host(first || '')} url={names.join(' › ')} title="Your page title" />;
  } else if (kind === 'article') {
    body = (
      <Frame site={site} title={json.headline}>
        <div className="mt-1 text-xs text-slate-500">{json.datePublished ? json.datePublished.slice(0, 10) : ''}{asArray(json.author)[0]?.name ? ` · ${asArray(json.author)[0].name}` : ''}</div>
        {json.description && <p className="mt-1 line-clamp-2 text-sm text-slate-600">{json.description}</p>}
      </Frame>
    );
  } else if (kind === 'local') {
    body = (
      <div className="rounded-xl bg-white p-4 text-left text-slate-800">
        <div className="text-lg font-semibold">{json.name}</div>
        <div className="text-sm text-slate-600">{json['@type'].replace(/([a-z])([A-Z])/g, '$1 $2')}{json.priceRange ? ` · ${json.priceRange}` : ''}</div>
        <div className="mt-2 text-sm text-slate-700">{[json.address?.streetAddress, json.address?.addressLocality].filter(Boolean).join(', ')}</div>
        {json.telephone && <div className="text-sm text-blue-700">{json.telephone}</div>}
        {json.openingHoursSpecification && <div className="mt-1 text-xs text-slate-500">Hours: {asArray(json.openingHoursSpecification).slice(0, 3).map((h) => `${String(h.dayOfWeek).slice(0, 3)} ${h.opens}–${h.closes}`).join(' · ')}</div>}
      </div>
    );
  } else if (kind === 'organization') {
    body = (
      <div className="rounded-xl bg-white p-4 text-left text-slate-800">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-slate-200 text-xs text-slate-500">logo</div>
          <div><div className="text-lg font-semibold">{json.name}</div><div className="text-sm text-slate-600">{host(json.url || '')}</div></div>
        </div>
        {json.description && <p className="mt-2 line-clamp-2 text-sm text-slate-600">{json.description}</p>}
        {json.sameAs && <div className="mt-1 text-xs text-blue-700">{asArray(json.sameAs).slice(0, 3).map(host).join(' · ')}</div>}
      </div>
    );
  }
  return (
    <div>
      {body}
      <p className="mt-2 text-xs leading-5 text-slate-500">
        An illustration of the kind of result this markup could produce — not a guarantee. Google decides whether to show a rich result at all{status && status.richResult !== 'eligible' ? ', and for this type it is restricted or no longer shown' : ''}.
      </p>
    </div>
  );
}
