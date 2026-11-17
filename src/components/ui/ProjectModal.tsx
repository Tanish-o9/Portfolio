import React, { useEffect } from 'react';
import { X, Github, ExternalLink, Cpu, CheckCircle2, AlertTriangle, Layers, BarChart2 } from 'lucide-react';
import { FeaturedProject, CompactProject } from '../../data/content';
import { Badge } from './Badge';
import { MetricCard } from './MetricCard';
import { Button } from './Button';

interface ProjectModalProps {
  project: FeaturedProject | CompactProject | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const isFeatured = 'overview' in project;
  const featured = isFeatured ? (project as FeaturedProject) : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card border border-card-border rounded-2xl p-6 sm:p-8 shadow-2xl text-text my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close project modal"
          className="absolute top-5 right-5 p-2 rounded-lg text-text-muted hover:text-text hover:bg-chip-bg border border-transparent hover:border-chip-border transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 pr-8">
          <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-xs">
            {featured?.date && (
              <span className="text-text-muted">{featured.date}</span>
            )}
            {featured?.benchmarkContext && (
              <span className="text-accent bg-accent/10 border border-accent/20 px-2 py-0.5 rounded">
                {featured.benchmarkContext}
              </span>
            )}
          </div>
          <h2 id="modal-title" className="text-2xl sm:text-3xl font-bold text-text mb-2">
            {project.name}
          </h2>
          {featured?.subtitle && (
            <p className="text-accent text-sm sm:text-base font-mono">
              {featured.subtitle}
            </p>
          )}
        </div>

        {/* Action button */}
        <div className="flex flex-wrap items-center gap-3 mb-8 pb-6 border-b border-card-border">
          <Button
            variant="primary"
            size="compact"
            asLink
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Github className="w-4 h-4 mr-2" />
            Repository on GitHub
            <ExternalLink className="w-3.5 h-3.5 ml-1.5 opacity-70" />
          </Button>
        </div>

        {/* Modal content body */}
        <div className="space-y-8">
          {/* Overview */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-accent mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4" /> System Overview
            </h3>
            <p className="text-text-body text-sm sm:text-base leading-relaxed">
              {featured ? featured.overview : (project as CompactProject).description}
            </p>
          </div>

          {/* Problem Statement (if present) */}
          {featured?.problemStatement && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-accent mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Engineering Problem
              </h3>
              <p className="text-text-body text-sm sm:text-base leading-relaxed">
                {featured.problemStatement}
              </p>
            </div>
          )}

          {/* Verified Metrics (if present) */}
          {featured?.metrics && featured.metrics.length > 0 && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-accent mb-3 flex items-center gap-2">
                <BarChart2 className="w-4 h-4" /> Benchmarked & Verified Metrics
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {featured.metrics.map((m, idx) => (
                  <MetricCard key={idx} value={m.value} label={m.label} />
                ))}
              </div>
            </div>
          )}

          {/* Key Features (if present) */}
          {featured?.features && featured.features.length > 0 && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-accent mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Technical Capabilities
              </h3>
              <ul className="space-y-2">
                {featured.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start text-sm text-text-body">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 mr-3 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Engineering Challenges (if present) */}
          {featured?.engineeringChallenges && featured.engineeringChallenges.length > 0 && (
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-accent mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-accent-2" /> Engineering Challenges & Solutions
              </h3>
              <ul className="space-y-2">
                {featured.engineeringChallenges.map((challenge, idx) => (
                  <li key={idx} className="flex items-start text-sm text-text-body">
                    <span className="w-1.5 h-1.5 rounded-sm bg-accent-2 mt-2 mr-3 shrink-0" />
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Results Summary (if present) */}
          {featured?.resultsSummary && (
            <div className="p-4 rounded-xl bg-chip-bg border border-chip-border">
              <h4 className="text-xs font-mono uppercase tracking-wider text-accent mb-1">
                Outcome & Findings
              </h4>
              <p className="text-sm text-text-body leading-relaxed">
                {featured.resultsSummary}
              </p>
            </div>
          )}

          {/* Technologies Used */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-wider text-accent mb-3">
              Technologies & Frameworks
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <Badge key={t} variant="tech">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
