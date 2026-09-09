const AVATAR_PALETTE = [
  ['#f59e0b', '#111827'],
  ['#34d399', '#052e2b'],
  ['#a78bfa', '#1e1b4b'],
  ['#60a5fa', '#172554'],
  ['#fb7185', '#4c0519'],
  ['#22d3ee', '#083344'],
  ['#f97316', '#431407'],
  ['#c084fc', '#3b0764'],
] as const;

function hashName(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
    .slice(0, 2) || 'CO';
}

/**
 * Generates a deterministic local SVG avatar so the prototype has no runtime
 * dependency on third-party avatar/image hosts.
 */
export function avatarFor(name: string): string {
  const index = hashName(name) % AVATAR_PALETTE.length;
  const [accent, background] = AVATAR_PALETTE[index];
  const label = initials(name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" rx="48" fill="${background}"/><circle cx="48" cy="48" r="44" fill="none" stroke="${accent}" stroke-width="3" opacity="0.9"/><text x="48" y="55" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="700" fill="${accent}">${label}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
