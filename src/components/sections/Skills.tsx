import React from 'react';
import { resumeContent } from '../../data/content';
import { SectionHeading } from '../ui/SectionHeading';
import { SkillCard } from '../ui/SkillCard';

export const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-20 md:py-24 bg-bg-alt border-t border-border-separator">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <SectionHeading
          eyebrow="Technical Skills"
          title="What I work with."
          note="Taken directly from my resume. Single source of truth."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumeContent.technicalSkills.map((category) => (
            <SkillCard
              key={category.category}
              category={category.category}
              skills={category.skills}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
