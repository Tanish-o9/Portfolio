import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/sections/Hero';
import { Highlights } from '../components/sections/Highlights';
import { About } from '../components/sections/About';
import { Skills } from '../components/sections/Skills';
import { Experience } from '../components/sections/Experience';
import { Projects } from '../components/sections/Projects';
import { Education } from '../components/sections/Education';
import { GithubShowcase } from '../components/sections/GithubShowcase';
import { Resume } from '../components/sections/Resume';
import { Contact } from '../components/sections/Contact';
import { useGameStore } from '../state/gameStore';
import { MapPin } from 'lucide-react';

export const ClassicPortfolio: React.FC = () => {
  const { setMode } = useGameStore();

  return (
    <div className="min-h-screen bg-bg text-text selection:bg-accent/20 selection:text-accent font-sans">
      {/* Top Banner to Return to Village */}
      <div className="bg-[#111B2D] border-b border-[#1E2B45] py-2 px-4 text-center text-xs font-mono">
        <button
          onClick={() => setMode('village')}
          className="inline-flex items-center gap-2 text-accent hover:underline font-bold"
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>&larr; Return to Tanish's AI Village (Interactive 2D World)</span>
        </button>
      </div>

      <Navbar />

      <main id="main-content" tabIndex={-1} className="outline-none">
        <Hero />
        <Highlights />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Education />
        <GithubShowcase />
        <Resume />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};
