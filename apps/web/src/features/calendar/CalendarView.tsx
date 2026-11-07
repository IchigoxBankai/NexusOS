import { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Video,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Users,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { useToastStore } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '@nexus/types';

const INITIAL_EVENTS: CalendarEvent[] = [
  {
    id: 'e1',
    user_id: 'u1',
    title: 'Weekly Leadership Alignment',
    description: 'Quarterly OKR review and cross-functional dependencies sync.',
    start_time: '2026-05-08T10:00:00Z',
    end_time: '2026-05-08T10:45:00Z',
    location: 'Google Meet',
    is_virtual: true,
    meeting_url: 'https://meet.google.com/nex-lead-sync',
    category: 'Work',
    color: '#6366F1',
    created_at: '',
    updated_at: '',
  },
  {
    id: 'e2',
    user_id: 'u1',
    title: 'Deep Work Slot: Architecture Core',
    description: 'Uninterrupted focus time dedicated to NEXUS autonomous agent pipeline.',
    start_time: '2026-05-08T11:00:00Z',
    end_time: '2026-05-08T13:00:00Z',
    location: 'Focus Room',
    is_virtual: false,
    category: 'Focus',
    color: '#8B5CF6',
    created_at: '',
    updated_at: '',
  },
  {
    id: 'e3',
    user_id: 'u1',
    title: 'Product Architecture Review with Design Team',
    description: 'Reviewing interactive micro-action states and mobile UI parity.',
    start_time: '2026-05-08T14:00:00Z',
    end_time: '2026-05-08T15:00:00Z',
    location: 'Room 4B / Hybrid',
    is_virtual: true,
    meeting_url: 'https://meet.google.com/nex-arch-rev',
    category: 'Work',
    color: '#3B82F6',
    created_at: '',
    updated_at: '',
  },
  {
    id: 'e4',
    user_id: 'u1',
    title: 'Cardio Workout & Recovery Run',
    description: 'Zone 2 running & mobility stretch.',
    start_time: '2026-05-08T17:30:00Z',
    end_time: '2026-05-08T18:30:00Z',
    location: 'Park Trail',
    is_virtual: false,
    category: 'Health',
    color: '#10B981',
    created_at: '',
    updated_at: '',
  },
];

export function CalendarView() {
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [activeView, setActiveView] = useState<'schedule' | 'week' | 'month'>('schedule');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Event Form
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'Work' | 'Personal' | 'Focus' | 'Social' | 'Health'>('Work');
  const [newTime, setNewTime] = useState('09:00 AM - 10:00 AM');
  const [newLocation, setNewLocation] = useState('Google Meet');
  const [isVirtual, setIsVirtual] = useState(true);

  const { addToast } = useToastStore();

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const colors = {
      Work: '#6366F1',
      Personal: '#EC4899',
      Focus: '#8B5CF6',
      Health: '#10B981',
      Social: '#F59E0B',
    };

    const newEvent: CalendarEvent = {
      id: `evt-${Date.now()}`,
      user_id: 'current-user',
      title: newTitle.trim(),
      description: 'Scheduled via NEXUS Smart Calendar.',
      start_time: new Date().toISOString(),
      end_time: new Date().toISOString(),
      location: newLocation,
      is_virtual: isVirtual,
      meeting_url: isVirtual ? 'https://meet.google.com/new' : null,
      category: newCategory,
      color: colors[newCategory],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    setEvents((prev) => [...prev, newEvent]);
    setIsAddOpen(false);
    setNewTitle('');
    addToast({
      type: 'success',
      title: 'Event Scheduled',
      message: `"${newEvent.title}" was added to your smart schedule.`,
    });
  };

  const handleJoinMeeting = (event: CalendarEvent) => {
    if (event.meeting_url) {
      window.open(event.meeting_url, '_blank');
      addToast({
        type: 'info',
        title: 'Launching Call',
        message: `Connecting to virtual meeting for "${event.title}"...`,
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-4 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Smart Calendar</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
              {events.length} events today
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Intelligent schedule orchestration, deep work buffer allocation, and meeting management.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Pills */}
          <div className="flex items-center p-1 rounded-full bg-white/80 border border-white/60 shadow-xs">
            {(['schedule', 'week', 'month'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all',
                  activeView === view
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                )}
              >
                {view}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            onClick={() => setIsAddOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New Event
          </Button>
        </div>
      </div>

      {/* Focus & Balance Overview Banner */}
      <Card variant="glass" className="p-5 rounded-3xl bg-gradient-to-r from-blue-50/50 via-indigo-50/40 to-white/80 border-blue-100/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Daily Focus Score: 85% Optimum
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                2 hours dedicated deep work, 1 hr 45 min collaborative meetings, 1 hr buffer.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-indigo-700 bg-white/90 px-3 py-1 rounded-full border border-indigo-100 shadow-xs">
              Next Buffer: 1:00 PM – 2:00 PM
            </span>
          </div>
        </div>
      </Card>

      {/* Schedule Agenda View */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>Today's Orchestration</span>
          </div>
          <span className="text-xs text-slate-400">Tuesday, May 8, 2026</span>
        </div>

        {events.map((evt) => (
          <Card
            key={evt.id}
            variant="glass"
            className="p-5 rounded-3xl hover:border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div
                className="w-1.5 h-12 rounded-full shrink-0"
                style={{ backgroundColor: evt.color }}
              />

              <div className="w-20 shrink-0">
                <span className="text-xs font-bold text-slate-900 block">
                  {evt.start_time.split('T')[1]?.slice(0, 5) || '10:00'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {evt.category}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-950 transition-colors">
                  {evt.title}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                  <span>{evt.location}</span>
                  {evt.description && <span className="hidden md:inline">• {evt.description}</span>}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {evt.is_virtual && evt.meeting_url && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleJoinMeeting(evt)}
                  leftIcon={<Video className="w-3.5 h-3.5 text-blue-600" />}
                >
                  Join Call
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Schedule Event Dialog */}
      <Dialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Schedule New Event"
        description="Book a meeting, time-blocked deep work slot, or personal routine."
      >
        <form onSubmit={handleCreateEvent} className="space-y-4 pt-2">
          <Input
            label="Event Title"
            placeholder="e.g. Q2 Product Review & Strategy"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
                Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full bg-white text-xs rounded-2xl border border-slate-200/90 py-2.5 px-3"
              >
                <option value="Work">Work Meeting</option>
                <option value="Focus">Deep Work (Focus)</option>
                <option value="Personal">Personal</option>
                <option value="Health">Health & Exercise</option>
                <option value="Social">Social</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-1.5">
                Time Window
              </label>
              <input
                type="text"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="10:00 AM - 11:00 AM"
                className="w-full bg-white text-xs rounded-2xl border border-slate-200/90 py-2.5 px-3"
              />
            </div>
          </div>

          <Input
            label="Location or Platform"
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            placeholder="Google Meet, Zoom, or Room 4B"
          />

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="virtualCheck"
              checked={isVirtual}
              onChange={(e) => setIsVirtual(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-400"
            />
            <label htmlFor="virtualCheck" className="text-xs text-slate-700 font-medium">
              Include automatic virtual meeting room link
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Schedule Event
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
}

