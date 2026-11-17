import React from 'react';
import { GraduationCap, Award, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { resumeContent } from '../../data/content';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';

export const Education: React.FC = () => {
  const edu = resumeContent.education;
  const achievements = resumeContent.achievements;

  return (
    <section id="education" className="py-20 md:py-24 bg-bg border-t border-border-separator">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <SectionHeading
          eyebrow="Academic Background & Milestones"
          title="Education &"
          titleAccent="Involvement."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Education Card */}
          <div className="p-6 sm:p-8 rounded-card bg-card border border-card-border transition-all duration-200 hover:border-accent/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-chip-bg border border-chip-border flex items-center justify-center text-accent">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text">Education</h3>
                  <span className="text-xs font-mono text-text-muted">Undergraduate Degree</span>
                </div>
              </div>

              <h4 className="text-lg font-semibold text-text mb-2">
                {edu.institution}
              </h4>
              <p className="text-sm font-medium text-accent mb-4">
                {edu.degree}
              </p>

              <div className="flex items-center gap-2 text-xs text-text-muted font-mono mb-6">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                <span>{edu.location}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-card-border/60">
              <Badge variant="accent" className="flex items-center gap-1.5 font-mono">
                <Calendar className="w-3 h-3" />
                {edu.period}
              </Badge>
              <Badge variant="accent" className="font-mono font-semibold">
                CGPA: {edu.cgpa}
              </Badge>
            </div>
          </div>

          {/* Achievements Card */}
          <div className="p-6 sm:p-8 rounded-card bg-card border border-card-border transition-all duration-200 hover:border-accent/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-chip-bg border border-chip-border flex items-center justify-center text-accent-2">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text">Achievements</h3>
                  <span className="text-xs font-mono text-text-muted">Verified Milestones</span>
                </div>
              </div>

              <ul className="space-y-4">
                {achievements.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm sm:text-base text-text-body leading-relaxed">
                    <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 mr-3 shrink-0" />
                    <div>
                      <strong className="text-text font-semibold block">{item.title}:</strong>
                      <span>{item.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-card-border/60 mt-6">
              <span className="font-mono text-xs text-text-muted">
                // Strict adherence to verified resume achievements only
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
