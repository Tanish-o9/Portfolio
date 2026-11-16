import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGame } from '../game/main';
import { useGameStore } from '../state/gameStore';
import { Hud } from './components/Hud';
import { Minimap } from './components/Minimap';
import { Joystick } from './components/Joystick';
import { PlaceLabels } from './components/PlaceLabels';
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
        className="w-full h-full flex items-center justify-center"
      />

      {/* Day / Evening Tint Overlay */}
      {season === 'evening' && (
        <div className="absolute inset-0 pointer-events-none bg-[#7B6BC4]/20 mix-blend-multiply z-10" />
      )}

      {/* Floating Place Labels (Interactive Roof Buttons) */}
      <PlaceLabels />

      {/* HUD Overlays */}
      <Hud />
      <Minimap />
      <Joystick />

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
      </Modal>
    </div>
  );
};
