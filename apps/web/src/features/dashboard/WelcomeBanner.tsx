import { useAuthStore } from '@/features/auth/authStore';

interface WelcomeBannerProps {
  greeting: string;
}

export function WelcomeBanner({ greeting }: WelcomeBannerProps) {
  const { profile } = useAuthStore();
  const displayName = profile?.full_name ? profile.full_name.split(' ')[0] : 'Cassius';

  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
      <div>
        <h1 className="text-2xl sm:text-3xl font-normal tracking-tight text-slate-900">
          {greeting}, <span className="font-semibold text-slate-900">{displayName}</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Here is your personal overview across apps, active tasks, and schedules.
        </p>
      </div>
    </div>
  );
}
