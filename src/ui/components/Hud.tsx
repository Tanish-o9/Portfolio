import React from 'react';
import { Volume2, VolumeX, Sun, Moon, ArrowRight } from 'lucide-react';
import { useGameStore } from '../../state/gameStore';

export const Hud: React.FC = () => {
  const { visitedPlaces, muted, toggleMute, season, toggleSeason, setMode } = useGameStore();
  const totalPlaces = 8;

  return (
    <header className="fixed top-0 left-0 right-0 z-30 p-3 sm:p-4 pointer-events-none flex items-start justify-between">
      {/* Top Left Chips */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 pointer-events-auto">
        <div className="bg-[#FFF6E3] border-2 border-[#3A2A1E] px-3.5 py-1.5 rounded-full shadow-[0_3px_0_#3A2A1E] font-bold text-xs sm:text-sm text-[#3A2A1E] flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#4F8CFF] animate-pulse" />
          <span>Tanish's AI Village</span>
        </div>

        <div className="bg-[#FFF6E3] border-2 border-[#3A2A1E] px-3 py-1 rounded-full shadow-[0_2px_0_#3A2A1E] text-xs font-mono font-semibold text-[#3A2A1E]">
          Places visited {visitedPlaces.length}/{totalPlaces}
        </div>
      </div>

      {/* Top Right Controls */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Sound toggle */}
        <button
          onClick={toggleMute}
          aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
          className="h-10 px-3 bg-[#FFF6E3] border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E] text-xs font-bold text-[#3A2A1E] flex items-center gap-1.5 hover:bg-white active:translate-y-0.5 active:shadow-none transition-all"
        >
          {muted ? <VolumeX className="w-4 h-4 text-[#D9503F]" /> : <Volume2 className="w-4 h-4 text-[#266F73]" />}
          <span className="hidden sm:inline">{muted ? 'Sound: off' : 'Sound: on'}</span>
        </button>

        {/* Day / Evening toggle */}
        <button
          onClick={toggleSeason}
          aria-label="Toggle day and evening theme"
          className="h-10 px-3 bg-[#FFF6E3] border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E] text-xs font-bold text-[#3A2A1E] flex items-center gap-1.5 hover:bg-white active:translate-y-0.5 active:shadow-none transition-all"
        >
          {season === 'day' ? <Sun className="w-4 h-4 text-[#F6B73C]" /> : <Moon className="w-4 h-4 text-[#7B6BC4]" />}
          <span className="hidden sm:inline capitalize">{season}</span>
        </button>

        {/* Skip the village button */}
        <button
          onClick={() => setMode('classic')}
          aria-label="Switch to standard classic portfolio view"
          className="h-10 px-4 bg-[#F6B73C] border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E] text-xs sm:text-sm font-bold text-[#3A2A1E] flex items-center gap-1.5 hover:bg-[#ffc652] active:translate-y-0.5 active:shadow-none transition-all"
        >
          <span>Skip the village</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
