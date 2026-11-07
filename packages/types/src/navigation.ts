export type NexusModuleKey =
  | 'command_center'
  | 'tasks'
  | 'projects'
  | 'calendar'
  | 'notes'
  | 'habits'
  | 'goals'
  | 'finance'
  | 'assistant'
  | 'insights'
  | 'settings'
  | 'profile';

export interface NexusNavigationItem {
  key: NexusModuleKey;
  label: string;
  path: string;
  iconName: string;
  badge?: string | number;
  isPlanned?: boolean; // true if intentional placeholder in Stage 1
  description?: string;
}

export interface NavigationSection {
  title?: string;
  items: NexusNavigationItem[];
}
