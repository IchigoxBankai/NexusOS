import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutGrid,
  CheckSquare,
  Briefcase,
  Calendar,
  FileText,
  Repeat,
  Target,
  CreditCard,
  Sparkles,
  BarChart2,
  Settings,
  User,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { NEXUS_NAV_ITEMS, NEXUS_SECONDARY_NAV_ITEMS } from '@nexus/shared';
import type { NexusNavigationItem } from '@nexus/types';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  LayoutGrid,
  CheckSquare,
  Briefcase,
  Calendar,
  FileText,
  Repeat,
  Target,
  CreditCard,
  Sparkles,
  BarChart2,
  Settings,
  User,
};

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'relative hidden md:flex flex-col h-screen transition-all duration-300 z-30 select-none',
        'border-r border-white/60 bg-white/70 backdrop-blur-2xl shadow-[4px_0_24px_rgba(112,128,176,0.04)]',
        isCollapsed ? 'w-[78px]' : 'w-[240px]',
        className
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 h-20 border-b border-slate-100/60">
        <NavLink to="/dashboard" className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
            <Layers className="w-4 h-4" />
          </div>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col whitespace-nowrap"
            >
              <span className="font-bold text-sm tracking-wider text-slate-900 uppercase">
                NEXUS
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Personal OS</span>
            </motion.div>
          )}
        </NavLink>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100/70 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Navigation Items */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-2 pb-2">
          {!isCollapsed && (
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
              Core Modules
            </span>
          )}
        </div>

        {NEXUS_NAV_ITEMS.map((item: NexusNavigationItem) => {
          const Icon = iconMap[item.iconName] || LayoutGrid;

          return (
            <NavLink
              key={item.key}
              to={item.path}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium transition-all group relative',
                  isActive
                    ? 'bg-white text-indigo-900 shadow-sm shadow-slate-200/50 font-semibold'
                    : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-400 group-hover:text-slate-700'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {!isCollapsed && (
                    <span className="flex-1 truncate">{item.label}</span>
                  )}

                  {!isCollapsed && item.isPlanned && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-400 font-normal">
                      Preview
                    </span>
                  )}

                  {!isCollapsed && item.badge && !item.isPlanned && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Secondary Navigation (Settings & Profile) */}
      <div className="p-3 border-t border-slate-100/70 space-y-1">
        {NEXUS_SECONDARY_NAV_ITEMS.map((item: NexusNavigationItem) => {
          const Icon = iconMap[item.iconName] || Settings;

          return (
            <NavLink
              key={item.key}
              to={item.path}
              title={isCollapsed ? item.label : undefined}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-medium transition-all group',
                  isActive
                    ? 'bg-white text-indigo-900 shadow-sm font-semibold'
                    : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      'w-7 h-7 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-slate-400 group-hover:text-slate-700'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  {!isCollapsed && <span className="flex-1 truncate">{item.label}</span>}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
}

