import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-heading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-md overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{ type: 'spring', damping: 25, stiffness: 380 }}
            className="relative w-full max-w-[820px] max-h-[90vh] flex flex-col bg-[#FFF6E3] border-[3px] border-[#3A2A1E] rounded-2xl shadow-[0_10px_0_#3A2A1E] overflow-hidden my-auto text-[#4A382B]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Bar */}
            <div className="bg-[#266F73] px-6 py-4 flex items-center justify-between border-b-[3px] border-[#3A2A1E]">
              <h2 id="modal-heading" className="text-xl sm:text-2xl font-bold text-white tracking-wide font-sans">
                {title}
              </h2>
              <button
                onClick={onClose}
                aria-label="Close dialog"
                className="px-3 py-1 bg-[#FFF6E3] text-[#3A2A1E] border-2 border-[#3A2A1E] rounded-lg text-sm font-bold shadow-[0_2px_0_#3A2A1E] hover:bg-white active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                <span>Close</span>
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 overflow-y-auto max-h-[calc(90vh-80px)]">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
