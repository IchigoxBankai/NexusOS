import type { NexusSupabaseClient } from './client';

export interface SupabaseHealthCheckResult {
  isConfigured: boolean;
  authHealthy: boolean;
  profilesTableHealthy: boolean;
  preferencesTableHealthy: boolean;
  latencyMs?: number;
  message: string;
}

export async function checkSupabaseHealth(
  client: NexusSupabaseClient,
  configured: boolean
): Promise<SupabaseHealthCheckResult> {
  const startTime = Date.now();

  if (!configured) {
    return {
      isConfigured: false,
      authHealthy: false,
      profilesTableHealthy: false,
      preferencesTableHealthy: false,
      message: 'Supabase credentials not yet provided in .env.local. Running in Development Preview Mode.',
    };
  }

  try {
    // 1. Check Auth service ping
    const { error: authError } = await client.auth.getSession();
    const authHealthy = !authError;

    // 2. Check profiles table access
    const { error: profilesError } = await client
      .from('profiles')
      .select('id')
      .limit(1);
    const profilesTableHealthy = !profilesError || profilesError.code === 'PGRST116';

    // 3. Check user_preferences table access
    const { error: prefError } = await client
      .from('user_preferences')
      .select('id')
      .limit(1);
    const preferencesTableHealthy = !prefError || prefError.code === 'PGRST116';

    const latencyMs = Date.now() - startTime;

    return {
      isConfigured: true,
      authHealthy,
      profilesTableHealthy,
      preferencesTableHealthy,
      latencyMs,
      message:
        authHealthy && profilesTableHealthy && preferencesTableHealthy
          ? `Supabase is connected and healthy (${latencyMs}ms response).`
          : 'Connected to Supabase, but some tables or policies may need migration execution.',
    };
  } catch (err) {
    return {
      isConfigured: true,
      authHealthy: false,
      profilesTableHealthy: false,
      preferencesTableHealthy: false,
      latencyMs: Date.now() - startTime,
      message: `Failed to ping Supabase: ${(err as Error).message}`,
    };
  }
}
