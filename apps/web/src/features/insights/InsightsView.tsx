import { useState } from 'react';
import {
  BarChart2,
  TrendingUp,
  Clock,
  Zap,
  ShieldAlert,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  Copy,
  Brain,
  Activity,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import type { ProductivityInsightsData, DailyFocusMetric } from '@nexus/types';

const INITIAL_INSIGHTS: ProductivityInsightsData = {
  deepWorkHoursThisWeek: 26.5,
  deepWorkGoalHours: 32.0,
  meetingLoadHours: 6.5,
  burnoutRiskLevel: 'low',
  taskVelocityPercentChange: 24,
  topProductiveHour: '09:00 AM - 11:30 AM',
  executiveSummary: `Your cognitive bandwidth has been exceptionally protected this week. By shifting 3 status calls into asynchronous summaries, you gained 4.5 hours of uninterrupted flow state. Your highest output happens during morning slots between 09:00 and 11:30.`,
  dailyMetrics: [
    { date: 'Mon', focusMinutes: 340, meetingMinutes: 60, tasksCompleted: 6 },
    { date: 'Tue', focusMinutes: 380, meetingMinutes: 45, tasksCompleted: 8 },
    { date: 'Wed', focusMinutes: 290, meetingMinutes: 120, tasksCompleted: 5 },
    { date: 'Thu', focusMinutes: 360, meetingMinutes: 30, tasksCompleted: 9 },
    { date: 'Fri', focusMinutes: 220, meetingMinutes: 135, tasksCompleted: 4 },
    { date: 'Sat', focusMinutes: 180, meetingMinutes: 0, tasksCompleted: 3 },
    { date: 'Sun', focusMinutes: 120, meetingMinutes: 0, tasksCompleted: 2 },
  ],
};

export function InsightsView() {
  const [data, setData] = useState<ProductivityInsightsData>(INITIAL_INSIGHTS);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('week');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const { addToast } = useToastStore();

  const handleSynthesize = () => {
    setIsSynthesizing(true);
    setTimeout(() => {
      setData((prev) => ({
        ...prev,
        deepWorkHoursThisWeek: +(prev.deepWorkHoursThisWeek + 1.2).toFixed(1),
        executiveSummary: `Updated Telemetry Synthesis: Cognitive stamina remains in the 92nd percentile. Deep focus allocations for core architecture have exceeded weekly baselines. Recommendations: maintain Friday afternoon buffer to prevent weekend cognitive carryover.`,
      }));
      setIsSynthesizing(false);
      addToast('Productivity telemetry re-synthesized with AI Copilot', 'success');
    }, 800);
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(data.executiveSummary);
    addToast('Executive summary copied to clipboard', 'info');
  };

  const deepWorkPct = Math.min(100, Math.round((data.deepWorkHoursThisWeek / data.deepWorkGoalHours) * 100));

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-medium text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-sky-50 border border-sky-100 text-sky-600 shadow-sm">
              <BarChart2 className="w-6 h-6" />
            </span>
            Productivity & Cognitive Insights
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time biometric focus telemetry, cognitive load distribution, and schedule efficiency analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center p-1 bg-white/80 backdrop-blur-md rounded-full border border-slate-200/80 text-xs">
            <button
              onClick={() => setTimeframe('week')}
              className={cn(
                'px-3 py-1.5 rounded-full font-medium transition-all',
                timeframe === 'week' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeframe('month')}
              className={cn(
                'px-3 py-1.5 rounded-full font-medium transition-all',
                timeframe === 'month' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Past Month
            </button>
          </div>

          <Button
            onClick={handleSynthesize}
            disabled={isSynthesizing}
            className="rounded-full bg-slate-900 hover:bg-slate-800 text-white shadow-sm flex items-center gap-2 px-5 py-2.5 text-sm"
          >
            <Sparkles className={cn('w-4 h-4', isSynthesizing && 'animate-spin')} />
            {isSynthesizing ? 'Synthesizing...' : 'Re-synthesize AI'}
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Deep Focus Hours */}
        <Card className="p-5 backdrop-blur-xl bg-white/80 border-slate-200/80 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Deep Focus Time</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{data.deepWorkHoursThisWeek}h</span>
            <span className="text-xs text-slate-400">/ {data.deepWorkGoalHours}h goal</span>
          </div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${deepWorkPct}%` }} />
          </div>
        </Card>

        {/* Meeting Load */}
        <Card className="p-5 backdrop-blur-xl bg-white/80 border-slate-200/80 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Meeting Load</span>
            <Activity className="w-4 h-4 text-sky-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{data.meetingLoadHours}h</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5" /> -18% vs prev
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">Under maximum 8h weekly cap</p>
        </Card>

        {/* Velocity Delta */}
        <Card className="p-5 backdrop-blur-xl bg-white/80 border-slate-200/80 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Task Velocity</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">+{data.taskVelocityPercentChange}%</span>
            <span className="text-xs text-emerald-600 font-medium flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> throughput
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">37 tasks completed in cycle</p>
        </Card>

        {/* Burnout Risk */}
        <Card className="p-5 backdrop-blur-xl bg-white/80 border-slate-200/80 shadow-sm rounded-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cognitive Strain</span>
            <Brain className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600 capitalize">{data.burnoutRiskLevel}</span>
            <span className="text-xs text-emerald-600 font-medium">Balanced</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">Recovery index in green zone</p>
        </Card>
      </div>

      {/* Daily Focus vs. Meeting Load Visualizer */}
      <Card className="p-6 md:p-8 backdrop-blur-xl bg-white/85 border-slate-200/80 shadow-sm rounded-3xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              Focus Minutes vs. Meeting Fragmentation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparison of high-cognition uninterrupted time against scheduled call commitments.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-indigo-500" />
              <span className="text-slate-600 font-medium">Deep Focus</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-sky-200" />
              <span className="text-slate-600 font-medium">Meetings</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="grid grid-cols-7 gap-2 md:gap-6 pt-6 pb-2 items-end min-h-[220px]">
          {data.dailyMetrics.map((day) => {
            const focusHours = (day.focusMinutes / 60).toFixed(1);
            const meetingHours = (day.meetingMinutes / 60).toFixed(1);
            const focusHeight = Math.min(180, (day.focusMinutes / 400) * 180);
            const meetingHeight = Math.min(180, (day.meetingMinutes / 400) * 180);

            return (
              <div key={day.date} className="flex flex-col items-center gap-2 group">
                <div className="w-full flex justify-center items-end gap-1.5 h-[180px]">
                  {/* Focus Bar */}
                  <div
                    className="w-1/2 max-w-[28px] bg-indigo-500/90 hover:bg-indigo-600 rounded-t-lg transition-all duration-300 relative group-hover:shadow-md"
                    style={{ height: `${focusHeight}px` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900 text-white text-[10px] rounded-md whitespace-nowrap z-20 pointer-events-none">
                      {focusHours}h focus
                    </div>
                  </div>

                  {/* Meeting Bar */}
                  <div
                    className="w-1/2 max-w-[28px] bg-sky-200 hover:bg-sky-300 rounded-t-lg transition-all duration-300 relative"
                    style={{ height: `${meetingHeight}px` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-slate-900 text-white text-[10px] rounded-md whitespace-nowrap z-20 pointer-events-none">
                      {meetingHours}h meetings
                    </div>
                  </div>
                </div>

                <span className="text-xs font-semibold text-slate-700">{day.date}</span>
                <span className="text-[10px] text-slate-400">{day.tasksCompleted} tasks</span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Cognitive Rhythm & AI Summary Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Peak Rhythm Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            Cognitive Rhythm
          </h2>

          <Card className="p-6 backdrop-blur-xl bg-white/80 border-slate-200/80 rounded-3xl space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Peak Performance Zone
              </span>
              <div className="text-xl font-bold text-slate-900">{data.topProductiveHour}</div>
              <p className="text-xs text-slate-500">
                Biological circadian peak with highest task velocity and lowest revision rates.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Morning Architecture Flow</span>
                <span className="font-semibold text-emerald-600">96% Focus Rating</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Afternoon Admin & Syncs</span>
                <span className="font-semibold text-slate-700">Protected Buffers</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Evening Wind-Down</span>
                <span className="font-semibold text-indigo-600">Habit Completion</span>
              </div>
            </div>
          </Card>
        </div>

        {/* AI Executive Summary Card (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Executive AI Synthesis
            </h2>
            <button
              onClick={handleCopySummary}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy
            </button>
          </div>

          <Card className="p-6 backdrop-blur-xl bg-white/80 border-slate-200/80 rounded-3xl space-y-4">
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 text-slate-800 text-sm leading-relaxed">
              {data.executiveSummary}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold text-slate-900">Buffer Slots Active</div>
                  <div className="text-slate-400">15-min gaps between meetings</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold text-slate-900">Asynchronous First</div>
                  <div className="text-slate-400">Low fragmentation score</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

