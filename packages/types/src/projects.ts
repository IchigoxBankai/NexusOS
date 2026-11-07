export type ProjectStatus = 'planning' | 'active' | 'paused' | 'completed';

export interface ProjectMilestone {
  id: string;
  project_id: string;
  user_id: string;
  title: string;
  is_completed: boolean;
  due_date: string | null;
  order_index: number;
  created_at: string;
}

export interface NexusProject {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  category: string;
  status: ProjectStatus;
  color: string;
  target_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProjectWithStats extends NexusProject {
  total_tasks: number;
  completed_tasks: number;
  progress_percent: number;
  milestones?: ProjectMilestone[];
}

export interface CreateProjectPayload {
  name: string;
  description?: string | null;
  category?: string;
  status?: ProjectStatus;
  color?: string;
  target_date?: string | null;
  milestones?: { title: string; due_date?: string | null }[];
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string | null;
  category?: string;
  status?: ProjectStatus;
  color?: string;
  target_date?: string | null;
}

