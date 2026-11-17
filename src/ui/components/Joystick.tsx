import React from 'react';

export interface JoystickProps {
  onMove?: (deltaX: number, deltaY: number) => void;
  onEnd?: () => void;
}

export const Joystick: React.FC<JoystickProps> = () => {
  return (
    <div className="fixed bottom-6 left-6 z-30 md:hidden pointer-events-auto">
      <div className="w-24 h-24 rounded-full bg-[#FFF6E3]/80 border-[3px] border-[#3A2A1E] shadow-[0_4px_0_#3A2A1E] flex items-center justify-center relative touch-none">
        <div className="w-10 h-10 rounded-full bg-[#F6B73C] border-2 border-[#3A2A1E] shadow-inner" />
      </div>
    </div>
  );
};
