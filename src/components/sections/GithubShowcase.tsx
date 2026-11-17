import React from 'react';
import { Github, ExternalLink, GitBranch, Terminal } from 'lucide-react';
import { resumeContent } from '../../data/content';
import { Button } from '../ui/Button';

const REPOSITORIES = [
  {
    name: 'QUANTORA',
    url: 'https://github.com/Tanish-o9/QUANTORA',
    desc: 'LLM Performance & Optimization Engineering Platform',
  },
  {
    name: 'Pramaan.ai',
    url: 'https://github.com/Tanish-o9/Pramaan.ai',
    desc: 'Face + Voice Biometric Attendance & Governance',
  },
  {
    name: 'WhyTrace.ai',
    url: 'https://github.com/Tanish-o9/WhyTrace.ai',
    desc: 'Interpretability-First Evaluation Harness for AI Agents',
  },
  {
    name: 'LLM-Data-Engine',
    url: 'https://github.com/Tanish-o9/LLM-Data-Engine',
    desc: 'Data quality & fine-tuning pipeline for LLMs',
  },
  {
    name: 'Mini-Vision-Language-Model',
    url: 'https://github.com/Tanish-o9/Mini-Vision-Language-Model',
    desc: 'Lightweight multimodal vision-language model',
  },
];

export const GithubShowcase: React.FC = () => {
  return (
    <section className="py-16 bg-bg-alt border-t border-border-separator">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="rounded-card bg-card border border-card-border p-6 sm:p-8 lg:p-10 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-card-border/80">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-chip-bg border border-chip-border mb-3 font-mono text-xs text-accent">
                <Github className="w-3.5 h-3.5" />
                <span>Open Source Engineering</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-text font-mono">
                github.com/Tanish-o9
              </h3>
              <p className="text-sm sm:text-base text-text-body mt-2 max-w-xl">
                Open source machine learning, agentic evaluation harnesses, and inference benchmarking repositories with reproducible benchmarks.
              </p>
            </div>

            <Button
              variant="primary"
              size="default"
              asLink
              href={resumeContent.personal.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View all repositories on GitHub"
            >
              <Github className="w-4 h-4 mr-2" />
              View all repositories
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Repos list */}
          <div className="pt-8">
            <span className="font-mono text-xs text-text-muted uppercase tracking-wider block mb-4">
              Featured Code Repositories
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {REPOSITORIES.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-chip-bg border border-chip-border hover:border-accent/50 transition-all duration-200 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-text font-mono text-sm font-semibold mb-2 group-hover:text-accent transition-colors">
                      <div className="flex items-center gap-2">
                        <Terminal className="w-3.5 h-3.5 text-accent" />
                        <span>{repo.name}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {repo.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-chip-border/50 flex items-center gap-1.5 text-[11px] font-mono text-text-muted">
                    <GitBranch className="w-3 h-3 text-accent" />
                    <span>main</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
