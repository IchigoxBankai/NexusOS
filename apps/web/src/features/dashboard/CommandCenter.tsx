import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Sparkles, Info, EyeOff, Eye } from 'lucide-react';
import { nexusQueryKeys } from '@nexus/api';
import { dashboardService } from '@/lib/services';
import { useAuthStore } from '@/features/auth/authStore';
import { WelcomeBanner } from './WelcomeBanner';
import { DailyOverview } from './DailyOverview';
import { QuickActionsBar } from './QuickActionsBar';
import { ActionsCard } from './ActionsCard';
import { ForYouCard } from './ForYouCard';
import { ActiveProjectsCard } from './ActiveProjectsCard';
import { UpcomingEventsCard } from './UpcomingEventsCard';
import { HabitsCard } from './HabitsCard';
import { GoalsCard } from './GoalsCard';
import { AiAssistantIntroCard } from './AiAssistantIntroCard';
import { CreateTaskDialog } from './CreateTaskDialog';
import { Skeleton } from '@/components/ui/Skeleton';
import { ErrorState } from '@/components/ui/ErrorState';
import { CommandPalette } from '@/layouts/CommandPalette';
import type { ActionItem } from '@nexus/types';

export function CommandCenter() {
  const { user, profile, usePreviewData, togglePreviewData } = useAuthStore();
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [...nexusQueryKeys.dashboard.commandCenter(user?.id), usePreviewData],
    queryFn: async () => {
      return dashboardService.getCommandCenterData({
        userId: user?.id,
        usePreviewSample: usePreviewData,
        userFullName: profile?.full_name || undefined,
      });
    },
    staleTime: 60000,
  });

  const handleTaskCreated = (newTask: ActionItem) => {
    queryClient.setQueryData(
      [...nexusQueryKeys.dashboard.commandCenter(user?.id), usePreviewData],
      (old: typeof data) => {
        if (!old) return old;
        return {
          ...old,
          actions: [newTask, ...old.actions],
          stats: {
            ...old.stats,
            pendingTasksCount: old.stats.pendingTasksCount + 1,
          },
        };
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-7xl mx-auto py-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-64 rounded-2xl" />
          <Skeleton className="h-6 w-36 rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-80 rounded-3xl" />
          <Skeleton className="h-80 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="max-w-xl mx-auto pt-16">
        <ErrorState
          title="Command Center Unavailable"
          message="Could not load your daily Command Center overview. Check connection settings."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Explicit Developer Preview Indicator as required by section 4 */}
      <div className="flex items-center justify-between px-4 py-2 rounded-2xl bg-white/70 border border-white/60 shadow-xs text-xs text-slate-600 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-indigo-500 shrink-0" />
          <span>
            {usePreviewData ? (
              <>
                <strong className="text-slate-800">Development Preview Environment:</strong>{' '}
                Populated with UI reference design sample data.
              </>
            ) : (
              <>
                <strong className="text-slate-800">Authentic Empty State:</strong> Zero
                fabricated user data loaded.
              </>
            )}
          </span>
        </div>

        <button
          onClick={togglePreviewData}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium transition-colors text-[11px]"
        >
          {usePreviewData ? (
            <>
              <EyeOff className="w-3.5 h-3.5" />
              <span>Switch to Empty State</span>
            </>
          ) : (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>View Reference Sample Preview</span>
            </>
          )}
        </button>
      </div>

      {/* 1. Personalized Welcome Section & 2. Date */}
      <WelcomeBanner greeting={data.greeting} />

      {/* 3. Daily Overview */}
      <DailyOverview stats={data.stats} />

      {/* 10. Quick Action Area */}
      <QuickActionsBar
        onOpenCreateTask={() => setIsCreateTaskOpen(true)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Primary Side-by-Side Cards (4. Today's tasks section & For You section) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Actions Card matching reference image */}
        <ActionsCard
          actions={data.actions}
          onOpenCreateTask={() => setIsCreateTaskOpen(true)}
          onRefresh={() => refetch()}
        />

        {/* For You Card matching reference image */}
        <ForYouCard items={data.forYouItems} />
      </div>

      {/* 9. AI Assistant Introduction */}
      <AiAssistantIntroCard />

      {/* Secondary Dashboard Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 6. Active Projects Section */}
        <ActiveProjectsCard projects={data.activeProjects} />

        {/* 5. Upcoming Events Section */}
        <UpcomingEventsCard events={data.upcomingEvents} />
      </div>

      {/* Tertiary Dashboard Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 7. Habit Overview Placeholder */}
        <HabitsCard habits={data.habits} />

        {/* 8. Goal Progress Placeholder */}
        <GoalsCard goals={data.goals} />
      </div>

      {/* Create Task Modal */}
      <CreateTaskDialog
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
        onTaskCreated={handleTaskCreated}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}

