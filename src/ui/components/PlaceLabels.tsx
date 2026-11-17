import React from 'react';
import { PLACES, Place } from '../../data/places';
import { useGameStore } from '../../state/gameStore';

export const PlaceLabels: React.FC = () => {
  const { openPanel, markVisited } = useGameStore();

  const handlePlaceClick = (place: Place) => {
    markVisited(place.id);
    if (place.externalUrl) {
      window.open(place.externalUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (place.panel) {
      openPanel(place.panel, place.projectId);
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {PLACES.map((place) => {
        // Position proportionally relative to 1440x900
        const leftPercent = ((place.zone.x + place.zone.width / 2) / 1440) * 100;
        const topPercent = (place.zone.y / 900) * 100;

        return (
          <div
            key={place.id}
            className="absolute transform -translate-x-1/2 -translate-y-full mb-2 pointer-events-auto"
            style={{
              left: `${leftPercent}%`,
              top: `${topPercent}%`,
            }}
          >
            <button
              onClick={() => handlePlaceClick(place)}
              aria-label={`Enter ${place.name}`}
              className="h-9 px-3.5 bg-[#FFF6E3] border-2 border-[#3A2A1E] rounded-full shadow-[0_3px_0_#3A2A1E] text-xs font-bold text-[#3A2A1E] flex items-center gap-1.5 hover:bg-white active:translate-y-0.5 active:shadow-none transition-all cursor-pointer whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#4F8CFF]"
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: place.roofColor || '#F6B73C' }}
              />
              <span>{place.label}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
