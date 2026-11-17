import React from 'react';

export interface DialogueBoxProps {
  speaker: string;
  text: string;
  onNext?: () => void;
  onSkip?: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ speaker, text, onNext, onSkip }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4">
      <div className="bg-[#FFF6E3] border-[3px] border-[#3A2A1E] rounded-xl p-4 shadow-[0_6px_0_#3A2A1E] text-[#4A382B]">
        <div className="font-bold text-sm text-[#266F73] mb-1 font-mono uppercase tracking-wider">
          {speaker}
        </div>
        <p className="text-sm sm:text-base leading-relaxed mb-3">{text}</p>
        <div className="flex justify-end gap-2 text-xs font-bold">
          {onSkip && (
            <button
              onClick={onSkip}
              className="px-2.5 py-1 text-[#3A2A1E]/70 hover:text-[#3A2A1E]"
            >
              Skip
            </button>
          )}
          {onNext && (
            <button
              onClick={onNext}
              className="px-3 py-1 bg-[#F6B73C] border-2 border-[#3A2A1E] rounded-md shadow-[0_2px_0_#3A2A1E] active:translate-y-0.5 active:shadow-none"
            >
              Next &rarr;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
