import React from 'react';
import { Code2, Cpu, Laptop, GraduationCap } from 'lucide-react';

const HIGHLIGHT_CARDS = [
  {
    icon: Code2,
    value: '100+',
    label: 'LeetCode Problems Solved',
    accentColor: 'text-accent',
  },
  {
    icon: Cpu,
    value: '3',
    label: 'Featured AI Projects Built',
    accentColor: 'text-accent-2',
  },
  {
    icon: Laptop,
    value: 'ML Developer',
    label: 'Cloud Computing Cell (CCC), AKGEC',
    accentColor: 'text-accent',
  },
  {
    icon: GraduationCap,
    value: 'B.Tech CSE',
    label: 'AKGEC (CGPA 8.50, 2025–2029)',
    accentColor: 'text-accent-2',
  },
];

export const Highlights: React.FC = () => {
  return (
    <section className="py-8 border-y border-border-separator bg-bg-alt/60">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {HIGHLIGHT_CARDS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-card border border-card-border/80 flex items-start gap-3.5 transition-all duration-200 hover:border-accent/40 hover:bg-card group"
              >
                <div className="w-10 h-10 rounded-lg bg-chip-bg border border-chip-border flex items-center justify-center shrink-0 group-hover:border-accent/50 transition-colors">
                  <Icon className={`w-5 h-5 ${item.accentColor}`} />
                </div>
                <div className="min-w-0">
                  <div className="text-lg sm:text-xl font-bold text-text font-mono tracking-tight leading-tight">
                    {item.value}
                  </div>
                  <div className="text-xs text-text-muted mt-1 leading-snug line-clamp-2">
                    {item.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
