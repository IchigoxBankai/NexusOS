import { useState } from 'react';
import { Settings, Sliders, Bell, Eye, EyeOff, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from './authStore';
import { useToastStore } from '@/components/ui/Toast';

export function SettingsPage() {
  const { usePreviewData, togglePreviewData } = useAuthStore();
  const { addToast } = useToastStore();

  const [showActions, setShowActions] = useState(true);
  const [showForYou, setShowForYou] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [inAppAlerts, setInAppAlerts] = useState(true);

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
        <p className="text-xs text-slate-500 mt-1">Configure layout, notification channels, and developer flags.</p>
      </div>

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

