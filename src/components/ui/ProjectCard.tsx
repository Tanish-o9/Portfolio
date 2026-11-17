import React from 'react';
import { ExternalLink, Github, ArrowRight } from 'lucide-react';
import { FeaturedProject, CompactProject } from '../../data/content';
import { Badge } from './Badge';
import { MetricCard } from './MetricCard';
import { Button } from './Button';

interface LargeProjectCardProps {
  project: FeaturedProject;
  index: number;
  onOpenModal: (project: FeaturedProject) => void;
}

export const LargeProjectCard: React.FC<LargeProjectCardProps> = ({
  project,
  index,
  onOpenModal,
}) => {
  const formattedIndex = String(index + 1).padStart(2, '0');

  return (
    <article className="rounded-card bg-card border border-card-border p-6 sm:p-8 lg:p-9 transition-all duration-200 hover:border-accent/50 hover:shadow-[0_8px_30px_rgba(79,140,255,0.06)] relative overflow-hidden group">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Info */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-[6px] border border-accent/40 bg-accent/10 text-accent">
                {formattedIndex}
              </span>
              <span className="font-mono text-xs text-text-muted">
                {project.date}
              </span>
              {project.benchmarkContext && (
                <span className="font-mono text-[11px] text-accent-2 bg-accent-2/10 border border-accent-2/30 px-2.5 py-0.5 rounded-[6px]">
                  {project.benchmarkContext}
                </span>
              )}
            </div>

            <p className="text-xs uppercase tracking-wider text-text-muted font-mono mb-1">
              {project.subtitle}
            </p>

            <h3 className="text-2xl sm:text-3xl font-bold text-text mb-3 group-hover:text-accent transition-colors">
              {project.name}
            </h3>

            <p className="text-sm sm:text-base text-text-body leading-relaxed mb-6">
              {project.overview}
            </p>

            {/* Mono tech tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {project.technologies.map((tech) => (
                <Badge key={tech} variant="tech">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="secondary"
              size="compact"
              asLink
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.name} on GitHub`}
            >
              <Github className="w-4 h-4 mr-2" />
              View on GitHub
            </Button>

            <Button
              variant="primary"
              size="compact"
              onClick={() => onOpenModal(project)}
              aria-label={`View architecture and details for ${project.name}`}
            >
              View System Details
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </div>

        {/* Right column: Metric Cards */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs text-text-muted uppercase tracking-wider">
              Verified Metrics
            </span>
            <span className="text-[11px] font-mono text-accent">Benchmarked</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {project.metrics.map((metric, idx) => (
              <MetricCard
                key={idx}
                value={metric.value}
                label={metric.label}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};

interface CompactProjectCardProps {
  project: CompactProject;
  index: number;
  onOpenModal: (project: CompactProject) => void;
}

export const CompactProjectCard: React.FC<CompactProjectCardProps> = ({
  project,
  index,
  onOpenModal,
}) => {
  const formattedIndex = String(index + 1).padStart(2, '0');

  return (
    <article className="rounded-card bg-card border border-card-border p-6 transition-all duration-200 hover:border-accent/40 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-[6px] border border-accent/40 bg-accent/10 text-accent">
            {formattedIndex}
          </span>
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-accent transition-colors p-1"
            aria-label={`GitHub repo for ${project.name}`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <h3 className="text-xl font-bold text-text mb-2">{project.name}</h3>
        <p className="text-sm text-text-body mb-6 leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.technologies.slice(0, 5).map((tech) => (
            <Badge key={tech} variant="tech">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          variant="secondary"
          size="compact"
          asLink
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <Github className="w-4 h-4 mr-1.5" />
          GitHub
        </Button>
        <Button
          variant="ghost"
          size="compact"
          onClick={() => onOpenModal(project)}
          className="text-xs"
        >
          Details
        </Button>
      </div>
    </article>
  );
};
