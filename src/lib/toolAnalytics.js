import { supabase, isSupabaseConfigured } from '../services/supabase.js';

/**
 * Fire-and-forget usage counters for the browser-only tools.
 *
 * `meta` must only ever hold counts and enums (row count, a bank slug) — never
 * file contents, prompt text or anything the visitor typed. Failures are
 * swallowed: a missing table or an offline visitor must never break a tool.
 */
export function trackToolEvent(toolSlug, event, meta = {}) {
  if (!isSupabaseConfigured) return;
  try {
    supabase.from('tool_usage').insert({ tool_slug: toolSlug, event, meta }).then(() => {}, () => {});
  } catch { /* analytics is best-effort */ }
}

/** Insert one row into an opt-in table (bank_requests, parse_failures, feedback…). */
export async function submitRow(table, row) {
  if (!isSupabaseConfigured) return { ok: false, reason: 'not-configured' };
  try {
    const { error } = await supabase.from(table).insert(row);
    return error ? { ok: false, reason: error.message } : { ok: true };
  } catch (error) {
    return { ok: false, reason: String(error?.message || error) };
  }
}
