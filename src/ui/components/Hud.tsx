import React, { useState } from 'react';
import { Sun, Sunset, Moon, HelpCircle } from 'lucide-react';
import { useGameStore } from '../../state/gameStore';
import { soundEffects } from '../../game/systems/soundEffects';
import { HelpModal } from './HelpModal';
import { Jukebox } from './Jukebox';
import { AvatarCustomizerModal } from './AvatarCustomizerModal';

export const Hud: React.FC = () => {
  const { visitedPlaces, season, toggleSeason, hoodieColor } = useGameStore();
  const [showHelp, setShowHelp] = useState(false);
  const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);
  const totalPlaces = 8;

  const handleSeasonToggle = () => {
    toggleSeason();
    soundEffects.playClick();
  };

  const getSeasonIcon = () => {
    switch (season) {
      case 'sunset':
        return <Sunset className="w-4 h-4 text-[#E0674A]" />;
      case 'night':
        return <Moon className="w-4 h-4 text-[#7B6BC4]" />;
      default:
        return <Sun className="w-4 h-4 text-[#F6B73C]" />;
    }
  };

  return (
    <>
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
          {/* Lo-Fi Procedural Jukebox Radio */}
          <Jukebox />

          {/* Avatar Customizer Button */}
          <button
            onClick={() => {
              setShowAvatarCustomizer(true);
              soundEffects.playClick();
            }}
            aria-label="Customize Avatar"
            className="h-10 px-2.5 bg-[#FFF6E3] border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E] text-xs font-bold text-[#3A2A1E] flex items-center gap-1.5 hover:bg-white active:translate-y-0.5 active:shadow-none transition-all"
            title="Customize Explorer & Pet"
          >
            <div
              className="w-3.5 h-3.5 rounded-full border border-[#3A2A1E]"
              style={{ backgroundColor: hoodieColor }}
            />
            <span className="hidden sm:inline">Avatar</span>
          </button>

          {/* Dynamic 3-Atmosphere Lighting Toggle (Day / Sunset / Cyber Night) */}
          <button
            onClick={handleSeasonToggle}
            aria-label="Toggle lighting mode"
            className="h-10 px-3 bg-[#FFF6E3] border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E] text-xs font-bold text-[#3A2A1E] flex items-center gap-1.5 hover:bg-white active:translate-y-0.5 active:shadow-none transition-all"
            title="Switch Day / Sunset / Cyber Night"
          >
            {getSeasonIcon()}
            <span className="hidden sm:inline capitalize">{season}</span>
          </button>

          {/* Help Button */}
          <button
            onClick={() => setShowHelp(true)}
            aria-label="Controls and Help"
            className="h-10 w-10 bg-[#FFF6E3] border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E] text-xs font-bold text-[#3A2A1E] flex items-center justify-center hover:bg-white active:translate-y-0.5 active:shadow-none transition-all"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Help Modal */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />

      {/* Avatar & Pet Customizer Modal */}
      <AvatarCustomizerModal
        isOpen={showAvatarCustomizer}
        onClose={() => setShowAvatarCustomizer(false)}
      />
    </>
  );
};
