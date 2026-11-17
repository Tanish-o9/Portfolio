import React from 'react';
import { resumeContent } from '../../data/content';

export const SkillsPanel: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="text-xs font-mono text-[#266F73] font-semibold">
        // 7 Skill Bookshelves — Verified directly from Resume
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {resumeContent.technicalSkills.map((category) => (
          <div
            key={category.category}
            className="p-4 bg-white/80 border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E] flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-[#E8804F]" />
                <h4 className="font-bold text-sm text-[#3A2A1E]">
                  {category.category}
                </h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {category.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-[#FFF6E3] border border-[#3A2A1E]/40 rounded-full text-xs font-medium text-[#4A382B]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
