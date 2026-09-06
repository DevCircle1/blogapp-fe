import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://vclmwzhxkhrojubnptao.supabase.co';
export const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || 'missing-supabase-publishable-key';
export const isSupabaseConfigured = SUPABASE_PUBLISHABLE_KEY !== 'missing-supabase-publishable-key';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export const requireSupabaseConfig = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_PUBLISHABLE_KEY to your .env file.');
  }
};

export default supabase;
