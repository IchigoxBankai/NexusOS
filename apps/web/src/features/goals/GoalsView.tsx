import { useState } from 'react';
import {
  Target,
  Plus,
  TrendingUp,
  Award,
  CheckCircle2,
  Calendar,
  Clock,
  Trash2,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { useToastStore } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import type { GoalItem } from '@nexus/types';

const INITIAL_GOALS: GoalItem[] = [
  {
    id: 'g1',
    user_id: 'u1',
    title: 'Launch NEXUS Operating System v1.0',
    category: 'Career',
    current_progress: 82,
    target_progress: 100,
    unit: '%',
    target_date: '2026-06-30',
    status: 'active',
    created_at: '2026-01-15',
    updated_at: '2026-05-07',
  },
  {
    id: 'g2',
    user_id: 'u1',
    title: 'Reach $150k Liquid Emergency & Investment Fund',
    category: 'Wealth',
    current_progress: 118000,
    target_progress: 150000,
    unit: '$',
    target_date: '2026-12-31',
    status: 'active',
    created_at: '2026-01-01',
    updated_at: '2026-05-01',
  },
  {
    id: 'g3',
    user_id: 'u1',
    title: 'Run First Sub-4-Hour Marathon',
    category: 'Health',
    current_progress: 32,
    target_progress: 42,
    unit: 'km long run',
    target_date: '2026-09-15',
    status: 'active',
    created_at: '2026-02-10',
    updated_at: '2026-05-04',
  },
  {
    id: 'g4',
    user_id: 'u1',
    title: 'Read 24 Technical & Strategic Philosophy Books',
    category: 'Intellect',
    current_progress: 11,
    target_progress: 24,
    unit: 'books',
    target_date: '2026-12-31',
    status: 'active',
    created_at: '2026-01-01',
    updated_at: '2026-05-05',
  },
  {
    id: 'g5',
    user_id: 'u1',
    title: 'Host 12 Intentional Community & Family Dinners',
    category: 'Relationships',
    current_progress: 6,
    target_progress: 12,
    unit: 'gatherings',
    target_date: '2026-12-31',
    status: 'active',
    created_at: '2026-01-01',
    updated_at: '2026-04-28',
  },
];

type CategoryFilter = 'All' | 'Career' | 'Health' | 'Wealth' | 'Intellect' | 'Relationships';

const CATEGORY_COLORS: Record<GoalItem['category'], { badge: string; bar: string }> = {
  Career: { badge: 'bg-indigo-50 text-indigo-700 border-indigo-200', bar: 'from-indigo-500 to-indigo-600' },
  Health: { badge: 'bg-emerald-50 text-emerald-700 border-emerald-200', bar: 'from-emerald-500 to-emerald-600' },
  Wealth: { badge: 'bg-amber-50 text-amber-700 border-amber-200', bar: 'from-amber-500 to-amber-600' },
  Intellect: { badge: 'bg-purple-50 text-purple-700 border-purple-200', bar: 'from-purple-500 to-purple-600' },
  Relationships: { badge: 'bg-rose-50 text-rose-700 border-rose-200', bar: 'from-rose-500 to-rose-600' },
};

export function GoalsView() {
  const [goals, setGoals] = useState<GoalItem[]>(INITIAL_GOALS);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const { addToast } = useToastStore();

  // New Goal Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<GoalItem['category']>('Career');
  const [newCurrent, setNewCurrent] = useState('0');
  const [newTarget, setNewTarget] = useState('100');
  const [newUnit, setNewUnit] = useState('%');
  const [newDate, setNewDate] = useState('2026-12-31');

  const filteredGoals = goals.filter(
    (g) => selectedCategory === 'All' || g.category === selectedCategory
  );

  const totalGoals = goals.length;
  const achievedGoals = goals.filter((g) => g.status === 'achieved').length;
  const avgProgress = Math.round(
    goals.reduce((acc, g) => acc + Math.min(100, (g.current_progress / g.target_progress) * 100), 0) /
      (totalGoals || 1)
  );

  const handleUpdateProgress = (goalId: string, delta: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const nextVal = Math.max(0, g.current_progress + delta);
        const isAchieved = nextVal >= g.target_progress;
        if (isAchieved && g.status !== 'achieved') {
          addToast('Goal Milestone Achieved! 🎉', 'success');
        }
        return {
          ...g,
          current_progress: nextVal,
          status: isAchieved ? 'achieved' : 'active',
          updated_at: new Date().toISOString(),
        };
      })
    );
  };

  const handleToggleStatus = (goalId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const nextStatus = g.status === 'active' ? 'paused' : 'active';
        addToast(`Goal status updated to ${nextStatus}`, 'info');
        return { ...g, status: nextStatus };
      })
    );
  };

  const handleDeleteGoal = (goalId: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== goalId));
    addToast('Goal removed from horizons', 'info');
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const goal: GoalItem = {
      id: `g_${Date.now()}`,
      user_id: 'u1',
      title: newTitle.trim(),
      category: newCategory,
      current_progress: parseFloat(newCurrent) || 0,
      target_progress: parseFloat(newTarget) || 100,
      unit: newUnit.trim() || '%',
      target_date: newDate,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setGoals((prev) => [goal, ...prev]);
    setIsCreateOpen(false);
    setNewTitle('');
    setNewCurrent('0');
    setNewTarget('100');
    setNewUnit('%');
    addToast('Strategic Goal added to your Life Horizons', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-sm">
              <Target className="w-6 h-6" />
            </span>
            Goals & Strategic Horizons
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track multi-horizon objectives, milestone progress, and long-term personal OKRs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-sm flex items-center gap-2 px-5 py-2.5 text-sm"
          >
            <Plus className="w-4 h-4" />
            New Goal
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 backdrop-blur-xl bg-white/80 border-slate-200/80 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Active Horizons</span>
            <Target className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalGoals}</span>
            <span className="text-xs text-slate-500">strategic objectives</span>
          </div>
        </Card>

        <Card className="p-5 backdrop-blur-xl bg-white/80 border-slate-200/80 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Mean Velocity</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{avgProgress}%</span>
            <span className="text-xs text-emerald-600 font-medium">on track</span>
          </div>
        </Card>

        <Card className="p-5 backdrop-blur-xl bg-white/80 border-slate-200/80 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Achieved</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{achievedGoals}</span>
            <span className="text-xs text-slate-500">milestones unlocked</span>
          </div>
        </Card>

        <Card className="p-5 backdrop-blur-xl bg-white/80 border-slate-200/80 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">AI Alignment</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">Optimal</span>
            <span className="text-xs text-purple-600 font-medium">calibrated</span>
          </div>
        </Card>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {(['All', 'Career', 'Health', 'Wealth', 'Intellect', 'Relationships'] as CategoryFilter[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              'px-4 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap',
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white/80 hover:bg-white text-slate-600 border border-slate-200/70'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGoals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.current_progress / goal.target_progress) * 100));
          const catStyle = CATEGORY_COLORS[goal.category];

          return (
            <Card
              key={goal.id}
              className="p-6 backdrop-blur-xl bg-white/80 border-slate-200/80 shadow-sm rounded-3xl hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Top Row */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={cn('px-2.5 py-0.5 rounded-full text-[11px] font-semibold border', catStyle.badge)}>
                        {goal.category}
                      </span>
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider',
                          goal.status === 'achieved'
                            ? 'bg-emerald-50 text-emerald-700'
                            : goal.status === 'paused'
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-blue-50 text-blue-700'
                        )}
                      >
                        {goal.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 leading-snug mt-2">{goal.title}</h3>
                  </div>

                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete Goal"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress Visualizer */}
                <div className="space-y-2 my-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">
                      {goal.unit === '$' ? `$${goal.current_progress.toLocaleString()}` : `${goal.current_progress} ${goal.unit}`}
                    </span>
                    <span className="text-slate-400">
                      of {goal.unit === '$' ? `$${goal.target_progress.toLocaleString()}` : `${goal.target_progress} ${goal.unit}`}
                    </span>
                  </div>

                  {/* Meter Track */}
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                    <div
                      className={cn('h-full rounded-full transition-all duration-500 bg-gradient-to-r', catStyle.bar)}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-medium text-slate-700">{percent}% completed</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Target: {goal.target_date}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Controls */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleUpdateProgress(goal.id, goal.unit === '$' ? 5000 : 1)}
                    className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    +{goal.unit === '$' ? '$5k' : '1'}
                  </button>
                  <button
                    onClick={() => handleUpdateProgress(goal.id, goal.unit === '$' ? 15000 : 5)}
                    className="px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                  >
                    +{goal.unit === '$' ? '$15k' : '5'}
                  </button>
                  <button
                    onClick={() => handleUpdateProgress(goal.id, goal.unit === '$' ? -5000 : -1)}
                    className="px-2 py-1 text-xs font-medium rounded-full bg-slate-50 hover:bg-slate-100 text-slate-400 transition-colors"
                  >
                    -1
                  </button>
                </div>

                <button
                  onClick={() => handleToggleStatus(goal.id)}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60 transition-colors"
                >
                  {goal.status === 'active' ? 'Pause' : 'Resume'}
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* New Goal Modal Dialog */}
      <Dialog isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Strategic Goal">
        <form onSubmit={handleCreateGoal} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Goal Title</label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. Master Rust for High-Throughput Engines"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Horizon Category</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as GoalItem['category'])}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="Career">Career</option>
                <option value="Health">Health</option>
                <option value="Wealth">Wealth</option>
                <option value="Intellect">Intellect</option>
                <option value="Relationships">Relationships</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Unit of Measurement</label>
              <Input
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                placeholder="%, $, books, km"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Current Progress</label>
              <Input
                type="number"
                value={newCurrent}
                onChange={(e) => setNewCurrent(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Target Value</label>
              <Input
                type="number"
                value={newTarget}
                onChange={(e) => setNewTarget(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Target Date</label>
            <Input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="ghost" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-slate-900 text-white rounded-xl">
              Save Goal
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

