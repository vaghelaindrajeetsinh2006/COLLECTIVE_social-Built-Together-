import React, { useState, useMemo, useRef } from 'react';
import { 
  GitMerge, 
  Lightbulb, 
  AlertTriangle, 
  Shuffle, 
  CheckCircle2, 
  Sparkles, 
  Plus, 
  ThumbsUp, 
  Flame, 
  ShieldAlert, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Filter,
  X,
  ArrowDown
} from 'lucide-react';
import { Collective, Contribution, ContributionType, InteractionActionType } from '../../types/collective';

interface SpatialNetworkCanvasProps {
  collective: Collective;
  onSelectNodeAction: (action: InteractionActionType, parentNode: Contribution) => void;
  onVoteNode: (nodeId: string, voteType: 'endorse' | 'insightful' | 'challenge') => void;
  onOpenOutcome: () => void;
  onAddNewIdea: () => void;
}

const TYPE_CONFIG: Record<ContributionType, { label: string; bg: string; text: string; border: string; glow: string }> = {
  idea: { label: 'Seed Idea', bg: 'bg-amber-400/10', text: 'text-amber-400', border: 'border-amber-400/40', glow: 'shadow-amber-400/10' },
  improvement: { label: 'Build', bg: 'bg-emerald-400/10', text: 'text-emerald-400', border: 'border-emerald-400/40', glow: 'shadow-emerald-400/10' },
  alternative: { label: 'Remix', bg: 'bg-purple-400/10', text: 'text-purple-400', border: 'border-purple-400/40', glow: 'shadow-purple-400/10' },
  concern: { label: 'Challenge', bg: 'bg-rose-400/10', text: 'text-rose-400', border: 'border-rose-400/40', glow: 'shadow-rose-400/10' },
  evidence: { label: 'Evidence', bg: 'bg-sky-400/10', text: 'text-sky-400', border: 'border-sky-400/40', glow: 'shadow-sky-400/10' },
  suggestion: { label: 'Suggestion', bg: 'bg-indigo-400/10', text: 'text-indigo-400', border: 'border-indigo-400/40', glow: 'shadow-indigo-400/10' },
};

