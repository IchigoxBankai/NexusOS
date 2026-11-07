import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, FolderGit2 } from 'lucide-react';
import type { ActiveProjectSummary } from '@nexus/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';

interface ActiveProjectsCardProps {
  projects: ActiveProjectSummary[];
}

export function ActiveProjectsCard({ projects }: ActiveProjectsCardProps) {
  const navigate = useNavigate();

  return (
    <Card variant="glass" className="rounded-3xl">
      <CardHeader className="p-6 pb-4">
        <div>
          <CardTitle className="text-lg font-medium text-slate-900">Active Projects</CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            Key initiatives and delivery tracking
          </CardDescription>
        </div>

        <button
          onClick={() => navigate('/projects')}
          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-slate-200/60 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {projects.length === 0 ? (
          <EmptyState
            icon={<FolderGit2 className="w-5 h-5 text-indigo-500" />}
            title="No active projects"
            description="Projects organize your high-level goals and multi-step initiatives."
            actionLabel="Explore Projects"
            onAction={() => navigate('/projects')}
            className="py-8"
          />
        ) : (
          <div className="space-y-3">
            {projects.map((proj) => (
              <div
                key={proj.id}
                onClick={() => navigate('/projects')}
                className="bg-white/95 rounded-2xl p-4 border border-slate-100 shadow-[0_2px_10px_-2px_rgba(90,105,143,0.06)] hover:border-indigo-200/80 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: proj.color }}
                    />
                    <h4 className="text-xs font-semibold text-slate-900 group-hover:text-indigo-900">
                      {proj.name}
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-slate-700">
                    {proj.progressPercent}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${proj.progressPercent}%`,
                      backgroundColor: proj.color,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-400">
                  <span>{proj.category}</span>
                  <span>
                    {proj.completedTasks}/{proj.totalTasks} tasks completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

