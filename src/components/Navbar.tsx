import React from 'react';
import { 
  Boxes, 
  Sparkles, 
  Plus, 
  Layers, 
  ArrowLeft, 
  RotateCcw, 
  Info,
  Users,
  Palette
} from 'lucide-react';
import { Collective } from '../types/collective';

interface NavbarProps {
  activeCollective: Collective | null;
  onBackToDiscovery: () => void;
  onOpenCreate: () => void;
  onOpenComparison: () => void;
  onResetData: () => void;
  onOpenBackgroundModal: () => void;
  currentThemeName?: string;
  themeAccentColor?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCollective,
  onBackToDiscovery,
  onOpenCreate,
  onOpenComparison,
  onResetData,
  onOpenBackgroundModal,
  currentThemeName = 'Blueprint',
  themeAccentColor = '#f59e0b',
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Tagline */}
        <div className="flex items-center gap-3">
          {activeCollective ? (
            <button
              id="nav-back-button"
              onClick={onBackToDiscovery}
              className="group flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition text-xs font-medium cursor-pointer"
              aria-label="Back to all collectives"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>All Collectives</span>
            </button>
          ) : null}

          <button
            id="nav-logo-button"
            onClick={onBackToDiscovery}
            className="flex items-center gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-md"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 flex items-center justify-center text-neutral-950 font-bold shadow-lg shadow-amber-500/10">
              <Boxes className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-lg tracking-wider text-white">
                  COLLECTIVE
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  <Sparkles className="w-2.5 h-2.5" />
                  NEXT-GEN SOCIAL
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 hidden sm:block">
                Social, Built Together.
              </p>
            </div>
          </button>
        </div>

        {/* Center: Current Collective Info if in Workspace */}
        {activeCollective && (
          <div className="hidden md:flex items-center gap-2.5 max-w-md px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-neutral-200 truncate">
              {activeCollective.title}
            </span>
            <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-neutral-800 text-amber-400 border border-neutral-700">
              {activeCollective.stage}
            </span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Background Selector Trigger */}
          <button
            id="nav-background-button"
            onClick={onOpenBackgroundModal}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium bg-neutral-900/90 hover:bg-neutral-850 text-neutral-300 hover:text-white border border-neutral-800 hover:border-neutral-700 transition cursor-pointer"
            title="Switch workspace background theme"
            aria-label="Customize background"
          >
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline text-neutral-400">Theme:</span>
            <span className="hidden sm:inline font-semibold text-neutral-200 max-w-[90px] truncate">
              {currentThemeName}
            </span>
            <span 
              className="w-2 h-2 rounded-full ml-0.5" 
              style={{ backgroundColor: themeAccentColor }}
            />
          </button>

          <button
            id="nav-compare-button"
            onClick={onOpenComparison}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition cursor-pointer"
            title="Why Collective? Contrast with legacy feeds"
          >
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">The Difference</span>
          </button>

          <button
            id="nav-reset-button"
            onClick={onResetData}
            className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900 transition cursor-pointer"
            title="Reset sample data to initial state"
            aria-label="Reset sample data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            id="nav-create-button"
            onClick={onOpenCreate}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-xs transition shadow-sm hover:shadow-amber-400/20 active:scale-98 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Start a Collective</span>
          </button>
        </div>
      </div>
    </header>
  );
};
