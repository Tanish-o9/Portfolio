import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { createGame } from '../game/main';
import { useGameStore } from '../state/gameStore';
import { Hud } from './components/Hud';
import { Minimap } from './components/Minimap';
import { Joystick } from './components/Joystick';
import { PlaceLabels } from './components/PlaceLabels';
import { Modal } from './components/Modal';

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

  const { activePanel, selectedProjectId, closePanel } = useGameStore();

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    // Initialize Phaser game
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
      {/* Phaser Canvas Container */}
      <div
        id="phaser-container"
        ref={containerRef}
        className="w-full h-full flex items-center justify-center"
      />

      {/* Floating Place Labels (Interactive Roof Buttons) */}
      <PlaceLabels />

      {/* HUD Overlays */}
      <Hud />
      <Minimap />
      <Joystick />

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
