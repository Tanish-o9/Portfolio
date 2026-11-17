import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGame } from '../game/main';
import { useGameStore } from '../state/gameStore';
import { soundEffects } from '../game/systems/soundEffects';
import { Hud } from './components/Hud';
import { Minimap } from './components/Minimap';
import { Joystick } from './components/Joystick';
import { QuestTracker } from './components/QuestTracker';
import { Modal } from './components/Modal';
import { IntroModal } from './components/IntroModal';
import { Sparkles } from 'lucide-react';

import { AboutPanel } from './panels/AboutPanel';
import { ProjectPanel } from './panels/ProjectPanel';
import { SkillsPanel } from './panels/SkillsPanel';
import { ExperiencePanel } from './panels/ExperiencePanel';
import { EducationPanel } from './panels/EducationPanel';
import { ContactPanel } from './panels/ContactPanel';
import { ResumePanel } from './panels/ResumePanel';
import { GuestbookPanel } from './panels/GuestbookPanel';
import { TerminalPanel } from './panels/TerminalPanel';
import { AiChatPanel } from './panels/AiChatPanel';
import { EasterEggPanel } from './panels/EasterEggPanel';

export const VillageView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  const { activePanel, selectedProjectId, closePanel, season, visitedPlaces, openPanel } = useGameStore();

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const game = createGame(containerRef.current);
    gameRef.current = game;

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);

  // Global Keydown Listener for 'E', 'e', 'Enter', and 'Space'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If a modal dialog is already open, do not intercept
      if (activePanel !== null) return;

      // Do not intercept if user is typing in an input or textarea
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.getAttribute('contenteditable') === 'true')
      ) {
        return;
      }

      if (!activePanel && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        soundEffects.playClick();
        useGameStore.getState().openPanel('ai-chat');
        return;
      }

      if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
        const zone = useGameStore.getState().currentZone;
        if (zone) {
          e.preventDefault();
          if (zone.id.startsWith('secret-chest-')) {
            soundEffects.playChestChime();
          } else {
            soundEffects.playEnter();
          }
          useGameStore.getState().markVisited(zone.id);
          if (zone.panel) {
            useGameStore.getState().openPanel(zone.panel, zone.projectId);
          } else if (zone.externalUrl) {
            window.open(zone.externalUrl, '_blank', 'noopener,noreferrer');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePanel]);

  const getPanelTitle = () => {
    switch (activePanel) {
      case 'about':
        return 'Home: About Tanish';
      case 'project':
        return 'Project Street: Engineering Systems';
      case 'skills':
        return 'Library: Technical Skills';
      case 'experience':
        return 'CCC Tower: Experience';
      case 'education':
        return 'College: Education & Achievements';
      case 'contact':
        return 'Post Office: Contact';
      case 'resume':
        return 'Notice Board: Resume';
      case 'guestbook':
        return 'Town Square Guestbook';
      case 'terminal':
        return 'GitHub Workshop: Interactive Terminal';
      case 'ai-chat':
        return 'Tanish AI Companion';
      case 'easter-egg':
        return 'Village Secret: Golden Chest';
      default:
        return 'Village Place';
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#8AC46E] select-none">
      {/* Intro Modal (One-time screen & sound unlock) */}
      <IntroModal />

      {/* Phaser Canvas Container */}
      <div
        id="phaser-container"
        ref={containerRef}
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
      />

      {/* Day / Sunset / Cyber Night Atmosphere Tint Overlays */}
      {season === 'sunset' && (
        <div className="absolute inset-0 pointer-events-none bg-[#E8804F]/20 mix-blend-multiply z-10" />
      )}
      {season === 'night' && (
        <div className="absolute inset-0 pointer-events-none bg-[#091124]/55 mix-blend-multiply z-10" />
      )}

      {/* HUD Overlays */}
      <Hud />
      <QuestTracker />
      <Minimap />
      <Joystick />

      {/* Floating Quick Action: Tanish AI Assistant - Lower Right Side (Above Minimap) */}
      <div className="fixed bottom-6 right-6 md:bottom-[148px] md:right-4 z-30 pointer-events-auto flex items-center gap-2.5">
        {/* Interactive Speech Balloon / Pill */}
        <button
          onClick={() => {
            soundEffects.playClick();
            openPanel('ai-chat');
          }}
          className="group relative flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-[#FFFDF7] to-[#FFF6E3] hover:from-white hover:to-white border-[2.5px] border-[#261A10] rounded-2xl shadow-[0_4px_0_#261A10] text-[#261A10] transition-all hover:-translate-y-0.5 active:translate-y-1 active:shadow-none"
          title="Chat with Tanish AI Companion (Press C)"
        >
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xs tracking-tight text-[#261A10]">
                Ask Tanish AI
              </span>
              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-400/60 rounded text-[9px] font-black uppercase tracking-wider">
                Active
              </span>
            </div>
            <span className="text-[10px] font-semibold text-[#6B5A4B]">
              LLM · RAG · GPU Optimization
            </span>
          </div>

          {/* Hotkey Pill */}
          <span className="hidden sm:inline-block px-1.5 py-0.5 bg-[#261A10]/10 border border-[#261A10]/30 rounded text-[10px] font-mono font-black text-[#261A10]">
            C
          </span>

          {/* Speech bubble pointer to bot orb */}
          <span className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-l-[8px] border-l-[#261A10]" />
        </button>

        {/* 3D Cyber Bot Companion Avatar Orb */}
        <button
          onClick={() => {
            soundEffects.playClick();
            openPanel('ai-chat');
          }}
          className="group relative w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-gradient-to-br from-[#101F33] via-[#1B3252] to-[#0A1320] border-[2.8px] border-[#261A10] shadow-[0_5px_0_#261A10,0_0_20px_rgba(0,240,255,0.45)] flex items-center justify-center transition-all hover:scale-105 hover:-translate-y-1 active:translate-y-1 active:shadow-none cursor-pointer"
          title="Open Tanish AI Companion (Press C)"
        >
          {/* Pulsing Live Halo Ring */}
          <span className="absolute -inset-1 rounded-2xl border-2 border-[#00F0FF]/40 animate-ping pointer-events-none" />

          {/* Status Online Green Pip */}
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 z-10">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-[#261A10]" />
          </span>

          {/* Cyber Bot Graphic (High-Detail SVG) */}
          <svg
            className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform group-hover:rotate-6 group-hover:scale-110"
            viewBox="0 0 36 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Top Antenna */}
            <line x1="18" y1="2" x2="18" y2="7" stroke="#F6B73C" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="18" cy="2" r="2.5" fill="#00F0FF" stroke="#261A10" strokeWidth="1" />

            {/* Head Shell */}
            <rect x="5" y="7" width="26" height="23" rx="7" fill="#1E293B" stroke="#00F0FF" strokeWidth="1.8" />

            {/* Ear Cups */}
            <rect x="2" y="13" width="3" height="11" rx="1.5" fill="#00F0FF" />
            <rect x="31" y="13" width="3" height="11" rx="1.5" fill="#00F0FF" />

            {/* Glowing Visor Screen */}
            <rect x="8" y="11" width="20" height="13" rx="4" fill="#06121E" stroke="#00F0FF" strokeWidth="1.2" />

            {/* Glowing Visor Eyes (Cyber Sparkles) */}
            <circle cx="13" cy="17.5" r="2.2" fill="#00F0FF" className="animate-pulse" />
            <circle cx="23" cy="17.5" r="2.2" fill="#00F0FF" className="animate-pulse" />
            {/* Cute smiling mouth LED bar */}
            <path d="M15 21 Q18 23 21 21" stroke="#00F0FF" strokeWidth="1.6" strokeLinecap="round" fill="none" />
          </svg>
        </button>
      </div>

      {/* Progress Reward Banner (when all 8 places are visited) */}
      {visitedPlaces.length >= 8 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <div className="bg-[#FFF6E3] border-2 border-[#3A2A1E] px-4 py-2 rounded-2xl shadow-[0_4px_0_#3A2A1E] flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-[#F6B73C]" />
            <span className="text-xs font-bold text-[#3A2A1E]">
              You've seen the whole village!
            </span>
            <button
              onClick={() => openPanel('contact')}
              className="px-2.5 py-1 bg-[#266F73] text-white rounded-lg text-xs font-bold hover:bg-[#2e8a8f]"
            >
              Contact Me &rarr;
            </button>
          </div>
        </div>
      )}

      {/* React Modal Dialogs for All Buildings */}
      <Modal
        isOpen={activePanel !== null}
        onClose={closePanel}
        title={getPanelTitle()}
      >
        {activePanel === 'about' && <AboutPanel />}
        {activePanel === 'project' && (
          <ProjectPanel initialProjectId={selectedProjectId} />
        )}
        {activePanel === 'skills' && <SkillsPanel />}
        {activePanel === 'experience' && <ExperiencePanel />}
        {activePanel === 'education' && <EducationPanel />}
        {activePanel === 'contact' && <ContactPanel />}
        {activePanel === 'resume' && <ResumePanel />}
        {activePanel === 'guestbook' && <GuestbookPanel />}
        {activePanel === 'terminal' && <TerminalPanel />}
        {activePanel === 'ai-chat' && <AiChatPanel />}
        {activePanel === 'easter-egg' && <EasterEggPanel />}
      </Modal>
    </div>
  );
};
