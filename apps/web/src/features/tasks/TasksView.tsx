import { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Check,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToastStore } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import type { TaskPriority, TaskStatus } from '@nexus/types';

interface TaskItem {
  id: string;
  title: string;
  sourceApp: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  projectName?: string;
  tags?: string[];
}

const INITIAL_TASKS: TaskItem[] = [
  {
    id: 't-1',
    title: 'Huddle with Asher for design sync',
    sourceApp: 'Slack',
    priority: 'high',
    status: 'todo',
    dueDate: 'Today, 2:00 PM',
    projectName: 'Brand Identity',
    tags: ['design', 'sync'],
  },
  {
    id: 't-2',
    title: 'Apply design feedback from comments',
    sourceApp: 'Figma',
    priority: 'medium',
    status: 'in_progress',
    dueDate: 'Tomorrow',
    projectName: 'NEXUS OS v1',
    tags: ['ui', 'feedback'],
  },
  {
    id: 't-3',
    title: 'Configure PostgreSQL Row Level Security policies',
    sourceApp: 'Personal',
    priority: 'urgent',
    status: 'completed',
    dueDate: 'May 8',
    projectName: 'NEXUS OS v1',
    tags: ['backend', 'security'],
  },
  {
    id: 't-4',
    title: 'Review weekly leadership strategy document',
    sourceApp: 'Notion',
    priority: 'low',
    status: 'todo',
    dueDate: 'May 12',
    projectName: 'Strategy',
    tags: ['planning'],
  },
  {
    id: 't-5',
    title: 'Draft architecture roadmap for Stage 3 Calendar',
    sourceApp: 'Personal',
    priority: 'medium',
    status: 'in_progress',
    dueDate: 'May 14',
    projectName: 'NEXUS OS v1',
    tags: ['architecture'],
  },
];

