import React, { useState } from 'react';
import { resumeContent, FeaturedProject, CompactProject } from '../../data/content';
import { SectionHeading } from '../ui/SectionHeading';
import { LargeProjectCard, CompactProjectCard } from '../ui/ProjectCard';
import { ProjectModal } from '../ui/ProjectModal';

export const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<
    FeaturedProject | CompactProject | null
  >(null);

  return (
    <section id="projects" className="py-20 md:py-24 bg-bg-alt border-t border-border-separator">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Systems I have"
          titleAccent="built."
          subtitle="Engineered systems with measurable performance, reproducible benchmarks, and rigorous evaluation architectures."
        />

        {/* Featured Projects 1 to 3: Large horizontal cards */}
        <div className="space-y-8 mb-12">
          {resumeContent.featuredProjects.map((project, index) => (
            <LargeProjectCard
              key={project.id}
              project={project}
              index={index}
              onOpenModal={(p) => setSelectedProject(p)}
            />
          ))}
        </div>

        {/* Compact Projects 4 and 5 */}
        <div className="pt-4">
          <div className="flex items-center gap-2 mb-6">
            <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
              Additional Engineering Work
            </span>
            <div className="h-px bg-card-border flex-1" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resumeContent.compactProjects.map((project, index) => (
              <CompactProjectCard
                key={project.id}
                project={project}
                index={index + 3}
                onOpenModal={(p) => setSelectedProject(p)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Project Detail Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
