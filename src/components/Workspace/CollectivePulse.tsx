import React, { useMemo } from 'react';
import { Gauge, GitMerge, Shield, Sparkles } from 'lucide-react';
import { Collective } from '../../types/collective';

interface CollectivePulseProps {
  collective: Collective;
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

/** A compact, deterministic signal layer that makes the collective interaction model visible. */
export const CollectivePulse: React.FC<CollectivePulseProps> = ({ collective }) => {
  const pulse = useMemo(() => {
    const contributions = collective.contributions.length;
    const uniqueAuthors = new Set(collective.contributions.map((item) => item.author.id)).size;
    const challenges = collective.contributions.filter(
      (item) => item.actionType === 'challenge' || item.type === 'concern',
    ).length;
    const remixes = collective.contributions.filter(
      (item) => item.actionType === 'remix' || item.type === 'alternative',
    ).length;
    const builds = collective.contributions.filter(
      (item) => item.actionType === 'build' || item.type === 'improvement',
    ).length;

    return {
      diversity: clamp((uniqueAuthors / Math.max(1, collective.participantCount)) * 100),
      challengeDepth: clamp(contributions ? 35 + (challenges / contributions) * 65 : 0),
      synthesisMomentum: clamp(contributions ? 30 + ((builds + remixes) / contributions) * 70 : collective.progress),
    };
  }, [collective]);

  const signals = [
    { label: 'Perspective', value: pulse.diversity, icon: Gauge },
    { label: 'Stress-test', value: pulse.challengeDepth, icon: Shield },
    { label: 'Synthesis', value: pulse.synthesisMomentum, icon: GitMerge },
  ];

  return (
    <section
      aria-label="Collective pulse"
      className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5"
    >
      {signals.map(({ label, value, icon: Icon }) => (
        <div key={label} className="rounded-xl border border-neutral-800 bg-neutral-950/70 px-3 py-2.5">
          <div className="flex items-center justify-between gap-2 text-[10px] font-mono uppercase tracking-wider text-neutral-500">
            <span className="flex items-center gap-1.5"><Icon className="w-3.5 h-3.5 text-amber-400" />{label}</span>
            <span className="text-neutral-300">{value}%</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-neutral-800 overflow-hidden" aria-hidden="true">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-emerald-400 to-sky-400 transition-all duration-500"
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      ))}
      <div className="sm:col-span-3 flex items-center gap-2 text-[10px] font-mono text-neutral-500 pt-0.5">
        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
        <span>Collective Pulse measures participation diversity, constructive challenge, and idea synthesis.</span>
      </div>
    </section>
  );
};
