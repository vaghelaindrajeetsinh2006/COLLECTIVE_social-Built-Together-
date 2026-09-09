import { Collective } from '../types/collective';
import { INITIAL_COLLECTIVES } from '../data/initialCollectives';
import { avatarFor } from './avatar';

const STORAGE_KEY = 'collective_platform_state_v3';

export function loadCollectives(): Collective[] {
  try {
    // Clear legacy v1/v2 state if present to ensure clean participant lists and 0% progress
    if (localStorage.getItem('collective_platform_state_v1')) {
      localStorage.removeItem('collective_platform_state_v1');
    }
    if (localStorage.getItem('collective_platform_state_v2')) {
      localStorage.removeItem('collective_platform_state_v2');
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveCollectives(INITIAL_COLLECTIVES);
      return INITIAL_COLLECTIVES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      // Normalize legacy participant avatars to local deterministic assets.
      return parsed.map((collective: Collective) => ({
        ...collective,
        participants: collective.participants.map((participant) => ({
          ...participant,
          avatar: avatarFor(participant.name),
        })),
        contributions: collective.contributions.map((contribution) => ({
          ...contribution,
          author: {
            ...contribution.author,
            avatar: avatarFor(contribution.author.name),
          },
        })),
      }));
    }
  } catch (err) {
    console.warn('Failed to load collectives from storage, resetting to defaults', err);
  }
  return INITIAL_COLLECTIVES;
}

export function saveCollectives(collectives: Collective[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collectives));
  } catch (err) {
    console.warn('Failed to persist collectives to storage', err);
  }
}

export function resetCollectivesToDefault(): Collective[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
  saveCollectives(INITIAL_COLLECTIVES);
  return INITIAL_COLLECTIVES;
}
