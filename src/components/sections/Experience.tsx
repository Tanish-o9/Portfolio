import React from 'react';
import { resumeContent } from '../../data/content';
import { SectionHeading } from '../ui/SectionHeading';

export const Experience: React.FC = () => {
  const exp = resumeContent.experience[0];

  return (
    <section id="experience" className="py-20 md:py-24 bg-bg border-t border-border-separator">
      <div className="max-w-[920px] mx-auto px-4 sm:px-8">
        <SectionHeading
          eyebrow="Experience"
          title="Where I"
          titleAccent="Contribute."
        />

        {/* Vertical Timeline */}
        <div className="relative pl-6 sm:pl-8 border-l-2 border-[#1E2B45] ml-2 sm:ml-4 space-y-12">
          {/* Blue dot with soft ring */}
          <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-accent ring-4 ring-accent/20" />

          {/* Experience Card */}
          <div className="rounded-card bg-card border border-card-border p-6 sm:p-8 transition-all duration-200 hover:border-accent/40">
            {/* Header: Role and Duration */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <h3 className="text-xl sm:text-[22px] font-bold text-text">
                {exp.role}
              </h3>
              <span className="font-mono text-xs sm:text-sm text-accent bg-accent/10 border border-accent/25 px-3 py-1 rounded-full self-start sm:self-auto">
                {exp.duration}
              </span>
            </div>

            {/* Organization */}
            <div className="mb-6">
              <span className="text-accent font-semibold text-base sm:text-lg">
                {exp.organization}
              </span>
              <span className="text-text-muted text-sm block sm:inline sm:before:content-['•'] sm:before:mx-2 font-mono">
                {exp.college}
              </span>
            </div>

            {/* Bullets with small blue square markers */}
            <ul className="space-y-3.5">
              {exp.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start text-sm sm:text-base text-text-body leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-sm bg-accent mt-2.5 mr-3 shrink-0" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
