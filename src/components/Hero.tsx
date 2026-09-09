import React from 'react';
import { 
  Users, 
  Lightbulb, 
  GitMerge, 
  Award, 
  ArrowRight, 
  Sparkles, 
  Compass, 
  CheckCircle2 
} from 'lucide-react';

interface HeroProps {
  onStartCollective: () => void;
  onExploreCollectives: () => void;
  totalCollectives: number;
  totalBuilders: number;
  totalContributions: number;
}

export const Hero: React.FC<HeroProps> = ({
  onStartCollective,
  onExploreCollectives,
  totalCollectives,
  totalBuilders,
  totalContributions,
}) => {
  return (
    <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-neutral-800/60">
      {/* Subtle architectural background accents */}
      <div className="absolute inset-0 bg-spatial-grid opacity-35 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-900 border border-neutral-700 text-amber-400 mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span>REIMAGINING SOCIAL INTERACTION</span>
          </div>

          {/* Primary Hero Title */}
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase leading-[1.08]">
            Social, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-orange-400">
              Built Together.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="mt-6 text-lg sm:text-xl text-neutral-300 font-normal leading-relaxed max-w-2xl mx-auto">
            A place where people don't just share ideas — <br className="hidden sm:inline" />
            <span className="text-white font-medium">they shape them together.</span>
          </p>

          {/* Core Taglines */}
          <p className="mt-2 text-xs sm:text-sm text-neutral-400 font-mono">
            “Don’t just share ideas. Shape them with people.”
          </p>

          {/* Primary CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              id="hero-start-btn"
              onClick={onStartCollective}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-sm tracking-wide transition shadow-lg shadow-amber-400/20 hover:shadow-amber-400/30 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>START A COLLECTIVE</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              id="hero-explore-btn"
              onClick={onExploreCollectives}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white font-semibold text-sm border border-neutral-700/80 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>EXPLORE COLLECTIVES</span>
            </button>
          </div>
        </div>

        {/* Visual Explanation: PEOPLE ↓ IDEAS ↓ COLLABORATION ↓ SHARED OUTCOME */}
        <div className="mt-14 sm:mt-18 max-w-4xl mx-auto">
          <div className="p-5 sm:p-7 rounded-2xl bg-neutral-900/70 border border-neutral-800 backdrop-blur-sm shadow-xl">
            <div className="flex items-center justify-between mb-5 border-b border-neutral-800 pb-3">
              <span className="text-xs uppercase tracking-widest font-mono text-neutral-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                HOW THE PARADIGM EVOLVES
              </span>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                Beyond The Feed
              </span>
            </div>

            {/* Step sequence */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 relative">
              {/* Step 1: PEOPLE */}
              <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800/80 text-center hover:border-amber-400/40 transition group">
                <div className="w-9 h-9 mx-auto rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                  <Users className="w-4 h-4" />
                </div>
                <div className="font-display font-bold text-sm text-white">PEOPLE</div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  Gather around a shared challenge, not an influencer.
                </div>
              </div>

              {/* Step 2: IDEAS */}
              <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800/80 text-center hover:border-amber-400/40 transition group">
                <div className="w-9 h-9 mx-auto rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div className="font-display font-bold text-sm text-white">IDEAS</div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  Plant foundational seeds instead of isolated clickbait posts.
                </div>
              </div>

              {/* Step 3: COLLABORATION */}
              <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800/80 text-center hover:border-amber-400/40 transition group">
                <div className="w-9 h-9 mx-auto rounded-lg bg-neutral-800 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition-transform">
                  <GitMerge className="w-4 h-4" />
                </div>
                <div className="font-display font-bold text-sm text-white">COLLABORATION</div>
                <div className="text-[11px] text-neutral-400 mt-1">
                  Build on, challenge assumptions, and remix variations.
                </div>
              </div>

              {/* Step 4: SHARED OUTCOME */}
              <div className="p-3.5 rounded-xl bg-gradient-to-b from-amber-400/10 to-transparent border border-amber-400/40 text-center group">
                <div className="w-9 h-9 mx-auto rounded-lg bg-amber-400 text-neutral-950 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-md shadow-amber-400/20">
                  <Award className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div className="font-display font-bold text-sm text-amber-300">SHARED OUTCOME</div>
                <div className="text-[11px] text-neutral-300 mt-1">
                  Synthesize one unified result + AI Collective Insight.
                </div>
              </div>
            </div>

            {/* Subtle subtext */}
            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-2">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Zero algorithmic feeds &bull; Zero attention farming &bull; 100% Shared ownership</span>
              </span>
              <span className="font-mono text-[11px] text-neutral-500">
                “Humans build the idea. AI helps understand its potential.”
              </span>
            </div>
          </div>
        </div>

        {/* Live Metrics strip */}
        <div className="mt-8 max-w-3xl mx-auto grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2.5 rounded-lg bg-neutral-900/40 border border-neutral-800/60">
            <span className="block font-display font-bold text-base sm:text-lg text-white">
              {totalCollectives}
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">Active Collectives</span>
          </div>
          <div className="p-2.5 rounded-lg bg-neutral-900/40 border border-neutral-800/60">
            <span className="block font-display font-bold text-base sm:text-lg text-amber-400">
              {totalBuilders}
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">Connected Builders</span>
          </div>
          <div className="p-2.5 rounded-lg bg-neutral-900/40 border border-neutral-800/60">
            <span className="block font-display font-bold text-base sm:text-lg text-emerald-400">
              {totalContributions}
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">Peer Contributions</span>
          </div>
        </div>
      </div>
    </section>
  );
};
