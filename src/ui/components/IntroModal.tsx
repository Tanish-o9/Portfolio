import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../state/gameStore';
import { soundEffects } from '../../game/systems/soundEffects';
import { ArrowRight, Volume2 } from 'lucide-react';

export const IntroModal: React.FC = () => {
  const [hasEntered, setHasEntered] = useState(false);
  const { toggleMute, muted } = useGameStore();

  useEffect(() => {
    try {
      const alreadyEntered = sessionStorage.getItem('tanish_village_intro_seen');
      if (alreadyEntered) {
        setHasEntered(true);
      }
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  const handleEnter = () => {
    // Unmute on explicit user interaction click
    if (muted) {
      toggleMute();
    }
    soundEffects.playEnter();
    setHasEntered(true);
    try {
      sessionStorage.setItem('tanish_village_intro_seen', 'true');
    } catch {
      // ignore
    }
  };

  if (hasEntered) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#FFF6E3] border-[4px] border-[#3A2A1E] rounded-3xl p-6 sm:p-8 shadow-[0_10px_0_#3A2A1E] text-center text-[#4A382B]">
        {/* TK Tile Logo */}
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#4F8CFF] border-[3px] border-[#3A2A1E] shadow-[0_4px_0_#3A2A1E] flex items-center justify-center text-white font-mono font-bold text-2xl">
          TK
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#3A2A1E] tracking-tight mb-2">
          Tanish's AI Village
        </h1>

        <p className="text-sm sm:text-base text-[#4A382B] leading-relaxed mb-6 font-medium">
          An interactive 2D portfolio world exploring AI engineering, LLM inference optimization, and practical ML systems.
        </p>

        {/* Button */}
        <div className="mb-6">
          <button
            onClick={handleEnter}
            className="w-full py-3.5 px-6 bg-[#F6B73C] hover:bg-[#ffc652] text-[#3A2A1E] font-extrabold text-base rounded-2xl border-[3px] border-[#3A2A1E] shadow-[0_4px_0_#3A2A1E] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <span>Enter the Village</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Audio note */}
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#3A2A1E]/70 bg-[#FFF1D6] px-3 py-1.5 rounded-full border border-[#3A2A1E]/20">
          <Volume2 className="w-3.5 h-3.5 text-[#266F73]" />
          <span>Sound plays on interaction &middot; toggle anytime</span>
        </div>
      </div>
    </div>
  );
};
