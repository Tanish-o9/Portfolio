import { create } from 'zustand';
import { PanelType, Place, PLACES } from '../data/places';

export type SeasonMode = 'day' | 'sunset' | 'night';

export type QuestId =
  | 'quantora_sim'
  | 'tanish_ai'
  | 'college_leetcode'
  | 'workshop_terminal'
  | 'guestbook_sign';

export interface GameState {
  activePanel: PanelType;
  selectedProjectId: string | null;
  visitedPlaces: string[];
  muted: boolean;
  season: SeasonMode;
  mode: 'village' | 'classic';
  isMobile: boolean;
  currentZone: Place | null;
  walkTarget: { x: number; y: number } | null;

  // Quests
  quests: Record<QuestId, boolean>;
  isQuestTrackerOpen: boolean;

  // Avatar customization
  hoodieColor: string;
  pet: 'none' | 'drone' | 'cat';

  // Jukebox
  currentTrack: number;

  // Actions
  openPanel: (panel: PanelType, projectId?: string) => void;
  closePanel: () => void;
  markVisited: (placeId: string) => void;
  toggleMute: () => void;
  toggleSeason: () => void;
  setMode: (mode: 'village' | 'classic') => void;
  setIsMobile: (isMobile: boolean) => void;
  setCurrentZone: (zone: Place | null) => void;
  setWalkTarget: (target: { x: number; y: number } | null) => void;
  completeQuest: (id: QuestId) => void;
  setQuestTrackerOpen: (open: boolean) => void;
  setHoodieColor: (color: string) => void;
  setPet: (pet: 'none' | 'drone' | 'cat') => void;
  setTrack: (idx: number) => void;
  nextTrack: () => void;
}

const getStoredVisited = (): string[] => {
  try {
    const raw = localStorage.getItem('tanish_village_visited');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const getStoredQuests = (): Record<QuestId, boolean> => {
  const initial: Record<QuestId, boolean> = {
    quantora_sim: false,
    tanish_ai: false,
    college_leetcode: false,
    workshop_terminal: false,
    guestbook_sign: false,
  };
  try {
    const raw = localStorage.getItem('tanish_village_quests');
    if (raw) {
      return { ...initial, ...JSON.parse(raw) };
    }
  } catch {
    // fallback
  }
  return initial;
};

const getStoredMuted = (): boolean => {
  try {
    const raw = localStorage.getItem('tanish_village_muted');
    return raw !== null ? JSON.parse(raw) : true;
  } catch {
    return true;
  }
};

export const useGameStore = create<GameState>((set, get) => ({
  activePanel: null,
  selectedProjectId: null,
  visitedPlaces: getStoredVisited(),
  muted: getStoredMuted(),
  season: 'day',
  mode: 'village',
  isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
  currentZone: null,
  walkTarget: null,

  quests: getStoredQuests(),
  isQuestTrackerOpen: false,

  hoodieColor: '#4F8CFF',
  pet: 'drone',

  currentTrack: 0,

  openPanel: (panel, projectId) => {
    set({
      activePanel: panel,
      selectedProjectId: projectId ?? null,
    });
  },

  closePanel: () => {
    set({
      activePanel: null,
      selectedProjectId: null,
    });
  },

  markVisited: (placeId) => {
    const { visitedPlaces } = get();
    if (!visitedPlaces.includes(placeId)) {
      const updated = [...visitedPlaces, placeId];
      set({ visitedPlaces: updated });
      try {
        localStorage.setItem('tanish_village_visited', JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }
    }
  },

  toggleMute: () => {
    const nextMuted = !get().muted;
    set({ muted: nextMuted });
    try {
      localStorage.setItem('tanish_village_muted', JSON.stringify(nextMuted));
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
  },

  toggleSeason: () => {
    const current = get().season;
    const next: SeasonMode = current === 'day' ? 'sunset' : current === 'sunset' ? 'night' : 'day';
    set({ season: next });
  },

  setMode: (mode) => {
    set({ mode });
    try {
      localStorage.setItem('tanish_portfolio_mode', mode);
    } catch (err) {
      console.warn('LocalStorage error:', err);
    }
  },

  setIsMobile: (isMobile) => set({ isMobile }),
  setCurrentZone: (currentZone) => set({ currentZone }),
  setWalkTarget: (walkTarget) => set({ walkTarget }),

  completeQuest: (id) => {
    const { quests } = get();
    if (!quests[id]) {
      const updated = { ...quests, [id]: true };
      set({ quests: updated });
      try {
        localStorage.setItem('tanish_village_quests', JSON.stringify(updated));
      } catch (err) {
        console.warn('LocalStorage error:', err);
      }
    }
  },

  setQuestTrackerOpen: (open) => set({ isQuestTrackerOpen: open }),
  setHoodieColor: (hoodieColor) => set({ hoodieColor }),
  setPet: (pet) => set({ pet }),
  setTrack: (currentTrack) => set({ currentTrack }),
  nextTrack: () => set({ currentTrack: (get().currentTrack + 1) % 3 }),
}));

export const getAllPlaces = () => PLACES;
