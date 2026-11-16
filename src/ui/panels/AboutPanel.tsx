import React, { useState, useEffect } from 'react';
import { resumeContent } from '../../data/content';
import { Terminal, Network, BrainCircuit, FastForward } from 'lucide-react';
import { soundEffects } from '../../game/systems/soundEffects';

const FOCUS_AREAS = [
  {
    icon: Terminal,
    title: 'LLM Engineering',
    color: '#4F8CFF',
    tags: ['Inference optimization', 'Quantization', 'Model evaluation', 'PEFT/LoRA'],
  },
  {
    icon: Network,
    title: 'Agentic AI',
    color: '#8B5CF6',
    tags: ['LangChain', 'LangGraph', 'Tool calling', 'RAG'],
  },
  {
    icon: BrainCircuit,
    title: 'Applied Machine Learning',
    color: '#266F73',
    tags: ['Deep learning', 'NLP', 'Computer vision', 'Model evaluation'],
  },
];

export const AboutPanel: React.FC = () => {
  const fullText = resumeContent.aboutIntro.join('\n\n');
  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setDisplayedText(fullText);
      setIsDone(true);
      return;
    }

    let currentLength = 0;
    const interval = setInterval(() => {
      currentLength += 2;
      if (currentLength >= fullText.length) {
        setDisplayedText(fullText);
        setIsDone(true);
        clearInterval(interval);
      } else {
        setDisplayedText(fullText.slice(0, currentLength));
        if (currentLength % 12 === 0) {
          soundEffects.playDialogueBlip();
        }
      }
    }, 18);

    return () => clearInterval(interval);
  }, [fullText]);

  const handleSkip = () => {
    setDisplayedText(fullText);
    setIsDone(true);
  };

  return (
    <div className="space-y-6">
      {/* Intro dialogue box with Typewriter */}
      <div className="p-4 bg-white/80 border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E] relative">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-mono font-bold text-[#266F73] uppercase">
            // Tanish Kumar &middot; Developer Dialogue
          </div>
          {!isDone && (
            <button
              onClick={handleSkip}
              className="px-2 py-0.5 text-[11px] font-mono font-bold text-[#3A2A1E] bg-[#FFF1D6] border border-[#3A2A1E]/30 rounded hover:bg-[#F6B73C] transition-colors flex items-center gap-1"
            >
              <FastForward className="w-3 h-3" />
              <span>Skip</span>
            </button>
          )}
        </div>

        <div className="text-sm sm:text-base leading-relaxed text-[#4A382B] whitespace-pre-line font-medium min-h-[90px]">
          {displayedText}
          {!isDone && (
            <span className="inline-block w-2 h-4 bg-[#266F73] ml-1 animate-pulse" />
          )}
        </div>
      </div>

      {/* Professional Summary from Resume */}
      <div className="p-4 bg-[#FFF1D6] border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E]">
        <h3 className="font-bold text-xs uppercase font-mono text-[#D9503F] mb-1">
          Professional Summary (Verified Resume)
        </h3>
        <p className="text-xs sm:text-sm leading-relaxed text-[#4A382B]">
          {resumeContent.personal.professionalSummary}
        </p>
      </div>

      {/* Focus Area Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {FOCUS_AREAS.map((area, idx) => {
          const Icon = area.icon;
          return (
            <div
              key={idx}
              className="p-3 bg-white/80 border-2 border-[#3A2A1E] rounded-xl shadow-[0_2px_0_#3A2A1E] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" style={{ color: area.color }} />
                  <span className="font-bold text-xs" style={{ color: area.color }}>
                    {area.title}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {area.tags.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 bg-[#FFF6E3] border border-[#3A2A1E]/40 rounded-full text-[10px] font-medium"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
