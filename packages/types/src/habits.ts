export interface HabitItem {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  target_per_week: number;
  current_streak: number;
  best_streak: number;
  last_completed_date?: string | null;
  completion_history: Record<string, boolean>; // 'YYYY-MM-DD': true
  created_at: string;
  updated_at: string;
}

export interface CreateHabitPayload {
  title: string;
  description?: string | null;
  target_per_week?: number;
}

