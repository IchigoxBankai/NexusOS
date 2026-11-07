import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Target } from 'lucide-react';
import type { GoalSummary } from '@nexus/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

interface GoalsCardProps {
  goals: GoalSummary[];
}

export function GoalsCard({ goals }: GoalsCardProps) {
  const navigate = useNavigate();

  return (
    <Card variant="glass" className="rounded-3xl">
      <CardHeader className="p-6 pb-4">
        <div>
          <CardTitle className="text-lg font-medium text-slate-900">Goals & Horizons</CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            Long-term aspirations & targets
          </CardDescription>
        </div>

        <button
          onClick={() => navigate('/goals')}
          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-slate-200/60 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {goals.length === 0 ? (
          <EmptyState
            icon={<Target className="w-5 h-5 text-indigo-500" />}
            title="No active goals defined"
            description="Set quarterly milestones and monitor long-term life objectives."
            actionLabel="Define Goals"
            onAction={() => navigate('/goals')}
            className="py-8"
          />
        ) : (
          <div className="space-y-3">
            {goals.map((goal) => {
              const percent = Math.min(
                100,
                Math.round((goal.currentProgress / goal.targetProgress) * 100)
              );

              return (
                <div
                  key={goal.id}
                  onClick={() => navigate('/goals')}
                  className="bg-white/95 rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_-2px_rgba(90,105,143,0.06)] hover:border-slate-200 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-900">
                      {goal.title}
                    </h4>
                    <span className="text-xs font-bold text-indigo-600">{percent}%</span>
                  </div>

                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden my-2">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{goal.category}</span>
                    <span>
                      {goal.currentProgress} / {goal.targetProgress} {goal.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
