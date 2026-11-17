import { resumeContent } from './content';

export const featuredProjects = resumeContent.featuredProjects;
export const compactProjects = resumeContent.compactProjects;
export const allProjects = [...featuredProjects, ...compactProjects];
