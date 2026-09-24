import { useEffect, useState } from 'react';
import { SCHEMA_TYPES } from './registry.js';
import { supabase, isSupabaseConfigured } from '../../services/supabase.js';

let remotePromise = null;

/** Rows of Supabase `schema_type_status` keyed by slug; null if unavailable. */
function fetchRemote() {
  if (!isSupabaseConfigured) return Promise.resolve(null);
  remotePromise ??= supabase.from('schema_type_status').select('*')
    .then(({ data, error }) => (error || !data?.length ? null : Object.fromEntries(data.map((row) => [row.slug, row]))), () => null);
  return remotePromise;
}

/**
 * Eligibility for a type: bundled at build time (so it is in the static HTML),
 * replaced by Supabase's row when it loads, which is how a Google change goes
 * live without a deploy.
 */
export function useSchemaStatus(type) {
  const [remote, setRemote] = useState(null);
  useEffect(() => {
    let live = true;
    fetchRemote().then((rows) => { if (live && rows) setRemote(rows); });
    return () => { live = false; };
  }, []);
  const row = remote?.[type.slug];
  if (!row) return type.status;
  return {
    richResult: row.rich_result_eligible ? 'eligible' : (type.status.richResult === 'eligible' ? 'limited' : type.status.richResult),
    googleNotes: row.google_notes || type.status.googleNotes,
    docsUrl: row.docs_url || type.status.docsUrl,
    verifiedOn: row.verified_on || type.status.verifiedOn,
  };
}

export { SCHEMA_TYPES };
