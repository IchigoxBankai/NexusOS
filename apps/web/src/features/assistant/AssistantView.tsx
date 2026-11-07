import { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  Check,
  Calendar,
  CheckSquare,
  Clock,
  Layers,
  FileText,
  Mic,
  RefreshCw,
  Cpu,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToastStore } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import type { AssistantMessage, AssistantActionProposal } from '@nexus/types';

const INITIAL_MESSAGES: AssistantMessage[] = [
  {
    id: 'msg_welcome',
    role: 'assistant',
    content: `Good day, Cassius. I have ingested your schedule, active tasks, financial cash flow, and knowledge vault across NEXUS.

Here is your ambient situational overview for today:
• **Focus Efficiency:** 2 hours and 30 minutes of deep work blocked without overlapping meetings.
• **Critical Deliverables:** High-throughput engine review and Figma feedback require your attention before 15:00.
• **Cash Flow Health:** Net cash flow is positive (+\$5,840) with budgets running at 78% of monthly allocation.

How would you like to direct your energy right now?`,
    timestamp: '09:00 AM',
    actions: [
      {
        id: 'act_1',
        type: 'schedule_meeting',
        title: 'Protect 90-min Deep Focus Block from 14:00 to 15:30',
        payload: { duration: 90, category: 'Deep Work' },
      },
      {
        id: 'act_2',
        type: 'create_task',
        title: 'Create Priority Task: Finalize Supabase RLS Schema for v1',
        payload: { priority: 'urgent', queue: 'Engineering' },
      },
    ],
  },
];

const SUGGESTED_PROMPTS = [
  'Generate today’s morning briefing & task prioritization',
  'Protect 90-minute deep work block for architecture',
  'Summarize recent notes from knowledge vault',
  'Review monthly budget burn and SaaS subscriptions',
];

