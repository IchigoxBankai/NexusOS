import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  MoreVertical,
  Trash2,
  FolderGit2,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { useToastStore } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import type { ProjectStatus, ProjectWithStats, ProjectMilestone } from '@nexus/types';

const INITIAL_PROJECTS: ProjectWithStats[] = [
  {
    id: 'proj-1',
    user_id: 'user-1',
    name: 'NEXUS Personal OS v1.0',
    description: 'Autonomous life management engine unifying tasks, calendar, notes, habits, and finance.',
    category: 'Engineering & Product',
    status: 'active',
    color: '#6366F1',
    target_date: '2026-05-15',
    total_tasks: 24,
    completed_tasks: 19,
    progress_percent: 79,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    milestones: [
      { id: 'm1', project_id: 'proj-1', user_id: 'user-1', title: 'Stage 1: Architecture & Auth Foundation', is_completed: true, due_date: '2026-05-01', order_index: 0, created_at: '' },
      { id: 'm2', project_id: 'proj-1', user_id: 'user-1', title: 'Stage 2: Tasks & Projects Engine', is_completed: true, due_date: '2026-05-08', order_index: 1, created_at: '' },
      { id: 'm3', project_id: 'proj-1', user_id: 'user-1', title: 'Stage 3: Smart Calendar & Notes Vault', is_completed: false, due_date: '2026-05-15', order_index: 2, created_at: '' },
    ],
  },
  {
    id: 'proj-2',
    user_id: 'user-1',
    name: 'Brand Identity & Visual System',
    description: 'Ethereal aurora palette, glassmorphism design tokens, micro-actions, and typography hierarchy.',
    category: 'Design Architecture',
    status: 'active',
    color: '#EC4899',
    target_date: '2026-05-10',
    total_tasks: 12,
    completed_tasks: 11,
    progress_percent: 92,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    milestones: [
      { id: 'm4', project_id: 'proj-2', user_id: 'user-1', title: 'Design system tokens & aurora shaders', is_completed: true, due_date: '2026-05-02', order_index: 0, created_at: '' },
      { id: 'm5', project_id: 'proj-2', user_id: 'user-1', title: 'Mobile React Native component library', is_completed: true, due_date: '2026-05-06', order_index: 1, created_at: '' },
    ],
  },
  {
    id: 'proj-3',
    user_id: 'user-1',
    name: 'NEXUS Autonomous Copilot Engine',
    description: 'Tool-calling multi-agent pipeline with pgvector semantic retrieval across personal knowledge vaults.',
    category: 'AI & Research',
    status: 'planning',
    color: '#8B5CF6',
    target_date: '2026-06-01',
    total_tasks: 18,
    completed_tasks: 4,
    progress_percent: 22,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    milestones: [
      { id: 'm6', project_id: 'proj-3', user_id: 'user-1', title: 'LangChain & Tool-calling integration schema', is_completed: true, due_date: '2026-05-20', order_index: 0, created_at: '' },
      { id: 'm7', project_id: 'proj-3', user_id: 'user-1', title: 'pgvector embeddings index in Supabase', is_completed: false, due_date: '2026-05-28', order_index: 1, created_at: '' },
    ],
  },
];

const PRESET_COLORS = ['#6366F1', '#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'];

