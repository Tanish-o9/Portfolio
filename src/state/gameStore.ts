import { create } from 'zustand';
import { PanelType, Place, PLACES } from '../data/places';

interface GameState {
  activePanel: PanelType;
  selectedProjectId: string | null;
  visitedPlaces: string[];
  muted: boolean;
  season: 'day' | 'evening';
  mode: 'village' | 'classic';
  isMobile: boolean;
  currentZone: Place | null;
  walkTarget: { x: number; y: number } | null;

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
}

const getStoredVisited = (): string[] => {
  try {
    const raw = localStorage.getItem('tanish_village_visited');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
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
    set({ season: get().season === 'day' ? 'evening' : 'day' });
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
}));

export const getAllPlaces = () => PLACES;
