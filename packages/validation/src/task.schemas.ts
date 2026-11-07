import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200, 'Title must not exceed 200 characters'),
  description: z.string().max(1000).nullable().optional(),
  project_id: z.string().uuid().nullable().optional(),
  status: z.enum(['todo', 'in_progress', 'completed', 'deferred']).default('todo'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  due_date: z.string().nullable().optional(),
  source_app: z.string().default('Personal'),
  tags: z.array(z.string()).default([]),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const updateTaskSchema = createTaskSchema.partial();
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

