import { useState, useRef } from 'react';
import {
  User,
  Clock,
  Shield,
  Check,
  Globe,
  Camera,
  Upload,
  Trash2,
  ImageIcon,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
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
  const [avatarUrl, setAvatarUrl] = useState<string | null>(profile?.avatar_url || null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress & convert selected file to optimized avatar data URL
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      addToast({
        type: 'error',
        title: 'Unsupported File',
        message: 'Please choose an image file (PNG, JPG, WEBP).',
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          setAvatarUrl(compressedDataUrl);
          addToast({
            type: 'info',
            title: 'Photo Selected',
            message: 'Preview loaded. Click "Save Profile Changes" to persist.',
          });
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemovePhoto = () => {
    setAvatarUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    addToast({
      type: 'info',
      title: 'Photo Cleared',
      message: 'Avatar reset to default initials.',
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const result = await updateProfile({
      full_name: fullName,
      timezone,
      avatar_url: avatarUrl,
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
        <p className="text-xs text-slate-500 mt-1">Manage your identity, photo avatar, and regional preferences.</p>
      </div>

      <Card variant="glass" className="p-8 rounded-3xl">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar Chooser Section */}
          <div className="pb-6 border-b border-slate-100">
            <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-3">
              Profile Photo
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              {/* Interactive Avatar Preview */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative group cursor-pointer self-start shrink-0"
                title="Click to choose image from folder"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-white shadow-md relative">
                  <Avatar size="xl" name={fullName || 'User'} src={avatarUrl} className="w-20 h-20 text-xl" />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-sm border-2 border-white">
                  <Camera className="w-3 h-3" />
                </div>
              </div>

              {/* Action Buttons & Drag Drop zone */}
              <div className="flex-1 space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp, image/gif, image/heic"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="flex flex-wrap items-center gap-2.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    leftIcon={<Upload className="w-3.5 h-3.5 text-indigo-600" />}
                  >
                    Choose Photo from Folder
                  </Button>

                  {avatarUrl && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={handleRemovePhoto}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                    >
                      Remove Photo
                    </Button>
                  )}
                </div>

                {/* Drag and drop target */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-3 rounded-2xl border border-dashed transition-all cursor-pointer text-center ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-white/40'
                  }`}
                >
                  <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>Or drag and drop any image file here (PNG, JPG, WEBP)</span>
                  </p>
                </div>
              </div>
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
              label="Timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              leftIcon={<Globe className="w-4 h-4" />}
              helperText="Determines time formatting across Command Center and Smart Calendar."
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
