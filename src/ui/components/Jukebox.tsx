import React from 'react';
import { useGameStore } from '../../state/gameStore';
import { soundEffects, JUKEBOX_TRACKS } from '../../game/systems/soundEffects';
import { Disc3, SkipForward, Volume2, VolumeX } from 'lucide-react';

export const Jukebox: React.FC = () => {
  const { currentTrack, setTrack, muted, toggleMute } = useGameStore();

  const tracks = JUKEBOX_TRACKS;

  const activeTrack = tracks[currentTrack % tracks.length];

  const handleNextTrack = () => {
    soundEffects.playClick();
    const nextIdx = (currentTrack + 1) % tracks.length;
    setTrack(nextIdx);
    if (!muted) {
      soundEffects.changeTrack(nextIdx);
    }
  };

  const handleToggleSound = () => {
    soundEffects.playClick();
    toggleMute();
    if (muted) {
      soundEffects.startMusic(currentTrack);
    } else {
      soundEffects.stopMusic();
    }
  };

  return (
    <div className="flex items-center gap-1.5 p-1 bg-[#FFF6E3] border-2 border-[#3A2A1E] rounded-full shadow-[0_3px_0_#3A2A1E] text-xs font-bold text-[#3A2A1E]">
      {/* Sound Mute / Unmute Button */}
      <button
        onClick={handleToggleSound}
        className={`px-2 py-1 rounded-full flex items-center gap-1 transition-all ${
          !muted ? 'bg-[#266F73] text-white' : 'hover:bg-[#FFF1D6] text-[#3A2A1E]'
        }`}
        title={!muted ? 'Mute Music' : 'Unmute Music'}
      >
        {!muted ? (
          <>
            <Volume2 className="w-3.5 h-3.5" />
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-2 bg-emerald-300 animate-pulse" />
              <span className="w-0.5 h-3 bg-white animate-bounce" />
              <span className="w-0.5 h-1.5 bg-emerald-300 animate-pulse" />
            </div>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5" />
            <span className="text-[10px]">Muted</span>
          </>
        )}
      </button>

      {/* Track Name & Skip */}
      <div className="flex items-center gap-1.5 px-2">
        <Disc3 className={`w-3.5 h-3.5 text-[#E0674A] ${!muted ? 'animate-spin' : ''}`} />
        <span className="text-[11px] font-mono truncate max-w-[120px] hidden sm:inline-block">
          {activeTrack.name}
        </span>
        <button
          onClick={handleNextTrack}
          className="p-1 hover:bg-[#FFF1D6] rounded-full active:scale-95"
          title="Next Lo-Fi Beat"
        >
          <SkipForward className="w-3.5 h-3.5 text-[#3A2A1E]" />
        </button>
      </div>
    </div>
  );
};