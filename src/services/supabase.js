import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
export const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

export const supabase = createClient(
  SUPABASE_URL || 'https://configuration-required.invalid',
  SUPABASE_PUBLISHABLE_KEY || 'configuration-required',
  {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  },
);

export const requireSupabaseConfig = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
  }
};

export default supabase;
