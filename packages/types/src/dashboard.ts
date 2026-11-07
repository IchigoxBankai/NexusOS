export type ActionStatus = 'pending' | 'in_progress' | 'completed' | 'deferred';

export type ActionPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface ActionItemAction {
  id: string;
  label: string;
  icon?: string;
  actionKey: 'complete' | 'message' | 'calendar' | 'assign_agent' | 'open' | 'custom';
}

export interface ActionItem {
  id: string;
  title: string;
  subtitle?: string;
  sourceApp?: string; // e.g. "Slack – Now Even Workspace", "Figma – Future of Finance"
  sourceIcon?: string;
  priority: ActionPriority;
  status: ActionStatus;
  dueTime?: string;
  url?: string;
  actions: ActionItemAction[];
  assignedAgent?: string;
}

export type ForYouCategory = 'Recent' | 'Apps' | 'News' | 'Health' | 'Finance' | 'Events';

export interface ForYouItem {
  id: string;
  category: ForYouCategory;
  title: string;
  subtitle?: string;
  sourceApp?: string; // e.g. "Nike", "Chrome", "Notion"
  icon?: string;
  status?: string; // e.g. "2 Items in Cart – £109.95"
  progress?: number; // 0 - 100
  url?: string;
  actions?: {
    id: string;
    label: string;
    variant?: 'default' | 'outline' | 'danger';
    actionKey: string;
  }[];
  timestamp: string;
}

export interface ActiveProjectSummary {
  id: string;
  name: string;
  category: string;
  progressPercent: number;
  totalTasks: number;
  completedTasks: number;
  color: string;
  dueDate?: string;
}

export interface UpcomingEventSummary {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  isVirtual?: boolean;
  meetingUrl?: string;
  participantsCount?: number;
}

export interface HabitSummary {
  id: string;
  title: string;
  streakCount: number;
  isCompletedToday: boolean;
  targetPerWeek: number;
}

export interface GoalSummary {
  id: string;
  title: string;
  category: string;
  currentProgress: number;
  targetProgress: number;
  unit: string;
  targetDate: string;
}

export interface CommandCenterData {
  greeting: string;
  userDisplayName: string;
  formattedDate: string;
  actions: ActionItem[];
  forYouItems: ForYouItem[];
  activeProjects: ActiveProjectSummary[];
  upcomingEvents: UpcomingEventSummary[];
  habits: HabitSummary[];
  goals: GoalSummary[];
  stats: {
    pendingTasksCount: number;
    completedTodayCount: number;
    upcomingMeetingsCount: number;
    activeHabitsStreak: number;
  };
}

