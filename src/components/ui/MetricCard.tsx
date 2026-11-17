import React from 'react';

export interface MetricCardProps {
  value: string;
  label: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  label,
  className = '',
}) => {
  return (
    <div
      className={`p-4 rounded-xl bg-card/70 border border-card-border/80 flex flex-col justify-center transition-all duration-200 hover:border-accent/40 hover:bg-card ${className}`}
    >
      <span className="text-xl sm:text-[22px] font-bold text-accent font-mono tracking-tight">
        {value}
      </span>
      <span className="text-xs sm:text-[13px] text-text-muted mt-1 leading-snug">
        {label}
      </span>
    </div>
  );
};
