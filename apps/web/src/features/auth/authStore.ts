import { create } from 'zustand';
import type { Profile, UserPreferences, NexusUser } from '@nexus/types';
import type { LoginInput, RegisterInput, UpdateProfileInput } from '@nexus/validation';
import { authService, profileService } from '@/lib/services';
import { isSupabaseConfigured } from '@/lib/supabase';

interface AuthState {
  user: NexusUser | null;
  profile: Profile | null;
  preferences: UserPreferences | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  usePreviewData: boolean;
  error: string | null;

  // Actions
  initialize: () => Promise<void>;
  login: (input: LoginInput) => Promise<{ success: boolean; error?: string }>;
  register: (input: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: UpdateProfileInput) => Promise<{ success: boolean; error?: string }>;
  togglePreviewData: () => void;
  enterDemoMode: () => void;
  clearError: () => void;
}

const DEMO_USER: NexusUser = {
  id: 'demo-user-cassius',
  email: 'cassius@nexus.os',
};

const DEMO_PROFILE: Profile = {
  id: 'demo-user-cassius',
  full_name: 'Cassius Vance',
  avatar_url: null,
  timezone: 'America/New_York',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  preferences: null,
  isLoading: true,
  isAuthenticated: false,
  isDemoMode: !isSupabaseConfigured,
  usePreviewData: true, // Default to true so user sees the reference UI aesthetic immediately
  error: null,

  initialize: async () => {
    set({ isLoading: true, error: null });

    if (!isSupabaseConfigured) {
      // In unconfigured development environment, initialize as demo user
      set({
        user: DEMO_USER,
        profile: DEMO_PROFILE,
        isAuthenticated: true,
        isDemoMode: true,
        isLoading: false,
      });
      return;
    }

    try {
      const { session } = await authService.getSession();
      if (session?.user) {
        const { profile } = await profileService.getProfile(session.user.id);
        const { preferences } = await profileService.getPreferences(session.user.id);

        set({
          user: {
            id: session.user.id,
            email: session.user.email || '',
            profile,
            preferences,
          },
          profile,
          preferences,
          isAuthenticated: true,
          isDemoMode: false,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          profile: null,
          preferences: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }

      // Listen for auth state changes
      authService.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { profile } = await profileService.getProfile(session.user.id);
          const { preferences } = await profileService.getPreferences(session.user.id);
          set({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              profile,
              preferences,
            },
            profile,
            preferences,
            isAuthenticated: true,
            isLoading: false,
          });
        } else if (!get().isDemoMode) {
          set({
            user: null,
            profile: null,
            preferences: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      });
    } catch (err: unknown) {
      console.error('Failed to initialize auth:', err);
      set({
        isLoading: false,
        error: (err as Error).message || 'Failed to authenticate',
      });
    }
  },

  login: async (input: LoginInput) => {
    set({ isLoading: true, error: null });
    try {
      if (!isSupabaseConfigured) {
        // Local preview login
        set({
          user: { id: 'demo-user', email: input.email },
          profile: {
            id: 'demo-user',
            full_name: 'Cassius Vance',
            avatar_url: null,
            timezone: 'UTC',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          isAuthenticated: true,
          isDemoMode: true,
          isLoading: false,
        });
        return { success: true };
      }

      const { user, error } = await authService.signIn(input);
      if (error || !user) {
        set({ isLoading: false, error: error?.message || 'Invalid credentials' });
        return { success: false, error: error?.message || 'Invalid credentials' };
      }

      const { profile } = await profileService.getProfile(user.id);
      const { preferences } = await profileService.getPreferences(user.id);

      set({
        user: { id: user.id, email: user.email || '', profile, preferences },
        profile,
        preferences,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } catch (err: unknown) {
      const msg = (err as Error).message || 'Login failed';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  register: async (input: RegisterInput) => {
    set({ isLoading: true, error: null });
    try {
      if (!isSupabaseConfigured) {
        // Local preview registration
        const demoUser: NexusUser = { id: 'demo-registered-user', email: input.email };
        const demoProfile: Profile = {
          id: demoUser.id,
          full_name: input.fullName,
          avatar_url: null,
          timezone: input.timezone || 'UTC',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set({
          user: demoUser,
          profile: demoProfile,
          isAuthenticated: true,
          isDemoMode: true,
          isLoading: false,
        });
        return { success: true };
      }

      const { user, error } = await authService.signUp(input);
      if (error || !user) {
        set({ isLoading: false, error: error?.message || 'Registration failed' });
        return { success: false, error: error?.message || 'Registration failed' };
      }

      const { profile } = await profileService.getProfile(user.id);

      set({
        user: { id: user.id, email: user.email || '', profile },
        profile,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } catch (err: unknown) {
      const msg = (err as Error).message || 'Registration failed';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  logout: async () => {
    set({ isLoading: true });
    if (isSupabaseConfigured) {
      await authService.signOut();
    }
    set({
      user: null,
      profile: null,
      preferences: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  updateProfile: async (updates: UpdateProfileInput) => {
    const { user, profile } = get();
    if (!user) return { success: false, error: 'Not authenticated' };

    if (!isSupabaseConfigured) {
      const updatedProfile: Profile = {
        ...(profile || DEMO_PROFILE),
        full_name: updates.full_name ?? profile?.full_name ?? 'Cassius',
        timezone: updates.timezone ?? profile?.timezone ?? 'UTC',
        updated_at: new Date().toISOString(),
      };
      set({ profile: updatedProfile });
      return { success: true };
    }

    const { profile: updated, error } = await profileService.updateProfile(user.id, updates);
    if (error || !updated) {
      return { success: false, error: error?.message || 'Update failed' };
    }

    set({ profile: updated });
    return { success: true };
  },

  togglePreviewData: () => {
    set((state) => ({ usePreviewData: !state.usePreviewData }));
  },

  enterDemoMode: () => {
    set({
      user: DEMO_USER,
      profile: DEMO_PROFILE,
      isAuthenticated: true,
      isDemoMode: true,
      isLoading: false,
    });
  },

  clearError: () => set({ error: null }),
}));

