import React from 'react';
import { useGameStore } from '../../state/gameStore';
import { X, Sparkles, Check, User, Bot, Cat } from 'lucide-react';
import { soundEffects } from '../../game/systems/soundEffects';

interface AvatarCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HOODIE_COLORS = [
  { name: 'Electric Blue', hex: '#4F8CFF' },
  { name: 'Cyber Cyan', hex: '#00F0FF' },
  { name: 'Neon Violet', hex: '#8B5CF6' },
  { name: 'Matrix Emerald', hex: '#10B981' },
  { name: 'Amber Flame', hex: '#F6B73C' },
];

const PET_OPTIONS: Array<{ id: 'drone' | 'cat' | 'none'; label: string; icon: React.ReactNode; desc: string }> = [
  { id: 'drone', label: 'AI Robo-Drone', icon: <Bot className="w-4 h-4 text-[#00F0FF]" />, desc: 'Floating orbital companion' },
  { id: 'cat', label: 'Cozy Chibi Cat', icon: <Cat className="w-4 h-4 text-[#F6B73C]" />, desc: 'Follows behind you' },
  { id: 'none', label: 'Solo Traveler', icon: <User className="w-4 h-4 text-[#4A382B]" />, desc: 'Explore solo' },
];

export const AvatarCustomizerModal: React.FC<AvatarCustomizerModalProps> = ({ isOpen, onClose }) => {
  const { hoodieColor, pet, setHoodieColor, setPet } = useGameStore();

  if (!isOpen) return null;

  const handleSelectColor = (hex: string) => {
    soundEffects.playClick();
    setHoodieColor(hex);
  };

  const handleSelectPet = (petId: 'drone' | 'cat' | 'none') => {
    soundEffects.playClick();
    setPet(petId);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-[#FFF6E3] border-[3px] border-[#3A2A1E] rounded-2xl p-6 shadow-[0_8px_0_#3A2A1E] text-[#4A382B]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#3A2A1E]/20 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F6B73C]" />
            <h3 className="text-lg font-extrabold text-[#3A2A1E]">
              Customize Your Explorer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#FFF1D6] rounded-lg text-[#3A2A1E]"
            aria-label="Close customizer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Preview Box */}
        <div className="flex items-center justify-center gap-4 p-4 bg-white border-2 border-[#3A2A1E] rounded-xl mb-4 shadow-inner">
          <div className="flex flex-col items-center">
            <div
              className="w-10 h-14 rounded-lg border-2 border-[#3A2A1E] flex flex-col items-center justify-center shadow-sm transition-colors duration-200"
              style={{ backgroundColor: hoodieColor }}
            >
              <div className="w-6 h-6 rounded-full bg-[#3A2A1E] mb-1 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-[#FFDBB5]" />
              </div>
              <div className="w-7 h-4 rounded bg-[#1E2B45]" />
            </div>
            <span className="text-[10px] font-bold text-[#3A2A1E] mt-1">Player</span>
          </div>

          <div className="text-xl font-bold text-[#3A2A1E]/30">+</div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-14 rounded-lg border-2 border-[#3A2A1E] bg-[#94CF7A] flex items-center justify-center shadow-sm">
              {pet === 'drone' ? (
                <div className="w-6 h-6 rounded-full bg-[#266F73] border-2 border-[#3A2A1E] flex items-center justify-center animate-bounce">
                  <div className="w-3 h-1.5 rounded-full bg-[#00F0FF]" />
                </div>
              ) : pet === 'cat' ? (
                <div className="w-6 h-6 rounded-md bg-[#F6B73C] border-2 border-[#3A2A1E] flex items-center justify-center">
                  <span className="text-xs">🐱</span>
                </div>
              ) : (
                <span className="text-xs text-[#3A2A1E]/60 font-mono">None</span>
              )}
            </div>
            <span className="text-[10px] font-bold text-[#3A2A1E] mt-1">Companion</span>
          </div>
        </div>

        {/* Hoodie Color Selection */}
        <div className="space-y-2 mb-4">
          <label className="text-xs font-mono font-bold uppercase text-[#3A2A1E]">
            Hoodie / Tunic Color:
          </label>
          <div className="flex items-center justify-between gap-1.5">
            {HOODIE_COLORS.map((c) => (
              <button
                key={c.hex}
                onClick={() => handleSelectColor(c.hex)}
                className={`w-9 h-9 rounded-xl border-2 border-[#3A2A1E] flex items-center justify-center transition-transform hover:scale-110 ${
                  hoodieColor === c.hex ? 'ring-2 ring-[#3A2A1E] scale-110 shadow-sm' : ''
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              >
                {hoodieColor === c.hex && <Check className="w-4 h-4 text-white stroke-[3]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Pet Selection */}
        <div className="space-y-2 mb-6">
          <label className="text-xs font-mono font-bold uppercase text-[#3A2A1E]">
            Companion Pet:
          </label>
          <div className="space-y-1.5">
            {PET_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleSelectPet(opt.id)}
                className={`w-full p-2.5 rounded-xl border-2 border-[#3A2A1E] flex items-center justify-between text-left transition-all ${
                  pet === opt.id
                    ? 'bg-[#F6B73C]/20 border-[#3A2A1E] font-bold'
                    : 'bg-white hover:bg-[#FFF] opacity-80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-[#FFF6E3] border border-[#3A2A1E]/40 rounded-lg">
                    {opt.icon}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#3A2A1E]">{opt.label}</div>
                    <div className="text-[10px] text-[#4A382B]/80">{opt.desc}</div>
                  </div>
                </div>
                {pet === opt.id && <Check className="w-4 h-4 text-emerald-600 font-bold" />}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#266F73] text-white font-bold rounded-xl border-2 border-[#3A2A1E] shadow-[0_3px_0_#3A2A1E] hover:bg-[#2e8a8f] active:translate-y-0.5 active:shadow-none"
        >
          Save & Return to Village
        </button>
      </div>
    </div>
  );
};