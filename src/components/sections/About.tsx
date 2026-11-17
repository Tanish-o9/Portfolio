import React from 'react';
import { Sparkles, Terminal, Network, BrainCircuit } from 'lucide-react';
import { resumeContent } from '../../data/content';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';

const FOCUS_AREAS = [
  {
    icon: Terminal,
    title: 'LLM Engineering',
    colorClass: 'text-accent',
    borderClass: 'border-accent/30',
    tags: ['Inference optimization', 'Quantization', 'Model evaluation', 'PEFT/LoRA'],
  },
  {
    icon: Network,
    title: 'Agentic AI',
    colorClass: 'text-accent-2',
    borderClass: 'border-accent-2/30',
    tags: ['LangChain', 'LangGraph', 'Tool calling', 'RAG'],
  },
  {
    icon: BrainCircuit,
    title: 'Applied Machine Learning',
    colorClass: 'text-accent',
    borderClass: 'border-accent/30',
    tags: ['Deep learning', 'NLP', 'Computer vision', 'Model evaluation'],
  },
];

export const About: React.FC = () => {
  return (
    <section id="about" className="py-20 md:py-24 bg-bg">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Intro & Professional Summary */}
          <div className="lg:col-span-7">
            <SectionHeading
              eyebrow="About"
              title="Beyond Code,"
              titleAccent="Building Intelligence."
            />

            {/* Three exact paragraphs */}
            <div className="space-y-4 text-base sm:text-lg text-text-body leading-relaxed mb-8">
              {resumeContent.aboutIntro.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Professional Summary from Resume */}
            <div className="p-6 rounded-card bg-card/60 border border-card-border relative overflow-hidden">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="font-mono text-xs uppercase tracking-wider text-accent font-semibold">
                  Professional Summary (Resume)
                </span>
              </div>
              <p className="text-sm sm:text-base text-text-body leading-relaxed">
                {resumeContent.personal.professionalSummary}
              </p>
            </div>
          </div>

          {/* Right Column: Three Stacked Cards */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="mb-2">
              <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
                Core Competencies & Focus
              </span>
            </div>

            {FOCUS_AREAS.map((area, idx) => {
              const Icon = area.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-card bg-card border border-card-border transition-all duration-200 hover:border-accent/50 hover:bg-card/90"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-chip-bg border border-chip-border flex items-center justify-center">
                      <Icon className={`w-5 h-5 ${area.colorClass}`} />
                    </div>
                    <h3 className={`text-lg font-bold ${area.colorClass}`}>
                      {area.title}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {area.tags.map((tag) => (
                      <Badge key={tag} variant="skill">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
