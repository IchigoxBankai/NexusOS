import { useState } from 'react';
import { User, Clock, Shield, Check, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useAuthStore } from './authStore';
import { useToastStore } from '@/components/ui/Toast';

export function ProfilePage() {
  const { profile, user, updateProfile } = useAuthStore();
  const { addToast } = useToastStore();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [timezone, setTimezone] = useState(profile?.timezone || 'UTC');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const result = await updateProfile({
      full_name: fullName,
      timezone,
      avatar_url: avatarUrl || null,
    });
    setIsSaving(false);

    if (result.success) {
      addToast({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your personal profile changes have been saved.',
      });
    } else {
      addToast({
        type: 'error',
        title: 'Update Failed',
        message: result.error || 'Could not update profile',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Account Profile</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your identity, avatar, and regional preferences.</p>
      </div>

      <Card variant="glass" className="p-8 rounded-3xl">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar & Header */}
          <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
            <Avatar size="xl" name={fullName || 'User'} src={avatarUrl} />
            <div>
              <h3 className="text-base font-semibold text-slate-900">{fullName || 'NEXUS User'}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
              <span className="inline-block mt-2 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                Verified Account
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your Name"
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Avatar Image URL (Optional)"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://example.com/avatar.jpg"
              helperText="Paste a public HTTPS link to your profile photo."
            />

            <Input
              label="Timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              leftIcon={<Globe className="w-4 h-4" />}
            />

            {/* Read-only system metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs text-slate-500">
                <span className="block font-semibold text-slate-700 mb-0.5 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-500" />
                  Account ID
                </span>
                <span className="font-mono text-[11px] truncate block">{user?.id}</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-100 text-xs text-slate-500">
                <span className="block font-semibold text-slate-700 mb-0.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  Member Since
                </span>
                <span>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Active'}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <Button
              type="submit"
              size="sm"
              isLoading={isSaving}
              leftIcon={<Check className="w-3.5 h-3.5" />}
            >
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
