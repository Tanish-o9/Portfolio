import React, { useState, useEffect } from 'react';
import { ArrowUp, Github, Linkedin, Mail } from 'lucide-react';
import { resumeContent } from '../../data/content';

export const Footer: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative bg-bg border-t border-border-separator py-12 md:py-16 text-text">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-card-border/60">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-md bg-chip-bg border border-chip-border flex items-center justify-center font-mono font-bold text-accent text-xs">
                TK
              </div>
              <span className="font-semibold text-lg text-text">
                {resumeContent.personal.name}
              </span>
              <span className="text-text-muted text-sm font-mono">// AI Engineer</span>
            </div>
            <p className="text-sm text-text-muted">
              Designed & Built by {resumeContent.personal.name}.
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            <a
              href={resumeContent.personal.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              className="w-10 h-10 rounded-lg border border-secondary-border bg-secondary-btn flex items-center justify-center text-text-body hover:text-accent hover:border-accent transition-colors"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href={resumeContent.personal.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              className="w-10 h-10 rounded-lg border border-secondary-border bg-secondary-btn flex items-center justify-center text-text-body hover:text-accent hover:border-accent transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${resumeContent.personal.email}`}
              aria-label="Email Tanish Kumar"
              className="w-10 h-10 rounded-lg border border-secondary-border bg-secondary-btn flex items-center justify-center text-text-body hover:text-accent hover:border-accent transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-muted font-mono">
          <p>© {currentYear} Tanish Kumar. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#about" className="hover:text-text transition-colors">
              About
            </a>
            <a href="#skills" className="hover:text-text transition-colors">
              Skills
            </a>
            <a href="#projects" className="hover:text-text transition-colors">
              Projects
            </a>
            <button
              onClick={scrollToTop}
              className="hover:text-accent transition-colors flex items-center gap-1 focus:outline-none focus:ring-1 focus:ring-accent rounded px-1"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top of page"
          className="fixed bottom-6 right-6 z-30 w-11 h-11 rounded-full bg-card border border-accent/40 text-accent hover:bg-accent hover:text-[#06101F] shadow-lg flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
};
