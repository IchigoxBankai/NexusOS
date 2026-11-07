import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Layers,
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
} from 'lucide-react';
import { NEXUS_NAV_ITEMS, NEXUS_SECONDARY_NAV_ITEMS } from '@nexus/shared';
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

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Drawer content */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 280 }}
            className="relative w-72 max-w-[85vw] h-full bg-white/95 backdrop-blur-2xl shadow-2xl flex flex-col z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 h-20 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
                  <Layers className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm tracking-wider uppercase text-slate-900">
                  NEXUS
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Links */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 pb-2">
                Modules
              </div>
              {NEXUS_NAV_ITEMS.map((item) => {
                const Icon = iconMap[item.iconName] || LayoutGrid;

                return (
                  <NavLink
                    key={item.key}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all',
                        isActive
                          ? 'bg-indigo-50 text-indigo-900 font-semibold shadow-xs'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      )
                    }
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                    {item.isPlanned && (
                      <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">
                        Preview
                      </span>
                    )}
                  </NavLink>
                );
              })}

              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-2 pt-4 pb-2">
                System
              </div>
              {NEXUS_SECONDARY_NAV_ITEMS.map((item) => {
                const Icon = iconMap[item.iconName] || Settings;

                return (
                  <NavLink
                    key={item.key}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all',
                        isActive
                          ? 'bg-indigo-50 text-indigo-900 font-semibold'
                          : 'text-slate-600 hover:bg-slate-50'
                      )
                    }
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
