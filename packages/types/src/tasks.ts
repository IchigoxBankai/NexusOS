export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'deferred';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NexusTask {
  id: string;
  user_id: string;
  project_id?: string | null;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string | null;
  source_app?: string;
  tags?: string[];
  order_index?: number;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  project_name?: string;
  project_color?: string;
}

export type TaskItem = NexusTask;

export interface CreateTaskPayload {
  title: string;
  description?: string | null;
  project_id?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  source_app?: string;
  tags?: string[];
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string | null;
  project_id?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  source_app?: string;
  tags?: string[];
  order_index?: number;
}

export interface TaskFilterOptions {
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  projectId?: string | 'all';
  searchQuery?: string;
  sourceApp?: string | 'all';
}

