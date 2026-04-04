import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Demo-modus: enten mangler Supabase-nøkler, eller brukeren logget inn med testknappen
export function isDemoMode() {
  return !supabase || localStorage.getItem('middag_demo_session') === 'true';
}
