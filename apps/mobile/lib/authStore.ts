import { create } from 'zustand';
import type { Profile, NexusUser, UserPreferences } from '@nexus/types';
import type { LoginInput, RegisterInput } from '@nexus/validation';
import { authService, profileService } from './services';
import { isSupabaseConfigured } from './supabase.native';

interface MobileAuthState {
  user: NexusUser | null;
  profile: Profile | null;
  preferences: UserPreferences | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  usePreviewData: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  login: (input: LoginInput) => Promise<{ success: boolean; error?: string }>;
  register: (input: RegisterInput) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  togglePreviewData: () => void;
  enterDemoMode: () => void;
}

const DEMO_USER: NexusUser = {
  id: 'demo-cassius-mobile',
  email: 'cassius@nexus.os',
};

const DEMO_PROFILE: Profile = {
  id: 'demo-cassius-mobile',
  full_name: 'Cassius Vance',
  avatar_url: null,
  timezone: 'America/New_York',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const useMobileAuthStore = create<MobileAuthState>((set, get) => ({
  user: null,
  profile: null,
  preferences: null,
  isLoading: true,
  isAuthenticated: false,
  isDemoMode: !isSupabaseConfigured,
  usePreviewData: true,
  error: null,

  initialize: async () => {
    set({ isLoading: true });

    if (!isSupabaseConfigured) {
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
        set({
          user: { id: session.user.id, email: session.user.email || '', profile },
          profile,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({ isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ isAuthenticated: false, isLoading: false });
    }
  },

  login: async (input: LoginInput) => {
    set({ isLoading: true, error: null });

    if (!isSupabaseConfigured) {
      set({
        user: DEMO_USER,
        profile: DEMO_PROFILE,
        isAuthenticated: true,
        isDemoMode: true,
        isLoading: false,
      });
      return { success: true };
    }

    const { user, error } = await authService.signIn(input);
    if (error || !user) {
      set({ isLoading: false, error: error?.message || 'Login failed' });
      return { success: false, error: error?.message || 'Login failed' };
    }

    const { profile } = await profileService.getProfile(user.id);
    set({
      user: { id: user.id, email: user.email || '', profile },
      profile,
      isAuthenticated: true,
      isLoading: false,
    });
    return { success: true };
  },

  register: async (input: RegisterInput) => {
    set({ isLoading: true, error: null });

    if (!isSupabaseConfigured) {
      set({
        user: DEMO_USER,
        profile: { ...DEMO_PROFILE, full_name: input.fullName },
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
  },

  logout: async () => {
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

  togglePreviewData: () => set((state) => ({ usePreviewData: !state.usePreviewData })),

  enterDemoMode: () => {
    set({
      user: DEMO_USER,
      profile: DEMO_PROFILE,
      isAuthenticated: true,
      isDemoMode: true,
      isLoading: false,
    });
  },
}));