export function ProjectsView() {
  const [projects, setProjects] = useState<ProjectWithStats[]>(INITIAL_PROJECTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New Project Form State
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Engineering & Product');
  const [newColor, setNewColor] = useState('#6366F1');
  const [newTargetDate, setNewTargetDate] = useState('2026-06-15');

  const { addToast } = useToastStore();
  const navigate = useNavigate();

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newProject: ProjectWithStats = {
      id: `proj-${Date.now()}`,
      user_id: 'current-user',
      name: newName.trim(),
      description: newDesc.trim() || 'Strategic personal project initiative.',
      category: newCategory,
      status: 'active',
      color: newColor,
      target_date: newTargetDate,
      total_tasks: 0,
      completed_tasks: 0,
      progress_percent: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      milestones: [
        { id: `m-${Date.now()}-1`, project_id: `proj-${Date.now()}`, user_id: 'current-user', title: 'Project Scope Definition', is_completed: false, due_date: newTargetDate, order_index: 0, created_at: '' },
      ],
    };

    setProjects((prev) => [newProject, ...prev]);
    setIsCreateOpen(false);
    setNewName('');
    setNewDesc('');
    addToast({
      type: 'success',
      title: 'Project Initialized',
      message: `"${newProject.name}" has been created.`,
    });
  };

  const handleDeleteProject = (id: string, name: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    addToast({
      type: 'info',
      title: 'Project Deleted',
      message: `"${name}" was archived.`,
    });
  };

  const handleToggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId || !p.milestones) return p;
        const updatedMilestones = p.milestones.map((m: ProjectMilestone) =>
          m.id === milestoneId ? { ...m, is_completed: !m.is_completed } : m
        );
        const completedCount = updatedMilestones.filter((m: ProjectMilestone) => m.is_completed).length;
        const progress = Math.round((completedCount / updatedMilestones.length) * 100);

        return {
          ...p,
          milestones: updatedMilestones,
          progress_percent: progress,
        };
      })
    );
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Projects & Initiatives</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {projects.length} initiatives
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Track multi-step projects, delivery roadmaps, and key milestone checkpoints.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsCreateOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          New Project
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card variant="glass" className="p-4 rounded-2xl flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects or categories..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white/90 border border-slate-200/80 rounded-xl focus:outline-none focus:border-indigo-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Status:</span>
          {['all', 'active', 'planning', 'completed'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                'px-2.5 py-1 rounded-full text-[11px] font-medium capitalize transition-all',
                statusFilter === s
                  ? 'bg-slate-900 text-white'
                  : 'bg-white/70 text-slate-600 hover:bg-white border border-slate-200/60'
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </Card>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <Card variant="glass" className="p-12 text-center rounded-3xl">
          <FolderGit2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-700">No projects found</h3>
          <p className="text-xs text-slate-400 mt-1">Create an initiative or adjust search filters.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProjects.map((proj) => (
            <Card
              key={proj.id}
              variant="glass"
              className="p-5 rounded-3xl flex flex-col justify-between hover:shadow-glass-hover transition-all group"
            >
              <div>
                {/* Top Row: Category chip & Delete button */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: proj.color }}
                    />
                    <span className="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                      {proj.category}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteProject(proj.id, proj.name)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 rounded transition-all"
                    title="Delete project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Project Title & Description */}
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-950 transition-colors">
                  {proj.name}
                </h3>
                {proj.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                )}

                {/* Progress Bar */}
                <div className="mt-4 mb-3">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-500">Progress</span>
                    <span className="text-slate-900 font-bold">{proj.progress_percent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${proj.progress_percent}%`,
                        backgroundColor: proj.color,
                      }}
                    />
                  </div>
                </div>

                {/* Milestones Checklist */}
                {proj.milestones && proj.milestones.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100/70 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Milestones
                    </span>
                    {proj.milestones.map((m: ProjectMilestone) => (
                      <div
                        key={m.id}
                        onClick={() => handleToggleMilestone(proj.id, m.id)}
                        className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-slate-900"
                      >
                        <CheckCircle2
                          className={cn(
                            'w-3.5 h-3.5 shrink-0 transition-colors',
                            m.is_completed ? 'text-emerald-500' : 'text-slate-300'
                          )}
                        />
                        <span
                          className={cn(
                            'truncate',
                            m.is_completed && 'line-through text-slate-400'
                          )}
                        >
                          {m.title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100/70 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {proj.target_date || 'Ongoing'}
                </span>

                <button
                  onClick={() => navigate('/tasks')}
                  className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  <span>{proj.completed_tasks}/{proj.total_tasks} tasks</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Project Dialog */}
      <Dialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create New Project"
        description="Establish a strategic personal or professional initiative."
      >
        <form onSubmit={handleCreateProject} className="space-y-4 pt-2">
          <Input
            label="Project Name"
            placeholder="e.g. Q3 Mobile App Redesign"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
              Description (Optional)
            </label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="What are the key goals and deliverables?"
              rows={3}
              className="w-full text-xs bg-white/90 border border-slate-200/90 rounded-2xl p-3 focus:outline-none focus:border-indigo-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full bg-white text-xs rounded-2xl border border-slate-200/90 py-2.5 px-3"
              >
                <option value="Engineering & Product">Engineering & Product</option>
                <option value="Design Architecture">Design Architecture</option>
                <option value="AI & Research">AI & Research</option>
                <option value="Personal Growth">Personal Growth</option>
                <option value="Finance & Operations">Finance & Operations</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
                Target Date
              </label>
              <input
                type="date"
                value={newTargetDate}
                onChange={(e) => setNewTargetDate(e.target.value)}
                className="w-full bg-white text-xs rounded-2xl border border-slate-200/90 py-2.5 px-3"
              />
            </div>
          </div>

          {/* Color Tag Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
              Theme Color
            </label>
            <div className="flex items-center gap-3">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewColor(c)}
                  className={cn(
                    'w-7 h-7 rounded-full transition-transform',
                    newColor === c && 'ring-2 ring-slate-900 ring-offset-2 scale-110'
                  )}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Create Project
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

