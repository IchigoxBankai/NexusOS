import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Briefcase,
  CheckSquare,
  FileText,
  Repeat,
  Target,
  CreditCard,
  Sparkles,
  BarChart2,
  Clock,
  Compass,
  Layers,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface ModulePlaceholderProps {
  moduleName: string;
  tagline: string;
  iconName: string;
  stage: string;
  plannedFeatures: { title: string; description: string }[];
}

const iconMap: Record<string, React.ElementType> = {
  CheckSquare,
  Briefcase,
  Calendar,
  FileText,
  Repeat,
  Target,
  CreditCard,
  Sparkles,
  BarChart2,
};

export function ModulePlaceholder({
  moduleName,
  tagline,
  iconName,
  stage,
  plannedFeatures,
}: ModulePlaceholderProps) {
  const navigate = useNavigate();
  const Icon = iconMap[iconName] || Layers;

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6">
      {/* Top Breadcrumb */}
      <div>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Command Center</span>
        </button>
      </div>

      {/* Main Header Glass Card */}
      <Card variant="glass" className="p-8 sm:p-10 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 shrink-0">
              <Icon className="w-8 h-8" />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold text-slate-900">{moduleName}</h1>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {stage}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-lg">{tagline}</p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
            leftIcon={<Compass className="w-3.5 h-3.5" />}
          >
            Command Center
          </Button>
        </div>

        {/* Intentional Placeholder Notice */}
        <div className="py-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>Architecture & Roadmap Specifications</span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed mb-6">
            In accordance with the Stage 1 Foundation architectural guidelines, this module is intentionally reserved for upcoming implementation phases. Its data schemas, types, and navigation routes are pre-registered in <code>@nexus/types</code> and <code>@nexus/shared</code>.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plannedFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="bg-white/90 rounded-2xl p-4 border border-slate-100/90 shadow-xs"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  <h4 className="text-xs font-semibold text-slate-800">{feat.title}</h4>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pl-3.5">
                  {feat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

