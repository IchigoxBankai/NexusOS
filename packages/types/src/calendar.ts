export interface CalendarEvent {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  start_time: string;
  end_time: string;
  location?: string | null;
  is_virtual: boolean;
  meeting_url?: string | null;
  category: 'Work' | 'Personal' | 'Focus' | 'Social' | 'Health';
  color: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCalendarEventPayload {
  title: string;
  description?: string | null;
  start_time: string;
  end_time: string;
  location?: string | null;
  is_virtual?: boolean;
  meeting_url?: string | null;
  category?: 'Work' | 'Personal' | 'Focus' | 'Social' | 'Health';
  color?: string;
}

