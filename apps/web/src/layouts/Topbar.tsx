import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic,
  Sparkles,
  Bell,
  Menu,
  Eye,
  EyeOff,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown } from '@/components/ui/Dropdown';
import { useAuthStore } from '@/features/auth/authStore';
import { useToastStore } from '@/components/ui/Toast';

interface TopbarProps {
  onOpenCommandPalette: () => void;
  onToggleMobileNav: () => void;
}

export function Topbar({ onOpenCommandPalette, onToggleMobileNav }: TopbarProps) {
  const { profile, user, logout, usePreviewData, togglePreviewData } = useAuthStore();
  const { addToast } = useToastStore();
  const navigate = useNavigate();

  // Dynamic live time display
  const [currentTime, setCurrentTime] = useState<string>('Tue 2 May 09:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = now.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      }) + ' ' + now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setCurrentTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been safely logged out of NEXUS.',
    });
    navigate('/login');
  };

  const profileMenuItems = [
    {
      id: 'profile-name',
      label: profile?.full_name || user?.email || 'NEXUS User',
      onClick: () => navigate('/profile'),
      icon: <User className="w-3.5 h-3.5" />,
    },
    {
      id: 'settings',
      label: 'Preferences & Settings',
      onClick: () => navigate('/settings'),
      icon: <Settings className="w-3.5 h-3.5" />,
    },
    {
      id: 'preview-toggle',
      label: usePreviewData ? 'Switch to Empty State' : 'Switch to Sample Preview',
      onClick: () => {
        togglePreviewData();
        addToast({
          type: 'info',
          title: usePreviewData ? 'Empty State Activated' : 'Sample Preview Activated',
          message: usePreviewData
            ? 'Viewing Command Center in pure blank zero-state.'
            : 'Viewing Command Center with realistic UI reference dataset.',
        });
      },
      icon: usePreviewData ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />,
      divider: true,
    },
    {
      id: 'logout',
      label: 'Log out',
      onClick: handleLogout,
      icon: <LogOut className="w-3.5 h-3.5" />,
      danger: true,
      divider: true,
    },
  ];

  return (
    <header className="sticky top-0 z-20 w-full px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Menu Toggle + Assistant / Global Search Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="md:hidden p-2 rounded-2xl bg-white/80 border border-slate-200/80 text-slate-600 hover:text-slate-900 shadow-sm"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Global Voice / Prompt Pill (Directly from reference image) */}
        <div
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/85 hover:bg-white border border-white/80 shadow-[0_2px_12px_rgba(112,128,176,0.06)] hover:shadow-md cursor-pointer transition-all duration-150 backdrop-blur-md group"
        >
          <div className="w-6 h-6 rounded-full bg-slate-100 group-hover:bg-indigo-50 flex items-center justify-center text-slate-500 group-hover:text-indigo-600 transition-colors">
            <Mic className="w-3.5 h-3.5" />
          </div>

          <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 pr-1">
            How can I help?
          </span>

          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100/90 px-1.5 py-0.5 rounded-md border border-slate-200/60">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right: Date/Time + AI Sparkle + Notification Bell + Avatar */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live Date and Time matching reference image "Tue 2 May 09:41" */}
        <div className="hidden sm:flex items-center text-xs font-medium text-slate-600 tracking-tight">
          <span>{currentTime}</span>
        </div>

        {/* AI Copilot Sparkle Pill / Button */}
        <button
          onClick={() => navigate('/assistant')}
          title="NEXUS AI Assistant"
          className="w-8 h-8 rounded-full bg-white/85 hover:bg-white border border-white/80 shadow-sm flex items-center justify-center text-indigo-600 hover:text-indigo-700 hover:scale-105 transition-all"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Notifications Icon */}
        <button
          onClick={() => {
            addToast({
              type: 'info',
              title: 'Notifications',
              message: 'No unread notifications at this time.',
            });
          }}
          title="Notifications"
          className="relative w-8 h-8 rounded-full bg-white/85 hover:bg-white border border-white/80 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 ring-2 ring-white" />
        </button>

        {/* User Profile Dropdown */}
        <Dropdown
          align="right"
          trigger={
            <div className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-indigo-200 transition-all">
              <Avatar
                size="md"
                name={profile?.full_name || 'Cassius'}
                src={profile?.avatar_url}
              />
            </div>
          }
          items={profileMenuItems}
        />
      </div>
    </header>
  );
}

