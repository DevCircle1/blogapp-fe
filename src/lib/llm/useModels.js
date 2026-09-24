import { useEffect, useState } from 'react';
import { LLM_MODELS, PRICES_VERIFIED_ON } from '../../data/llmModels.js';
import { supabase, isSupabaseConfigured } from '../../services/supabase.js';

let remotePromise = null;

/** Rows from Supabase `llm_models`, mapped to the shape of the bundled list; null if unavailable. */
function fetchRemote() {
  if (!isSupabaseConfigured) return Promise.resolve(null);
  remotePromise ??= supabase.from('llm_models').select('*').eq('is_active', true)
    .then(({ data, error }) => {
      if (error || !data?.length) return null;
      const seed = new Map(LLM_MODELS.map((model) => [model.slug, model]));
      const newest = data.reduce((latest, row) => (row.updated_at > latest ? row.updated_at : latest), '');
      return {
        verifiedOn: newest ? newest.slice(0, 10) : PRICES_VERIFIED_ON,
        models: data.map((row) => ({
          slug: row.slug,
          provider: row.provider,
          name: row.display_name,
          tokenizer: 'o200k_base',
          exact: seed.get(row.slug)?.exact ?? false,
          input: Number(row.input_per_1m),
          output: Number(row.output_per_1m),
          cached: row.cached_input_per_1m == null ? null : Number(row.cached_input_per_1m),
          context: row.context_window ?? null,
          notes: row.notes || '',
          promo: seed.get(row.slug)?.promo,
        })),
      };
    }, () => null);
  return remotePromise;
}

/**
 * Bundled prices first (so server HTML and first paint agree), then whatever is
 * in Supabase once it arrives — which is how a price edit goes live without a deploy.
 */
export function useModels() {
  const [state, setState] = useState({ models: LLM_MODELS, verifiedOn: PRICES_VERIFIED_ON });
  useEffect(() => {
    let live = true;
    fetchRemote().then((remote) => { if (live && remote) setState(remote); });
    return () => { live = false; };
  }, []);
  return state;
}

export function usePriceHistory() {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (!isSupabaseConfigured) return undefined;
    let live = true;
    supabase.from('llm_price_history').select('slug,input_per_1m,output_per_1m,changed_at').order('changed_at', { ascending: true })
      .then(({ data }) => { if (live && data) setRows(data); }, () => {});
    return () => { live = false; };
  }, []);
  return rows;
}
