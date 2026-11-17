import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, ExternalLink, Github, Gamepad2, Trophy, AlertTriangle } from 'lucide-react';
import { resumeContent } from '../../data/content';
import { useGameStore } from '../../state/gameStore';
import { soundEffects } from '../../game/systems/soundEffects';

export const TerminalPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'terminal' | 'arcade'>('terminal');

  // Terminal state
  const [history, setHistory] = useState<Array<{ cmd: string; output: React.ReactNode }>>([
    {
      cmd: 'welcome',
      output: (
        <div>
          <p className="text-emerald-400 font-bold">
            Tanish Kumar OS v2.5.0-LTS (x86_64-pc-linux-gnu)
          </p>
          <p className="text-zinc-400 text-xs">
            Type <span className="text-amber-400 font-bold">help</span> to list available commands.
          </p>
        </div>
      ),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Arcade Mini-Game state (GPU VRAM Packer)
  const [precision, setPrecision] = useState<'fp16' | 'int8' | 'int4'>('int4');
  const [kvPolicy, setKvPolicy] = useState<'dense' | 'paged'>('paged');
  const [adapter, setAdapter] = useState<'full' | 'lora'>('lora');

  // VRAM calculation
  const getVramUsage = () => {
    let weight = 16.2;
    if (precision === 'int8') weight = 8.4;
    if (precision === 'int4') weight = 4.6;

    let kv = kvPolicy === 'dense' ? 2.1 : 0.7;
    let adapt = adapter === 'full' ? 1.8 : 0.12;

    const rawTotal = weight + kv + adapt;
    // With chunked offloading
    const netGpuVram = precision === 'int4' && kvPolicy === 'paged' ? 3.88 : rawTotal;
    return Number(netGpuVram.toFixed(2));
  };

  const currentVram = getVramUsage();
  const GPU_CAPACITY = 4.0; // 4GB RTX 2050
  const isFits = currentVram <= GPU_CAPACITY;

  useEffect(() => {
    if (activeTab === 'terminal') {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, activeTab]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = inputVal.trim();
    if (!raw) return;

    useGameStore.getState().completeQuest('workshop_terminal');
    const cmd = raw.toLowerCase();
    let output: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        output = (
          <div className="space-y-1 text-xs">
            <p className="text-amber-400 font-bold">Available commands:</p>
            <p><span className="text-emerald-400 w-24 inline-block font-mono">whoami</span> - Display developer summary</p>
            <p><span className="text-emerald-400 w-24 inline-block font-mono">skills</span> - List verified technical stack</p>
            <p><span className="text-emerald-400 w-24 inline-block font-mono">projects</span> - View featured AI systems &amp; metrics</p>
            <p><span className="text-emerald-400 w-24 inline-block font-mono">benchmarks</span> - Inspect QUANTORA GPU benchmark results</p>
            <p><span className="text-emerald-400 w-24 inline-block font-mono">contact</span> - Show coordinates</p>
            <p><span className="text-emerald-400 w-24 inline-block font-mono">github</span> - Open github.com/Tanish-o9</p>
            <p><span className="text-emerald-400 w-24 inline-block font-mono">arcade</span> - Launch GPU VRAM Mini-Game</p>
            <p><span className="text-emerald-400 w-24 inline-block font-mono">clear</span> - Clear terminal screen</p>
          </div>
        );
        break;

      case 'arcade':
        setActiveTab('arcade');
        soundEffects.playQuestSuccess();
        output = <p className="text-amber-400">Launching GPU VRAM Packer Arcade...</p>;
        break;

      case 'whoami':
        output = (
          <div className="space-y-1 text-xs">
            <p className="font-bold text-white">{resumeContent.personal.name}</p>
            <p className="text-cyan-400">{resumeContent.personal.headline}</p>
            <p className="text-zinc-300 mt-1">{resumeContent.personal.professionalSummary}</p>
          </div>
        );
        break;

      case 'skills':
        output = (
          <div className="space-y-2 text-xs">
            {resumeContent.technicalSkills.map((c) => (
              <div key={c.category}>
                <span className="text-amber-300 font-bold">{c.category}: </span>
                <span className="text-zinc-300">{c.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-2 text-xs">
            {resumeContent.featuredProjects.map((p) => (
              <div key={p.id} className="p-2 bg-zinc-900 border border-zinc-700 rounded">
                <p className="text-emerald-400 font-bold">{p.name} - {p.subtitle}</p>
                <p className="text-zinc-400 text-[11px]">{p.overview}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'benchmarks':
        output = (
          <div className="space-y-1 text-xs font-mono text-cyan-300">
            <p className="text-white font-bold">// QUANTORA Verified GPU Benchmarks (Qwen2.5-0.5B / RTX 2050 4GB):</p>
            <p>FP16 Peak VRAM: 1,903 MB</p>
            <p>INT4 NF4 Peak VRAM: 458 MB (-76% Memory Reduction)</p>
            <p>Perplexity Preserved: 98.4%</p>
            <p>Paged KV-Cache Speedup: 1.19x</p>
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="text-xs space-y-1">
            <p>Email: <a href={`mailto:${resumeContent.personal.email}`} className="text-cyan-400 underline">{resumeContent.personal.email}</a></p>
            <p>GitHub: <a href={resumeContent.personal.github} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">{resumeContent.personal.github}</a></p>
            <p>LinkedIn: <a href={resumeContent.personal.linkedin} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">{resumeContent.personal.linkedin}</a></p>
          </div>
        );
        break;

      case 'github':
        window.open(resumeContent.personal.github, '_blank', 'noopener,noreferrer');
        output = <p className="text-zinc-400">Opening {resumeContent.personal.github} in a new tab...</p>;
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        output = (
          <p className="text-rose-400 text-xs">
            Command not found: '{raw}'. Type <span className="text-amber-400 font-bold">help</span> for commands.
          </p>
        );
    }

    setHistory((prev) => [...prev, { cmd: raw, output }]);
    setInputVal('');
  };

  return (
    <div className="space-y-3 font-mono">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-2 bg-[#FFF6E3] border-2 border-[#3A2A1E] rounded-xl shadow-[0_2px_0_#3A2A1E]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEffects.playClick();
              setActiveTab('terminal');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
              activeTab === 'terminal'
                ? 'bg-[#266F73] text-white shadow-[0_2px_0_#3A2A1E]'
                : 'text-[#4A382B] hover:bg-white'
            }`}
          >
            <TerminalIcon className="w-3.5 h-3.5" />
            <span>CLI Terminal</span>
          </button>

          <button
            onClick={() => {
              soundEffects.playQuestSuccess();
              setActiveTab('arcade');
            }}
            className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-all ${
              activeTab === 'arcade'
                ? 'bg-[#F6B73C] text-[#3A2A1E] shadow-[0_2px_0_#3A2A1E]'
                : 'text-[#4A382B] hover:bg-white'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-[#266F73]" />
            <span>GPU VRAM Arcade</span>
          </button>
        </div>

        <a
          href={resumeContent.personal.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-bold text-[#266F73] hover:underline flex items-center gap-1.5"
        >
          <Github className="w-3.5 h-3.5" />
          <span>github.com/Tanish-o9</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {activeTab === 'terminal' ? (
        /* Terminal Screen (CRT retro style) */
        <div
          className="h-[460px] p-4 bg-[#0a0f18] border-2 border-[#3A2A1E] rounded-xl shadow-inner overflow-y-auto text-zinc-200 text-xs sm:text-sm space-y-3 cursor-text"
          onClick={() => inputRef.current?.focus()}
        >
          {history.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="text-emerald-400 font-bold">tanish@ai-village</span>
                <span className="text-amber-400">~</span>
                <span className="text-zinc-500">$</span>
                <span className="text-white font-semibold">{item.cmd}</span>
              </div>
              <div className="pl-4">{item.output}</div>
            </div>
          ))}

          {/* Live Input Prompt */}
          <form onSubmit={handleCommand} className="flex items-center gap-2 text-zinc-400 pt-1">
            <span className="text-emerald-400 font-bold">tanish@ai-village</span>
            <span className="text-amber-400">~</span>
            <span className="text-zinc-500">$</span>
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono text-xs sm:text-sm placeholder:text-zinc-600"
              placeholder="Type 'help', 'arcade', 'benchmarks'..."
            />
          </form>
          <div ref={bottomRef} />
        </div>
      ) : (
        /* Arcade Mini-Game: GPU VRAM Optimizer */
        <div className="p-5 bg-white border-2 border-[#3A2A1E] rounded-xl shadow-[0_4px_0_#3A2A1E] space-y-4 text-[#3A2A1E]">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#3A2A1E]/20">
            <div>
              <span className="text-[10px] font-bold text-[#266F73] uppercase tracking-wider">
                Retro Arcade Challenge
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-[#3A2A1E]">
                Mission: Fit LLM inside 4GB GPU (RTX 2050)
              </h3>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-[#4A382B]/70">GPU Target Limit</span>
              <div className="text-sm font-extrabold text-[#266F73]">4.00 GB</div>
            </div>
          </div>

          {/* Memory Bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span>Current VRAM Footprint:</span>
              <span className={isFits ? 'text-emerald-700' : 'text-rose-600'}>
                {currentVram} GB / 4.00 GB {isFits ? '(FITS!)' : '(OUT OF MEMORY!)'}
              </span>
            </div>
            <div className="w-full h-5 bg-zinc-200 border-2 border-[#3A2A1E] rounded-xl overflow-hidden p-0.5 relative">
              <div
                className={`h-full rounded-lg transition-all duration-300 ${
                  isFits ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-amber-500 to-rose-600'
                }`}
                style={{ width: `${Math.min(100, (currentVram / 16.2) * 100)}%` }}
              />
            </div>
          </div>

          {/* Configuration Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Precision */}
            <div className="p-3 bg-[#FFF6E3] border border-[#3A2A1E]/30 rounded-xl space-y-1.5">
              <label className="text-[11px] font-bold text-[#266F73] block">1. Model Precision</label>
              {(['fp16', 'int8', 'int4'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    soundEffects.playClick();
                    setPrecision(p);
                  }}
                  className={`w-full py-1 px-2 rounded-lg text-xs font-bold uppercase transition-all ${
                    precision === p
                      ? 'bg-[#266F73] text-white shadow-[0_2px_0_#3A2A1E]'
                      : 'bg-white hover:bg-zinc-100 text-[#4A382B]'
                  }`}
                >
                  {p === 'int4' ? 'INT4 NF4 (4.6G)' : p === 'int8' ? 'INT8 (8.4G)' : 'FP16 (16.2G)'}
                </button>
              ))}
            </div>

            {/* KV-Cache Policy */}
            <div className="p-3 bg-[#FFF6E3] border border-[#3A2A1E]/30 rounded-xl space-y-1.5">
              <label className="text-[11px] font-bold text-[#266F73] block">2. KV-Cache Policy</label>
              {(['dense', 'paged'] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => {
                    soundEffects.playClick();
                    setKvPolicy(k);
                  }}
                  className={`w-full py-1 px-2 rounded-lg text-xs font-bold uppercase transition-all ${
                    kvPolicy === k
                      ? 'bg-[#266F73] text-white shadow-[0_2px_0_#3A2A1E]'
                      : 'bg-white hover:bg-zinc-100 text-[#4A382B]'
                  }`}
                >
                  {k === 'paged' ? 'Paged (0.7G)' : 'Dense (2.1G)'}
                </button>
              ))}
            </div>

            {/* Fine-Tuning Delta */}
            <div className="p-3 bg-[#FFF6E3] border border-[#3A2A1E]/30 rounded-xl space-y-1.5">
              <label className="text-[11px] font-bold text-[#266F73] block">3. Adapter Deltas</label>
              {(['full', 'lora'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => {
                    soundEffects.playClick();
                    setAdapter(a);
                  }}
                  className={`w-full py-1 px-2 rounded-lg text-xs font-bold uppercase transition-all ${
                    adapter === a
                      ? 'bg-[#266F73] text-white shadow-[0_2px_0_#3A2A1E]'
                      : 'bg-white hover:bg-zinc-100 text-[#4A382B]'
                  }`}
                >
                  {a === 'lora' ? 'Rank-16 LoRA (0.12G)' : 'Full Copy (1.8G)'}
                </button>
              ))}
            </div>
          </div>

          {/* Victory / Error Result */}
          {isFits ? (
            <div className="p-3.5 bg-emerald-50 border-2 border-emerald-500 rounded-xl flex items-center gap-3">
              <Trophy className="w-6 h-6 text-emerald-600 shrink-0" />
              <div className="text-xs">
                <span className="font-extrabold text-emerald-900 block">
                  🎉 Victory! QUANTORA Optimization Achieved (-76% VRAM)
                </span>
                <span className="text-emerald-800">
                  Model fits comfortably inside 4 GB VRAM with 1.19x speedup and 98.4% perplexity preserved!
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 bg-rose-50 border-2 border-rose-400 rounded-xl flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
              <div className="text-xs">
                <span className="font-extrabold text-rose-900 block">
                  CUDA Out of Memory Error (OOM)!
                </span>
                <span className="text-rose-800">
                  VRAM footprint exceeds 4.0 GB limit. Switch to INT4 NF4 quantization and Paged KV-Cache!
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
