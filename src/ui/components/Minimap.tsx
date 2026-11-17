import React from 'react';
import { PLACES } from '../../data/places';

export interface MinimapProps {
  playerX?: number;
  playerY?: number;
}

export const Minimap: React.FC<MinimapProps> = ({ playerX = 700, playerY = 585 }) => {
  // World scale: 1440x900 to 190x123
  const scaleX = 190 / 1440;
  const scaleY = 123 / 900;

  return (
    <div className="fixed bottom-4 right-4 z-20 hidden md:block">
      <div className="w-[190px] h-[123px] bg-[#94CF7A] border-[3px] border-[#3A2A1E] rounded-xl shadow-[0_4px_0_#3A2A1E] relative overflow-hidden">
        {/* Road representations */}
        <div className="absolute top-[71px] left-0 right-0 h-3 bg-[#EADFCB] border-y border-[#BDAE92]" />
        <div className="absolute left-[92px] top-[32px] bottom-[12px] w-3 bg-[#EADFCB] border-x border-[#BDAE92]" />

        {/* Place dots */}
        {PLACES.map((place) => {
          const px = (place.zone.x + place.zone.width / 2) * scaleX;
          const py = (place.zone.y + place.zone.height / 2) * scaleY;
          return (
            <div
              key={place.id}
              className="absolute w-2 h-2 rounded-full border border-[#3A2A1E] transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${px}px`,
                top: `${py}px`,
                backgroundColor: place.roofColor || '#F6B73C',
              }}
              title={place.name}
            />
          );
        })}

        {/* Player dot (Coral #E0674A) */}
        <div
          className="absolute w-2.5 h-2.5 bg-[#E0674A] border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-sm animate-pulse"
          style={{
            left: `${playerX * scaleX}px`,
            top: `${playerY * scaleY}px`,
          }}
        />
      </div>
    </div>
  );
};
