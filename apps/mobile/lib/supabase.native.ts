import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNexusClient, type NexusSupabaseClient } from '@nexus/api';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project-ref.supabase.co'
);

export const supabase: NexusSupabaseClient = createNexusClient({
  supabaseUrl,
  supabaseAnonKey,
  storage: AsyncStorage,
  persistSession: true,
  autoRefreshToken: true,
});
