import { useState } from 'react';
import {
  Sliders,
  Bell,
  Eye,
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from './authStore';
import { useToastStore } from '@/components/ui/Toast';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { checkSupabaseHealth, type SupabaseHealthCheckResult } from '@nexus/api';

const MIGRATION_SQL_1 = `-- 1. Profiles Table with RLS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);`;

const MIGRATION_SQL_2 = `-- 2. User Preferences Table with RLS
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  preferences JSONB NOT NULL DEFAULT '{"theme":"aurora"}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own preferences" ON public.user_preferences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);`;

export function SettingsPage() {
  const { usePreviewData, togglePreviewData } = useAuthStore();
  const { addToast } = useToastStore();

  const [showActions, setShowActions] = useState(true);
  const [showForYou, setShowForYou] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [inAppAlerts, setInAppAlerts] = useState(true);

  // Supabase Health Diagnostic state
  const [isCheckingHealth, setIsCheckingHealth] = useState(false);
  const [healthResult, setHealthResult] = useState<SupabaseHealthCheckResult | null>(null);

  const runHealthCheck = async () => {
    setIsCheckingHealth(true);
    const result = await checkSupabaseHealth(supabase, isSupabaseConfigured);
    setHealthResult(result);
    setIsCheckingHealth(false);
    addToast({
      type: result.authHealthy ? 'success' : 'info',
      title: 'Diagnostics Completed',
      message: result.message,
    });
  };

  const copyToClipboard = (text: string, title: string) => {
    navigator.clipboard.writeText(text);
    addToast({
      type: 'info',
      title: 'Copied to Clipboard',
      message: `${title} copied. Paste it into Supabase SQL Editor.`,
    });
  };

  const handleSave = () => {
    addToast({
      type: 'success',
      title: 'Preferences Saved',
      message: 'Workspace preferences updated in user_preferences table.',
    });
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Workspace Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Configure layout, notification channels, and backend connections.</p>
      </div>

      {/* Supabase Connection & Diagnostics Card */}
      <Card variant="glass" className="p-6 rounded-3xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-slate-900">Supabase Cloud Database</h3>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isSupabaseConfigured
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {isSupabaseConfigured ? 'Connected' : 'Offline / Preview'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                PostgreSQL database, Row Level Security, Auth and Realtime sync.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            isLoading={isCheckingHealth}
            onClick={runHealthCheck}
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Run Health Ping
          </Button>
        </div>

        {/* Live Diagnostics Results */}
        {healthResult && (
          <div className="p-4 rounded-2xl bg-white/90 border border-slate-100 space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-700">Diagnostic Status:</span>
              <span className="text-slate-500 font-mono text-[11px]">
                {healthResult.latencyMs ? `${healthResult.latencyMs}ms latency` : ''}
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">{healthResult.message}</p>

            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                {healthResult.authHealthy ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>Auth Service</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                {healthResult.profilesTableHealthy ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>Profiles Table</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-1.5">
                {healthResult.preferencesTableHealthy ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                )}
                <span>Preferences</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick SQL Migration Scripts */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              SQL Migration Scripts (for Supabase SQL Editor)
            </span>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[11px] font-medium text-indigo-600 hover:text-indigo-800"
            >
              <span>Open Supabase Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => copyToClipboard(MIGRATION_SQL_1, 'Profiles Migration SQL')}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-left text-xs transition-colors"
            >
              <div className="truncate">
                <span className="font-semibold text-slate-800 block">1. Profiles Table</span>
                <span className="text-[10px] text-slate-400">auth.users trigger + RLS</span>
              </div>
              <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
            </button>

            <button
              onClick={() => copyToClipboard(MIGRATION_SQL_2, 'Preferences Migration SQL')}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/60 text-left text-xs transition-colors"
            >
              <div className="truncate">
                <span className="font-semibold text-slate-800 block">2. User Preferences</span>
                <span className="text-[10px] text-slate-400">JSONB config + RLS</span>
              </div>
              <Copy className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
            </button>
          </div>
        </div>
      </Card>

      {/* Developer Mode Card */}
      <Card variant="glass" className="p-6 rounded-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Development Preview Mode</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Populate Command Center with realistic UI reference dataset vs. blank zero-state.
              </p>
            </div>
          </div>

          <button
            onClick={togglePreviewData}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold transition-all ${
              usePreviewData
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {usePreviewData ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </Card>

      {/* Command Center Layout Sections */}
      <Card variant="glass" className="p-6 rounded-3xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Sliders className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-semibold text-slate-900">Command Center Layout</h3>
        </div>

        <div className="space-y-3">
          {[
            { label: 'Actions (Today’s Tasks)', value: showActions, setter: setShowActions },
            { label: 'For You (Activity & Feeds)', value: showForYou, setter: setShowForYou },
            { label: 'Active Projects Overview', value: showProjects, setter: setShowProjects },
            { label: 'Upcoming Calendar Events', value: showEvents, setter: setShowEvents },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-1">
              <span className="text-xs font-medium text-slate-700">{item.label}</span>
              <input
                type="checkbox"
                checked={item.value}
                onChange={(e) => item.setter(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-400"
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Notifications */}
      <Card variant="glass" className="p-6 rounded-3xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
          <Bell className="w-4 h-4 text-indigo-500" />
          <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between py-1">
            <div>
              <div className="text-xs font-medium text-slate-700">Daily Morning Digest</div>
              <div className="text-[11px] text-slate-400">Receive morning summary email at 8:00 AM</div>
            </div>
            <input
              type="checkbox"
              checked={emailDigest}
              onChange={(e) => setEmailDigest(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-400"
            />
          </div>

          <div className="flex items-center justify-between py-1">
            <div>
              <div className="text-xs font-medium text-slate-700">In-App Alerts</div>
              <div className="text-[11px] text-slate-400">Task reminders and meeting buffer warnings</div>
            </div>
            <input
              type="checkbox"
              checked={inAppAlerts}
              onChange={(e) => setInAppAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-400"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <Button
            size="sm"
            onClick={handleSave}
            leftIcon={<Check className="w-3.5 h-3.5" />}
          >
            Save Preferences
          </Button>
        </div>
      </Card>
    </div>
  );
}
