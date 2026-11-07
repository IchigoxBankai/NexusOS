import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowUpRight, Video, Users } from 'lucide-react';
import type { UpcomingEventSummary } from '@nexus/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToastStore } from '@/components/ui/Toast';

interface UpcomingEventsCardProps {
  events: UpcomingEventSummary[];
}

export function UpcomingEventsCard({ events }: UpcomingEventsCardProps) {
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  return (
    <Card variant="glass" className="rounded-3xl">
      <CardHeader className="p-6 pb-4">
        <div>
          <CardTitle className="text-lg font-medium text-slate-900">Upcoming Events</CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            Today's schedule & meetings
          </CardDescription>
        </div>

        <button
          onClick={() => navigate('/calendar')}
          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-slate-200/60 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </CardHeader>

      <CardContent className="p-6 pt-0">
        {events.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-5 h-5 text-indigo-500" />}
            title="No events today"
            description="Your schedule is completely clear for the day. Perfect for deep focus work."
            actionLabel="Schedule Event"
            onAction={() => navigate('/calendar')}
            className="py-8"
          />
        ) : (
          <div className="space-y-3">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="bg-white/95 rounded-2xl p-3.5 border border-slate-100 shadow-[0_2px_10px_-2px_rgba(90,105,143,0.06)] flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50/80 text-blue-600 flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold uppercase leading-none">
                      {evt.startTime.split(' ')[0]}
                    </span>
                    <span className="text-[9px] text-blue-400 font-medium">
                      {evt.startTime.split(' ')[1]}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 group-hover:text-blue-900 transition-colors">
                      {evt.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                      <span>{evt.startTime} – {evt.endTime}</span>
                      {evt.location && <span>• {evt.location}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {evt.participantsCount && (
                    <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-400 px-2 py-0.5 rounded-full bg-slate-50">
                      <Users className="w-3 h-3" />
                      {evt.participantsCount}
                    </span>
                  )}
                  {evt.isVirtual && (
                    <button
                      onClick={() => {
                        addToast({
                          type: 'info',
                          title: 'Connecting to Meeting',
                          message: `Joining virtual meeting: ${evt.title}`,
                        });
                      }}
                      className="pill-action bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      <Video className="w-3 h-3 text-blue-600" />
                      <span>Join</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

