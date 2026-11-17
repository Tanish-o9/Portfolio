import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'skill' | 'tech' | 'accent' | 'neutral';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'skill',
  className = '',
}) => {
  const baseClasses =
    'inline-flex items-center text-xs transition-colors duration-150 select-none';

  const variantClasses = {
    skill:
      'px-3.5 py-1.5 rounded-full bg-chip-bg text-text-body border border-chip-border hover:border-accent/50 hover:text-text',
    tech:
      'px-2.5 py-1 rounded-[6px] font-mono text-[11px] bg-chip-bg text-accent border border-chip-border',
    accent:
      'px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/30 font-medium',
    neutral:
      'px-3 py-1 rounded-full bg-card text-text-muted border border-card-border font-mono text-[11px]',
  }[variant];

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
};
