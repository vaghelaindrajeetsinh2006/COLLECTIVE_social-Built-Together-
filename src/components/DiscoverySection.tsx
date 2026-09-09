import React, { useState, useMemo } from 'react';
import { 
  Users, 
  GitMerge, 
  Search, 
  ArrowRight, 
  Check, 
  Filter, 
  Sparkles, 
  Layers, 
  Clock,
  Compass,
  Zap,
  Share2,
  LogOut
} from 'lucide-react';
import { Collective, CollectiveStage } from '../types/collective';

interface DiscoverySectionProps {
  collectives: Collective[];
  onSelectCollective: (collective: Collective) => void;
  onToggleJoin: (collectiveId: string, e: React.MouseEvent) => void;
  onOpenInvite: (collective: Collective, e: React.MouseEvent) => void;
  onStartCollective: () => void;
}

const STAGE_COLORS: Record<CollectiveStage, { bg: string; text: string; border: string }> = {
  FORMING: { bg: 'bg-sky-500/10', text: 'text-sky-400', border: 'border-sky-500/30' },
  BUILDING: { bg: 'bg-amber-400/10', text: 'text-amber-400', border: 'border-amber-400/30' },
  REFINING: { bg: 'bg-indigo-400/10', text: 'text-indigo-400', border: 'border-indigo-400/30' },
  FINALIZING: { bg: 'bg-purple-400/10', text: 'text-purple-400', border: 'border-purple-400/30' },
  COMPLETE: { bg: 'bg-emerald-400/10', text: 'text-emerald-400', border: 'border-emerald-400/30' },
};

