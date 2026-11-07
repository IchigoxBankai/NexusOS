export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferencesConfig {
  theme?: 'system' | 'light' | 'aurora' | 'dark';
  sidebar_collapsed?: boolean;
  command_center_layout?: {
    show_actions?: boolean;
    show_for_you?: boolean;
    show_projects?: boolean;
    show_events?: boolean;
    show_habits?: boolean;
    show_goals?: boolean;
  };
  notifications?: {
    email?: boolean;
    in_app?: boolean;
    daily_digest?: boolean;
  };
  default_view?: string;
  timezone?: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  preferences: UserPreferencesConfig;
  created_at: string;
  updated_at: string;
}

