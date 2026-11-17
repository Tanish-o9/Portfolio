import React from 'react';
import { Sparkles, Trophy, Cpu, ShieldCheck, Zap, Check } from 'lucide-react';
import { useGameStore } from '../../state/gameStore';
import { soundEffects } from '../../game/systems/soundEffects';

export const EasterEggPanel: React.FC = () => {
  const { selectedProjectId, setHoodieColor, setPet, closePanel } = useGameStore();

  const handleEquipFounder = () => {
    soundEffects.playQuestSuccess();
    setHoodieColor('#F6B73C'); // Cyber Gold
    setPet('cat');
    closePanel();
  };

  if (selectedProjectId === 'chest-2') {
    return (
      <div className="space-y-4 text-[#3A2A1E]">
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#7B6BC4]/20 via-[#FFF6E3] to-[#FFF6E3] border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E]">
          <div className="w-12 h-12 rounded-xl bg-[#7B6BC4] text-white flex items-center justify-center border-2 border-[#3A2A1E] shadow">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#7B6BC4] text-white rounded text-[10px] font-mono font-bold uppercase">
                Secret Easter Egg #2
              </span>
              <span className="text-xs font-mono font-bold text-[#7B6BC4]">Pramaan.ai Deep-Dive</span>
            </div>
            <h3 className="text-lg font-extrabold text-[#3A2A1E]">The 0.942 ROC-AUC Milestone</h3>
          </div>
        </div>

        <div className="p-4 bg-white border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E] space-y-3 text-xs leading-relaxed">
          <p>
            During the development of <strong>Pramaan.ai</strong>, single-modality face authentication failed under extreme low-light campus classrooms and classroom background noise.
          </p>
          <div className="p-3 bg-[#FFF6E3] border border-[#3A2A1E]/30 rounded-lg space-y-1.5">
            <div className="font-bold text-[#266F73] flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#F6B73C]" />
              Multimodal Late Fusion Strategy
            </div>
            <p className="text-[11px] text-[#4A382B]">
              By combining normalized facial embeddings with MFCC voice feature vectors using a weighted cosine distance metric, false acceptance rate was driven down to strictly <strong>&lt; 0.4%</strong> with an overall <strong>0.942 ROC-AUC</strong> validated across 88 rigorous test cases.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (selectedProjectId === 'chest-3') {
    return (
      <div className="space-y-4 text-[#3A2A1E]">
        <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#F6B73C]/25 via-[#FFF6E3] to-[#FFF6E3] border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E]">
          <div className="w-12 h-12 rounded-xl bg-[#F6B73C] text-[#3A2A1E] flex items-center justify-center border-2 border-[#3A2A1E] shadow">
            <Trophy className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#F6B73C] text-[#3A2A1E] rounded text-[10px] font-mono font-bold uppercase">
                Secret Easter Egg #3
              </span>
              <span className="text-xs font-mono font-bold text-amber-700">Legendary Unlock</span>
            </div>
            <h3 className="text-lg font-extrabold text-[#3A2A1E]">Founder Mode Unlocked!</h3>
          </div>
        </div>

        <div className="p-5 bg-white border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E] text-center space-y-3">
          <Sparkles className="w-8 h-8 text-[#F6B73C] mx-auto animate-spin" />
          <p className="text-xs text-[#4A382B] leading-relaxed">
            You explored the furthest corners of Tanish's Village! You have unlocked the exclusive <strong>Cyber Gold Explorer Hoodie</strong> &amp; <strong>Lucky Chibi Cat</strong> companion pet!
          </p>
          <button
            onClick={handleEquipFounder}
            className="w-full py-2.5 bg-[#F6B73C] hover:bg-[#ffc652] text-[#3A2A1E] border-2 border-[#3A2A1E] rounded-xl font-extrabold text-xs shadow-[0_3px_0_#3A2A1E] active:translate-y-0.5 active:shadow-none flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Equip Cyber Gold &amp; Lucky Cat</span>
          </button>
        </div>
      </div>
    );
  }

  // Default / Chest-1: GPU Playbook
  return (
    <div className="space-y-4 text-[#3A2A1E]">
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#266F73]/20 via-[#FFF6E3] to-[#FFF6E3] border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E]">
        <div className="w-12 h-12 rounded-xl bg-[#266F73] text-white flex items-center justify-center border-2 border-[#3A2A1E] shadow">
          <Cpu className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#266F73] text-white rounded text-[10px] font-mono font-bold uppercase">
              Secret Easter Egg #1
            </span>
            <span className="text-xs font-mono font-bold text-[#266F73]">QUANTORA Playbook</span>
          </div>
          <h3 className="text-lg font-extrabold text-[#3A2A1E]">Tanish's 3-Rule LLM Inference Playbook</h3>
        </div>
      </div>

      <div className="p-4 bg-white border-2 border-[#3A2A1E] rounded-xl shadow-[0_3px_0_#3A2A1E] space-y-3 text-xs leading-relaxed">
        <div className="p-2.5 bg-[#FFF6E3] border border-[#3A2A1E]/30 rounded-lg">
          <strong className="block text-[#266F73] font-bold mb-0.5">Rule 1: Memory Bandwidth Over Compute</strong>
          <span>Autoregressive decoding is memory-bandwidth bound. INT4 NF4 weight quantization slashes bus transfer sizes by up to 76% (1,903 MB to 458 MB peak VRAM on RTX 2050).</span>
        </div>

        <div className="p-2.5 bg-[#FFF6E3] border border-[#3A2A1E]/30 rounded-lg">
          <strong className="block text-[#266F73] font-bold mb-0.5">Rule 2: Paged KV-Cache Management</strong>
          <span>Dynamic page block allocation eliminates external fragmentation during long multi-turn tool-calling sessions, giving a 1.19x throughput improvement.</span>
        </div>

        <div className="p-2.5 bg-[#FFF6E3] border border-[#3A2A1E]/30 rounded-lg">
          <strong className="block text-[#266F73] font-bold mb-0.5">Rule 3: Speculative &amp; LoRA Decoupling</strong>
          <span>Keep base model weights in continuous quantized VRAM while streaming rank-decomposed adapter deltas dynamically.</span>
        </div>
      </div>
    </div>
  );
};
