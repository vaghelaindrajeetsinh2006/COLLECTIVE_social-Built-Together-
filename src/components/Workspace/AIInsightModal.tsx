import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Target, 
  ArrowRight, 
  ArrowLeft,
  Compass, 
  Copy, 
  Check, 
  TrendingUp, 
  Cpu,
  Layers,
  Lightbulb
} from 'lucide-react';
import { AIInsight, Collective } from '../../types/collective';

interface AIInsightModalProps {
  isOpen: boolean;
  onClose: () => void;
  collective: Collective;
  insight: AIInsight | null;
  isLoading: boolean;
}

export const AIInsightModal: React.FC<AIInsightModalProps> = ({
  isOpen,
  onClose,
  collective,
  insight,
  isLoading,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!insight) return;
    const text = `AI COLLECTIVE INSIGHT\nGroup Built: ${collective.title}\nFeasibility: ${insight.feasibilityScore}%\nImpact: ${insight.impactScore}%\nInnovation: ${insight.innovationScore}%\nPracticality: ${insight.practicalityScore}%\n\nNext Step: ${insight.recommendedNextStep}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-insight-title"
    >
      <div
        className="relative w-full max-w-3xl my-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 sm:p-9 text-neutral-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Architectural subtle ambient accent */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-neutral-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>AI COLLECTIVE INSIGHT</span>
            </div>
            <h2 id="ai-insight-title" className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-white uppercase">
              Reality Check &amp; Potential
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm mt-0.5">
              “Humans build the idea. AI helps understand its potential.”
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="return-from-ai-top-btn"
              onClick={onClose}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-mono transition cursor-pointer border border-neutral-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return</span>
            </button>
            <button
              id="close-ai-modal"
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
              aria-label="Close insight dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-16 text-center space-y-4">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-purple-400 animate-spin">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="font-display font-bold text-lg text-white">
              Evaluating Collective Topology...
            </div>
            <p className="text-neutral-400 text-xs max-w-sm mx-auto leading-relaxed font-mono">
              Parsing {collective.contributions.length} community perspectives, stress-test resolutions, and real-world viability metrics.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-mono transition inline-flex items-center gap-1.5 cursor-pointer border border-neutral-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cancel &amp; Return to Project</span>
            </button>
          </div>
        )}

        {/* Ready State */}
        {!isLoading && insight && (
          <div className="space-y-6 mt-6 animate-in fade-in duration-300">
            {/* Group Built Banner */}
            <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
                  YOUR GROUP BUILT:
                </span>
                <span className="font-display font-extrabold text-lg sm:text-xl text-white">
                  {collective.outcome?.finalConcept || collective.title}
                </span>
                <p className="text-xs text-neutral-400 mt-1 max-w-lg">
                  {insight.summary}
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-mono transition flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Share Report'}</span>
              </button>
            </div>

            {/* Metric Gauges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Feasibility */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                  FEASIBILITY
                </span>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-400">
                  {insight.feasibilityScore}%
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${insight.feasibilityScore}%` }} />
                </div>
              </div>

              {/* Potential Impact */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                  IMPACT
                </span>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-amber-400">
                  {insight.impactScore}%
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: `${insight.impactScore}%` }} />
                </div>
              </div>

              {/* Innovation */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                  INNOVATION
                </span>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-purple-400">
                  {insight.innovationScore}%
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-purple-400 rounded-full" style={{ width: `${insight.innovationScore}%` }} />
                </div>
              </div>

              {/* Practicality */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-center">
                <span className="text-[10px] font-mono uppercase text-neutral-400 block mb-1">
                  PRACTICALITY
                </span>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-sky-400">
                  {insight.practicalityScore}%
                </div>
                <div className="w-full h-1.5 bg-neutral-800 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-sky-400 rounded-full" style={{ width: `${insight.practicalityScore}%` }} />
                </div>
              </div>
            </div>

            {/* Best Use Cases */}
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 block mb-2 font-semibold">
                BEST REAL-WORLD USE CASES
              </span>
              <div className="flex flex-wrap gap-2">
                {insight.bestUseCases.map((useCase, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-neutral-950 border border-neutral-700 text-xs font-medium text-neutral-200"
                  >
                    {useCase}
                  </span>
                ))}
              </div>
            </div>

            {/* Strengths & Watch Out For (Side-by-side) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-emerald-500/20">
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-emerald-400 font-bold mb-3">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>KEY STRENGTHS</span>
                </div>
                <ul className="space-y-2 text-xs text-neutral-300">
                  {insight.strengths.map((str, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Watch Out For / Risks */}
              <div className="p-4 sm:p-5 rounded-2xl bg-neutral-950 border border-rose-500/20">
                <div className="flex items-center gap-1.5 text-xs font-mono uppercase text-rose-400 font-bold mb-3">
                  <AlertTriangle className="w-4 h-4" />
                  <span>WATCH OUT FOR (RISKS &amp; BOTTLENECKS)</span>
                </div>
                <ul className="space-y-2 text-xs text-neutral-300">
                  {insight.risksAndWeaknesses.map((risk, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Next Step */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-400/15 to-orange-400/10 border border-amber-400/40">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block mb-1">
                RECOMMENDED ACTIONABLE NEXT STEP
              </span>
              <p className="text-sm font-semibold text-white leading-relaxed">
                {insight.recommendedNextStep}
              </p>
            </div>

            {/* Bottom Return & Action Bar */}
            <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                id="return-to-project-btn"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs tracking-wider uppercase transition flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 active:scale-98 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
                <span>RETURN TO PROJECT / WORKSPACE</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-mono transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Share Report'}</span>
                </button>
              </div>
            </div>

            {/* Technical transparency note */}
            <div className="pt-2 text-center text-[11px] font-mono text-neutral-500">
              Collective evaluation simulation &bull; Deterministic evaluation of community perspective topology &bull; 100% Client-Side
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
