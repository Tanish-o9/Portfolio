import React, { useState, useEffect } from 'react';
import { ArrowDown, FileText, Send, Sparkles } from 'lucide-react';
import { resumeContent } from '../../data/content';
import { Button } from '../ui/Button';

const TYPING_PHRASES = [
  'AI Engineer',
  'Agentic AI Developer',
  'LLM Engineering Enthusiast',
  'Machine Learning Developer',
];

export const Hero: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      setText(TYPING_PHRASES[0]);
      return;
    }

    const currentPhrase = TYPING_PHRASES[phraseIndex];
    const typingSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (text.length < currentPhrase.length) {
          setText(currentPhrase.slice(0, text.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        if (text.length > 0) {
          setText(currentPhrase.slice(0, text.length - 1));
        } else {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % TYPING_PHRASES.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [text, isDeleting, phraseIndex, reducedMotion]);

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center pt-28 pb-16 md:py-24 overflow-hidden"
    >
      {/* Background Gradients & Technical Grid */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Soft radial blue gradient top-left */}
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-accent/15 rounded-full blur-[120px] transform-gpu" />
        {/* Soft radial purple gradient top-right */}
        <div className="absolute top-12 -right-24 w-[450px] h-[450px] bg-accent-2/15 rounded-full blur-[120px] transform-gpu" />
        {/* Faint 48px technical grid fading out */}
        <div className="absolute inset-0 bg-tech-grid opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />
      </div>

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Content */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-chip-bg border border-chip-border mb-6 self-start max-w-full">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse shrink-0" />
              <span className="font-mono text-xs text-text-muted truncate">
                AI Engineer | Agentic AI | LLM Inference & Optimization | RAG
              </span>
            </div>

            {/* H1 Headline */}
            <h1 className="text-[36px] sm:text-[46px] md:text-[56px] lg:text-[64px] font-extrabold text-text tracking-[-0.03em] leading-[1.05] mb-6">
              Building Intelligent Systems with{' '}
              <span className="text-accent underline decoration-accent/30 decoration-wavy decoration-2">
                AI, Agents
              </span>{' '}
              & LLMs.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-6 max-w-xl">
              I'm <strong className="text-text font-semibold">{resumeContent.personal.name}</strong>, an aspiring AI Engineer focused on Agentic AI, LLM inference optimization, and building practical machine learning systems.
            </p>

            {/* Typing line */}
            <div className="h-10 flex items-center font-mono text-sm sm:text-base text-text-body bg-chip-bg/80 border border-chip-border/60 px-4 py-2 rounded-lg max-w-md mb-8">
              <span className="text-accent-2 font-bold mr-2.5">&gt;</span>
              <span className="text-text font-medium">{text}</span>
              <span className="inline-block w-2 h-4 bg-accent ml-1 animate-pulse" />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <Button
                variant="primary"
                size="default"
                asLink
                href="#projects"
                aria-label="Explore my featured AI projects"
              >
                <span>Explore My Projects</span>
                <ArrowDown className="w-4 h-4 ml-2" />
              </Button>

              <Button
                variant="secondary"
                size="default"
                asLink
                href="/documents/Tanish_Kumar_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download Tanish Kumar Resume PDF"
              >
                <FileText className="w-4 h-4 mr-2 text-accent" />
                <span>Download Resume</span>
              </Button>

              <Button
                variant="secondary"
                size="default"
                asLink
                href="#contact"
                aria-label="Contact Tanish Kumar"
              >
                <Send className="w-4 h-4 mr-2" />
                <span>Contact Me</span>
              </Button>
            </div>
          </div>

          {/* Right Column: 4:5 Photo Frame with decorative node network */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[4/5]">
              {/* Decorative node-and-line network SVG behind the photo */}
              <svg
                className="absolute -top-6 -left-6 -right-6 -bottom-6 w-[calc(100%+48px)] h-[calc(100%+48px)] pointer-events-none opacity-40 z-0"
                viewBox="0 0 400 500"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line x1="40" y1="60" x2="160" y2="40" stroke="#4F8CFF" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="160" y1="40" x2="360" y2="100" stroke="#8B5CF6" strokeWidth="1" />
                <line x1="360" y1="100" x2="340" y2="380" stroke="#4F8CFF" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="40" y1="60" x2="50" y2="420" stroke="#8B5CF6" strokeWidth="1" />
                <line x1="50" y1="420" x2="340" y2="380" stroke="#4F8CFF" strokeWidth="1" />
                
                <circle cx="40" cy="60" r="3" fill="#4F8CFF" />
                <circle cx="160" cy="40" r="4" fill="#8B5CF6" />
                <circle cx="360" cy="100" r="3" fill="#4F8CFF" />
                <circle cx="340" cy="380" r="4" fill="#8B5CF6" />
                <circle cx="50" cy="420" r="3" fill="#4F8CFF" />
              </svg>

              {/* Photo Frame Container */}
              <div className="relative w-full h-full rounded-[24px] border border-[#2A3A5C] bg-card p-2 shadow-[0_0_35px_rgba(79,140,255,0.15)] overflow-hidden z-10 group">
                <img
                  src="/images/tanish.jpg"
                  alt="Tanish Kumar - AI Engineer"
                  className="w-full h-full object-cover rounded-[18px] filter contrast-[1.02] brightness-95 group-hover:scale-[1.01] transition-transform duration-300"
                  loading="eager"
                  onError={(e) => {
                    // Fallback to placeholder panel if photo fails to load
                    const target = e.currentTarget;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      const placeholder = document.createElement('div');
                      placeholder.className =
                        'w-full h-full flex flex-col items-center justify-center bg-card text-text-muted p-6 text-center font-mono text-sm';
                      placeholder.innerHTML = `
                        <div class="w-16 h-16 rounded-full bg-chip-bg border border-chip-border flex items-center justify-center text-accent text-2xl font-bold mb-3">TK</div>
                        <p class="font-semibold text-text">Tanish Kumar</p>
                        <p class="text-xs text-text-muted mt-1">Profile Photo Placeholder</p>
                      `;
                      parent.appendChild(placeholder);
                    }
                  }}
                />

                {/* Subtle bottom badge over image */}
                <div className="absolute bottom-4 left-4 right-4 bg-bg/90 backdrop-blur-md border border-card-border px-3.5 py-2 rounded-xl flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-mono text-xs text-text font-medium">Open to AI/ML Roles</span>
                  </div>
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
