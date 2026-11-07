import { z } from 'zod';

export const quickTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  dueDate: z.string().optional(),
});

export type QuickTaskInput = z.infer<typeof quickTaskSchema>;

