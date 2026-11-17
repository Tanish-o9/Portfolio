import React from 'react';
import { resumeContent } from '../../data/content';

export const ExperiencePanel: React.FC = () => {
  const exp = resumeContent.experience[0];

  return (
    <div className="space-y-6">
      <div className="p-5 bg-white/90 border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <h3 className="text-lg sm:text-xl font-bold text-[#3A2A1E]">
            {exp.role}
          </h3>
          <span className="font-mono text-xs px-2.5 py-1 bg-[#FFF1D6] border border-[#3A2A1E]/40 rounded-full font-bold text-[#266F73] self-start sm:self-auto">
            {exp.duration}
          </span>
        </div>

        <div className="mb-4 text-xs sm:text-sm font-semibold text-[#266F73]">
          {exp.organization} —{' '}
          <span className="text-[#4A382B] font-normal">{exp.college}</span>
        </div>

        <ul className="space-y-2.5">
          {exp.bullets.map((bullet, idx) => (
            <li key={idx} className="flex items-start text-xs sm:text-sm leading-relaxed text-[#4A382B]">
              <span className="w-1.5 h-1.5 rounded-sm bg-[#4A78C2] mt-1.5 mr-2.5 shrink-0" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
