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
import { Sparkles, Bot } from 'lucide-react';

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
    <div className="relative w-screen h-screen overflow-hidden bg-[#94CF7A] select-none">
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
      <div className="fixed bottom-6 right-6 md:bottom-[148px] md:right-4 z-30 pointer-events-auto flex flex-col items-end gap-1.5">
        <button
          onClick={() => {
            soundEffects.playClick();
            openPanel('ai-chat');
          }}
          className="group relative flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-[#FFF6E3] to-[#FFFBF2] hover:from-white hover:to-white border-[2.5px] border-[#3A2A1E] rounded-2xl shadow-[0_5px_0_#3A2A1E] text-xs font-extrabold text-[#3A2A1E] transition-all active:translate-y-1 active:shadow-none hover:scale-[1.03]"
          title="Chat with Tanish AI Assistant"
        >
          {/* Animated online status dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>

          <div className="w-6 h-6 rounded-lg bg-[#266F73] text-white flex items-center justify-center border border-[#3A2A1E]/30 shadow-inner group-hover:rotate-6 transition-transform">
            <Bot className="w-3.5 h-3.5" />
          </div>

          <span className="tracking-tight">Ask Tanish AI</span>
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
