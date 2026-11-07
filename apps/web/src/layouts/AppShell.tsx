import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { MobileNav } from './MobileNav';
import { CommandPalette } from './CommandPalette';
import { ToastContainer } from '@/components/ui/Toast';

export function AppShell() {
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden nexus-bg-mesh">
      {/* Persistent Desktop Sidebar */}
      <Sidebar />

      {/* Responsive Mobile Drawer */}
      <MobileNav
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {/* Main App Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Topbar matching reference design */}
        <Topbar
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onToggleMobileNav={() => setIsMobileNavOpen(true)}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 pb-12 pt-2">
          <Outlet />
        </main>
      </div>

      {/* Quick Search & Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* System Toasts */}
      <ToastContainer />
    </div>
  );
}

