import type { Profile, UserPreferences } from './profile';

export interface NexusUser {
  id: string;
  email: string;
  profile?: Profile | null;
  preferences?: UserPreferences | null;
  app_metadata?: Record<string, unknown>;
  user_metadata?: Record<string, unknown>;
  created_at?: string;
}

export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in?: number;
  token_type?: string;
  user: NexusUser;
}

export interface AuthState {
  user: NexusUser | null;
  session: AuthSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | string | null;
}

