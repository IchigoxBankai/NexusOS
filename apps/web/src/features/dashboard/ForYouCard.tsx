import { useState } from 'react';
import { ArrowUpRight, Compass, FileText, ShoppingBag, Plus, X } from 'lucide-react';
import type { ForYouItem, ForYouCategory } from '@nexus/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { useToastStore } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';

interface ForYouCardProps {
  items: ForYouItem[];
}

const CATEGORIES: ForYouCategory[] = ['Recent', 'Apps', 'News', 'Health', 'Finance', 'Events'];

export function ForYouCard({ items: initialItems }: ForYouCardProps) {
  const [items, setItems] = useState<ForYouItem[]>(initialItems);
  const [activeTab, setActiveTab] = useState<ForYouCategory>('Recent');
  const { addToast } = useToastStore();

  const handleAction = (itemId: string, actionKey: string, title: string) => {
    if (actionKey === 'cancel_order') {
      setItems((prev) => prev.filter((i) => i.id !== itemId));
      addToast({
        type: 'info',
        title: 'Order Cancelled',
        message: `Order for ${title} was removed.`,
      });
    } else if (actionKey === 'add_items') {
      addToast({
        type: 'info',
        title: 'Store Sync',
        message: 'Opening store catalog to add more items...',
      });
    } else {
      addToast({
        type: 'info',
        title: 'Item Opened',
        message: `Navigating to ${title}`,
      });
    }
  };

  const filteredItems = items.filter(
    (item) => activeTab === 'Recent' || item.category === activeTab
  );

  return (
    <Card variant="glass" className="flex flex-col h-full rounded-3xl">
      {/* Header */}
      <CardHeader className="p-6 pb-3">
        <div>
          <CardTitle className="text-xl font-medium text-slate-900">For you</CardTitle>
          <CardDescription className="text-xs text-slate-500 mt-0.5">
            What's going on around you
          </CardDescription>
        </div>

        <button
          onClick={() => {
            addToast({
              type: 'info',
              title: 'Activity Feed',
              message: 'Full cross-application activity log.',
            });
          }}
          className="w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-slate-200/60 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 transition-all hover:scale-105"
        >
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </CardHeader>

      {/* Category Filter Tabs matching reference image */}
      <div className="px-6 pb-4">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-medium transition-all shrink-0',
                activeTab === cat
                  ? 'bg-white text-slate-900 shadow-sm font-semibold'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Items List */}
      <CardContent className="flex-1 p-6 pt-0">
        {filteredItems.length === 0 ? (
          <EmptyState
            title={`No ${activeTab} items`}
            description="Your external apps, feeds and connected services haven't emitted new events."
            className="py-10"
          />
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white/95 rounded-2xl p-4 border border-slate-100 shadow-[0_2px_10px_-2px_rgba(90,105,143,0.06)] hover:border-slate-200/80 transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Icon container */}
                    <div className="relative w-8 h-8 rounded-xl bg-slate-100/80 flex items-center justify-center text-slate-600 shrink-0 shadow-xs">
                      {item.sourceApp === 'Nike' ? (
                        <>
                          <div className="absolute inset-0 rounded-xl border-2 border-indigo-400 border-t-transparent animate-spin opacity-40" />
                          <ShoppingBag className="w-4 h-4 text-slate-800" />
                        </>
                      ) : item.sourceApp === 'Chrome' ? (
                        <Compass className="w-4 h-4 text-blue-500" />
                      ) : (
                        <FileText className="w-4 h-4 text-slate-700" />
                      )}
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-slate-900 leading-snug group-hover:text-indigo-950 transition-colors">
                        {item.title}
                      </h4>
                      {item.subtitle && (
                        <p className="text-xs text-slate-400 mt-0.5">{item.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleAction(item.id, 'open', item.title)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100/60 transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Optional nested actions (e.g. for Nike order) */}
                {item.actions && item.actions.length > 0 && (
                  <div className="flex items-center gap-2 mt-3 pt-1">
                    {item.actions.map((act) => (
                      <button
                        key={act.id}
                        onClick={() => handleAction(item.id, act.actionKey, item.title)}
                        className="pill-action"
                      >
                        {act.actionKey === 'add_items' && <Plus className="w-3 h-3 text-slate-600" />}
                        {act.actionKey === 'cancel_order' && <X className="w-3 h-3 text-rose-500" />}
                        <span>{act.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

