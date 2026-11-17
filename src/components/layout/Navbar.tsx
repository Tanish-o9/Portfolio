import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Menu, X, FileText } from 'lucide-react';
import { resumeContent } from '../../data/content';
import { Button } from '../ui/Button';

interface NavItem {
  name: string;
  href: string;
}

const navItems: NavItem[] = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Experience', href: '#experience' },
  { name: 'Projects', href: '#projects' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.substring(1));
    const handleIntersection: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 h-[72px] transition-all duration-300 ${
        isScrolled
          ? 'bg-bg/90 backdrop-blur-md border-b border-card-border shadow-[0_4px_20px_rgba(0,0,0,0.5)]'
          : 'bg-transparent'
      }`}
    >
      <nav
        className="max-w-[1200px] h-full mx-auto px-4 sm:px-8 flex items-center justify-between"
        aria-label="Main Navigation"
      >
        {/* Left: Brand Monogram & Name */}
        <a
          href="#home"
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-accent rounded-lg p-1"
          aria-label="Tanish Kumar - Back to top"
        >
          <div className="w-9 h-9 rounded-lg bg-chip-bg border border-chip-border flex items-center justify-center font-mono font-bold text-accent group-hover:border-accent transition-colors shadow-sm">
            TK
          </div>
          <span className="font-semibold text-text tracking-tight text-base sm:text-lg group-hover:text-accent transition-colors">
            {resumeContent.personal.name}
          </span>
        </a>

        {/* Center: Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 bg-card/60 p-1.5 rounded-full border border-card-border/60 backdrop-blur-sm">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.substring(1);
            return (
              <a
                key={item.name}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent ${
                  isActive
                    ? 'bg-chip-bg text-accent font-semibold shadow-sm border border-chip-border'
                    : 'text-text-body hover:text-text hover:bg-card-border/40'
                }`}
              >
                {item.name}
              </a>
            );
          })}
        </div>

        {/* Right: Actions (Desktop) */}
        <div className="hidden lg:flex items-center gap-2">
          <Button
            variant="secondary"
            size="compact"
            asLink
            href="/documents/Tanish_Kumar_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View Resume PDF"
          >
            <FileText className="w-4 h-4 mr-1.5 text-accent" />
            Resume
          </Button>

          <a
            href={resumeContent.personal.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 min-w-[40px] rounded-lg border border-secondary-border bg-secondary-btn flex items-center justify-center text-text-body hover:text-text hover:border-accent hover:bg-card transition-all focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="GitHub Profile"
          >
            <Github className="w-4 h-4" />
          </a>

          <a
            href={resumeContent.personal.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 min-w-[40px] rounded-lg border border-secondary-border bg-secondary-btn flex items-center justify-center text-text-body hover:text-text hover:border-accent hover:bg-card transition-all focus:outline-none focus:ring-2 focus:ring-accent"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden w-11 h-11 flex items-center justify-center rounded-lg border border-secondary-border bg-secondary-btn text-text-body hover:text-text focus:outline-none focus:ring-2 focus:ring-accent"
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[72px] bg-bg/95 backdrop-blur-lg border-b border-card-border p-6 shadow-2xl transition-all">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  activeSection === item.href.substring(1)
                    ? 'bg-chip-bg text-accent font-semibold border border-chip-border'
                    : 'text-text-body hover:text-text hover:bg-card'
                }`}
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-card-border flex flex-col gap-3">
            <Button
              variant="secondary"
              size="default"
              asLink
              href="/documents/Tanish_Kumar_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full justify-center"
            >
              <FileText className="w-4 h-4 mr-2 text-accent" />
              Download Resume
            </Button>

            <div className="flex items-center justify-center gap-4 pt-2">
              <a
                href={resumeContent.personal.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-4 flex items-center gap-2 rounded-lg border border-secondary-border bg-secondary-btn text-text-body hover:text-text"
              >
                <Github className="w-4 h-4" />
                <span className="text-sm">GitHub</span>
              </a>
              <a
                href={resumeContent.personal.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-4 flex items-center gap-2 rounded-lg border border-secondary-border bg-secondary-btn text-text-body hover:text-text"
              >
                <Linkedin className="w-4 h-4" />
                <span className="text-sm">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
