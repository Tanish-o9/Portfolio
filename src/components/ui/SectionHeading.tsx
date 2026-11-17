import React from 'react';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  titleAccent?: string;
  subtitle?: string;
  note?: string;
  align?: 'left' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  titleAccent,
  subtitle,
  note,
  align = 'left',
  className = '',
}) => {
  const isCenter = align === 'center';

  return (
    <div className={`mb-12 md:mb-16 ${isCenter ? 'text-center mx-auto max-w-2xl' : 'max-w-3xl'} ${className}`}>
      {eyebrow && (
        <div className={`inline-flex items-center gap-2 mb-3 ${isCenter ? 'justify-center' : ''}`}>
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-mono text-xs md:text-[13px] uppercase tracking-[0.12em] text-accent font-semibold">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-[28px] sm:text-3xl md:text-[40px] font-bold text-text tracking-[-0.02em] leading-tight">
        {title}{' '}
        {titleAccent && <span className="text-accent">{titleAccent}</span>}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-text-body leading-relaxed">
          {subtitle}
        </p>
      )}
      {note && (
        <p className="mt-2 text-xs md:text-sm font-mono text-text-muted">
          // {note}
        </p>
      )}
    </div>
  );
};
