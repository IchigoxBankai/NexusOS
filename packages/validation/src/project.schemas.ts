import { z } from 'zod';

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name must not exceed 100 characters'),
  description: z.string().max(1000).nullable().optional(),
  category: z.string().min(1).default('General'),
  status: z.enum(['planning', 'active', 'paused', 'completed']).default('active'),
  color: z.string().regex(/^#([0-9A-Fa-f]{6})$/, 'Must be a valid hex color code').default('#6366F1'),
  target_date: z.string().nullable().optional(),
  milestones: z
    .array(
      z.object({
        title: z.string().min(1, 'Milestone title is required'),
        due_date: z.string().nullable().optional(),
      })
    )
    .optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = createProjectSchema.partial();
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

