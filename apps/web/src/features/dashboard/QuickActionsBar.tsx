import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, FileText, Sparkles, CheckSquare } from 'lucide-react';

interface QuickActionsBarProps {
  onOpenCreateTask: () => void;
  onOpenCommandPalette: () => void;
}

export function QuickActionsBar({ onOpenCreateTask, onOpenCommandPalette }: QuickActionsBarProps) {
  const navigate = useNavigate();

  const actions = [
    {
      id: 'task',
      label: 'New Task',
      icon: Plus,
      onClick: onOpenCreateTask,
      variant: 'primary',
    },
    {
      id: 'schedule',
      label: 'Schedule Event',
      icon: Calendar,
      onClick: () => navigate('/calendar'),
    },
    {
      id: 'note',
      label: 'Capture Note',
      icon: FileText,
      onClick: () => navigate('/notes'),
    },
    {
      id: 'ai',
      label: 'Ask AI Copilot',
      icon: Sparkles,
      onClick: onOpenCommandPalette,
      isAi: true,
    },
    {
      id: 'tasks-list',
      label: 'Task Queue',
      icon: CheckSquare,
      onClick: () => navigate('/tasks'),
    },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-6">
      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-1 shrink-0">
        Quick Actions:
      </span>

      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <button
            key={act.id}
            onClick={act.onClick}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all shadow-xs shrink-0 ${
              act.variant === 'primary'
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : act.isAi
                ? 'bg-white/90 text-indigo-700 border border-indigo-200 hover:bg-white hover:border-indigo-300'
                : 'bg-white/90 text-slate-700 border border-slate-200/70 hover:bg-white hover:text-slate-900'
            }`}
          >
            <Icon className={`w-3.5 h-3.5 ${act.isAi ? 'text-indigo-600' : ''}`} />
            <span>{act.label}</span>
          </button>
        );
      })}
    </div>
  );
}
