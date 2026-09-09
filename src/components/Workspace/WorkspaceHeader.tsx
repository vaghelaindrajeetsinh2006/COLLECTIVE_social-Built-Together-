import React, { useState } from 'react';
import { 
  ArrowLeft, 
  GitMerge, 
  Sparkles, 
  Plus, 
  Layers, 
  Network, 
  CheckCircle2, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Zap, 
  Share2,
  Award,
  Check,
  Lock,
  LogOut
} from 'lucide-react';
import { Collective, CollectiveStage } from '../../types/collective';
import { CollectivePulse } from './CollectivePulse';

interface WorkspaceHeaderProps {
  collective: Collective;
  activeView: 'canvas' | 'pathway';
  onChangeView: (view: 'canvas' | 'pathway') => void;
  onOpenAddContribution: () => void;
  onOpenOutcome: () => void;
  onToggleJoin: () => void;
  onOpenInvite: () => void;
  onAdvanceStage: (newStage: CollectiveStage) => void;
  onBack: () => void;
}

const STAGES: CollectiveStage[] = ['FORMING', 'BUILDING', 'REFINING', 'FINALIZING', 'COMPLETE'];

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  collective,
  activeView,
  onChangeView,
  onOpenAddContribution,
  onOpenOutcome,
  onToggleJoin,
  onOpenInvite,
  onAdvanceStage,
  onBack,
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const currentStageIndex = STAGES.indexOf(collective.stage);
  const isCompleted = collective.stage === 'COMPLETE';
  const isJoined = collective.isUserJoined;

  return (
    <div className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top bar: Breadcrumb, Stage progress, Quick actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Back & Title info */}
          <div className="flex items-start gap-3">
            <button
              onClick={onBack}
              className="mt-1 p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
              aria-label="Back to all collectives"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded border border-amber-400/20">
                  {collective.category}
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  {collective.participantCount} builders &bull; {collective.contributions.length} contributions
                </span>
              </div>
              <h1 className="font-display text-xl sm:text-2xl font-extrabold text-white mt-1">
                {collective.title}
              </h1>
            </div>
          </div>

          {/* Right: Primary action buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* View Switcher: Spatial Canvas vs Pathway */}
            <div className="flex items-center p-1 rounded-xl bg-neutral-900 border border-neutral-800">
              <button
                id="view-canvas-btn"
                onClick={() => onChangeView('canvas')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                  activeView === 'canvas'
                    ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Network className="w-3.5 h-3.5 text-amber-400" />
                <span>Spatial Canvas</span>
              </button>
              <button
                id="view-pathway-btn"
                onClick={() => onChangeView('pathway')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition cursor-pointer ${
                  activeView === 'pathway'
                    ? 'bg-neutral-800 text-white font-semibold shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>Pathway Layers</span>
              </button>
            </div>

            {/* Share / Invite Builders */}
            <button
              id="workspace-invite-btn"
              onClick={onOpenInvite}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 text-amber-400 hover:text-amber-300 border border-neutral-800 hover:border-amber-400/40 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Share invite link or add co-builders"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Invite / Share</span>
            </button>

            {/* Join / Leave Community Toggle */}
            {isJoined ? (
              <div className="flex items-center gap-1.5">
                <div 
                  className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 flex items-center gap-1.5"
                  title="You are an active co-builder in this collective"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Builder Active</span>
                </div>
                <button
                  id="workspace-leave-community-btn"
                  onClick={onToggleJoin}
                  className="px-2.5 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-rose-300 hover:bg-rose-500/15 hover:border-rose-500/30 border border-neutral-800 transition flex items-center gap-1.5 cursor-pointer"
                  title="Leave this collective community"
                  aria-label="Leave this collective community"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span>Leave</span>
                </button>
              </div>
            ) : (
              <button
                id="workspace-join-toggle"
                onClick={onToggleJoin}
                className="px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800"
              >
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Join as Builder</span>
              </button>
            )}

            {/* Add Contribution */}
            <button
              id="workspace-add-contribution-btn"
              onClick={onOpenAddContribution}
              className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-400/20 active:scale-98 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Contribute</span>
            </button>

            {/* View Outcome / Finalize CTA */}
            <button
              id="workspace-view-outcome-btn"
              onClick={onOpenOutcome}
              title={
                collective.contributions.length < 3
                  ? `Discussion required: ${collective.contributions.length}/3 contributions discussed so far. Add perspectives with co-builders before synthesizing.`
                  : 'Synthesize collaborative outcome'
              }
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                collective.contributions.length < 3
                  ? 'bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 border border-neutral-800'
                  : isCompleted || collective.stage === 'FINALIZING'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white shadow-md shadow-purple-500/20'
                  : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700'
              }`}
            >
              {collective.contributions.length < 3 ? (
                <Lock className="w-3.5 h-3.5 text-neutral-400" />
              ) : (
                <Award className="w-3.5 h-3.5" />
              )}
              <span>
                {collective.contributions.length < 3
                  ? `Synthesize (${collective.contributions.length}/3 Perspectives)`
                  : isCompleted
                  ? 'View Outcome & AI'
                  : 'Synthesize Outcome'}
              </span>
            </button>
          </div>
        </div>

        {/* Collective pulse: makes the new social interaction model measurable */}
        <CollectivePulse collective={collective} />

        {/* Goal summary bar & Details toggler */}
        <div className="mt-3.5 pt-3 border-t border-neutral-800/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-300 font-medium">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-amber-300/90 font-mono uppercase text-[11px] font-semibold">SHARED GOAL:</span>
            <span className="text-neutral-200">{collective.goal}</span>
          </div>

          <button
            onClick={() => setIsDetailsOpen(!isDetailsOpen)}
            className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 hover:text-white transition cursor-pointer self-start md:self-auto"
          >
            <span>{isDetailsOpen ? 'Hide Challenge Context' : 'View Challenge & Constraints'}</span>
            {isDetailsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Expandable Challenge Details */}
        {isDetailsOpen && (
          <div className="mt-3 p-4 rounded-xl bg-neutral-900/90 border border-neutral-800 text-xs text-neutral-300 space-y-2 animate-in fade-in duration-150">
            <div>
              <span className="font-mono text-neutral-400 uppercase text-[10px] block mb-0.5">Problem Statement:</span>
              <p className="text-neutral-200 leading-relaxed">{collective.challengeDescription}</p>
            </div>
            {collective.constraints && (
              <div>
                <span className="font-mono text-neutral-400 uppercase text-[10px] block mb-0.5">Constraints:</span>
                <p className="text-neutral-400">{collective.constraints}</p>
              </div>
            )}
            <div>
              <span className="font-mono text-neutral-400 uppercase text-[10px] block mb-0.5">Target Deliverable:</span>
              <p className="text-amber-300">{collective.desiredOutcome}</p>
            </div>
          </div>
        )}

        {/* Stage Progression Flow */}
        <div className="mt-4 pt-3 border-t border-neutral-800/60">
          <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
            <span className="text-[10px] font-mono text-neutral-500 uppercase shrink-0">Stage Progress:</span>
            <div className="flex items-center gap-1 sm:gap-2 flex-1 max-w-2xl mx-auto">
              {STAGES.map((stage, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                return (
                  <button
                    key={stage}
                    onClick={() => onAdvanceStage(stage)}
                    title={`Click to switch stage to ${stage}`}
                    className={`flex-1 py-1 px-2 rounded-md text-[10px] sm:text-[11px] font-mono font-semibold uppercase tracking-wider transition flex items-center justify-center gap-1 cursor-pointer ${
                      isCurrent
                        ? 'bg-amber-400 text-neutral-950 shadow-sm'
                        : isPassed
                        ? 'bg-neutral-900 text-emerald-400 border border-emerald-400/20 hover:bg-neutral-800'
                        : 'bg-neutral-900/60 text-neutral-500 border border-neutral-800 hover:text-neutral-300'
                    }`}
                  >
                    {isPassed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    <span className="truncate">{stage}</span>
                  </button>
                );
              })}
            </div>
            <div className="shrink-0 text-[11px] font-mono text-neutral-400">
              <span className="text-amber-400 font-bold">{collective.progress}%</span> complete
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