export function AssistantView() {
  const [messages, setMessages] = useState<AssistantMessage[]>(INITIAL_MESSAGES);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [executedActions, setExecutedActions] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToastStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  const handleExecuteAction = (action: AssistantActionProposal) => {
    setExecutedActions((prev) => ({ ...prev, [action.id]: true }));
    addToast(`Action executed: "${action.title}"`, 'success');
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isGenerating) return;

    const userMsg: AssistantMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsGenerating(true);

    // Simulate smart autonomous agent reasoning and action generation
    setTimeout(() => {
      let replyContent = '';
      let replyActions: AssistantActionProposal[] | undefined = undefined;

      const lower = text.toLowerCase();
      if (lower.includes('briefing') || lower.includes('morning')) {
        replyContent = `### Today's Executive Briefing
1. **Top Priority:** Complete the architecture verification for the NEXUS multi-agent runtime.
2. **Calendar Buffer:** 2 meetings on schedule (Leadership sync at 10:00, Architecture review at 14:00).
3. **Streak Alert:** Your "Morning Deep Work Block" habit is on a 14-day streak.
4. **Suggested Next Action:** Protect an afternoon focus window and review pending PRs.`;
        replyActions = [
          {
            id: `act_${Date.now()}_1`,
            type: 'reorganize_day',
            title: 'Auto-arrange calendar buffer slots around 14:00 review',
            payload: {},
          },
        ];
      } else if (lower.includes('deep work') || lower.includes('focus') || lower.includes('protect')) {
        replyContent = `I have analyzed your calendar. Between 15:30 and 17:00, no meetings are scheduled. I can lock this in as an uninterrupted Deep Work slot and mute external notifications across Slack and Calendar.`;
        replyActions = [
          {
            id: `act_${Date.now()}_focus`,
            type: 'schedule_meeting',
            title: 'Confirm Deep Work Slot: 15:30 - 17:00',
            payload: { start: '15:30', end: '17:00' },
          },
        ];
      } else if (lower.includes('note') || lower.includes('vault') || lower.includes('summarize')) {
        replyContent = `Here is a synthesis of your top knowledge vault entries:
• **NEXUS System Architecture:** Emphasizes unified personal intelligence over isolated silos.
• **Design Philosophy:** Soft pastel aurora gradient mesh (#E1EDFB, #FBEBE8) with frosted glassmorphism and 16px blur.
• **Leadership Brief:** Key focus on Row Level Security and zero-friction navigation.`;
        replyActions = [
          {
            id: `act_${Date.now()}_note`,
            type: 'summarize_note',
            title: 'Export knowledge vault brief to clipboard',
            payload: {},
          },
        ];
      } else if (lower.includes('budget') || lower.includes('finance') || lower.includes('saas')) {
        replyContent = `Financial analysis completed:
• **Current Liquid Net Worth:** \$248,650.00 across 5 ledgers.
• **Highest Expense Category:** Housing & Utilities at \$2,650 (within 95% budget cap).
• **Cloud & AI Subscriptions:** Currently at \$320 of \$450 monthly allowance. Everything is within healthy thresholds.`;
      } else {
        replyContent = `Understood. I have evaluated your request against your current active state in NEXUS:

"${text}"

I have cross-checked this with your open queues and updated your contextual workspace memory. Would you like me to schedule a milestone task or adjust your daily calendar allocation?`;
        replyActions = [
          {
            id: `act_${Date.now()}_gen`,
            type: 'create_task',
            title: `Log as priority follow-up: "${text.slice(0, 40)}..."`,
            payload: { note: text },
          },
        ];
      }

      const assistantMsg: AssistantMessage = {
        id: `asst_${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: replyActions,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsGenerating(false);
    }, 900);
  };

  return (
    <div className="space-y-6 animate-fade-in flex flex-col h-[calc(100vh-140px)]">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-display font-medium text-slate-900 tracking-tight flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </span>
            NEXUS AI Autonomous Copilot
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Proactive personal operating system intelligence, schedule synthesis, and automated action execution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Agent Engine Online
          </div>
        </div>
      </div>

      {/* Main Conversation Container */}
      <Card className="flex-1 flex flex-col backdrop-blur-xl bg-white/80 border-slate-200/80 shadow-sm rounded-3xl overflow-hidden min-h-0">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          {messages.map((msg) => {
            const isAsst = msg.role === 'assistant';

            return (
              <div
                key={msg.id}
                className={cn('flex gap-3 md:gap-4 max-w-4xl', !isAsst && 'ml-auto flex-row-reverse')}
              >
                {/* Avatar */}
                <div
                  className={cn(
                    'w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm',
                    isAsst
                      ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white border-purple-200'
                      : 'bg-slate-900 text-white border-slate-700'
                  )}
                >
                  {isAsst ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                </div>

                {/* Message Body */}
                <div className={cn('space-y-3 max-w-[85%]', !isAsst && 'text-right')}>
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-700">
                      {isAsst ? 'NEXUS Copilot' : 'You'}
                    </span>
                    <span>• {msg.timestamp}</span>
                  </div>

                  <div
                    className={cn(
                      'p-4 md:p-5 rounded-3xl text-sm leading-relaxed whitespace-pre-line text-left',
                      isAsst
                        ? 'bg-white border border-slate-200/70 text-slate-800 shadow-sm'
                        : 'bg-slate-900 text-white rounded-tr-none'
                    )}
                  >
                    {msg.content}
                  </div>

                  {/* Action Proposals rendered inside message */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="space-y-2 pt-1 text-left">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Autonomous Action Proposals
                      </span>
                      <div className="space-y-2">
                        {msg.actions.map((act) => {
                          const isDone = executedActions[act.id];

                          return (
                            <div
                              key={act.id}
                              className={cn(
                                'p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 text-xs',
                                isDone
                                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                                  : 'bg-slate-50/90 border-slate-200/80 text-slate-800 hover:border-indigo-300'
                              )}
                            >
                              <div className="flex items-center gap-2.5">
                                {act.type === 'schedule_meeting' ? (
                                  <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                                ) : act.type === 'create_task' ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                                ) : (
                                  <Clock className="w-4 h-4 text-purple-500 shrink-0" />
                                )}
                                <span className="font-medium">{act.title}</span>
                              </div>

                              <button
                                onClick={() => !isDone && handleExecuteAction(act)}
                                disabled={isDone}
                                className={cn(
                                  'px-3 py-1.5 rounded-full font-medium transition-all shrink-0 flex items-center gap-1.5',
                                  isDone
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-900 hover:bg-slate-800 text-white shadow-sm'
                                )}
                              >
                                {isDone ? (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    Executed
                                  </>
                                ) : (
                                  <>
                                    <span>Execute</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isGenerating && (
            <div className="flex gap-4 max-w-4xl">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-tr from-purple-600 to-indigo-600 text-white border border-purple-200">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className="p-4 rounded-3xl bg-white border border-slate-200/70 text-slate-500 text-xs flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-600" />
                Synthesizing multi-agent memory & scheduling actions...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestions Bar */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">Suggested:</span>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="px-3 py-1.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/80 text-xs whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Interactive Chat Input Box */}
        <div className="p-3 md:p-4 border-t border-slate-200/60 bg-white/90 backdrop-blur-md shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask NEXUS to schedule meetings, triage tasks, or synthesize vaults..."
                className="w-full pl-4 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => addToast('Voice transcription active...', 'info')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-purple-600 transition-colors"
                title="Voice Input"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>

            <Button
              type="submit"
              disabled={!inputPrompt.trim() || isGenerating}
              className="rounded-2xl px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white shadow-sm flex items-center gap-2 text-sm shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

