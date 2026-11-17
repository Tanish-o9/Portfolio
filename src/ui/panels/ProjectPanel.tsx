import React, { useState } from 'react';
import { resumeContent } from '../../data/content';
import { Github, ExternalLink, Cpu, Gauge, ScanFace, Activity, ShieldCheck, Play, CheckCircle } from 'lucide-react';
import { soundEffects } from '../../game/systems/soundEffects';
import { useGameStore } from '../../state/gameStore';

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

  // Pramaan.ai Biometric Scanner State
  const [isScanningBiometrics, setIsScanningBiometrics] = useState(false);
  const [biometricsVerified, setBiometricsVerified] = useState(true);

  // WhyTrace.ai Agent Trace State
  const [activeTraceStep, setActiveTraceStep] = useState(3);

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
    if (mode === 'INT4 NF4') {
      useGameStore.getState().completeQuest('quantora_sim');
    }
  };

  const handleRunBiometricScan = () => {
    setIsScanningBiometrics(true);
    soundEffects.playClick();
    setTimeout(() => {
      setIsScanningBiometrics(false);
      setBiometricsVerified(true);
      soundEffects.playEnter();
    }, 1000);
  };

  const handleStepTrace = () => {
    soundEffects.playClick();
    setActiveTraceStep((prev) => (prev + 1) % 5);
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

        {/* PRAMAAN.AI LIVE MULTI-MODAL BIOMETRIC SIMULATOR */}
        {currentProject.id === 'pramaan-ai' && (
          <div className="p-4 bg-white/70 border-2 border-[#3A2A1E] rounded-xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ScanFace className="w-4 h-4 text-[#7B6BC4]" />
                <span className="text-xs font-mono font-extrabold uppercase text-[#3A2A1E]">
                  Multi-Modal Biometric Scanner
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-bold">
                FAR &lt; 0.4% Target
              </span>
            </div>

            {/* Simulated Scanner Visualizer */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#111B2D] border-2 border-[#3A2A1E] rounded-xl text-white">
              {/* Face Landmark Mesh */}
              <div className="flex flex-col items-center justify-center p-3 bg-black/40 rounded-lg relative overflow-hidden">
                <div className={`w-14 h-14 rounded-full border-2 ${isScanningBiometrics ? 'border-cyan-400 animate-spin' : 'border-emerald-400'} flex items-center justify-center relative`}>
                  <ScanFace className="w-8 h-8 text-cyan-300" />
                  <span className="absolute top-1 left-2 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="absolute bottom-1 right-2 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </div>
                <span className="text-[10px] font-mono mt-2 text-cyan-200">
                  {isScanningBiometrics ? 'Tracking Mesh...' : 'Face Landmarks: 468 pts'}
                </span>
              </div>

              {/* Voice Frequency Waveform */}
              <div className="flex flex-col items-center justify-center p-3 bg-black/40 rounded-lg">
                <div className="flex items-end gap-1 h-12 w-full justify-center">
                  {[18, 36, 48, 24, 40, 16, 32, 44, 20].map((h, i) => (
                    <div
                      key={i}
                      className={`w-1.5 rounded-full transition-all duration-150 ${isScanningBiometrics ? 'bg-cyan-400 animate-pulse' : 'bg-[#7B6BC4]'}`}
                      style={{ height: isScanningBiometrics ? `${Math.random() * 36 + 10}px` : `${h}px` }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-mono mt-2 text-purple-200">
                  Voiceprint: MFCC Filtered
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleRunBiometricScan}
                disabled={isScanningBiometrics}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7B6BC4] text-white font-bold rounded-lg text-xs border border-[#3A2A1E] shadow-[0_2px_0_#3A2A1E] hover:bg-[#6858af] active:translate-y-0.5"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>{isScanningBiometrics ? 'Verifying...' : 'Test Biometric Auth'}</span>
              </button>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Liveness: {biometricsVerified ? 'Verified PASS' : 'Scanning'}</span>
              </div>
            </div>
          </div>
        )}

        {/* WHYTRACE.AI LIVE AGENT REASONING TRACE VISUALIZER */}
        {currentProject.id === 'whytrace-ai' && (
          <div className="p-4 bg-white/70 border-2 border-[#3A2A1E] rounded-xl shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#D9A441]" />
                <span className="text-xs font-mono font-extrabold uppercase text-[#3A2A1E]">
                  Agent Interpretability Decision Trace
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 rounded font-bold">
                ReAct Decision Graph
              </span>
            </div>

            {/* Step Trace Progression */}
            <div className="space-y-1.5 font-mono text-xs">
              {[
                { step: 0, tag: 'PROMPT', text: 'Analyze multi-agent LLM latency bottlenecks on GPU.' },
                { step: 1, tag: 'THOUGHT', text: 'Detecting tool dependencies: CUDA profiler required.' },
                { step: 2, tag: 'ACTION', text: 'Call tool: cuda_kernel_profiler(target="qwen2.5")' },
                { step: 3, tag: 'GUARDRAIL', text: 'Hallucination Check: Verified citations (Score 0.01)' },
                { step: 4, tag: 'RESPONSE', text: 'Grounded output synthesized with zero hallucination.' },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`p-2 rounded-lg border transition-all flex items-start gap-2 ${
                    activeTraceStep >= item.step
                      ? 'bg-[#111B2D] text-white border-[#3A2A1E]'
                      : 'bg-white/40 text-[#4A382B]/40 border-dashed border-[#3A2A1E]/20'
                  }`}
                >
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    item.tag === 'GUARDRAIL' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-cyan-500/20 text-cyan-300'
                  }`}>
                    {item.tag}
                  </span>
                  <span className="text-[11px] leading-tight flex-1">{item.text}</span>
                  {activeTraceStep >= item.step && (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                onClick={handleStepTrace}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D9A441] text-[#3A2A1E] font-bold rounded-lg text-xs border border-[#3A2A1E] shadow-[0_2px_0_#3A2A1E] hover:bg-[#e6b34e] active:translate-y-0.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Step Next Trace ({activeTraceStep + 1}/5)</span>
              </button>
              <span className="text-[11px] text-[#4A382B] font-mono">
                Real-Time Tool-Calling Evaluation
              </span>
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
