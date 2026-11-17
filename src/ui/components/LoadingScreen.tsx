import React from 'react';

export const LoadingScreen: React.FC<{ progress?: number }> = ({ progress = 100 }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#94CF7A] flex flex-col items-center justify-center p-6 text-[#3A2A1E]">
      <div className="w-16 h-16 rounded-2xl bg-[#FFF6E3] border-[3px] border-[#3A2A1E] shadow-[0_6px_0_#3A2A1E] flex items-center justify-center font-bold text-2xl mb-4 font-mono">
        TK
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-2 tracking-tight">
        Tanish's AI Village
      </h1>
      <p className="text-sm font-semibold opacity-80 mb-6">Loading world assets...</p>
      <div className="w-64 h-4 bg-[#FFF6E3] border-2 border-[#3A2A1E] rounded-full overflow-hidden p-0.5">
        <div
          className="h-full bg-[#4F8CFF] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
