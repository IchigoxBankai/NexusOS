export interface GoalItem {
  id: string;
  user_id: string;
  title: string;
  category: 'Career' | 'Health' | 'Wealth' | 'Intellect' | 'Relationships';
  current_progress: number;
  target_progress: number;
  unit: string;
  target_date: string;
  status: 'active' | 'achieved' | 'paused';
  created_at: string;
  updated_at: string;
}

export interface CreateGoalPayload {
  title: string;
  category?: 'Career' | 'Health' | 'Wealth' | 'Intellect' | 'Relationships';
  current_progress?: number;
  target_progress?: number;
  unit?: string;
  target_date: string;
}

