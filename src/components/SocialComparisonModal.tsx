import React from 'react';
import { X, ArrowRight, CheckCircle2, XCircle, Sparkles, Target, Zap, ShieldCheck } from 'lucide-react';

interface SocialComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartCollective: () => void;
}

export const SocialComparisonModal: React.FC<SocialComparisonModalProps> = ({
  isOpen,
  onClose,
  onStartCollective,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-title"
    >
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-neutral-900 border border-neutral-800 shadow-2xl p-6 sm:p-8 text-neutral-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-neutral-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20 mb-2">
              <Sparkles className="w-3 h-3" />
              THE PARADIGM SHIFT
            </div>
            <h2 id="comparison-title" className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Why COLLECTIVE?
            </h2>
            <p className="text-neutral-400 text-sm mt-1">
              Social media was engineered for individual attention. COLLECTIVE is engineered for shared achievement.
            </p>
          </div>
          <button
            id="close-comparison-modal"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Side-by-side comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          {/* Legacy Social */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-rose-400 font-display font-semibold text-sm mb-3">
                <XCircle className="w-4 h-4" />
                <span>TRADITIONAL SOCIAL (FEEDS)</span>
              </div>
              <p className="text-xs text-neutral-400 mb-4">
                Designed to maximize screen time, dopamine spikes, and ego validation around isolated individuals.
              </p>

              <div className="space-y-2.5 font-mono text-xs text-neutral-300">
                <div className="p-2 rounded bg-neutral-900/80 border border-neutral-800/80 flex items-center justify-between">
                  <span>Unit: Solo Post</span>
                  <span className="text-neutral-500">Transient</span>
                </div>
                <div className="p-2 rounded bg-neutral-900/80 border border-neutral-800/80 flex items-center justify-between">
                  <span>Action: Passive Like & Scroll</span>
                  <span className="text-neutral-500">Low Effort</span>
                </div>
                <div className="p-2 rounded bg-neutral-900/80 border border-neutral-800/80 flex items-center justify-between">
                  <span>Dynamic: Outrage & Echo Chambers</span>
                  <span className="text-neutral-500">Polarizing</span>
                </div>
                <div className="p-2 rounded bg-neutral-900/80 border border-neutral-800/80 flex items-center justify-between">
                  <span>Outcome: Ephemeral Feed Dust</span>
                  <span className="text-rose-400/80">Zero Artifact</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-neutral-800 text-[11px] text-neutral-500">
              Flow: Post → Like → Comment → Follow → Scroll
            </div>
          </div>

          {/* COLLECTIVE */}
          <div className="rounded-xl border border-amber-400/30 bg-amber-400/[0.03] p-5 flex flex-col justify-between relative">
            <div className="absolute top-3 right-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-400/20 text-amber-300 border border-amber-400/40">
                Next-Gen
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-display font-semibold text-sm mb-3">
                <CheckCircle2 className="w-4 h-4" />
                <span>COLLECTIVE (CREATION ENGINE)</span>
              </div>
              <p className="text-xs text-neutral-300 mb-4">
                Organized around a shared mission where diverse minds combine, challenge, and shape one durable outcome.
              </p>

              <div className="space-y-2.5 font-mono text-xs text-neutral-200">
                <div className="p-2 rounded bg-neutral-900/90 border border-amber-400/20 flex items-center justify-between">
                  <span>Unit: Shared Collective</span>
                  <span className="text-amber-400">Collaborative</span>
                </div>
                <div className="p-2 rounded bg-neutral-900/90 border border-amber-400/20 flex items-center justify-between">
                  <span>Action: Build, Challenge, Remix</span>
                  <span className="text-amber-400">Generative</span>
                </div>
                <div className="p-2 rounded bg-neutral-900/90 border border-amber-400/20 flex items-center justify-between">
                  <span>Dynamic: Constructive Stress-Testing</span>
                  <span className="text-amber-400">Synthesizing</span>
                </div>
                <div className="p-2 rounded bg-neutral-900/90 border border-amber-400/20 flex items-center justify-between">
                  <span>Outcome: Shared Blueprint + AI Insight</span>
                  <span className="text-emerald-400 font-semibold">Real Impact</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-400/20 text-[11px] text-amber-300/80">
              Flow: Goal → Contribute → Build → Challenge → Remix → Result → AI Insight
            </div>
          </div>
        </div>

        {/* Philosophy Footer */}
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-neutral-300 text-center sm:text-left">
            <span className="font-semibold text-white">"Humans build the idea. AI helps understand its potential."</span>
            <p className="text-neutral-400 text-[11px] mt-0.5">
              Experience the power of collective intelligence without algorithmic feeds.
            </p>
          </div>
          <button
            id="modal-start-collective-btn"
            onClick={() => {
              onClose();
              onStartCollective();
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Start Building</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
