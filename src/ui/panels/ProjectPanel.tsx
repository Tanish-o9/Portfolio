import React, { useState } from 'react';
import { resumeContent } from '../../data/content';
import { Github, ExternalLink, Cpu } from 'lucide-react';

interface ProjectPanelProps {
  initialProjectId?: string | null;
}

export const ProjectPanel: React.FC<ProjectPanelProps> = ({ initialProjectId }) => {
  const allProjects = [
    ...resumeContent.featuredProjects,
    ...resumeContent.compactProjects,
  ];

  const defaultId = initialProjectId || allProjects[0].id;
  const [selectedId, setSelectedId] = useState(defaultId);

  const currentProject = allProjects.find((p) => p.id === selectedId) || allProjects[0];
  const isFeatured = 'overview' in currentProject;
  const featured = isFeatured ? (currentProject as (typeof resumeContent.featuredProjects)[0]) : null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Left Column: 5 Project Tabs */}
      <div className="md:col-span-4 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
        {allProjects.map((p, idx) => {
          const isSelected = p.id === currentProject.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`p-3 rounded-xl border-2 border-[#3A2A1E] text-left transition-all shrink-0 md:shrink ${
                isSelected
                  ? 'bg-[#F6B73C] shadow-[0_3px_0_#3A2A1E] font-bold text-[#3A2A1E]'
                  : 'bg-white/80 hover:bg-white text-[#4A382B]'
              }`}
            >
              <div className="font-mono text-[10px] opacity-75">0{idx + 1}</div>
              <div className="font-bold text-xs sm:text-sm truncate">{p.name}</div>
            </button>
          );
        })}
      </div>

      {/* Right Column: Project Details */}
      <div className="md:col-span-8 space-y-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1 text-xs font-mono text-[#266F73]">
            {featured?.date && <span>{featured.date}</span>}
            {featured?.benchmarkContext && (
              <span className="bg-[#FFF1D6] px-2 py-0.5 rounded border border-[#3A2A1E]/30 text-[#D9503F] font-bold">
                {featured.benchmarkContext}
              </span>
            )}
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#3A2A1E]">
            {currentProject.name}
          </h3>
          {featured?.subtitle && (
            <p className="text-xs sm:text-sm font-medium text-[#266F73] mt-0.5">
              {featured.subtitle}
            </p>
          )}
        </div>

        {/* Overview */}
        <p className="text-sm leading-relaxed text-[#4A382B]">
          {featured
            ? featured.overview
            : (currentProject as (typeof resumeContent.compactProjects)[0]).description}
        </p>

        {/* Verified Metrics (if featured) */}
        {featured?.metrics && featured.metrics.length > 0 && (
          <div>
            <div className="text-xs font-mono font-bold uppercase text-[#D9503F] mb-2 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> Benchmarked Metrics
            </div>
            <div className="grid grid-cols-2 gap-2">
              {featured.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-white border border-[#3A2A1E]/40 rounded-lg shadow-sm"
                >
                  <div className="font-mono font-bold text-sm text-[#266F73]">
                    {m.value}
                  </div>
                  <div className="text-[11px] text-[#4A382B]/80">{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {currentProject.technologies.map((t) => (
            <span
              key={t}
              className="px-2 py-1 bg-[#FFF6E3] border border-[#3A2A1E]/40 rounded-md font-mono text-[11px] font-semibold text-[#3A2A1E]"
            >
              {t}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="pt-2">
          <a
            href={currentProject.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#266F73] text-white border-2 border-[#3A2A1E] rounded-xl font-bold text-xs sm:text-sm shadow-[0_3px_0_#3A2A1E] hover:bg-[#2e8a8f] active:translate-y-0.5 active:shadow-none transition-all"
          >
            <Github className="w-4 h-4" />
            <span>View on GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
