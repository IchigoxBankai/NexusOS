import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Bot, Cpu } from 'lucide-react';
import { Card } from '@/components/ui/Card';

export function AiAssistantIntroCard() {
  const navigate = useNavigate();

  return (
    <Card
      variant="glass"
      className="p-6 rounded-3xl relative overflow-hidden bg-gradient-to-r from-white/90 via-indigo-50/40 to-purple-50/40 border-indigo-100/80 mb-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-slate-900">
                NEXUS AI Copilot
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                Foundational Engine
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-xl mt-1 leading-relaxed">
              An autonomous intelligence designed to prioritize your daily queues, cross-reference calendar bottlenecks, summarize knowledge vault entries, and suggest high-leverage actions.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-indigo-500" />
                Autonomous Agents
              </span>
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-purple-500" />
                Cross-Module Synthesis
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate('/assistant')}
          className="self-start md:self-center flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
        >
          <span>Explore AI Copilot</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </Card>
  );
}