export const DiscoverySection: React.FC<DiscoverySectionProps> = ({
  collectives,
  onSelectCollective,
  onToggleJoin,
  onOpenInvite,
  onStartCollective,
}) => {
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    collectives.forEach(c => set.add(c.category));
    return ['ALL', ...Array.from(set)];
  }, [collectives]);

  // Filtered collectives
  const filteredCollectives = useMemo(() => {
    return collectives.filter(c => {
      const matchStage = selectedStage === 'ALL' || c.stage === selectedStage;
      const matchCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
      const matchQuery = 
        searchQuery.trim() === '' ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.goal.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.challengeDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStage && matchCategory && matchQuery;
    });
  }, [collectives, selectedStage, selectedCategory, searchQuery]);

  return (
    <section id="discovery-section" className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 uppercase tracking-widest mb-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>ACTIVE CO-CREATION SPACES</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            WHAT ARE PEOPLE BUILDING TOGETHER?
          </h2>
          <p className="text-neutral-400 text-sm mt-1 max-w-2xl">
            Explore live Collectives. Join a challenge, stress-test emerging ideas, and shape collective outcomes.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            id="discovery-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search goals, challenges..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400/80 transition"
          />
        </div>
      </div>

      {/* Stage Filters & Category Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-6 pb-4">
        {/* Stages */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-mono text-neutral-500 uppercase mr-1">Stage:</span>
          {['ALL', 'FORMING', 'BUILDING', 'REFINING', 'FINALIZING', 'COMPLETE'].map((stage) => {
            const isSelected = selectedStage === stage;
            return (
              <button
                key={stage}
                onClick={() => setSelectedStage(stage)}
                className={`px-3 py-1 rounded-lg text-xs font-mono uppercase transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-400 text-neutral-950 font-bold shadow-sm'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                {stage}
              </button>
            );
          })}
        </div>

        {/* Categories */}
        {categories.length > 2 && (
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-neutral-500 uppercase mr-1">Domain:</span>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-0.5 rounded-md text-[11px] transition cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-200 text-neutral-950 font-semibold'
                      : 'bg-neutral-900/80 text-neutral-400 hover:text-neutral-200 border border-neutral-800'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid of Collective Cards */}
      {filteredCollectives.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-neutral-900/40 border border-neutral-800 p-8 my-6">
          <Layers className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
          <h3 className="font-display font-semibold text-lg text-white">No Collectives Found</h3>
          <p className="text-neutral-400 text-xs mt-1 max-w-md mx-auto">
            Try adjusting your search or stage filters, or start a new Collective around this challenge.
          </p>
          <button
            onClick={onStartCollective}
            className="mt-4 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition cursor-pointer"
          >
            Start This Collective
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {filteredCollectives.map((collective) => {
            const stageStyle = STAGE_COLORS[collective.stage];
            const isJoined = collective.isUserJoined;

            return (
              <div
                key={collective.id}
                onClick={() => onSelectCollective(collective)}
                className="group relative rounded-2xl bg-neutral-900/80 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between cursor-pointer hover:shadow-xl hover:shadow-black/40"
              >
                {/* Top Row: Category & Stage */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-mono text-neutral-400 uppercase tracking-wider truncate">
                      {collective.category}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-semibold border ${stageStyle.bg} ${stageStyle.text} ${stageStyle.border}`}
                    >
                      {collective.stage}
                    </span>
                  </div>

                  {/* Collective Title */}
                  <h3 className="font-display text-lg sm:text-xl font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
                    {collective.title}
                  </h3>

                  {/* Goal */}
                  <div className="mt-2 text-xs font-medium text-amber-400/90 flex items-start gap-1.5">
                    <Zap className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
                    <span className="line-clamp-2">{collective.goal}</span>
                  </div>

                  {/* Short Description */}
                  <p className="mt-2.5 text-xs text-neutral-400 leading-relaxed line-clamp-3">
                    {collective.challengeDescription}
                  </p>
                </div>

                {/* Bottom Section: Progress, Stats & Actions */}
                <div className="mt-6 pt-4 border-t border-neutral-800/80">
                  {/* Progress bar */}
                  <div className="space-y-1.5 mb-3.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
                      <span>Collective Progress</span>
                      <span className="font-semibold text-neutral-200">{collective.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500"
                        style={{ width: `${collective.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Participants & Stats */}
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-4">
                    {/* Builder avatars stack */}
                    <div className="flex items-center gap-2">
                      {collective.participants.length > 0 ? (
                        <div className="flex -space-x-2 overflow-hidden">
                          {collective.participants.slice(0, 4).map((p, idx) => (
                            <img
                              key={p.id || idx}
                              src={p.avatar}
                              alt={p.name}
                              className="inline-block h-6 w-6 rounded-full ring-2 ring-neutral-900 object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-neutral-800/80 border border-dashed border-neutral-700 flex items-center justify-center text-neutral-500">
                          <Users className="w-3 h-3" />
                        </div>
                      )}
                      <span className="text-[11px] font-medium text-neutral-300">
                        {collective.participantCount === 0 ? '0 builders (Open)' : `${collective.participantCount} builders`}
                      </span>
                    </div>

                    {/* Contributions count */}
                    <div className="flex items-center gap-1 font-mono text-[11px] text-neutral-400">
                      <GitMerge className="w-3.5 h-3.5 text-amber-400" />
                      <span>{collective.contributions.length} contributions</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      id={`share-btn-${collective.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenInvite(collective, e);
                      }}
                      className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-neutral-400 hover:text-amber-400 border border-neutral-700/80 transition cursor-pointer shrink-0"
                      title="Share / Invite collaborators"
                      aria-label="Share invite link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>

                    {isJoined ? (
                      <div className="flex-1 flex items-center gap-1.5">
                        <div 
                          className="flex-1 py-2 px-2 rounded-xl text-xs font-semibold bg-emerald-400/10 text-emerald-400 border border-emerald-400/30 flex items-center justify-center gap-1"
                          title="You have joined this collective"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Joined</span>
                        </div>
                        <button
                          id={`leave-btn-${collective.id}`}
                          onClick={(e) => onToggleJoin(collective.id, e)}
                          className="py-2 px-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-rose-300 hover:bg-rose-500/15 hover:border-rose-500/30 border border-neutral-800 transition flex items-center justify-center gap-1 cursor-pointer"
                          title="Leave this collective community"
                          aria-label={`Leave ${collective.title}`}
                        >
                          <LogOut className="w-3 h-3 text-rose-400" />
                          <span>Leave</span>
                        </button>
                      </div>
                    ) : (
                      <button
                        id={`join-btn-${collective.id}`}
                        onClick={(e) => onToggleJoin(collective.id, e)}
                        className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700"
                        aria-label={`Join ${collective.title}`}
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Join Collective</span>
                      </button>
                    )}

                    <button
                      id={`enter-workspace-${collective.id}`}
                      onClick={() => onSelectCollective(collective)}
                      className="py-2 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer group-hover:translate-x-0.5"
                      title="Enter Collective Workspace"
                    >
                      <span>Workspace</span>
                      <ArrowRight className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
