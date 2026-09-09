export type BackgroundThemeId = 
  | 'blueprint' 
  | 'cosmic' 
  | 'cyber' 
  | 'aurora' 
  | 'sunset' 
  | 'minimal';

export interface BackgroundTheme {
  id: BackgroundThemeId;
  name: string;
  subtitle: string;
  previewGradient: string;
  accentColor: string;
  bgClass: string;
  badge: string;
  description: string;
}

export const BACKGROUND_THEMES: BackgroundTheme[] = [
  {
    id: 'blueprint',
    name: 'Architectural Blueprint',
    subtitle: 'Amber technical coordinate grid',
    previewGradient: 'from-amber-500/20 via-neutral-900 to-neutral-950',
    accentColor: '#f59e0b',
    bgClass: 'bg-theme-blueprint',
    badge: 'Co-Builder Default',
    description: 'Precision engineering grid with warm amber luminescence and drafting coordinates.'
  },
  {
    id: 'cosmic',
    name: 'Cosmic Constellation',
    subtitle: 'Deep midnight space & stardust',
    previewGradient: 'from-indigo-600/30 via-purple-950 to-neutral-950',
    accentColor: '#818cf8',
    bgClass: 'bg-theme-cosmic',
    badge: 'Deep Space',
    description: 'Deep indigo voids with stellar nebula dust, constellation linkages, and glowing nodes.'
  },
  {
    id: 'cyber',
    name: 'Cyber Nexus Grid',
    subtitle: 'Terminal matrix & emerald flow',
    previewGradient: 'from-emerald-500/20 via-teal-950 to-neutral-950',
    accentColor: '#10b981',
    bgClass: 'bg-theme-cyber',
    badge: 'Matrix High-Tech',
    description: 'Cybernetic emerald vector mesh with digital grid metrics and synthwave accents.'
  },
  {
    id: 'aurora',
    name: 'Nordic Aurora',
    subtitle: 'Atmospheric polar glow ribbons',
    previewGradient: 'from-cyan-500/20 via-fuchsia-950/20 to-neutral-950',
    accentColor: '#06b6d4',
    bgClass: 'bg-theme-aurora',
    badge: 'Atmospheric',
    description: 'Dynamic boreal ribbons of cyan, violet, and jade drifting over starry night.'
  },
  {
    id: 'sunset',
    name: 'Solar Flare / Sunset',
    subtitle: 'Warm volcanic ember radiance',
    previewGradient: 'from-orange-500/25 via-rose-950 to-neutral-950',
    accentColor: '#f97316',
    bgClass: 'bg-theme-sunset',
    badge: 'Warm Solar',
    description: 'Warm sunset horizon gradient with crimson and molten gold ambient lighting.'
  },
  {
    id: 'minimal',
    name: 'Studio Luxe Monochrome',
    subtitle: 'Matte graphite & clean geometry',
    previewGradient: 'from-neutral-700/20 via-neutral-900 to-neutral-950',
    accentColor: '#d4d4d8',
    bgClass: 'bg-theme-minimal',
    badge: 'Minimal Studio',
    description: 'Understated matte graphite canvas with subtle geometric cross-hatch dividers.'
  }
];
