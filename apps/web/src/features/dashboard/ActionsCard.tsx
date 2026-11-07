import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  ArrowUpRight,
  Check,
  Mail,
  Calendar,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import type { ActionItem } from '@nexus/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToastStore } from '@/components/ui/Toast';

interface ActionsCardProps {
  actions: ActionItem[];
  onOpenCreateTask: () => void;
  onRefresh?: () => void;
}

export function ActionsCard({ actions: initialActions, onOpenCreateTask }: ActionsCardProps) {
  const [actions, setActions] = useState<ActionItem[]>(initialActions);
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const handleActionClick = (actionId: string, actionKey: string, taskTitle: string) => {
    if (actionKey === 'complete') {
      setActions((prev) => prev.filter((a) => a.id !== actionId));
      addToast({
        type: 'success',
        title: 'Task Completed',
        message: `"${taskTitle}" marked as complete.`,
      });
    } else if (actionKey === 'message') {
      addToast({
        type: 'info',
        title: 'Direct Message',
        message: 'Drafting message to Asher on Slack...',
      });
    } else if (actionKey === 'calendar') {
      addToast({
        type: 'info',
        title: 'Calendar Invite',
        message: 'Calendar sync generated for design sync.',
      });
    } else if (actionKey === 'assign_agent') {
      addToast({
        type: 'info',
        title: 'Assigned to Agent',
        message: 'NEXUS Copilot will analyze Figma feedback comments.',
      });
    } else {
      addToast({
        type: 'info',
        title: 'Action Triggered',
        message: `Action executed for ${taskTitle}.`,
      });
    }
  };

  return (
    <Card variant="glass" className="flex flex-col h-full rounded-3xl">
      {/* Header matching reference image */}
      <CardHeader className="p-6 pb-4">
        <div>
          <CardTitle className="text-xl font-medium text-slate-900">Actions</CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            {actions.length === 0
              ? 'No pending tasks'
              : `${actions.length} tasks to complete`}
          </CardDescription>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateTask}
            title="Create Task"
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-slate-200/60 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/tasks')}
            title="View all tasks"
            className="w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-slate-200/60 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all hover:scale-105"
          >
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </CardHeader>

      {/* Main Content Area */}
      <CardContent className="flex-1 p-6 pt-0 flex flex-col justify-between">
        {actions.length === 0 ? (
          <EmptyState
            title="All clear for today"
            description="You have no pending tasks in your queue. Create a new task or take a break."
            actionLabel="Add a Task"
            onAction={onOpenCreateTask}
            className="my-auto py-8"
          />
        ) : (
          <div className="space-y-3.5">
            {actions.map((item) => (
              <div
                key={item.id}
                className="bg-white/95 rounded-2xl p-4 border border-slate-100 shadow-[0_2px_12px_-2px_rgba(90,105,143,0.06)] hover:border-slate-200/80 transition-all group"
              >
                {/* Top Item Row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    {/* App / Source Icon */}
                    <div className="w-8 h-8 rounded-xl bg-slate-100/90 flex items-center justify-center text-slate-600 shrink-0 font-bold text-xs shadow-xs">
                      {item.sourceApp === 'Slack' ? (
                        <span className="text-purple-600 text-sm font-bold">#</span>
                      ) : item.sourceApp === 'Figma' ? (
                        <span className="text-pink-600 text-xs font-bold">Fg</span>
                      ) : (
                        <MessageSquare className="w-4 h-4 text-slate-500" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-900 group-hover:text-indigo-950 transition-colors">
                        {item.title}
                      </h4>
                      {item.subtitle && (
                        <p className="text-xs text-slate-400 mt-0.5">{item.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/tasks')}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100/60 transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Micro Action Pills matching reference image */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {item.actions.map((act) => (
                    <button
                      key={act.id}
                      onClick={() => handleActionClick(item.id, act.actionKey, item.title)}
                      className="pill-action"
                    >
                      {act.actionKey === 'complete' && <Check className="w-3 h-3 text-emerald-600" />}
                      {act.actionKey === 'message' && <Mail className="w-3 h-3 text-indigo-500" />}
                      {act.actionKey === 'calendar' && <Calendar className="w-3 h-3 text-blue-500" />}
                      {act.actionKey === 'assign_agent' && (
                        <Sparkles className="w-3 h-3 text-amber-500" />
                      )}
                      <span>{act.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Quick Controls matching reference image */}
        <div className="flex items-center gap-2.5 pt-4 mt-4 border-t border-slate-100/70">
          <button
            onClick={() => navigate('/tasks')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-xs font-medium text-slate-700 border border-slate-200/80 shadow-xs transition-all"
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>View All</span>
          </button>

          <button
            onClick={() => navigate('/assistant')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-xs font-medium text-indigo-700 border border-indigo-100/80 shadow-xs hover:border-indigo-200 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Ask AI for Help</span>
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

