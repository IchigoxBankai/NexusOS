import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import type { CommandCenterData, Profile, UserPreferences, UserPreferencesConfig } from '@nexus/types';
import type { UpdateProfileInput } from '@nexus/validation';
import type { NexusProfileService } from './profile.service';
import type { NexusDashboardService } from './dashboard.service';
import { nexusQueryKeys } from './keys';

export interface UseCommandCenterOptions {
  userId?: string;
  usePreviewSample?: boolean;
  userFullName?: string;
}

/**
 * Reusable TanStack Query hook for fetching Command Center data.
 * Shared across Web and React Native Mobile applications.
 */
export function useCommandCenterQuery(
  dashboardService: NexusDashboardService,
  options?: UseCommandCenterOptions
): UseQueryResult<CommandCenterData, Error> {
  const { userId, usePreviewSample = false, userFullName } = options || {};

  return useQuery({
    queryKey: [...nexusQueryKeys.dashboard.commandCenter(userId), usePreviewSample, userFullName],
    queryFn: async () => {
      return dashboardService.getCommandCenterData({
        userId,
        usePreviewSample,
        userFullName,
      });
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Reusable hook to fetch a user's profile with automatic caching.
 */
export function useProfileQuery(
  profileService: NexusProfileService,
  userId?: string
): UseQueryResult<Profile | null, Error> {
  return useQuery({
    queryKey: nexusQueryKeys.profile.detail(userId),
    queryFn: async () => {
      if (!userId) return null;
      const { profile, error } = await profileService.getProfile(userId);
      if (error) throw new Error(error.message);
      return profile;
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Reusable hook to fetch user preferences with automatic caching.
 */
export function usePreferencesQuery(
  profileService: NexusProfileService,
  userId?: string
): UseQueryResult<UserPreferences | null, Error> {
  return useQuery({
    queryKey: nexusQueryKeys.profile.preferences(userId),
    queryFn: async () => {
      if (!userId) return null;
      const { preferences, error } = await profileService.getPreferences(userId);
      if (error) throw new Error(error.message);
      return preferences;
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Mutation hook to update a user's profile and synchronize query cache.
 */
export function useUpdateProfileMutation(
  profileService: NexusProfileService,
  userId?: string
): UseMutationResult<Profile, Error, UpdateProfileInput> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: UpdateProfileInput) => {
      if (!userId) throw new Error('User ID is required to update profile.');
      const { profile, error } = await profileService.updateProfile(userId, updates);
      if (error || !profile) throw new Error(error?.message || 'Failed to update profile.');
      return profile;
    },
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(nexusQueryKeys.profile.detail(userId), updatedProfile);
      queryClient.invalidateQueries({ queryKey: nexusQueryKeys.dashboard.all });
    },
  });
}

/**
 * Mutation hook to update a user's preferences and synchronize query cache.
 */
export function useUpdatePreferencesMutation(
  profileService: NexusProfileService,
  userId?: string
): UseMutationResult<UserPreferences, Error, Partial<UserPreferencesConfig>> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<UserPreferencesConfig>) => {
      if (!userId) throw new Error('User ID is required to update preferences.');
      const { preferences, error } = await profileService.updatePreferences(userId, updates);
      if (error || !preferences) throw new Error(error?.message || 'Failed to update preferences.');
      return preferences;
    },
    onSuccess: (updatedPreferences) => {
      queryClient.setQueryData(nexusQueryKeys.profile.preferences(userId), updatedPreferences);
    },
  });
}

