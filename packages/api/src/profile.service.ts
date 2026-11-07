import type { Profile, UserPreferences, UserPreferencesConfig } from '@nexus/types';
import type { UpdateProfileInput } from '@nexus/validation';
import type { NexusSupabaseClient } from './client';
import { formatSupabaseError, NexusApiError } from './errors';

export class NexusProfileService {
  constructor(private client: NexusSupabaseClient) {}

  async getProfile(userId: string): Promise<{ profile: Profile | null; error: NexusApiError | null }> {
    try {
      const { data, error } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        return { profile: null, error: formatSupabaseError(error) };
      }

      return { profile: data as Profile | null, error: null };
    } catch (err) {
      return { profile: null, error: formatSupabaseError(err) };
    }
  }

  async updateProfile(
    userId: string,
    updates: UpdateProfileInput
  ): Promise<{ profile: Profile | null; error: NexusApiError | null }> {
    try {
      const { data, error } = await this.client
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { profile: null, error: formatSupabaseError(error) };
      }

      return { profile: data as Profile, error: null };
    } catch (err) {
      return { profile: null, error: formatSupabaseError(err) };
    }
  }

  async getPreferences(userId: string): Promise<{ preferences: UserPreferences | null; error: NexusApiError | null }> {
    try {
      const { data, error } = await this.client
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        return { preferences: null, error: formatSupabaseError(error) };
      }

      if (!data) {
        return { preferences: null, error: null };
      }

      return {
        preferences: {
          id: data.id,
          user_id: data.user_id,
          preferences: data.preferences as UserPreferencesConfig,
          created_at: data.created_at,
          updated_at: data.updated_at,
        },
        error: null,
      };
    } catch (err) {
      return { preferences: null, error: formatSupabaseError(err) };
    }
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<UserPreferencesConfig>
  ): Promise<{ preferences: UserPreferences | null; error: NexusApiError | null }> {
    try {
      // Upsert preferences for the user
      const { data: existing } = await this.client
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      const mergedPreferences = {
        ...((existing?.preferences as UserPreferencesConfig) || {}),
        ...preferences,
      };

      const { data, error } = await this.client
        .from('user_preferences')
        .upsert({
          user_id: userId,
          preferences: mergedPreferences,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) {
        return { preferences: null, error: formatSupabaseError(error) };
      }

      return {
        preferences: {
          id: data.id,
          user_id: data.user_id,
          preferences: data.preferences as UserPreferencesConfig,
          created_at: data.created_at,
          updated_at: data.updated_at,
        },
        error: null,
      };
    } catch (err) {
      return { preferences: null, error: formatSupabaseError(err) };
    }
  }
}
