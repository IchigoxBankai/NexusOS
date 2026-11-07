import { createNexusClient, type NexusSupabaseClient } from '@nexus/api';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-ref.supabase.co'
);

export const supabase: NexusSupabaseClient = createNexusClient({
  supabaseUrl,
  supabaseAnonKey,
});
