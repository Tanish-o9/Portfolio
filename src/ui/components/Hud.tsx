import React, { useState } from 'react';
import { Sun, Sunset, Moon, HelpCircle, Compass, ChevronDown } from 'lucide-react';
import { useGameStore } from '../../state/gameStore';
import { soundEffects } from '../../game/systems/soundEffects';
import { HelpModal } from './HelpModal';
import { Jukebox } from './Jukebox';
import { AvatarCustomizerModal } from './AvatarCustomizerModal';
import { PLACES } from '../../data/places';

export const Hud: React.FC = () => {
  const { visitedPlaces, season, toggleSeason, hoodieColor, openPanel, setWalkTarget } = useGameStore();
  const [showHelp, setShowHelp] = useState(false);
  const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);
  const [showFastTravel, setShowFastTravel] = useState(false);
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

  const handleFastTravel = (placeId: string) => {
    const place = PLACES.find((p) => p.id === placeId);
    if (!place) return;
    soundEffects.playClick();
    setShowFastTravel(false);
    setWalkTarget(place.doorPoint);
    if (place.panel) {
      openPanel(place.panel, place.projectId);
    } else if (place.externalUrl) {
      window.open(place.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 p-3 sm:p-4 pointer-events-none flex items-start justify-between">
        {/* Top Left Chips */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 pointer-events-auto">
          <div className="bg-gradient-to-r from-[#FFF6E3] to-[#FFFBF2] border-[2.5px] border-[#3A2A1E] px-4 py-2 rounded-2xl shadow-[0_4px_0_#3A2A1E] font-bold text-xs sm:text-sm text-[#3A2A1E] flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4F8CFF] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#4F8CFF]" />
            </span>
            <span className="font-extrabold tracking-tight">Tanish's AI Village</span>
          </div>

          <div className="bg-[#FFF6E3] border-2 border-[#3A2A1E] px-3 py-1.5 rounded-full shadow-[0_2px_0_#3A2A1E] text-xs font-mono font-bold text-[#3A2A1E]">
            Places visited {visitedPlaces.length}/{totalPlaces}
          </div>

          {/* Fast Travel / Jump to Building */}
          <div className="relative">
            <button
              onClick={() => {
                soundEffects.playClick();
                setShowFastTravel(!showFastTravel);
              }}
              className="px-3 py-1.5 bg-[#FFF6E3] hover:bg-white border-2 border-[#3A2A1E] rounded-full shadow-[0_2px_0_#3A2A1E] text-xs font-bold text-[#3A2A1E] flex items-center gap-1.5 transition-all active:translate-y-0.5 active:shadow-none"
              title="Fast travel to any building"
            >
              <Compass className="w-3.5 h-3.5 text-[#266F73]" />
              <span className="hidden sm:inline">Jump to</span>
              <ChevronDown className="w-3 h-3 text-[#3A2A1E]/70" />
            </button>

            {showFastTravel && (
              <div className="absolute top-10 left-0 w-64 bg-[#FFF6E3] border-[3px] border-[#3A2A1E] rounded-2xl p-2 shadow-[0_6px_0_#3A2A1E] text-[#4A382B] z-50 space-y-1">
                <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-[#3A2A1E]/70 border-b border-[#3A2A1E]/20 mb-1">
                  Teleport to Place
                </div>
                {PLACES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleFastTravel(p.id)}
                    className="w-full px-2.5 py-1.5 rounded-xl hover:bg-white text-left text-xs font-bold text-[#3A2A1E] flex items-center justify-between transition-colors group"
                  >
                    <span className="truncate">{p.label}</span>
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-[#3A2A1E]"
                      style={{ backgroundColor: p.roofColor }}
                    />
                  </button>
                ))}
              </div>
            )}
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
            className="h-10 px-3 bg-[#FFF6E3] border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E] text-xs font-bold text-[#3A2A1E] flex items-center gap-1.5 hover:bg-white active:translate-y-0.5 active:shadow-none transition-all"
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
