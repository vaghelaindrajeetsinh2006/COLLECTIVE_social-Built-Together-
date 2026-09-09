import React from 'react';
import { 
  GitMerge, 
  Lightbulb, 
  AlertTriangle, 
  Shuffle, 
  ThumbsUp, 
  Flame, 
  ShieldAlert, 
  Plus, 
  ArrowRight,
  Sparkles,
  Layers
} from 'lucide-react';
import { Collective, Contribution, InteractionActionType } from '../../types/collective';

interface PathwayListViewProps {
  collective: Collective;
  onSelectNodeAction: (action: InteractionActionType, parentNode: Contribution) => void;
  onVoteNode: (nodeId: string, voteType: 'endorse' | 'insightful' | 'challenge') => void;
  onAddNewIdea: () => void;
}

export const PathwayListView: React.FC<PathwayListViewProps> = ({
  collective,
  onSelectNodeAction,
  onVoteNode,
  onAddNewIdea,
}) => {
  const seedIdeas = collective.contributions.filter(c => c.type === 'idea' || !c.parentId);
  const builds = collective.contributions.filter(c => c.actionType === 'build' || c.type === 'improvement');
  const challenges = collective.contributions.filter(c => c.actionType === 'challenge' || c.type === 'concern');
  const remixes = collective.contributions.filter(c => c.actionType === 'remix' || c.type === 'alternative' || c.type === 'suggestion');

  return (
    <div className="space-y-8 py-4 max-w-5xl mx-auto">
      {/* Introduction */}
      <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold block">
            COLLABORATIVE PATHWAY ARCHITECTURE
          </span>
          <p className="text-xs text-neutral-400 mt-0.5">
            Ideas evolve through rigorous building, challenging assumptions, and synthesizing remixes into one shared outcome.
          </p>
        </div>
        <button
          onClick={onAddNewIdea}
          className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Plant New Seed</span>
        </button>
      </div>

      {/* Layer 1: Seed Ideas */}
      <div>
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-800">
          <div className="w-6 h-6 rounded bg-amber-400/20 text-amber-400 flex items-center justify-center text-xs font-mono font-bold">
            1
          </div>
          <h3 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-wider">
            FOUNDATIONAL SEED IDEAS ({seedIdeas.length})
          </h3>
        </div>

        {seedIdeas.length === 0 ? (
          <div className="p-8 rounded-xl bg-neutral-900/60 border border-dashed border-neutral-800 text-center">
            <p className="text-xs text-neutral-400 mb-3">No seed ideas have been planted in this collective yet.</p>
            <button
              onClick={onAddNewIdea}
              className="px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Plant First Seed Idea</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seedIdeas.map((idea) => (
              <div
                key={idea.id}
                className="p-4 sm:p-5 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-amber-400/40 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                      Seed Idea
                    </span>
                    <span className="text-[11px]">{idea.author.name}</span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-white">
                    {idea.title}
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
                    {idea.content}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5 text-xs">
                    <button
                      onClick={() => onVoteNode(idea.id, 'endorse')}
                      className="px-2 py-1 rounded bg-neutral-800 text-neutral-300 hover:text-white flex items-center gap-1 text-[11px] font-mono cursor-pointer"
                    >
                      <ThumbsUp className="w-2.5 h-2.5" />
                      <span>{idea.votes.endorse}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectNodeAction('build', idea)}
                      className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-[10px] font-mono font-semibold border border-emerald-500/30 transition cursor-pointer"
                    >
                      + BUILD
                    </button>
                    <button
                      onClick={() => onSelectNodeAction('challenge', idea)}
                      className="px-2 py-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[10px] font-mono font-semibold border border-rose-500/30 transition cursor-pointer"
                    >
                      ! CHALLENGE
                    </button>
                    <button
                      onClick={() => onSelectNodeAction('remix', idea)}
                      className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 text-[10px] font-mono font-semibold border border-purple-500/30 transition cursor-pointer"
                    >
                      ~ REMIX
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Layer 2: Builds & Enhancements */}
      {builds.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-800">
            <div className="w-6 h-6 rounded bg-emerald-400/20 text-emerald-400 flex items-center justify-center text-xs font-mono font-bold">
              2
            </div>
            <h3 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-wider">
              BUILDS &amp; IMPROVEMENTS ({builds.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {builds.map((build) => (
              <div
                key={build.id}
                className="p-4 sm:p-5 rounded-xl bg-neutral-900 border border-emerald-500/30 hover:border-emerald-500/60 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                      Build
                    </span>
                    <span className="text-[11px]">{build.author.name}</span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-white">
                    {build.title}
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
                    {build.content}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onVoteNode(build.id, 'endorse')}
                    className="px-2 py-1 rounded bg-neutral-800 text-neutral-300 hover:text-white flex items-center gap-1 text-[11px] font-mono cursor-pointer"
                  >
                    <ThumbsUp className="w-2.5 h-2.5" />
                    <span>{build.votes.endorse}</span>
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onSelectNodeAction('challenge', build)}
                      className="px-2 py-1 rounded bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 text-[10px] font-mono font-semibold border border-rose-500/30 transition cursor-pointer"
                    >
                      ! CHALLENGE
                    </button>
                    <button
                      onClick={() => onSelectNodeAction('remix', build)}
                      className="px-2 py-1 rounded bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 text-[10px] font-mono font-semibold border border-purple-500/30 transition cursor-pointer"
                    >
                      ⚡ REMIX
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Layer 3: Challenges & Stress-Tests */}
      {challenges.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-800">
            <div className="w-6 h-6 rounded bg-rose-400/20 text-rose-400 flex items-center justify-center text-xs font-mono font-bold">
              3
            </div>
            <h3 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-wider">
              CONSTRUCTIVE CHALLENGES &amp; TESTS ({challenges.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map((ch) => (
              <div
                key={ch.id}
                className="p-4 sm:p-5 rounded-xl bg-neutral-900 border border-rose-500/30 hover:border-rose-500/60 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-rose-400/10 text-rose-400 border border-rose-400/20">
                      Challenge &amp; Concern
                    </span>
                    <span className="text-[11px]">{ch.author.name}</span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-white">
                    {ch.title}
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
                    {ch.content}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onVoteNode(ch.id, 'insightful')}
                    className="px-2 py-1 rounded bg-neutral-800 text-neutral-300 hover:text-white flex items-center gap-1 text-[11px] font-mono cursor-pointer"
                  >
                    <Flame className="w-2.5 h-2.5 text-purple-400" />
                    <span>Vital Insight ({ch.votes.insightful})</span>
                  </button>
                  <button
                    onClick={() => onSelectNodeAction('remix', ch)}
                    className="px-3 py-1 rounded bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-xs font-mono font-bold border border-purple-500/40 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>SOLVE VIA REMIX</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Layer 4: Remixes & Convergences */}
      {remixes.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-800">
            <div className="w-6 h-6 rounded bg-purple-400/20 text-purple-400 flex items-center justify-center text-xs font-mono font-bold">
              4
            </div>
            <h3 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-wider">
              SYNTHESIZED REMIXES &amp; ALTERNATIVES ({remixes.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {remixes.map((remix) => (
              <div
                key={remix.id}
                className="p-4 sm:p-5 rounded-xl bg-neutral-900 border border-purple-500/30 hover:border-purple-500/60 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-purple-400/10 text-purple-400 border border-purple-400/20">
                      Remix &amp; Synthesis
                    </span>
                    <span className="text-[11px]">{remix.author.name}</span>
                  </div>
                  <h4 className="font-display font-bold text-sm text-white">
                    {remix.title}
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1.5 leading-relaxed">
                    {remix.content}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onVoteNode(remix.id, 'endorse')}
                    className="px-2 py-1 rounded bg-neutral-800 text-neutral-300 hover:text-white flex items-center gap-1 text-[11px] font-mono cursor-pointer"
                  >
                    <ThumbsUp className="w-2.5 h-2.5 text-amber-400" />
                    <span>Endorse ({remix.votes.endorse})</span>
                  </button>
                  <button
                    onClick={() => onSelectNodeAction('build', remix)}
                    className="px-3 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-xs font-mono font-bold border border-emerald-500/40 transition flex items-center gap-1 cursor-pointer"
                  >
                    <GitMerge className="w-3 h-3" />
                    <span>EXTEND REMIX</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
