import { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { quickTaskSchema } from '@nexus/validation';
import type { ActionItem, ActionPriority } from '@nexus/types';
import { useToastStore } from '@/components/ui/Toast';

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: ActionItem) => void;
}

export function CreateTaskDialog({ isOpen, onClose, onTaskCreated }: CreateTaskDialogProps) {
  const [title, setTitle] = useState('');
  const [sourceApp, setSourceApp] = useState('Personal');
  const [priority, setPriority] = useState<ActionPriority>('medium');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToastStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = quickTaskSchema.safeParse({ title, priority });
    if (!result.success) {
      setError(result.error.errors[0]?.message || 'Invalid task input');
      return;
    }

    setIsSubmitting(true);

    const newTask: ActionItem = {
      id: `task-${Date.now()}`,
      title,
      subtitle: `${sourceApp} – Personal Workspace`,
      sourceApp,
      priority,
      status: 'pending',
      actions: [
        { id: `act-${Date.now()}-1`, label: 'Mark as Complete', actionKey: 'complete' },
        { id: `act-${Date.now()}-2`, label: 'Assign to Agent', actionKey: 'assign_agent' },
      ],
    };

    setTimeout(() => {
      onTaskCreated(newTask);
      setIsSubmitting(false);
      setTitle('');
      onClose();
      addToast({
        type: 'success',
        title: 'Task Created',
        message: `"${title}" was added to your Actions queue.`,
      });
    }, 200);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Action"
      description="Add a task or action item to your Command Center."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <Input
          label="Task Description"
          placeholder="e.g. Review Q2 engineering roadmap draft"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={error || undefined}
          autoFocus
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
              Source App / Context
            </label>
            <select
              value={sourceApp}
              onChange={(e) => setSourceApp(e.target.value)}
              className="w-full bg-white/85 text-slate-900 text-sm rounded-2xl border border-slate-200/90 py-2.5 px-3 focus:outline-none focus:border-indigo-400"
            >
              <option value="Personal">Personal Queue</option>
              <option value="Slack">Slack Workspace</option>
              <option value="Figma">Figma</option>
              <option value="GitHub">GitHub</option>
              <option value="Notion">Notion</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as ActionPriority)}
              className="w-full bg-white/85 text-slate-900 text-sm rounded-2xl border border-slate-200/90 py-2.5 px-3 focus:outline-none focus:border-indigo-400"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            Create Action
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

