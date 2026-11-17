import React from 'react';
import { LargeProjectCard } from '../components/ui/ProjectCard';
import { resumeContent, FeaturedProject } from '../data/content';

export const ProjectDetailPage: React.FC<{ projectId?: string }> = ({ projectId }) => {
  const project = resumeContent.featuredProjects.find((p) => p.id === projectId) || resumeContent.featuredProjects[0];

  return (
    <div className="min-h-screen bg-bg text-text py-20 px-4 sm:px-8 max-w-[1200px] mx-auto">
      <div className="mb-8">
        <a href="/" className="text-accent font-mono text-sm hover:underline">
          &larr; Back to Portfolio
        </a>
      </div>
      <LargeProjectCard
        project={project}
        index={0}
        onOpenModal={(p: FeaturedProject) => {
          console.log('Project opened', p.name);
        }}
      />
    </div>
  );
};

export default ProjectDetailPage;
