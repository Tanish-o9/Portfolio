import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles } from 'lucide-react';
import { soundEffects } from '../../game/systems/soundEffects';

interface Message {
  role: 'bot' | 'user';
  text: string;
}

const QUICK_QUESTIONS = [
  'Tell me about QUANTORA',
  'What is Pramaan.ai?',
  'What did Tanish do at CCC AKGEC?',
  'What are your LLM & Agentic skills?',
  'How do I contact Tanish?',
];

function getAiResponse(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('quantora') || q.includes('vram') || q.includes('benchmark') || q.includes('gpu')) {
    return `QUANTORA is Tanish's LLM Performance & Optimization Engineering Platform benchmarked on an RTX 2050 (4 GB) GPU with Qwen2.5-0.5B. Key achievements include reducing peak VRAM by 76% (from 1,903 MB to 458 MB) using INT4 NF4 quantization, halving memory footprint via FP16, and accelerating inference 1.19x with KV-cache optimization across 7 metrics (TTFT, TPOT, P95 latency, throughput, peak VRAM, ROUGE, and perplexity).`;
  }

  if (q.includes('pramaan') || q.includes('face') || q.includes('voice') || q.includes('biometric')) {
    return `Pramaan.ai is a multimodal biometric attendance and academic governance platform. It features dlib 128-dimensional ResNet face recognition, EAR-based liveness blink detection, and Resemblyzer 256-dimensional speaker embeddings. It achieved an ML risk-prediction ROC-AUC of 0.942 with False Acceptance Rate (FAR) below 0.4% across 88 automated tests.`;
  }

  if (q.includes('whytrace') || q.includes('agent') || q.includes('detective') || q.includes('failure')) {
    return `WhyTrace.ai is an interpretability-first evaluation harness for tool-calling AI agents. It diagnoses failure root causes across a 7-category taxonomy using counterfactual replay and Causal Failure Graphs. It includes majority-vote jury judging, indirect prompt-injection red-teaming, execution-loop detection, and 18 offline tests running in under 1 second.`;
  }

  if (q.includes('ccc') || q.includes('experience') || q.includes('work') || q.includes('cloud computing cell')) {
    return `Tanish is a Machine Learning Developer at the Cloud Computing Cell (CCC), Ajay Kumar Garg Engineering College (October 2026 – Present). He translates practical problem statements into focused machine learning experiments, develops project-oriented ML systems, and collaborates with fellow engineers on technical approaches and model evaluation.`;
  }

  if (q.includes('skill') || q.includes('stack') || q.includes('python') || q.includes('langgraph') || q.includes('pytorch')) {
    return `Tanish's verified core skill stack covers:
• AI & LLM Engineering: LLMs, vLLM, Inference Optimization, INT8/INT4 Quantization, PEFT/LoRA, Transformers
• Agentic AI: LangChain, LangGraph, Multi-Agent Systems, RAG, Tool Calling, MCP, AI Memory
• ML/DL: PyTorch, Scikit-learn, Knowledge Distillation, Computer Vision, NLP
• Backend: FastAPI, Django, REST APIs, JWT, PostgreSQL, MongoDB, Redis, FAISS, ChromaDB
• Languages: Python, C++, C, JavaScript, TypeScript.`;
  }

  if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('phone') || q.includes('reach')) {
    return `You can reach Tanish Kumar directly at tanishrajput673@gmail.com, via LinkedIn at linkedin.com/in/tanish-kumar-61553b385, or on GitHub at github.com/Tanish-o9. He is based in Ghaziabad, Uttar Pradesh, India.`;
  }

  if (q.includes('education') || q.includes('college') || q.includes('akgec') || q.includes('cgpa') || q.includes('leetcode')) {
    return `Tanish is pursuing B.Tech in Computer Science and Engineering (2025–2029) at Ajay Kumar Garg Engineering College (AKGEC), Ghaziabad with an 8.50 CGPA. He has also solved 100+ Data Structures & Algorithms problems on LeetCode using C++.`;
  }

  return `Hello! I'm Tanish's AI Village Companion. Tanish is an AI Engineer specializing in Agentic AI, LLM Inference Optimization, and RAG. You can ask me about QUANTORA, Pramaan.ai, WhyTrace.ai, his ML role at CCC, or technical skills!`;
}

export const AiChatPanel: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      text: "👋 Welcome to Tanish's AI Village! I'm your interactive AI Companion. Ask me anything about Tanish's systems, benchmarks, or engineering experience!",
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    soundEffects.playClick();
    const userMsg: Message = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    setTimeout(() => {
      soundEffects.playDialogueBlip();
      const botReply = getAiResponse(text);
      setMessages((prev) => [...prev, { role: 'bot', text: botReply }]);
    }, 280);
  };

  return (
    <div className="space-y-4">
      {/* Bot Persona Banner */}
      <div className="p-3 bg-white/90 border-2 border-[#3A2A1E] rounded-xl shadow-[0_2px_0_#3A2A1E] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#00F0FF] border-2 border-[#3A2A1E] flex items-center justify-center text-[#3A2A1E] shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-sm text-[#3A2A1E] flex items-center gap-1.5">
              <span>Tanish AI Companion</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-[#4A382B]/80 font-mono">
              Trained on verified resume & engineering projects
            </p>
          </div>
        </div>

        <div className="text-[11px] font-mono font-bold text-[#266F73] bg-[#FFF1D6] px-2.5 py-1 rounded-lg border border-[#3A2A1E]/30 hidden sm:block">
          Offline & Instant
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="h-[360px] p-4 bg-white/60 border-2 border-[#3A2A1E] rounded-xl overflow-y-auto space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-lg border-2 border-[#3A2A1E] flex items-center justify-center shrink-0 ${
                m.role === 'bot' ? 'bg-[#00F0FF] text-[#3A2A1E]' : 'bg-[#F6B73C] text-[#3A2A1E]'
              }`}
            >
              {m.role === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
            </div>

            <div
              className={`p-3 rounded-xl border-2 border-[#3A2A1E] text-xs sm:text-sm leading-relaxed max-w-[85%] whitespace-pre-line shadow-[0_2px_0_#3A2A1E] ${
                m.role === 'bot' ? 'bg-white text-[#3A2A1E]' : 'bg-[#F6B73C] text-[#3A2A1E] font-medium'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {QUICK_QUESTIONS.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(q)}
            className="px-2.5 py-1 bg-[#FFF6E3] hover:bg-[#F6B73C] border border-[#3A2A1E] rounded-full text-[11px] font-bold text-[#3A2A1E] whitespace-nowrap transition-colors flex items-center gap-1 shadow-sm"
          >
            <Sparkles className="w-3 h-3 text-[#266F73]" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Input Field */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(inputVal);
        }}
        className="flex gap-2"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask anything about Tanish's AI work or projects..."
          className="flex-1 px-3.5 py-2.5 bg-white border-2 border-[#3A2A1E] rounded-xl text-xs sm:text-sm text-[#3A2A1E] focus:outline-none focus:ring-2 focus:ring-[#266F73]"
        />
        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="px-4 py-2.5 bg-[#F6B73C] hover:bg-[#ffc652] text-[#3A2A1E] font-bold rounded-xl border-2 border-[#3A2A1E] shadow-[0_3px_0_#3A2A1E] active:translate-y-0.5 active:shadow-none transition-all disabled:opacity-50 flex items-center gap-1 text-xs sm:text-sm"
        >
          <Send className="w-4 h-4" />
          <span>Ask</span>
        </button>
      </form>
    </div>
  );
};
