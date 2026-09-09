import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Award, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  GitMerge, 
  ShieldCheck, 
  Compass, 
  Copy, 
  Check, 
  Layers,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { Collective, CollectiveOutcome } from '../../types/collective';

interface CollectiveResultViewProps {
  collective: Collective;
  outcome: CollectiveOutcome;
  onAnalyzeWithAI: () => void;
  onBackToCanvas: () => void;
}

export const CollectiveResultView: React.FC<CollectiveResultViewProps> = ({
  collective,
  outcome,
  onAnalyzeWithAI,
  onBackToCanvas,
}) => {
  const [copied, setCopied] = React.useState(false);

  // Trigger celebration confetti on reveal
  useEffect(() => {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      confetti({
        particleCount: 55,
        spread: 62,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#f59e0b', '#34d399', '#a855f7', '#60a5fa'],
      });
    } catch {
      // Graceful fallback if canvas confetti is unavailable.
    }
  }, []);

  const handleCopyOutcome = () => {
    const text = `COLLECTIVE OUTCOME: ${outcome.finalConcept}\n\n${outcome.executiveSummary}\n\nDeliverable: ${outcome.finalOutcomeDeliverable}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="py-8 max-w-5xl mx-auto px-4 sm:px-6 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToCanvas}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Workspace Canvas</span>
        </button>

        <button
          id="trigger-ai-analysis-btn"
          onClick={onAnalyzeWithAI}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs tracking-wider uppercase transition shadow-lg shadow-purple-500/20 active:scale-98 flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>ANALYZE THIS COLLECTIVE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Hero Achievement Card */}
      <div className="relative rounded-3xl bg-gradient-to-b from-amber-400/15 via-neutral-900 to-neutral-950 border-2 border-amber-400/40 p-6 sm:p-10 text-center overflow-hidden shadow-2xl">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-400/20 text-amber-300 border border-amber-400/40 mb-4">
            <Award className="w-3.5 h-3.5" />
            <span>COLLECTIVE SYNTHESIS REACHED</span>
          </div>

          {/* Primary Achievement Statement */}
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold tracking-tight text-white uppercase leading-tight">
            YOU BUILT THIS TOGETHER.
          </h1>

          <p className="mt-3 text-sm sm:text-base text-neutral-300 font-medium leading-relaxed">
            {outcome.headline}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-amber-400" />
              {collective.participantCount} Co-Builders
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <GitMerge className="w-4 h-4 text-emerald-400" />
              {collective.contributions.length} Contributions &amp; Remixes
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              Consensus Approved
            </span>
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold mb-2">
          <Zap className="w-4 h-4" />
          <span>Executive Concept Summary</span>
        </div>
        <h3 className="font-display text-xl sm:text-2xl font-bold text-white mb-3">
          {outcome.finalConcept}
        </h3>
        <p className="text-sm text-neutral-300 leading-relaxed">
          {outcome.executiveSummary}
        </p>

        {/* Deliverable Specification box */}
        <div className="mt-6 p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono uppercase text-neutral-500 block">Published Artifact:</span>
            <span className="text-xs sm:text-sm font-mono text-emerald-400 font-semibold">
              {outcome.finalOutcomeDeliverable}
            </span>
          </div>
          <button
            onClick={handleCopyOutcome}
            className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono flex items-center gap-1.5 transition cursor-pointer shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Artifact'}</span>
          </button>
        </div>
      </div>

      {/* Three Core Pillars */}
      <div>
        <h3 className="font-display font-bold text-lg text-white mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-400" />
          <span>Synthesized Core Pillars</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {outcome.corePillars.map((pillar, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
              <div>
                <div className="w-7 h-7 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center text-xs font-mono font-bold mb-3">
                  0{idx + 1}
                </div>
                <h4 className="font-display font-bold text-base text-white">
                  {pillar.title}
                </h4>
                <p className="text-xs text-neutral-400 mt-2 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              {pillar.derivedFrom.length > 0 && (
                <div className="mt-4 pt-3 border-t border-neutral-800/80 text-[10px] text-neutral-500 font-mono">
                  <span>Derived from: </span>
                  <span className="text-neutral-400">{pillar.derivedFrom[0]}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Key Decisions & Challenges Resolved */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Decisions */}
        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6">
          <h3 className="font-display font-bold text-base text-white mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Consensus Decisions Reached</span>
          </h3>
          <div className="space-y-3">
            {outcome.keyDecisions.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
                <div className="text-xs font-semibold text-white">{item.decision}</div>
                <div className="text-[11px] text-neutral-400 mt-1">{item.rationale}</div>
                <div className="mt-2 text-[10px] font-mono text-amber-400/90">
                  Champion: {item.champion}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Challenges Resolved */}
        <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6">
          <h3 className="font-display font-bold text-base text-white mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Challenges &amp; Assumptions Resolved</span>
          </h3>
          <div className="space-y-3">
            {outcome.challengesResolved.map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
                <div className="text-[10px] font-mono uppercase text-rose-400">Tension Raised:</div>
                <div className="text-xs font-medium text-neutral-200">{item.challenge}</div>
                <div className="mt-2 text-[10px] font-mono uppercase text-emerald-400">Community Resolution:</div>
                <div className="text-[11px] text-neutral-400">{item.solution}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hall of Builders */}
      <div className="rounded-2xl bg-neutral-900 border border-neutral-800 p-6">
        <h3 className="font-display font-bold text-base text-white mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-amber-400" />
          <span>The Builders Who Shaped This</span>
        </h3>
        <p className="text-xs text-neutral-400 mb-4">
          Every perspective contributed to the final architecture.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {collective.participants.map((p) => (
            <div key={p.id} className="p-3 rounded-xl bg-neutral-950 border border-neutral-800/80 flex items-center gap-2.5">
              <img
                src={p.avatar}
                alt={p.name}
                className="w-8 h-8 rounded-full object-cover shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="truncate">
                <div className="text-xs font-semibold text-white truncate">{p.name}</div>
                <div className="text-[10px] text-neutral-500 truncate">{p.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Final CTA: AI Collective Insight */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-purple-950/40 border border-purple-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-semibold block">
            NEXT STEP IN THE PARADIGM
          </span>
          <h3 className="font-display text-lg sm:text-xl font-bold text-white mt-0.5">
            Test against reality with AI Collective Insight
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-xl">
            Humans build the idea. AI provides an objective reality check on feasibility, real-world impact, edge-case risks, and tactical next steps.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
          <button
            onClick={onBackToCanvas}
            className="px-4 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono transition flex items-center gap-2 cursor-pointer border border-neutral-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Canvas</span>
          </button>
          <button
            onClick={onAnalyzeWithAI}
            className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs tracking-wider uppercase transition flex items-center gap-2 shrink-0 shadow-lg shadow-amber-400/20 active:scale-98 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>ANALYZE THIS COLLECTIVE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
