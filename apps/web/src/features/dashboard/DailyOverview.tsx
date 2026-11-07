import { CheckCircle2, Clock, Calendar, Flame } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface DailyOverviewProps {
  stats: {
    pendingTasksCount: number;
    completedTodayCount: number;
    upcomingMeetingsCount: number;
    activeHabitsStreak: number;
  };
}

export function DailyOverview({ stats }: DailyOverviewProps) {
  const statItems = [
    {
      label: 'Pending Actions',
      value: stats.pendingTasksCount,
      icon: Clock,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50/70',
    },
    {
      label: 'Done Today',
      value: stats.completedTodayCount,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50/70',
    },
    {
      label: 'Upcoming Events',
      value: stats.upcomingMeetingsCount,
      icon: Calendar,
      color: 'text-blue-600',
      bg: 'bg-blue-50/70',
    },
    {
      label: 'Best Habit Streak',
      value: `${stats.activeHabitsStreak}d`,
      icon: Flame,
      color: 'text-amber-500',
      bg: 'bg-amber-50/70',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {statItems.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card
            key={idx}
            variant="glass"
            className="p-3.5 sm:p-4 rounded-2xl flex items-center justify-between"
          >
            <div>
              <p className="text-[11px] font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">{stat.value}</h3>
            </div>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <Icon className="w-4 h-4" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
