import type { Session, User, AuthChangeEvent } from '@supabase/supabase-js';
import type { NexusSupabaseClient } from './client';
import type { LoginInput, RegisterInput } from '@nexus/validation';
import { formatSupabaseError, NexusApiError } from './errors';

export class NexusAuthService {
  constructor(private client: NexusSupabaseClient) {}

  async signIn(input: LoginInput): Promise<{ session: Session | null; user: User | null; error: NexusApiError | null }> {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });

      if (error) {
        return { session: null, user: null, error: formatSupabaseError(error) };
      }

      return { session: data.session, user: data.user, error: null };
    } catch (err) {
      return { session: null, user: null, error: formatSupabaseError(err) };
    }
  }

  async signUp(input: RegisterInput): Promise<{ session: Session | null; user: User | null; error: NexusApiError | null }> {
    try {
      const { data, error } = await this.client.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            full_name: input.fullName,
            timezone: input.timezone || 'UTC',
          },
        },
      });

      if (error) {
        return { session: null, user: null, error: formatSupabaseError(error) };
      }

      return { session: data.session, user: data.user, error: null };
    } catch (err) {
      return { session: null, user: null, error: formatSupabaseError(err) };
    }
  }

  async signOut(): Promise<{ error: NexusApiError | null }> {
    try {
      const { error } = await this.client.auth.signOut();
      if (error) {
        return { error: formatSupabaseError(error) };
      }
      return { error: null };
    } catch (err) {
      return { error: formatSupabaseError(err) };
    }
  }

  async resetPasswordForEmail(email: string, redirectTo?: string): Promise<{ error: NexusApiError | null }> {
    try {
      const { error } = await this.client.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) {
        return { error: formatSupabaseError(error) };
      }
      return { error: null };
    } catch (err) {
      return { error: formatSupabaseError(err) };
    }
  }

  async updatePassword(password: string): Promise<{ user: User | null; error: NexusApiError | null }> {
    try {
      const { data, error } = await this.client.auth.updateUser({
        password,
      });
      if (error) {
        return { user: null, error: formatSupabaseError(error) };
      }
      return { user: data.user, error: null };
    } catch (err) {
      return { user: null, error: formatSupabaseError(err) };
    }
  }

  async getSession(): Promise<{ session: Session | null; error: NexusApiError | null }> {
    try {
      const { data, error } = await this.client.auth.getSession();
      if (error) {
        return { session: null, error: formatSupabaseError(error) };
      }
      return { session: data.session, error: null };
    } catch (err) {
      return { session: null, error: formatSupabaseError(err) };
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data } = await this.client.auth.getUser();
      return data.user;
    } catch {
      return null;
    }
  }

  onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
    return this.client.auth.onAuthStateChange(callback);
  }
}
