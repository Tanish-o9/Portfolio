import React from 'react';
import { useGameStore } from '../../state/gameStore';
import { X, Sparkles, Check, User, Bot, Cat } from 'lucide-react';
import { soundEffects } from '../../game/systems/soundEffects';
import { motion, AnimatePresence } from 'framer-motion';

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

  const handleSelectColor = (hex: string) => {
    soundEffects.playClick();
    setHoodieColor(hex);
  };

  const handleSelectPet = (petId: 'drone' | 'cat' | 'none') => {
    soundEffects.playClick();
    setPet(petId);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 14 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
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
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Explorer Hoodie Color */}
            <div className="mb-5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3A2A1E]/70 mb-2 block">
                Explorer Outfit Color
              </label>
              <div className="flex items-center gap-2.5">
                {HOODIE_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => handleSelectColor(c.hex)}
                    title={c.name}
                    className={`w-9 h-9 rounded-full border-2 border-[#3A2A1E] flex items-center justify-center transition-transform hover:scale-110 ${
                      hoodieColor === c.hex ? 'ring-2 ring-offset-2 ring-[#3A2A1E] scale-105' : ''
                    }`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {hoodieColor === c.hex && <Check className="w-4 h-4 text-white drop-shadow" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Companion Pet */}
            <div className="mb-5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#3A2A1E]/70 mb-2 block">
                Choose Companion Pet
              </label>
              <div className="space-y-2">
                {PET_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectPet(opt.id)}
                    className={`w-full p-2.5 rounded-xl border-2 border-[#3A2A1E] flex items-center justify-between transition-all ${
                      pet === opt.id ? 'bg-[#FFF] shadow-[0_3px_0_#3A2A1E]' : 'bg-[#FFF6E3]/60 hover:bg-white/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-[#FFF6E3] border border-[#3A2A1E]/40 rounded-lg">
                        {opt.icon}
                      </div>
                      <div className="text-left">
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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
