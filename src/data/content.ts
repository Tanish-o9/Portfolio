export interface PersonalInfo {
  name: string;
  headline: string;
  location: string;
  phone: string;
  email: string;
  github: string;
  githubUrl: string;
  linkedin: string;
  linkedinUrl: string;
  professionalSummary: string;
}

export interface SkillCategory {
  category: string;
  skills: string[];
}

export interface ExperienceItem {
  role: string;
  organization: string;
  college: string;
  duration: string;
  bullets: string[];
}

export interface FeaturedProject {
  id: string;
  name: string;
  subtitle: string;
  date: string;
  githubUrl: string;
  overview: string;
  features: string[];
  metrics: { value: string; label: string }[];
  technologies: string[];
  benchmarkContext?: string;
  problemStatement?: string;
  architectureNotes?: string[];
  engineeringChallenges?: string[];
  resultsSummary?: string;
}

export interface CompactProject {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
  technologies: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  period: string;
  cgpa: string;
}

export interface AchievementItem {
  title: string;
  description: string;
}

export const resumeContent = {
  personal: {
    name: "Tanish Kumar",
    headline: "AI ENGINEER | AGENTIC AI | LLM INFERENCE & OPTIMIZATION | RAG",
    location: "Ghaziabad, Uttar Pradesh, India",
    phone: "+91 76686 38105",
    email: "tanishrajput673@gmail.com",
    github: "github.com/Tanish-o9",
    githubUrl: "https://github.com/Tanish-o9",
    linkedin: "linkedin.com/in/tanish-kumar-61553b385",
    linkedinUrl: "https://www.linkedin.com/in/tanish-kumar-61553b385/",
    professionalSummary:
      "AI Engineer focused on LLM inference optimization, agentic systems, and practical ML engineering. Built AI systems spanning GPU inference benchmarking, tool-calling agent evaluation, and multimodal biometric verification. Demonstrated 76% peak VRAM reduction through INT4 NF4 quantization, and developed evaluation workflows with measurable model and system metrics. Hands-on with Python, PyTorch, vLLM, PEFT/LoRA, LangGraph, RAG, FastAPI, Django, and React.",
  } as PersonalInfo,

  aboutIntro: [
    "I am an aspiring AI/ML Engineer interested in developing practical intelligent systems using Machine Learning, Deep Learning, Agentic AI, and Large Language Models.",
    "My work focuses on developing AI-powered applications, optimizing LLM inference, designing multi-agent workflows, and exploring the intersection of machine learning and software engineering.",
    "I enjoy transforming complex technical ideas into working systems and continuously experimenting with emerging AI technologies.",
  ],

  technicalSkills: [
    {
      category: "AI & LLM Engineering",
      skills: [
        "LLMs",
        "vLLM",
        "LLM Inference Optimization",
        "Quantization (INT8/INT4)",
        "PEFT/LoRA",
        "Hugging Face Transformers",
      ],
    },
    {
      category: "Agentic AI",
      skills: [
        "LangChain",
        "LangGraph",
        "Multi-Agent Systems",
        "RAG",
        "Tool Calling",
        "MCP",
        "AI Memory",
        "LLM Orchestration",
      ],
    },
    {
      category: "Machine Learning & Deep Learning",
      skills: [
        "Machine Learning",
        "Deep Learning",
        "NLP",
        "PyTorch",
        "Scikit-learn",
        "Knowledge Distillation",
        "Computer Vision",
      ],
    },
    {
      category: "Backend & Frontend",
      skills: [
        "Python",
        "FastAPI",
        "Django",
        "REST APIs",
        "JWT",
        "React",
        "JavaScript",
        "TypeScript",
        "HTML",
        "CSS",
        "Tailwind CSS",
        "Streamlit",
      ],
    },
    {
      category: "Databases & Vector Search",
      skills: [
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "Firebase",
        "SQLite",
        "FAISS",
        "ChromaDB",
        "Supabase",
      ],
    },
    {
      category: "DevOps & Cloud",
      skills: [
        "Docker",
        "GitHub Actions",
        "AWS (EC2, S3)",
        "Vercel",
        "Render",
        "n8n",
      ],
    },
    {
      category: "Programming Languages",
      skills: ["Python", "C", "C++", "JavaScript", "TypeScript"],
    },
  ] as SkillCategory[],

  experience: [
    {
      role: "Machine Learning Developer",
      organization: "Cloud Computing Cell (CCC)",
      college: "Ajay Kumar Garg Engineering College",
      duration: "October 2026 – Present",
      bullets: [
        "Contribute to the Cell's AI/ML initiatives by translating practical problem statements into focused machine learning experiments and implementation tasks.",
        "Apply ML concepts through hands-on experimentation and project-oriented development, evaluating approaches against each problem's requirements.",
        "Coordinate with fellow developers on technical approaches, implementation progress, and sharing findings to support collaborative AI/ML work.",
      ],
    },
  ] as ExperienceItem[],

  featuredProjects: [
    {
      id: "quantora",
      name: "QUANTORA",
      subtitle: "LLM Performance & Optimization Engineering Platform",
      date: "November 2026",
      githubUrl: "https://github.com/Tanish-o9/QUANTORA",
      benchmarkContext: "Qwen2.5-0.5B on RTX 2050 (4 GB)",
      overview:
        "A GPU benchmarking and optimization platform designed to evaluate LLM inference performance across different precision levels, KV-cache configurations, and LoRA settings.",
      problemStatement:
        "Deploying and fine-tuning Large Language Models on resource-constrained consumer GPUs presents critical memory bottlenecks and unpredictable latency. Developers need deterministic empirical data on how precision quantization, KV-cache management, and adapter ranks impact latency, throughput, and memory without sacrificing model perplexity.",
      features: [
        "GPU benchmarking suite measuring 7 key metrics",
        "TTFT (Time-To-First-Token) and TPOT (Time-Per-Output-Token) latency profiler",
        "P95 latency, generation throughput, and peak VRAM tracking",
        "ROUGE-1/2/L and model perplexity quality evaluation",
        "5 precision levels tested: FP32, FP16, BF16, INT8, INT4 (NF4/FP4)",
        "KV-cache policy evaluation (static vs dynamic)",
        "SQLite-backed Pareto-optimal configuration recommender",
        "FastAPI REST API backend and React 19 interactive dashboard",
        "Docker Compose containerization and GitHub Actions CI workflow",
      ],
      metrics: [
        { value: "76%", label: "Peak VRAM Reduction (INT4 NF4)" },
        { value: "1,903 → 458 MB", label: "Peak Memory Footprint" },
        { value: "50%", label: "Memory Reduced (FP16)" },
        { value: "1.19x", label: "KV-Cache Speedup" },
        { value: "7", label: "Benchmarking Metrics" },
        { value: "5", label: "Precision Levels Tested" },
      ],
      technologies: [
        "Python",
        "PyTorch",
        "Transformers",
        "BitsAndBytes",
        "FastAPI",
        "SQLite",
        "React",
        "Docker",
        "GitHub Actions",
      ],
      engineeringChallenges: [
        "Capturing accurate sub-millisecond CUDA event timings without pipeline synchronization stalls.",
        "Deterministic VRAM measurement by isolating CUDA caching allocator fragmentation from actual tensor allocations.",
        "Constructing a multi-objective Pareto frontier scoring algorithm balancing latency, memory, and perplexity degradation.",
      ],
      resultsSummary:
        "Successfully identified optimal deployment configurations for Qwen2.5-0.5B on an RTX 2050 (4 GB), proving that INT4 NF4 quantization drops memory requirements by 76% while KV-cache optimization yields a 1.19x generation speedup.",
    },
    {
      id: "pramaan-ai",
      name: "Pramaan.ai",
      subtitle: "Face + Voice Biometric Attendance and Academic Governance Platform",
      date: "October 2026",
      githubUrl: "https://github.com/Tanish-o9/Pramaan.ai",
      overview:
        "A multimodal biometric platform combining facial recognition, voice verification, liveness detection, and machine learning-based risk prediction.",
      problemStatement:
        "Traditional attendance and academic authentication systems suffer from spoof attacks (photos, recorded audio), high latency, and lack of integrated risk scoring for academic governance.",
      features: [
        "dlib 128-dimensional ResNet face recognition pipeline",
        "Eye Aspect Ratio (EAR) blink-based anti-spoof liveness detection",
        "Resemblyzer 256-dimensional speaker embeddings for voice verification",
        "Multimodal biometric trust engine combining face and voice confidence scores",
        "Machine learning-based academic governance risk-prediction model",
        "Hinglish and English voice-command roll-call automation",
        "JWT-based secure authentication and role-based access control (RBAC)",
        "Rate limiting and IDOR vulnerability checks",
        "88 automated test cases covering authentication and verification pipelines",
        "Dockerized deployment for Render and Railway",
      ],
      metrics: [
        { value: "0.942", label: "ML Model ROC-AUC" },
        { value: "< 0.4%", label: "False Acceptance Rate (FAR)" },
        { value: "88", label: "Automated Tests" },
        { value: "128-D + 256-D", label: "Multimodal Embeddings" },
      ],
      technologies: [
        "Python",
        "OpenCV",
        "dlib",
        "Resemblyzer",
        "Scikit-learn",
        "FastAPI",
        "JWT",
        "Docker",
        "Pytest",
      ],
      engineeringChallenges: [
        "Harmonizing asynchronous webcam video frames and mic audio buffers without race conditions.",
        "Minimizing false rejections caused by varying ambient lighting and classroom acoustic reverberations.",
        "Hardening API endpoints against IDOR and spoofing attacks through cryptographic tokens and biometric thresholding.",
      ],
      resultsSummary:
        "Demonstrated highly reliable student attendance authentication with a False Acceptance Rate below 0.4% and an academic risk-prediction ROC-AUC score of 0.942 across 88 comprehensive automated tests.",
    },
    {
      id: "whytrace-ai",
      name: "WhyTrace.ai",
      subtitle: "Interpretability-First Evaluation Harness for Tool-Calling AI Agents",
      date: "August 2026",
      githubUrl: "https://github.com/Tanish-o9/WhyTrace.ai",
      overview:
        "An agent evaluation and interpretability platform that investigates tool-calling AI agent failures using counterfactual replay, causal failure graphs, and structured testing.",
      problemStatement:
        "Autonomous tool-calling agents frequently fail unpredictably due to tool schema hallucinations, argument mismatch, infinite execution loops, or prompt injection. Existing observability frameworks log traces but lack automated causal failure root-cause attribution and regression generation.",
      features: [
        "14-module automated agent evaluation harness",
        "Counterfactual replay engine for deterministic step-by-step failure reproduction",
        "Causal Failure Graph synthesis isolating root error triggers",
        "Structured 7-category agent failure taxonomy",
        "Majority-vote LLM jury judging mechanism",
        "Indirect prompt-injection red-teaming harness",
        "Redundant tool-call profiler and infinite execution-loop detection",
        "Token and USD cost overhead analysis per trace",
        "GitHub PR-based automated CI evaluation gating",
        "Modular REST collector, Streamlit diagnostic dashboard, and Docker containerization",
        "18 offline tests executing in under 1 second",
      ],
      metrics: [
        { value: "14", label: "Evaluation Modules" },
        { value: "7", label: "Failure Taxonomy Categories" },
        { value: "3", label: "Integration Paths" },
        { value: "18", label: "Offline Tests" },
        { value: "< 1s", label: "Test Suite Execution Time" },
      ],
      technologies: [
        "Python",
        "LangChain",
        "LangGraph",
        "Pytest",
        "Streamlit",
        "Docker",
        "GitHub Actions",
        "REST API",
      ],
      engineeringChallenges: [
        "Deterministic state serialization and counterfactual perturbation across stochastic LLM outputs.",
        "Generating interpretable directed acyclic causal graphs from complex non-linear agent tool traces.",
        "Designing offline unit and integration tests that simulate agent execution loops in under one second without making live external API calls.",
      ],
      resultsSummary:
        "Created an end-to-end interpretability harness that diagnoses agent errors across 7 failure categories, integrates with CI/CD to prevent faulty agents from reaching production, and passes 18 offline tests in under 1 second.",
    },
  ] as FeaturedProject[],

  compactProjects: [
    {
      id: "llm-data-engine",
      name: "LLM Data Engine",
      description:
        "A data quality and fine-tuning pipeline for improving raw LLM training datasets.",
      githubUrl: "https://github.com/Tanish-o9/LLM-Data-Engine",
      technologies: [
        "Python",
        "PyTorch",
        "Transformers",
        "PEFT",
        "DPO",
        "MinHash LSH",
        "Streamlit",
      ],
    },
    {
      id: "mini-vlm",
      name: "Mini Vision-Language Model",
      description:
        "A project exploring vision-language model concepts and multimodal AI development.",
      githubUrl: "https://github.com/Tanish-o9/Mini-Vision-Language-Model",
      technologies: [
        "Python",
        "PyTorch",
        "CLIP ViT-B/32",
        "Qwen2.5",
        "LoRA",
        "FastAPI",
        "React",
      ],
    },
  ] as CompactProject[],

  education: {
    institution: "Ajay Kumar Garg Engineering College (AKGEC)",
    location: "Ghaziabad, Uttar Pradesh, India",
    degree: "B.Tech, Computer Science and Engineering",
    period: "2025 – 2029",
    cgpa: "8.50",
  } as EducationItem,

  achievements: [
    {
      title: "LeetCode Problem Solving",
      description: "Solved 100+ Data Structures and Algorithms problems using C++.",
    },
    {
      title: "Cloud Computing Cell (CCC)",
      description: "Member, Cloud Computing Cell (CCC), AKGEC.",
    },
  ] as AchievementItem[],

  quickHighlights: [
    { value: "100+", label: "LeetCode Problems Solved" },
    { value: "3", label: "Featured AI Projects" },
    { value: "Machine Learning Developer", label: "Cloud Computing Cell (CCC)" },
    { value: "B.Tech CSE", label: "AKGEC (CGPA 8.50)" },
  ],
};
