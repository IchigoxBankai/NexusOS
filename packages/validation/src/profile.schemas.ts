import { z } from 'zod';

export const updateProfileSchema = z.object({
  full_name: z
    .string()
    .min(1, 'Full name cannot be empty')
    .max(100, 'Name must not exceed 100 characters')
    .optional(),
  avatar_url: z.string().nullable().optional(),
  timezone: z.string().min(1, 'Timezone is required').optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const userPreferencesSchema = z.object({
  theme: z.enum(['system', 'light', 'aurora', 'dark']).optional(),
  sidebar_collapsed: z.boolean().optional(),
  command_center_layout: z
    .object({
      show_actions: z.boolean().optional(),
      show_for_you: z.boolean().optional(),
      show_projects: z.boolean().optional(),
      show_events: z.boolean().optional(),
      show_habits: z.boolean().optional(),
      show_goals: z.boolean().optional(),
    })
    .optional(),
  notifications: z
    .object({
      email: z.boolean().optional(),
      in_app: z.boolean().optional(),
      daily_digest: z.boolean().optional(),
    })
    .optional(),
  default_view: z.string().optional(),
  timezone: z.string().optional(),
});

export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;