export const SpatialNetworkCanvas: React.FC<SpatialNetworkCanvasProps> = ({
  collective,
  onSelectNodeAction,
  onVoteNode,
  onOpenOutcome,
  onAddNewIdea,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [justVotedId, setJustVotedId] = useState<string | null>(null);

  // Layout calculations for canvas nodes
  const layout = useMemo(() => {
    const canvasWidth = 1050;
    const goalNode = {
      id: 'root-goal',
      x: canvasWidth / 2,
      y: 50,
      title: collective.goal,
      type: 'goal' as const,
    };

    // Partition contributions into hierarchical levels
    const ideas = collective.contributions.filter(c => c.type === 'idea' || !c.parentId);
    const children = collective.contributions.filter(c => c.parentId && c.type !== 'idea');

    // Position Ideas horizontally across Level 1
    const nodeCoords: Record<string, { x: number; y: number; level: number }> = {};
    const ideaSpacing = canvasWidth / (ideas.length + 1);

    ideas.forEach((idea, index) => {
      nodeCoords[idea.id] = {
        x: Math.round(ideaSpacing * (index + 1)),
        y: 190,
        level: 1,
      };
    });

    // Position Children (Builds, Challenges, Remixes) beneath their parents
    // Group children by parentId
    const childrenByParent: Record<string, Contribution[]> = {};
    children.forEach(child => {
      const pId = child.parentId || ideas[0]?.id || 'root-goal';
      if (!childrenByParent[pId]) childrenByParent[pId] = [];
      childrenByParent[pId].push(child);
    });

    // Assign positions
    Object.entries(childrenByParent).forEach(([parentId, childList]) => {
      const parentPos = nodeCoords[parentId] || { x: canvasWidth / 2, y: 190 };
      const spread = Math.min(220, (childList.length - 1) * 110);
      const startX = parentPos.x - spread / 2;

      childList.forEach((child, idx) => {
        const xOffset = childList.length === 1 ? 0 : (spread / (childList.length - 1)) * idx - spread / 2;
        const depth = child.actionType === 'remix' ? 510 : 350;
        nodeCoords[child.id] = {
          x: Math.max(120, Math.min(canvasWidth - 120, parentPos.x + xOffset)),
          y: depth,
          level: child.actionType === 'remix' ? 3 : 2,
        };
      });
    });

    // Result node at bottom
    const resultNode = {
      id: 'root-result',
      x: canvasWidth / 2,
      y: 640,
      title: collective.outcome?.finalConcept || 'Synthesized Collective Outcome',
      isReady: collective.contributions.length >= 3 && (collective.progress >= 85 || collective.stage === 'COMPLETE' || collective.stage === 'FINALIZING'),
    };

    return { goalNode, nodeCoords, resultNode, canvasWidth, canvasHeight: 740 };
  }, [collective]);

  // Edges/Connections
  const edges = useMemo(() => {
    const list: { from: { x: number; y: number; id: string }; to: { x: number; y: number; id: string }; type: string; id: string }[] = [];

    // Connect Goal to Seed Ideas
    const ideas = collective.contributions.filter(c => c.type === 'idea' || !c.parentId);
    ideas.forEach(idea => {
      const targetPos = layout.nodeCoords[idea.id];
      if (targetPos) {
        list.push({
          id: `goal-${idea.id}`,
          from: { x: layout.goalNode.x, y: layout.goalNode.y + 35, id: 'root-goal' },
          to: { x: targetPos.x, y: targetPos.y - 25, id: idea.id },
          type: 'goal-idea',
        });
      }
    });

    // Connect Parent Contributions to Child Contributions
    collective.contributions.forEach(child => {
      if (child.parentId && layout.nodeCoords[child.parentId] && layout.nodeCoords[child.id]) {
        const fromPos = layout.nodeCoords[child.parentId];
        const toPos = layout.nodeCoords[child.id];
        list.push({
          id: `${child.parentId}-${child.id}`,
          from: { x: fromPos.x, y: fromPos.y + 25, id: child.parentId },
          to: { x: toPos.x, y: toPos.y - 25, id: child.id },
          type: child.actionType || 'build',
        });
      }
    });

    // Connect lower nodes to Collective Result
    const lowestNodes = collective.contributions.filter(c => {
      const coords = layout.nodeCoords[c.id];
      return coords && coords.y >= 340;
    });

    lowestNodes.forEach(node => {
      const fromPos = layout.nodeCoords[node.id];
      if (fromPos) {
        list.push({
          id: `${node.id}-result`,
          from: { x: fromPos.x, y: fromPos.y + 25, id: node.id },
          to: { x: layout.resultNode.x, y: layout.resultNode.y - 30, id: 'root-result' },
          type: 'result-converge',
        });
      }
    });

    return list;
  }, [collective, layout]);

  const selectedNode = useMemo(() => {
    return collective.contributions.find(c => c.id === selectedNodeId) || null;
  }, [collective.contributions, selectedNodeId]);

  const handleVote = (voteType: 'endorse' | 'insightful' | 'challenge') => {
    if (!selectedNodeId) return;
    onVoteNode(selectedNodeId, voteType);
    setJustVotedId(selectedNodeId);
    setTimeout(() => setJustVotedId(null), 1000);
  };

  return (
    <div className="relative w-full rounded-2xl bg-neutral-950 border border-neutral-800/80 shadow-2xl overflow-hidden flex flex-col">
      {/* Top Canvas Toolbar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-neutral-900/80 border-b border-neutral-800 backdrop-blur-sm z-20 flex-wrap gap-2">
        {/* Filter by type */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono text-neutral-400 uppercase mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-amber-400" />
            Nodes:
          </span>
          {['ALL', 'idea', 'improvement', 'concern', 'alternative'].map((t) => {
            const isSelected = typeFilter === t;
            return (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono uppercase transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-neutral-950 font-bold'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {t === 'ALL' ? 'All' : t === 'idea' ? 'Ideas' : t === 'improvement' ? 'Builds' : t === 'concern' ? 'Challenges' : 'Remixes'}
              </button>
            );
          })}
        </div>

        {/* Canvas Controls: Zoom & Quick Add */}
        <div className="flex items-center gap-2">
          <button
            onClick={onAddNewIdea}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-semibold border border-amber-400/20 transition cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Plant Idea</span>
          </button>

          <div className="flex items-center rounded-lg bg-neutral-800 border border-neutral-700 p-0.5">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.7, prev - 0.1))}
              className="p-1 rounded text-neutral-400 hover:text-white transition cursor-pointer"
              title="Zoom out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-1.5 text-[10px] font-mono text-neutral-300">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
              className="p-1 rounded text-neutral-400 hover:text-white transition cursor-pointer"
              title="Zoom in"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 rounded text-neutral-400 hover:text-white transition cursor-pointer"
              title="Reset Zoom"
              aria-label="Reset zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div 
        ref={containerRef}
        className="relative w-full h-[620px] sm:h-[680px] overflow-auto bg-neutral-950 bg-blueprint-grid flex items-center justify-center p-4 select-none"
      >
        {/* Coordinator & Engine HUD telemetry strip */}
        <div className="absolute bottom-3 left-4 z-20 pointer-events-none hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-800/80 backdrop-blur-md text-[10px] font-mono text-neutral-400">
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span className="font-semibold">COORDINATOR HUD // LIVE CONSENSUS</span>
          </div>
          <span className="text-neutral-600">|</span>
          <span>STAGE: <span className="text-neutral-200 uppercase font-bold">{collective.stage}</span></span>
          <span className="text-neutral-600">|</span>
          <span>DISCUSSIONS: <span className="text-neutral-200 font-bold">{collective.contributions.length}</span></span>
          <span className="text-neutral-600">|</span>
          <span>PROGRESS: <span className="text-amber-400 font-bold">{collective.progress}%</span></span>
        </div>

        <div 
          className="relative transition-transform duration-200 origin-top"
          style={{
            width: `${layout.canvasWidth}px`,
            height: `${layout.canvasHeight}px`,
            transform: `scale(${zoomLevel})`,
          }}
        >
          {/* SVG Connection Layer */}
          <svg 
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox={`0 0 ${layout.canvasWidth} ${layout.canvasHeight}`}
          >
            <defs>
              <linearGradient id="edge-gradient-goal" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.3" />
              </linearGradient>
              <linearGradient id="edge-gradient-build" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="edge-gradient-challenge" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#fb7185" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="edge-gradient-remix" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="edge-gradient-result" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {edges.map((edge) => {
              const isHighlighted = 
                hoveredNodeId === edge.from.id || 
                hoveredNodeId === edge.to.id ||
                selectedNodeId === edge.from.id ||
                selectedNodeId === edge.to.id;

              // Smooth bezier curve
              const midY = (edge.from.y + edge.to.y) / 2;
              const pathD = `M ${edge.from.x} ${edge.from.y} C ${edge.from.x} ${midY}, ${edge.to.x} ${midY}, ${edge.to.x} ${edge.to.y}`;

              let stroke = '#525252';
              if (edge.type === 'goal-idea') stroke = 'url(#edge-gradient-goal)';
              else if (edge.type === 'challenge') stroke = 'url(#edge-gradient-challenge)';
              else if (edge.type === 'remix') stroke = 'url(#edge-gradient-remix)';
              else if (edge.type === 'build') stroke = 'url(#edge-gradient-build)';
              else if (edge.type === 'result-converge') stroke = 'url(#edge-gradient-result)';

              return (
                <g key={edge.id}>
                  {/* Background glow when hovered/active */}
                  {isHighlighted && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth={4}
                      strokeOpacity={0.4}
                    />
                  )}
                  {/* Active animated stroke */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={isHighlighted ? 2.5 : 1.8}
                    className={isHighlighted || edge.type === 'result-converge' ? 'animate-flow-line' : ''}
                    strokeOpacity={isHighlighted ? 1 : 0.65}
                  />
                </g>
              );
            })}
          </svg>

          {/* ROOT 1: SHARED GOAL NODE */}
          <div
            style={{
              left: `${layout.goalNode.x}px`,
              top: `${layout.goalNode.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
            className="absolute z-10 p-3 px-5 rounded-2xl bg-neutral-900 border-2 border-amber-400/80 shadow-lg shadow-amber-400/10 text-center max-w-sm transition-transform hover:scale-105"
          >
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase text-amber-400 font-bold mb-1">
              <Sparkles className="w-3 h-3" />
              <span>SHARED COLLECTIVE GOAL</span>
            </div>
            <div className="font-display font-bold text-xs sm:text-sm text-white line-clamp-2">
              {layout.goalNode.title}
            </div>
          </div>

          {/* CONTRIBUTION NODES */}
          {collective.contributions.map((contribution) => {
            const pos = layout.nodeCoords[contribution.id] || { x: layout.canvasWidth / 2, y: 300 };
            const typeConfig = TYPE_CONFIG[contribution.type] || TYPE_CONFIG.idea;
            const isSelected = selectedNodeId === contribution.id;
            const isHovered = hoveredNodeId === contribution.id;
            const isFilteredOut = typeFilter !== 'ALL' && contribution.type !== typeFilter;

            if (isFilteredOut) return null;

            return (
              <div
                key={contribution.id}
                id={`node-${contribution.id}`}
                onClick={() => setSelectedNodeId(isSelected ? null : contribution.id)}
                onMouseEnter={() => setHoveredNodeId(contribution.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                style={{
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute z-10 w-64 p-3.5 rounded-xl bg-neutral-900/95 border transition-all duration-200 cursor-pointer text-left shadow-lg ${
                  isSelected
                    ? `ring-2 ring-amber-400 border-amber-400 shadow-amber-400/20 scale-105 z-20`
                    : isHovered
                    ? `${typeConfig.border} scale-102 z-20`
                    : `border-neutral-800 hover:border-neutral-700`
                }`}
              >
                {/* Node Header */}
                <div className="flex items-center justify-between gap-1.5 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${typeConfig.bg} ${typeConfig.text} ${typeConfig.border}`}>
                    {typeConfig.label}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-neutral-400 font-mono">
                    <ThumbsUp className="w-2.5 h-2.5 text-amber-400" />
                    <span>{contribution.votes.endorse}</span>
                  </div>
                </div>

                {/* Node Title */}
                <h4 className="font-display font-bold text-xs sm:text-sm text-white line-clamp-2 leading-snug">
                  {contribution.title}
                </h4>

                {/* Content snippet */}
                <p className="mt-1 text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                  {contribution.content}
                </p>

                {/* Author & Action indicator */}
                <div className="mt-2.5 pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400">
                  <div className="flex items-center gap-1.5 truncate">
                    <img
                      src={contribution.author.avatar}
                      alt={contribution.author.name}
                      className="w-4 h-4 rounded-full object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <span className="truncate">{contribution.author.name}</span>
                  </div>
                  <span className="text-amber-400 text-[10px] font-mono hover:underline">
                    {isSelected ? 'Inspect ▲' : 'Open ▼'}
                  </span>
                </div>
              </div>
            );
          })}

          {/* EMPTY STATE IF NO CONTRIBUTIONS YET */}
          {collective.contributions.length === 0 && (
            <div
              style={{
                left: `${layout.canvasWidth / 2}px`,
                top: `340px`,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute z-10 w-96 p-6 rounded-2xl bg-neutral-900/90 border border-dashed border-amber-400/40 text-center shadow-2xl backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center mx-auto mb-3 text-amber-400">
                <Lightbulb className="w-6 h-6" />
              </div>
              <h4 className="font-display font-bold text-sm text-white mb-1">
                No Discussions Yet (0% Progress)
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed mb-4">
                This collective currently has zero contributions. Join as a builder and plant the first seed idea so the collective can start discussions and progress toward synthesis!
              </p>
              <button
                onClick={onAddNewIdea}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition inline-flex items-center gap-1.5 shadow-md shadow-amber-400/20 active:scale-98 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Plant First Seed Idea</span>
              </button>
            </div>
          )}

          {/* ROOT 2: COLLECTIVE RESULT CONVERGENCE NODE */}
          <div
            onClick={onOpenOutcome}
            style={{
              left: `${layout.resultNode.x}px`,
              top: `${layout.resultNode.y}px`,
              transform: 'translate(-50%, -50%)',
            }}
            className={`absolute z-10 p-4 px-6 rounded-2xl border-2 text-center max-w-md transition-all duration-300 cursor-pointer ${
              layout.resultNode.isReady
                ? 'bg-gradient-to-r from-purple-950/90 to-indigo-950/90 border-purple-400 shadow-xl shadow-purple-500/20 hover:scale-105 animate-pulse'
                : 'bg-neutral-900 border-dashed border-neutral-700 hover:border-neutral-500 opacity-80'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono uppercase text-purple-300 font-bold mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>COLLECTIVE OUTCOME CONVERGENCE</span>
            </div>
            <div className="font-display font-bold text-xs sm:text-sm text-white">
              {layout.resultNode.title}
            </div>
            <div className="mt-1 text-[10px] text-purple-200 font-mono">
              {collective.contributions.length < 3
                ? `Locked: Needs builder discussion (${collective.contributions.length}/3 contributions)`
                : layout.resultNode.isReady
                ? '✨ Click to Reveal Synthesized Outcome & AI Insight'
                : 'Building towards convergence...'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Node Inspector Drawer (when a node is clicked) */}
      {selectedNode && (
        <div className="border-t border-neutral-800 bg-neutral-900/95 p-4 sm:p-5 backdrop-blur-md z-30 transition-all animate-in slide-in-from-bottom duration-200">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            {/* Left: Node Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold border ${TYPE_CONFIG[selectedNode.type].bg} ${TYPE_CONFIG[selectedNode.type].text} ${TYPE_CONFIG[selectedNode.type].border}`}>
                  {TYPE_CONFIG[selectedNode.type].label}
                </span>
                <span className="text-xs text-neutral-400">
                  contributed by <strong className="text-neutral-200">{selectedNode.author.name}</strong> ({selectedNode.author.role})
                </span>
              </div>
              <h3 className="font-display font-bold text-base text-white">
                {selectedNode.title}
              </h3>
              <p className="text-xs text-neutral-300 mt-1 leading-relaxed max-w-3xl">
                {selectedNode.content}
              </p>

              {/* Voting buttons */}
              <div className="flex items-center gap-2 mt-3">
                <button
                  id={`vote-endorse-${selectedNode.id}`}
                  onClick={() => handleVote('endorse')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition cursor-pointer ${
                    selectedNode.userVote === 'endorse'
                      ? 'bg-amber-400 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
                  }`}
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>Endorse ({selectedNode.votes.endorse})</span>
                </button>

                <button
                  id={`vote-insightful-${selectedNode.id}`}
                  onClick={() => handleVote('insightful')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition cursor-pointer ${
                    selectedNode.userVote === 'insightful'
                      ? 'bg-purple-400 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
                  }`}
                >
                  <Flame className="w-3 h-3" />
                  <span>Insightful ({selectedNode.votes.insightful})</span>
                </button>

                <button
                  id={`vote-challenge-${selectedNode.id}`}
                  onClick={() => handleVote('challenge')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition cursor-pointer ${
                    selectedNode.userVote === 'challenge'
                      ? 'bg-rose-400 text-neutral-950 font-bold'
                      : 'bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700'
                  }`}
                >
                  <ShieldAlert className="w-3 h-3" />
                  <span>Needs Work ({selectedNode.votes.challenge})</span>
                </button>
              </div>
            </div>

            {/* Right: Core Collaborative Actions */}
            <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto shrink-0">
              <div className="text-[10px] font-mono text-neutral-400 uppercase">
                Shape this perspective:
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="action-build-btn"
                  onClick={() => onSelectNodeAction('build', selectedNode)}
                  className="flex-1 md:flex-initial px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <GitMerge className="w-3.5 h-3.5" />
                  <span>BUILD ON THIS</span>
                </button>

                <button
                  id="action-challenge-btn"
                  onClick={() => onSelectNodeAction('challenge', selectedNode)}
                  className="flex-1 md:flex-initial px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>CHALLENGE THIS</span>
                </button>

                <button
                  id="action-remix-btn"
                  onClick={() => onSelectNodeAction('remix', selectedNode)}
                  className="flex-1 md:flex-initial px-3 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>REMIX THIS</span>
                </button>

                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
                  title="Close inspector"
                  aria-label="Close inspector"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
