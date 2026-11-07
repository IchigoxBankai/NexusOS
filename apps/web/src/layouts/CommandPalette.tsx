import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutGrid,
  CheckSquare,
  Briefcase,
  Calendar,
  FileText,
  Repeat,
  Target,
  CreditCard,
  Sparkles,
  BarChart2,
  Settings,
  User,
  Plus,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useAuthStore } from '@/features/auth/authStore';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { usePreviewData, togglePreviewData } = useAuthStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const commands = [
    { id: 'dash', label: 'Go to Command Center', icon: LayoutGrid, path: '/dashboard', category: 'Navigation' },
    { id: 'tasks', label: 'Go to Tasks', icon: CheckSquare, path: '/tasks', category: 'Navigation' },
    { id: 'projects', label: 'Go to Projects', icon: Briefcase, path: '/projects', category: 'Navigation' },
    { id: 'calendar', label: 'Go to Calendar', icon: Calendar, path: '/calendar', category: 'Navigation' },
    { id: 'notes', label: 'Go to Notes & Knowledge Vault', icon: FileText, path: '/notes', category: 'Navigation' },
    { id: 'habits', label: 'Go to Habits & Routines', icon: Repeat, path: '/habits', category: 'Navigation' },
    { id: 'goals', label: 'Go to Goals & Milestones', icon: Target, path: '/goals', category: 'Navigation' },
    { id: 'finance', label: 'Go to Personal Finance', icon: CreditCard, path: '/finance', category: 'Navigation' },
    { id: 'assistant', label: 'Ask NEXUS AI Copilot', icon: Sparkles, path: '/assistant', category: 'AI & Assist' },
    { id: 'insights', label: 'Go to Productivity Insights', icon: BarChart2, path: '/insights', category: 'Navigation' },
    { id: 'settings', label: 'Open Workspace Settings', icon: Settings, path: '/settings', category: 'Preferences' },
    { id: 'profile', label: 'Open My Profile', icon: User, path: '/profile', category: 'Account' },
    {
      id: 'toggle-preview',
      label: usePreviewData ? 'Switch to Authentic Empty State' : 'Switch to Rich Sample Preview',
      icon: usePreviewData ? EyeOff : Eye,
      action: () => togglePreviewData(),
      category: 'Developer Preview',
    },
    {
      id: 'quick-task',
      label: 'Create Quick Task',
      icon: Plus,
      path: '/dashboard?action=new-task',
      category: 'Actions',
    },
  ];

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (cmd: typeof commands[0]) => {
    if (cmd.action) {
      cmd.action();
    } else if (cmd.path) {
      navigate(cmd.path);
    }
    onClose();
    setQuery('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl border border-white/80 rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-slate-100">
              <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, module name or question..."
                className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-medium text-slate-400 bg-slate-100 rounded-md border border-slate-200">
                ESC
              </kbd>
            </div>

            {/* Commands List */}
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No commands matching "{query}"
                </div>
              ) : (
                filtered.map((cmd) => {
                  const Icon = cmd.icon;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => handleSelect(cmd)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-left text-xs text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-900 transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 transition-colors">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-medium">{cmd.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 group-hover:text-indigo-400">
                        {cmd.category}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
