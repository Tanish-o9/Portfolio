import React from 'react';
import { Badge } from './Badge';

export interface SkillCardProps {
  category: string;
  skills: string[];
}

export const SkillCard: React.FC<SkillCardProps> = ({ category, skills }) => {
  return (
    <div className="p-6 rounded-card bg-card border border-card-border transition-all duration-200 hover:border-accent/40 hover:shadow-[0_4px_20px_rgba(79,140,255,0.06)] flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <h3 className="text-lg font-semibold text-text tracking-tight">
            {category}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="skill">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