export function TasksView() {
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [activeTab, setActiveTab] = useState<'queue' | 'kanban' | 'matrix'>('queue');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  const [newTaskSource, setNewTaskSource] = useState('Personal');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const { addToast } = useToastStore();

  const handleToggleTask = (id: string, title: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'completed' ? 'todo' : 'completed';
          addToast({
            type: nextStatus === 'completed' ? 'success' : 'info',
            title: nextStatus === 'completed' ? 'Task Completed' : 'Task Reopened',
            message: `"${title}" is now marked as ${nextStatus}.`,
          });
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string, title: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    addToast({
      type: 'info',
      title: 'Task Removed',
      message: `"${title}" was removed from your queue.`,
    });
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: TaskItem = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      sourceApp: newTaskSource,
      priority: newTaskPriority,
      status: 'todo',
      dueDate: 'Today',
      projectName: 'Personal',
      tags: ['quick-action'],
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
    setIsAddingTask(false);
    addToast({
      type: 'success',
      title: 'Action Item Created',
      message: `"${newTask.title}" was added to your queue.`,
    });
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.sourceApp.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.projectName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || t.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  const getPriorityBadgeClass = (p: TaskPriority) => {
    switch (p) {
      case 'urgent':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'high':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'medium':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'low':
        return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tasks & Queue</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {tasks.filter((t) => t.status !== 'completed').length} active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Unified actions across your personal workspace, Slack, Figma, and Notion.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 rounded-full bg-white/80 border border-white/60 shadow-xs">
            <button
              onClick={() => setActiveTab('queue')}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                activeTab === 'queue'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Queue List
            </button>
            <button
              onClick={() => setActiveTab('kanban')}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                activeTab === 'kanban'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Kanban Board
            </button>
            <button
              onClick={() => setActiveTab('matrix')}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                activeTab === 'matrix'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              Priority Matrix
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => setIsAddingTask(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New Task
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="glass" className="p-4 rounded-2xl flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, tags, or projects..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white/90 border border-slate-200/80 rounded-xl focus:outline-none focus:border-indigo-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Priority:</span>
          {['all', 'urgent', 'high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPriority(p)}
              className={cn(
                'px-2.5 py-1 rounded-full text-[11px] font-medium capitalize transition-all',
                selectedPriority === p
                  ? 'bg-slate-900 text-white'
                  : 'bg-white/70 text-slate-600 hover:bg-white border border-slate-200/60'
              )}
            >
              {p}
            </button>
          ))}
        </div>
      </Card>

      {/* Inline Quick Add Form */}
      {isAddingTask && (
        <Card variant="elevated" className="p-4 rounded-2xl border border-indigo-100 shadow-md">
          <form onSubmit={handleCreateTask} className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[240px]">
              <Input
                placeholder="What needs to get done?"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                autoFocus
              />
            </div>

            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>

            <select
              value={newTaskSource}
              onChange={(e) => setNewTaskSource(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-700"
            >
              <option value="Personal">Personal</option>
              <option value="Slack">Slack</option>
              <option value="Figma">Figma</option>
              <option value="Notion">Notion</option>
              <option value="GitHub">GitHub</option>
            </select>

            <div className="flex items-center gap-2">
              <Button type="submit" size="sm">
                Add Task
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddingTask(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 1: QUEUE LIST VIEW */}
      {activeTab === 'queue' && (
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <Card variant="glass" className="p-12 text-center rounded-3xl">
              <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-slate-700">No tasks match your filter</h3>
              <p className="text-xs text-slate-400 mt-1">Try clearing filters or add a new action item.</p>
            </Card>
          ) : (
            filteredTasks.map((t) => {
              const isCompleted = t.status === 'completed';

              return (
                <div
                  key={t.id}
                  className={cn(
                    'bg-white/95 rounded-2xl p-4 border border-slate-100 shadow-[0_2px_10px_-2px_rgba(90,105,143,0.06)] hover:border-slate-200 flex items-center justify-between gap-4 transition-all group',
                    isCompleted && 'opacity-60 bg-slate-50/70'
                  )}
                >
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleTask(t.id, t.title)}
                      className={cn(
                        'w-5 h-5 rounded-lg flex items-center justify-center transition-all shrink-0',
                        isCompleted
                          ? 'bg-emerald-500 text-white shadow-xs'
                          : 'border border-slate-300 hover:border-indigo-400 bg-white'
                      )}
                    >
                      {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    {/* Task Title & Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'text-sm font-medium text-slate-900 truncate',
                            isCompleted && 'line-through text-slate-400'
                          )}
                        >
                          {t.title}
                        </span>

                        <span
                          className={cn(
                            'text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border shrink-0',
                            getPriorityBadgeClass(t.priority)
                          )}
                        >
                          {t.priority}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-slate-400">
                        {t.projectName && (
                          <span className="flex items-center gap-1 text-indigo-600 font-medium">
                            <Layers className="w-3 h-3" />
                            {t.projectName}
                          </span>
                        )}
                        {t.sourceApp && <span>• {t.sourceApp}</span>}
                        {t.dueDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {t.dueDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDeleteTask(t.id, t.title)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: KANBAN BOARD VIEW */}
      {activeTab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          {[
            { key: 'todo', label: 'To Do', color: 'border-indigo-400' },
            { key: 'in_progress', label: 'In Progress', color: 'border-amber-400' },
            { key: 'completed', label: 'Completed', color: 'border-emerald-400' },
            { key: 'deferred', label: 'Deferred', color: 'border-slate-300' },
          ].map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.key);

            return (
              <div key={col.key} className="space-y-3">
                <div
                  className={cn(
                    'flex items-center justify-between p-3 rounded-2xl bg-white/70 border-t-2 shadow-xs backdrop-blur-md',
                    col.color
                  )}
                >
                  <h3 className="text-xs font-semibold text-slate-900">{col.label}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {columnTasks.length}
                  </span>
                </div>

                <div className="space-y-2.5 min-h-[160px]">
                  {columnTasks.length === 0 ? (
                    <div className="p-4 text-center border border-dashed border-slate-200 rounded-2xl text-[11px] text-slate-400">
                      Empty column
                    </div>
                  ) : (
                    columnTasks.map((t) => (
                      <div
                        key={t.id}
                        className="bg-white/95 rounded-2xl p-3.5 border border-slate-100 shadow-sm space-y-2 hover:border-indigo-200 transition-all cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-medium text-slate-900 leading-snug">
                            {t.title}
                          </h4>
                          <span
                            className={cn(
                              'text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full border shrink-0',
                              getPriorityBadgeClass(t.priority)
                            )}
                          >
                            {t.priority}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                          <span>{t.sourceApp}</span>
                          <button
                            onClick={() => handleToggleTask(t.id, t.title)}
                            className="text-indigo-600 font-medium hover:underline"
                          >
                            {t.status === 'completed' ? 'Reopen' : 'Done'}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: EISENHOWER PRIORITY MATRIX */}
      {activeTab === 'matrix' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Do First (Urgent & Important)',
              filter: (t: TaskItem) => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'completed',
              badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
              borderColor: 'border-rose-200',
            },
            {
              title: 'Schedule (Important, Not Urgent)',
              filter: (t: TaskItem) => t.priority === 'medium' && t.status !== 'completed',
              badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
              borderColor: 'border-indigo-200',
            },
            {
              title: 'Delegate (Urgent, Less Critical)',
              filter: (t: TaskItem) => t.sourceApp !== 'Personal' && t.status !== 'completed',
              badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
              borderColor: 'border-amber-200',
            },
            {
              title: 'Eliminate or Backlog',
              filter: (t: TaskItem) => t.priority === 'low' || t.status === 'completed',
              badgeColor: 'bg-slate-50 text-slate-700 border-slate-200',
              borderColor: 'border-slate-200',
            },
          ].map((quadrant, idx) => {
            const quadrantTasks = tasks.filter(quadrant.filter);

            return (
              <Card
                key={idx}
                variant="glass"
                className={cn('p-5 rounded-3xl border-l-4 space-y-3', quadrant.borderColor)}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <h3 className="text-xs font-semibold text-slate-900">{quadrant.title}</h3>
                  <span
                    className={cn(
                      'text-[10px] font-bold px-2 py-0.5 rounded-full border',
                      quadrant.badgeColor
                    )}
                  >
                    {quadrantTasks.length} items
                  </span>
                </div>

                <div className="space-y-2">
                  {quadrantTasks.length === 0 ? (
                    <p className="text-xs text-slate-400 py-3 text-center">Clear quadrant</p>
                  ) : (
                    quadrantTasks.map((t) => (
                      <div
                        key={t.id}
                        className="bg-white/95 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between gap-2"
                      >
                        <span className="text-xs text-slate-800 font-medium truncate">
                          {t.title}
                        </span>
                        <button
                          onClick={() => handleToggleTask(t.id, t.title)}
                          className="text-[11px] text-indigo-600 font-medium shrink-0"
                        >
                          Check
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
