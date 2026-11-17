import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, ExternalLink, Github } from 'lucide-react';
import { resumeContent } from '../../data/content';
import { useGameStore } from '../../state/gameStore';

export const TerminalPanel: React.FC = () => {
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

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
            <p><span className="text-emerald-400 w-24 inline-block font-mono">projects</span> - View featured AI systems & metrics</p>
            <p><span className="text-emerald-400 w-24 inline-block font-mono">benchmarks</span> - Inspect QUANTORA GPU benchmark results</p>
            <p><span className="text-emerald-400 w-24 inline-block font-mono">contact</span> - Show coordinates</p>
            <p><span className="text-emerald-400 w-24 inline-block font-mono">github</span> - Open github.com/Tanish-o9</p>
            <p><span className="text-emerald-400 w-24 inline-block font-mono">clear</span> - Clear terminal screen</p>
          </div>
        );
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
            {resumeContent.technicalSkills.map((s) => (
              <div key={s.category}>
                <span className="text-amber-400 font-bold">{s.category}:</span>{' '}
                <span className="text-zinc-300">{s.skills.join(', ')}</span>
              </div>
            ))}
          </div>
        );
        break;

      case 'projects':
        output = (
          <div className="space-y-2 text-xs">
            {resumeContent.featuredProjects.map((p) => (
              <div key={p.id} className="border-l-2 border-emerald-500 pl-2">
                <span className="text-emerald-400 font-bold">{p.name}</span> &mdash;{' '}
                <span className="text-zinc-400">{p.subtitle}</span>
                <p className="text-zinc-300 text-[11px]">{p.overview}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'benchmarks':
        output = (
          <div className="space-y-1 text-xs bg-zinc-900/80 p-2.5 rounded border border-zinc-800">
            <p className="text-cyan-400 font-bold">QUANTORA: Qwen2.5-0.5B on RTX 2050 (4 GB)</p>
            <p className="text-emerald-400 font-mono">INT4 NF4 VRAM Reduction: 76% (1,903 MB &rarr; 458 MB)</p>
            <p className="text-emerald-400 font-mono">FP16 Memory Reduction: 50%</p>
            <p className="text-emerald-400 font-mono">KV-Cache Acceleration: 1.19x Speedup</p>
            <p className="text-amber-400 font-mono">Metrics tracked: TTFT, TPOT, P95, ROUGE, Perplexity</p>
          </div>
        );
        break;

      case 'contact':
        output = (
          <div className="space-y-1 text-xs">
            <p>Email: <a href={`mailto:${resumeContent.personal.email}`} className="text-cyan-400 hover:underline">{resumeContent.personal.email}</a></p>
            <p>GitHub: <a href={resumeContent.personal.githubUrl} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">{resumeContent.personal.github}</a></p>
            <p>Location: {resumeContent.personal.location}</p>
          </div>
        );
        break;

      case 'github':
        window.open('https://github.com/Tanish-o9', '_blank');
        output = <p className="text-xs text-emerald-400">Opening https://github.com/Tanish-o9...</p>;
        break;

      case 'clear':
        setHistory([]);
        setInputVal('');
        return;

      default:
        output = (
          <p className="text-xs text-rose-400 font-mono">
            zsh: command not found: {raw}. Type <span className="text-amber-400">help</span> for commands.
          </p>
        );
    }

    setHistory((prev) => [...prev, { cmd: raw, output }]);
    setInputVal('');
  };

  return (
    <div className="space-y-4 font-mono">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between p-2 bg-[#111B2D] border-2 border-[#3A2A1E] rounded-xl text-xs text-zinc-300">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-white">tanish@gpu-node:~</span>
        </div>
        <a
          href="https://github.com/Tanish-o9"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-1 bg-[#266F73] text-white rounded-lg font-bold hover:bg-[#2e8a8f] transition-colors"
        >
          <Github className="w-3.5 h-3.5" />
          <span>github.com/Tanish-o9</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Terminal Screen (CRT retro style) */}
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
            placeholder="Type 'help' or any command..."
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
