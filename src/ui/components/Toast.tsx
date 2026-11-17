import React from 'react';

export interface ToastProps {
  message: string;
  visible: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, visible }) => {
  if (!visible) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#FFF6E3] border-2 border-[#3A2A1E] px-4 py-2 rounded-xl shadow-[0_4px_0_#3A2A1E] font-bold text-sm text-[#3A2A1E] animate-bounce">
      {message}
    </div>
  );
};
