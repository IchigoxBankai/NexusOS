export interface DailyFocusMetric {
  date: string;
  focusMinutes: number;
  meetingMinutes: number;
  tasksCompleted: number;
}

export interface ProductivityInsightsData {
  deepWorkHoursThisWeek: number;
  deepWorkGoalHours: number;
  meetingLoadHours: number;
  burnoutRiskLevel: 'low' | 'moderate' | 'elevated';
  taskVelocityPercentChange: number;
  dailyMetrics: DailyFocusMetric[];
  topProductiveHour: string;
  executiveSummary: string;
}

