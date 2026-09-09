import React from 'react';
import { 
  Palette, 
  Check, 
  Sparkles, 
  Compass, 
  X, 
  Layers, 
  Eye, 
  Zap,
  Flame,
  Shield,
  Moon
} from 'lucide-react';
import { BackgroundTheme, BackgroundThemeId, BACKGROUND_THEMES } from '../types/background';

interface BackgroundSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentThemeId: BackgroundThemeId;
  onSelectTheme: (themeId: BackgroundThemeId) => void;
  particlesEnabled: boolean;
  onToggleParticles: () => void;
}

export const BackgroundSelectorModal: React.FC<BackgroundSelectorModalProps> = ({
  isOpen,
  onClose,
  currentThemeId,
  onSelectTheme,
  particlesEnabled,
  onToggleParticles
}) => {
  if (!isOpen) return null;

  const currentTheme = BACKGROUND_THEMES.find(t => t.id === currentThemeId) || BACKGROUND_THEMES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="bg-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/25 flex items-center justify-center text-amber-400">
              <Palette className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 id="bg-modal-title" className="text-base font-bold text-white font-display flex items-center gap-2">
                <span>Workspace Backgrounds</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-neutral-800 text-amber-300 border border-neutral-700">
                  {BACKGROUND_THEMES.length} STYLES
                </span>
              </h2>
              <p className="text-xs text-neutral-400">
                Choose an atmosphere for your collective workspace & discovery views.
              </p>
            </div>
          </div>
          <button
            id="close-bg-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition cursor-pointer"
            aria-label="Close background themes modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Grid */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {BACKGROUND_THEMES.map((theme) => {
              const isSelected = theme.id === currentThemeId;

              return (
                <button
                  key={theme.id}
                  id={`select-bg-${theme.id}`}
                  onClick={() => onSelectTheme(theme.id)}
                  className={`group relative text-left p-4 rounded-xl border transition flex flex-col justify-between cursor-pointer overflow-hidden ${
                    isSelected
                      ? 'border-amber-400/60 bg-neutral-950/90 shadow-lg shadow-amber-500/10 ring-1 ring-amber-400/40'
                      : 'border-neutral-800 bg-neutral-950/50 hover:border-neutral-700 hover:bg-neutral-950/80'
                  }`}
                >
                  {/* Visual Preview Swatch Header */}
                  <div className={`w-full h-16 rounded-lg mb-3 border border-neutral-800/80 relative overflow-hidden bg-gradient-to-br ${theme.previewGradient} flex items-center justify-center`}>
                    <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[size:12px_12px]" />
                    
                    {/* Theme badge pill */}
                    <div className="relative z-10 px-2.5 py-1 rounded-full text-[10px] font-mono font-medium bg-black/60 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5">
                      <span 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: theme.accentColor }} 
                      />
                      <span>{theme.badge}</span>
                    </div>

                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shadow-md">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold font-display ${isSelected ? 'text-amber-300' : 'text-neutral-200 group-hover:text-white'}`}>
                        {theme.name}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">
                      {theme.description}
                    </p>
                  </div>

                  {/* Active Indicator Bar */}
                  <div className="mt-3 pt-2.5 border-t border-neutral-800/60 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-neutral-500">{theme.subtitle}</span>
                    {isSelected ? (
                      <span className="text-amber-400 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> ACTIVE
                      </span>
                    ) : (
                      <span className="text-neutral-500 group-hover:text-neutral-300">
                        Apply &rarr;
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Additional Ambient Controls */}
          <div className="pt-3 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-300">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-neutral-200">
                  Ambient Particle Dust
                </div>
                <div className="text-[11px] text-neutral-400">
                  Adds subtle drifting stellar or micro-grid energy particles
                </div>
              </div>
            </div>

            <button
              id="toggle-particles-btn"
              onClick={onToggleParticles}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-2 cursor-pointer ${
                particlesEnabled
                  ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${particlesEnabled ? 'bg-amber-400 animate-pulse' : 'bg-neutral-600'}`} />
              <span>{particlesEnabled ? 'Particles: Enabled' : 'Particles: Disabled'}</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-neutral-950/80 border-t border-neutral-800 flex items-center justify-between">
          <div className="text-xs text-neutral-400 flex items-center gap-1.5">
            <span className="text-neutral-500">Current selection:</span>
            <span className="font-semibold text-white">{currentTheme.name}</span>
          </div>

          <button
            id="modal-confirm-bg-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold text-xs transition cursor-pointer shadow-sm shadow-amber-400/20"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
