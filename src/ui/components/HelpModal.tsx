import React from 'react';
import { X, Keyboard, Mouse, Smartphone, Sparkles, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
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

            <div className="space-y-3.5 text-xs sm:text-sm">
              {/* Keyboard */}
              <div className="p-3 bg-white border border-[#3A2A1E]/30 rounded-xl flex items-start gap-3">
                <Keyboard className="w-5 h-5 text-[#4F8CFF] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#3A2A1E] font-bold">Keyboard Navigation:</strong>
                  <span>Use <kbd className="px-1.5 py-0.5 bg-[#FFF1D6] border border-[#3A2A1E]/40 rounded font-mono">WASD</kbd> or <kbd className="px-1.5 py-0.5 bg-[#FFF1D6] border border-[#3A2A1E]/40 rounded font-mono">Arrow Keys</kbd> to walk. Hold <kbd className="px-1.5 py-0.5 bg-[#FFF1D6] border border-[#3A2A1E]/40 rounded font-mono">Shift</kbd> to sprint! Press <kbd className="px-1.5 py-0.5 bg-[#FFF1D6] border border-[#3A2A1E]/40 rounded font-mono">E</kbd> or <kbd className="px-1.5 py-0.5 bg-[#FFF1D6] border border-[#3A2A1E]/40 rounded font-mono">Enter</kbd> to enter buildings.</span>
                </div>
              </div>

              {/* Sprinting feature */}
              <div className="p-3 bg-white border border-[#3A2A1E]/30 rounded-xl flex items-start gap-3">
                <Gauge className="w-5 h-5 text-[#E0674A] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#3A2A1E] font-bold">Juicy Movement:</strong>
                  <span>Squash & stretch step bounce, running dust puffs, idle breathing, and bank-tilting companion pets!</span>
                </div>
              </div>

              {/* Mouse / Trackpad */}
              <div className="p-3 bg-white border border-[#3A2A1E]/30 rounded-xl flex items-start gap-3">
                <Mouse className="w-5 h-5 text-[#8B5CF6] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#3A2A1E] font-bold">Mouse Drag & Pan / Click:</strong>
                  <span>Click and drag anywhere to slide and pan across the village! Scroll wheel zooms in/out. Click on cobblestone paths to walk, or click any roof badge to travel directly.</span>
                </div>
              </div>

              {/* Mobile Touch */}
              <div className="p-3 bg-white border border-[#3A2A1E]/30 rounded-xl flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-[#266F73] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-[#3A2A1E] font-bold">Mobile / Touch:</strong>
                  <span>Use the on-screen joystick on the bottom-left or simply tap anywhere on the ground.</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="mt-5 w-full py-2.5 bg-[#F6B73C] text-[#3A2A1E] font-bold rounded-xl border-2 border-[#3A2A1E] shadow-[0_3px_0_#3A2A1E] hover:bg-[#ffc652] active:translate-y-0.5 active:shadow-none"
            >
              Got it!
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
