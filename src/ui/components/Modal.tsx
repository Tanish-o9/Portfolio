import React, { useEffect } from 'react';
import { X } from 'lucide-react';

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

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-heading"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[820px] max-h-[90vh] flex flex-col bg-[#FFF6E3] border-[3px] border-[#3A2A1E] rounded-2xl shadow-[0_8px_0_#3A2A1E] overflow-hidden my-auto text-[#4A382B]"
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
      </div>
    </div>
  );
};
