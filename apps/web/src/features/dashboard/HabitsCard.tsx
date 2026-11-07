import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Flame, Check } from 'lucide-react';
import type { HabitSummary } from '@nexus/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToastStore } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

interface HabitsCardProps {
  habits: HabitSummary[];
}

export function HabitsCard({ habits: initialHabits }: HabitsCardProps) {
  const [habits, setHabits] = useState<HabitSummary[]>(initialHabits);
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const toggleHabit = (id: string, title: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const nextCompleted = !h.isCompletedToday;
          addToast({
            type: nextCompleted ? 'success' : 'info',
            title: nextCompleted ? 'Habit Checked In!' : 'Habit Unchecked',
            message: nextCompleted
              ? `Great job completing "${title}" today! Streak: ${h.streakCount + 1} days.`
              : `Habit "${title}" reverted for today.`,
          });
          return {
            ...h,
            isCompletedToday: nextCompleted,
            streakCount: nextCompleted ? h.streakCount + 1 : Math.max(0, h.streakCount - 1),
          };
        }
        return h;
      })
    );
  };

  return (
    <Card variant="glass" className="rounded-3xl">
      <CardHeader className="p-6 pb-4">
        <div>
          <CardTitle className="text-lg font-medium text-slate-900">Habits & Routines</CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            Consistency & daily execution
          </CardDescription>
        </div>

        <button
          onClick={() => navigate('/habits')}
          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-slate-200/60 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {habits.length === 0 ? (
          <EmptyState
            icon={<Flame className="w-5 h-5 text-amber-500" />}
            title="No active habits tracked"
            description="Build routines and track daily streaks across health, focus, and reading."
            actionLabel="Setup Habits"
            onAction={() => navigate('/habits')}
            className="py-8"
          />
        ) : (
          <div className="space-y-2.5">
            {habits.map((h) => (
              <div
                key={h.id}
                className="bg-white/95 rounded-2xl p-3 border border-slate-100 shadow-[0_2px_8px_-2px_rgba(90,105,143,0.06)] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleHabit(h.id, h.title)}
                    className={cn(
                      'w-6 h-6 rounded-lg flex items-center justify-center transition-all',
                      h.isCompletedToday
                        ? 'bg-emerald-500 text-white shadow-xs'
                        : 'border border-slate-300 hover:border-slate-400 bg-white'
                    )}
                  >
                    {h.isCompletedToday && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <div>
                    <h4
                      className={cn(
                        'text-xs font-semibold transition-all',
                        h.isCompletedToday ? 'text-slate-400 line-through' : 'text-slate-800'
                      )}
                    >
                      {h.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Goal: {h.targetPerWeek}x per week
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50/70 px-2.5 py-1 rounded-full shrink-0">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{h.streakCount}d</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
