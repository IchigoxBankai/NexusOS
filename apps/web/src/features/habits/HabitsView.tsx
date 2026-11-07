import { useState } from 'react';
import {
  Repeat,
  Plus,
  Flame,
  Check,
  Calendar,
  Sparkles,
  Trash2,
  Award,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { useToastStore } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import type { HabitItem } from '@nexus/types';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const INITIAL_HABITS: HabitItem[] = [
  {
    id: 'h1',
    user_id: 'u1',
    title: 'Morning Deep Work Block (90m)',
    description: 'No messaging, notifications silenced, strategic architecture & code.',
    target_per_week: 5,
    current_streak: 14,
    best_streak: 28,
    completion_history: {
      Mon: true,
      Tue: true,
      Wed: true,
      Thu: true,
      Fri: true,
      Sat: false,
      Sun: false,
    },
    created_at: '',
    updated_at: '',
  },
  {
    id: 'h2',
    user_id: 'u1',
    title: 'Aerobic Exercise or Run (45m)',
    description: 'Cardio endurance and recovery mobility.',
    target_per_week: 4,
    current_streak: 6,
    best_streak: 12,
    completion_history: {
      Mon: true,
      Tue: false,
      Wed: true,
      Thu: true,
      Fri: false,
      Sat: true,
      Sun: false,
    },
    created_at: '',
    updated_at: '',
  },
  {
    id: 'h3',
    user_id: 'u1',
    title: 'Read 20 Pages Non-Fiction',
    description: 'System design, leadership, philosophy, or biography.',
    target_per_week: 7,
    current_streak: 22,
    best_streak: 35,
    completion_history: {
      Mon: true,
      Tue: true,
      Wed: true,
      Thu: true,
      Fri: true,
      Sat: true,
      Sun: true,
    },
    created_at: '',
    updated_at: '',
  },
  {
    id: 'h4',
    user_id: 'u1',
    title: 'Evening Digital Sunset (30m screen-free)',
    description: 'Disconnect before bed to optimize sleep architecture.',
    target_per_week: 6,
    current_streak: 8,
    best_streak: 15,
    completion_history: {
      Mon: true,
      Tue: true,
      Wed: false,
      Thu: true,
      Fri: true,
      Sat: false,
      Sun: true,
    },
    created_at: '',
    updated_at: '',
  },
];

export function HabitsView() {
  const [habits, setHabits] = useState<HabitItem[]>(INITIAL_HABITS);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTarget, setNewTarget] = useState(5);

  const { addToast } = useToastStore();

  const handleToggleDay = (habitId: string, day: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const currentVal = Boolean(h.completion_history[day]);
        const updatedHistory = { ...h.completion_history, [day]: !currentVal };
        const nextStreak = !currentVal ? h.current_streak + 1 : Math.max(0, h.current_streak - 1);

        addToast({
          type: !currentVal ? 'success' : 'info',
          title: !currentVal ? 'Habit Checked!' : 'Habit Reverted',
          message: `${h.title} recorded for ${day}.`,
        });

        return {
          ...h,
          current_streak: nextStreak,
          completion_history: updatedHistory,
        };
      })
    );
  };

  const handleCreateHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newHabit: HabitItem = {
      id: `h-${Date.now()}`,
      user_id: 'current-user',
      title: newTitle.trim(),
      description: newDesc.trim() || 'Daily behavioral routine.',
      target_per_week: newTarget,
      current_streak: 0,
      best_streak: 0,
      completion_history: {
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
        Sun: false,
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setHabits((prev) => [...prev, newHabit]);
    setIsCreateOpen(false);
    setNewTitle('');
    setNewDesc('');
    addToast({
      type: 'success',
      title: 'Habit Initialized',
      message: `"${newHabit.title}" was added to your routines.`,
    });
  };

  const handleDeleteHabit = (id: string, title: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
    addToast({
      type: 'info',
      title: 'Habit Archived',
      message: `"${title}" has been removed.`,
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Habits & Routines</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              {habits.length} active routines
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Build unshakeable consistency through habit chaining, streak resilience, and tracking.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          New Habit
        </Button>
      </div>

      {/* Consistency Banner */}
      <Card variant="glass" className="p-5 rounded-3xl bg-gradient-to-r from-amber-50/50 via-purple-50/40 to-white/90 border-amber-100/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Flame className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Longest Active Streak: 22 Consecutive Days
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                86% weekly completion rate across all 4 monitored habit chains.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-amber-800 bg-white/90 px-3 py-1 rounded-full border border-amber-200 shadow-xs">
              Weekly Target: 22/24 Check-ins
            </span>
          </div>
        </div>
      </Card>

      {/* Habits List */}
      <div className="space-y-4">
        {habits.map((habit) => {
          const completedDaysCount = Object.values(habit.completion_history).filter(Boolean).length;
          const targetMet = completedDaysCount >= habit.target_per_week;

          return (
            <Card
              key={habit.id}
              variant="glass"
              className="p-5 sm:p-6 rounded-3xl hover:border-slate-200 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Habit Title, Description & Streak */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-10 h-10 rounded-2xl bg-slate-100/80 flex items-center justify-center shrink-0">
                    <Repeat className="w-5 h-5 text-slate-600" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-sm font-bold text-slate-900">{habit.title}</h3>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-100">
                        <Flame className="w-3 h-3 fill-amber-500" />
                        {habit.current_streak} days streak
                      </span>
                    </div>

                    {habit.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{habit.description}</p>
                    )}

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span>Goal: {habit.target_per_week} days/week</span>
                      <span>• Best streak: {habit.best_streak}d</span>
                      {targetMet && (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Target Met this week
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 7-Day Weekly Check-In Interactive Buttons */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/80 border border-slate-100 shadow-xs">
                    {DAYS_OF_WEEK.map((day) => {
                      const isDone = Boolean(habit.completion_history[day]);

                      return (
                        <button
                          key={day}
                          onClick={() => handleToggleDay(habit.id, day)}
                          className={cn(
                            'w-8 h-9 rounded-xl flex flex-col items-center justify-center transition-all text-[10px] font-medium',
                            isDone
                              ? 'bg-emerald-500 text-white shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-200/60'
                          )}
                          title={`${day}: ${isDone ? 'Completed' : 'Pending'}`}
                        >
                          <span className="text-[9px] leading-none mb-0.5 font-bold uppercase">
                            {day[0]}
                          </span>
                          {isDone ? (
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handleDeleteHabit(habit.id, habit.title)}
                    className="p-2 text-slate-300 hover:text-rose-600 rounded-xl transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete habit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Habit Dialog */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Initialize New Habit"
        description="Establish a positive behavioral routine and set weekly target frequency."
      >
        <form onSubmit={handleCreateHabit} className="space-y-4 pt-2">
          <Input
            label="Habit Name"
            placeholder="e.g. 10 Minutes Meditation"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />

          <Input
            label="Why this matters (Description)"
            placeholder="e.g. Mental clarity and stress down-regulation"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
              Target Frequency (Days Per Week)
            </label>
            <div className="flex items-center gap-2">
              {[3, 4, 5, 6, 7].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setNewTarget(num)}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-xs font-bold transition-all',
                    newTarget === num
                      ? 'bg-slate-900 text-white'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  )}
                >
                  {num}x
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Routine
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

