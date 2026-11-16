import React, { useState } from 'react';
import { resumeContent } from '../../data/content';
import { Github, ExternalLink, Cpu, Gauge } from 'lucide-react';
import { soundEffects } from '../../game/systems/soundEffects';

interface ProjectPanelProps {
  initialProjectId?: string | null;
}

type PrecisionMode = 'FP32' | 'FP16' | 'BF16' | 'INT8' | 'INT4 NF4';

const VRAM_BENCHMARKS: Record<
  PrecisionMode,
  { vramMB: number; percentDrop: number; barPercent: number; speedup: string }
> = {
  FP32: { vramMB: 1903, percentDrop: 0, barPercent: 100, speedup: '1.00x' },
  FP16: { vramMB: 952, percentDrop: 50, barPercent: 50, speedup: '1.12x' },
  BF16: { vramMB: 952, percentDrop: 50, barPercent: 50, speedup: '1.10x' },
  INT8: { vramMB: 580, percentDrop: 70, barPercent: 30, speedup: '1.15x' },
  'INT4 NF4': { vramMB: 458, percentDrop: 76, barPercent: 24, speedup: '1.19x' },
};

export const ProjectPanel: React.FC<ProjectPanelProps> = ({ initialProjectId }) => {
  const allProjects = [
    ...resumeContent.featuredProjects,
    ...resumeContent.compactProjects,
  ];

  const defaultId = initialProjectId || allProjects[0].id;
  const [selectedId, setSelectedId] = useState(defaultId);

  // QUANTORA Interactive Simulator State
  const [selectedPrecision, setSelectedPrecision] = useState<PrecisionMode>('INT4 NF4');
  const [kvCacheEnabled, setKvCacheEnabled] = useState(true);

  const currentProject = allProjects.find((p) => p.id === selectedId) || allProjects[0];
  const isFeatured = 'overview' in currentProject;
  const featured = isFeatured ? (currentProject as (typeof resumeContent.featuredProjects)[0]) : null;

  const currentBench = VRAM_BENCHMARKS[selectedPrecision];

  const handleTabChange = (id: string) => {
    setSelectedId(id);
    soundEffects.playClick();
  };

  const handlePrecisionChange = (mode: PrecisionMode) => {
    setSelectedPrecision(mode);
    soundEffects.playClick();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
      {/* Left Column: 5 Project Tabs */}
      <div className="md:col-span-4 flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
        {allProjects.map((p, idx) => {
          const isSelected = p.id === currentProject.id;
          return (
            <button
              key={p.id}
              onClick={() => handleTabChange(p.id)}
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

        {/* QUANTORA Interactive Live Simulator */}
        {currentProject.id === 'quantora' && (
          <div className="p-4 bg-[#FFF1D6] border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#D9503F]">
                <Gauge className="w-4 h-4" />
                <span>Live GPU Benchmark Simulator (RTX 2050 4 GB)</span>
              </div>
              <button
                onClick={() => {
                  setKvCacheEnabled(!kvCacheEnabled);
                  soundEffects.playClick();
                }}
                className={`px-2.5 py-0.5 text-[10px] font-mono font-bold rounded border border-[#3A2A1E] transition-all ${
                  kvCacheEnabled
                    ? 'bg-[#266F73] text-white shadow-sm'
                    : 'bg-white text-[#4A382B]'
                }`}
              >
                KV-Cache: {kvCacheEnabled ? 'ON (1.19x)' : 'OFF (1.00x)'}
              </button>
            </div>

            {/* Precision Selectors */}
            <div className="flex flex-wrap gap-1.5">
              {(['FP32', 'FP16', 'BF16', 'INT8', 'INT4 NF4'] as PrecisionMode[]).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handlePrecisionChange(mode)}
                  className={`px-2.5 py-1 text-xs font-mono font-bold rounded-lg border-2 border-[#3A2A1E] transition-all ${
                    selectedPrecision === mode
                      ? 'bg-[#F6B73C] shadow-[0_2px_0_#3A2A1E] scale-105'
                      : 'bg-white/80 hover:bg-white text-[#4A382B]'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Dynamic VRAM Bar */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs font-mono font-bold text-[#3A2A1E]">
                <span>Peak VRAM Allocation:</span>
                <span className="text-[#D9503F]">{currentBench.vramMB} MB ({currentBench.percentDrop > 0 ? `-${currentBench.percentDrop}%` : 'Baseline'})</span>
              </div>
              <div className="w-full h-4 bg-white border-2 border-[#3A2A1E] rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] rounded-full transition-all duration-300"
                  style={{ width: `${currentBench.barPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-[#3A2A1E]/70 pt-0.5">
                <span>INT4 NF4: 458 MB</span>
                <span>Speedup: {kvCacheEnabled ? currentBench.speedup : '1.00x'}</span>
                <span>FP32: 1,903 MB</span>
              </div>
            </div>
          </div>
        )}

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
