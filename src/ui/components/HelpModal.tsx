import React from 'react';
import { X, Keyboard, Mouse, Smartphone, Sparkles } from 'lucide-react';

export interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#FFF6E3] border-[3px] border-[#3A2A1E] rounded-2xl p-6 shadow-[0_8px_0_#3A2A1E] text-[#4A382B]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#3A2A1E]/30 mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#F6B73C]" />
            <h3 className="text-xl font-extrabold text-[#3A2A1E]">
              Village Controls & Guide
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#FFF1D6] rounded-lg text-[#3A2A1E]"
            aria-label="Close help"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs sm:text-sm">
          {/* Keyboard */}
          <div className="p-3 bg-white border border-[#3A2A1E]/30 rounded-xl flex items-start gap-3">
            <Keyboard className="w-5 h-5 text-[#4F8CFF] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[#3A2A1E] font-bold">Keyboard Navigation:</strong>
              <span>Use <kbd className="px-1.5 py-0.5 bg-[#FFF1D6] border border-[#3A2A1E]/40 rounded font-mono">WASD</kbd> or <kbd className="px-1.5 py-0.5 bg-[#FFF1D6] border border-[#3A2A1E]/40 rounded font-mono">Arrow Keys</kbd> to walk around. Press <kbd className="px-1.5 py-0.5 bg-[#FFF1D6] border border-[#3A2A1E]/40 rounded font-mono">E</kbd> or <kbd className="px-1.5 py-0.5 bg-[#FFF1D6] border border-[#3A2A1E]/40 rounded font-mono">Enter</kbd> to enter buildings.</span>
            </div>
          </div>

          {/* Mouse / Trackpad */}
          <div className="p-3 bg-white border border-[#3A2A1E]/30 rounded-xl flex items-start gap-3">
            <Mouse className="w-5 h-5 text-[#8B5CF6] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[#3A2A1E] font-bold">Mouse / Trackpad:</strong>
              <span>Click anywhere on cobblestone paths or ground to walk there. Click the floating roof badges to travel directly.</span>
            </div>
          </div>

          {/* Mobile Touch */}
          <div className="p-3 bg-white border border-[#3A2A1E]/30 rounded-xl flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-[#266F73] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[#3A2A1E] font-bold">Mobile / Touch:</strong>
              <span>Use the on-screen joystick on the bottom-left or simply tap anywhere on the village ground.</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 bg-[#F6B73C] text-[#3A2A1E] font-bold rounded-xl border-2 border-[#3A2A1E] shadow-[0_3px_0_#3A2A1E] hover:bg-[#ffc652] active:translate-y-0.5 active:shadow-none"
        >
          Got it!
        </button>
      </div>
    </div>
  );
};
