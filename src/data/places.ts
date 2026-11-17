export type PanelType =
  | 'about'
  | 'project'
  | 'skills'
  | 'experience'
  | 'education'
  | 'contact'
  | 'resume'
  | 'guestbook'
  | 'terminal'
  | 'ai-chat'
  | 'easter-egg'
  | null;

export interface PlaceZone {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Place {
  id: string;
  name: string;
  label: string;
  panel: PanelType;
  projectId?: string;
  zone: PlaceZone;
  doorPoint: { x: number; y: number };
  roofColor: string;
  description: string;
  externalUrl?: string;
}

export const PLACES: Place[] = [
  {
    id: 'home',
    name: 'Home',
    label: 'Home · About Me',
    panel: 'about',
    zone: { x: 100, y: 90, width: 140, height: 130 },
    doorPoint: { x: 170, y: 228 },
    roofColor: '#2E8A8F',
    description: 'About Tanish Kumar, headline, background & interests.',
  },
  {
    id: 'library',
    name: 'Library',
    label: 'Library · Skills',
    panel: 'skills',
    zone: { x: 570, y: 50, width: 180, height: 140 },
    doorPoint: { x: 660, y: 198 },
    roofColor: '#E8804F',
    description: '7 category bookshelves containing verified technical skills.',
  },
  {
    id: 'cloud-tower',
    name: 'Cloud Tower',
    label: 'CCC Tower · Experience',
    panel: 'experience',
    zone: { x: 1090, y: 20, width: 120, height: 180 },
    doorPoint: { x: 1150, y: 208 },
    roofColor: '#4A78C2',
    description: 'Cloud Computing Cell (CCC) Machine Learning Developer role & contributions.',
  },
  {
    id: 'project-quantora',
    name: 'QUANTORA Lab',
    label: 'QUANTORA · GPU Lab',
    panel: 'project',
    projectId: 'quantora',
    zone: { x: 770, y: 280, width: 90, height: 90 },
    doorPoint: { x: 815, y: 378 },
    roofColor: '#D9503F',
    description: 'LLM Performance & Optimization Engineering Platform.',
  },
  {
    id: 'project-pramaan',
    name: 'Pramaan.ai Booth',
    label: 'Pramaan.ai · Biometrics',
    panel: 'project',
    projectId: 'pramaan-ai',
    zone: { x: 895, y: 280, width: 90, height: 90 },
    doorPoint: { x: 940, y: 378 },
    roofColor: '#7B6BC4',
    description: 'Face + Voice Biometric Attendance & Governance.',
  },
  {
    id: 'project-whytrace',
    name: 'WhyTrace.ai HQ',
    label: 'WhyTrace.ai · Agent Eval',
    panel: 'project',
    projectId: 'whytrace-ai',
    zone: { x: 1020, y: 280, width: 90, height: 90 },
    doorPoint: { x: 1065, y: 378 },
    roofColor: '#D9A441',
    description: 'Interpretability-First Evaluation Harness for Tool-Calling AI Agents.',
  },
  {
    id: 'project-data-engine',
    name: 'LLM Data Engine',
    label: 'LLM Data Engine',
    panel: 'project',
    projectId: 'llm-data-engine',
    zone: { x: 1145, y: 280, width: 90, height: 90 },
    doorPoint: { x: 1190, y: 378 },
    roofColor: '#E8A640',
    description: 'Data quality and fine-tuning pipeline for raw LLM datasets.',
  },
  {
    id: 'project-mini-vlm',
    name: 'Mini VLM Observatory',
    label: 'Mini VLM · Vision',
    panel: 'project',
    projectId: 'mini-vlm',
    zone: { x: 1270, y: 280, width: 90, height: 90 },
    doorPoint: { x: 1315, y: 378 },
    roofColor: '#4A78C2',
    description: 'Lightweight multimodal vision-language model.',
  },
  {
    id: 'guestbook-stand',
    name: 'Town Square Guestbook',
    label: 'Guestbook Stand',
    panel: 'guestbook',
    zone: { x: 580, y: 330, width: 60, height: 60 },
    doorPoint: { x: 610, y: 365 },
    roofColor: '#E0674A',
    description: 'Public visitor guestbook (Supabase).',
  },
  {
    id: 'post-office',
    name: 'Post Office',
    label: 'Post Office · Contact',
    panel: 'contact',
    zone: { x: 390, y: 360, width: 90, height: 85 },
    doorPoint: { x: 440, y: 445 },
    roofColor: '#D9503F',
    description: 'Contact coordinates, email, LinkedIn & direct messaging form.',
  },
  {
    id: 'college',
    name: 'AKGEC College',
    label: 'College · Education',
    panel: 'education',
    zone: { x: 100, y: 610, width: 160, height: 130 },
    doorPoint: { x: 180, y: 748 },
    roofColor: '#4A78C2',
    description: 'B.Tech CSE at AKGEC & verified LeetCode achievements.',
  },
  {
    id: 'notice-board',
    name: 'Resume Pavilion',
    label: 'Resume · ATS CV',
    panel: 'resume',
    zone: { x: 605, y: 655, width: 140, height: 110 },
    doorPoint: { x: 675, y: 772 },
    roofColor: '#F6B73C',
    description: 'ATS-compliant Resume view, highlights & one-click PDF download.',
  },
  {
    id: 'workshop-sign',
    name: 'GitHub Workshop',
    label: 'GitHub Workshop · Terminal',
    panel: 'terminal',
    externalUrl: 'https://github.com/Tanish-o9',
    zone: { x: 960, y: 640, width: 130, height: 110 },
    doorPoint: { x: 1025, y: 758 },
    roofColor: '#3A2A1E',
    description: 'Interactive developer terminal & GitHub open-source repositories.',
  },
  {
    id: 'tanish-ai-npc',
    name: 'Tanish AI Companion',
    label: 'Tanish AI · Chatbot',
    panel: 'ai-chat',
    zone: { x: 660, y: 350, width: 60, height: 60 },
    doorPoint: { x: 685, y: 395 },
    roofColor: '#00F0FF',
    description: 'Ask questions about Tanish, projects, benchmarks, and skills in real time.',
  },
  {
    id: 'secret-chest-1',
    name: 'Secret Chest: GPU Playbook',
    label: '✨ Secret Chest · GPU Playbook',
    panel: 'easter-egg',
    projectId: 'chest-1',
    zone: { x: 55, y: 415, width: 36, height: 36 },
    doorPoint: { x: 70, y: 435 },
    roofColor: '#F6B73C',
    description: "Secret Easter Egg: Tanish's LLM Inference & GPU Optimization Playbook.",
  },
  {
    id: 'secret-chest-2',
    name: 'Secret Chest: Biometric Journey',
    label: '✨ Secret Chest · Biometric Journey',
    panel: 'easter-egg',
    projectId: 'chest-2',
    zone: { x: 1375, y: 175, width: 36, height: 36 },
    doorPoint: { x: 1390, y: 195 },
    roofColor: '#7B6BC4',
    description: "Secret Easter Egg: The engineering story behind Pramaan.ai's 0.942 ROC-AUC.",
  },
  {
    id: 'secret-chest-3',
    name: 'Secret Chest: Founder Mode',
    label: '✨ Secret Chest · Founder Mode',
    panel: 'easter-egg',
    projectId: 'chest-3',
    zone: { x: 865, y: 815, width: 36, height: 36 },
    doorPoint: { x: 880, y: 835 },
    roofColor: '#00F0FF',
    description: 'Secret Easter Egg: Founder Mode & unlock Cyber Gold customizer style.',
  },
];
