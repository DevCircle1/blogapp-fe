import { useEffect, useState } from 'react';
import { TAX_YEARS, TAX_VERIFIED_ON } from '../../data/pkTaxYears.js';
import { supabase, isSupabaseConfigured } from '../../services/supabase.js';

let remotePromise = null;

/** Rows of Supabase `tax_years` (country = Pakistan) mapped to the bundled shape; null if unavailable. */
function fetchRemote() {
  if (!isSupabaseConfigured) return Promise.resolve(null);
  remotePromise ??= supabase.from('tax_years').select('*').eq('country', 'Pakistan')
    .then(({ data, error }) => {
      if (error || !data?.length) return null;
      const seed = new Map(TAX_YEARS.map((year) => [year.slug, year]));
      return data.map((row) => {
        const slug = String(row.id).replace(/^pk-/, '');
        const base = seed.get(slug);
        return {
          id: row.id,
          slug,
          country: row.country,
          taxYearName: row.rules?.taxYearName || base?.taxYearName || row.label,
          label: row.label,
          effectiveFrom: row.effective_from,
          effectiveTo: row.effective_to,
          isCurrent: Boolean(row.is_current),
          sourceName: row.rules?.sourceName || base?.sourceName || 'Federal Board of Revenue',
          sourceUrl: row.source_url,
          verifiedOn: row.verified_on,
          slabs: row.slabs,
          rules: { surcharge: row.rules?.surcharge ?? null, notes: row.rules?.notes || '' },
        };
      });
    }, () => null);
  return remotePromise;
}

/** Bundled tax years first (matches the static HTML), then Supabase's when they arrive. */
export function useTaxYears() {
  const [years, setYears] = useState(TAX_YEARS);
  useEffect(() => {
    let live = true;
    fetchRemote().then((remote) => { if (live && remote) setYears(remote); });
    return () => { live = false; };
  }, []);
  return years;
}

export { TAX_VERIFIED_ON };
