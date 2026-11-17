import React from 'react';
import { FileText, Download, ExternalLink, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export const Resume: React.FC = () => {
  const resumeUrl = '/documents/Tanish_Kumar_Resume.pdf';

  return (
    <section className="py-20 md:py-24 bg-bg border-t border-border-separator">
      <div className="max-w-[920px] mx-auto px-4 sm:px-8 text-center">
        <div className="rounded-card bg-card border border-card-border p-8 sm:p-12 relative overflow-hidden">
          {/* Subtle accent glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-accent/10 rounded-full blur-[60px] pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-chip-bg border border-chip-border mb-6 font-mono text-xs text-accent">
            <FileText className="w-3.5 h-3.5" />
            <span>Curriculum Vitae</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text mb-4">
            Interested in Working Together?
          </h2>

          <p className="text-base sm:text-lg text-text-body max-w-xl mx-auto mb-8 leading-relaxed">
            Explore my technical background, engineering projects, and experience in AI engineering, LLM inference optimization, and agentic systems.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="default"
              asLink
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Tanish Kumar Resume PDF in new tab"
              className="w-full sm:w-auto"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Resume
            </Button>

            <a
              href={resumeUrl}
              download="Tanish_Kumar_Resume.pdf"
              className="w-full sm:w-auto h-12 px-6 text-[15px] min-h-[44px] inline-flex items-center justify-center font-medium transition-all duration-200 border border-secondary-border bg-secondary-btn text-text hover:border-accent hover:bg-card active:scale-[0.98] rounded-btn select-none focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label="Download Tanish Kumar Resume PDF directly"
            >
              <Download className="w-4 h-4 mr-2 text-accent" />
              Download Resume
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-card-border/60 flex flex-wrap items-center justify-center gap-6 text-xs text-text-muted font-mono">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-accent" />
              Single source of truth
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-accent" />
              Empirically verified metrics
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-accent" />
              ATS formatted
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
