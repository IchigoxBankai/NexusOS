import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@nexus/types';

export interface SupabaseClientConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  storage?: {
    getItem: (key: string) => Promise<string | null> | string | null;
    setItem: (key: string, value: string) => Promise<void> | void;
    removeItem: (key: string) => Promise<void> | void;
  };
  persistSession?: boolean;
  autoRefreshToken?: boolean;
}

export type NexusSupabaseClient = SupabaseClient<Database>;

export function createNexusClient(config: SupabaseClientConfig): NexusSupabaseClient {
  const {
    supabaseUrl,
    supabaseAnonKey,
    storage,
    persistSession = true,
    autoRefreshToken = true,
  } = config;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
      '[NEXUS] Supabase URL or Anon Key is missing. Ensure your environment variables are configured.'
    );
  }

  return createClient<Database>(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder-key', {
    auth: {
      storage,
      persistSession,
      autoRefreshToken,
      detectSessionInUrl: typeof window !== 'undefined' && typeof window.location !== 'undefined',
    },
  });
}

