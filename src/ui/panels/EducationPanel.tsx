import React, { useEffect } from 'react';
import { resumeContent } from '../../data/content';
import { GraduationCap, Award, CheckCircle } from 'lucide-react';
import { useGameStore } from '../../state/gameStore';

export const EducationPanel: React.FC = () => {
  const edu = resumeContent.education;
  const achievements = resumeContent.achievements;

  useEffect(() => {
    useGameStore.getState().completeQuest('college_leetcode');
  }, []);

  return (
    <div className="space-y-4">
      <div className="p-5 bg-white/90 border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E]">
        <div className="flex items-center gap-2 mb-2 text-[#266F73]">
          <GraduationCap className="w-5 h-5" />
          <h3 className="font-bold text-base sm:text-lg text-[#3A2A1E]">
            {edu.institution}
          </h3>
        </div>
        <p className="text-sm font-semibold text-[#266F73] mb-3">
          {edu.degree}
        </p>
        <div className="flex flex-wrap gap-2 text-xs font-mono font-bold">
          <span className="px-2.5 py-1 bg-[#FFF1D6] border border-[#3A2A1E]/30 rounded-md">
            {edu.period}
          </span>
          <span className="px-2.5 py-1 bg-[#F6B73C] border border-[#3A2A1E]/30 rounded-md text-[#3A2A1E]">
            CGPA {edu.cgpa}
          </span>
        </div>
      </div>

      <div className="p-5 bg-[#FFF1D6] border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E]">
        <div className="flex items-center gap-2 mb-3 text-[#D9503F]">
          <Award className="w-5 h-5" />
          <h4 className="font-bold text-sm text-[#3A2A1E] uppercase tracking-wider font-mono">
            Verified Achievements
          </h4>
        </div>
        <ul className="space-y-2.5 text-xs sm:text-sm text-[#4A382B]">
          {achievements.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-[#266F73] shrink-0 mt-0.5" />
              <span>
                <strong>{item.title}:</strong> {item.description}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
